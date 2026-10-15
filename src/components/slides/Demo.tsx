"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bot,
  Calculator,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  FlaskConical,
  Landmark,
  Lock,
  RotateCcw,
  Server,
  Timer,
  Wallet,
} from "lucide-react";

import { AnimatedAmount } from "../demo/AnimatedAmount";
import { Code, Tag } from "../ui";
import {
  FIRST_REQUEST_CHARGE,
  RELEASED,
  SCENARIO,
  snapshotAt,
  STEPS,
  TOTAL_CHARGE,
  USAGE_LINES,
} from "@/content/demo";
import { fmtInt, formatUnits, ratePerMillion } from "@/lib/pricing";

const isInteractive = (target: EventTarget | null) =>
  target instanceof HTMLElement && /^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(target.tagName);

export function Demo() {
  const [step, setStep] = useState(0);
  const last = STEPS.length - 1;
  const snap = snapshotAt(step);
  const prev = snapshotAt(Math.max(0, step - 1));

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || isInteractive(event.target)) return;
      if (event.key === "Enter") {
        event.preventDefault();
        setStep((s) => (event.shiftKey ? Math.max(0, s - 1) : Math.min(last, s + 1)));
      } else if (event.key === "r" || event.key === "R") setStep(0);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [last]);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[88rem] flex-col px-5 py-6 sm:px-8 lg:py-7">
      {/* Header */}
      <header className="mb-3 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.2em] text-chain">05 · Interactive payment demo</p>
            <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">One session, start to finish</h2>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-sim/40 bg-sim/10 px-3 py-2 text-sim">
            <FlaskConical className="size-4" />
            <div className="leading-tight">
              <p className="text-sm font-semibold">Simulation mode</p>
              <p className="text-[11px] text-sim/80">No wallet · no network · no transactions sent</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep(0)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-fg-muted transition hover:bg-white/5 hover:text-fg"
          >
            <RotateCcw className="size-4" /> Reset <span className="kbd">R</span>
          </button>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            aria-label="Previous step"
            className="grid size-10 place-items-center rounded-lg border border-white/10 text-fg-muted transition hover:bg-white/5 hover:text-fg disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => setStep((s) => Math.min(last, s + 1))}
            disabled={step === last}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-fg px-4 text-sm font-medium text-ink-950 transition hover:bg-white disabled:opacity-40"
          >
            {step === last ? "Done" : `Next: ${STEPS[step + 1].label}`}
            <ChevronRight className="size-4" />
            <span className="kbd !border-ink-950/20 !bg-ink-950/10 !text-ink-950/70">↵</span>
          </button>
        </div>
      </header>

      {/* Stepper */}
      <ol className="mb-3 grid grid-cols-7 gap-1.5">
        {STEPS.map((entry, i) => (
          <li key={entry.id}>
            <button
              onClick={() => setStep(i)}
              className={`w-full rounded-lg border px-2 py-2 text-left transition ${
                i === step
                  ? "border-chain/60 bg-chain/10"
                  : i < step
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-white/[0.06] hover:border-white/15"
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              <span className={`block font-mono text-[11px] ${i <= step ? "text-chain" : "text-fg-subtle"}`}>
                {i < step ? "✓" : `${i}`}
              </span>
              <span className={`hidden truncate text-[13px] font-medium sm:block ${i <= step ? "text-fg" : "text-fg-subtle"}`}>
                {entry.label}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="grid flex-1 gap-4 lg:grid-cols-[25rem_1fr]">
        {/* Balances */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Balance icon={Wallet} label="Wallet" value={snap.wallet} delta={snap.wallet - prev.wallet} step={step} />
            <Balance icon={Landmark} label="Vault balance" value={snap.vault} delta={snap.vault - prev.vault} step={step} chain />
            <Balance icon={Lock} label="Reserved" value={snap.reserved} delta={snap.reserved - prev.reserved} step={step} chain />
            <Balance
              icon={CircleCheck}
              label="Available"
              value={snap.vault - snap.reserved}
              delta={snap.vault - snap.reserved - (prev.vault - prev.reserved)}
              step={step}
              chain
              highlight
            />
          </div>
          <VaultBar vault={snap.vault} reserved={snap.reserved} />
          <div className="grid grid-cols-2 gap-3">
            <SessionCard status={snap.session} />
            <Balance icon={Bot} label="Provider received" value={snap.provider} delta={snap.provider - prev.provider} step={step} chain />
          </div>
          <div className="card flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Server className="size-4 text-off" />
              <div>
                <p className="text-xs text-fg-muted">Relayer ledger · unsettled</p>
                <p className="font-mono text-sm">
                  {snap.requests} requests · <AnimatedAmount value={snap.pending} /> USDT
                </p>
              </div>
            </div>
            <Tag kind="off" />
          </div>
          <p className="px-1 text-xs leading-relaxed text-fg-subtle">
            Conservation check: wallet + vault + provider ={" "}
            <span className="font-mono text-fg-muted">{formatUnits(snap.wallet + snap.vault + snap.provider)}</span> mock USDT.
          </p>
        </div>

        {/* Step detail */}
        <div className="flex min-w-0 flex-col gap-3">
          <div className="card flex-1 p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                <StepDetail step={step} />
              </motion.div>
            </AnimatePresence>
          </div>
          <TxLog step={step} />
        </div>
      </div>
    </div>
  );
}

function Balance({
  icon: Icon,
  label,
  value,
  delta,
  step,
  chain,
  highlight,
}: {
  icon: typeof Wallet;
  label: string;
  value: bigint;
  delta: bigint;
  step: number;
  chain?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`card relative overflow-hidden px-4 py-3 ${highlight ? "!border-chain/30" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-xs text-fg-muted">
          <Icon className={`size-3.5 ${chain ? "text-chain" : "text-fg-muted"}`} />
          {label}
        </p>
        <AnimatePresence>
          {delta !== 0n && step > 0 ? (
            <motion.span
              key={`${step}-${label}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${delta > 0n ? "bg-ok/10 text-ok" : "bg-danger/10 text-danger"}`}
            >
              {delta > 0n ? "+" : "−"}
              {formatUnits(delta > 0n ? delta : -delta)}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight">
        <AnimatedAmount value={value} />
        <span className="ml-1.5 text-sm font-normal text-fg-subtle">USDT</span>
      </p>
    </div>
  );
}

function VaultBar({ vault, reserved }: { vault: bigint; reserved: bigint }) {
  const scale = Number(SCENARIO.vaultStart + SCENARIO.deposit);
  const availablePct = (Number(vault - reserved) / scale) * 100;
  const reservedPct = (Number(reserved) / scale) * 100;
  return (
    <div className="card px-4 py-3">
      <div className="mb-2 flex items-center justify-between text-xs text-fg-muted">
        <span>Vault composition</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-chain" /> available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-sim" /> reserved
          </span>
        </span>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div className="h-full bg-chain" animate={{ width: `${availablePct}%` }} transition={{ duration: 0.8 }} />
        <motion.div
          className="h-full bg-sim"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, rgb(0 0 0 / .18) 0 4px, transparent 4px 8px)" }}
          animate={{ width: `${reservedPct}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </div>
  );
}

function SessionCard({ status }: { status: "none" | "open" | "closed" }) {
  const styles = {
    none: { text: "No session", sub: "nothing reserved", className: "text-fg-subtle" },
    open: { text: "Open · #0", sub: `cap ${formatUnits(SCENARIO.cap)} · 24h`, className: "text-sim" },
    closed: { text: "Settled · closed", sub: "account closed", className: "text-ok" },
  }[status];
  return (
    <div className="card px-4 py-3">
      <p className="flex items-center gap-1.5 text-xs text-fg-muted">
        <Timer className="size-3.5 text-chain" /> Session PDA
      </p>
      <p className={`mt-1.5 text-lg font-semibold ${styles.className}`}>{styles.text}</p>
      <p className="font-mono text-[11px] text-fg-subtle">{styles.sub}</p>
    </div>
  );
}

/* ---------- Step detail ---------- */

function Heading({ icon: Icon, kind, title, children }: { icon: typeof Wallet; kind: "chain" | "off"; title: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className={`grid size-8 place-items-center rounded-lg ${kind === "chain" ? "bg-chain/15 text-chain" : "bg-off/15 text-off"}`}>
          <Icon className="size-4" />
        </span>
        <Tag kind={kind} />
      </div>
      <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-3xl text-[15px] leading-relaxed text-fg-muted lg:text-base">{children}</p>
    </div>
  );
}

function Mono({ children, tone = "chain" }: { children: ReactNode; tone?: "chain" | "off" | "plain" }) {
  const color = tone === "chain" ? "text-chain" : tone === "off" ? "text-off" : "text-fg";
  return (
    <pre className={`whitespace-pre-wrap break-words rounded-lg border border-white/[0.08] bg-ink-950/80 p-3.5 font-mono text-[12.5px] leading-relaxed ${color}`}>
      {children}
    </pre>
  );
}

function Facts({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k} className="flex flex-col">
          <dt className="text-xs text-fg-subtle">{k}</dt>
          <dd className="text-[15px] text-fg">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function StepDetail({ step }: { step: number }) {
  const f = SCENARIO.firstRequest;
  switch (step) {
    case 0:
      return (
        <>
          <Heading icon={Wallet} kind="chain" title="Starting point">
            A developer wallet holding mock USDT, with a vault that already has 25 in it. This mirrors the repo’s
            seed script, which mints 100 mock USDT to a demo wallet and deposits 25.
          </Heading>
          <Mono tone="plain">{`$ pnpm br vault status
wallet:    75 USDT
balance:   25 USDT
reserved:  0 USDT
available: 25 USDT`}</Mono>
          <p className="mt-4 text-sm text-fg-subtle">
            Press <span className="kbd">Enter</span> or click <b>Next</b> to walk through one session.
          </p>
        </>
      );
    case 1:
      return (
        <>
          <Heading icon={ArrowDownToLine} kind="chain" title="Deposit 10 USDT into the vault">
            Tokens move from the developer’s token account to the vault PDA’s token account. Only the vault owner can
            deposit to or withdraw from it.
          </Heading>
          <Mono>{`deposit(amount: 10_000_000)      // 6 decimals → 10 USDT
signer:   developer wallet (vault.owner)
transfer: user token account → vault token account
state:    vault.balance 25 → 35`}</Mono>
          <div className="mt-4">
            <Facts
              items={[
                ["CLI", <Code key="c">pnpm br vault deposit 10</Code>],
                ["Program checks", "amount > 0 · signer = owner · mint matches"],
              ]}
            />
          </div>
        </>
      );
    case 2:
      return (
        <>
          <Heading icon={Lock} kind="chain" title="Open a session with a 5 USDT cap">
            Reserving isn’t spending. The vault balance stays at 35, but 5 is locked for this session, so only 30 is
            available to withdraw or reserve elsewhere.
          </Heading>
          <Mono>{`open_session(
  session_id:      0,                      // = vault.session_counter
  reserved_amount: 5_000_000,              // cap: 5 USDT
  relayer:         ${SCENARIO.relayer},      // only key allowed to settle
  duration_secs:   86_400,                 // 24h (allowed: 60s – 7d)
  model_ids:       [1, 2],                 // deepseek-v3, llama-3.3-70b
)
state: vault.total_reserved 0 → 5`}</Mono>
          <div className="mt-4">
            <Facts
              items={[
                ["CLI", <Code key="c">br session open --cap 5 --model deepseek-v3,llama-3.3-70b</Code>],
                ["Then, off-chain", <span key="k">create an API key bound to this session: <Code>br key create --name opencode</Code></span>],
              ]}
            />
          </div>
        </>
      );
    case 3:
      return (
        <>
          <Heading icon={Bot} kind="off" title="Run inference through BlockRouter">
            OpenCode calls the relayer like any OpenAI endpoint. The relayer checks the key’s session and model, clamps{" "}
            <Code>max_tokens</Code> to what the session can afford, holds the worst-case cost, and forwards upstream.
            The chain is untouched.
          </Heading>
          <div className="grid gap-3 xl:grid-cols-2">
            <div>
              <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">Request #1</p>
              <Mono tone="off">{`POST /v1/chat/completions
Authorization: Bearer brk_live_••••••••
{
  "model": "${f.model.alias}",
  "messages": [{ "role": "user",
    "content": "${f.prompt}" }]
}`}</Mono>
            </div>
            <div>
              <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
                Response · routed to {f.model.upstreamProvider}
              </p>
              <Mono tone="plain">{`X-BlockRouter-Charge: ${FIRST_REQUEST_CHARGE}   // base units
{
  "choices": [{ "message": { "content":
    "${f.reply.slice(0, 64)}…" } }],
  "usage": { "prompt_tokens": ${fmtInt(f.promptTokens)},
             "completion_tokens": ${f.completionTokens} }
}`}</Mono>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-sim/25 bg-sim/[0.06] px-3.5 py-2.5 text-sm">
            <Tag kind="illustrative" />
            <span className="text-fg-muted">
              The agent keeps working: <b className="text-fg">{SCENARIO.requests} requests</b> across both allowed models,{" "}
              <span className="font-mono text-fg">{formatUnits(TOTAL_CHARGE)} USDT</span> recorded in the relayer ledger.
            </span>
          </div>
        </>
      );
    case 4:
      return (
        <>
          <Heading icon={Calculator} kind="chain" title="Calculate the charge from raw token counts">
            The relayer reports token counts only, never an amount. The program prices each model line with its
            on-chain rates (base units per 1M tokens), rounds down, and rejects the whole settlement if the total
            exceeds the reservation.
          </Heading>
          <Mono tone="plain">{`charge = (prompt_tokens × prompt_rate + completion_tokens × completion_rate) / 1,000,000`}</Mono>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs text-fg-subtle">
                <tr className="border-b border-white/[0.07]">
                  <th className="py-2 font-normal">Model</th>
                  <th className="py-2 text-right font-normal">Prompt tokens × rate</th>
                  <th className="py-2 text-right font-normal">Completion tokens × rate</th>
                  <th className="py-2 text-right font-normal">Charge</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[13px]">
                {USAGE_LINES.map((line) => (
                  <tr key={line.model.id} className="border-b border-white/[0.05]">
                    <td className="py-2.5 font-sans text-fg">
                      {line.model.alias} <span className="text-fg-subtle">#{line.model.id}</span>
                    </td>
                    <td className="py-2.5 text-right text-fg-muted">
                      {fmtInt(line.promptTokens)} × {ratePerMillion(line.model.promptRate)}/M
                    </td>
                    <td className="py-2.5 text-right text-fg-muted">
                      {fmtInt(line.completionTokens)} × {ratePerMillion(line.model.completionRate)}/M
                    </td>
                    <td className="py-2.5 text-right text-fg">{formatUnits(line.charge)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="pt-3 font-sans font-semibold text-fg" colSpan={3}>
                    Total charge
                  </td>
                  <td className="pt-3 text-right text-base font-semibold text-chain">{formatUnits(TOTAL_CHARGE)} USDT</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs text-fg-muted">
              <span>charge ≤ reserved_amount ✓</span>
              <span className="font-mono">
                {formatUnits(TOTAL_CHARGE)} / {formatUnits(SCENARIO.cap)} USDT ({((Number(TOTAL_CHARGE) / Number(SCENARIO.cap)) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full bg-chain"
                initial={{ width: 0 }}
                animate={{ width: `${(Number(TOTAL_CHARGE) / Number(SCENARIO.cap)) * 100}%` }}
                transition={{ duration: 0.9, delay: 0.2 }}
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-fg-subtle">
            Rates from deployments/devnet.json. Token counts are illustrative. Rounding example: request #1 costs
            1,178.8 base units and is billed 1,178.
          </p>
        </>
      );
    case 5:
      return (
        <>
          <Heading icon={Landmark} kind="chain" title="Settle: pay for usage, release the rest">
            One instruction, signed only by the session’s relayer, pays the provider and releases the unused part
            of the reservation. The session account closes, so it can’t be billed twice.
          </Heading>
          <Mono>{`settle_session_usage(usage: [
  { model_id: 1, prompt_tokens: ${fmtInt(USAGE_LINES[0].promptTokens)}, completion_tokens: ${fmtInt(USAGE_LINES[0].completionTokens)} },
  { model_id: 2, prompt_tokens: ${fmtInt(USAGE_LINES[1].promptTokens)},   completion_tokens: ${fmtInt(USAGE_LINES[1].completionTokens)} },
])
signer: ${SCENARIO.relayer} (session.relayer)`}</Mono>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Split label="Reserved" value={SCENARIO.cap} tone="text-sim" />
            <Split label="Paid to provider" value={TOTAL_CHARGE} tone="text-danger" />
            <Split label="Released to available" value={RELEASED} tone="text-ok" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            The relayer settles when the developer closes the session (<Code>POST /v1/session/close</Code>), when usage
            reaches 80% of the cap, or 10 minutes before expiry. If it never settles, the owner calls{" "}
            <Code>reclaim_expired_session</Code> after expiry and gets the entire reservation back.
          </p>
        </>
      );
    default:
      return (
        <>
          <Heading icon={ArrowUpFromLine} kind="chain" title="Withdraw everything available">
            With no open sessions, nothing is reserved, so the developer can withdraw the whole vault balance back to
            their wallet. The program allows at most <Code>balance − total_reserved</Code>.
          </Heading>
          <Mono>{`withdraw(amount: ${fmtInt(SCENARIO.vaultStart + SCENARIO.deposit - TOTAL_CHARGE)})    // ${formatUnits(SCENARIO.vaultStart + SCENARIO.deposit - TOTAL_CHARGE)} USDT
transfer: vault token account → user token account
$ pnpm br vault withdraw all`}</Mono>
          <div className="mt-4 rounded-xl border border-chain/25 bg-chain/[0.07] p-4">
            <p className="text-lg font-medium leading-snug">
              The agent had a <span className="text-chain">{formatUnits(SCENARIO.cap)} USDT</span> budget and used{" "}
              <span className="text-chain">{formatUnits(TOTAL_CHARGE)}</span>. The other{" "}
              <span className="text-ok">{formatUnits(RELEASED)}</span> never left the developer’s control.
            </p>
          </div>
        </>
      );
  }
}

function Split({ label, value, tone }: { label: string; value: bigint; tone: string }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-3">
      <p className="text-xs text-fg-subtle">{label}</p>
      <p className={`mt-1 font-mono text-xl font-semibold ${tone}`}>{formatUnits(value)}</p>
    </div>
  );
}

/* ---------- Simulated transaction log ---------- */

const LOG = [
  { step: 1, kind: "chain", name: "deposit", detail: "vault +10.00" },
  { step: 2, kind: "chain", name: "open_session", detail: "reserved +5.00" },
  { step: 3, kind: "off", name: `${SCENARIO.requests} × chat completion`, detail: "relayer ledger only" },
  { step: 5, kind: "chain", name: "settle_session_usage", detail: `provider +${formatUnits(TOTAL_CHARGE)} · released ${formatUnits(RELEASED)}` },
  { step: 6, kind: "chain", name: "withdraw", detail: `wallet +${formatUnits(SCENARIO.vaultStart + SCENARIO.deposit - TOTAL_CHARGE)}` },
] as const;

function TxLog({ step }: { step: number }) {
  const entries = LOG.filter((entry) => entry.step <= step);
  return (
    <div className="card flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
        Activity <span className="normal-case tracking-normal text-sim">· simulated, not broadcast</span>
      </p>
      {entries.length === 0 ? <p className="text-sm text-fg-subtle">Nothing yet.</p> : null}
      <AnimatePresence initial={false}>
        {entries.map((entry) => (
          <motion.span
            key={entry.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            title={entry.detail}
            className="inline-flex items-center gap-2 font-mono text-[12px]"
          >
            <span className="rounded bg-sim/10 px-1.5 text-[10px] text-sim">SIM</span>
            <span className={entry.kind === "chain" ? "text-chain" : "text-off"}>{entry.name}</span>
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
