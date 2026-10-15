"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Code2, Globe, LayoutDashboard, Search, Terminal } from "lucide-react";

import { LogoMark } from "../ui";
import { LINKS } from "@/lib/facts";
import { TEAM } from "@/content/team";

const RESOURCES = [
  { icon: Code2, label: "Repository", href: LINKS.repo, text: "github.com/haileyesus2433/BlockRouter" },
  { icon: BookOpen, label: "README & architecture", href: LINKS.readme, text: "Accounts, instructions, invariants" },
  { icon: Terminal, label: "CLI reference", href: LINKS.cliDocs, text: "cli/README.md" },
  { icon: Globe, label: "Relayer API", href: LINKS.relayerDocs, text: "relayer/README.md" },
  { icon: Search, label: "Program on Solana Explorer", href: LINKS.explorer, text: "devnet" },
  { icon: LayoutDashboard, label: "Web dashboard", href: LINKS.webApp, text: "blockrouter.netlify.app · devnet" },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((part) => /^[A-Za-z]/.test(part))
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

export function Team() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[83rem] flex-col justify-center px-5 py-10 sm:px-10">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl"
      >
        Give AI agents access to <span className="text-gradient">intelligence</span>, not unlimited access to your funds.
      </motion.p>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">10 · The builders</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="card p-5"
              >
                <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-chain/30 to-off/20 text-lg font-semibold">
                  {initials(member.name)}
                </div>
                <h3 className="mt-4 text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-fg-muted">{member.role}</p>
                <p className="mt-3 rounded-lg border border-dashed border-white/15 px-3 py-2 text-sm text-fg-subtle">
                  {member.contribution}
                </p>
                {member.link ? (
                  <a href={member.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-off hover:underline">
                    Profile <ArrowUpRight className="size-3.5" />
                  </a>
                ) : null}
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">Links</p>
          <ul className="card divide-y divide-white/[0.06]">
            {RESOURCES.map((resource) => (
              <li key={resource.label}>
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 px-5 py-3 transition hover:bg-white/[0.03]"
                >
                  <resource.icon className="size-4.5 text-chain" />
                  <span className="flex-1">
                    <span className="block font-medium">{resource.label}</span>
                    <span className="block font-mono text-xs text-fg-subtle">{resource.text}</span>
                  </span>
                  <ArrowUpRight className="size-4 text-fg-subtle transition group-hover:text-fg" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-3 text-sm text-fg-subtle">
        <LogoMark className="size-6" />
        BlockRouter · Turbin3 Solana capstone · Thank you
      </div>
    </div>
  );
}
