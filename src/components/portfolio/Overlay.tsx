"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import { ArrowDown, Layers, Cpu } from "lucide-react";

interface OverlayProps {
  scrollYProgress: MotionValue<number>;
  onReturnToTerminal?: () => void;
}

export default function Overlay({
  scrollYProgress,
  onReturnToTerminal,
}: OverlayProps) {
  // ── Section 1: Hero (0% scroll, fades out around 20-25%) ──
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12, 0.22], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, -80]);
  const heroScale = useTransform(scrollYProgress, [0, 0.22], [1, 0.94]);

  // ── Section 2: Craft & Experiences (peaks ~30-35%, fades out ~48%) ──
  const sec2Opacity = useTransform(
    scrollYProgress,
    [0.18, 0.28, 0.38, 0.48],
    [0, 1, 1, 0]
  );
  const sec2Y = useTransform(scrollYProgress, [0.18, 0.32, 0.48], [80, 0, -80]);

  // ── Section 3: Engineering & Design (peaks ~60-65%, fades out ~78%) ──
  const sec3Opacity = useTransform(
    scrollYProgress,
    [0.48, 0.58, 0.68, 0.78],
    [0, 1, 1, 0]
  );
  const sec3Y = useTransform(scrollYProgress, [0.48, 0.62, 0.78], [80, 0, -80]);

  // ── Section 4: Scroll Transition to Work (peaks ~85-95%) ──
  const sec4Opacity = useTransform(
    scrollYProgress,
    [0.78, 0.88, 0.98, 1],
    [0, 1, 1, 0.7]
  );
  const sec4Y = useTransform(scrollYProgress, [0.78, 0.9], [60, 0]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center p-6 sm:p-10 md:p-16 overflow-hidden">
      {/* ── Centered / Positioned Sections ── */}
      <div className="relative w-full max-w-6xl mx-auto flex-1 flex items-center justify-center">
        {/* ── Section 1: Hero (0% scroll) ── */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          {/* Subtle radial dark gradient behind central hero content for contrast against samurai frames */}
          <div
            className="pointer-events-none absolute w-[min(90vw,680px)] h-[380px] rounded-full opacity-65 blur-3xl -z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(13,15,20,0.88) 0%, rgba(13,15,20,0.42) 55%, transparent 75%)",
            }}
            aria-hidden="true"
          />

          {/* Eyebrow label pill consistent with navbar */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0d0f14]/85 border border-white/[0.16] backdrop-blur-md shadow-xl mb-3.5 sm:mb-4 select-none">
            <span
              className="w-2 h-2 rounded-full bg-[#A6E3A1] shadow-[0_0_8px_#A6E3A1] animate-pulse motion-reduce:animate-none shrink-0"
              aria-hidden="true"
            />
            <span className="text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.12em] text-[#E5E5EB]">
              CREATIVE DEVELOPER{" "}
              <span className="text-[#CBA6F7] mx-1.5 font-semibold">{"//"}</span>{" "}
              ENGINEER
            </span>
          </div>

          {/* Editorial name: Flowing Cursive Script (reduced 15-20%) */}
          <h1
            className="
              font-editorial-name
              text-[#F5F3EF]
              text-center
              select-none
              px-4 py-0.5
              overflow-visible
            "
            style={{
              fontSize: "clamp(3.1rem, 7vw, 6.1rem)",
              lineHeight: 1.15,
              letterSpacing: "0.01em",
              textShadow:
                "0 4px 32px rgba(0,0,0,0.9), 0 2px 14px rgba(0,0,0,0.8), 0 0 50px rgba(0,0,0,0.6)",
            }}
          >
            Ayush Tamrakar
          </h1>

          {/* Subtitle directly beneath name */}
          <p
            className="font-sans font-normal text-[#E5E5EB] mt-1.5 sm:mt-2 mb-2 sm:mb-2.5 tracking-wide text-center"
            style={{
              fontSize: "clamp(1.1rem, 2vw, 1.45rem)",
              textShadow: "0 2px 14px rgba(0,0,0,0.7)",
            }}
          >
            Creative Developer
          </p>

          {/* Supporting statement */}
          <p
            className="
              max-w-[520px] mx-auto text-center
              text-[14px] sm:text-[15px] md:text-[16px]
              leading-[1.7]
              text-[#D1D1D8]
              font-sans font-normal
              px-4 mb-5 sm:mb-6
            "
            style={{
              textShadow: "0 2px 12px rgba(0,0,0,0.75)",
            }}
          >
            Building immersive digital experiences at the intersection of code, design, and systems.
          </p>

          {/* Hero actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pointer-events-auto mb-5 sm:mb-6">
            {/* Action 1: Explore work */}
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="
                group inline-flex items-center gap-2
                px-4.5 py-2 rounded-full
                bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98]
                border border-white/[0.16] hover:border-white/30
                text-[11px] sm:text-xs font-mono uppercase tracking-[0.1em]
                text-[#F5F3EF] hover:text-white
                backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg
              "
            >
              <span>EXPLORE MY WORK</span>
              <span className="text-[#CBA6F7] group-hover:translate-y-0.5 transition-transform duration-200">
                ↓
              </span>
            </a>

            {/* Action 2: Open terminal */}
            {onReturnToTerminal && (
              <button
                type="button"
                onClick={onReturnToTerminal}
                className="
                  group inline-flex items-center gap-2
                  px-4.5 py-2 rounded-full
                  bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98]
                  border border-white/[0.16] hover:border-violet-400/40
                  text-[11px] sm:text-xs font-mono uppercase tracking-[0.1em]
                  text-[#F5F3EF] hover:text-white
                  backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg
                "
              >
                <span>SSH INTO MY WORLD</span>
                <span className="text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                  ↗
                </span>
              </button>
            )}
          </div>

          {/* Scroll scrubber indicator */}
          <div className="flex flex-col items-center gap-2 select-none">
            <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
              Scroll down to scrub timeline
            </span>
            <div className="w-5 h-8 rounded-full border-2 border-zinc-500/50 flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-violet-400"
              />
            </div>
          </div>
        </motion.div>

        {/* ── Section 2: Craft & Philosophy (30% scroll) - Left Aligned ── */}
        <motion.div
          style={{ opacity: sec2Opacity, y: sec2Y }}
          className="absolute inset-y-0 left-0 flex flex-col justify-center max-w-xl text-left px-4 sm:px-6"
        >
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono">
              <Layers size={12} />
              <span>INTRO</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              I build digital experiences.
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
              Every detail is engineered with intention. From high-refresh-rate canvas
              rendering to spring-damped micro-interactions, turning raw code into
              tangible emotion on screen.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-[11px] font-mono text-zinc-400">
                ⚡ 60 FPS Scrubbing
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-[11px] font-mono text-zinc-400">
                🎯 Patience
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-[11px] font-mono text-zinc-400">
                ✨ Agile and Flexible
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Section 3: Engineering & Vision (60% scroll) - Right Aligned ── */}
        <motion.div
          style={{ opacity: sec3Opacity, y: sec3Y }}
          className="absolute inset-y-0 right-0 flex flex-col justify-center max-w-xl text-right px-4 sm:px-6 ml-auto"
        >
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-mono">
              <Cpu size={12} />
              <span>SYNERGY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Bridging design and engineering.
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
              Eliminating the gap between avant-garde visual aesthetics and robust,
              bulletproof software systems. Seamlessly translating creative ambitions
              into low-latency, scalable production web architectures.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-[11px] font-mono text-zinc-400">
                TypeScript & Next.js 16
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-[11px] font-mono text-zinc-400">
                GPU accelerated 
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-[11px] font-mono text-zinc-400">
                Hardware Accelerated
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Section 4: Transition to Selected Works (90% scroll) ── */}
        <motion.div
          style={{ opacity: sec4Opacity, y: sec4Y }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
        >
          <div className="p-8 rounded-2xl bg-[#0d0f14]/85 border border-white/10 backdrop-blur-xl shadow-2xl max-w-lg space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-violet-400 font-mono">
              Timeline Scrubber Concluded
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Selected Projects Ahead
            </h2>
            <p className="text-sm text-zinc-300">
              Continue scrolling downward to explore curated case studies and interactive systems.
            </p>
            <div className="pt-2 flex justify-center">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-violet-400"
              >
                <ArrowDown size={18} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom HUD Footer ── */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <div className="hidden sm:block">
          STATUS: <span className="text-emerald-400">STREAMING FRAMES</span>
        </div>
        <div className="flex items-center gap-4 mx-auto sm:mx-0">
          <span>LATENCY: 0ms</span>
          <span>·</span>
          <span>DPR: 2.0x HI-RES</span>
        </div>
      </div>
    </div>
  );
}
