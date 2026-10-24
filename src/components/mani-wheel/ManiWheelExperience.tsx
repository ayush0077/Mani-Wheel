"use client";

import React, { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Terminal, ArrowRight } from "lucide-react";
import HimalayanBackdrop from "./HimalayanBackdrop";
import ManiWheelCanvas from "./ManiWheelCanvas";
import KarmaBlessing from "./KarmaBlessing";

const MAX_SPINS = 3;

export default function ManiWheelExperience() {
  const [spinCount, setSpinCount] = useState<number>(0);
  const [isForwarding, setIsForwarding] = useState<boolean>(false);
  const hasForwardedRef = useRef(false);

  // Audio manager for bell.mp3 (reused instance, safe autoplay unlock, volume 0.35)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);
  const lastBellTimeRef = useRef(0);
  const lastBellSpinRef = useRef(0);

  // Initialize/unlock audio on user's first interaction
  const unlockAudio = useCallback(() => {
    if (audioUnlockedRef.current) return;
    audioUnlockedRef.current = true;
    try {
      if (!audioRef.current && typeof window !== "undefined") {
        const audio = new Audio("/bell.mp3");
        audio.volume = 0.35;
        audio.preload = "auto";
        audioRef.current = audio;
        audio.load();
      }
    } catch {
      // Audio optional / blocked by browser
    }
  }, []);

  // Play bell sound once per completed revolution
  const playBell = useCallback((count: number) => {
    // Avoid duplicate sounds for the same spin count
    if (count <= lastBellSpinRef.current) return;
    lastBellSpinRef.current = count;

    // Prevent unpleasant overlapping if revolutions occur in rapid succession
    const now = Date.now();
    if (now - lastBellTimeRef.current < 400) return;
    lastBellTimeRef.current = now;

    try {
      if (!audioRef.current && typeof window !== "undefined") {
        const audio = new Audio("/bell.mp3");
        audio.volume = 0.35;
        audioRef.current = audio;
      }

      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0.35;
        audio.currentTime = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay or playback failure handled gracefully
          });
        }
      }
    } catch {
      // Audio failure must never block wheel rotation
    }
  }, []);

  const handleSpinStart = useCallback(() => {
    unlockAudio();
  }, [unlockAudio]);

  const handleSpinComplete = useCallback(
    (count: number) => {
      const capped = Math.min(count, MAX_SPINS);
      setSpinCount(capped);
      playBell(count);

      // If 3 times hit, forward directly to the main portfolio view from top (/?view=portfolio)
      if (count >= MAX_SPINS && !hasForwardedRef.current) {
        hasForwardedRef.current = true;
        setIsForwarding(true);

        setTimeout(() => {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/?view=portfolio";
        }, 1300);
      }
    },
    [playBell]
  );

  return (
    <main
      className="
        relative w-full min-h-screen
        flex flex-col justify-between
        bg-[#080a0f] text-white
        overflow-x-hidden overflow-y-auto
        select-none font-sans
      "
      style={{ minHeight: "100vh" }}
      onPointerDown={unlockAudio}
      onKeyDown={unlockAudio}
    >
      {/* ── Himalayan Landscape & Atmosphere ── */}
      <HimalayanBackdrop />

      {/* ── Top Navigation Bar ── */}
      <header className="relative z-30 w-full flex items-center justify-between px-4 sm:px-8 md:px-12 py-4 sm:py-6">
        {/* Back to Terminal Button */}
        <Link
          href="/"
          className="
            group flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl
            bg-white/[0.04] hover:bg-white/[0.08]
            border border-white/10 hover:border-white/20
            text-xs font-mono text-zinc-300 hover:text-white
            transition-all duration-200 backdrop-blur-md
          "
        >
          <Terminal
            size={14}
            className="text-[#e5c07b] group-hover:-translate-x-0.5 transition-transform"
          />
          <span>Terminal</span>
        </Link>

        {/* Center Shrine Indicator with progress hint */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-[#e5c07b]/20 text-[#e5c07b] text-xs font-mono backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#2ba89c] animate-pulse" />
          <span className="tracking-widest uppercase text-[11px]">
            Himalayan Shrine · {spinCount}/{MAX_SPINS}
          </span>
        </div>

        {/* Continue to Scrollytelling Portfolio Button */}
        <Link
          href="/?view=portfolio"
          className="
            group flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-xl
            bg-gradient-to-r from-[#d49e24]/20 to-[#2ba89c]/20
            hover:from-[#d49e24]/30 hover:to-[#2ba89c]/30
            border border-[#e5c07b]/35 hover:border-[#e5c07b]/60
            text-xs font-mono text-zinc-100 hover:text-white
            transition-all duration-200 backdrop-blur-md shadow-lg shadow-black/40
          "
        >
          <span>Continue to Portfolio</span>
          <ArrowRight
            size={14}
            className="text-[#f3ba47] group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </header>

      {/* ── Center Stage: Interactive Mani Wheel ── */}
      <section className="relative z-20 flex-1 flex flex-col items-center justify-center w-full px-2 sm:px-4 py-2 sm:py-4">
        <ManiWheelCanvas
          onSpinComplete={handleSpinComplete}
          onSpinStart={handleSpinStart}
        />

        {/* Heading & Karma Reveal */}
        <div className="mt-2 sm:mt-3 w-full">
          <KarmaBlessing lastSpinCount={spinCount} />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-30 w-full text-center py-4 sm:py-5 text-[11px] font-mono text-zinc-400 select-none">
        <span className="text-[#e5c07b]/60">OM MANI PADME HUM</span> · SACRED
        ROTATION INTERACTION · 108 MERITS PER SPIN
      </footer>

      {/* ── 3 Spins Hit: Cinematic Portfolio Transition Overlay ── */}
      {isForwarding && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080a0f]/90 backdrop-blur-md animate-fade-in pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-4 text-center px-6 max-w-md">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#2ba89c]/25 animate-ping" />
              <div className="w-10 h-10 rounded-full border-2 border-[#2ba89c] border-t-transparent animate-spin" />
            </div>
            <div className="space-y-1.5">
              <div className="font-serif text-[#e5c07b] text-xl sm:text-2xl font-bold tracking-widest">
                ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ
              </div>
              <div className="text-xs sm:text-sm font-mono tracking-widest text-[#2ba89c] uppercase font-semibold">
                3 / 3 Sacred Rotations Completed
              </div>
              <p className="text-xs text-zinc-300 font-sans">
                Consecrating merits · Forwarding to Portfolio...
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
