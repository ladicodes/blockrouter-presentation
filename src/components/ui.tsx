import type { ReactNode } from "react";
import { Boxes, CircleDashed, FlaskConical, ShieldCheck, Workflow } from "lucide-react";

export type TagKind = "chain" | "off" | "sim" | "verified" | "planned" | "illustrative";

const TAGS: Record<TagKind, { label: string; className: string; icon: ReactNode }> = {
  chain: {
    label: "On-chain",
    className: "border-chain/30 bg-chain/10 text-chain",
    icon: <Boxes className="size-3.5" />,
  },
  off: {
    label: "Off-chain",
    className: "border-off/30 bg-off/10 text-off",
    icon: <Workflow className="size-3.5" />,
  },
  sim: {
    label: "Simulation",
    className: "border-sim/40 bg-sim/10 text-sim",
    icon: <FlaskConical className="size-3.5" />,
  },
  illustrative: {
    label: "Illustrative",
    className: "border-sim/30 bg-sim/[0.07] text-sim/90",
    icon: <FlaskConical className="size-3.5" />,
  },
  verified: {
    label: "In the repo",
    className: "border-ok/30 bg-ok/10 text-ok",
    icon: <ShieldCheck className="size-3.5" />,
  },
  planned: {
    label: "Not built yet",
    className: "border-white/15 bg-white/5 text-fg-muted",
    icon: <CircleDashed className="size-3.5" />,
  },
};

export function Tag({ kind, children }: { kind: TagKind; children?: ReactNode }) {
  const tag = TAGS[kind];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${tag.className}`}
    >
      {tag.icon}
      {children ?? tag.label}
    </span>
  );
}

export function SlideFrame({
  eyebrow,
  title,
  lede,
  children,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[83rem] flex-col px-5 py-7 sm:px-10 lg:py-8">
      <header className="mb-6 flex flex-col gap-4 lg:mb-7 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="min-w-0 flex-1">
          <p className="mb-2.5 font-mono text-xs uppercase tracking-[0.2em] text-chain">{eyebrow}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {title}
          </h2>
          {lede ? <p className="mt-3 max-w-4xl text-lg leading-relaxed text-fg-muted lg:text-xl">{lede}</p> : null}
        </div>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[0.85em] text-fg">
      {children}
    </code>
  );
}

export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="br-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="#0e0e16" stroke="url(#br-mark)" strokeWidth="1.5" />
      <path d="M8 11h6l4 10h6" fill="none" stroke="url(#br-mark)" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 11h6" fill="none" stroke="#a78bfa" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="11" r="2" fill="#a78bfa" />
      <circle cx="24" cy="21" r="2" fill="#2dd4bf" />
    </svg>
  );
}
