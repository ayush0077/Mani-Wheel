// Terminal command definitions and processing logic

export type OutputLine =
  | { type: "input"; content: string; prompt: string }
  | { type: "output"; content: string; className?: string }
  | { type: "error"; content: string }
  | { type: "ssh"; content: string; className?: string };

export type AppPhase =
  | "boot"
  | "navigation"
  | "terminal"
  | "ssh-connecting"
  | "portfolio";

export type CommandAction = "clear" | "ssh" | "teleport" | "exit" | "navigate";

export interface ProcessCommandResult {
  lines: OutputLine[];
  action?: CommandAction;
  target?: string;
}

// The help text shown for the help command
const HELP_TEXT = `
Available commands:

  NAVIGATION
    cd /works               Navigate to Featured Projects & Case Studies
    cd /stacks              Navigate to Technical Arsenal & Stack
    cd /contact             Navigate to Contact & Inquiries
    cd ~                    Return to top of portfolio
    ls                      List available directories & files

  PORTFOLIO INFO
    whoami                  Display current user
    about                   Creative developer bio & philosophy
    skills                  List core technical proficiencies
    projects                Summary of featured case studies
    contact                 Display direct transmission channels

  SYSTEM
    clear                   Clear terminal output
    date                    Show current date and time
    echo <text>             Print text to terminal
    exit                    Close terminal popup (in portfolio)
    teleport                Teleport to the sacred Mani Wheel

  SPECIAL
    rm -rf /                (Tip: do for fun ;))
`.trim();

const LS_OUTPUT = `
drwxr-xr-x   works/
drwxr-xr-x   stacks/
drwxr-xr-x   contact/
drwxr-xr-x   about/
-rw-r--r--   resume.pdf
-rw-r--r--   README.md

Tip: Run \`cd /works\`, \`cd /stacks\`, or \`cd /contact\` to navigate.
`.trim();

