"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, FileJson, Terminal as TerminalIcon } from "lucide-react";

import { SlideFrame, Tag } from "../ui";
import { TERM_STEPS, type TermLine } from "@/content/devex";

const TONE: Record<NonNullable<TermLine["tone"]>, string> = {
  muted: "text-fg-subtle",
  ok: "text-ok",
  chain: "text-chain",
  off: "text-off",
  warn: "text-sim",
};

export function DevEx() {
  const [index, setIndex] = useState(0);
  const step = TERM_STEPS[index];

  return (
    <SlideFrame
      eyebrow="07 · Developer experience"
      title="Eight steps from wallet to withdrawal"
      lede="The br CLI signs on-chain instructions with your keypair. Anything OpenAI-compatible talks to the relayer."
      aside={<Tag kind="illustrative">Representative output</Tag>}
    >
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <ol className="flex flex-col gap-1.5">
          {TERM_STEPS.map((entry, i) => (
            <li key={entry.id}>
              <button
                onClick={() => setIndex(i)}
                aria-current={i === index ? "step" : undefined}
                className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition ${
                  i === index ? "border-white/20 bg-white/[0.06]" : "border-transparent hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-md font-mono text-[11px] font-bold ${
                    entry.kind === "chain" ? "bg-chain/15 text-chain" : entry.kind === "off" ? "bg-off/15 text-off" : "bg-white/10 text-fg-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`flex-1 text-[15px] ${i === index ? "font-medium text-fg" : "text-fg-muted"}`}>{entry.title}</span>
                {i === index ? <ChevronRight className="size-4 text-fg-subtle" /> : null}
              </button>
            </li>
          ))}
        </ol>

        <div className="flex min-w-0 flex-col">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#08080d] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.02] px-4 py-2.5">
              <span className="size-3 rounded-full bg-[#ff5f57]/80" />
              <span className="size-3 rounded-full bg-[#febc2e]/80" />
              <span className="size-3 rounded-full bg-[#28c840]/80" />
              <span className="ml-3 flex items-center gap-1.5 font-mono text-xs text-fg-subtle">
                {step.kind === "file" ? <FileJson className="size-3.5" /> : <TerminalIcon className="size-3.5" />}
                ~/BlockRouter
              </span>
              <span className="ml-auto">
                <Tag kind={step.kind === "chain" ? "chain" : "off"}>{step.kind === "chain" ? "Solana transaction" : step.kind === "file" ? "Config file" : "Relayer HTTP"}</Tag>
              </span>
            </div>
            <div className="min-h-[340px] p-5 font-mono text-[13.5px] leading-[1.7] lg:text-[14.5px]">
              <Typed key={step.id} command={step.command} output={step.output} />
            </div>
          </div>
          {step.note ? <p className="mt-3 px-1 text-sm leading-relaxed text-fg-muted">{step.note}</p> : null}
          <p className="mt-auto px-1 pt-3 text-xs text-fg-subtle">
            Addresses and keys are placeholders. Output formats follow cli/src/commands and the relayer API; these are not
            recorded runs.
          </p>
        </div>
      </div>
    </SlideFrame>
  );
}

function Typed({ command, output }: { command: string; output: TermLine[] }) {
  const [typed, setTyped] = useState(0);
  const done = typed >= command.length;

  useEffect(() => {
    if (done) return;
    const timer = window.setTimeout(() => setTyped((n) => Math.min(command.length, n + 3)), 14);
    return () => window.clearTimeout(timer);
  }, [typed, done, command.length]);

  return (
    <div>
      <p className="whitespace-pre-wrap break-words text-fg">
        <span className="select-none text-off">❯ </span>
        {command.slice(0, typed)}
        {!done ? <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-fg/70" /> : null}
      </p>
      {done ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="mt-2">
          {output.map((line, i) => (
            <p key={i} className={`whitespace-pre-wrap break-words ${line.tone ? TONE[line.tone] : "text-fg-muted"}`}>
              {line.text || " "}
            </p>
          ))}
        </motion.div>
      ) : null}
    </div>
  );
}
