"use client";

import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

interface NavbarProps {
  onReturnToTerminal?: () => void;
}

export default function Navbar({ onReturnToTerminal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetElement =
      document.getElementById(targetId) ||
      (targetId === "stack" ? document.getElementById("skills") : null);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${targetId}`);
    } else {
      window.location.hash = `#${targetId}`;
    }
  };

  return (
    <header className="fixed top-5 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav
        className={`
          pointer-events-auto flex items-center justify-between gap-4 sm:gap-8
          px-4 sm:px-6 py-2.5 rounded-full
          transition-all duration-300
          ${
            scrolled
              ? "bg-[#0d0f14]/85 border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/50"
              : "bg-white/[0.04] border border-white/10 backdrop-blur-md"
          }
        `}
      >
        {/* Brand / Status */}
        <a
          href="#scrolly-container"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.pushState(null, "", "#top");
          }}
          className="flex items-center gap-2.5 text-xs font-mono font-medium text-white hover:text-violet-300 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wider uppercase">SERVER — ONLINE</span>
        </a>

        {/* Section Links */}
        <div className="hidden md:flex items-center gap-5 text-xs font-mono text-zinc-400">
          <a
            href="#work"
            onClick={(e) => handleNavClick(e, "work")}
            className="hover:text-white transition-colors"
          >
            {"|| WORK"}
          </a>
          <a
            href="#stack"
            onClick={(e) => handleNavClick(e, "stack")}
            className="hover:text-white transition-colors"
          >
            {"|| STACK"}
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="hover:text-white transition-colors"
          >
            {"|| CONTACT"}
          </a>
        </div>

        {/* Terminal Quick Switch */}
        {onReturnToTerminal && (
          <button
            onClick={onReturnToTerminal}
            type="button"
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:text-white text-xs font-mono transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02]"
            title="Open Interactive Terminal"
          >
            <Terminal size={12} className="text-violet-400" />
            <span className="hidden sm:inline">TERMINAL</span>
          </button>
        )}
      </nav>
    </header>
  );
}
