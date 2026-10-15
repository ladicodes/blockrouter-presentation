// Developer workflow for the terminal slide. Commands come from cli/README.md, relayer/README.md and
// web/src/views/Keys.tsx. Output lines follow the CLI's console.log formats; addresses and keys are placeholders.

import { DEVNET, short } from "@/lib/facts";

export type TermLine = { text: string; tone?: "muted" | "ok" | "chain" | "off" | "warn" };

export type TermStep = {
  id: string;
  title: string;
  kind: "chain" | "off" | "file";
  command: string;
  output: TermLine[];
  note?: string;
};

const relayer = short(DEVNET.relayer, 4, 4);
const VAULT = "9xVa…uLt7";
const SESSION = "5eSs…N0p1";

export const TERM_STEPS: TermStep[] = [
  {
    id: "status",
    title: "Check vault balance",
    kind: "chain",
    command: "pnpm br vault status",
    output: [
      { text: "owner:     7dEv…W4ll", tone: "muted" },
      { text: `mint:      ${short(DEVNET.mockUsdtMint)} (USDT)`, tone: "muted" },
      { text: "wallet:    75 USDT" },
      { text: `vault:     ${VAULT}`, tone: "muted" },
      { text: "balance:   25 USDT" },
      { text: "reserved:  0 USDT" },
      { text: "available: 25 USDT", tone: "ok" },
      { text: "sessions:  0 opened", tone: "muted" },
    ],
  },
  {
    id: "deposit",
    title: "Deposit tokens",
    kind: "chain",
    command: "pnpm br vault deposit 10",
    output: [{ text: "deposited 10 USDT. vault balance: 35 USDT", tone: "ok" }],
  },
  {
    id: "open",
    title: "Open a spending session",
    kind: "chain",
    command: "pnpm br session open --cap 5 --model deepseek-v3,llama-3.3-70b --hours 24",
    output: [
      { text: `session opened: ${SESSION}`, tone: "ok" },
      { text: "id:       0" },
      { text: "models:   deepseek-v3 (1), llama-3.3-70b (2)" },
      { text: "cap:      5 USDT" },
      { text: `relayer:  ${relayer}` },
      { text: "expiry:   expires 2026-10-23T14:00:00Z (in 23h 59m)", tone: "muted" },
    ],
  },
  {
    id: "key",
    title: "Create an API key",
    kind: "off",
    command: "pnpm br key create --name opencode",
    output: [
      { text: `key created: key_01 (opencode) for session ${SESSION}`, tone: "ok" },
      { text: "" },
      { text: "  brk_live_••••••••••••••••••••", tone: "warn" },
      { text: "" },
      { text: "This is the only time the key is shown. Store it now. It can spend at most the session's cap.", tone: "muted" },
      { text: "" },
      { text: `  export OPENAI_BASE_URL="${DEVNET.relayerUrl}/v1"`, tone: "off" },
      { text: '  export OPENAI_API_KEY="brk_live_••••"', tone: "off" },
    ],
  },
  {
    id: "opencode",
    title: "Configure OpenCode",
    kind: "file",
    command: "cat opencode.json",
    output: [
      { text: "{" },
      { text: '  "$schema": "https://opencode.ai/config.json",', tone: "muted" },
      { text: '  "provider": {' },
      { text: '    "blockrouter": {', tone: "off" },
      { text: '      "npm": "@ai-sdk/openai-compatible",' },
      { text: '      "name": "BlockRouter",' },
      { text: `      "options": { "baseURL": "${DEVNET.relayerUrl}/v1", "apiKey": "brk_live_••••" },` },
      { text: '      "models": { "deepseek-v3": { "name": "deepseek-v3 via BlockRouter" }, … }' },
      { text: "    }" },
      { text: "  }" },
      { text: "}" },
    ],
    note: "The web dashboard generates this file with the key already inside. Run opencode and pick a BlockRouter model with /models.",
  },
  {
    id: "request",
    title: "Send an AI request",
    kind: "off",
    command: `curl $OPENAI_BASE_URL/chat/completions -H "Authorization: Bearer $OPENAI_API_KEY" \\\n    -d '{"model":"deepseek-v3","messages":[{"role":"user","content":"hello"}]}' -i`,
    output: [
      { text: "HTTP/1.1 200 OK", tone: "ok" },
      { text: `X-BlockRouter-Session: ${SESSION}`, tone: "muted" },
      { text: "X-BlockRouter-Charge: 31", tone: "chain" },
      { text: "X-BlockRouter-Remaining: 4999969", tone: "chain" },
      { text: "" },
      { text: '{ "choices": [{ "message": { "content": "Hello! How can I help?" } }],' },
      { text: '  "usage": { "prompt_tokens": 9, "completion_tokens": 26 } }' },
    ],
    note: "Charge and remaining are in base units (6 decimals): 31 = 0.000031 USDT.",
  },
  {
    id: "settle",
    title: "Settle usage",
    kind: "off",
    command: 'curl -X POST $OPENAI_BASE_URL/session/close -H "Authorization: Bearer $OPENAI_API_KEY"',
    output: [
      { text: "HTTP/1.1 202 Accepted", tone: "ok" },
      { text: `{ "session": "${SESSION}", "closing": true, "settle_within_secs": 15 }` },
      { text: "" },
      { text: "# relayer worker → settle_session_usage(raw token counts) on-chain", tone: "chain" },
    ],
    note: "No CLI command is needed: the relayer submits the settlement transaction. It also settles automatically at 80% of the cap or 10 minutes before expiry.",
  },
  {
    id: "withdraw",
    title: "Withdraw remaining funds",
    kind: "chain",
    command: "pnpm br vault withdraw all",
    output: [{ text: "withdrew 34.999969 USDT. vault balance: 0 USDT", tone: "ok" }],
    note: "all = everything not reserved by an open session.",
  },
];
