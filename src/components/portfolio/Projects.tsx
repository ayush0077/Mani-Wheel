"use client";

import { Terminal, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { GithubIcon } from "./Icons";
import TradingChartPreview from "./TradingChartPreview";
import CnnOcrPreview from "./CnnOcrPreview";

interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  metrics: string;
  tags: string[];
  gradient: string;
  accentColor: string;
  liveUrl?: string;
  githubUrl?: string;
  isTerminalLauncher?: boolean;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "solana-rideshare",
    title: "Ride-Sharing Application on Solana",
    subtitle: "Decentralized Mobility & Blockchain",
    category: "Web3 & Solana Development",
    description:
      "A decentralized ride-sharing platform built on Solana, leveraging blockchain technology and smart contracts to enable transparent, secure, and trustless ride coordination and payments.",
    metrics: "Solana Blockchain · Smart Contracts · Decentralized Payments",
    tags: ["Solana", "Rust", "Smart Contracts", "Blockchain"],
    gradient: "from-purple-500/10 via-violet-500/5 to-transparent",
    accentColor: "border-purple-500/30 group-hover:border-purple-400/60",
    isTerminalLauncher: true,
    githubUrl: "https://github.com/ayush0077/Ride-Sharing-Using-Solana-Frontend",
  },
  {
    id: "stock-trading-bot",
    title: "AI-Powered Stock Trading Bot",
    subtitle: "Deep Learning & Algorithmic Trading",
    category: "AI / Machine Learning & FinTech",
    description:
      "An end-to-end algorithmic trading pipeline that collects stock market data, trains a multi-stock LSTM model for price forecasting, generates buy/sell signals, and visualizes predicted market movements with estimated profit and loss.",
    metrics: "LSTM Forecasting · Multi-Stock Prediction · Automated Signals",
    tags: [
      "Python",
      "TensorFlow",
      "Keras",
      "Pandas",
      "NumPy",
      "Matplotlib",
    ],
    gradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
    accentColor: "border-cyan-500/30 group-hover:border-cyan-400/60",
    isTerminalLauncher: false,
    liveUrl: "https://github.com/ayush0077/Signal_Trader",
    githubUrl: "https://github.com/ayush0077/Signal_Trader",
  },
  {
    id: "character-recognition",
    title: "Character Recognition Using CNN & OCR",
    subtitle: "Computer Vision & Deep Learning",
    category: "AI / Computer Vision",
    description:
      "An intelligent character recognition system combining Convolutional Neural Networks (CNNs) and Optical Character Recognition (OCR) to identify and extract text from images through image preprocessing, deep learning-based classification, and text recognition.",
    metrics: "CNN Classification · OCR · Image Processing",
    tags: [
      "Python",
      "TensorFlow",
      "Keras",
      "OpenCV",
      "OCR",
      "NumPy",
      "Computer Vision",
    ],
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    accentColor: "border-amber-500/30 group-hover:border-amber-400/60",
    isTerminalLauncher: false,
    liveUrl: "https://github.com/ayush0077",
    githubUrl: "https://github.com/ayush0077",
  },
];

interface ProjectsProps {
  onLaunchTerminal?: () => void;
}

