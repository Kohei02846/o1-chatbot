import { OpenAIModel } from "./OpenAI.types";

export const OpenAIChatModels: Record<string, OpenAIModel> = {
  "gpt-o1": {
    id: "gpt-o1",
    name: "GPT-O1",
    maxLimit: 4096,
  },
};
