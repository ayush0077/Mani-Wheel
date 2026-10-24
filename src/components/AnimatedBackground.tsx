"use client";

import { useEffect, useRef } from "react";

// Catppuccin Mocha colors used for Matrix digital rain
const MATRIX_CHARS =
  "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>:+-*=%#@&";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const FONT_SIZE = 14;
    let animFrameId = 0;
    let lastDropTime = 0;
    const DROP_INTERVAL = 33; // ~30 FPS for authentic retro feel & low CPU load

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];

    const initGrid = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      columns = Math.max(1, Math.floor(width / FONT_SIZE));
      drops = [];
      for (let i = 0; i < columns; i++) {
        // Stagger drops initially across the screen height
        drops[i] = Math.floor(Math.random() * -50);
      }
    };

    initGrid();

    // Static fallback for prefers-reduced-motion
    if (motionQuery.matches) {
      drawStaticMatrix(ctx, width, height, columns, FONT_SIZE);
      const handleMotionChange = (e: MediaQueryListEvent) => {
        if (!e.matches) {
          window.location.reload();
        }
      };
      motionQuery.addEventListener("change", handleMotionChange);
      return () => {
        motionQuery.removeEventListener("change", handleMotionChange);
      };
    }

    // Render loop
    const render = (time: number) => {
      animFrameId = requestAnimationFrame(render);

      if (time - lastDropTime < DROP_INTERVAL) return;
      lastDropTime = time;

      // Draw faint translucent background to fade trails
      // Uses Catppuccin Mocha Crust (#11111b)
      ctx.fillStyle = "rgba(17, 17, 27, 0.09)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

      for (let i = 0; i < columns; i++) {
        const y = drops[i] * FONT_SIZE;

        if (y > 0 && y <= height + FONT_SIZE * 2) {
          const char =
            MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];

          // Leading drop: bright text/glow in Catppuccin text (#cdd6f4 / light green)
          ctx.fillStyle = "rgba(235, 255, 240, 0.85)";
          ctx.fillText(char, i * FONT_SIZE, y);

          // Trail character just behind the head: Catppuccin Mocha Green (#a6e3a1)
          if (y - FONT_SIZE > 0) {
            const trailChar =
              MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            ctx.fillStyle = "rgba(166, 227, 161, 0.35)";
            ctx.fillText(trailChar, i * FONT_SIZE, y - FONT_SIZE);
          }
        }

        // Reset drop to top with randomized timing
        if (y > height && Math.random() > 0.98) {
          drops[i] = 0;
        } else {
          drops[i]++;
        }
      }
    };

    animFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      initGrid();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 w-full h-full opacity-20 sm:opacity-25"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

// Static Matrix pattern for reduced-motion users
function drawStaticMatrix(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  columns: number,
  fontSize: number
) {
  ctx.fillStyle = "#11111b";
  ctx.fillRect(0, 0, width, height);

  ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

  // Draw faint static columns
  for (let i = 0; i < columns; i += 2) {
    const colHeight = Math.floor(Math.random() * (height / fontSize));
    for (let j = 0; j < colHeight; j++) {
      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      const alpha = Math.max(0.04, 0.25 - (colHeight - j) * 0.01);
      ctx.fillStyle = `rgba(166, 227, 161, ${alpha})`;
      ctx.fillText(char, i * fontSize, j * fontSize);
    }
  }
}
