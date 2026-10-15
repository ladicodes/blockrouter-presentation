"use client";

import { motion } from "framer-motion";
import { Bot, Boxes, Coins, Cpu, FlaskConical, Layers, LayoutDashboard, Route, Server, Terminal } from "lucide-react";

import { SlideFrame, Tag } from "../ui";

const STACK = [
  { icon: Boxes, name: "Solana", where: "chain", body: "Runs the BlockRouter program; currently deployed to devnet." },
  { icon: Layers, name: "Anchor 1.2 / Rust", where: "chain", body: "The program: 9 instructions, PDA accounts, checked u128 pricing math." },
  { icon: Coins, name: "SPL Token & Token-2022", where: "chain", body: "Vaults hold USDC or mock USDT; transfer-fee mints are rejected at vault creation." },
  { icon: Cpu, name: "TypeScript + @solana/kit", where: "off", body: "A client generated from the IDL with Codama, shared by the CLI, relayer, and web." },
  { icon: Terminal, name: "br CLI", where: "off", body: "Commander-based wallet: vault, session, and API key commands, signed with a local keypair." },
  { icon: Server, name: "Relayer / gateway", where: "off", body: "Hono server with a SQLite ledger: OpenAI-compatible API, holds, and the settlement worker." },
  { icon: Route, name: "OpenRouter", where: "off", body: "Upstream for llama-3.3-70b in the example provider config (deepseek-v3 goes to the DeepSeek API)." },
  { icon: Bot, name: "OpenCode", where: "off", body: "Coding agent configured via opencode.json to use BlockRouter as an OpenAI-compatible provider." },
  { icon: LayoutDashboard, name: "Web dashboard", where: "off", body: "React + Vite app with Wallet Standard: vault, sessions, keys, activity, playground." },
  {
    icon: FlaskConical,
    name: "Local testing",
    where: "off",
    body: "LiteSVM integration tests for the program; local validator for end-to-end runs. Surfpool is referenced in the repo (.gitignore, a chain-clock note).",
  },
] as const;

export function Stack() {
  return (
    <SlideFrame
      eyebrow="08 · Technical stack"
      title="What it’s built with"
      lede="Taken from the repository’s manifests and source, not a wishlist."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {STACK.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.035 }}
            className="card flex flex-col p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`grid size-10 place-items-center rounded-lg ${
                  item.where === "chain" ? "bg-chain/12 text-chain" : "bg-off/12 text-off"
                }`}
              >
                <item.icon className="size-5" />
              </div>
              <span className={`h-1.5 w-1.5 rounded-full ${item.where === "chain" ? "bg-chain" : "bg-off"}`} />
            </div>
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{item.body}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-fg-muted">
        <Tag kind="chain" />
        <Tag kind="off" />
        <span>
          Per the README: 184 program tests (LiteSVM), 113 relayer tests, 25 CLI tests, all run in CI on every pull request.
        </span>
      </div>
    </SlideFrame>
  );
}
