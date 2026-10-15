// Simulated scenario for the demo slide. Nothing here touches a network or a wallet.
// Starting balances mirror scripts/seed-devnet.ts (100 mock USDT minted, 25 deposited).
// Token counts are illustrative; rates come from deployments/devnet.json.

import { DEVNET, MODELS, short } from "@/lib/facts";
import { calculateCharge, usdt } from "@/lib/pricing";

export const SCENARIO = {
  walletStart: usdt(75),
  vaultStart: usdt(25),
  deposit: usdt(10),
  cap: usdt(5),
  durationSecs: 86_400,
  relayer: short(DEVNET.relayer),
  models: MODELS,
  /** One request shown in full. */
  firstRequest: {
    model: MODELS[0],
    prompt: "Refactor parseAmount() to reject negative values and add a unit test.",
    promptTokens: 1_840n,
    completionTokens: 620n,
    reply:
      "Updated `parseAmount` to throw on negative input and added a `rejects negative amounts` test case.",
  },
  /** Illustrative totals for a whole coding-agent session (includes the first request). */
  requests: 42,
  usage: [
    { model: MODELS[0], promptTokens: 1_640_000n, completionTokens: 212_000n },
    { model: MODELS[1], promptTokens: 310_000n, completionTokens: 48_000n },
  ],
};

export const USAGE_LINES = SCENARIO.usage.map((line) => ({
  ...line,
  promptCost: line.promptTokens * line.model.promptRate,
  completionCost: line.completionTokens * line.model.completionRate,
  charge: calculateCharge(line.promptTokens, line.completionTokens, line.model),
}));

export const TOTAL_CHARGE = USAGE_LINES.reduce((sum, line) => sum + line.charge, 0n);
export const RELEASED = SCENARIO.cap - TOTAL_CHARGE;

export const FIRST_REQUEST_CHARGE = calculateCharge(
  SCENARIO.firstRequest.promptTokens,
  SCENARIO.firstRequest.completionTokens,
  SCENARIO.firstRequest.model,
);

export type Snapshot = {
  wallet: bigint;
  vault: bigint;
  reserved: bigint;
  provider: bigint;
  session: "none" | "open" | "closed";
  requests: number;
  /** Off-chain: usage the relayer has recorded but not yet settled. */
  pending: bigint;
};

export const STEPS = [
  { id: "start", label: "Start" },
  { id: "deposit", label: "Deposit" },
  { id: "session", label: "Open session" },
  { id: "inference", label: "Run inference" },
  { id: "calculate", label: "Calculate" },
  { id: "settle", label: "Settle" },
  { id: "withdraw", label: "Withdraw" },
] as const;

export function snapshotAt(step: number): Snapshot {
  let s: Snapshot = {
    wallet: SCENARIO.walletStart,
    vault: SCENARIO.vaultStart,
    reserved: 0n,
    provider: 0n,
    session: "none",
    requests: 0,
    pending: 0n,
  };
  if (step >= 1) s = { ...s, wallet: s.wallet - SCENARIO.deposit, vault: s.vault + SCENARIO.deposit };
  if (step >= 2) s = { ...s, reserved: SCENARIO.cap, session: "open" };
  if (step >= 3) s = { ...s, requests: SCENARIO.requests, pending: TOTAL_CHARGE };
  if (step >= 5)
    s = { ...s, vault: s.vault - TOTAL_CHARGE, reserved: 0n, provider: TOTAL_CHARGE, session: "closed", pending: 0n };
  if (step >= 6) s = { ...s, wallet: s.wallet + s.vault, vault: 0n };
  return s;
}
