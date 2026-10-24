"use client";

import type { OutputLine } from "@/lib/commands";

interface OutputLineProps {
  line: OutputLine;
}

export function TerminalOutputLine({ line }: OutputLineProps) {
  if (line.type === "input") {
    return (
      <div className="flex items-start gap-2 animate-fade-in">
        <span className="text-[var(--ctp-green)] select-none shrink-0 font-medium">
          {line.prompt}
        </span>
        <span className="text-[var(--ctp-text)] break-all">{line.content}</span>
      </div>
    );
  }

  if (line.type === "error") {
    return (
      <div className="animate-fade-in text-[var(--ctp-red)] break-all">
        {line.content}
      </div>
    );
  }

  if (line.type === "ssh") {
    return (
      <div
        className={`animate-fade-in ${line.className || "text-[var(--ctp-green)]"}`}
      >
        {line.content}
      </div>
    );
  }

  // type: "output"
  return (
    <div className={`animate-fade-in break-all ${line.className || "text-[var(--ctp-text)]"}`}>
      {line.content === "" ? <>&nbsp;</> : line.content}
    </div>
  );
}
