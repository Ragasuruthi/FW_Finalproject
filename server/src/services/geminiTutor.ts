import { GoogleGenerativeAI } from "@google/generative-ai";

import type { TutorHistoryMsg, TutorResult } from "./tutorTypes";

/**
 * Calls Gemini. On failure, still returns a user-visible reply string (success: false).
 */
export async function generateGeminiTutorReply(params: {
  message: string;
  mode?: string;
  topic?: string;
  conversationHistory?: TutorHistoryMsg[];
}): Promise<TutorResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return {
      success: false,
      reply:
        "AI Tutor is not configured: set GEMINI_API_KEY in server/.env (use a Google AI Studio API key that starts with AIzaSy…) and restart the backend.",
    };
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const genAI = new GoogleGenerativeAI(apiKey);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const isQuotaZero = (err: unknown): boolean => {
    const payload = err as { errorDetails?: Array<Record<string, unknown>> | undefined };
    if (!payload.errorDetails || !Array.isArray(payload.errorDetails)) return false;
    return payload.errorDetails.some((item) => {
      return (
        item['@type'] === 'type.googleapis.com/google.rpc.ErrorInfo' &&
        item.metadata?.quota_limit_value === '0'
      );
    });
  };

  try {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: `You are an expert, friendly AI Tutor.
      Current Learning Mode: ${params.mode || "General"}.
      Current Topic: ${params.topic || "Language Learning"}.
      Style: Use simple analogies, be encouraging, and always end with a small question to check if the student understood.`,
        });

        const history = (params.conversationHistory || []).map((msg) => ({
          role: msg.role === "user" ? ("user" as const) : ("model" as const),
          parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(params.message);
        const response = await result.response;
        const text = response.text();
        return { success: true, reply: text };
      } catch (err: unknown) {
        const status =
          typeof err === "object" && err !== null && "status" in err
            ? Number((err as { status?: number }).status)
            : undefined;
        const msg = err instanceof Error ? err.message : String(err);
        const quotaHit =
          status === 429 ||
          /429|quota|RATE_LIMIT|RESOURCE_EXHAUSTED/i.test(msg);

        if (quotaHit) {
          if (isQuotaZero(err)) {
            // Immediate fail if quota is permanently unavailable.
            return {
              success: false,
              reply:
                "The AI service cannot respond right now: your Google Gemini project has no quota or hit a rate limit (often billing or API limits in Google Cloud / AI Studio). Fix quota or billing for Generative Language API, then try again.",
            };
          }

          if (attempt < 3) {
            // transient rate-limit case: retry with backoff.
            await sleep(500 * attempt);
            continue;
          }

          return {
            success: false,
            reply:
              "The AI service cannot respond right now: your Google Gemini project has no quota or hit a rate limit (often billing or API limits in Google Cloud / AI Studio). Fix quota or billing for Generative Language API, then try again.",
          };
        }

        throw err; // non-quota issue
      }
    }

    // Should not get here, but fallback if loop exits unexpectedly
    return {
      success: false,
      reply:
        "The AI service cannot respond right now: your Google Gemini project has no quota or hit a rate limit (often billing or API limits in Google Cloud / AI Studio). Fix quota or billing for Generative Language API, then try again.",
    };
  } catch (err: unknown) {
    console.error("Gemini AI Error:", err);

    const status =
      typeof err === "object" && err !== null && "status" in err
        ? Number((err as { status?: number }).status)
        : undefined;
    const msg = err instanceof Error ? err.message : String(err);

    const quotaHit =
      status === 429 ||
      /429|quota|RATE_LIMIT|RESOURCE_EXHAUSTED/i.test(msg);

    const keyProblem =
      status === 400 ||
      status === 403 ||
      /API key|API_KEY|permission|PERMISSION_DENIED|invalid/i.test(msg);

    if (quotaHit) {
      return {
        success: false,
        reply:
          "The AI service cannot respond right now: your Google Gemini project has no quota or hit a rate limit (often billing or API limits in Google Cloud / AI Studio). Fix quota or billing for Generative Language API, then try again.",
      };
    }

    if (keyProblem) {
      return {
        success: false,
        reply:
          "The Gemini API key looks invalid or not allowed. In Google AI Studio, create a full API key (long string starting with AIzaSy…), put it in server/.env as GEMINI_API_KEY, and restart the server.",
      };
    }

    return {
      success: false,
      reply:
        "The AI tutor hit an unexpected error. Check the backend terminal for “Gemini AI Error” details, verify GEMINI_API_KEY and GEMINI_MODEL in server/.env, then try again.",
    };
  }
}
