"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";

import { formatUnits, UNIT } from "@/lib/pricing";

/** Tweens between token amounts; always lands on the exact bigint value. */
export function AnimatedAmount({ value, className }: { value: bigint; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    const from = previous.current;
    previous.current = value;
    if (!node || from === value) return;
    const final = formatUnits(value);
    if (reduce) {
      node.textContent = final;
      return;
    }
    const decimals = final.split(".")[1]?.length ?? 0;
    const controls = animate(Number(from) / Number(UNIT), Number(value) / Number(UNIT), {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      },
      onComplete: () => {
        node.textContent = final;
      },
    });
    return () => {
      controls.stop();
      node.textContent = final;
    };
  }, [value, reduce]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {formatUnits(value)}
    </span>
  );
}
