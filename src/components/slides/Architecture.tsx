"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileCode2, MousePointerClick, Pause, Play, RotateCcw } from "lucide-react";

import { ArchitectureDiagram, type Selection } from "../diagrams/ArchitectureDiagram";
import { Tag } from "../ui";
import { FLOWS, NODES, type FlowId } from "@/content/architecture";

export function Architecture() {
  const [selection, setSelection] = useState<Selection>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const current = selection?.kind === "flow" ? selection.id : 0;
    const timer = window.setTimeout(() => {
      if (current >= 7) setPlaying(false);
      else setSelection({ kind: "flow", id: (current + 1) as FlowId });
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [playing, selection]);

  const select = (next: Selection) => {
    setPlaying(false);
    setSelection(next);
  };

  const togglePlay = () => {
    if (playing) return setPlaying(false);
    if (selection?.kind !== "flow" || selection.id === 7) setSelection({ kind: "flow", id: 1 });
    setPlaying(true);
  };

  const activeFlow = selection?.kind === "flow" ? selection.id : null;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[88rem] flex-col px-5 py-6 sm:px-8 lg:py-7">
      <header className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-chain">04 · Architecture</p>
          <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">Inference off-chain. Money on-chain.</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tag kind="off" />
          <Tag kind="chain" />
          <span className="ml-1 hidden items-center gap-1.5 text-sm text-fg-subtle md:inline-flex">
            <MousePointerClick className="size-4" /> click any component or step
          </span>
        </div>
      </header>

      {/* Flow selector */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <button
          onClick={togglePlay}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-fg px-3 text-sm font-medium text-ink-950 transition hover:bg-white"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          {playing ? "Pause" : "Play flow"}
        </button>
        {FLOWS.map((flow) => {
          const on = activeFlow === flow.id;
          const chain = flow.zone === "chain";
          return (
            <button
              key={flow.id}
              onClick={() => select(on ? null : { kind: "flow", id: flow.id })}
              aria-pressed={on}
              title={flow.title}
              className={`inline-flex h-9 items-center gap-2 rounded-lg border px-2.5 text-sm transition ${
                on
                  ? chain
                    ? "border-chain/60 bg-chain/15 text-fg"
                    : "border-off/60 bg-off/15 text-fg"
                  : "border-white/10 text-fg-muted hover:border-white/20 hover:text-fg"
              }`}
            >
              <span
                className={`grid size-5 place-items-center rounded-full font-mono text-[11px] font-bold ${
                  chain ? "bg-chain/20 text-chain" : "bg-off/20 text-off"
                }`}
              >
                {flow.id}
              </span>
              {flow.short}
            </button>
          );
        })}
        {selection ? (
          <button
            onClick={() => select(null)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-fg-subtle hover:text-fg"
          >
            <RotateCcw className="size-3.5" /> Clear
          </button>
        ) : null}
      </div>

      <div className="grid flex-1 gap-4 xl:grid-cols-[1fr_380px]">
        <div className="card p-2 sm:p-3">
          <ArchitectureDiagram selection={selection} onSelect={select} />
        </div>
        <div className="card min-h-[260px] p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={selection ? `${selection.kind}-${selection.id}` : "overview"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <DetailPanel selection={selection} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ selection }: { selection: Selection }) {
  if (!selection) {
    return (
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">Overview</p>
        <h3 className="mt-2 text-xl font-semibold">Seven steps, two trust domains</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">
          The developer’s wallet talks to the program directly. The agent only ever talks to the relayer with a
          session-bound key. The relayer can trigger exactly one money movement, settlement, and the program
          decides the amount.
        </p>
        <div className="mt-5 space-y-2 text-[15px]">
          <Legend color="bg-chain" text="Violet: Solana accounts and instructions" />
          <Legend color="bg-off" text="Teal: off-chain HTTP and inference" />
        </div>
        <p className="mt-5 rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 text-sm leading-relaxed text-fg-muted">
          Trust boundary: the relayer is trusted for the token counts it reports and the model that served a
          request. Neither is verified on-chain, so a dishonest relayer can overstate usage only up to the
          session’s cap.
        </p>
      </div>
    );
  }

  if (selection.kind === "flow") {
    const flow = FLOWS.find((f) => f.id === selection.id)!;
    return (
      <div>
        <div className="flex items-center gap-2">
          <span
            className={`grid size-7 place-items-center rounded-full font-mono text-sm font-bold ${
              flow.zone === "chain" ? "bg-chain text-ink-950" : "bg-off text-ink-950"
            }`}
          >
            {flow.id}
          </span>
          <Tag kind={flow.zone} />
        </div>
        <h3 className="mt-3 text-xl font-semibold">{flow.title}</h3>
        {flow.instruction ? (
          <p className="mt-2 break-words font-mono text-[13px] text-chain">{flow.instruction}</p>
        ) : null}
        <p className="mt-1 text-sm text-fg-subtle">Signed by: {flow.signer}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-fg">{flow.summary}</p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-subtle">Checks</p>
        <ul className="mt-2 space-y-1.5">
          {flow.checks.map((check) => (
            <li key={check} className="flex gap-2 text-sm text-fg-muted">
              <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${flow.zone === "chain" ? "bg-chain" : "bg-off"}`} />
              {check}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const node = NODES[selection.id];
  return (
    <div>
      <Tag kind={node.zone} />
      <h3 className="mt-3 text-xl font-semibold">{node.title}</h3>
      <p className="mt-1 text-[15px] text-fg-muted">{node.role}</p>
      {node.seeds ? (
        <p className="mt-3 rounded-md border border-chain/20 bg-chain/[0.06] px-2.5 py-1.5 font-mono text-[12.5px] text-chain">
          seeds = {node.seeds}
        </p>
      ) : null}
      {node.fields ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {node.fields.map((field) => (
            <span key={field} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[11.5px] text-fg-muted">
              {field}
            </span>
          ))}
        </div>
      ) : null}
      <ul className="mt-4 space-y-2">
        {node.points.map((point) => (
          <li key={point} className="flex gap-2 text-sm leading-relaxed text-fg">
            <span className={`mt-2 size-1.5 shrink-0 rounded-full ${node.zone === "chain" ? "bg-chain" : "bg-off"}`} />
            {point}
          </li>
        ))}
      </ul>
      <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-fg-subtle">
        <FileCode2 className="size-3.5" /> {node.source}
      </p>
    </div>
  );
}

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-fg-muted">
      <span className={`h-0.5 w-6 rounded-full ${color}`} />
      {text}
    </div>
  );
}
