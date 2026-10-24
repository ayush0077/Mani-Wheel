"use client";

import { useEffect, useState, useRef } from "react";
import type { AppPhase } from "@/lib/commands";

interface SshConnectProps {
  onComplete: (next: AppPhase) => void;
}

const SSH_LINES = [
  { text: "Connecting to ayush...", delay: 0, className: "text-[var(--ctp-yellow)]" },
  { text: "SSH-2.0-OpenSSH_9.8p1 Arch Linux", delay: 400, className: "text-[var(--ctp-subtext1)]" },
  { text: "Authenticating as tamrakar...", delay: 700, className: "text-[var(--ctp-yellow)]" },
  { text: "Identity accepted", delay: 1050, className: "text-[var(--ctp-green)]" },
  { text: "", delay: 1150 },
  { text: "Connection established.", delay: 1280, className: "text-[var(--ctp-green)] font-semibold" },
  { text: "", delay: 1380 },
  { text: "Last login: Tue Oct 20 23:25:00 2026 from 127.0.0.1", delay: 1450, className: "text-[var(--ctp-subtext0)]" },
];

export default function SshConnect({ onComplete }: SshConnectProps) {
  const [visibleLines, setVisibleLines] = useState<typeof SSH_LINES>([]);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let isMounted = true;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    if (prefersReducedMotion) {
      const showAllTimer = setTimeout(() => {
        if (isMounted) {
          setVisibleLines(SSH_LINES);
        }
      }, 0);
      timeouts.push(showAllTimer);

      const completeT = setTimeout(() => {
        if (isMounted) onCompleteRef.current("portfolio");
      }, 300);
      timeouts.push(completeT);

      return () => {
        isMounted = false;
        timeouts.forEach(clearTimeout);
      };
    }

    SSH_LINES.forEach((line) => {
      const t = setTimeout(() => {
        if (isMounted) {
          setVisibleLines((prev) => [...prev, line]);
        }
      }, line.delay);
      timeouts.push(t);
    });

    const lastDelay = SSH_LINES[SSH_LINES.length - 1].delay;
    const completeTimeout = setTimeout(() => {
      if (isMounted) {
        onCompleteRef.current("portfolio");
      }
    }, lastDelay + 700);
    timeouts.push(completeTimeout);

    return () => {
      isMounted = false;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="font-mono text-sm leading-relaxed space-y-0.5" aria-live="polite">
      {visibleLines.map((line, i) => (
        <div
          key={i}
          className={`animate-fade-in ${line.className || "text-[var(--ctp-text)]"}`}
        >
          {line.text || "\u00a0"}
        </div>
      ))}
    </div>
  );
}
