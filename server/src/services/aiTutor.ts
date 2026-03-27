import { generateGeminiTutorReply } from "./geminiTutor";
import { generateOpenAITutorReply } from "./openaiTutor";

export type { TutorHistoryMsg, TutorResult } from "./tutorTypes";

/**
 * AI_PROVIDER=gemini | openai (default: gemini)
 * - gemini: GEMINI_API_KEY (+ optional GEMINI_MODEL)
 * - openai: OPENAI_API_KEY (+ optional OPENAI_MODEL, default gpt-4o-mini)
 */
export async function generateTutorReply(
  params: Parameters<typeof generateGeminiTutorReply>[0]
) {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase().trim();

  if (provider === "openai") {
    return generateOpenAITutorReply(params);
  }

  return generateGeminiTutorReply(params);
}
