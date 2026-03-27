import OpenAI from "openai";

import type { TutorHistoryMsg, TutorResult } from "./tutorTypes";

function systemPrompt(mode?: string, topic?: string): string {
  return `You are an expert, friendly AI Tutor.
Current Learning Mode: ${mode || "General"}.
Current Topic: ${topic || "Language Learning"}.
Style: Use simple analogies, be encouraging, and always end with a small question to check if the student understood.`;
}

/**
 * OpenAI Chat Completions. On failure, returns success: false with an explanatory reply.
 */
export async function generateOpenAITutorReply(params: {
  message: string;
  mode?: string;
  topic?: string;
  conversationHistory?: TutorHistoryMsg[];
}): Promise<TutorResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return {
      success: false,
      reply:
        "OpenAI is selected but OPENAI_API_KEY is missing. Add it to server/.env (from https://platform.openai.com/api-keys ) and restart the backend.",
    };
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const client = new OpenAI({ apiKey });

  const history = params.conversationHistory || [];
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt(params.mode, params.topic) },
    ...history.map((msg): OpenAI.Chat.ChatCompletionMessageParam => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })),
    { role: "user", content: params.message },
  ];

  try {
    const completion = await client.chat.completions.create({
      model,
      messages,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      return {
        success: false,
        reply: "OpenAI returned an empty response. Try again or change OPENAI_MODEL in server/.env.",
      };
    }

    return { success: true, reply: text };
  } catch (err: unknown) {
    console.error("OpenAI Error:", err);

    const status =
      typeof err === "object" && err !== null && "status" in err
        ? Number((err as { status?: number }).status)
        : undefined;
    const msg = err instanceof Error ? err.message : String(err);

    const rateLimited =
      status === 429 || /429|rate limit|too many requests/i.test(msg);

    const keyProblem =
      status === 401 ||
      status === 403 ||
      /invalid api key|incorrect api key|authentication/i.test(msg);

    if (keyProblem) {
      return {
        success: false,
        reply:
          "OpenAI rejected the API key. Create a key at https://platform.openai.com/api-keys , set OPENAI_API_KEY in server/.env, and restart.",
      };
    }

    if (rateLimited) {
      return {
        success: false,
        reply:
          "OpenAI rate limit or quota reached. Wait a bit, check billing/limits on your OpenAI account, or try a cheaper model via OPENAI_MODEL=gpt-4o-mini.",
      };
    }

    return {
      success: false,
      reply:
        "OpenAI request failed. Check the backend terminal for “OpenAI Error” details and verify OPENAI_API_KEY / OPENAI_MODEL.",
    };
  }
}
