// Hero visual: requests flow from the agent through the relayer to providers; money moves only on Solana.

const TEAL = "#2dd4bf";
const VIOLET = "#a78bfa";

type BoxProps = { x: number; y: number; w: number; h: number; title: string; sub: string; tone: "off" | "chain" };

function Box({ x, y, w, h, title, sub, tone }: BoxProps) {
  const stroke = tone === "off" ? TEAL : VIOLET;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="#0e0e16" stroke={stroke} strokeOpacity={0.45} />
      <text x={x + 14} y={y + h / 2 - 3} fill="#ececf3" fontSize={14} fontWeight={600}>
        {title}
      </text>
      <text x={x + 14} y={y + h / 2 + 15} fill="#a3a3b8" fontSize={11.5}>
        {sub}
      </text>
    </g>
  );
}

function Packet({ path, color, dur, begin = "0s" }: { path: string; color: string; dur: string; begin?: string }) {
  return (
    <circle r={3.5} fill={color} className="packet">
      <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={path} />
    </circle>
  );
}

const PATHS = {
  walletToProgram: "M24 76 V320",
  walletToAgent: "M110 76 V150",
  agentToRelayer: "M190 182 H225",
  relayerToP1: "M375 170 C395 170 390 122 410 122",
  relayerToP2: "M375 194 C395 194 390 242 410 242",
  relayerToProgram: "M300 218 V320",
};

export function HeroFlow() {
  return (
    <svg
      viewBox="0 0 560 450"
      className="h-auto w-full"
      role="img"
      aria-label="AI requests flow from an agent through the BlockRouter relayer to AI providers, while deposits and settlement happen in the BlockRouter program on Solana"
    >
      <style>{`@media (prefers-reduced-motion: reduce){.packet{display:none}}`}</style>
      <defs>
        <marker id="hf-arrow-off" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={TEAL} />
        </marker>
        <marker id="hf-arrow-chain" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={VIOLET} />
        </marker>
        <linearGradient id="hf-solana" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={VIOLET} stopOpacity="0.16" />
          <stop offset="1" stopColor={TEAL} stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Off-chain label */}
      <text x={548} y={34} textAnchor="end" fill={TEAL} fontSize={11} fontFamily="var(--font-mono)" letterSpacing="0.12em">
        OFF-CHAIN · INFERENCE
      </text>

      {/* Edges */}
      <g fill="none" strokeWidth={1.5}>
        <path d={PATHS.walletToProgram} stroke={VIOLET} strokeOpacity={0.6} markerEnd="url(#hf-arrow-chain)" />
        <path d={PATHS.walletToAgent} stroke={TEAL} strokeOpacity={0.5} strokeDasharray="4 4" markerEnd="url(#hf-arrow-off)" />
        <path d={PATHS.agentToRelayer} stroke={TEAL} strokeOpacity={0.7} markerEnd="url(#hf-arrow-off)" />
        <path d={PATHS.relayerToP1} stroke={TEAL} strokeOpacity={0.7} markerEnd="url(#hf-arrow-off)" />
        <path d={PATHS.relayerToP2} stroke={TEAL} strokeOpacity={0.7} markerEnd="url(#hf-arrow-off)" />
        <path d={PATHS.relayerToProgram} stroke={VIOLET} strokeOpacity={0.7} markerEnd="url(#hf-arrow-chain)" />
      </g>
      <g fontSize={10.5} fontFamily="var(--font-mono)">
        <text x={34} y={268} fill={VIOLET}>
          deposit · open_session
        </text>
        <text x={118} y={120} fill={TEAL} fillOpacity={0.85}>
          API key
        </text>
        <text x={310} y={276} fill={VIOLET}>
          settle_session_usage
        </text>
        <text x={310} y={290} fill="#6e6e85">
          raw token counts only
        </text>
      </g>

      {/* Nodes */}
      <Box x={10} y={20} w={170} h={56} title="Developer wallet" sub="br CLI · web dashboard" tone="chain" />
      <Box x={40} y={150} w={150} h={64} title="AI agent" sub="OpenCode" tone="off" />
      <g>
        <rect x={225} y={146} width={150} height={72} rx={14} fill="#13131d" stroke="url(#hf-solana)" />
        <rect x={225} y={146} width={150} height={72} rx={14} fill="none" stroke={TEAL} strokeOpacity={0.8} />
        <text x={240} y={177} fill="#ececf3" fontSize={15} fontWeight={700}>
          BlockRouter
        </text>
        <text x={240} y={196} fill="#a3a3b8" fontSize={11.5}>
          relayer · /v1/chat
        </text>
      </g>
      <Box x={410} y={96} w={140} h={52} title="deepseek-v3" sub="DeepSeek API" tone="off" />
      <Box x={410} y={216} w={140} h={52} title="llama-3.3-70b" sub="via OpenRouter" tone="off" />

      {/* Solana */}
      <rect x={10} y={320} width={540} height={116} rx={16} fill="url(#hf-solana)" stroke={VIOLET} strokeOpacity={0.45} />
      <text x={26} y={345} fill={VIOLET} fontSize={11} fontFamily="var(--font-mono)" letterSpacing="0.12em">
        SOLANA · BLOCKROUTER PROGRAM
      </text>
      {[
        { x: 26, label: "Vault PDA", sub: "balance · reserved" },
        { x: 202, label: "Session PDA", sub: "cap · models · expiry" },
        { x: 378, label: "Provider ATA", sub: "receives the charge" },
      ].map((chip) => (
        <g key={chip.label}>
          <rect x={chip.x} y={360} width={156} height={58} rx={10} fill="#0e0e16" stroke={VIOLET} strokeOpacity={0.3} />
          <text x={chip.x + 12} y={384} fill="#ececf3" fontSize={13} fontWeight={600}>
            {chip.label}
          </text>
          <text x={chip.x + 12} y={402} fill="#a3a3b8" fontSize={11}>
            {chip.sub}
          </text>
        </g>
      ))}

      {/* Packets */}
      <Packet path={PATHS.agentToRelayer} color={TEAL} dur="1.4s" />
      <Packet path={PATHS.relayerToP1} color={TEAL} dur="1.6s" begin="0.4s" />
      <Packet path={PATHS.relayerToP2} color={TEAL} dur="1.6s" begin="1.2s" />
      <Packet path={PATHS.relayerToProgram} color={VIOLET} dur="2.6s" begin="0.8s" />
      <Packet path={PATHS.walletToProgram} color={VIOLET} dur="3.2s" />
    </svg>
  );
}
