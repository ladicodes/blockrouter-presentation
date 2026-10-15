"use client";

import type { KeyboardEvent } from "react";

import { DEVNET, short } from "@/lib/facts";
import { FLOWS, NODES, type FlowId, type NodeId } from "@/content/architecture";

const TEAL = "#2dd4bf";
const VIOLET = "#a78bfa";

type Rect = { x: number; y: number; w: number; h: number };

const LAYOUT: Record<Exclude<NodeId, "program">, Rect> = {
  wallet: { x: 40, y: 44, w: 240, h: 108 },
  agent: { x: 330, y: 44, w: 240, h: 108 },
  relayer: { x: 620, y: 44, w: 260, h: 172 },
  provider: { x: 930, y: 44, w: 230, h: 108 },
  vault: { x: 56, y: 380, w: 210, h: 110 },
  session: { x: 316, y: 380, w: 190, h: 110 },
  model: { x: 540, y: 380, w: 165, h: 110 },
  config: { x: 735, y: 380, w: 160, h: 110 },
  providerAta: { x: 945, y: 380, w: 215, h: 110 },
};

type Edge = { id: string; d: string; zone: "off" | "chain"; label?: { x: number; y: number; text: string } };

const EDGES: Edge[] = [
  { id: "deposit", d: "M100 152 V380", zone: "chain" },
  { id: "withdraw", d: "M200 380 V152", zone: "chain" },
  { id: "open", d: "M260 152 C260 280 411 270 411 380", zone: "chain" },
  { id: "apikey", d: "M160 44 C160 14 700 14 700 44", zone: "off", label: { x: 430, y: 38, text: "create API key (wallet-signed)" } },
  { id: "request", d: "M570 92 H620", zone: "off" },
  { id: "upstream", d: "M880 84 H930", zone: "off" },
  { id: "usage", d: "M930 122 H880", zone: "off" },
  { id: "settle", d: "M750 216 V300", zone: "chain" },
  { id: "payout", d: "M161 490 V530 H1052 V490", zone: "chain", label: { x: 600, y: 548, text: "transfer charge: vault token account → provider token account" } },
  { id: "release", d: "M316 435 H266", zone: "chain" },
];

const BADGES: { flow: FlowId; x: number; y: number }[] = [
  { flow: 1, x: 100, y: 262 },
  { flow: 7, x: 200, y: 262 },
  { flow: 2, x: 335, y: 273 },
  { flow: 3, x: 595, y: 92 },
  { flow: 4, x: 905, y: 103 },
  { flow: 5, x: 750, y: 258 },
  { flow: 5, x: 1052, y: 530 },
  { flow: 6, x: 291, y: 435 },
];

export type Selection = { kind: "node"; id: NodeId } | { kind: "flow"; id: FlowId } | null;

function activeSets(selection: Selection) {
  if (!selection) return null;
  if (selection.kind === "flow") {
    const flow = FLOWS.find((f) => f.id === selection.id)!;
    return { nodes: new Set<NodeId>(flow.nodes), edges: new Set(flow.edges), flows: new Set<FlowId>([flow.id]) };
  }
  const related = FLOWS.filter((f) => f.nodes.includes(selection.id));
  return {
    nodes: new Set<NodeId>([selection.id]),
    edges: new Set(related.flatMap((f) => f.edges)),
    flows: new Set<FlowId>(related.map((f) => f.id)),
  };
}

/** Truncates mono text to the width of its box (10.5px mono is ~6.4px per glyph). */
const fit = (text: string, width: number) => {
  const max = Math.floor((width - 28) / 6.4);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};

const onActivate = (fn: () => void) => (event: KeyboardEvent) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    fn();
  }
};

