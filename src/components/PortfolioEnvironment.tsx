"use client";

import { useEffect, useState } from "react";
import { Folder, User, Mail, Code2, ChevronRight } from "lucide-react";

const NAV_ITEMS = [
  { icon: User, label: "about", color: "text-[var(--ctp-blue)]" },
  { icon: Code2, label: "projects", color: "text-[var(--ctp-mauve)]" },
  { icon: Folder, label: "skills", color: "text-[var(--ctp-peach)]" },
  { icon: Mail, label: "contact", color: "text-[var(--ctp-green)]" },
];

const ASCII_LOGO = `
  ██████╗ ██╗   ██╗██╗   ██╗███████╗██╗  ██╗
  ██╔══██╗╚██╗ ██╔╝██║   ██║██╔════╝██║  ██║
  ███████║ ╚████╔╝ ██║   ██║███████╗███████║
  ██╔══██║  ╚██╔╝  ██║   ██║╚════██║██╔══██║
  ██║  ██║   ██║   ╚██████╔╝███████║██║  ██║
  ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝
`.trim();

export default function PortfolioEnvironment() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`
        w-full max-w-2xl px-4
        transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
      `}
      style={{
        transitionProperty: "opacity, transform",
      }}
    >
      {/* ASCII Logo */}
      <pre
        className="
          text-[var(--ctp-mauve)] text-[8px] sm:text-[10px] leading-tight
          font-mono text-center mb-8
          select-none hidden sm:block
          text-glow-blue
        "
        aria-hidden="true"
      >
        {ASCII_LOGO}
      </pre>

      {/* Welcome card */}
      <div
        className="
          rounded-xl border border-[var(--ctp-surface0)]
          bg-[var(--ctp-base)]
          p-6 sm:p-8
          mb-6
        "
        style={{
          boxShadow:
            "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(180,190,254,0.04)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-[var(--ctp-green)] animate-pulse" />
          <span className="text-[var(--ctp-subtext0)] text-xs font-mono tracking-widest uppercase">
            Connection active
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--ctp-text)] mb-2 font-mono">
          Hey, I&apos;m <span className="text-[var(--ctp-mauve)]">Ayush</span>
          <span className="inline-block animate-[cursor-blink_1s_step-end_infinite] text-[var(--ctp-mauve)]">
            _
          </span>
        </h1>

        <p className="text-[var(--ctp-subtext1)] text-sm sm:text-base leading-relaxed mb-6 font-mono">
          Portfolio environment ready.{" "}
          <span className="text-[var(--ctp-green)]">Phase 2 coming soon.</span>
        </p>

        <div className="rounded-lg bg-[var(--ctp-mantle)] border border-[var(--ctp-surface0)] p-4 font-mono text-sm">
          <div className="text-[var(--ctp-overlay0)] text-xs mb-2 tracking-wider">~/README.md</div>
          <p className="text-[var(--ctp-subtext1)] leading-relaxed">
            This is a placeholder for the full portfolio. The terminal interface
            above is Phase 1 — the interactive landing experience.
          </p>
          <p className="text-[var(--ctp-subtext0)] mt-2 text-xs italic">
            Full sections (about, projects, skills, contact) will be built in Phase 2.
          </p>
        </div>
      </div>

      {/* Nav preview */}
      <div className="grid grid-cols-2 gap-3">
        {NAV_ITEMS.map(({ icon: Icon, label, color }, i) => (
          <div
            key={label}
            className="
              flex items-center gap-3 px-4 py-3
              rounded-lg
              border border-[var(--ctp-surface0)]
              bg-[var(--ctp-base)]
              hover:border-[var(--ctp-surface1)]
              hover:bg-[var(--ctp-mantle)]
              transition-all duration-200
              cursor-default
              group
            "
            style={{
              animationDelay: `${i * 80}ms`,
            }}
          >
            <Icon size={16} className={`${color} shrink-0`} />
            <span className="text-[var(--ctp-subtext1)] text-sm font-mono group-hover:text-[var(--ctp-text)] transition-colors">
              ~/{label}
            </span>
            <ChevronRight
              size={12}
              className="ml-auto text-[var(--ctp-overlay0)] group-hover:text-[var(--ctp-subtext0)] transition-colors"
            />
          </div>
        ))}
      </div>

      <p className="text-center text-[var(--ctp-overlay0)] text-xs font-mono mt-6">
        ssh session active · tamrakar@ayush · ctrl+d to disconnect
      </p>
    </div>
  );
}
