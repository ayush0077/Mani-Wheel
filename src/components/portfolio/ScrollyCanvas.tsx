"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, motion, AnimatePresence } from "framer-motion";
import Overlay from "./Overlay";

// Default fallback total frames (150 frames: 000 to 149)
export const DEFAULT_TOTAL_FRAMES = 150;

export const getFallbackFramePath = (index: number) => {
  const clamped = Math.max(0, index);
  const padded = String(clamped).padStart(3, "0");
  return `/sequence/frame_${padded}_delay-0.067s.webp`;
};

interface ScrollyCanvasProps {
  onReturnToTerminal?: () => void;
}

export default function ScrollyCanvas({ onReturnToTerminal }: ScrollyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cached image elements
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Dynamic frame list & count
  const [totalFrames, setTotalFrames] = useState(DEFAULT_TOTAL_FRAMES);
  const totalFramesRef = useRef(DEFAULT_TOTAL_FRAMES);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Scroll progress from Framer Motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Helper to find closest loaded image if target frame is still downloading
  const getBestAvailableImage = useCallback((targetIndex: number): HTMLImageElement | null => {
    const list = imagesRef.current;
    if (!list || list.length === 0) return null;

    if (list[targetIndex] && list[targetIndex].complete && list[targetIndex].naturalWidth > 0) {
      return list[targetIndex];
    }

    // Search outward for closest loaded image
    for (let offset = 1; offset < totalFramesRef.current; offset++) {
      const prev = targetIndex - offset;
      if (prev >= 0 && list[prev] && list[prev].complete && list[prev].naturalWidth > 0) {
        return list[prev];
      }
      const next = targetIndex + offset;
      if (next < totalFramesRef.current && list[next] && list[next].complete && list[next].naturalWidth > 0) {
        return list[next];
      }
    }

    return list[0] || null;
  }, []);

  // Render a specific frame onto the HTML5 Canvas with object-fit: cover
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = getBestAvailableImage(frameIndex);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Retina / HiDPI support capped at 2 for optimal 60fps performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    const imgRatio = imgW / imgH;
    const canvasRatio = displayWidth / displayHeight;

    let renderW = displayWidth;
    let renderH = displayHeight;

    // object-fit: cover logic
    if (canvasRatio > imgRatio) {
      renderW = displayWidth;
      renderH = displayWidth / imgRatio;
    } else {
      renderH = displayHeight;
      renderW = displayHeight * imgRatio;
    }

    const offsetX = (displayWidth - renderW) / 2;
    const offsetY = (displayHeight - renderH) / 2;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

    ctx.restore();
  }, [getBestAvailableImage]);

  // Load sequence frames dynamically
  useEffect(() => {
    let isCancelled = false;

    // Safety timeout: dismiss preloader after 1.2s regardless so canvas is never blocked
    const fallbackTimer = setTimeout(() => {
      if (!isCancelled) setIsPreloaded(true);
    }, 1200);

    async function loadSequence() {
      let frameUrls: string[] = [];

      try {
        const res = await fetch("/api/sequence-info");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.frames) && data.frames.length > 0) {
            frameUrls = data.frames;
          }
        }
      } catch (e) {
        console.warn("Could not fetch sequence manifest, using fallback generation", e);
      }

      // If API didn't return list, generate default 150 frames
      if (frameUrls.length === 0) {
        frameUrls = Array.from({ length: DEFAULT_TOTAL_FRAMES }, (_, i) =>
          getFallbackFramePath(i)
        );
      }

      const count = frameUrls.length;
      setTotalFrames(count);
      totalFramesRef.current = count;

      const images: HTMLImageElement[] = new Array(count);
      let loaded = 0;

      frameUrls.forEach((url, i) => {
        const img = new Image();
        img.src = url;

        img.onload = () => {
          if (isCancelled) return;
          images[i] = img;
          loaded++;
          setLoadedCount(loaded);

          // Immediately render frame 0 so the user gets instant visual feedback
          if (i === 0) {
            renderFrame(0);
          }

          // Dismiss preloader as soon as the first few frames are ready
          if (loaded >= Math.min(5, count)) {
            setIsPreloaded(true);
          }
        };

        img.onerror = () => {
          if (isCancelled) return;
          // Fallback duplicate from previous loaded image
          loaded++;
          setLoadedCount(loaded);
          if (loaded >= Math.min(5, count)) {
            setIsPreloaded(true);
          }
        };
      });

      imagesRef.current = images;
    }

    loadSequence();

    return () => {
      isCancelled = true;
      clearTimeout(fallbackTimer);
    };
  }, [renderFrame]);

  // Scrub through the image sequence in sync with scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latestProgress) => {
      const maxIndex = Math.max(0, totalFramesRef.current - 1);
      const targetFrame = Math.min(
        Math.max(Math.floor(latestProgress * maxIndex), 0),
        maxIndex
      );

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => {
          renderFrame(targetFrame);
        });
      }
    });

    return () => {
      unsubscribe();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [scrollYProgress, renderFrame]);

  // Redraw on window resize
  useEffect(() => {
    const handleResize = () => {
      renderFrame(currentFrameRef.current);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame]);

  const loadPercent = Math.min(100, Math.round((loadedCount / totalFrames) * 100));

  return (
    <div
      ref={containerRef}
      id="scrolly-container"
      className="relative w-full h-[500vh] bg-black"
      style={{ isolation: "isolate" }}
    >
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{ objectFit: "cover" }}
        />

        {/* Ambient Dark Gradient Vignette for Seamless Blending */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.85) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Bottom edge seamless transition gradient into projects section (280-320px) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 sm:h-80 z-20"
          style={{
            background:
              "linear-gradient(to top, #0d0f14 0%, rgba(13,15,20,0.96) 25%, rgba(13,15,20,0.7) 55%, rgba(13,15,20,0.25) 80%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Parallax Overlay Component */}
        <Overlay
          scrollYProgress={scrollYProgress}
          onReturnToTerminal={onReturnToTerminal}
        />

        {/* Cinematic Preloader HUD while frames stream in */}
        <AnimatePresence>
          {!isPreloaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
            >
              <div className="flex flex-col items-center gap-5 p-8 max-w-sm w-full mx-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-2xl">
                {/* Pulsing indicator */}
                <div className="relative flex items-center justify-center w-12 h-12">
                  <div className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping" />
                  <div className="w-8 h-8 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
                </div>

                <div className="text-center space-y-1">
                  <div className="text-xs uppercase tracking-[0.25em] text-violet-300 font-mono">
                    Loading Sequence
                  </div>
                  <div className="text-2xl font-bold font-mono tracking-tight text-white">
                    {loadPercent}%
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-emerald-400 rounded-full"
                    style={{ width: `${Math.max(5, loadPercent)}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>

                <div className="text-[11px] font-mono text-zinc-400 tracking-wider">
                  DECODING {totalFrames} FRAMES
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Container bottom anchor fade for when sticky viewport reaches end */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-72 sm:h-96 z-20"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(13,15,20,0.5) 45%, #0d0f14 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
