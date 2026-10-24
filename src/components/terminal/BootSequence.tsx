"use client";

import { useEffect, useState, useRef } from "react";

export interface BootLine {
  text: string;
  delay: number;
  className?: string;
}

// Compact, authentic ASCII logo for AYUSH
export const ASCII_LOGO = [
  "     _                        _     ",
  "    / \\  _   _ _   _ ___| |__   ",
  "   / _ \\| | | | | | / __| '_ \\  ",
  "  / ___ \\ |_| | |_| \\__ \\ | | | ",
  " /_/   \\_\\__,_|\\__,_|___/_| |_| ",
].join("\n");

export const PRE_BOOT_LINES: BootLine[] = [
  { text: "BIOS v2.1.4  Copyright (C) Tamrakar Systems", delay: 0, className: "text-[var(--ctp-subtext0)]" },
  { text: "", delay: 50 },
  { text: "CPU: Curiosity Engine @ 4.2GHz (8 cores)", delay: 90, className: "text-[var(--ctp-subtext1)]" },
  { text: "RAM: 16384 MB  [ OK ]", delay: 150, className: "text-[var(--ctp-subtext1)]" },
  { text: "Loading kernel...                          [ OK ]", delay: 260, className: "text-[var(--ctp-green)]" },
  { text: "Mounting filesystems...                    [ OK ]", delay: 370, className: "text-[var(--ctp-green)]" },
  { text: "Starting network manager...                [ OK ]", delay: 470, className: "text-[var(--ctp-green)]" },
  { text: "Initializing SSH daemon...                 [ OK ]", delay: 570, className: "text-[var(--ctp-green)]" },
];

export const POST_BOOT_LINES: BootLine[] = [
  { text: "Arch Linux 6.11.0-arch1-1 (tty1)", delay: 820, className: "text-[var(--ctp-blue)] font-semibold" },
  { text: "", delay: 880 },
  { text: "Welcome to Ayush's digital space.", delay: 960, className: "text-[var(--ctp-mauve)] font-semibold" },
  { text: "System initialized. Awaiting command...", delay: 1080, className: "text-[var(--ctp-subtext1)]" },
  { text: "", delay: 1140 },
  { text: "Hint: type `help` to see available commands.", delay: 1220, className: "text-[var(--ctp-overlay1)] italic text-sm" },
  { text: "", delay: 1280 },
];

// Preserving BOOT_LINES export for backwards compatibility
export const BOOT_LINES: BootLine[] = [...PRE_BOOT_LINES, ...POST_BOOT_LINES];

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visiblePreCount, setVisiblePreCount] = useState<number>(0);
  const [showLogo, setShowLogo] = useState<boolean>(false);
  const [visiblePostCount, setVisiblePostCount] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let isMounted = true;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Show everything immediately in reduced motion mode
      const showAllTimer = setTimeout(() => {
        if (isMounted) {
          setVisiblePreCount(PRE_BOOT_LINES.length);
          setShowLogo(true);
          setVisiblePostCount(POST_BOOT_LINES.length);
        }
      }, 0);
      timeouts.push(showAllTimer);

      const completeTimer = setTimeout(() => {
        if (isMounted) {
          onCompleteRef.current();
        }
      }, 80);
      timeouts.push(completeTimer);

      return () => {
        isMounted = false;
        timeouts.forEach(clearTimeout);
      };
    }

    // Schedule pre-boot hardware lines
    PRE_BOOT_LINES.forEach((line, index) => {
      const timer = setTimeout(() => {
        if (isMounted) {
          setVisiblePreCount(index + 1);
        }
      }, line.delay);
      timeouts.push(timer);
    });

    // Schedule ASCII art logo reveal (after hardware checks, before welcome)
    const logoTimer = setTimeout(() => {
      if (isMounted) {
        setShowLogo(true);
      }
    }, 670);
    timeouts.push(logoTimer);

    // Schedule post-boot / welcome lines
    POST_BOOT_LINES.forEach((line, index) => {
      const timer = setTimeout(() => {
        if (isMounted) {
          setVisiblePostCount(index + 1);
        }
      }, line.delay);
      timeouts.push(timer);
    });

    // Notify completion after the last line appears
    const completeTimer = setTimeout(() => {
      if (isMounted) {
        onCompleteRef.current();
      }
    }, 1420);
    timeouts.push(completeTimer);

    return () => {
      isMounted = false;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="font-mono text-sm leading-relaxed space-y-0.5"
      aria-live="polite"
      aria-label="System boot sequence"
    >
      {/* ── Initial BIOS & Kernel checks ── */}
      {PRE_BOOT_LINES.slice(0, visiblePreCount).map((line, idx) => (
        <div
          key={`pre-${idx}`}
          className={`animate-boot-line ${line.className || "text-[var(--ctp-text)]"}`}
        >
          {line.text ? line.text : "\u00A0"}
        </div>
      ))}

      {/* ── ASCII Art Logo & System Status ── */}
      {showLogo && (
        <div className="my-2.5 sm:my-3 animate-fade-in select-none">
          <pre
            className="
              font-mono text-[9px] sm:text-[11px] md:text-xs leading-[1.18]
              text-[var(--ctp-mauve)]
              drop-shadow-[0_0_12px_rgba(203,166,247,0.35)]
              whitespace-pre overflow-x-auto sm:overflow-visible
            "
            style={{ whiteSpace: "pre", fontFamily: "var(--font-mono)" }}
            aria-label="AYUSH ASCII Logo"
          >
            {ASCII_LOGO}
          </pre>
          <div className="font-mono text-[10px] sm:text-xs tracking-wider text-[var(--ctp-blue)] mt-1.5 pl-3 sm:pl-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ctp-green)] animate-pulse" />
            <span className="text-[var(--ctp-lavender)] font-semibold">AYUSH</span>
            <span className="text-[var(--ctp-overlay0)]">{"//"}</span>
            <span className="text-[var(--ctp-blue)] font-medium">SYSTEM ONLINE</span>
          </div>
        </div>
      )}

      {/* ── Welcome & Environment Lines ── */}
      {POST_BOOT_LINES.slice(0, visiblePostCount).map((line, idx) => (
        <div
          key={`post-${idx}`}
          className={`animate-boot-line ${line.className || "text-[var(--ctp-text)]"}`}
        >
          {line.text ? line.text : "\u00A0"}
        </div>
      ))}
    </div>
  );
}
