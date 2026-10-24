"use client";

import React, { useState } from "react";
import { Scan, Eye, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export interface CharacterSample {
  char: string;
  code: string;
  fontStyle: string;
  confidence: number;
  extractedString: string;
  featureMapDetail: string;
  kernelCount: number;
}

export const CHARACTER_SAMPLES: CharacterSample[] = [
  {
    char: "A",
    code: "0x41",
    fontStyle: "font-serif font-black",
    confidence: 99.4,
    extractedString: "ALGORITHMIC INTELLIGENCE",
    featureMapDetail: "Apex vertex & horizontal crossbar segmented",
    kernelCount: 32,
  },
  {
    char: "7",
    code: "0x37",
    fontStyle: "font-mono font-bold",
    confidence: 98.7,
    extractedString: "TELEMETRY 7.42 GHZ PACING",
    featureMapDetail: "Acute junction & diagonal stroke extracted",
    kernelCount: 32,
  },
  {
    char: "K",
    code: "0x4B",
    fontStyle: "font-sans font-black",
    confidence: 99.1,
    extractedString: "KERAS MULTI-CHANNEL PIPELINE",
    featureMapDetail: "Vertical stem & dual diagonal rays detected",
    kernelCount: 32,
  },
  {
    char: "B",
    code: "0x42",
    fontStyle: "font-serif font-bold",
    confidence: 97.9,
    extractedString: "BAYESIAN OPTICAL RECOGNITION",
    featureMapDetail: "Dual closed loop contour moments matched",
    kernelCount: 32,
  },
  {
    char: "9",
    code: "0x39",
    fontStyle: "font-mono font-bold",
    confidence: 98.4,
    extractedString: "99.4% CONFIDENCE INFERENCE",
    featureMapDetail: "Upper circular loop & curved tail isolated",
    kernelCount: 32,
  },
];

export default function CnnOcrPreview() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isHoveredRoi, setIsHoveredRoi] = useState<boolean>(false);

  const sample = CHARACTER_SAMPLES[selectedIdx];

  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] flex flex-col justify-between select-none bg-[#090b10] p-3 sm:p-5 overflow-hidden">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/[0.08] text-xs font-mono">
        <div className="flex items-center gap-2">
          <Scan size={14} className="text-amber-400 animate-pulse motion-reduce:animate-none" />
          <span className="text-[#F5F3EF] font-semibold tracking-wider">
            CNN + OCR VISION
          </span>
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:inline text-[11px] tracking-wide">
            OPENCV INFERENCE PIPELINE
          </span>
        </div>

        {/* Live Confidence Status Chip */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping motion-reduce:animate-none" />
            <span>INFERENCE: {sample.confidence.toFixed(1)}% MATCH</span>
          </span>
        </div>
      </div>

      {/* ── Interactive Character Sample Selector Row ── */}
      <div className="flex items-center justify-between gap-2 pt-2 pb-1 text-[10px] sm:text-[11px] font-mono text-zinc-400 border-b border-white/[0.04]">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400">
            TEST SAMPLES:
          </span>
        </div>

        {/* Clickable Character Chips */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {CHARACTER_SAMPLES.map((s, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={`sample-${s.char}`}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`
                  px-2 py-0.5 rounded-md text-xs font-mono font-bold
                  transition-all duration-150 cursor-pointer
                  ${
                    isSelected
                      ? "bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_8px_rgba(245,169,127,0.3)] scale-105"
                      : "bg-white/[0.04] text-zinc-400 border border-white/5 hover:bg-white/[0.08] hover:text-zinc-200"
                  }
                `}
                title={`Select sample '${s.char}' for OCR recognition`}
              >
                {s.char}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Center Recognition Area: 2-Column CV Layout ── */}
      <div className="flex-1 flex items-center justify-center my-1.5 sm:my-2">
        <div className="w-full grid grid-cols-12 gap-3 sm:gap-5 items-center p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/10">
          {/* ── Left Column: Framed Character Input Region (28×28 ROI) ── */}
          <div className="col-span-4 flex flex-col items-center gap-1.5">
            <div
              onPointerEnter={() => setIsHoveredRoi(true)}
              onPointerLeave={() => setIsHoveredRoi(false)}
              className="
                relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl
                bg-[#0d1017] border border-amber-500/35
                flex items-center justify-center overflow-hidden
                shadow-[inset_0_2px_12px_rgba(0,0,0,0.85)]
                cursor-help group/roi
              "
              title="Hover to inspect OpenCV binary feature map"
            >
              {/* Subtle 28×28 Mesh Grid Background */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.14]"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(245, 169, 127, 0.65) 1px, transparent 1px)",
                  backgroundSize: "7px 7px",
                }}
                aria-hidden="true"
              />

              {/* ── Yellow/Amber Corner Detection Brackets ── */}
              <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 rounded-tl-sm" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400 rounded-tr-sm" />
              <span className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400 rounded-bl-sm" />
              <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 rounded-br-sm" />

              {/* ── Animated Horizontal Laser Scanning Line ── */}
              <style>{`
                @keyframes ocrScanLaser {
                  0% {
                    top: 10%;
                    opacity: 0.85;
                  }
                  50% {
                    top: 86%;
                    opacity: 1;
                  }
                  100% {
                    top: 10%;
                    opacity: 0.85;
                  }
                }
                .ocr-scan-line {
                  animation: ocrScanLaser 2.4s ease-in-out infinite;
                }
              `}</style>
              <div
                className={`
                  pointer-events-none absolute left-2 right-2 h-[2px]
                  bg-gradient-to-r from-transparent via-amber-300 to-transparent
                  shadow-[0_0_10px_rgba(251,191,36,0.85)]
                  ${shouldReduceMotion ? "top-1/2" : "ocr-scan-line"}
                `}
                aria-hidden="true"
              />

              {/* Displayed Character Glyph */}
              <motion.span
                key={`char-glyph-${sample.char}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`
                  text-5xl sm:text-6xl text-white/95
                  tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]
                  ${sample.fontStyle}
                `}
              >
                {sample.char}
              </motion.span>

              {/* Interactive Hover Feature Inspection Overlay */}
              {isHoveredRoi && (
                <div className="pointer-events-none absolute inset-0 bg-[#090b10]/95 backdrop-blur-[2px] p-2 flex flex-col justify-between text-[8px] font-mono text-zinc-300 animate-fade-in">
                  <div className="flex items-center justify-between text-amber-300 border-b border-amber-400/20 pb-0.5">
                    <span className="flex items-center gap-1 font-bold">
                      <Eye size={9} />
                      CV ROI
                    </span>
                    <span className="text-[7.5px] text-emerald-400">OTSU BINARY</span>
                  </div>
                  <p className="text-[7.5px] leading-tight text-zinc-400">
                    {sample.featureMapDetail}
                  </p>
                  <div className="text-[7px] text-zinc-500 flex justify-between">
                    <span>NORM: [-1, 1]</span>
                    <span className="text-amber-400">32 KERNELS</span>
                  </div>
                </div>
              )}
            </div>

            {/* Compact 28×28 ROI Label */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-amber-300/90 tracking-wider">
              28×28 ROI · GRAYSCALE
            </span>
          </div>

          {/* ── Right Column: Recognition Output, Confidence & Decoded Text ── */}
          <div className="col-span-8 space-y-2 sm:space-y-2.5 text-xs font-mono">
            {/* Predicted Class & Character Code Badge */}
            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-zinc-400">
              <span className="text-[10px] tracking-wide text-zinc-500">
                PREDICTED CLASS:
              </span>
              <motion.span
                key={`class-badge-${sample.char}`}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-1.5 text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25 shadow-sm"
              >
                <CheckCircle2 size={11} className="text-emerald-400" />
                <span>
                  CHAR &quot;{sample.char}&quot; ({sample.code})
                </span>
              </motion.span>
            </div>

            {/* Softmax Probability Confidence Meter */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-zinc-400">
                <span className="text-zinc-500">CNN SOFTMAX CONFIDENCE</span>
                <span className="text-amber-300 font-bold font-mono">
                  {sample.confidence.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 sm:h-2 rounded-full bg-white/10 overflow-hidden shadow-inner">
                <motion.div
                  key={`confidence-bar-${sample.char}`}
                  initial={shouldReduceMotion ? false : { width: 0 }}
                  animate={{ width: `${sample.confidence}%` }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 rounded-full"
                />
              </div>
            </div>

            {/* Small Extracted Text Stream Panel */}
            <div className="p-2 sm:p-2.5 rounded-lg bg-black/50 border border-white/5 space-y-1 text-[10px]">
              <div className="flex items-center justify-between text-zinc-500 text-[9px]">
                <span>OCR DECODED STREAM:</span>
                <span className="text-emerald-400/80 font-mono text-[8.5px]">
                  CONFIRMED
                </span>
              </div>
              <motion.p
                key={`extracted-${sample.char}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="text-zinc-200 tracking-wider font-semibold font-mono text-[10px] sm:text-[11px]"
              >
                &ldquo;{sample.extractedString}&rdquo;
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Technical Status Strip (4 Compact Groups) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/[0.08] text-[10px] sm:text-[11px] font-mono">
        <div className="text-zinc-400">
          <span className="block text-[9px] text-zinc-500 uppercase tracking-wide">
            CNN LAYERS
          </span>
          <span className="text-amber-300 font-medium">3 CONV + MAXPOOL</span>
        </div>
        <div className="text-zinc-400">
          <span className="block text-[9px] text-zinc-500 uppercase tracking-wide">
            PREPROCESSING
          </span>
          <span className="text-cyan-300 font-medium">GAUSSIAN + OTSU</span>
        </div>
        <div className="text-zinc-400">
          <span className="block text-[9px] text-zinc-500 uppercase tracking-wide">
            LATENCY
          </span>
          <span className="text-[#a6e3a1] font-medium">~3.8ms (EST. INFERENCE)</span>
        </div>
        <div className="text-zinc-400">
          <span className="block text-[9px] text-zinc-500 uppercase tracking-wide">
            ENGINE
          </span>
          <span className="text-[#cba6f7] font-medium">OPENCV · KERAS</span>
        </div>
      </div>
    </div>
  );
}
