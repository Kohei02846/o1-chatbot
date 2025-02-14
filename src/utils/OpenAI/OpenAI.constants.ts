import { OpenAIModel } from "./OpenAI.types";

export const OpenAIChatModels: Record<string, OpenAIModel> = {
  "gpt-4o": {
    id: "gpt-4o",
    name: "GPT-4O",
    maxLimit: 4096,
  },
};
