"use client";

import { CircleDashed, CircleCheck, Compass, FlaskConical } from "lucide-react";

import { SlideFrame } from "../ui";

const COLUMNS = [
  {
    title: "Implemented",
    sub: "in the repository today",
    icon: CircleCheck,
    accent: "text-ok",
    border: "!border-ok/25",
    items: [
      "Program: vaults, capped sessions, on-chain pricing, settle, reclaim, withdraw",
      "Timelocked price increases; Token-2022 support",
      "OpenAI-compatible relayer with streaming, keys, holds, auto-settlement",
      "br CLI and web dashboard",
      "Devnet: program, mock USDT, relayer, two models",
      "Program, relayer, and CLI tests in CI",
    ],
  },
  {
    title: "Simulated in this deck",
    sub: "for a reliable live presentation",
    icon: FlaskConical,
    accent: "text-sim",
    border: "!border-sim/30",
    items: [
      "The payment demo: in-browser, mock balances",
      "Token counts are illustrative; rates are real devnet rates",
      "Terminal output: representative, placeholder addresses",
    ],
  },
  {
    title: "Not built yet",
    sub: "state or config exists, no instructions",
    icon: CircleDashed,
    accent: "text-fg-muted",
    border: "!border-white/15",
    items: [
      "Protocol fee (fee_bps stored, not deducted)",
      "Sponsor vaults with delegated allowances",
      "Settlement escrow and disputes",
      "Instruction to toggle the pause flag",
    ],
  },
  {
    title: "Future directions",
    sub: "where we’d take it next",
    icon: Compass,
    accent: "text-chain",
    border: "!border-chain/25",
    items: [
      "More upstream AI providers and models",
      "Broader agent and IDE integrations beyond OpenCode",
      "Relayer reliability: redundancy, monitoring",
      "Reducing trust in relayer-reported usage",
      "Security audit before any mainnet deployment",
    ],
  },
];

export function Scope() {
  return (
    <SlideFrame eyebrow="09 · Scope & future work" title="What’s real, what’s simulated, what’s next">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((column) => (
          <div key={column.title} className={`card flex flex-col p-5 ${column.border}`}>
            <column.icon className={`size-6 ${column.accent}`} />
            <h3 className="mt-3 text-xl font-semibold">{column.title}</h3>
            <p className="text-sm text-fg-subtle">{column.sub}</p>
            <ul className="mt-4 space-y-2">
              {column.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-fg">
                  <span className={`mt-2.5 size-1.5 shrink-0 rounded-full bg-current ${column.accent}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SlideFrame>
  );
}
