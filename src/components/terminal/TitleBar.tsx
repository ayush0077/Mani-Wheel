"use client";

import { X } from "lucide-react";

interface TitleBarProps {
  title?: string;
  onClose?: () => void;
}

export default function TitleBar({
  title = "tamrakar@ayush: ~",
  onClose,
}: TitleBarProps) {
  return (
    <div
      className="
        flex items-center justify-between px-4 py-3
        bg-[var(--ctp-mantle)]
        border-b border-[var(--ctp-surface0)]
        rounded-t-xl
        select-none
      "
    >
      {/* Window controls */}
      <div className="flex items-center gap-2">
        {/* Close */}
        <button
          onClick={onClose}
          type="button"
          className={`
            w-3 h-3 rounded-full
            bg-[var(--ctp-red)]
            hover:brightness-110 active:scale-95
            transition-all duration-150
            flex items-center justify-center
            group
            ${onClose ? "cursor-pointer" : "cursor-default"}
          `}
          tabIndex={onClose ? 0 : -1}
          aria-label={onClose ? "Close terminal window" : undefined}
          title={onClose ? "Close terminal (Esc)" : undefined}
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path
                d="M1 1L5 5M5 1L1 5"
                stroke="#450a0a"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>

        {/* Minimize */}
        <button
          type="button"
          className="
            w-3 h-3 rounded-full
            bg-[var(--ctp-yellow)]
            hover:brightness-110
            transition-all duration-150
            flex items-center justify-center
            group cursor-default
          "
          tabIndex={-1}
          aria-hidden="true"
        >
          <span className="opacity-0 group-hover:opacity-70 transition-opacity">
            <svg width="6" height="2" viewBox="0 0 6 2" fill="none">
              <path
                d="M1 1H5"
                stroke="#451a03"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>

        {/* Maximize */}
        <button
          type="button"
          className="
            w-3 h-3 rounded-full
            bg-[var(--ctp-green)]
            hover:brightness-110
            transition-all duration-150
            flex items-center justify-center
            group cursor-default
          "
          tabIndex={-1}
          aria-hidden="true"
        >
          <span className="opacity-0 group-hover:opacity-70 transition-opacity">
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <rect
                x="1"
                y="1"
                width="4"
                height="4"
                rx="0.5"
                stroke="#052e16"
                strokeWidth="1"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* Title */}
      <div className="flex-1 text-center px-2 truncate">
        <span className="text-[var(--ctp-subtext0)] text-xs font-mono font-medium tracking-wide">
          {title}
        </span>
      </div>

      {/* Right side close pill or spacer */}
      <div className="flex items-center justify-end w-[64px]">
        {onClose ? (
          <button
            onClick={onClose}
            type="button"
            className="
              flex items-center gap-1 px-1.5 py-0.5 rounded
              text-[10px] font-mono text-[var(--ctp-subtext0)]
              bg-[var(--ctp-surface0)] hover:bg-[var(--ctp-surface1)]
              hover:text-[var(--ctp-text)]
              border border-[var(--ctp-surface1)]
              transition-colors cursor-pointer
            "
            title="Close terminal (Esc)"
          >
            <span className="text-[9px] uppercase tracking-wider text-[var(--ctp-overlay1)]">
              ESC
            </span>
            <X size={10} />
          </button>
        ) : (
          <div className="w-12" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