export default function Projects({ onLaunchTerminal }: ProjectsProps) {
  const shouldReduceMotion = useReducedMotion();

  // Display all curated projects as large horizontal showcase panels
  const displayProjects = PROJECTS;

  const headerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  // Stagger child elements inside each panel
  const childStaggerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="work"
      className="relative w-full py-28 sm:py-36 px-4 sm:px-8 md:px-12 bg-[#0d0f14] text-white -mt-1 overflow-hidden"
    >
      {/* ── Background Continuity: Restrained Mauve Ambient Glow ── */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[550px] opacity-75 blur-3xl -z-10"
        style={{
          background:
            "radial-gradient(ellipse 75% 45% at 50% 0%, rgba(203,166,247,0.075) 0%, rgba(137,180,250,0.025) 45%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── Subtle Background Grain / Dot Pattern ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.45) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* ── Content Container (Expanded to 1180px) ── */}
      <div className="relative max-w-[1180px] mx-auto w-full space-y-16 sm:space-y-20">
        {/* ── Section Heading Block ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={headerVariants}
          className="space-y-4 max-w-2xl"
        >
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#181a24]/90 border border-white/[0.12] backdrop-blur-md shadow-lg select-none">
            <span
              className="w-2 h-2 rounded-full bg-[#A6E3A1] shadow-[0_0_8px_#A6E3A1] animate-pulse motion-reduce:animate-none shrink-0"
              aria-hidden="true"
            />
            <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.14em] uppercase text-[#E5E5EB]">
              SELECTED WORK <span className="text-[#CBA6F7] mx-1 font-semibold">{"||"}</span> 2026
            </span>
          </div>

          {/* Prominent Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F3EF] leading-[1.1]">
            Featured Projects & Experiments
          </h2>

          {/* Concise Supporting Description */}
          <p className="text-base sm:text-lg text-zinc-400 font-sans leading-relaxed pt-1">
            A curation of resilient database architectures, robust system infrastructure, and intelligent AI solutions engineered with precision and purpose.
          </p>
        </motion.div>

        {/* ── Cinematic Scroll-Triggered Project Showcase (Stacked Horizontal Panels) ── */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {displayProjects.map((project, index) => {
            // Direction alternation:
            // Project 1 (index 0): Left -> x: -64
            // Project 2 (index 1): Right -> x: 64
            // Project 3 (index 2): Left -> x: -64
            const isSlideFromLeft = index % 2 === 0;

            const panelVariants = {
              hidden: {
                opacity: shouldReduceMotion ? 1 : 0,
                x: shouldReduceMotion ? 0 : (isSlideFromLeft ? -64 : 64),
                scale: shouldReduceMotion ? 1 : 0.96,
              },
              visible: {
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1] as const,
                  staggerChildren: shouldReduceMotion ? 0 : 0.08,
                  delayChildren: shouldReduceMotion ? 0 : 0.12,
                },
              },
            };

            return (
              <motion.article
                key={project.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18, margin: "-50px" }}
                variants={panelVariants}
                className={`
                  group relative w-full
                  rounded-[2rem] sm:rounded-[2.5rem]
                  bg-[#12141c]/70 hover:bg-[#141724]/85
                  border border-white/[0.08] hover:border-white/[0.22]
                  backdrop-blur-2xl shadow-2xl
                  transition-all duration-500
                  hover:shadow-[0_24px_70px_rgba(0,0,0,0.65),0_0_40px_rgba(203,166,247,0.08)]
                  p-6 sm:p-8 md:p-10 lg:p-12
                  overflow-hidden
                  ${project.accentColor}
                `}
              >
                {/* Dynamic Ambient Accent Gradient on Hover */}
                <div
                  className={`
                    pointer-events-none absolute inset-0 bg-gradient-to-br ${project.gradient}
                    opacity-0 group-hover:opacity-100 transition-opacity duration-700
                    rounded-[2rem] sm:rounded-[2.5rem]
                  `}
                  aria-hidden="true"
                />

                {/* ── Two-Column Layout (Alternating Preview & Text on Desktop) ── */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
                  {/* ── Project Details Column ── */}
                  <div
                    className={`
                      w-full space-y-6
                      lg:col-span-6 xl:col-span-5
                      ${isSlideFromLeft ? "lg:order-1" : "lg:order-2"}
                    `}
                  >
                    {/* Project Number & Category Eyebrow */}
                    <motion.div variants={childStaggerVariants} className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md bg-white/[0.06] border border-white/10 font-mono text-xs font-semibold tracking-wider text-[#A6E3A1]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-zinc-600 font-mono text-xs">{"//"}</span>
                      <span className="text-xs font-mono uppercase tracking-[0.16em] text-zinc-400">
                        {project.category}
                      </span>
                    </motion.div>

                    {/* Title & Subtitle */}
                    <motion.div variants={childStaggerVariants} className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.5rem] font-bold text-[#F5F3EF] group-hover:text-white transition-colors leading-[1.15] tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-[#CBA6F7] tracking-wider">
                        {project.subtitle}
                      </p>
                    </motion.div>

                    {/* Concise Description */}
                    <motion.p
                      variants={childStaggerVariants}
                      className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed"
                    >
                      {project.description}
                    </motion.p>

                    {/* Metrics Badge */}
                    <motion.div variants={childStaggerVariants}>
                      <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none shrink-0" />
                        <span>{project.metrics}</span>
                      </div>
                    </motion.div>

                    {/* Technology Stack Tags */}
                    <motion.div variants={childStaggerVariants} className="flex flex-wrap gap-2 pt-1">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="
                            px-3 py-1 rounded-md
                            bg-white/[0.04] border border-white/[0.08]
                            text-xs font-mono text-zinc-300
                            group-hover:text-white group-hover:border-white/15
                            transition-colors
                          "
                        >
                          {tag}
                        </span>
                      ))}
                    </motion.div>

                    {/* Action Links */}
                    <motion.div
                      variants={childStaggerVariants}
                      className="flex items-center gap-3 pt-2"
                    >
                      {project.isTerminalLauncher ? (
                        <button
                          onClick={onLaunchTerminal}
                          type="button"
                          className="
                            inline-flex items-center gap-2.5
                            px-5 py-2.5 rounded-xl
                            bg-emerald-500/15 hover:bg-emerald-500/25
                            border border-emerald-500/35 hover:border-emerald-400/60
                            text-emerald-300 hover:text-emerald-200
                            font-mono text-xs tracking-wider uppercase
                            transition-all duration-200 cursor-pointer shadow-md
                            hover:scale-[1.02]
                          "
                          title="Launch CLI Session"
                        >
                          <Terminal size={14} className="text-emerald-400" />
                          <span>LAUNCH CLI ↗</span>
                        </button>
                      ) : (
                        project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target={project.liveUrl.startsWith("#") ? "_self" : "_blank"}
                            rel="noreferrer"
                            className="
                              inline-flex items-center gap-2
                              px-5 py-2.5 rounded-xl
                              bg-white/[0.08] hover:bg-white/[0.15]
                              border border-white/15 hover:border-white/30
                              text-[#F5F3EF] hover:text-white
                              font-mono text-xs tracking-wider uppercase
                              transition-all duration-200 shadow-md
                              hover:scale-[1.02]
                            "
                            title="View Project"
                          >
                            <span>VIEW PROJECT</span>
                            <ArrowUpRight size={14} className="text-[#CBA6F7]" />
                          </a>
                        )
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="
                            inline-flex items-center gap-2
                            px-4 py-2.5 rounded-xl
                            bg-white/[0.04] hover:bg-white/[0.09]
                            border border-white/10 hover:border-white/20
                            text-zinc-300 hover:text-white
                            transition-all duration-200 text-xs font-mono
                            hover:scale-[1.02]
                          "
                          title="View Source on GitHub"
                        >
                          <GithubIcon size={14} />
                          <span className="hidden sm:inline">SOURCE</span>
                        </a>
                      )}
                    </motion.div>
                  </div>

                  {/* ── Visual Preview Column ── */}
                  <div
                    className={`
                      w-full
                      lg:col-span-6 xl:col-span-7
                      ${isSlideFromLeft ? "lg:order-2" : "lg:order-1"}
                    `}
                  >
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0c10] shadow-2xl transition-all duration-500 group-hover:border-white/20">
                      {/* Project 1: Ride-Sharing Application on Solana & Interactive Terminal Workstation Preview */}
                      {project.id === "solana-rideshare" && (
                        <div
                          onClick={onLaunchTerminal}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onLaunchTerminal?.();
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          className="relative w-full aspect-[16/10] sm:aspect-[16/9] flex flex-col cursor-pointer select-none group/terminal focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          title="Click to launch interactive CLI terminal"
                        >
                          {/* Titlebar */}
                          <div className="flex items-center justify-between px-4 py-2.5 bg-[#12141c] border-b border-white/[0.08]">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-[#f38ba8]/80 inline-block" />
                              <span className="w-3 h-3 rounded-full bg-[#f9e2af]/80 inline-block" />
                              <span className="w-3 h-3 rounded-full bg-[#a6e3a1]/80 inline-block" />
                            </div>
                            <span className="text-[11px] font-mono text-zinc-400">
                              aetheria-os — zsh — 80x24
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping motion-reduce:animate-none" />
                              <span>READY</span>
                            </span>
                          </div>

                          {/* Terminal Output Body */}
                          <div className="flex-1 p-4 sm:p-6 font-mono text-xs leading-relaxed text-zinc-300 space-y-2.5 overflow-hidden bg-[#090b10]">
                            <p className="text-zinc-400">
                              <span className="text-[#A6E3A1]">tamrakar@ayush</span>
                              <span className="text-zinc-600">:</span>
                              <span className="text-[#89B4FA]">~</span>
                              <span className="text-zinc-600">$</span>{" "}
                              <span className="text-white">fetch-sysinfo</span>
                            </p>
                            <div className="pl-3 border-l-2 border-[#CBA6F7]/40 space-y-1 text-zinc-400 text-[11px] sm:text-xs">
                              <p>
                                <span className="text-[#CBA6F7]">OS:</span> Aetheria OS v2.4 (Next.js 15)
                              </p>
                              <p>
                                <span className="text-[#CBA6F7]">Shell:</span> aetheria-sh (Zero Dependencies)
                              </p>
                              <p>
                                <span className="text-[#CBA6F7]">Latency:</span> &lt;8ms Response Benchmarks
                              </p>
                              <p>
                                <span className="text-[#CBA6F7]">Theme:</span> Catppuccin Mocha [Dark Velvet]
                              </p>
                            </div>
                            <p className="text-zinc-400 pt-1">
                              <span className="text-[#A6E3A1]">tamrakar@ayush</span>
                              <span className="text-zinc-600">:</span>
                              <span className="text-[#89B4FA]">~</span>
                              <span className="text-zinc-600">$</span>{" "}
                              <span className="text-emerald-400">status --network</span>
                            </p>
                            <p className="text-emerald-400/90 text-[11px] sm:text-xs">
                              [OK] SSH Handshake: ESTABLISHED | Matrix Rain: ACTIVE
                            </p>
                            <p className="text-zinc-400">
                              <span className="text-[#A6E3A1]">tamrakar@ayush</span>
                              <span className="text-zinc-600">:</span>
                              <span className="text-[#89B4FA]">~</span>
                              <span className="text-zinc-600">$</span>{" "}
                              <span className="cursor-blink text-emerald-400 font-bold">█</span>
                            </p>
                          </div>

                          {/* Hover Overlay Hint */}
                          <div className="pointer-events-none absolute inset-0 bg-emerald-500/[0.04] opacity-0 group-hover/terminal:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs tracking-wider shadow-lg">
                              CLICK TO LAUNCH INTERACTIVE CLI ↗
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Project 2: AI-Powered Stock Trading Bot & Financial Candlestick Preview */}
                      {project.id === "stock-trading-bot" && <TradingChartPreview />}

                      {/* Project 3: Character Recognition Using CNN & OCR Visual Preview */}
                      {project.id === "character-recognition" && <CnnOcrPreview />}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
