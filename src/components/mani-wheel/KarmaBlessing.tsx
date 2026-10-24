"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Sparkles, RotateCw, HeartHandshake } from "lucide-react";

export interface BlessingItem {
  id: number;
  mantra: string;
  tibetan: string;
  meaning: string;
}

export const KARMA_BLESSINGS: BlessingItem[] = [
  {
    id: 1,
    mantra: "Om Mani Padme Hum",
    tibetan: "ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ",
    meaning:
      "May boundless compassion awaken in your heart, dissolving all grief and liberating every being.",
  },
  {
    id: 2,
    mantra: "Chokyi Khorlo",
    tibetan: "ཆོས་ཀྱི་འཁོར་ལོ",
    meaning:
      "With every turn of the Dharma wheel, wisdom clears the mist of delusion and plants golden seeds of peace.",
  },
  {
    id: 3,
    mantra: "Tashi Delek",
    tibetan: "བཀྲ་ཤིས་བདེ་ལེགས",
    meaning:
      "May profound auspiciousness, serenity, and abundant health surround you and your loved ones.",
  },
  {
    id: 4,
    mantra: "Shenpen Nangwa",
    tibetan: "གཞན་ཕན་སྣང་བ",
    meaning:
      "A single pure intention ripples across the cosmos. Your merit multiplies ten-thousand fold.",
  },
  {
    id: 5,
    mantra: "Kailash Shanti",
    tibetan: "ཞི་བདེ་ཆེན་པོ",
    meaning:
      "May peace descend upon your spirit like eternal morning light upon the peaks of Mount Kailash.",
  },
  {
    id: 6,
    mantra: "Lojong Prana",
    tibetan: "བློ་སྦྱོང་སྙིང་པོ",
    meaning:
      "May patience shield your mind and loving-kindness illuminate every step of your worldly journey.",
  },
  {
    id: 7,
    mantra: "Dharma Sagara",
    tibetan: "དགེ་བའི་རྩ་བ",
    meaning:
      "Virtue is an inexhaustible spring. May your goodwill bless everyone who crosses your path today.",
  },
  {
    id: 8,
    mantra: "Maitreya Alaya",
    tibetan: "བྱམས་པ་ཆེན་པོ",
    meaning:
      "May all obstacles dissolve like morning mist, giving rise to clarity, courage, and fearless joy.",
  },
  {
    id: 9,
    mantra: "Samye Ling",
    tibetan: "ཐུགས་རྗེ་ཆེན་པོ",
    meaning:
      "As the winds carry the sacred prayers, so may gentle winds carry healing to every corner of your life.",
  },
];

// Meditative Tibetan singing bowl chime synthesized directly using Web Audio API
export function playSingingBowlChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (
        window as unknown as {
          webkitAudioContext: typeof AudioContext;
        }
      ).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic frequencies for Tibetan singing bowl resonance (Fundamental 432Hz + Overtones)
    const freqs = [432, 864, 1296, 1728];
    const gains = [0.18, 0.08, 0.04, 0.02];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(gains[idx], now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 3.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 4.0);
    });
  } catch {
    // Audio optional; suppressed gracefully if blocked by browser policy
  }
}

interface KarmaBlessingProps {
  lastSpinCount: number;
}

const MAX_SPINS = 3;

