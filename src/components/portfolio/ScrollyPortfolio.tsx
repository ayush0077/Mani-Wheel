"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import ScrollyCanvas from "./ScrollyCanvas";
import TechMarquee from "./TechMarquee";
import Projects from "./Projects";
import ContactFooter from "./ContactFooter";
import TerminalModal from "@/components/terminal/TerminalModal";

interface ScrollyPortfolioProps {
  onReturnToTerminal?: () => void;
}

export default function ScrollyPortfolio({ onReturnToTerminal }: ScrollyPortfolioProps) {
  // Modal state: open terminal as a popup inside the portfolio
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Ensure document scroll is enabled when mounted in portfolio view
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;

    document.body.style.overflow = "auto";
    document.body.style.height = "auto";

    // Scroll to target hash or view section, or reset to top when navigating to main portfolio
    const scrollToTarget = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const view = searchParams.get("view");
      const hash = window.location.hash.replace("#", "");

      // If viewing the portfolio from the top, ensure viewport is at the very top
      if (!hash && (view === "portfolio" || !view)) {
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }
      if (hash === "top" || hash === "scrolly-container") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const targetId =
        hash ||
        (view === "stack" || view === "skills" ? "stack" : view === "work" ? "work" : null);

      if (targetId) {
        const target =
          document.getElementById(targetId) ||
          (targetId === "stack" ? document.getElementById("skills") : null);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    const timer1 = setTimeout(scrollToTarget, 120);
    const timer2 = setTimeout(scrollToTarget, 350);
    const timer3 = setTimeout(scrollToTarget, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, []);

  const handleOpenTerminal = () => {
    setIsTerminalOpen(true);
  };

  const handleCloseTerminal = () => {
    setIsTerminalOpen(false);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0d0f14] text-white selection:bg-violet-500/30 selection:text-white font-sans">
      {/* Floating Navigation Bar with Terminal button opening the modal popup */}
      <Navbar onReturnToTerminal={handleOpenTerminal} />

      {/* Component 1 & 2: 500vh Sticky Canvas Scroller + Parallax Overlay */}
      <ScrollyCanvas onReturnToTerminal={handleOpenTerminal} />

      {/* Infinite Technology Marquee Strip (Positioned directly after canvas scrolling, above Featured Projects) */}
      <TechMarquee />

      {/* Component 3: Work Grid (Placed right after the marquee) */}
      <Projects onLaunchTerminal={handleOpenTerminal} />

      {/* Contact & Terminal Return Footer */}
      <ContactFooter onReturnToTerminal={handleOpenTerminal} />

      {/* Terminal popup overlay modal with interactive command interpreter */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={handleCloseTerminal}
        onExitToLanding={onReturnToTerminal}
      />
    </div>
  );
}
