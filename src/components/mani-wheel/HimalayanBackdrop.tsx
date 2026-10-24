"use client";

import React, { useMemo, useEffect, useRef } from "react";

export default function HimalayanBackdrop() {
  const farLayerRef = useRef<SVGPathElement>(null);
  const nearLayerRef = useRef<SVGPathElement>(null);
  const closerLayerRef = useRef<SVGPathElement>(null);

  // Generate subtle drifting golden dust motes (32 total, smaller & slower)
  const motes = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      left: `${(i * 17 + 11) % 96}%`,
      top: `${(i * 23 + 19) % 88}%`,
      // Smaller: 1–3px
      size: `${1 + (i % 3)}px`,
      duration: `${18 + (i % 10) * 2.5}s`,
      delay: `${(i * 0.7) % 7}s`,
      opacity: 0.12 + (i % 5) * 0.07,
    }));
  }, []);

  // Subtle parallax: offset mountain layers on mouse move (max ±8px)
  useEffect(() => {
    let rafId: number | null = null;
    let mouseX = 0;
    let mouseY = 0;
    let currentOffsetX = 0;
    let currentOffsetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Normalize to [-1, 1]
      mouseX = (e.clientX / w - 0.5) * 2;
      mouseY = (e.clientY / h - 0.5) * 2;
    };

    const updateParallax = () => {
      // Lerp toward target for smoothness
      currentOffsetX += (mouseX * 8 - currentOffsetX) * 0.05;
      currentOffsetY += (mouseY * 4 - currentOffsetY) * 0.05;

      if (farLayerRef.current) {
        // Far mountains: smallest parallax effect
        farLayerRef.current.style.transform = `translate(${currentOffsetX * 0.25}px, ${currentOffsetY * 0.15}px)`;
      }
      if (nearLayerRef.current) {
        nearLayerRef.current.style.transform = `translate(${currentOffsetX * 0.55}px, ${currentOffsetY * 0.3}px)`;
      }
      if (closerLayerRef.current) {
        closerLayerRef.current.style.transform = `translate(${currentOffsetX}px, ${currentOffsetY * 0.5}px)`;
      }

      rafId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden select-none bg-[#0a0c10]"
      aria-hidden="true"
    >
      {/* ── Deep Atmospheric Sky Gradient ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 38%, rgba(138, 56, 24, 0.22) 0%, rgba(30, 20, 28, 0.6) 55%, #080a0f 100%)",
        }}
      />

      {/* ── Sun Glow (Upper-right, Himalayan morning light) ── */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 85% 15%, rgba(255, 200, 80, 0.13) 0%, rgba(230, 140, 40, 0.07) 40%, transparent 75%)",
        }}
      />

      {/* ── Warm Butter-Lamp Aura (Behind the Mani Wheel) ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[650px] sm:h-[900px] rounded-full blur-[100px] pointer-events-none opacity-40 animate-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(245, 175, 65, 0.35) 0%, rgba(200, 85, 30, 0.18) 45%, transparent 75%)",
          animationDuration: "5s",
        }}
      />

      {/* ── Atmospheric Haze Overlay between mountain layers ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[55%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, transparent 0%, rgba(30, 18, 28, 0.18) 40%, rgba(60, 30, 40, 0.10) 70%, transparent 100%)",
        }}
      />

      {/* ── Mountain SVG Layers (parallax applied via ref) ── */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[360px] sm:h-[460px]">
        <svg
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          className="w-full h-full fill-none"
        >
          <defs>
            <linearGradient id="mountainGradFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d48a37" stopOpacity="0.20" />
              <stop offset="50%" stopColor="#3d202e" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#080a0f" stopOpacity="0.90" />
            </linearGradient>
            <linearGradient id="mountainGradMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8a3428" stopOpacity="0.30" />
              <stop offset="55%" stopColor="#1e141c" stopOpacity="0.70" />
              <stop offset="100%" stopColor="#06070a" stopOpacity="1.00" />
            </linearGradient>
            <linearGradient id="mountainGradNear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a1a14" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#120d10" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#06070a" stopOpacity="1.00" />
            </linearGradient>
          </defs>

          {/* Far Peak Layer — most distant ridge, least opaque */}
          <path
            ref={farLayerRef}
            d="M0 290 L140 190 L290 260 L430 150 L580 240 L720 115 L890 230 L1040 138 L1200 250 L1350 178 L1440 228 L1440 420 L0 420 Z"
            fill="url(#mountainGradFar)"
            opacity="0.55"
            style={{ willChange: "transform" }}
          />

          {/* Mid Peak Layer */}
          <path
            ref={nearLayerRef}
            d="M0 330 L190 248 L350 296 L510 208 L680 288 L840 198 L990 278 L1150 218 L1320 285 L1440 258 L1440 420 L0 420 Z"
            fill="url(#mountainGradMid)"
            opacity="0.75"
            style={{ willChange: "transform" }}
          />

          {/* Closer Peak Layer — most prominent, slightly more opaque & more detailed */}
          <path
            ref={closerLayerRef}
            d="M0 370 L100 328 L230 352 L340 306 L445 340 L560 292 L665 325 L780 298 L900 338 L1020 310 L1140 345 L1270 318 L1360 342 L1440 330 L1440 420 L0 420 Z"
            fill="url(#mountainGradNear)"
            opacity="0.90"
            style={{ willChange: "transform" }}
          />
        </svg>
      </div>

      {/* ── Mid-height Mist Layer ── */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          bottom: "28%",
          height: "80px",
          background:
            "linear-gradient(to top, rgba(12, 8, 16, 0.22) 0%, rgba(25, 15, 22, 0.12) 60%, transparent 100%)",
          filter: "blur(8px)",
        }}
      />

      {/* ── Soft Valley Mist Overlay ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-44 sm:h-56"
        style={{
          background:
            "linear-gradient(to top, #080a0f 25%, rgba(18, 14, 22, 0.75) 65%, transparent 100%)",
        }}
      />

      {/* ── Golden Dust Motes (Floating Embers of Merit) — 32 motes, smaller & slower ── */}
      {motes.map((mote) => (
        <div
          key={mote.id}
          className="absolute rounded-full bg-[#f3c267] blur-[0.5px]"
          style={{
            left: mote.left,
            top: mote.top,
            width: mote.size,
            height: mote.size,
            opacity: mote.opacity,
            boxShadow: "0 0 5px rgba(243, 194, 103, 0.75)",
            animation: `mote-float ${mote.duration} ease-in-out infinite`,
            animationDelay: mote.delay,
          }}
        />
      ))}
    </div>
  );
}
