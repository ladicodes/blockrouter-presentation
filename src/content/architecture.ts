// Architecture nodes and flows. Seeds, fields, and checks follow programs/blockrouter/src.

export type Zone = "off" | "chain";

export type NodeId =
  | "wallet"
  | "agent"
  | "relayer"
  | "provider"
  | "program"
  | "vault"
  | "session"
  | "model"
  | "config"
  | "providerAta";

export type ArchNode = {
  id: NodeId;
  title: string;
  sub: string;
  zone: Zone;
  /** Short role, shown as the panel heading line. */
  role: string;
  seeds?: string;
  fields?: string[];
  points: string[];
  source: string;
};

export const NODES: Record<NodeId, ArchNode> = {
  wallet: {
    id: "wallet",
    title: "Developer wallet + CLI",
    sub: "br CLI · web dashboard",
    zone: "off",
    role: "Signs every instruction that moves the developer’s funds.",
    points: [
      "Signs deposit, withdraw, open_session and reclaim_expired_session, from the br CLI (Solana keypair file) or the web dashboard (Wallet Standard).",
      "Creates session-bound API keys with a wallet-signed request to the relayer (Ed25519 over method, path, timestamp).",
      "The CLI only reads an existing keypair and never prints key material.",
    ],
    source: "cli/ · web/",
  },
  agent: {
    id: "agent",
    title: "AI agent",
    sub: "OpenCode · any OpenAI client",
    zone: "off",
    role: "Consumes inference. Never touches funds.",
    points: [
      "Points an OpenAI-compatible client at the relayer’s /v1 base URL. OpenCode is configured via an opencode.json provider block.",
      "Holds only a brk_live_… API key bound to one session, so a leaked key can spend at most that session’s cap.",
    ],
    source: "web/src/views/Keys.tsx",
  },
  relayer: {
    id: "relayer",
    title: "BlockRouter relayer",
    sub: "Hono · SQLite usage ledger",
    zone: "off",
    role: "OpenAI-compatible gateway and settlement worker.",
    points: [
      "Per request: resolves key → session, checks the model is allowed and the session is open, clamps max_tokens to what the session can still afford.",
      "Holds the worst-case cost of in-flight requests so concurrent calls cannot overspend the cap.",
      "Writes token usage to SQLite before the response ends; an aborted stream bills what was delivered.",
      "Settles once: when the session is closed, at 80% of the cap, or within 10 minutes of expiry (default config).",
    ],
    source: "relayer/src",
  },
  provider: {
    id: "provider",
    title: "AI provider",
    sub: "DeepSeek API · OpenRouter",
    zone: "off",
    role: "Upstream model APIs that actually run inference.",
    points: [
      "Routes are configured per model in providers.json: deepseek-v3 → DeepSeek API, llama-3.3-70b → OpenRouter (example config).",
      "Returns the completion plus prompt and completion token counts.",
      "The relayer never logs or stores prompts or replies.",
    ],
    source: "relayer/providers.example.json",
  },
  program: {
    id: "program",
    title: "BlockRouter program",
    sub: "Anchor 1.2",
    zone: "chain",
    role: "Holds all funds and enforces every money rule.",
    points: [
      "9 instructions: initialize_config, register_model, update_model_price, initialize_vault, deposit, withdraw, open_session, settle_session_usage, reclaim_expired_session.",
      "All balance math is checked; charges are computed in u128 and rounded down.",
      "Every state-changing instruction emits an event.",
    ],
    source: "programs/blockrouter/src/lib.rs",
  },
  vault: {
    id: "vault",
    title: "Vault PDA",
    sub: "+ vault token account",
    zone: "chain",
    role: "The developer’s self-custodial balance for one mint.",
    seeds: `["vault", owner, mint]`,
    fields: ["owner", "mint", "balance", "total_reserved", "session_counter"],
    points: [
      "Tokens sit in the vault PDA’s associated token account; only the program can sign for it.",
      "Invariant: balance ≥ total_reserved after every instruction.",
      "Withdraw can move at most balance − total_reserved, and only the owner can call it.",
    ],
    source: "state/vault.rs",
  },
  session: {
    id: "session",
    title: "Session PDA",
    sub: "capped spending session",
    zone: "chain",
    role: "A bounded authorization: one cap, one relayer, a set of models, an expiry.",
    seeds: `["session", vault, session_id u64 LE]`,
    fields: ["payer_account", "beneficiary", "relayer", "reserved_amount", "expires_at", "allowed_models (≤ 8)"],
    points: [
      "Opening adds reserved_amount to the vault’s total_reserved.",
      "Duration must be between 60 seconds and 7 days.",
      "Closed by settlement or by reclaim, so it can never be billed twice. Session ids come from a monotonic counter and are never reused.",
    ],
    source: "state/session.rs",
  },
  model: {
    id: "model",
    title: "Model PDAs",
    sub: "on-chain token rates",
    zone: "chain",
    role: "The price list the program bills against.",
    seeds: `["model", model_id u16 LE]`,
    fields: ["prompt_rate", "completion_rate", "pending_*_rate", "effective_at", "is_active"],
    points: [
      "Rates are base units per 1,000,000 tokens: deepseek-v3 270,000 / 1,100,000 and llama-3.3-70b 590,000 / 790,000 on devnet.",
      "Price decreases apply immediately; increases wait out the Config timelock (1 hour on devnet).",
    ],
    source: "state/model.rs",
  },
  config: {
    id: "config",
    title: "Config PDA",
    sub: "global settings",
    zone: "chain",
    role: "Protocol-wide authority and payout destination.",
    seeds: `["config"]`,
    fields: ["authority", "provider", "treasury", "fee_bps", "price_timelock_secs", "paused"],
    points: [
      "Can only be initialized by the program’s upgrade authority, so the deploy can’t be front-run.",
      "provider is the only wallet whose token account can receive settlement payouts.",
      "fee_bps is stored (250 on devnet) but not deducted yet. paused blocks open_session only; there is no instruction to toggle it yet.",
    ],
    source: "state/config.rs",
  },
  providerAta: {
    id: "providerAta",
    title: "Provider token account",
    sub: "ATA of config.provider",
    zone: "chain",
    role: "Where settled charges are paid.",
    points: [
      "Settlement checks the owner, mint, token program, and canonical ATA address, so a relayer cannot redirect payouts.",
      "Receives exactly the computed charge; the protocol fee is not implemented yet.",
    ],
    source: "instructions/settle_session_usage.rs",
  },
};

