"use client";

import { motion } from "framer-motion";
import {
  Ban,
  Clock,
  Coins,
  DoorOpen,
  Gauge,
  KeyRound,
  ListChecks,
  Lock,
  ShieldAlert,
  Signature,
  TrendingUp,
  UserCheck,
} from "lucide-react";

import { SlideFrame, Tag } from "../ui";

const ON_CHAIN = [
  {
    icon: Gauge,
    title: "Session spending cap",
    body: "Charge is computed on-chain and must be ≤ session.reserved_amount before any transfer.",
    error: "ChargeExceedsReservation",
  },
  {
    icon: ListChecks,
    title: "Allowed models",
    body: "1–8 distinct, active models per session. Settlement lines for any other model are rejected.",
    error: "SessionModelMismatch",
  },
  {
    icon: Clock,
    title: "Session expiration",
    body: "60 s – 7 days. Settlement is refused after expiry; reclaim is refused before it.",
    error: "SessionExpired",
  },
  {
    icon: Signature,
    title: "Relayer authorization",
    body: "Only the relayer key recorded in the session can settle it.",
    error: "UnauthorizedRelayer",
  },
  {
    icon: UserCheck,
    title: "Vault ownership",
    body: "Vault PDA seeded by owner + mint. Deposit, withdraw, open, and reclaim require the owner’s signature.",
    error: "Unauthorized",
  },
  {
    icon: Lock,
    title: "Reserved vs available",
    body: "balance ≥ total_reserved always. Withdrawals and new sessions can only use the difference.",
    error: "ExceedsUnreservedBalance",
  },
  {
    icon: Coins,
    title: "Settlement constraints",
    body: "Raw token counts in, price from Model PDAs, payout only to config.provider’s ATA, session closed after.",
    error: "UnauthorizedProvider",
  },
  {
    icon: TrendingUp,
    title: "Timelocked price increases",
    body: "Price cuts apply now; increases wait out the Config timelock (1 h on devnet).",
    error: "price_timelock_secs",
  },
];

const OFF_CHAIN = [
  { icon: KeyRound, text: "Keys bound to one session; a leaked key is capped." },
  { icon: Gauge, text: "max_tokens clamped; worst-case cost held in flight." },
  { icon: Ban, text: "Rate limits per key and session (60/min default)." },
  { icon: Signature, text: "Wallet-signed key management (5-minute window)." },
  { icon: ShieldAlert, text: "Prompts never logged; secrets redacted from errors." },
];

export function Security() {
  return (
    <SlideFrame
      eyebrow="06 · Security & spending controls"
      title="What’s enforced, and what’s trusted"
      aside={
        <div className="flex flex-wrap gap-2">
          <Tag kind="chain">On-chain: can’t be bypassed</Tag>
          <Tag kind="off">Off-chain: relayer policy</Tag>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {ON_CHAIN.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="card flex flex-col p-4"
          >
            <div className="mb-2.5 flex items-center gap-2.5">
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-chain/12 text-chain">
                <item.icon className="size-4" />
              </div>
              <h3 className="font-semibold leading-tight">{item.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-fg-muted">{item.body}</p>
            <p className="mt-auto truncate pt-2 font-mono text-[11px] text-chain/80">{item.error}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_1fr_1fr]">
        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Tag kind="off" />
            <span className="text-sm text-fg-muted">Relayer controls</span>
          </div>
          <ul className="space-y-1.5">
            {OFF_CHAIN.map((item) => (
              <li key={item.text} className="flex gap-3 text-sm leading-relaxed">
                <item.icon className="mt-0.5 size-4 shrink-0 text-off" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <div className="mb-2 flex items-center gap-2">
            <DoorOpen className="size-4 text-ok" />
            <h3 className="font-semibold">Exit paths always work</h3>
          </div>
          <p className="text-sm leading-relaxed text-fg-muted">
            withdraw and reclaim take no Config account, so pausing can never trap funds; it only blocks new
            sessions. If the relayer disappears, the owner reclaims the full reservation after expiry.
          </p>
        </div>
        <div className="rounded-2xl border border-sim/30 bg-sim/[0.06] p-5">
          <h3 className="flex items-center gap-2 font-semibold text-sim">
            <ShieldAlert className="size-4" /> Trust boundary &amp; status
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            Token counts and the serving model are relayer-reported and not verified on-chain, so overstatement is
            bounded by the session cap. Tested (184 LiteSVM program tests per the README), but{" "}
            <b className="text-fg">not formally audited</b>.
          </p>
        </div>
      </div>
    </SlideFrame>
  );
}