export function processCommand(raw: string): ProcessCommandResult {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { lines: [] };
  }

  const lower = trimmed.toLowerCase();
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();

  // Clear
  if (cmd === "clear" || cmd === "cls") {
    return { lines: [], action: "clear" };
  }

  // Help
  if (cmd === "help" || cmd === "?") {
    return {
      lines: HELP_TEXT.split("\n").map((line) => ({
        type: "output" as const,
        content: line,
        className: line.startsWith("  cd") || line.startsWith("  ls")
          ? "text-[var(--ctp-blue)]"
          : line.startsWith("  rm -rf")
          ? "text-[var(--ctp-red)] font-semibold"
          : line.startsWith("  whoami") || line.startsWith("  skills") || line.startsWith("  projects") || line.startsWith("  contact") || line.startsWith("  about")
          ? "text-[var(--ctp-green)]"
          : line.startsWith("  clear") || line.startsWith("  exit") || line.startsWith("  teleport")
          ? "text-[var(--ctp-mauve)]"
          : line.startsWith("  ") && !line.startsWith("    ")
          ? "text-[var(--ctp-yellow)] font-semibold"
          : "text-[var(--ctp-subtext0)]",
      })),
    };
  }

  // whoami
  if (cmd === "whoami") {
    return {
      lines: [
        {
          type: "output",
          content: "tamrakar (Ayush Tamrakar // Creative Developer)",
          className: "text-[var(--ctp-green)]",
        },
      ],
    };
  }

  // date
  if (cmd === "date") {
    return {
      lines: [
        {
          type: "output",
          content: new Date().toString(),
          className: "text-[var(--ctp-yellow)]",
        },
      ],
    };
  }

  // ls / dir
  if (cmd === "ls" || cmd === "dir") {
    return {
      lines: LS_OUTPUT.split("\n").map((line) => ({
        type: "output" as const,
        content: line,
        className: line.startsWith("drwx")
          ? "text-[var(--ctp-blue)] font-semibold"
          : line.startsWith("-rw")
          ? "text-[var(--ctp-text)]"
          : "text-[var(--ctp-subtext0)]",
      })),
    };
  }

  // rm -rf commands: "Haha, nice try I am your Father"-Darth Vader
  if (
    cmd === "rm" ||
    lower.startsWith("rm ") ||
    lower.includes("-rf") ||
    lower.includes("-r") ||
    lower.includes("delete") ||
    lower.includes("destroy")
  ) {
    return {
      lines: [
        {
          type: "output",
          content: "Initiating emergency system purge: rm -rf / ...",
          className: "text-[var(--ctp-red)] font-semibold",
        },
        {
          type: "error",
          content: "FATAL: Access Denied. Dark Side Imperial Override Active.",
        },
        {
          type: "output",
          content: '"Haha, nice try I am your Father" - Darth Vader',
          className: "text-[var(--ctp-red)] font-bold text-sm tracking-wider py-1",
        },
        {
          type: "output",
          content: "System files preserved. You cannot destroy what built you.",
          className: "text-[var(--ctp-overlay1)] italic text-xs",
        },
      ],
    };
  }

  // cd commands: cd "/contact", cd "stacks", cd "works", cd /contact, cd stacks, etc.
  if (cmd === "cd") {
    const rawArg = parts.slice(1).join(" ").trim();
    const cleanArg = rawArg.replace(/["']/g, "").trim();
    const normalized = cleanArg.replace(/^\.?\//, "").toLowerCase();

    if (!cleanArg || normalized === "~" || normalized === "home" || cleanArg === "/" || normalized === "..") {
      return {
        lines: [
          {
            type: "output",
            content: "Changed directory to ~ (Top of Portfolio)",
            className: "text-[var(--ctp-green)]",
          },
          {
            type: "output",
            content: "Navigating to home view...",
            className: "text-[var(--ctp-subtext0)] italic",
          },
        ],
        action: "navigate",
        target: "home",
      };
    }

    if (normalized === "contact" || normalized === "contacts") {
      return {
        lines: [
          {
            type: "output",
            content: `Changed directory to /contact`,
            className: "text-[var(--ctp-green)]",
          },
          {
            type: "output",
            content: "Navigating to Contact & Inquiries section...",
            className: "text-[var(--ctp-subtext0)] italic",
          },
        ],
        action: "navigate",
        target: "contact",
      };
    }

    if (normalized === "stacks" || normalized === "stack" || normalized === "skills" || normalized === "arsenal") {
      return {
        lines: [
          {
            type: "output",
            content: `Changed directory to /stacks`,
            className: "text-[var(--ctp-green)]",
          },
          {
            type: "output",
            content: "Navigating to Technical Arsenal & Stack section...",
            className: "text-[var(--ctp-subtext0)] italic",
          },
        ],
        action: "navigate",
        target: "stacks",
      };
    }

    if (normalized === "works" || normalized === "work" || normalized === "projects" || normalized === "project") {
      return {
        lines: [
          {
            type: "output",
            content: `Changed directory to /works`,
            className: "text-[var(--ctp-green)]",
          },
          {
            type: "output",
            content: "Navigating to Featured Projects & Engineering Grid...",
            className: "text-[var(--ctp-subtext0)] italic",
          },
        ],
        action: "navigate",
        target: "works",
      };
    }

    if (normalized === "about") {
      return {
        lines: [
          {
            type: "output",
            content: `Changed directory to /about`,
            className: "text-[var(--ctp-green)]",
          },
          {
            type: "output",
            content: "Ayush // Creative Developer & High-Performance UI Engineer.",
            className: "text-[var(--ctp-subtext1)]",
          },
        ],
        action: "navigate",
        target: "stacks",
      };
    }

    return {
      lines: [
        {
          type: "error",
          content: `bash: cd: ${rawArg}: No such file or directory`,
        },
        {
          type: "output",
          content: "Available directories: /works, /stacks, /contact, ~",
          className: "text-[var(--ctp-subtext0)] italic",
        },
      ],
    };
  }

  // direct contact command
  if (cmd === "contact" || cmd === "email") {
    return {
      lines: [
        {
          type: "output",
          content: "Direct Transmission Channels:",
          className: "text-[var(--ctp-mauve)] font-semibold",
        },
        {
          type: "output",
          content: "  Email:    tamrakar.ayush.dev@gmail.com",
          className: "text-[var(--ctp-green)]",
        },
        {
          type: "output",
          content: "  GitHub:   github.com",
          className: "text-[var(--ctp-blue)]",
        },
        {
          type: "output",
          content: "  Status:   Open for select commissions & engineering roles",
          className: "text-[var(--ctp-yellow)]",
        },
        {
          type: "output",
          content: "Navigating to Contact section...",
          className: "text-[var(--ctp-subtext0)] italic",
        },
      ],
      action: "navigate",
      target: "contact",
    };
  }

  // direct skills / stacks command
  if (cmd === "skills" || cmd === "stacks" || cmd === "stack") {
    return {
      lines: [
        {
          type: "output",
          content: "Technical Arsenal & Proficiencies:",
          className: "text-[var(--ctp-mauve)] font-semibold",
        },
        {
          type: "output",
          content: "  Visual Dev:  HTML5 Canvas 2D, Framer Motion, WebGL Shaders, Scrollytelling",
          className: "text-[var(--ctp-subtext1)]",
        },
        {
          type: "output",
          content: "  Frontend:    Next.js 14/15/16, React 19, TypeScript, Tailwind CSS v4",
          className: "text-[var(--ctp-subtext1)]",
        },
        {
          type: "output",
          content: "  Systems:     Unix/Linux CLI, WebSockets, Python/Pillow Pipelines, Turbopack",
          className: "text-[var(--ctp-subtext1)]",
        },
        {
          type: "output",
          content: "Navigating to Technical Arsenal section...",
          className: "text-[var(--ctp-subtext0)] italic",
        },
      ],
      action: "navigate",
      target: "stacks",
    };
  }

  // direct projects / works command
  if (cmd === "projects" || cmd === "works" || cmd === "work") {
    return {
      lines: [
        {
          type: "output",
          content: "Featured Case Studies:",
          className: "text-[var(--ctp-mauve)] font-semibold",
        },
        {
          type: "output",
          content: "  1. Solana Ride-Sharing App   (Decentralized P2P Mobility & Rust Contracts)",
          className: "text-[var(--ctp-green)]",
        },
        {
          type: "output",
          content: "  2. AI-Powered Trading Bot    (Deep Learning & Algorithmic Signals)",
          className: "text-[var(--ctp-blue)]",
        },
        {
          type: "output",
          content: "  3. Character Recognition     (CNN & OCR Computer Vision Pipeline)",
          className: "text-[var(--ctp-yellow)]",
        },
        {
          type: "output",
          content: "Navigating to Works section...",
          className: "text-[var(--ctp-subtext0)] italic",
        },
      ],
      action: "navigate",
      target: "works",
    };
  }

  // direct about command
  if (cmd === "about") {
    return {
      lines: [
        {
          type: "output",
          content: "AYUSH TAMRAKAR — Creative Developer & UI Engineer",
          className: "text-[var(--ctp-mauve)] font-semibold",
        },
        {
          type: "output",
          content: "Bridging the gap between fine-tuned engineering and high-end interactive visual design.",
          className: "text-[var(--ctp-subtext1)]",
        },
        {
          type: "output",
          content: "Specializing in 60FPS scroll animations, canvas rendering pipelines, and authentic terminal interfaces.",
          className: "text-[var(--ctp-subtext0)]",
        },
      ],
    };
  }

  // echo
  if (cmd === "echo") {
    const text = parts.slice(1).join(" ");
    return {
      lines: [
        {
          type: "output",
          content: text || "",
          className: "text-[var(--ctp-text)]",
        },
      ],
    };
  }

  // ssh tamrakar@ayush
  if (lower === "ssh tamrakar@ayush" || lower === "portfolio") {
    return {
      lines: [],
      action: "ssh",
    };
  }

  // teleport / mani-wheel / mani
  if (
    lower === "teleport" ||
    lower === "mani" ||
    lower === "mani-wheel" ||
    lower === "maniwheel"
  ) {
    return {
      lines: [
        {
          type: "output",
          content: "Initiating teleportation to sacred Mani Wheel shrine...",
          className: "text-[var(--ctp-mauve)] font-medium",
        },
      ],
      action: "teleport",
    };
  }

  // ssh with wrong args
  if (cmd === "ssh") {
    return {
      lines: [
        {
          type: "error",
          content: `ssh: could not resolve hostname ${parts[1] || ""}: Name or service not known`,
        },
        {
          type: "output",
          content: "Hint: try `ssh tamrakar@ayush`",
          className: "text-[var(--ctp-subtext0)] italic",
        },
      ],
    };
  }

  // sudo
  if (cmd === "sudo") {
    return {
      lines: [
        {
          type: "error",
          content: `tamrakar is not in the sudoers file. This incident will be reported.`,
        },
      ],
    };
  }

  // vim / nvim / nano
  if (["vim", "nvim", "nano", "emacs"].includes(cmd)) {
    return {
      lines: [
        {
          type: "output",
          content: `${cmd}: this is a browser. Maybe try a real terminal?`,
          className: "text-[var(--ctp-yellow)]",
        },
      ],
    };
  }

  // exit / quit / logout / close
  if (["exit", "quit", "logout", "close", "q"].includes(cmd)) {
    return {
      lines: [
        {
          type: "output",
          content: "Closing terminal session. Farewell, traveler.",
          className: "text-[var(--ctp-mauve)] italic",
        },
      ],
      action: "exit",
    };
  }

  // Unknown command
  return {
    lines: [
      {
        type: "error",
        content: `bash: ${parts[0]}: command not found`,
      },
      {
        type: "output",
        content: `Type \`help\` to see available commands or \`cd /works\`, \`cd /stacks\`, \`cd /contact\`.`,
        className: "text-[var(--ctp-subtext0)]",
      },
    ],
  };
}
