import { OpenAIChatMessage, OpenAIConfig } from "./OpenAI.types";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

const endpoint = process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY;
const deploymentName = process.env.NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT_NAME;

if (!apiKey) throw new Error('Azure OpenAI API key is not defined');

export const defaultConfig = {
  model: "gpt-o1",
  temperature: 0.5,
  max_tokens: 4096,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0.6,
};

export type OpenAIRequest = {
  messages: OpenAIChatMessage[];
} & OpenAIConfig;

export const getOpenAICompletion = async (
  token: string,
  payload: OpenAIRequest
) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const response = await fetch(`${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`, {
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  // Check for errors
  if (!response.ok) {
    throw new Error(await response.text());
  }

  let counter = 0;
  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || "";
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of response.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};
