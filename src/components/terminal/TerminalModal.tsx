"use client";

import { useEffect, useRef, useCallback } from "react";
import TitleBar from "./TitleBar";
import TerminalInput from "./TerminalInput";
import { TerminalOutputLine } from "./OutputLine";
import { useTerminal } from "@/hooks/useTerminal";
import type { OutputLine } from "@/lib/commands";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExitToLanding?: () => void;
}

const INITIAL_PORTFOLIO_LINES: OutputLine[] = [
  {
    type: "output",
    content: "Connected to tamrakar@ayush (portfolio session tty2)",
    className: "text-[var(--ctp-green)] font-semibold",
  },
  {
    type: "output",
    content: "Arch Linux 6.11.0-arch1-1 · Interactive Shell Ready",
    className: "text-[var(--ctp-blue)]",
  },
  {
    type: "output",
    content: "Navigation: type `cd /works`, `cd /stacks`, `cd /contact`, or `help`",
    className: "text-[var(--ctp-subtext1)]",
  },
  {
    type: "output",
    content: "Tip: run `rm -rf /` for fun ;)",
    className: "text-[var(--ctp-yellow)] italic text-xs",
  },
];

export default function TerminalModal({
  isOpen,
  onClose,
  onExitToLanding,
}: TerminalModalProps) {
  // Navigation handler to smoothly scroll the portfolio to target sections
  const handleNavigateSection = useCallback((section: string) => {
    if (section === "works") {
      const el = document.getElementById("work");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (section === "stacks") {
      const el = document.getElementById("skills");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (section === "contact") {
      const el = document.getElementById("contact");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const {
    outputLines,
    inputValue,
    setInputValue,
    handleKeyDown,
    prompt,
    suggestionRemainder,
    acceptSuggestion,
  } = useTerminal({
    initialPhase: "terminal",
    initialLines: INITIAL_PORTFOLIO_LINES,
    onNavigateSection: handleNavigateSection,
    onExit: onClose,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
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

  // Track if user is near bottom
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    isNearBottomRef.current = distanceFromBottom < 80;
  }, []);

  // MutationObserver + ResizeObserver auto-scroll for new outputs
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, scrollToBottom]);

  // Auto-focus input when modal opens and whenever output arrives
  useEffect(() => {
    if (isOpen) {
      isNearBottomRef.current = true;
      scrollToBottom(false);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen && outputLines.length > 0) {
      isNearBottomRef.current = true;
      scrollToBottom(true);
      inputRef.current?.focus();
    }
  }, [outputLines, isOpen, scrollToBottom]);

  // Close on Escape key press, or auto-focus typing
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Auto-transfer typing into terminal input
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

      if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") {
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose]);

  // Click on modal background closes it; click inside terminal window focuses input
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleWindowClick = () => {
    const selection = typeof window !== "undefined" ? window.getSelection() : null;
    if (!selection || selection.isCollapsed) {
      inputRef.current?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        p-3 sm:p-6
        bg-black/80 backdrop-blur-md
        animate-fade-in
      "
      role="dialog"
      aria-modal="true"
      aria-label="Terminal Session Popup"
    >
      <div
        ref={modalContentRef}
        onClick={handleWindowClick}
        className="
          relative flex flex-col
          rounded-xl
          border border-[var(--ctp-surface0)]
          bg-[var(--ctp-base)]
          overflow-hidden
          cursor-text
          shadow-2xl
          animate-scale-in
        "
        style={{
          width: "min(92vw, 950px)",
          maxWidth: "1000px",
          height: "clamp(480px, 66vh, 580px)",
          maxHeight: "82vh",
          boxShadow:
            "0 0 0 1px rgba(180,190,254,0.12), 0 32px 70px -12px rgba(0,0,0,0.85), 0 12px 28px -6px rgba(0,0,0,0.6)",
        }}
      >
        {/* Title bar with close button */}
        <TitleBar
          title="tamrakar@ayush: ~ (portfolio session)"
          onClose={onClose}
        />

        {/* Terminal scroll body */}
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
          {/* Interactive terminal output lines */}
          {outputLines.length > 0 && (
            <div className="space-y-0.5">
              {outputLines.map((line, i) => (
                <TerminalOutputLine key={i} line={line} />
              ))}
            </div>
          )}

          {/* Interactive input row */}
          <div className="mt-2.5">
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

          {/* Breathing clearance anchor */}
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
            <span className="text-[var(--ctp-overlay0)] hidden sm:inline">
              (type <code className="text-[var(--ctp-subtext1)] font-semibold">cd /works</code> or <code className="text-[var(--ctp-subtext1)] font-semibold">exit</code>)
            </span>
          </div>
          <div className="flex items-center gap-4">
            {onExitToLanding && (
              <button
                type="button"
                onClick={onExitToLanding}
                className="hover:text-[var(--ctp-red)] transition-colors cursor-pointer underline decoration-dotted"
                title="Disconnect from portfolio and return to boot terminal"
              >
                disconnect
              </button>
            )}
            <span>bash 5.2.37</span>
            <span className="text-[var(--ctp-blue)]">UTF-8</span>
            <span className="text-[var(--ctp-mauve)] font-semibold">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
