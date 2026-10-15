"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Bot, Landmark, Route, Server, Timer, User, Vault } from "lucide-react";

import { SlideFrame, Tag } from "../ui";

const FLOW = [
  {
    icon: User,
    title: "Developer",
    tone: "chain",
    detail: "Signs every on-chain instruction with their own wallet, from the br CLI or the web dashboard. No custodian.",
  },
  {
    icon: Vault,
    title: "USDT Vault",
    tone: "chain",
    detail: "A vault PDA per wallet and mint. Only the owner can withdraw, and only what isn’t reserved by open sessions.",
  },
  {
    icon: Timer,
    title: "Spending Session",
    tone: "chain",
    detail: "Reserves a cap for one relayer, up to 8 allowed models, and a 60 s – 7 day window. The vault’s available balance drops by the cap.",
  },
  {
    icon: Server,
    title: "BlockRouter Relayer",
    tone: "off",
    detail: "OpenAI-compatible gateway. Checks the API key’s session, clamps max_tokens to what the session can afford, holds worst-case cost.",
  },
  {
    icon: Bot,
    title: "AI Provider",
    tone: "off",
    detail: "Upstream model APIs (e.g. DeepSeek, OpenRouter) serve the request. The relayer records the token counts they return.",
  },
  {
    icon: Landmark,
    title: "On-chain Settlement",
    tone: "chain",
    detail: "The relayer submits raw token counts. The program prices them at on-chain rates, pays the provider, and releases the rest.",
  },
] as const;

export function Solution() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % FLOW.length), 2200);
    return () => window.clearInterval(timer);
  }, [auto]);

  const step = FLOW[active];

  return (
    <SlideFrame
      eyebrow="03 · Our solution"
      title={
        <>
          A payment and routing layer between <span className="text-gradient">agents and models</span>
        </>
      }
      lede="Inference happens off-chain where it’s fast. Every rule about money is enforced on-chain, where it can’t be bypassed."
    >
      {/* Pipeline */}
      <div className="card p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:items-stretch lg:gap-0">
          {FLOW.map((item, i) => {
            const isActive = i === active;
            const chain = item.tone === "chain";
            return (
              <div key={item.title} className="flex items-stretch lg:flex-1">
                <button
                  onClick={() => {
                    setAuto(false);
                    setActive(i);
                  }}
                  className={`relative flex h-full w-full flex-col items-start gap-2.5 rounded-xl border p-3.5 text-left transition ${
                    isActive
                      ? chain
                        ? "border-chain/60 bg-chain/[0.09]"
                        : "border-off/60 bg-off/[0.08]"
                      : "border-white/[0.07] bg-white/[0.015] hover:border-white/15"
                  }`}
                  aria-pressed={isActive}
                >
                  <div
                    className={`grid size-10 place-items-center rounded-lg ${
                      chain ? "bg-chain/15 text-chain" : "bg-off/15 text-off"
                    }`}
                  >
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] text-fg-subtle">{String(i + 1).padStart(2, "0")}</p>
                    <p className="text-[15px] font-semibold leading-tight lg:text-base">{item.title}</p>
                  </div>
                  {isActive ? (
                    <motion.span
                      layoutId="flow-active"
                      className={`absolute inset-x-4 -bottom-px h-0.5 rounded-full ${chain ? "bg-chain" : "bg-off"}`}
                    />
                  ) : null}
                </button>
                {i < FLOW.length - 1 ? (
                  <ArrowRight
                    className={`mx-1.5 hidden size-4 shrink-0 self-center transition-colors lg:block ${
                      i < active ? "text-fg-muted" : "text-fg-subtle/50"
                    }`}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex min-h-[56px] flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center">
          <Tag kind={step.tone === "chain" ? "chain" : "off"} />
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-lg leading-relaxed text-fg"
            >
              {step.detail}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Split */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Tag kind="chain" />
            <span className="text-sm text-fg-muted">Solana program enforces</span>
          </div>
          <ul className="space-y-2.5 text-base text-fg">
            {["Who owns and can withdraw funds", "Each session’s maximum spend", "Which models can be billed, at what rate", "Which relayer may settle, and where payouts go"].map(
              (line) => (
                <li key={line} className="flex gap-2.5">
                  <BadgeCheck className="mt-0.5 size-4.5 shrink-0 text-chain" />
                  {line}
                </li>
              ),
            )}
          </ul>
        </div>
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Tag kind="off" />
            <span className="text-sm text-fg-muted">Relayer handles</span>
          </div>
          <ul className="space-y-2.5 text-base text-fg">
            {["Routing prompts to upstream models", "Session-bound API keys", "Holding worst-case cost of in-flight requests", "Counting tokens and triggering settlement"].map((line) => (
              <li key={line} className="flex gap-2.5">
                <Route className="mt-0.5 size-4.5 shrink-0 text-off" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">Why Solana</p>
          <ul className="space-y-3 text-base text-fg-muted">
            <li>
              <span className="font-medium text-fg">PDAs custody funds</span> under program rules. No one holds a private key to
              the vault.
            </li>
            <li>
              <span className="font-medium text-fg">Low fees</span> make one settlement transaction per session practical.
            </li>
            <li>
              <span className="font-medium text-fg">SPL stablecoins</span> (USDC, USDT, Token-2022) give dollar-denominated
              billing.
            </li>
          </ul>
        </div>
      </div>
    </SlideFrame>
  );
}