export type FlowId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ArchFlow = {
  id: FlowId;
  title: string;
  /** Label for the step chips. */
  short: string;
  zone: Zone;
  instruction?: string;
  signer: string;
  summary: string;
  checks: string[];
  nodes: NodeId[];
  edges: string[];
};

export const FLOWS: ArchFlow[] = [
  {
    id: 1,
    title: "Deposit funds",
    short: "Deposit",
    zone: "chain",
    instruction: "deposit(amount)",
    signer: "vault owner",
    summary: "Tokens move from the developer’s token account into the vault’s token account; vault.balance increases.",
    checks: ["amount > 0", "signer is vault.owner", "token account mint matches the vault"],
    nodes: ["wallet", "program", "vault"],
    edges: ["deposit"],
  },
  {
    id: 2,
    title: "Open a session",
    short: "Open session",
    zone: "chain",
    instruction: "open_session(id, cap, relayer, duration, model_ids)",
    signer: "vault owner",
    summary:
      "Reserves the cap for one relayer and a list of models. The developer then creates an API key bound to this session (wallet-signed, off-chain).",
    checks: [
      "protocol not paused",
      "cap ≤ balance − total_reserved",
      "session id = vault.session_counter",
      "60 s ≤ duration ≤ 7 days",
      "1–8 distinct, registered, active models",
    ],
    nodes: ["wallet", "program", "session", "vault", "model", "relayer"],
    edges: ["open", "apikey"],
  },
  {
    id: 3,
    title: "Send inference requests",
    short: "Inference",
    zone: "off",
    signer: "API key (no wallet)",
    summary:
      "The agent calls POST /v1/chat/completions. The relayer checks the key’s session and model, clamps max_tokens, holds the worst-case cost, and forwards upstream.",
    checks: ["key bound to an open session", "model allowed by the session", "request fits the remaining budget", "rate limit"],
    nodes: ["agent", "relayer", "provider"],
    edges: ["request", "upstream"],
  },
  {
    id: 4,
    title: "Record usage",
    short: "Record usage",
    zone: "off",
    signer: "relayer (off-chain)",
    summary:
      "The provider returns token counts. The relayer writes them to its SQLite ledger before the response ends and returns X-BlockRouter-Charge / -Remaining headers. Nothing touches the chain yet.",
    checks: ["usage persisted before the response completes", "held amount released and replaced by actual cost"],
    nodes: ["provider", "relayer"],
    edges: ["usage"],
  },
  {
    id: 5,
    title: "Settle actual charges",
    short: "Settle",
    zone: "chain",
    instruction: "settle_session_usage(usage[])",
    signer: "session.relayer",
    summary:
      "The relayer submits raw per-model token counts. The program prices them at on-chain rates and transfers the charge from the vault to the provider.",
    checks: [
      "signer is the session’s relayer",
      "session not expired",
      "every model is in session.allowed_models",
      "charge ≤ session.reserved_amount",
      "payout account is config.provider’s ATA",
    ],
    nodes: ["relayer", "program", "session", "model", "config", "vault", "providerAta"],
    edges: ["settle", "payout"],
  },
  {
    id: 6,
    title: "Release unused funds",
    short: "Release unused",
    zone: "chain",
    instruction: "settle_session_usage · reclaim_expired_session",
    signer: "relayer, or owner after expiry",
    summary:
      "In the same settle instruction, the full reservation is removed from total_reserved and the session closes. Unused = cap − charge becomes available again. If the relayer never settles, the owner reclaims the whole reservation after expiry.",
    checks: ["session account closed (rent → beneficiary)", "vault.balance ≥ vault.total_reserved still holds"],
    nodes: ["session", "vault"],
    edges: ["release"],
  },
  {
    id: 7,
    title: "Withdraw available funds",
    short: "Withdraw",
    zone: "chain",
    instruction: "withdraw(amount)",
    signer: "vault owner",
    summary: "Moves unreserved tokens from the vault back to the developer’s wallet.",
    checks: ["amount ≤ balance − total_reserved", "signer is vault.owner", "takes no Config account, so pause can never block it"],
    nodes: ["vault", "program", "wallet"],
    edges: ["withdraw"],
  },
];
