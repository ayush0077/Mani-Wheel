"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { processCommand, type OutputLine, type AppPhase } from "@/lib/commands";

const MAX_HISTORY = 100;
const AUTOCOMPLETE_TARGETS = [
  "ssh tamrakar@ayush",
  "cd /works",
  "cd /stacks",
  "cd /contact",
  "rm -rf /",
  "projects",
  "skills",
  "contact",
  "about",
  "help",
  "clear",
  "exit",
  "whoami",
];

export interface UseTerminalOptions {
  initialPhase?: AppPhase;
  initialLines?: OutputLine[];
  onNavigateSection?: (section: string) => void;
  onExit?: () => void;
  prompt?: string;
}

export function useTerminal(options?: UseTerminalOptions) {
  const router = useRouter();
  const [outputLines, setOutputLines] = useState<OutputLine[]>(
    options?.initialLines || []
  );
  const [inputValue, setInputValue] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [phase, setPhase] = useState<AppPhase>(
    options?.initialPhase || "boot"
  );
  const commandHistory = useRef<string[]>([]);

  const prompt = options?.prompt || "tamrakar@ayush:~$";

  // Calculate autocomplete suggestion when user types matching prefix
  const { isCompletable, activeTarget, suggestionRemainder } = useMemo(() => {
    const trimmed = inputValue.trimStart();
    if (!trimmed) {
      return { isCompletable: false, activeTarget: "", suggestionRemainder: "" };
    }
    const lower = trimmed.toLowerCase();
    const match = AUTOCOMPLETE_TARGETS.find(
      (t) => t.toLowerCase().startsWith(lower) && t.length > lower.length
    );
    if (match) {
      return {
        isCompletable: true,
        activeTarget: match,
        suggestionRemainder: match.slice(trimmed.length),
      };
    }
    return { isCompletable: false, activeTarget: "", suggestionRemainder: "" };
  }, [inputValue]);

  const executeCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();

      // Add to history if non-empty
      if (trimmed) {
        commandHistory.current = [trimmed, ...commandHistory.current].slice(
          0,
          MAX_HISTORY
        );
      }

      // Echo the input line
      const inputLine: OutputLine = {
        type: "input",
        content: trimmed,
        prompt,
      };

      const { lines, action, target } = processCommand(raw);

      if (action === "clear") {
        setOutputLines([]);
        setInputValue("");
        setHistoryIndex(-1);
        return;
      }

      if (action === "ssh") {
        setOutputLines((prev) => [...prev, inputLine]);
        setInputValue("");
        setHistoryIndex(-1);
        setPhase("ssh-connecting");
        return;
      }

      if (action === "teleport") {
        setOutputLines((prev) => [...prev, inputLine, ...lines]);
        setInputValue("");
        setHistoryIndex(-1);
        setTimeout(() => {
          router.push("/mani-wheel");
        }, 400);
        return;
      }

      if (action === "navigate") {
        setOutputLines((prev) => [...prev, inputLine, ...lines]);
        setInputValue("");
        setHistoryIndex(-1);
        if (target && options?.onNavigateSection) {
          options.onNavigateSection(target);
        }
        return;
      }

      if (action === "exit") {
        setOutputLines((prev) => [...prev, inputLine, ...lines]);
        setInputValue("");
        setHistoryIndex(-1);
        if (options?.onExit) {
          setTimeout(() => {
            options.onExit?.();
          }, 350);
        }
        return;
      }

      setOutputLines((prev) => [...prev, inputLine, ...lines]);
      setInputValue("");
      setHistoryIndex(-1);
    },
    [prompt, router, options]
  );

  const acceptSuggestion = useCallback(() => {
    if (isCompletable && activeTarget) {
      setInputValue(activeTarget);
    }
  }, [isCompletable, activeTarget]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Tab to accept inline suggestion
      if (e.key === "Tab") {
        if (isCompletable && activeTarget) {
          e.preventDefault();
          setInputValue(activeTarget);
          return;
        }
      }

      // Enter executes completed command if suggestion is active, or normal command
      if (e.key === "Enter") {
        e.preventDefault();
        if (isCompletable && activeTarget) {
          executeCommand(activeTarget);
          return;
        }
        executeCommand(inputValue);
        return;
      }

      // Right arrow at end of input also accepts suggestion
      if (e.key === "ArrowRight" && isCompletable && activeTarget) {
        const inputEl = e.currentTarget;
        if (inputEl.selectionStart === inputValue.length) {
          e.preventDefault();
          setInputValue(activeTarget);
          return;
        }
      }

      // Command history navigation
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const history = commandHistory.current;
        if (history.length === 0) return;
        const newIndex = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex <= 0) {
          setHistoryIndex(-1);
          setInputValue("");
          return;
        }
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory.current[newIndex]);
        return;
      }

      // Ctrl+L to clear
      if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setOutputLines([]);
        return;
      }

      // Ctrl+C to cancel input
      if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        const cancelLine: OutputLine = {
          type: "input",
          content: inputValue + "^C",
          prompt,
        };
        setOutputLines((prev) => [...prev, cancelLine]);
        setInputValue("");
        setHistoryIndex(-1);
        return;
      }
    },
    [inputValue, historyIndex, executeCommand, prompt, isCompletable, activeTarget]
  );

  const onPhaseComplete = useCallback((next: AppPhase) => {
    setPhase(next);
  }, []);

  return {
    outputLines,
    inputValue,
    setInputValue,
    handleKeyDown,
    phase,
    setPhase,
    onPhaseComplete,
    prompt,
    suggestionRemainder,
    acceptSuggestion,
  };
}
