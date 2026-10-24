"use client";

import React from "react";

export const DEFAULT_TECHNOLOGIES_ROW_1 = [
  "Python",
  "SQL",
  "Java",
  "Oracle",
  "Node.js",
  "TypeScript",
  "React",
  "HTML5",
  "CSS3",
  "Docker",
  "Linux",
  "PostgreSQL",
  "Git",
  "Next.js",
] as const;

export const DEFAULT_TECHNOLOGIES_ROW_2 = [
  "Docker",
  "PostgreSQL",
  "Linux",
  "Git",
  "Next.js",
  "TypeScript",
  "Python",
  "SQL",
  "Tailwind CSS",
  "TensorFlow",
  "Keras",
  "OpenCV",
  "NumPy",
  "Pandas",
  "Java",
  "Oracle",
] as const;

// Backward compatibility export
export const DEFAULT_TECHNOLOGIES = DEFAULT_TECHNOLOGIES_ROW_1;

export interface TechMarqueeProps {
  technologies?: readonly string[] | string[];
  technologiesRow1?: readonly string[] | string[];
  technologiesRow2?: readonly string[] | string[];
  className?: string;
  speed?: number; // duration in seconds for one full half-cycle
}

export default function TechMarquee({
  technologies,
  technologiesRow1,
  technologiesRow2,
  className = "",
  speed = 55,
}: TechMarqueeProps) {
  // Determine lists for Row 1 and Row 2
  const row1List =
    technologiesRow1 || technologies || DEFAULT_TECHNOLOGIES_ROW_1;
  const row2List =
    technologiesRow2 ||
    (technologies ? [...technologies].reverse() : DEFAULT_TECHNOLOGIES_ROW_2);

  // Duplicate lists so Set 1 (0% to -50%) and Set 2 (-50% to -100%) are identical and wide enough for 4K/5K displays
  const set1 = [...row1List, ...row1List];
  const allItemsRow1 = [...set1, ...set1];

  const set2 = [...row2List, ...row2List];
  const allItemsRow2 = [...set2, ...set2];

  return (
    <div
      id="stack"
      aria-label="Technologies and frameworks stack marquee"
      className={`scroll-mt-24 sm:scroll-mt-28 relative w-full overflow-hidden border-y border-white/[0.08] bg-[#0c0e14] py-6 sm:py-8 lg:py-9 select-none -mt-1 z-20 space-y-3.5 sm:space-y-4.5 lg:space-y-5 ${className}`}
    >
      {/* Anchor compatibility for both #skills and #stack */}
      <span
        id="skills"
        className="absolute -top-24 sm:-top-28 opacity-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Self-contained, hardware-accelerated CSS marquee animations */}
      <style>{`
        @keyframes techMarqueeScrollLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes techMarqueeScrollRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .tech-marquee-track-left {
          display: flex !important;
          width: max-content !important;
          will-change: transform;
          animation: techMarqueeScrollLeft ${speed}s linear infinite !important;
        }
        .tech-marquee-track-right {
          display: flex !important;
          width: max-content !important;
          will-change: transform;
          animation: techMarqueeScrollRight ${Math.round(speed * 1.08)}s linear infinite !important;
        }
        .tech-marquee-track-left:hover,
        .tech-marquee-track-left:focus-within,
        .tech-marquee-track-right:hover,
        .tech-marquee-track-right:focus-within {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .tech-marquee-track-left,
          .tech-marquee-track-right {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Atmospheric gradient edge fade masks for seamless transitions */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-44 bg-gradient-to-r from-[#0d0f14] via-[#0d0f14]/85 to-transparent z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-[#0d0f14] via-[#0d0f14]/85 to-transparent z-10"
        aria-hidden="true"
      />

      {/* Row 1: Continuous 60FPS Loop (Moving Left) */}
      <div className="tech-marquee-track-left">
        {allItemsRow1.map((tech, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div key={`row1-${tech}-${idx}`} className="flex items-center shrink-0">
              <span
                tabIndex={0}
                role="button"
                className={`inline-flex items-center text-xs sm:text-sm font-mono font-medium tracking-[0.22em] uppercase text-zinc-400 transition-all duration-200 cursor-default px-2.5 py-1 rounded focus:outline-none focus-visible:ring-1 ${
                  isEven
                    ? "hover:text-[#CBA6F7] hover:drop-shadow-[0_0_12px_rgba(203,166,247,0.45)] focus-visible:text-[#CBA6F7] focus-visible:ring-[#CBA6F7]/50"
                    : "hover:text-[#A6E3A1] hover:drop-shadow-[0_0_12px_rgba(166,227,161,0.45)] focus-visible:text-[#A6E3A1] focus-visible:ring-[#A6E3A1]/50"
                }`}
              >
                {tech}
              </span>
              <span
                className="mx-5 sm:mx-8 w-1.5 h-1.5 rounded-full bg-white/15 shrink-0"
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>

      {/* Row 2: Continuous 60FPS Loop (Moving Right, directly below Row 1) */}
      <div className="tech-marquee-track-right">
        {allItemsRow2.map((tech, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div key={`row2-${tech}-${idx}`} className="flex items-center shrink-0">
              <span
                tabIndex={0}
                role="button"
                className={`inline-flex items-center text-xs sm:text-sm font-mono font-medium tracking-[0.22em] uppercase text-zinc-400 transition-all duration-200 cursor-default px-2.5 py-1 rounded focus:outline-none focus-visible:ring-1 ${
                  isEven
                    ? "hover:text-[#89B4FA] hover:drop-shadow-[0_0_12px_rgba(137,180,250,0.45)] focus-visible:text-[#89B4FA] focus-visible:ring-[#89B4FA]/50"
                    : "hover:text-[#FAB387] hover:drop-shadow-[0_0_12px_rgba(250,179,135,0.45)] focus-visible:text-[#FAB387] focus-visible:ring-[#FAB387]/50"
                }`}
              >
                {tech}
              </span>
              <span
                className="mx-5 sm:mx-8 w-1.5 h-1.5 rounded-full bg-white/15 shrink-0"
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
