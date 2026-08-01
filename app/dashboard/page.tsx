"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { QUESTIONS } from "@/lib/questions";

type ApiResponse = {
  total: number;
  counts: Record<string, Record<string, number>>;
  recent: { at: number; spend: string | null }[];
};

const POLL_MS = 3000;
const BAR_COLORS = ["#1F6F5C", "#FF6F59", "#8FA39B", "#164E41", "#E7E4D8"];

function timeAgo(ts: number) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
}

export default function DashboardPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [pulse, setPulse] = useState(false);
  const prevTotal = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/responses", { cache: "no-store" });
        const json: ApiResponse = await res.json();
        if (cancelled) return;
        if (prevTotal.current && json.total > prevTotal.current) {
          setPulse(true);
          setTimeout(() => setPulse(false), 600);
        }
        prevTotal.current = json.total;
        setData(json);
      } catch {
        // silent — will retry on next tick
      }
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-mono text-xs uppercase tracking-widest text-mist">
            Rivyou
          </Link>
          <div className="flex items-center gap-2 font-mono text-xs text-mist">
            <span
              className={`h-2 w-2 rounded-full bg-jade ${pulse ? "animate-ping" : ""}`}
            />
            live · updates every {POLL_MS / 1000}s
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-6">
          Live results
        </h1>
        <p className="text-mist mt-2 max-w-xl">
          Say vs. do, tracked in real time as students answer the survey.
        </p>

        <div className="waterline my-8" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <StatCard
            label="Total responses"
            value={data?.total ?? 0}
            highlight
            pulsing={pulse}
          />
          <StatCard
            label="Trust a friend more"
            value={pctFriendTrust(data)}
            suffix="%"
          />
          <StatCard
            label="Never posted a review"
            value={pctNeverPosted(data)}
            suffix="%"
          />
          <StatCard
            label="6+ WhatsApp groups"
            value={pctManyGroups(data)}
            suffix="%"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {QUESTIONS.map((q) => (
            <QuestionCard key={q.id} question={q} counts={data?.counts[q.id]} />
          ))}
        </div>

        <div className="mt-12">
          <h2 className="font-display text-xl font-semibold mb-4">
            Just came in
          </h2>
          <div className="border border-ink/10 rounded-2xl divide-y divide-ink/10 overflow-hidden">
            {(!data || data.recent.length === 0) && (
              <p className="p-5 text-mist text-sm">
                No responses yet — share the survey link to see this fill up.
              </p>
            )}
            {data?.recent.map((r, i) => (
              <div
                key={r.at + i}
                className="flex items-center justify-between px-5 py-3 text-sm"
              >
                <span>New response submitted</span>
                <span className="font-mono text-mist text-xs">
                  {timeAgo(r.at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  suffix = "",
  highlight = false,
  pulsing = false,
}: {
  label: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
  pulsing?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-transform ${
        highlight ? "border-jade bg-jade/5" : "border-ink/10"
      } ${pulsing ? "scale-[1.02]" : ""}`}
    >
      <div className="font-mono text-3xl font-semibold text-ink">
        {value}
        {suffix}
      </div>
      <div className="text-xs text-mist mt-1">{label}</div>
    </div>
  );
}

function QuestionCard({
  question,
  counts,
}: {
  question: (typeof QUESTIONS)[number];
  counts?: Record<string, number>;
}) {
  const chartData = question.options.map((opt) => ({
    name: opt,
    value: counts?.[opt] ?? 0,
  }));
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-2xl border border-ink/10 p-5">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral">
        {question.section}
      </span>
      <h3 className="font-semibold mt-1 mb-4 leading-snug">{question.text}</h3>
      {total === 0 ? (
        <p className="text-mist text-sm">Waiting for first response…</p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(140, chartData.length * 34)}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={130}
              tick={{ fontSize: 12, fill: "#12211C" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v: number) => [`${v} response${v === 1 ? "" : "s"}`, ""]}
              cursor={{ fill: "rgba(31,111,92,0.06)" }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      <div className="text-right font-mono text-xs text-mist mt-1">
        {total} answered
      </div>
    </div>
  );
}

// --- small derived headline stats ---

function pctFriendTrust(data: ApiResponse | null) {
  if (!data) return 0;
  const c = data.counts["q5_peer_vs_review"];
  if (!c) return 0;
  const total = Object.values(c).reduce((a, b) => a + b, 0);
  if (!total) return 0;
  const friendish = (c["My friend, easily"] ?? 0) + (c["Leaning friend"] ?? 0);
  return Math.round((friendish / total) * 100);
}

function pctNeverPosted(data: ApiResponse | null) {
  if (!data) return 0;
  const c = data.counts["q6_has_posted"];
  if (!c) return 0;
  const total = Object.values(c).reduce((a, b) => a + b, 0);
  if (!total) return 0;
  return Math.round(((c["No"] ?? 0) / total) * 100);
}

function pctManyGroups(data: ApiResponse | null) {
  if (!data) return 0;
  const c = data.counts["q8_whatsapp_groups"];
  if (!c) return 0;
  const total = Object.values(c).reduce((a, b) => a + b, 0);
  if (!total) return 0;
  return Math.round(((c["6+"] ?? 0) / total) * 100);
}
