import OpenAI from "openai";
import { ThreadMessage } from "../models/ThreadMessage";

export async function settleDisagreement(client: OpenAI, messages: ThreadMessage[]): Promise<string> {
  const response = await client.responses.create({
    model: "gpt-4o",
    instructions: `You are here to help settle a disagreement in a slack thread.
          You will receive a series of json objects with two fields, "user" and "text".
          Each object represents a message in the thread.
          Your task is to analyze the messages and try to understand the context of the disagreement,
          and offer your opinion.  Try to land on one side or the other, and explain why you chose that side.
          If you know that neither side is right, say so and explain why.
          When using the names of people in your response, format them for slack by using <@user_id> where user_id is the user field from the json object.
          Here is the conversation history:
          `,
    input: JSON.stringify(messages),
  });

  return response.output_text;
}