export default function KarmaBlessing({ lastSpinCount }: KarmaBlessingProps) {
  const [dismissedSpin, setDismissedSpin] = useState(0);
  // Track previous spin count for merit fly-up animation
  const prevSpinCountRef = useRef(lastSpinCount);
  const [showMeritFly, setShowMeritFly] = useState(false);
  const flyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger the +108 fly-up whenever spin count increases
  useEffect(() => {
    if (lastSpinCount > prevSpinCountRef.current) {
      prevSpinCountRef.current = lastSpinCount;
      // Clear any in-progress fly animation
      if (flyTimeoutRef.current) clearTimeout(flyTimeoutRef.current);
      setShowMeritFly(false);
      // Small delay so React can re-mount the element for animation restart
      flyTimeoutRef.current = setTimeout(() => {
        setShowMeritFly(true);
        // Hide after animation completes
        flyTimeoutRef.current = setTimeout(() => setShowMeritFly(false), 1300);
      }, 30);
    }
    return () => {
      if (flyTimeoutRef.current) clearTimeout(flyTimeoutRef.current);
    };
  }, [lastSpinCount]);

  const displaySpins = Math.min(lastSpinCount, MAX_SPINS);

  // Derive active blessing based on spin count (pure declarative state)
  const isRevealed = lastSpinCount > 0 && lastSpinCount > dismissedSpin;
  const currentBlessing =
    lastSpinCount > 0
      ? KARMA_BLESSINGS[(lastSpinCount - 1) % KARMA_BLESSINGS.length]
      : null;

  const handleDismiss = useCallback(() => {
    setDismissedSpin(lastSpinCount);
  }, [lastSpinCount]);

  const totalMerits = displaySpins * 108;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center text-center space-y-4">
      {/* ── Sacred Mantra & Heading ── */}
      <div className="space-y-1 select-none">
        <div className="font-serif text-sm sm:text-base text-[#e5c07b]/80 tracking-widest">
          ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ
        </div>

        {/* Heading with subtle glow behind it */}
        <div className="relative inline-block">
          {/* Background glow layer */}
          <div
            className="absolute inset-0 blur-2xl opacity-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(243, 186, 71, 0.5) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <h1 className="relative text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#f3ba47] via-[#f7d68a] to-[#2ba89c] uppercase drop-shadow-sm">
            SPIN THE MANI WHEEL 3 TIMES TO RECEIVE KARMA
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-[#bac2de]/75 font-sans max-w-md mx-auto">
          {displaySpins >= MAX_SPINS
            ? "3 of 3 sacred rotations completed. Consecrating merit and entering portfolio..."
            : `Drag horizontally to turn the sacred cylinder (3 spins unlock portfolio · ${displaySpins}/${MAX_SPINS}).`}
        </p>
      </div>

      {/* ── Karma Points & Interactive Instruction ── */}
      <div className="flex items-center justify-center gap-3 text-xs font-mono select-none">
        {/* Merits badge with fly-up animation */}
        <div className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e2030]/80 border border-[#d49e24]/30 text-[#e5c07b] shadow-inner">
          <Sparkles size={12} className="text-[#f3ba47] animate-pulse" />
          <span>
            Merits: <strong className="text-white">+{totalMerits}</strong>
          </span>
          {/* +108 fly-up element */}
          {showMeritFly && (
            <span
              className="animate-merit-fly absolute -top-1 left-1/2 -translate-x-1/2 text-[#f3ba47] text-[11px] font-bold pointer-events-none whitespace-nowrap"
              aria-hidden="true"
            >
              +108
            </span>
          )}
        </div>

        {/* Spin count badge — max 3 */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181825]/80 border border-[#2ba89c]/25 text-[#a6adc8] shadow-inner">
          <RotateCw size={12} className="text-[#2ba89c]" />
          <span>
            Spins:{" "}
            <strong className="text-[#2ba89c]">
              {displaySpins} / {MAX_SPINS}
            </strong>
          </span>
        </div>

        {/* 3-Step Completion Pips */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#181825]/80 border border-white/10 shadow-inner"
          aria-label={`${displaySpins} of ${MAX_SPINS} spins completed`}
        >
          {[1, 2, 3].map((step) => {
            const isCompleted = displaySpins >= step;
            return (
              <span
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? "bg-[#2ba89c] shadow-[0_0_8px_rgba(43,168,156,0.9)] scale-110"
                    : "bg-white/15 border border-white/20"
                }`}
                title={`Spin ${step} of ${MAX_SPINS}`}
              />
            );
          })}
        </div>
      </div>

      {/* ── Revealed Blessing Card (Appears after a completed spin) ── */}
      {isRevealed && currentBlessing && (
        <div
          role="dialog"
          aria-label="Karma Blessing"
          className="
            relative w-full max-w-lg mt-2 p-5 sm:p-6 rounded-2xl
            bg-gradient-to-b from-[#181a24]/95 via-[#13151f]/95 to-[#0e1017]/95
            border border-[#e5c07b]/40
            shadow-[0_12px_40px_rgba(229,192,123,0.15)]
            backdrop-blur-xl animate-fade-in
            space-y-3.5
          "
        >
          {/* Top Tibetan Ornament */}
          <div className="flex items-center justify-between text-xs font-mono text-[#d49e24] border-b border-[#e5c07b]/15 pb-2">
            <span className="flex items-center gap-1.5 tracking-wider">
              <HeartHandshake size={14} className="text-[#f3ba47]" />
              <span>BLESSING CONFERRED</span>
            </span>
            <span className="text-[11px] text-[#2ba89c] font-semibold">
              +108 KARMA
            </span>
          </div>

          {/* Tibetan Script & Mantra */}
          <div className="space-y-1">
            <div className="text-lg sm:text-xl font-serif text-[#f3ba47] font-bold tracking-wide">
              {currentBlessing.tibetan}
            </div>
            <div className="text-xs uppercase tracking-widest text-[#2ba89c] font-mono">
              {currentBlessing.mantra}
            </div>
          </div>

          {/* Sacred Karma Meaning */}
          <p className="text-sm text-zinc-200 font-sans italic leading-relaxed px-2">
            &ldquo;{currentBlessing.meaning}&rdquo;
          </p>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-center gap-3">
            {displaySpins >= MAX_SPINS ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2ba89c]/20 border border-[#2ba89c]/40 text-[#2ba89c] text-xs font-mono tracking-wider animate-pulse">
                <span>3 / 3 COMPLETED · ENTERING PORTFOLIO...</span>
              </div>
            ) : (
              <button
                onClick={handleDismiss}
                type="button"
                className="
                  inline-flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-[#e5c07b]/15 hover:bg-[#e5c07b]/25
                  border border-[#e5c07b]/40 text-[#f7d68a] hover:text-white
                  text-xs font-mono tracking-wider transition-all duration-200
                  cursor-pointer shadow-sm
                "
              >
                <RotateCw size={13} />
                <span>SPIN AGAIN ({displaySpins + 1}/3)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
