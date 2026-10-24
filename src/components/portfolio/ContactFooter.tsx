"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Mail,
  Terminal,
  ArrowUp,
  ArrowUpRight,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./Icons";

interface ContactFooterProps {
  onReturnToTerminal?: () => void;
}

export default function ContactFooter({ onReturnToTerminal }: ContactFooterProps) {
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const email = "ayush.tamrakar.90@gmail.com";

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      className="relative w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-8 md:px-12 bg-[#090b0e] text-white border-t border-white/10 overflow-hidden"
    >
      {/* ── Background Subtle Ambient Lighting ── */}
      <div
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[350px] opacity-40 blur-3xl -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(203,166,247,0.08) 0%, rgba(166,227,161,0.03) 45%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        className="max-w-6xl mx-auto space-y-12 sm:space-y-14"
      >
        {/* ── Main Contact Callout Block ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 sm:pb-12 border-b border-white/10">
          <div className="space-y-4 max-w-2xl">
            {/* Eyebrow & Compact Availability Indicator */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-zinc-600 font-mono text-xs hidden sm:inline" aria-hidden="true">
                •
              </span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-300 select-none">
                <span
                  className="w-2 h-2 rounded-full bg-[#A6E3A1] shadow-[0_0_8px_#A6E3A1] animate-pulse motion-reduce:animate-none shrink-0"
                  aria-hidden="true"
                />
                <span className="tracking-wider">AVAILABLE FOR SELECT WORK // 2026</span>
              </div>
            </div>

            {/* Bold Two-Line Headline with Mauve Accent */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F3EF] leading-[1.12]">
              Have an ambitious vision?
              <span className="block text-[#CBA6F7] mt-1 sm:mt-1.5">
                Let&apos;s build it.
              </span>
            </h2>

            {/* Supporting Description */}
            <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed pt-1 max-w-xl">
              Currently open for select freelance commissions, creative engineering roles,
              and interactive digital platforms. Reach out directly or initiate a terminal handshake.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
            {/* Primary Email Clipboard CTA */}
            <button
              onClick={handleCopy}
              type="button"
              className="
                group relative inline-flex items-center justify-center gap-2.5
                px-6 py-3.5 rounded-xl
                bg-violet-600 hover:bg-violet-500 active:bg-violet-700
                text-white font-mono text-xs tracking-wider uppercase
                transition-all duration-200 cursor-pointer
                shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40
                hover:-translate-y-0.5 active:translate-y-0
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b0e]
              "
              title="Copy email address to clipboard"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-300" />
                  <span className="text-emerald-200 font-semibold tracking-wider">EMAIL COPIED!</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-violet-200 group-hover:scale-110 transition-transform" />
                  <span>COPY EMAIL ADDRESS</span>
                </>
              )}
            </button>

            {/* Direct Mail Mailto Button */}
            <a
              href={`mailto:${email}`}
              className="
                group inline-flex items-center justify-center gap-2
                px-5 py-3.5 rounded-xl
                bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.08]
                border border-white/10 hover:border-white/20
                text-zinc-200 hover:text-white font-mono text-xs tracking-wider uppercase
                transition-all duration-200
                hover:-translate-y-0.5 active:translate-y-0
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b0e]
              "
              title="Open default mail client"
            >
              <Mail size={14} className="text-zinc-400 group-hover:text-white transition-colors" />
              <span>DIRECT MAIL</span>
              <ArrowUpRight size={13} className="text-zinc-400 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>

        {/* ── Sub-Navigation & Controls Row ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs font-mono text-zinc-400">
          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-5">
            <a
              href="https://github.com/ayush0077/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400 rounded px-1"
              title="GitHub Profile"
            >
              <GithubIcon size={14} />
              <span>GitHub</span>
            </a>
            <span className="text-zinc-700 select-none" aria-hidden="true">
              /
            </span>
            <a
              href="https://www.linkedin.com/in/ayush-tamrakar-618902191/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-[#89B4FA] transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded px-1"
              title="LinkedIn Profile"
            >
              <LinkedinIcon size={14} />
              <span>LinkedIn</span>
            </a>
            <span className="text-zinc-700 select-none" aria-hidden="true">
              /
            </span>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-[#A6E3A1] transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded px-1"
              title="X / Twitter Profile"
            >
              <TwitterIcon size={14} />
              <span>X</span>
            </a>
          </div>

          {/* Controls: SSH Exit & Back to Top */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {onReturnToTerminal && (
              <button
                onClick={onReturnToTerminal}
                type="button"
                className="
                  group inline-flex items-center gap-2
                  px-3.5 py-2 rounded-xl
                  bg-[#11131a] hover:bg-[#161922]
                  border border-emerald-500/25 hover:border-emerald-400/50
                  text-emerald-300 hover:text-emerald-200 text-xs font-mono
                  transition-all duration-200 cursor-pointer shadow-sm
                  hover:shadow-[0_0_15px_rgba(166,227,161,0.15)]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50
                "
                title="Return to interactive terminal session"
              >
                <Terminal size={13} className="text-emerald-400 group-hover:rotate-6 transition-transform" />
                <span>$ ssh exit</span>
                <span className="text-zinc-400 hidden md:inline">(Return to CLI)</span>
                <span className="cursor-blink text-emerald-400 font-bold ml-0.5">_</span>
              </button>
            )}

            {/* Separate Back to Top Button */}
            <button
              onClick={scrollToTop}
              type="button"
              className="
                p-2.5 rounded-xl
                bg-white/[0.04] hover:bg-white/[0.09] active:bg-white/[0.06]
                border border-white/10 hover:border-white/25
                text-zinc-300 hover:text-white
                transition-all duration-200 cursor-pointer shadow-sm
                hover:-translate-y-0.5 active:translate-y-0
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40
              "
              aria-label="Scroll back to top"
              title="Scroll back to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* ── Copyright & Technical Colophon ── */}
        <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-mono text-zinc-400">
          <div>
            © 2026 Ayush Tamrakar · All rights reserved.
          </div>
          <div className="text-zinc-400 tracking-wider">
            ENGINEERED WITH DIMAK · MOTION · JOHNCHINA
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
