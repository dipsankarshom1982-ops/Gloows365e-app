import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { createHash } from "crypto";
import { getRedis, RK, TTL } from "./redish";
import { checkAskGuruLimit, incrementAskGuruUsage } from "./usageCheck";
import { callGeminiText } from "./gemini";

const db = admin.firestore();
const FREE_ASK_GURU_DAILY = 5;

function setCorsHeaders(res: any): void {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

async function verifyAuthToken(req: any): Promise<string> {
  const authHeader: string = req.headers.authorization ?? "";
  if (!authHeader.startsWith("Bearer ")) throw new Error("UNAUTHENTICATED");
  const token = authHeader.slice(7);
  const decoded = await admin.auth().verifyIdToken(token);
  return decoded.uid;
}

function buildPrompt(
  question: string,
  classLevel: string | number,
  board: string
): string {
  return `You are an expert AI tutor for Indian school students, deeply familiar with ${board} curriculum for Class ${classLevel}.

A student has asked: "${question}"

Answer this question clearly and accurately. Follow these rules:
- Detect the language of the question and respond in the SAME language (Hindi, Bengali, Assamese, Tamil, Telugu, or English).
- If the question is in English, answer in simple friendly English.
- Give the correct factual answer based on Indian school curriculum (${board}).
- Use simple words appropriate for Class ${classLevel}.
- Answer in 3-5 sentences maximum. Be concise but complete.
- Do NOT use markdown, bullet points, or formatting symbols — plain sentences only.
- Do NOT start with "Sure," "Great question!" or "Of course!" — go directly to the answer.
- If the question is off-topic for school curriculum, politely say you can help with school subjects only.

Answer:`;
}

export const askAiGuruQuestion = onRequest(
  {
    timeoutSeconds: 30,
    memory: "256MiB",
    secrets: ["GEMINI_API_KEY", "REDIS_URL", "REDIS_TOKEN"],
  },
  async (req, res) => {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") { res.status(204).send(""); return; }
    if (req.method !== "POST")   { res.status(405).json({ error: "Method not allowed" }); return; }

    let uid = "";
    try {
      uid = await verifyAuthToken(req);
    } catch {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const {
      question   = "",
      classLevel = "10",
      board      = "CBSE",
    } = req.body;

    if (!String(question).trim()) {
      res.status(400).json({ error: "Question is required" });
      return;
    }

    // Usage check
    try {
      await checkAskGuruLimit(uid, db);
    } catch (err: any) {
      const msg: string = err?.message ?? "";
      if (msg.startsWith("FREE_LIMIT_REACHED:")) {
        res.status(429).json({
          error: msg.slice("FREE_LIMIT_REACHED:".length),
          code:  "LIMIT_REACHED",
          limit: FREE_ASK_GURU_DAILY,
        });
      } else {
        res.status(500).json({ error: "Usage check failed" });
      }
      return;
    }

    try {
      const questionStr = String(question).trim();

      // Try Redis cache — if Redis is broken, skip it and go straight to Gemini
      let cached: string | null = null;
      let cacheKey = "";
      let redis;
      try {
        redis = getRedis();
        const cacheHash = createHash("sha256")
          .update(`${questionStr.toLowerCase()}:${classLevel}:${board}`)
          .digest("hex")
          .slice(0, 16);
        cacheKey = RK.askGuruAnswer(cacheHash);
        cached = await redis.get<string>(cacheKey);
      } catch (redisErr: any) {
        console.warn("[AskAiGuru] Redis unavailable, proceeding without cache:", redisErr?.message);
      }

      if (cached) {
        await incrementAskGuruUsage(uid, db);
        const answer = typeof cached === "string" ? cached : JSON.parse(cached as any);
        res.json({ answer });
        return;
      }

      const prompt = buildPrompt(questionStr, classLevel, board);
      const raw    = await callGeminiText(prompt);
      const answer = raw.replace(/^Answer:\s*/i, "").trim();

      // Best-effort cache write — never block the response on Redis
      if (redis && cacheKey) {
        redis.set(cacheKey, answer, { ex: TTL.askGuruAnswer }).catch(() => {});
      }
      await incrementAskGuruUsage(uid, db);

      res.json({ answer });
    } catch (err: any) {
      console.error("[AskAiGuru] error:", err?.message);
      res.status(500).json({ error: "Could not get an answer. Please try again." });
    }
  }
);
