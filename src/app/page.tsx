"use client";

import { useState, useCallback, useEffect } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import ScrollyPortfolio from "@/components/portfolio/ScrollyPortfolio";
import AnimatedBackground from "@/components/AnimatedBackground";
import type { AppPhase } from "@/lib/commands";

export default function Home() {
  const [appPhase, setAppPhase] = useState<AppPhase>(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const view = searchParams.get("view");
      const hash = window.location.hash;
      if (
        view === "portfolio" ||
        view === "stack" ||
        view === "skills" ||
        view === "work" ||
        view === "works" ||
        hash === "#portfolio" ||
        hash === "#stack" ||
        hash === "#skills" ||
        hash === "#work"
      ) {
        return "portfolio";
      }
    }
    return "boot";
  });

  const handlePhaseChange = useCallback((phase: AppPhase) => {
    setAppPhase(phase);
  }, []);

  // Listen for query params and hash to ensure direct URL navigation / redirects
  // immediately activate the portfolio view instead of the terminal landing page.
  useEffect(() => {
    const checkUrl = () => {
      if (typeof window === "undefined") return;
      const searchParams = new URLSearchParams(window.location.search);
      const view = searchParams.get("view");
      const hash = window.location.hash;

      if (
        view === "portfolio" ||
        view === "stack" ||
        view === "skills" ||
        view === "work" ||
        view === "works" ||
        hash === "#portfolio" ||
        hash === "#stack" ||
        hash === "#skills" ||
        hash === "#work"
      ) {
        setAppPhase("portfolio");
      }
    };

    checkUrl();
    window.addEventListener("popstate", checkUrl);
    window.addEventListener("hashchange", checkUrl);
    return () => {
      window.removeEventListener("popstate", checkUrl);
      window.removeEventListener("hashchange", checkUrl);
    };
  }, []);

  const isPortfolio = appPhase === "portfolio";

  // If in portfolio mode, render the full-screen cinematic scrollytelling experience!
  if (isPortfolio) {
    return (
      <main className="relative w-full min-h-screen bg-[#0d0f14] text-white">
        <ScrollyPortfolio
          onReturnToTerminal={() => handlePhaseChange("terminal")}
        />
      </main>
    );
  }

  // Otherwise, render the cyber terminal experience
  return (
    <main
      className="
        relative w-full min-h-screen
        flex flex-col items-center justify-center
        py-8 overflow-hidden
      "
      style={{
        background: "var(--ctp-crust)",
      }}
    >
      {/* ── Matrix digital rain canvas background ── */}
      <AnimatedBackground />

      {/* ── Subtle dot-grid overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.018]"
        style={{
          zIndex: 1,
          backgroundImage:
            "linear-gradient(var(--ctp-surface0) 1px, transparent 1px), linear-gradient(90deg, var(--ctp-surface0) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* ── Top accent glow line ── */}
      <div
        className="
          pointer-events-none fixed top-0 left-1/2 -translate-x-1/2
          w-[min(90vw,640px)] h-px
          bg-gradient-to-r from-transparent via-[var(--ctp-lavender)] to-transparent
          opacity-30
        "
        style={{ zIndex: 1 }}
        aria-hidden="true"
      />

      {/* ── Terminal view ── */}
      <div
        className="w-full flex justify-center px-2 sm:px-4"
        style={{ zIndex: 10 }}
      >
        <TerminalWindow onPhaseChange={handlePhaseChange} />
      </div>

      {/* ── Contextual helper hint ── */}
      <p
        className="
          fixed bottom-5 left-0 right-0
          text-center
          text-[var(--ctp-overlay0)] text-[11px] font-mono
          select-none pointer-events-none px-4
        "
        style={{ zIndex: 20 }}
        aria-hidden="true"
      >
        {appPhase === "terminal" ? (
          <>
            type{" "}
            <kbd className="text-[var(--ctp-subtext0)] bg-[var(--ctp-surface0)] px-1.5 py-0.5 rounded text-[10px] border border-[var(--ctp-surface1)]">
              ssh tamrakar@ayush
            </kbd>{" "}
            (or start with{" "}
            <kbd className="text-[var(--ctp-subtext0)] bg-[var(--ctp-surface0)] px-1 py-0.5 rounded text-[10px] border border-[var(--ctp-surface1)]">
              ss
            </kbd>{" "}
            +{" "}
            <kbd className="text-[var(--ctp-subtext0)] bg-[var(--ctp-surface0)] px-1 py-0.5 rounded text-[10px] border border-[var(--ctp-surface1)]">
              Tab
            </kbd>
            ) ·{" "}
            <kbd className="text-[var(--ctp-subtext0)] bg-[var(--ctp-surface0)] px-1.5 py-0.5 rounded text-[10px] border border-[var(--ctp-surface1)]">
              ↑ ↓
            </kbd>{" "}
            history
          </>
        ) : appPhase === "navigation" ? (
          <>
            choose{" "}
            <span className="text-[var(--ctp-subtext0)] font-medium">
              SSH to server
            </span>{" "}
            or{" "}
            <span className="text-[var(--ctp-subtext0)] font-medium">
              Teleport
            </span>{" "}
            to proceed
          </>
        ) : (
          <>boot sequence initializing...</>
        )}
      </p>
    </main>
  );
}
