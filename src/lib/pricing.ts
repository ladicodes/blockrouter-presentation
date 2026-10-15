import { USDT_DECIMALS, type ModelInfo } from "./facts";

const RATE_DENOMINATOR = 1_000_000n;
export const UNIT = 10n ** BigInt(USDT_DECIMALS);

/** Mirrors programs/blockrouter/src/utils/charge.rs: combine both costs, then round down. */
export function calculateCharge(
  promptTokens: bigint,
  completionTokens: bigint,
  model: Pick<ModelInfo, "promptRate" | "completionRate">,
): bigint {
  return (promptTokens * model.promptRate + completionTokens * model.completionRate) / RATE_DENOMINATOR;
}

/** Formats base units as a decimal token amount, e.g. 896820n -> "0.89682". */
export function formatUnits(amount: bigint, { trim = true, min = 2 } = {}): string {
  const negative = amount < 0n;
  const abs = negative ? -amount : amount;
  const whole = abs / UNIT;
  let frac = (abs % UNIT).toString().padStart(USDT_DECIMALS, "0");
  if (trim) {
    frac = frac.replace(/0+$/, "");
    if (frac.length < min) frac = frac.padEnd(min, "0");
  }
  const wholeText = whole.toLocaleString("en-US");
  return `${negative ? "-" : ""}${wholeText}${frac ? `.${frac}` : ""}`;
}

export const usdt = (whole: number) => BigInt(Math.round(whole * 1_000_000)) * (UNIT / 1_000_000n);

/** Display rate per million tokens in dollars, e.g. 270000 -> "$0.27". */
export const ratePerMillion = (rate: bigint) => `$${formatUnits(rate)}`;

export const fmtInt = (n: bigint | number) => n.toLocaleString("en-US");
