"use client";

import { motion } from "framer-motion";
import { Bot, CreditCard, Flame, KeyRound, Scale, SlidersHorizontal } from "lucide-react";

import { SlideFrame } from "../ui";

const CONCERNS = [
  {
    icon: Flame,
    title: "Uncontrolled AI spending",
    body: "An agent in a retry loop, or a leaked key, keeps calling paid models. Nothing in the key itself says “stop at $5”.",
  },
  {
    icon: SlidersHorizontal,
    title: "Few programmable controls",
    body: "Provider dashboards offer coarse limits at best. You can’t say “these two models, this relayer, for 24 hours” and have it enforced.",
  },
  {
    icon: Scale,
    title: "Budget ≠ consumption",
    body: "Prepaid credits are spent up front and are typically non-refundable. What you authorized and what you actually used are hard to separate.",
  },
];

export function Problem() {
  return (
    <SlideFrame
      eyebrow="02 · The problem"
      title={
        <>
          Your agent needs paid models.
          <br className="hidden sm:block" />
          <span className="text-fg-muted"> Does it need your wallet?</span>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="card flex flex-col gap-4 p-6"
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">A familiar story</p>
          <Step icon={Bot} title="You build an AI coding agent">
            It plans, edits files, and calls a frontier model dozens of times per task.
          </Step>
          <Step icon={KeyRound} title="It needs credentials to pay">
            Today that means an API key tied to your account, a card on file, or a prepaid credit balance.
          </Step>
          <Step icon={CreditCard} title="The key is effectively a blank cheque">
            Whoever holds it can spend until the account runs dry, and there is no on-chain record of what was
            authorized versus what was consumed.
          </Step>
          <div className="mt-auto rounded-xl border border-chain/25 bg-chain/[0.07] p-5">
            <p className="text-xl font-medium leading-snug text-balance">
              How do you authorize an agent to spend <span className="text-chain">a bounded amount</span>, on{" "}
              <span className="text-chain">approved models</span>, for <span className="text-chain">a limited time</span>,
              without handing it your funds?
            </p>
          </div>
        </motion.div>

        <div className="grid gap-4">
          {CONCERNS.map((concern, i) => (
            <motion.div
              key={concern.title}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
              className="card flex gap-5 p-5"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-danger/25 bg-danger/10 text-danger">
                <concern.icon className="size-5" />
              </div>
              <div>
                <p className="font-mono text-xs text-fg-subtle">0{i + 1}</p>
                <h3 className="mt-0.5 text-xl font-semibold lg:text-2xl">{concern.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-fg-muted lg:text-lg">{concern.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

function Step({ icon: Icon, title, children }: { icon: typeof Bot; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-fg-muted">
        <Icon className="size-4.5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-base leading-relaxed text-fg-muted">{children}</p>
      </div>
    </div>
  );
}
