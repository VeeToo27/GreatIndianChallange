"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { QUESTIONS } from "@/lib/questions";

type Status = "answering" | "submitting" | "done" | "error";

export default function SurveyPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("answering");
  const [errorMsg, setErrorMsg] = useState("");

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const progress = useMemo(
    () => Math.round(((step + (answers[question?.id] ? 1 : 0)) / QUESTIONS.length) * 100),
    [step, answers, question]
  );

  function choose(option: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: option }));
  }

  async function next() {
    if (!answers[question.id]) return;
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setErrorMsg("Couldn't submit — check your connection and try again.");
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  if (status === "done") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-mist">
            Submitted
          </span>
          <h1 className="font-display text-3xl font-semibold mt-4">
            Thanks — your answers just landed on the live dashboard.
          </h1>
          <div className="waterline my-8" />
          <Link
            href="/dashboard"
            className="card-focus inline-block px-8 py-4 rounded-full bg-jade text-paper font-semibold hover:bg-jadeDeep transition-colors"
          >
            Watch it update live →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col px-6 py-10">
      <div className="max-w-xl w-full mx-auto flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <Link href="/" className="font-mono text-xs uppercase tracking-widest text-mist">
            Rivyou
          </Link>
          <span className="font-mono text-xs text-mist">
            {step + 1} / {QUESTIONS.length}
          </span>
        </div>

        <div className="h-1 w-full bg-sand rounded-full overflow-hidden mb-10">
          <div
            className="h-full bg-jade transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="font-mono text-xs uppercase tracking-[0.2em] text-coral">
          {question.section}
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold mt-3 mb-8 leading-snug">
          {question.text}
        </h1>

        <div className="flex flex-col gap-3">
          {question.options.map((option) => {
            const selected = answers[question.id] === option;
            return (
              <button
                key={option}
                onClick={() => choose(option)}
                className={`card-focus text-left px-5 py-4 rounded-2xl border transition-colors font-medium ${
                  selected
                    ? "border-jade bg-jade/10 text-jadeDeep"
                    : "border-ink/12 hover:border-ink/30"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {status === "error" && (
          <p className="text-coral text-sm mt-4 font-medium">{errorMsg}</p>
        )}

        <div className="flex items-center justify-between mt-10">
          <button
            onClick={back}
            disabled={step === 0}
            className="card-focus font-mono text-sm text-mist disabled:opacity-30 disabled:cursor-not-allowed hover:text-ink transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={next}
            disabled={!answers[question.id] || status === "submitting"}
            className="card-focus px-7 py-3 rounded-full bg-jade text-paper font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-jadeDeep transition-colors"
          >
            {status === "submitting" ? "Submitting…" : isLast ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </main>
  );
}
