"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export interface CandleData {
  id: number;
  period: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: string;
  signal?: "BUY" | "SELL";
  signalNote?: string;
}

// 18 realistic sample candles showing market cycle: rally, pullback, capitulation dip, and AI-predicted breakout
export const SAMPLE_CANDLES: CandleData[] = [
  { id: 1, period: "09:30", open: 146.5, high: 148.8, low: 145.2, close: 148.2, volume: "1.2M" },
  { id: 2, period: "10:00", open: 148.2, high: 151.6, low: 147.5, close: 151.0, volume: "1.5M" },
  { id: 3, period: "10:30", open: 151.0, high: 154.2, low: 149.8, close: 153.6, volume: "1.8M" },
  {
    id: 4,
    period: "11:00",
    open: 153.6,
    high: 158.0,
    low: 152.4,
    close: 155.8,
    volume: "2.4M",
    signal: "SELL",
    signalNote: "TAKE PROFIT (LOCAL PEAK)",
  },
  { id: 5, period: "11:30", open: 155.5, high: 156.2, low: 150.1, close: 151.0, volume: "2.1M" },
  { id: 6, period: "12:00", open: 150.8, high: 151.5, low: 146.2, close: 147.4, volume: "1.4M" },
  { id: 7, period: "12:30", open: 147.2, high: 148.8, low: 143.5, close: 144.2, volume: "1.1M" },
  { id: 8, period: "13:00", open: 144.0, high: 145.0, low: 139.8, close: 140.5, volume: "1.6M" },
  { id: 9, period: "13:30", open: 140.5, high: 141.6, low: 136.5, close: 137.8, volume: "2.8M" },
  {
    id: 10,
    period: "14:00",
    open: 138.0,
    high: 143.5,
    low: 136.8,
    close: 143.0,
    volume: "3.4M",
    signal: "BUY",
    signalNote: "LSTM OVERSOLD REVERSAL",
  },
  { id: 11, period: "14:30", open: 143.0, high: 146.8, low: 142.1, close: 145.8, volume: "2.2M" },
  { id: 12, period: "15:00", open: 145.5, high: 147.2, low: 143.8, close: 144.6, volume: "1.3M" },
  { id: 13, period: "15:30", open: 144.8, high: 149.2, low: 144.2, close: 148.5, volume: "1.9M" },
  { id: 14, period: "16:00", open: 148.5, high: 152.8, low: 147.8, close: 152.2, volume: "2.5M" },
  { id: 15, period: "16:30", open: 152.0, high: 153.6, low: 149.2, close: 150.4, volume: "1.7M" },
  { id: 16, period: "17:00", open: 150.5, high: 155.4, low: 150.0, close: 154.6, volume: "2.0M" },
  { id: 17, period: "17:30", open: 154.6, high: 158.5, low: 153.8, close: 157.9, volume: "2.6M" },
  {
    id: 18,
    period: "18:00 (NOW)",
    open: 157.9,
    high: 161.4,
    low: 157.0,
    close: 160.8,
    volume: "3.1M",
    signal: "BUY",
    signalNote: "BREAKOUT CONFIRMED",
  },
];

// Predictive steps extending into the future starting from the last candle
export interface ForecastStep {
  step: string;
  price: number;
  upper: number;
  lower: number;
}

export const FORECAST_STEPS: ForecastStep[] = [
  { step: "+1", price: 164.2, upper: 166.5, lower: 161.8 },
  { step: "+2", price: 167.6, upper: 171.0, lower: 164.2 },
  { step: "+3", price: 170.8, upper: 175.2, lower: 166.5 },
  { step: "+4", price: 174.0, upper: 179.5, lower: 168.8 },
  { step: "+5", price: 177.5, upper: 184.0, lower: 171.0 },
];

