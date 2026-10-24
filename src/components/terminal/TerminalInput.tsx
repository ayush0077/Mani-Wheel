"use client";

import { forwardRef } from "react";

interface TerminalInputProps {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  prompt: string;
  disabled?: boolean;
  suggestionRemainder?: string;
  onAcceptSuggestion?: () => void;
}

const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  (
    {
      value,
      onChange,
      onKeyDown,
      prompt,
      disabled,
      suggestionRemainder = "",
      onAcceptSuggestion,
    },
    ref
  ) => {
    return (
      <div className="flex items-center gap-2">
        {/* Prompt */}
        <span className="text-[var(--ctp-green)] select-none shrink-0 font-medium whitespace-nowrap">
          {prompt}
        </span>

        {/* Input + autocomplete ghost wrapper */}
        <div className="relative flex-1 min-w-0 flex items-center">
          {/* Inline ghost text suggestion */}
          {suggestionRemainder && (
            <div
              aria-hidden="true"
              className="
                absolute left-0 top-0 h-full w-full
                flex items-center
                pointer-events-none select-none
                font-mono text-sm leading-normal
                whitespace-pre
              "
            >
              {/* Invisible spacer identical to user's typed text */}
              <span className="opacity-0">{value}</span>
              {/* Autocomplete suggestion remainder */}
              <span className="text-[var(--ctp-overlay0)] opacity-70 italic">
                {suggestionRemainder}
              </span>
            </div>
          )}

          <input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-autocomplete="inline"
            aria-label={
              suggestionRemainder
                ? "Terminal command input, autocomplete: ssh tamrakar@ayush (press Tab to accept, Enter to execute)"
                : "Terminal command input"
            }
            className="
              w-full bg-transparent border-none outline-none
              text-[var(--ctp-text)] font-mono text-sm leading-normal
              caret-[var(--ctp-mauve)]
              disabled:opacity-0
              pr-1 relative z-10
            "
          />

          {/* Mobile-friendly Tab button shown when suggestion is active */}
          {suggestionRemainder && onAcceptSuggestion && (
            <button
              type="button"
              onClick={onAcceptSuggestion}
              tabIndex={-1}
              title="Accept suggestion: ssh tamrakar@ayush (or press Tab / Enter)"
              aria-label="Accept suggestion: ssh tamrakar@ayush"
              className="
                relative z-20 shrink-0 ml-1.5
                flex items-center gap-1
                px-1.5 py-0.5 rounded text-[10px] font-mono
                text-[var(--ctp-subtext0)] bg-[var(--ctp-surface0)]
                border border-[var(--ctp-surface1)]
                hover:border-[var(--ctp-mauve)] hover:text-[var(--ctp-text)]
                transition-colors cursor-pointer select-none
              "
            >
              <span>Tab</span>
              <span className="text-[var(--ctp-overlay1)]">⇥</span>
            </button>
          )}
        </div>
      </div>
    );
  }
);

TerminalInput.displayName = "TerminalInput";

export default TerminalInput;
