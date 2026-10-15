// Facts taken from the BlockRouter repository (deployments/devnet.json, programs/blockrouter, README).
// Everything the deck states about the implementation should come from here.

export const REPO_URL = "https://github.com/haileyesus2433/BlockRouter";

export const LINKS = {
  repo: REPO_URL,
  readme: `${REPO_URL}#readme`,
  program: `${REPO_URL}/tree/main/programs/blockrouter`,
  cliDocs: `${REPO_URL}/blob/main/cli/README.md`,
  relayerDocs: `${REPO_URL}/blob/main/relayer/README.md`,
  explorer:
    "https://explorer.solana.com/address/7maTNWbtCpuCXeRUVCNDR2a9YU7kaeUqtvrqz4ustyyi?cluster=devnet",
  webApp: "https://blockrouter.netlify.app",
} as const;

export const DEVNET = {
  cluster: "devnet",
  programId: "7maTNWbtCpuCXeRUVCNDR2a9YU7kaeUqtvrqz4ustyyi",
  mockUsdtMint: "FuLjr7GLgaa6Ciz24YPE1BQdJbmJXRp3AihgPSyEwmb7",
  relayer: "k3WgqDZLVkKFdmUpFEJ16wketGbzDa6CYU1v1sdmow5",
  relayerUrl: "https://blockrouter.onrender.com",
  feeBps: 250,
  priceTimelockSecs: 3600,
} as const;

/** Mock USDT is created by scripts/seed-devnet.ts with 6 decimals. */
export const USDT_DECIMALS = 6;

export type ModelInfo = {
  id: number;
  alias: string;
  /** Base units per 1,000,000 tokens. */
  promptRate: bigint;
  completionRate: bigint;
  /** Upstream route from relayer/providers.example.json. */
  upstream: string;
  upstreamProvider: string;
};

export const MODELS: ModelInfo[] = [
  {
    id: 1,
    alias: "deepseek-v3",
    promptRate: 270_000n,
    completionRate: 1_100_000n,
    upstream: "deepseek-chat",
    upstreamProvider: "DeepSeek API",
  },
  {
    id: 2,
    alias: "llama-3.3-70b",
    promptRate: 590_000n,
    completionRate: 790_000n,
    upstream: "meta-llama/llama-3.3-70b-instruct",
    upstreamProvider: "OpenRouter",
  },
];

export const PROGRAM_LIMITS = {
  minSessionSecs: 60,
  maxSessionSecs: 7 * 24 * 60 * 60,
  maxAllowedModels: 8,
  maxFeeBps: 1_000,
} as const;

export const short = (address: string, head = 4, tail = 4) =>
  `${address.slice(0, head)}…${address.slice(-tail)}`;