export function ArchitectureDiagram({
  selection,
  onSelect,
}: {
  selection: Selection;
  onSelect: (selection: Selection) => void;
}) {
  const active = activeSets(selection);
  const nodeState = (id: NodeId) => (!active ? "idle" : active.nodes.has(id) ? "on" : "dim");
  const edgeState = (id: string) => (!active ? "idle" : active.edges.has(id) ? "on" : "dim");
  const selectNode = (id: NodeId) =>
    onSelect(selection?.kind === "node" && selection.id === id ? null : { kind: "node", id });

  return (
    <svg
      viewBox="0 0 1200 600"
      className="h-auto w-full select-none"
      role="group"
      aria-label="BlockRouter architecture: off-chain components above, Solana accounts below. Click a component for details."
    >
      <defs>
        {(["off", "chain"] as const).map((zone) => (
          <marker
            key={zone}
            id={`arch-arrow-${zone}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={zone === "off" ? TEAL : VIOLET} />
          </marker>
        ))}
        <linearGradient id="arch-solana" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={VIOLET} stopOpacity="0.09" />
          <stop offset="1" stopColor={TEAL} stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Zones */}
      <rect x={16} y={8} width={1168} height={236} rx={18} fill={TEAL} fillOpacity={0.025} stroke={TEAL} strokeOpacity={0.18} strokeDasharray="5 6" />
      <text x={1170} y={32} textAnchor="end" fill={TEAL} fontSize={12} fontFamily="var(--font-mono)" letterSpacing="0.14em">
        OFF-CHAIN
      </text>
      <rect x={16} y={268} width={1168} height={322} rx={18} fill="url(#arch-solana)" stroke={VIOLET} strokeOpacity={0.25} />
      <text x={1170} y={292} textAnchor="end" fill={VIOLET} fontSize={12} fontFamily="var(--font-mono)" letterSpacing="0.14em">
        SOLANA · {DEVNET.cluster.toUpperCase()}
      </text>

      {/* Program container */}
      <g
        role="button"
        tabIndex={0}
        aria-label="BlockRouter program"
        aria-pressed={selection?.kind === "node" && selection.id === "program"}
        onClick={() => selectNode("program")}
        onKeyDown={onActivate(() => selectNode("program"))}
        className="cursor-pointer outline-none"
        opacity={nodeState("program") === "dim" ? 0.55 : 1}
      >
        <rect
          x={36}
          y={300}
          width={880}
          height={262}
          rx={14}
          fill="#0b0b12"
          fillOpacity={0.7}
          stroke={VIOLET}
          strokeOpacity={nodeState("program") === "on" ? 0.9 : 0.4}
          strokeWidth={nodeState("program") === "on" ? 2 : 1}
        />
        <rect x={36} y={300} width={880} height={44} rx={14} fill={VIOLET} fillOpacity={0.08} />
        <text x={56} y={328} fill="#ececf3" fontSize={15} fontWeight={600}>
          BlockRouter program
        </text>
        <text x={226} y={328} fill="#a3a3b8" fontSize={12} fontFamily="var(--font-mono)">
          Anchor 1.2 · {short(DEVNET.programId, 6, 6)}
        </text>
      </g>

      {/* Edges */}
      <g fill="none">
        {EDGES.map((edge) => {
          const state = edgeState(edge.id);
          const color = edge.zone === "off" ? TEAL : VIOLET;
          return (
            <g key={edge.id} opacity={state === "dim" ? 0.18 : 1}>
              <path
                d={edge.d}
                stroke={color}
                strokeOpacity={state === "on" ? 1 : 0.55}
                strokeWidth={state === "on" ? 2.2 : 1.5}
                markerEnd={`url(#arch-arrow-${edge.zone})`}
                className={state === "on" ? "edge-flow" : undefined}
                strokeDasharray={edge.id === "apikey" && state !== "on" ? "4 5" : undefined}
              />
              {edge.label ? (
                <text
                  x={edge.label.x}
                  y={edge.label.y}
                  textAnchor="middle"
                  fill={color}
                  fillOpacity={0.85}
                  fontSize={11}
                  fontFamily="var(--font-mono)"
                  stroke="none"
                >
                  {edge.label.text}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>

      {/* Nodes */}
      {(Object.keys(LAYOUT) as Exclude<NodeId, "program">[]).map((id) => {
        const node = NODES[id];
        const rect = LAYOUT[id];
        const state = nodeState(id);
        const color = node.zone === "off" ? TEAL : VIOLET;
        const selected = selection?.kind === "node" && selection.id === id;
        return (
          <g
            key={id}
            role="button"
            tabIndex={0}
            aria-label={node.title}
            aria-pressed={selected}
            onClick={() => selectNode(id)}
            onKeyDown={onActivate(() => selectNode(id))}
            className="cursor-pointer outline-none [&:focus-visible>rect:first-child]:stroke-white"
            opacity={state === "dim" ? 0.4 : 1}
          >
            <rect
              x={rect.x}
              y={rect.y}
              width={rect.w}
              height={rect.h}
              rx={12}
              fill={selected ? "#171724" : "#0e0e16"}
              stroke={color}
              strokeOpacity={state === "on" ? 0.95 : 0.4}
              strokeWidth={selected ? 2.2 : state === "on" ? 1.8 : 1}
            />
            <circle cx={rect.x + 18} cy={rect.y + 24} r={4} fill={color} />
            <text x={rect.x + 30} y={rect.y + 29} fill="#ececf3" fontSize={14.5} fontWeight={600}>
              {node.title}
            </text>
            <text x={rect.x + 16} y={rect.y + 52} fill="#a3a3b8" fontSize={12}>
              {node.sub}
            </text>
            {node.seeds ? (
              <text x={rect.x + 16} y={rect.y + rect.h - 18} fill={color} fillOpacity={0.85} fontSize={10.5} fontFamily="var(--font-mono)">
                {fit(node.seeds, rect.w)}
              </text>
            ) : id === "providerAta" ? (
              <text x={rect.x + 16} y={rect.y + rect.h - 18} fill="#6e6e85" fontSize={10.5} fontFamily="var(--font-mono)">
                SPL token account
              </text>
            ) : null}
            {id === "relayer" ? (
              <g>
                <rect x={640} y={166} width={220} height={36} rx={8} fill={TEAL} fillOpacity={0.07} stroke={TEAL} strokeOpacity={0.3} />
                <text x={656} y={189} fill={TEAL} fontSize={11.5} fontFamily="var(--font-mono)">
                  usage ledger · settle worker
                </text>
              </g>
            ) : null}
            {id === "agent" ? (
              <text x={rect.x + 16} y={rect.y + rect.h - 18} fill="#6e6e85" fontSize={10.5} fontFamily="var(--font-mono)">
                Bearer brk_live_…
              </text>
            ) : null}
            {id === "wallet" ? (
              <text x={rect.x + 16} y={rect.y + rect.h - 18} fill="#6e6e85" fontSize={10.5} fontFamily="var(--font-mono)">
                user keypair signs
              </text>
            ) : null}
            {id === "provider" ? (
              <text x={rect.x + 16} y={rect.y + rect.h - 18} fill="#6e6e85" fontSize={10.5} fontFamily="var(--font-mono)">
                OpenAI-compatible
              </text>
            ) : null}
          </g>
        );
      })}

      {/* Flow badges */}
      {BADGES.map((badge) => {
        const on = active?.flows.has(badge.flow);
        const flow = FLOWS.find((f) => f.id === badge.flow)!;
        const color = flow.zone === "off" ? TEAL : VIOLET;
        return (
          <g
            key={`${badge.flow}-${badge.x}`}
            role="button"
            tabIndex={-1}
            aria-label={`Flow ${badge.flow}: ${flow.title}`}
            onClick={() => onSelect({ kind: "flow", id: badge.flow })}
            className="cursor-pointer"
            opacity={active && !on ? 0.3 : 1}
          >
            <circle cx={badge.x} cy={badge.y} r={11} fill={on ? color : "#0e0e16"} stroke={color} strokeWidth={1.5} />
            <text
              x={badge.x}
              y={badge.y + 4}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill={on ? "#06060a" : color}
              fontFamily="var(--font-mono)"
            >
              {badge.flow}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
