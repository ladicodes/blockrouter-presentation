"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Keyboard,
  Maximize2,
  Minimize2,
  Network,
  NotebookPen,
  PlayCircle,
  X,
} from "lucide-react";

import { type DeckApi, DeckContext } from "./deck-context";
import { SLIDES } from "./slides";
import { LogoMark } from "./ui";

const ids = SLIDES.map((slide) => slide.id);

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
const readHash = () => window.location.hash.slice(1);

function subscribeFullscreen(onChange: () => void) {
  document.addEventListener("fullscreenchange", onChange);
  return () => document.removeEventListener("fullscreenchange", onChange);
}
const readFullscreen = () => Boolean(document.fullscreenElement);

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen?.().catch(() => {});
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

export function Deck() {
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
  const fullscreen = useSyncExternalStore(subscribeFullscreen, readFullscreen, () => false);
  const index = Math.max(0, ids.indexOf(hash));
  const [direction, setDirection] = useState(1);
  const [notesOpen, setNotesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const goToIndex = useCallback(
    (target: number) => {
      const clamped = Math.min(ids.length - 1, Math.max(0, target));
      if (clamped === index) return;
      setDirection(clamped > index ? 1 : -1);
      window.location.hash = ids[clamped];
    },
    [index],
  );

  const api: DeckApi = {
    goTo: (id) => goToIndex(ids.indexOf(id)),
    next: () => goToIndex(index + 1),
    prev: () => goToIndex(index - 1),
  };

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
      const key = event.key;
      if (key === "ArrowRight" || key === "PageDown" || key === "ArrowDown") {
        event.preventDefault();
        goToIndex(index + 1);
      } else if (key === "ArrowLeft" || key === "PageUp" || key === "ArrowUp") {
        event.preventDefault();
        goToIndex(index - 1);
      } else if (key === "Home") goToIndex(0);
      else if (key === "End") goToIndex(ids.length - 1);
      else if (key === "f" || key === "F") toggleFullscreen();
      else if (key === "n" || key === "N" || key === "s" || key === "S") setNotesOpen((open) => !open);
      else if (key === "a" || key === "A") goToIndex(ids.indexOf("architecture"));
      else if (key === "d" || key === "D") goToIndex(ids.indexOf("demo"));
      else if (key === "?") setHelpOpen((open) => !open);
      else if (key === "Escape") {
        setHelpOpen(false);
        setNotesOpen(false);
      } else if (/^[0-9]$/.test(key)) goToIndex(key === "0" ? 9 : Number(key) - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToIndex, index]);

  const slide = SLIDES[index];
  const Slide = slide.Component;

  return (
    <MotionConfig reducedMotion="user">
      <DeckContext.Provider value={api}>
        <div className="bg-canvas flex h-dvh flex-col">
          {/* Top bar */}
          <header className="z-20 flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] bg-ink-950/70 px-4 backdrop-blur sm:px-6">
            <button onClick={() => goToIndex(0)} className="flex items-center gap-2.5" aria-label="Back to title">
              <LogoMark className="size-7" />
              <span className="font-semibold tracking-tight">BlockRouter</span>
            </button>
            <span className="hidden text-fg-subtle sm:inline">/</span>
            <span className="hidden truncate text-sm text-fg-muted sm:inline">{slide.label}</span>
            <div className="ml-auto flex items-center gap-1.5">
              <TopButton onClick={() => api.goTo("architecture")} active={slide.id === "architecture"} label="Architecture">
                <Network className="size-4" />
              </TopButton>
              <TopButton onClick={() => api.goTo("demo")} active={slide.id === "demo"} label="Demo">
                <PlayCircle className="size-4" />
              </TopButton>
              <span className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />
              <TopButton onClick={() => setNotesOpen((open) => !open)} active={notesOpen} label="Notes" hideLabel>
                <NotebookPen className="size-4" />
              </TopButton>
              <TopButton onClick={() => setHelpOpen(true)} label="Shortcuts" hideLabel>
                <Keyboard className="size-4" />
              </TopButton>
              <TopButton onClick={toggleFullscreen} label={fullscreen ? "Exit full screen" : "Full screen"} hideLabel>
                {fullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </TopButton>
            </div>
          </header>

          {/* Slide */}
          <main className="relative min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.section
                key={slide.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="slide-scroll absolute inset-0 overflow-y-auto"
                aria-label={slide.label}
              >
                <Slide />
              </motion.section>
            </AnimatePresence>
          </main>

          {/* Speaker notes */}
          <AnimatePresence>
            {notesOpen ? (
              <motion.aside
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-x-3 bottom-16 z-30 mx-auto max-w-3xl rounded-2xl border border-white/10 bg-ink-850/95 p-5 shadow-2xl backdrop-blur sm:inset-x-6"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-chain">
                    Speaker notes · {index + 1}. {slide.label}
                  </p>
                  <button onClick={() => setNotesOpen(false)} aria-label="Close notes" className="text-fg-subtle hover:text-fg">
                    <X className="size-4" />
                  </button>
                </div>
                <ul className="space-y-1.5 text-[15px] leading-relaxed text-fg-muted">
                  {slide.notes.map((note) => (
                    <li key={note} className="flex gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-chain" />
                      {note}
                    </li>
                  ))}
                </ul>
              </motion.aside>
            ) : null}
          </AnimatePresence>

          {/* Bottom bar */}
          <footer className="z-20 flex h-14 shrink-0 items-center gap-3 border-t border-white/[0.06] bg-ink-950/70 px-4 backdrop-blur sm:px-6">
            <button
              onClick={() => goToIndex(index - 1)}
              disabled={index === 0}
              className="grid size-9 place-items-center rounded-lg border border-white/10 text-fg-muted transition hover:bg-white/5 hover:text-fg disabled:opacity-30"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-4" />
            </button>
            <nav className="flex flex-1 items-center gap-1" aria-label="Slides">
              {SLIDES.map((entry, i) => (
                <button
                  key={entry.id}
                  onClick={() => goToIndex(i)}
                  title={`${i + 1}. ${entry.label}`}
                  aria-label={`Go to slide ${i + 1}: ${entry.label}`}
                  aria-current={i === index ? "step" : undefined}
                  className="group flex h-6 flex-1 items-center"
                >
                  <span
                    className={`h-1 w-full rounded-full transition-colors ${
                      i === index ? "bg-gradient-to-r from-chain to-off" : i < index ? "bg-white/30" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  />
                </button>
              ))}
            </nav>
            <span className="w-14 text-right font-mono text-xs tabular-nums text-fg-muted">
              {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
            <button
              onClick={() => goToIndex(index + 1)}
              disabled={index === SLIDES.length - 1}
              className="grid size-9 place-items-center rounded-lg border border-white/10 text-fg-muted transition hover:bg-white/5 hover:text-fg disabled:opacity-30"
              aria-label="Next slide"
            >
              <ChevronRight className="size-4" />
            </button>
          </footer>

          <AnimatePresence>{helpOpen ? <Shortcuts onClose={() => setHelpOpen(false)} /> : null}</AnimatePresence>
        </div>
      </DeckContext.Provider>
    </MotionConfig>
  );
}

function TopButton({
  onClick,
  active,
  label,
  hideLabel,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  hideLabel?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm transition ${
        active ? "bg-white/[0.08] text-fg" : "text-fg-muted hover:bg-white/5 hover:text-fg"
      }`}
    >
      {children}
      {hideLabel ? null : <span className="hidden md:inline">{label}</span>}
    </button>
  );
}

const SHORTCUTS: [string, string][] = [
  ["← →  /  PgUp PgDn", "Previous / next slide"],
  ["1 – 9, 0", "Jump to slide 1–10"],
  ["A", "Architecture"],
  ["D", "Interactive demo"],
  ["Enter", "Demo: next step"],
  ["R", "Demo: reset"],
  ["N  or  S", "Toggle speaker notes"],
  ["F", "Toggle full screen"],
  ["?", "This panel"],
];

function Shortcuts({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-ink-850 p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-label="Keyboard shortcuts"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Presenter shortcuts</h3>
          <button onClick={onClose} aria-label="Close" className="text-fg-subtle hover:text-fg">
            <X className="size-4" />
          </button>
        </div>
        <dl className="space-y-2.5">
          {SHORTCUTS.map(([keys, action]) => (
            <div key={keys} className="flex items-center justify-between gap-4 text-sm">
              <dt className="kbd">{keys}</dt>
              <dd className="text-fg-muted">{action}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.div>
  );
}
