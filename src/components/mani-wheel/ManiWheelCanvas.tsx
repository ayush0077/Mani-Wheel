"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 102;
const MAX_SPEED = 2.5;
const DRAG_SENSITIVITY = 0.022;
const COAST_FRICTION = 0.972;
const DRAG_DAMPING = 0.992;
const MIN_VEL = 0.005;
const SETTLE_AMPLITUDE = 0.28;
const SETTLE_DECAY = 0.82;

// Circular buffer for velocity estimation from recent pointer history
const POINTER_HISTORY_SIZE = 8;

interface PointerSample {
  x: number;
  t: number;
}

interface ManiWheelCanvasProps {
  onSpinComplete?: (spinCount: number) => void;
  onSpinStart?: () => void;
}

export default function ManiWheelCanvas({
  onSpinComplete,
  onSpinStart,
}: ManiWheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const frameFloatRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const dragDistRef = useRef(0);
  const pointerHistoryRef = useRef<PointerSample[]>([]);
  const accumulatedRef = useRef(0);
  const spinCountRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const currentBlurRef = useRef(0);
  const settlingRef = useRef(false);
  const settleVelRef = useRef(0);
  const reducedMotionRef = useRef(false);

  // Draw frame onto canvas
  const drawFrame = useCallback((frameFloat: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const frameIndex =
      ((Math.floor(frameFloat) % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
    if (frameIndex === lastDrawnFrameRef.current) return;
    lastDrawnFrameRef.current = frameIndex;

    const img = imagesRef.current[frameIndex] || imagesRef.current[0];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayW = canvas.clientWidth;
    const displayH = canvas.clientHeight;

    if (
      canvas.width !== displayW * dpr ||
      canvas.height !== displayH * dpr
    ) {
      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displayW, displayH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = displayW / displayH;
    let renderW = displayW,
      renderH = displayH;
    if (canvasRatio > imgRatio) {
      renderH = displayH;
      renderW = displayH * imgRatio;
    } else {
      renderW = displayW;
      renderH = displayW / imgRatio;
    }
    const offsetX = (displayW - renderW) / 2;
    const offsetY = (displayH - renderH) / 2;

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    ctx.restore();
  }, []);

  // Update motion blur on canvas element
  const updateBlur = useCallback((vel: number) => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotionRef.current) {
      if (canvas) canvas.style.filter = "";
      return;
    }
    const absVel = Math.abs(vel);
    let targetBlur = 0;
    if (absVel > 0.8) {
      targetBlur = Math.min((absVel - 0.8) * 0.85, 1.5);
    }
    // Smooth blur transitions
    currentBlurRef.current = currentBlurRef.current * 0.7 + targetBlur * 0.3;
    if (currentBlurRef.current < 0.05) {
      canvas.style.filter = "";
      currentBlurRef.current = 0;
    } else {
      canvas.style.filter = `blur(${currentBlurRef.current.toFixed(2)}px)`;
    }
  }, []);

  // Preload frames — priority batch first, then the rest in background
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let count = 0;

    const loadFrame = (i: number) => {
      const img = new Image();
      const padded = String(i).padStart(3, "0");
      img.src = `/maniwheel/IloveMP4_Tibetan_prayer_wheel_rotating_20261021180609_${padded}.webp`;
      img.onload = () => {
        if (cancelled) return;
        images[i] = img;
        count++;
        setLoadedCount(count);
        if (i === 0 && frameFloatRef.current === 0) drawFrame(0);
        if (count >= 15) setIsReady(true);
      };
      img.onerror = () => {
        if (cancelled) return;
        count++;
        setLoadedCount(count);
        if (count >= 15) setIsReady(true);
      };
    };

    // Load frames 0–15 immediately
    for (let i = 0; i <= 15; i++) loadFrame(i);

    // Load rest in background after a short delay
    const timer = setTimeout(() => {
      if (cancelled) return;
      for (let i = 16; i < TOTAL_FRAMES; i++) loadFrame(i);
    }, 200);

    imagesRef.current = images;

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [drawFrame]);

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);


  // Main animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now: number) => {
      const deltaMs = Math.min(now - lastTime, 50);
      lastTime = now;
      const rate = deltaMs / 16.67;

      if (isDraggingRef.current) {
        velocityRef.current *= Math.pow(DRAG_DAMPING, rate);
      } else if (settlingRef.current) {
        // Mechanical settling: damped oscillation
        if (!reducedMotionRef.current) {
          settleVelRef.current *= Math.pow(SETTLE_DECAY, rate);
          if (Math.abs(settleVelRef.current) < 0.008) {
            settlingRef.current = false;
            settleVelRef.current = 0;
            velocityRef.current = 0;
          } else {
            velocityRef.current = settleVelRef.current;
          }
        } else {
          settlingRef.current = false;
          velocityRef.current = 0;
        }
      } else {
        velocityRef.current *= Math.pow(COAST_FRICTION, rate);
        // Enter settling phase when velocity is very small but non-zero
        if (
          !settlingRef.current &&
          Math.abs(velocityRef.current) > MIN_VEL &&
          Math.abs(velocityRef.current) < 0.06
        ) {
          settlingRef.current = true;
          settleVelRef.current = -velocityRef.current * SETTLE_AMPLITUDE;
        }
      }

      const absVel = Math.abs(velocityRef.current);
      if (absVel > MIN_VEL) {
        const step = velocityRef.current * rate;
        frameFloatRef.current =
          ((frameFloatRef.current + step) % TOTAL_FRAMES + TOTAL_FRAMES) %
          TOTAL_FRAMES;
        const stepAbs = Math.abs(step);
        accumulatedRef.current += stepAbs;

        // Count full revolutions continuously
        while (accumulatedRef.current >= TOTAL_FRAMES) {
          accumulatedRef.current -= TOTAL_FRAMES;
          spinCountRef.current += 1;
          onSpinComplete?.(spinCountRef.current);
        }

        drawFrame(frameFloatRef.current);
        updateBlur(velocityRef.current);
      } else if (!settlingRef.current) {
        if (velocityRef.current !== 0) {
          velocityRef.current = 0;
          updateBlur(0);
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawFrame, updateBlur, onSpinComplete]);

  // Resize handler
  useEffect(() => {
    const onResize = () => {
      lastDrawnFrameRef.current = -1;
      drawFrame(frameFloatRef.current);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [drawFrame]);

  // Pointer handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDraggingRef.current = true;
      settlingRef.current = false;
      settleVelRef.current = 0;
      setIsPointerDown(true);
      lastXRef.current = e.clientX;
      dragDistRef.current = 0;
      pointerHistoryRef.current = [{ x: e.clientX, t: performance.now() }];
      // Cushion current speed to 35% when grabbing moving wheel
      velocityRef.current *= 0.35;
      onSpinStart?.();
    },
    [onSpinStart]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      const now = performance.now();
      const currentX = e.clientX;
      const deltaX = currentX - lastXRef.current;
      lastXRef.current = currentX;
      dragDistRef.current += Math.abs(deltaX);

      // Record pointer history for velocity estimation
      const history = pointerHistoryRef.current;
      history.push({ x: currentX, t: now });
      if (history.length > POINTER_HISTORY_SIZE) history.shift();

      // Apply impulse proportional to drag delta
      const impulse = -deltaX * DRAG_SENSITIVITY;
      const newVel = velocityRef.current + impulse;
      velocityRef.current = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newVel));

      if (dragDistRef.current > 10 && !hasInteracted) {
        setHasInteracted(true);
      }
    },
    [hasInteracted]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsPointerDown(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* safe */
      }

      // Estimate throw velocity from recent pointer history (last ~80ms)
      const history = pointerHistoryRef.current;
      const now = performance.now();
      const recent = history.filter((s) => now - s.t < 80);
      if (recent.length >= 2) {
        const oldest = recent[0];
        const newest = recent[recent.length - 1];
        const dt = newest.t - oldest.t;
        if (dt > 5) {
          const dx = newest.x - oldest.x;
          // Convert px/ms to frames/frame; negate because right-to-left = clockwise
          const pxPerMs = -dx / dt;
          const estimatedVel = pxPerMs * 16.67 * DRAG_SENSITIVITY * 60;
          const clamped = Math.max(
            -MAX_SPEED,
            Math.min(MAX_SPEED, estimatedVel)
          );
          // Blend with current velocity (weighted toward estimate for natural throw feel)
          velocityRef.current =
            velocityRef.current * 0.3 + clamped * 0.7;
        }
      }

      // Tap without meaningful drag → gentle sacred spin
      if (dragDistRef.current < 6) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        velocityRef.current = clickX > rect.width / 2 ? 1.1 : -1.1;
      }

      if (dragDistRef.current > 10) setHasInteracted(true);
      pointerHistoryRef.current = [];
    },
    []
  );

  // Keyboard handler for accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onSpinStart?.();
      const impulse = 0.8;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          velocityRef.current = Math.min(
            MAX_SPEED,
            velocityRef.current + impulse
          );
          setHasInteracted(true);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          velocityRef.current = Math.max(
            -MAX_SPEED,
            velocityRef.current - impulse
          );
          setHasInteracted(true);
          break;
        case " ":
          e.preventDefault();
          velocityRef.current =
            velocityRef.current === 0
              ? 1.2
              : Math.max(
                  -MAX_SPEED,
                  Math.min(MAX_SPEED, velocityRef.current * 1.5)
                );
          setHasInteracted(true);
          break;
      }
    },
    [onSpinStart]
  );

  const loadPercent = Math.min(
    100,
    Math.round((loadedCount / TOTAL_FRAMES) * 100)
  );

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={[
        "relative w-full max-w-6xl h-[340px] sm:h-[440px] md:h-[520px] lg:h-[620px] xl:h-[670px]",
        "mx-auto flex items-center justify-center",
        "select-none touch-none",
        isPointerDown ? "cursor-grabbing" : "cursor-grab",
        "focus-visible:outline-2 focus-visible:outline-[#e5c07b] focus-visible:outline-offset-4 rounded-2xl",
        "transition-all duration-300",
      ]
        .filter(Boolean)
        .join(" ")}
      role="region"
      aria-label="Interactive Mani Prayer Wheel. Drag left or right to spin. Use arrow keys or Space to spin with keyboard."
    >
      {/* Ambient glow halo */}
      <div
        className={`pointer-events-none absolute w-[340px] sm:w-[460px] md:w-[560px] lg:w-[680px] xl:w-[740px] h-[340px] sm:h-[460px] md:h-[560px] lg:h-[680px] xl:h-[740px] rounded-full transition-opacity duration-500 blur-2xl ${
          isHovered && !isPointerDown ? "opacity-70" : "opacity-45"
        }`}
        style={{
          background:
            "radial-gradient(circle, rgba(230,165,60,0.30) 0%, rgba(180,70,25,0.12) 50%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle hover ring overlay */}
      {isHovered && !isPointerDown && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#e5c07b]/20 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full block relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.65)] transition-transform duration-100 ${
          isPointerDown ? "scale-[0.99]" : "scale-100"
        }`}
      />

      {/* Drag-to-spin hint */}
      {!hasInteracted && isReady && (
        <div
          className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-[#e5c07b]/30 backdrop-blur-sm animate-fade-in"
          aria-hidden="true"
        >
          <span className="text-[11px] font-mono tracking-widest text-[#e5c07b]/80 uppercase">
            ↔ Drag to Spin
          </span>
        </div>
      )}

      {/* Loading indicator */}
      {!isReady && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0a0c10]/90 backdrop-blur-md rounded-3xl">
          <div className="flex flex-col items-center gap-4 p-6 max-w-xs w-full text-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#d49e24]/20 animate-ping" />
              <div className="w-8 h-8 rounded-full border-2 border-[#d49e24] border-t-transparent animate-spin" />
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.25em] text-[#e5c07b] font-mono">
                Sanctuary Preparing
              </span>
              <div className="text-xl font-bold font-mono text-white">
                {loadPercent}%
              </div>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#d49e24] via-[#e5c07b] to-[#2ba89c] rounded-full transition-all duration-200"
                style={{ width: `${loadPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#a6adc8]/70">
              ALIGNING SACRED FRAMES
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
