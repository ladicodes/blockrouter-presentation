import type { ComponentType } from "react";

import { Architecture } from "./Architecture";
import { Demo } from "./Demo";
import { DevEx } from "./DevEx";
import { Hero } from "./Hero";
import { Problem } from "./Problem";
import { Scope } from "./Scope";
import { Security } from "./Security";
import { Solution } from "./Solution";
import { Stack } from "./Stack";
import { Team } from "./Team";

export type SlideDef = { id: string; label: string; Component: ComponentType; notes: string[] };

// Speaker notes are short prompts, not a script. Edit freely.
export const SLIDES: SlideDef[] = [
  {
    id: "hero",
    label: "BlockRouter",
    Component: Hero,
    notes: [
      "One line: a capped, on-chain budget for AI agents, billed by the token.",
      "Point at the diagram: teal is off-chain inference, violet is money on Solana.",
      "If the live demo fails, everything in this deck works offline. Press D for the simulation.",
    ],
  },
  {
    id: "problem",
    label: "The problem",
    Component: Problem,
    notes: [
      "Make it personal: who here has given an agent their API key?",
      "Three concerns: spend has no hard ceiling, controls aren’t programmable, budget and usage blur together.",
      "Land on the question in the violet box. That’s what we answer.",
    ],
  },
  {
    id: "solution",
    label: "Our solution",
    Component: Solution,
    notes: [
      "Walk the six boxes left to right (they auto-advance; click to take control).",
      "Key idea: the relayer never sends an amount. It sends token counts and the program prices them.",
      "Why Solana: PDAs custody funds under program rules, and fees are low enough for per-session settlement.",
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    Component: Architecture,
    notes: [
      "Press Play flow, or click 1→7. Each step highlights the accounts it touches.",
      "Click Session PDA to show seeds and fields. Click Config to explain the provider payout lock.",
      "Be explicit about the trust boundary: token counts are relayer-reported, bounded by the cap.",
    ],
  },
  {
    id: "demo",
    label: "Interactive demo",
    Component: Demo,
    notes: [
      "This is a simulation; say so up front. Nothing is signed or broadcast.",
      "Enter advances, Shift+Enter goes back, R resets. Watch Reserved vs Available after opening the session.",
      "At Calculate: the rates are the real devnet rates; the token counts are illustrative.",
      "Close on the last line: 5 budgeted, ~0.90 used, ~4.10 never left the developer’s control.",
    ],
  },
  {
    id: "security",
    label: "Security & controls",
    Component: Security,
    notes: [
      "Left grid: on-chain checks, each with the Anchor error name that enforces it.",
      "Right: relayer policies. These are off-chain and rely on running our relayer code.",
      "Say plainly: tested, not audited.",
    ],
  },
  {
    id: "devex",
    label: "Developer experience",
    Component: DevEx,
    notes: [
      "Click through the eight steps; each one types out the command.",
      "Emphasize: OpenCode needs only a base URL and a key. No SDK changes.",
      "Outputs follow the CLI’s real formats but are not recorded runs.",
    ],
  },
  {
    id: "stack",
    label: "Technical stack",
    Component: Stack,
    notes: [
      "Quick pass: violet dots are on-chain, teal are off-chain.",
      "Mention the Codama-generated client shared by the CLI, relayer, and web.",
    ],
  },
  {
    id: "scope",
    label: "Scope & future work",
    Component: Scope,
    notes: [
      "Be precise about the line between built and planned. Judges appreciate it.",
      "Fee, sponsor vaults, escrow and disputes have state definitions but no instructions yet.",
    ],
  },
  {
    id: "team",
    label: "Team & closing",
    Component: Team,
    notes: [
      "Read the closing line slowly.",
      "Edit src/content/team.ts with contributions before presenting.",
      "Invite questions; press A or D to jump back to Architecture or the Demo.",
    ],
  },
];
