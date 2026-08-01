import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { QUESTIONS } from "@/lib/questions";

export const dynamic = "force-dynamic";

const TOTAL_KEY = "rivyou:total_responses";
const RECENT_KEY = "rivyou:recent_feed";
const COUNTS_PREFIX = "rivyou:counts:"; // + questionId -> hash of option -> count

function countsKey(questionId: string) {
  return `${COUNTS_PREFIX}${questionId}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object" || !body.answers) {
    return NextResponse.json({ error: "Malformed submission." }, { status: 400 });
  }

  const answers: Record<string, string> = body.answers;

  // Validate every answer against the known question/option set.
  for (const q of QUESTIONS) {
    const given = answers[q.id];
    if (!given || !q.options.includes(given)) {
      return NextResponse.json(
        { error: `Missing or invalid answer for "${q.id}".` },
        { status: 400 }
      );
    }
  }

  const pipeline = redis.pipeline();
  for (const q of QUESTIONS) {
    pipeline.hincrby(countsKey(q.id), answers[q.id], 1);
  }
  pipeline.incr(TOTAL_KEY);
  pipeline.lpush(
    RECENT_KEY,
    JSON.stringify({ at: Date.now(), spend: answers["q9_spend"] ?? null })
  );
  pipeline.ltrim(RECENT_KEY, 0, 24);
  await pipeline.exec();

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const pipeline = redis.pipeline();
  pipeline.get<number>(TOTAL_KEY);
  for (const q of QUESTIONS) {
    pipeline.hgetall(countsKey(q.id));
  }
  pipeline.lrange(RECENT_KEY, 0, 24);

  const results = await pipeline.exec<any[]>();
  const total = (results[0] as number) ?? 0;
  const countsResults = results.slice(1, 1 + QUESTIONS.length);
  const recentRaw = (results[1 + QUESTIONS.length] as string[]) ?? [];

  const counts: Record<string, Record<string, number>> = {};
  QUESTIONS.forEach((q, i) => {
    const raw = (countsResults[i] as Record<string, string>) ?? {};
    const parsed: Record<string, number> = {};
    for (const [option, val] of Object.entries(raw)) {
      parsed[option] = Number(val);
    }
    counts[q.id] = parsed;
  });

  const recent = recentRaw
    .map((r) => {
      try {
        return JSON.parse(r);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return NextResponse.json({ total, counts, recent });
}
