import OpenAI from "openai"

export function createAIClient() {
  return new OpenAI({
    apiKey: process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY ?? "",
    baseURL:
      process.env.AI_BASE_URL ?? "https://api.openai.com/v1",
  })
}

export const AI_MODEL = process.env.AI_MODEL ?? "gpt-4o-mini"
