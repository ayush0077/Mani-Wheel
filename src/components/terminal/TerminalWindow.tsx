"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import TitleBar from "./TitleBar";
import BootSequence from "./BootSequence";
import NavigationOptions from "./NavigationOptions";
import SshConnect from "./SshConnect";
import TerminalInput from "./TerminalInput";
import { TerminalOutputLine } from "./OutputLine";
import { useTerminal } from "@/hooks/useTerminal";
import type { AppPhase } from "@/lib/commands";

interface TerminalWindowProps {
  onPhaseChange: (phase: AppPhase) => void;
}

export default function TerminalWindow({ onPhaseChange }: TerminalWindowProps) {
  // Navigation handler if user executes cd /works, cd /stacks, cd /contact on landing page
  const handleNavigateSection = useCallback(
    (section: string) => {
      onPhaseChange("portfolio");
      setTimeout(() => {
        if (section === "works") {
          document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
        } else if (section === "stacks") {
          document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
        } else if (section === "contact") {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    },
    [onPhaseChange]
  );

  const {
    outputLines,
    inputValue,
    setInputValue,
    handleKeyDown,
    phase,
    setPhase,
    onPhaseComplete,
    prompt,
    suggestionRemainder,
    acceptSuggestion,
  } = useTerminal({
    onNavigateSection: handleNavigateSection,
  });

  const [selectedRoute, setSelectedRoute] = useState<"ssh" | "teleport" | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef<boolean>(true);

  // Smoothly scroll the terminal output container to the bottom
  const scrollToBottom = useCallback((smooth = true) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    requestAnimationFrame(() => {
      if (!el) return;
      el.scrollTo({
        top: el.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    });
  }, []);

  // Track if user is near bottom (within 80px) or intentionally scrolled up to read history
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    isNearBottomRef.current = distanceFromBottom < 80;
  }, []);

  // 1. MutationObserver + ResizeObserver: Terminal Auto-Scroll (Follow / Tail output)
  // Automatically scrolls whenever new output is added (BootSequence, SshConnect, command responses)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const mutationObserver = new MutationObserver(() => {
      if (isNearBottomRef.current) {
        scrollToBottom(true);
      }
    });

    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const resizeObserver = new ResizeObserver(() => {
      if (isNearBottomRef.current) {
        scrollToBottom(true);
      }
    });

    resizeObserver.observe(el);

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [scrollToBottom]);

  // Focus input when clicking terminal container during interactive phase (unless selecting text)
  const handleContainerClick = useCallback(() => {
    if (phase === "terminal") {
      const selection = typeof window !== "undefined" ? window.getSelection() : null;
      if (!selection || selection.isCollapsed) {
        inputRef.current?.focus();
      }
    }
  }, [phase]);

  // Handle boot sequence completion
  const handleBootComplete = useCallback(() => {
    setPhase("navigation");
    onPhaseChange("navigation");
    isNearBottomRef.current = true;
    scrollToBottom(true);
  }, [setPhase, onPhaseChange, scrollToBottom]);

  // Handle SSH route selection (Option [1])
  const handleSelectSsh = useCallback(() => {
    setSelectedRoute("ssh");
    setPhase("terminal");
    onPhaseChange("terminal");
    isNearBottomRef.current = true;
    scrollToBottom(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [setPhase, onPhaseChange, scrollToBottom]);

  const router = useRouter();

  // Handle Teleport route selection (direct transition to Mani Wheel)
  const handleSelectTeleport = useCallback(() => {
    setSelectedRoute("teleport");
    router.push("/mani-wheel");
  }, [router]);

  // Handle SSH connecting sequence completion
  const handleSshComplete = useCallback(
    (next: AppPhase) => {
      onPhaseComplete(next);
      onPhaseChange(next);
    },
    [onPhaseComplete, onPhaseChange]
  );

  // 2. Auto-focus management:
  // - Focus input immediately when terminal phase becomes active
  // - Refocus when commands finish executing
  useEffect(() => {
    if (phase === "terminal") {
      isNearBottomRef.current = true;
      scrollToBottom(true);
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [phase, scrollToBottom]);

  // Refocus input and scroll to bottom when new command output is added
  useEffect(() => {
    if (outputLines.length > 0) {
      isNearBottomRef.current = true;
      scrollToBottom(true);
      if (phase === "terminal") {
        inputRef.current?.focus();
      }
    }
  }, [outputLines, phase, scrollToBottom]);

  // When phase becomes ssh-connecting, ensure tail lock so connection lines scroll into view
  useEffect(() => {
    if (phase === "ssh-connecting") {
      isNearBottomRef.current = true;
      scrollToBottom(true);
    }
  }, [phase, scrollToBottom]);

  // Global keystroke listener: automatically captures typing into the terminal input
  // when the terminal is in interactive mode, so the user doesn't even need to click first
  useEffect(() => {
    if (phase !== "terminal") return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is already typing in an input/textarea or using shortcut keys (Ctrl/Cmd/Alt)
      if (
        document.activeElement === inputRef.current ||
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      ) {
        return;
      }

      // If user typed a printable character, backspace, or enter, focus the terminal input
      if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") {
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [phase]);

  const showNavigation = phase !== "boot";
  const isInputVisible = phase === "terminal";

  return (
    <div
      onClick={handleContainerClick}
      className="
        relative flex flex-col
        rounded-xl
        border border-[var(--ctp-surface0)]
        bg-[var(--ctp-base)]
        overflow-hidden
        cursor-text
        transition-all duration-300
      "
      style={{
        width: "min(92vw, 950px)",
        maxWidth: "1000px",
        height: "clamp(500px, 66vh, 580px)",
        maxHeight: "82vh",
        boxShadow:
          "0 0 0 1px rgba(180,190,254,0.08), 0 32px 64px -12px rgba(0,0,0,0.75), 0 12px 24px -6px rgba(0,0,0,0.5)",
      }}
      role="application"
      aria-label="Terminal emulator"
    >
      {/* Title bar */}
      <TitleBar
        title={
          phase === "ssh-connecting" || phase === "portfolio"
            ? "ssh — tamrakar@ayush: ~"
            : "tamrakar@ayush: ~"
        }
      />

      {/* Terminal body */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="
          flex-1 overflow-y-auto overflow-x-hidden
          terminal-scroll
          px-4 py-4 sm:px-6 sm:py-5
          font-mono text-sm leading-relaxed
        "
      >
        {/* Boot sequence (stays visible once finished) */}
        <BootSequence onComplete={handleBootComplete} />

        {/* Navigation options shown after boot sequence finishes */}
        {showNavigation && (
          <NavigationOptions
            onSelectSsh={handleSelectSsh}
            onSelectTeleport={handleSelectTeleport}
            selectedOption={selectedRoute}
            disabled={phase === "ssh-connecting" || phase === "portfolio"}
          />
        )}

        {/* Interactive terminal output lines */}
        {outputLines.length > 0 && (
          <div className="space-y-0.5 mt-2">
            {outputLines.map((line, i) => (
              <TerminalOutputLine key={i} line={line} />
            ))}
          </div>
        )}

        {/* SSH connecting animation sequence */}
        {phase === "ssh-connecting" && (
          <div className="mt-2">
            <SshConnect onComplete={handleSshComplete} />
          </div>
        )}

        {/* Interactive input row revealed beneath completed boot & nav */}
        {isInputVisible && (
          <div className="mt-2">
            <TerminalInput
              ref={inputRef}
              value={inputValue}
              onChange={setInputValue}
              onKeyDown={handleKeyDown}
              prompt={prompt}
              suggestionRemainder={suggestionRemainder}
              onAcceptSuggestion={acceptSuggestion}
            />
          </div>
        )}

        {/* Breathing clearance anchor at bottom of scroll container */}
        <div className="h-3 shrink-0 pointer-events-none" aria-hidden="true" />
      </div>

      {/* Bottom status bar */}
      <div
        className="
          flex items-center justify-between
          px-4 py-1.5
          bg-[var(--ctp-mantle)]
          border-t border-[var(--ctp-surface0)]
          text-[10px] font-mono
          text-[var(--ctp-overlay0)]
          select-none
          shrink-0
        "
        aria-hidden="true"
      >
        <div className="flex items-center gap-3">
          <span className="text-[var(--ctp-green)]">●</span>
          <span>tamrakar@ayush</span>
        </div>
        <div className="flex items-center gap-4">
          <span>bash 5.2.37</span>
          <span className="text-[var(--ctp-blue)]">UTF-8</span>
          <span className="text-[var(--ctp-mauve)]">
            {phase === "boot"
              ? "BOOT"
              : phase === "navigation"
              ? "SELECT"
              : phase === "ssh-connecting"
              ? "SSH"
              : "READY"}
          </span>
        </div>
      </div>
    </div>
  );
}