export default function TradingChartPreview() {
  const shouldReduceMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);

  // Layout parameters for responsive SVG (viewBox 0 0 500 175)
  const viewBoxWidth = 500;
  const viewBoxHeight = 175;

  const chartTop = 22;
  const chartBottom = 148;
  const chartHeight = chartBottom - chartTop;

  // Price scale bounds
  const minPrice = 132.0;
  const maxPrice = 186.0;

  const priceToY = useCallback(
    (price: number) => {
      const clamped = Math.max(minPrice, Math.min(maxPrice, price));
      const ratio = (maxPrice - clamped) / (maxPrice - minPrice);
      return chartTop + ratio * chartHeight;
    },
    [chartTop, chartHeight]
  );

  // Candle slot metrics
  const startX = 26;
  const candleSpacing = 18.2;
  const candleWidth = 9.5;

  // Compute calculated coordinates for each candle
  const computedCandles = useMemo(() => {
    return SAMPLE_CANDLES.map((c, i) => {
      const x = startX + i * candleSpacing;
      const wickX = x + candleWidth / 2;
      const isBullish = c.close >= c.open;
      const bodyTop = priceToY(Math.max(c.open, c.close));
      const bodyBottom = priceToY(Math.min(c.open, c.close));
      const bodyHeight = Math.max(2.5, bodyBottom - bodyTop);
      const wickTop = priceToY(c.high);
      const wickBottom = priceToY(c.low);
      const changePct = (((c.close - c.open) / c.open) * 100).toFixed(2);

      return {
        ...c,
        x,
        wickX,
        isBullish,
        bodyTop,
        bodyHeight,
        wickTop,
        wickBottom,
        changePct,
      };
    });
  }, [priceToY]);

  // Last candle position anchor for forecast
  const lastCandle = computedCandles[computedCandles.length - 1];
  const lastCandleAnchorX = lastCandle.wickX;
  const lastCandleAnchorY = priceToY(lastCandle.close);

  // Compute forecast points
  const forecastCoords = useMemo(() => {
    const spacing = 19;
    return FORECAST_STEPS.map((step, idx) => {
      const x = lastCandleAnchorX + (idx + 1) * spacing;
      const y = priceToY(step.price);
      const yUpper = priceToY(step.upper);
      const yLower = priceToY(step.lower);
      return { ...step, x, y, yUpper, yLower };
    });
  }, [lastCandleAnchorX, priceToY]);

  // Path for shaded forecast prediction tunnel
  const forecastTunnelPath = useMemo(() => {
    const upperPoints = [
      `${lastCandleAnchorX},${lastCandleAnchorY}`,
      ...forecastCoords.map((pt) => `${pt.x},${pt.yUpper}`),
    ];
    const lowerPoints = [
      ...forecastCoords.slice().reverse().map((pt) => `${pt.x},${pt.yLower}`),
      `${lastCandleAnchorX},${lastCandleAnchorY}`,
    ];
    return `M ${upperPoints.join(" L ")} L ${lowerPoints.join(" L ")} Z`;
  }, [lastCandleAnchorX, lastCandleAnchorY, forecastCoords]);

  // Path for dashed forecast center line
  const forecastLinePath = useMemo(() => {
    const points = [
      `${lastCandleAnchorX},${lastCandleAnchorY}`,
      ...forecastCoords.map((pt) => `${pt.x},${pt.y}`),
    ];
    return `M ${points.join(" L ")}`;
  }, [lastCandleAnchorX, lastCandleAnchorY, forecastCoords]);

  // Target endpoint
  const targetPoint = forecastCoords[forecastCoords.length - 1];

  // Mouse interaction handler for crosshair & tooltip
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Convert pixel position to SVG viewBox coordinates
      const svgX = (clientX / rect.width) * viewBoxWidth;
      const svgY = (clientY / rect.height) * viewBoxHeight;

      setCrosshairPos({ x: svgX, y: svgY });

      // Find closest historical candle
      let closestIdx = 0;
      let minDistance = Infinity;

      computedCandles.forEach((c, i) => {
        const dist = Math.abs(c.wickX - svgX);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      });

      // Hover active if within proximity
      if (minDistance < candleSpacing * 1.5 && svgX <= lastCandleAnchorX + 15) {
        setHoveredIndex(closestIdx);
      } else {
        setHoveredIndex(null);
      }
    },
    [computedCandles, lastCandleAnchorX, candleSpacing]
  );

  const handlePointerLeave = useCallback(() => {
    setHoveredIndex(null);
    setCrosshairPos(null);
  }, []);

  // Currently displayed candle in HUD
  const activeCandle = hoveredIndex !== null ? computedCandles[hoveredIndex] : lastCandle;

  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] flex flex-col select-none bg-[#090b10] p-3 sm:p-5 overflow-hidden">
      {/* ── Trading Terminal Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/[0.08] text-xs font-mono">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-[#F5F3EF] font-semibold tracking-wider">
            LSTM TRADING BOT
          </span>
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:inline text-[11px] tracking-wide">
            MULTI-STOCK PREDICTOR
          </span>
        </div>

        {/* Live Status or Active Signal */}
        <div className="flex items-center gap-2">
          {activeCandle.signal ? (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 border ${
                activeCandle.signal === "BUY"
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/15 border-rose-500/30 text-rose-300"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full animate-ping ${
                  activeCandle.signal === "BUY" ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
              <span>
                {activeCandle.signal} SIGNAL: {activeCandle.signalNote || "TRIGGERED"}
              </span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>FORECAST ACTIVE (+10.4%)</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Active OHLC Telemetry Ticker (Updates dynamically on Hover) ── */}
      <div className="flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] font-mono pt-2 pb-1 text-zinc-400 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <span className="text-zinc-200 font-semibold tracking-wider text-xs">
            NVDA · 30M
          </span>
          <span className="text-zinc-500">
            TIME: <strong className="text-zinc-300">{activeCandle.period}</strong>
          </span>
        </div>

        {/* Dynamic OHLC Values */}
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px]">
          <span>
            O: <strong className="text-zinc-300">{activeCandle.open.toFixed(2)}</strong>
          </span>
          <span>
            H: <strong className="text-zinc-300">{activeCandle.high.toFixed(2)}</strong>
          </span>
          <span>
            L: <strong className="text-zinc-300">{activeCandle.low.toFixed(2)}</strong>
          </span>
          <span>
            C:{" "}
            <strong
              className={
                activeCandle.isBullish ? "text-[#a6e3a1]" : "text-[#f38ba8]"
              }
            >
              {activeCandle.close.toFixed(2)}
            </strong>
          </span>
          <span
            className={`font-semibold ${
              activeCandle.isBullish ? "text-[#a6e3a1]" : "text-[#f38ba8]"
            }`}
          >
            ({activeCandle.isBullish ? "+" : ""}
            {activeCandle.changePct}%)
          </span>
        </div>
      </div>

      {/* ── Interactive Financial Candlestick SVG Chart ── */}
      <div className="flex-1 relative flex flex-col justify-center my-1">
        <svg
          ref={svgRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="w-full h-full max-h-[190px] overflow-visible cursor-crosshair touch-none"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label="Financial Candlestick Chart with AI LSTM Forecast"
        >
          <defs>
            {/* Shaded Violet Forecast Gradient */}
            <linearGradient id="forecastTunnelGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cba6f7" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#cba6f7" stopOpacity="0.04" />
            </linearGradient>

            {/* Bullish / Bearish Glow Filters */}
            <filter id="bullishGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#a6e3a1" floodOpacity="0.4" />
            </filter>
            <filter id="bearishGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#f38ba8" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* ── Grid Guidelines ── */}
          {[175, 165, 155, 145, 135].map((price) => {
            const y = priceToY(price);
            return (
              <g key={`grid-${price}`}>
                <line
                  x1={startX - 10}
                  y1={y}
                  x2={viewBoxWidth - 45}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                />
                {/* Right-Side Price Axis Labels */}
                <text
                  x={viewBoxWidth - 38}
                  y={y + 3}
                  fill="#6c7086"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="start"
                >
                  ${price.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* ── Forecast Separator Vertical Marker ── */}
          <line
            x1={lastCandleAnchorX + 10}
            y1={chartTop}
            x2={lastCandleAnchorX + 10}
            y2={chartBottom}
            stroke="#cba6f7"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity="0.55"
          />
          <text
            x={lastCandleAnchorX + 14}
            y={chartTop + 4}
            fill="#cba6f7"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="600"
            letterSpacing="0.05em"
          >
            LSTM FORECAST ➔
          </text>

          {/* ── AI Shaded Prediction Confidence Tunnel ── */}
          <path
            d={forecastTunnelPath}
            fill="url(#forecastTunnelGrad)"
            stroke="rgba(203, 166, 247, 0.25)"
            strokeWidth="0.75"
            strokeDasharray="2 2"
          />

          {/* ── AI Violet Dashed Center Prediction Line ── */}
          <path
            d={forecastLinePath}
            fill="none"
            stroke="#cba6f7"
            strokeWidth="2.2"
            strokeDasharray="4 3"
            strokeLinecap="round"
          />

          {/* Forecast Target Point Endpoint */}
          <circle
            cx={targetPoint.x}
            cy={targetPoint.y}
            r="5"
            fill="#cba6f7"
            opacity="0.35"
            className="animate-ping motion-reduce:animate-none"
          />
          <circle cx={targetPoint.x} cy={targetPoint.y} r="3" fill="#cba6f7" />
          <text
            x={targetPoint.x - 30}
            y={targetPoint.y - 8}
            fill="#cba6f7"
            fontSize="8.5"
            fontFamily="monospace"
            fontWeight="bold"
          >
            TARGET $177.50
          </text>

          {/* ── Candlesticks Rendering (18 Realistic OHLC Bars) ── */}
          {computedCandles.map((candle, idx) => {
            const isHovered = hoveredIndex === idx;
            const candleFill = candle.isBullish ? "#a6e3a1" : "#f38ba8";
            const candleStroke = candle.isBullish ? "#86d67e" : "#e77b98";

            return (
              <g
                key={`candle-${candle.id}`}
                className="transition-opacity duration-200"
                style={{
                  opacity: hoveredIndex !== null && !isHovered ? 0.45 : 1,
                }}
              >
                {/* Thin Upper & Lower Wicks (High/Low) */}
                <line
                  x1={candle.wickX}
                  y1={candle.wickTop}
                  x2={candle.wickX}
                  y2={candle.wickBottom}
                  stroke={candleFill}
                  strokeWidth={isHovered ? 1.8 : 1.2}
                  strokeLinecap="round"
                />

                {/* Rectangular Candle Body (Open/Close) */}
                <motion.rect
                  initial={shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.02,
                    ease: "easeOut",
                  }}
                  x={candle.x}
                  y={candle.bodyTop}
                  width={candleWidth}
                  height={candle.bodyHeight}
                  rx="1"
                  fill={candleFill}
                  stroke={candleStroke}
                  strokeWidth="0.8"
                  filter={
                    isHovered
                      ? candle.isBullish
                        ? "url(#bullishGlow)"
                        : "url(#bearishGlow)"
                      : undefined
                  }
                  className="cursor-pointer"
                />

                {/* ── Trading Signal Markers ── */}
                {/* BUY Signal Marker (Placed clearly below candle wick) */}
                {candle.signal === "BUY" && (
                  <g transform={`translate(${candle.wickX}, ${candle.wickBottom + 8})`}>
                    <polygon
                      points="0,-4 -4,3 4,3"
                      fill="#a6e3a1"
                      stroke="#090b10"
                      strokeWidth="0.8"
                    />
                    <rect
                      x="-14"
                      y="4"
                      width="28"
                      height="12"
                      rx="3"
                      fill="#121815"
                      stroke="#a6e3a1"
                      strokeWidth="0.8"
                    />
                    <text
                      x="0"
                      y="13"
                      fill="#a6e3a1"
                      fontSize="7.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      BUY
                    </text>
                  </g>
                )}

                {/* SELL Signal Marker (Placed clearly above candle wick) */}
                {candle.signal === "SELL" && (
                  <g transform={`translate(${candle.wickX}, ${candle.wickTop - 8})`}>
                    <polygon
                      points="0,4 -4,-3 4,-3"
                      fill="#f38ba8"
                      stroke="#090b10"
                      strokeWidth="0.8"
                    />
                    <rect
                      x="-14"
                      y="-16"
                      width="28"
                      height="12"
                      rx="3"
                      fill="#1e1215"
                      stroke="#f38ba8"
                      strokeWidth="0.8"
                    />
                    <text
                      x="0"
                      y="-7"
                      fill="#f38ba8"
                      fontSize="7.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      SELL
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ── Interactive Pointer Crosshair Overlay ── */}
          {crosshairPos && (
            <g className="pointer-events-none">
              {/* Vertical Crosshair Line */}
              <line
                x1={crosshairPos.x}
                y1={chartTop}
                x2={crosshairPos.x}
                y2={chartBottom}
                stroke="rgba(205, 214, 244, 0.35)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Horizontal Crosshair Line */}
              <line
                x1={startX - 10}
                y1={crosshairPos.y}
                x2={viewBoxWidth - 45}
                y2={crosshairPos.y}
                stroke="rgba(205, 214, 244, 0.25)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Center Crosshair Intersection Node */}
              <circle
                cx={crosshairPos.x}
                cy={crosshairPos.y}
                r="3"
                fill="#cba6f7"
                stroke="#090b10"
                strokeWidth="1"
              />
            </g>
          )}

          {/* ── Hovered Candle Floating Tooltip ── */}
          {hoveredIndex !== null && (
            <g
              transform={`translate(${Math.min(
                viewBoxWidth - 125,
                Math.max(10, computedCandles[hoveredIndex].wickX - 55)
              )}, 32)`}
              className="pointer-events-none"
            >
              <rect
                x="0"
                y="0"
                width="110"
                height="54"
                rx="6"
                fill="#13151f"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
                filter="drop-shadow(0 6px 12px rgba(0,0,0,0.65))"
              />
              <text x="7" y="13" fill="#a6adc8" fontSize="8" fontFamily="monospace">
                T: {computedCandles[hoveredIndex].period} | VOL: {computedCandles[hoveredIndex].volume}
              </text>
              <text x="7" y="24" fill="#bac2de" fontSize="8" fontFamily="monospace">
                O: {computedCandles[hoveredIndex].open.toFixed(2)}  H: {computedCandles[hoveredIndex].high.toFixed(2)}
              </text>
              <text x="7" y="35" fill="#bac2de" fontSize="8" fontFamily="monospace">
                L: {computedCandles[hoveredIndex].low.toFixed(2)}  C: {computedCandles[hoveredIndex].close.toFixed(2)}
              </text>
              <text
                x="7"
                y="46"
                fill={computedCandles[hoveredIndex].isBullish ? "#a6e3a1" : "#f38ba8"}
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {computedCandles[hoveredIndex].isBullish ? "▲ BULLISH" : "▼ BEARISH"}{" "}
                ({computedCandles[hoveredIndex].isBullish ? "+" : ""}
                {computedCandles[hoveredIndex].changePct}%)
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* ── Model Performance & Pipeline Telemetry Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/[0.08] text-[10px] sm:text-[11px] font-mono">
        <div className="text-zinc-400">
          <span className="block text-[9px] text-zinc-500 uppercase">MODEL ARCH</span>
          <span className="text-cyan-300 font-medium">LSTM (2-LAYER)</span>
        </div>
        <div className="text-zinc-400">
          <span className="block text-[9px] text-zinc-500 uppercase">TRAIN LOSS</span>
          <span className="text-[#a6e3a1] font-medium">0.0018 MSE</span>
        </div>
        <div className="text-zinc-400">
          <span className="block text-[9px] text-zinc-500 uppercase">ACCURACY</span>
          <span className="text-[#cba6f7] font-medium">84.6% DIRECTION</span>
        </div>
        <div className="text-zinc-400">
          <span className="block text-[9px] text-zinc-500 uppercase">STACK</span>
          <span className="text-[#fab387] font-medium">KERAS · PANDAS</span>
        </div>
      </div>
    </div>
  );
}
