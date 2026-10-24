"use client";

import { useEffect, useRef } from "react";
import { Terminal, Zap } from "lucide-react";

interface NavigationOptionsProps {
  onSelectSsh: () => void;
  onSelectTeleport: () => void;
  selectedOption: "ssh" | "teleport" | null;
  disabled?: boolean;
}

export default function NavigationOptions({
  onSelectSsh,
  onSelectTeleport,
  selectedOption,
  disabled = false,
}: NavigationOptionsProps) {
  const sshButtonRef = useRef<HTMLButtonElement>(null);
  const teleportButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the first button on initial mount if not disabled
  useEffect(() => {
    if (!disabled && selectedOption === null) {
      sshButtonRef.current?.focus();
    }
  }, [disabled, selectedOption]);

  // Global key listener for hotkeys '1' and '2' when options are selectable
  useEffect(() => {
    if (disabled || selectedOption !== null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "1") {
        e.preventDefault();
        onSelectSsh();
      } else if (e.key === "2") {
        e.preventDefault();
        onSelectTeleport();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        teleportButtonRef.current?.focus();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        sshButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, selectedOption, onSelectSsh, onSelectTeleport]);

  return (
    <div
      className="my-3 space-y-2 animate-fade-in font-mono"
      role="group"
      aria-label="Navigation options"
    >
      <div className="flex items-center gap-2 text-xs text-[var(--ctp-subtext0)] select-none">
        <span className="text-[var(--ctp-mauve)] font-semibold">❯</span>
        <span>Select navigation route:</span>
        <span className="text-[var(--ctp-overlay0)] text-[11px] hidden sm:inline">
          (press <kbd className="text-[var(--ctp-subtext1)] bg-[var(--ctp-surface0)] px-1 py-0.5 rounded text-[10px] border border-[var(--ctp-surface1)]">1</kbd> or <kbd className="text-[var(--ctp-subtext1)] bg-[var(--ctp-surface0)] px-1 py-0.5 rounded text-[10px] border border-[var(--ctp-surface1)]">2</kbd>)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Option 1: SSH to server */}
        <button
          ref={sshButtonRef}
          type="button"
          onClick={onSelectSsh}
          disabled={disabled}
          tabIndex={0}
          aria-label="SSH to server: Interactive shell, ssh tamrakar@ayush"
          className={`
            group relative flex items-center justify-between
            px-3.5 py-2.5 rounded-lg text-left
            border transition-all duration-200 outline-none
            cursor-pointer select-none
            ${
              selectedOption === "ssh"
                ? "border-[var(--ctp-green)] bg-[var(--ctp-surface0)]/80 text-[var(--ctp-text)] ring-1 ring-[var(--ctp-green)]/40"
                : "border-[var(--ctp-surface1)] bg-[var(--ctp-mantle)]/90 text-[var(--ctp-subtext1)] hover:border-[var(--ctp-green)] hover:bg-[var(--ctp-surface0)] hover:text-[var(--ctp-text)] focus-visible:border-[var(--ctp-green)] focus-visible:ring-2 focus-visible:ring-[var(--ctp-green)]/40"
            }
          `}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`
                p-1.5 rounded border transition-colors
                ${
                  selectedOption === "ssh"
                    ? "bg-[var(--ctp-green)]/20 border-[var(--ctp-green)]/40 text-[var(--ctp-green)]"
                    : "bg-[var(--ctp-surface0)] border-[var(--ctp-surface1)] text-[var(--ctp-subtext0)] group-hover:text-[var(--ctp-green)] group-hover:border-[var(--ctp-green)]/30"
                }
              `}
            >
              <Terminal size={14} className="shrink-0" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="text-[var(--ctp-green)]">[1]</span>
                <span className="truncate">SSH to server</span>
              </div>
              <p className="text-[11px] text-[var(--ctp-overlay1)] truncate mt-0.5">
                Interactive shell · ssh tamrakar@ayush
              </p>
            </div>
          </div>

          {selectedOption === "ssh" && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--ctp-green)]/20 text-[var(--ctp-green)] border border-[var(--ctp-green)]/30 uppercase tracking-wider shrink-0 ml-2">
              Active
            </span>
          )}
        </button>

        {/* Option 2: Teleport */}
        <button
          ref={teleportButtonRef}
          type="button"
          onClick={onSelectTeleport}
          disabled={disabled}
          tabIndex={0}
          aria-label="Teleport: Direct portfolio bypass, Instant"
          className={`
            group relative flex items-center justify-between
            px-3.5 py-2.5 rounded-lg text-left
            border transition-all duration-200 outline-none
            cursor-pointer select-none
            ${
              selectedOption === "teleport"
                ? "border-[var(--ctp-mauve)] bg-[var(--ctp-surface0)]/80 text-[var(--ctp-text)] ring-1 ring-[var(--ctp-mauve)]/40"
                : "border-[var(--ctp-surface1)] bg-[var(--ctp-mantle)]/90 text-[var(--ctp-subtext1)] hover:border-[var(--ctp-mauve)] hover:bg-[var(--ctp-surface0)] hover:text-[var(--ctp-text)] focus-visible:border-[var(--ctp-mauve)] focus-visible:ring-2 focus-visible:ring-[var(--ctp-mauve)]/40"
            }
          `}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`
                p-1.5 rounded border transition-colors
                ${
                  selectedOption === "teleport"
                    ? "bg-[var(--ctp-mauve)]/20 border-[var(--ctp-mauve)]/40 text-[var(--ctp-mauve)]"
                    : "bg-[var(--ctp-surface0)] border-[var(--ctp-surface1)] text-[var(--ctp-subtext0)] group-hover:text-[var(--ctp-mauve)] group-hover:border-[var(--ctp-mauve)]/30"
                }
              `}
            >
              <Zap size={14} className="shrink-0" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="text-[var(--ctp-mauve)]">[2]</span>
                <span className="truncate">Teleport</span>
              </div>
              <p className="text-[11px] text-[var(--ctp-overlay1)] truncate mt-0.5">
                Teleport to Mani Wheel · /mani-wheel
              </p>
            </div>
          </div>

          {selectedOption === "teleport" && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--ctp-mauve)]/20 text-[var(--ctp-mauve)] border border-[var(--ctp-mauve)]/30 uppercase tracking-wider shrink-0 ml-2">
              Jumping...
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
