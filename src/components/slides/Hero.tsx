"use client";

import { motion } from "framer-motion";
import { ArrowRight, Network, PlayCircle } from "lucide-react";

import { useDeck } from "../deck-context";
import { HeroFlow } from "../diagrams/HeroFlow";
import { DEVNET, short } from "@/lib/facts";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  const { goTo } = useDeck();
  return (
    <div className="mx-auto grid min-h-full w-full max-w-[83rem] items-center gap-10 px-5 py-10 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      <div>
        <motion.div {...rise(0)} className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-fg-muted">
            Turbin3 · Solana capstone
          </span>
          <span className="rounded-full border border-chain/30 bg-chain/10 px-3 py-1 font-mono text-xs text-chain">
            devnet · {short(DEVNET.programId)}
          </span>
        </motion.div>
        <motion.h1 {...rise(0.05)} className="text-6xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
          BlockRouter
        </motion.h1>
        <motion.p {...rise(0.1)} className="text-gradient mt-4 text-2xl font-medium tracking-tight sm:text-3xl lg:text-[2.1rem] lg:leading-tight">
          Programmable Payments for AI Inference on Solana
        </motion.p>
        <motion.p {...rise(0.15)} className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted lg:text-xl">
          Lock a capped stablecoin budget into an on-chain session, point your AI agent at an OpenAI-compatible
          endpoint, and pay only for the tokens it actually uses. Whatever the session does not spend returns
          to your vault.
        </motion.p>
        <motion.div {...rise(0.2)} className="mt-9 flex flex-wrap gap-3">
          <button
            onClick={() => goTo("architecture")}
            className="group inline-flex h-12 items-center gap-2 rounded-xl bg-fg px-5 font-medium text-ink-950 transition hover:bg-white"
          >
            <Network className="size-4" />
            Explore Architecture
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => goTo("demo")}
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 font-medium text-fg transition hover:bg-white/[0.08]"
          >
            <PlayCircle className="size-4 text-off" />
            Launch Demo
          </button>
        </motion.div>
        <motion.dl {...rise(0.28)} className="mt-11 grid max-w-xl grid-cols-3 gap-4 border-t border-white/[0.07] pt-6">
          {[
            ["9", "program instructions"],
            ["4", "PDA account types"],
            ["0", "amounts sent by the relayer"],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="text-3xl font-semibold tabular-nums">{value}</dt>
              <dd className="mt-1 text-sm text-fg-muted">{label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="card p-4 sm:p-6"
      >
        <HeroFlow />
      </motion.div>
    </div>
  );
}
