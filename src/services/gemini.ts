// ================================================================
// services/gemini.ts — VERSI CLOUDFLARE
// Panggil Worker, bukan Gemini langsung. API key aman di server.
// ================================================================

// 👇 Ganti dengan URL Worker kamu setelah deploy
const WORKER_URL = "https://threadgen.ryantrega99.workers.dev";

export interface ThreadParams {
  topic: string;
}

export async function generateThread(params: ThreadParams): Promise<string[]> {
  const accessCode = localStorage.getItem("threadgen_access_code") || "";

  const res = await fetch(`${WORKER_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Access-Code": accessCode,
    },
    body: JSON.stringify({ topic: params.topic }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Terjadi kesalahan server.");
  }

  return data.tweets as string[];
}

export async function verifyAccessCode(code: string): Promise<boolean> {
  const res = await fetch(`${WORKER_URL}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  const data = await res.json();
  return data.valid === true;
}

export async function getHistory(): Promise<any[]> {
  const accessCode = localStorage.getItem("threadgen_access_code") || "";

  const res = await fetch(`${WORKER_URL}/history`, {
    headers: { "X-Access-Code": accessCode },
  });

  const data = await res.json();
  return data.history || [];
}