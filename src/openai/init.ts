import OpenAI from "openai";

export function openAIInit(): OpenAI {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}
