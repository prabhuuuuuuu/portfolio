"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Terminal } from "lucide-react";
import { Panel } from "./Panel";

type TerminalLine = {
  content: string;
  tone?: "default" | "muted" | "cyan" | "green" | "orange";
};

const initialTerminalLines: TerminalLine[] = [
  { content: "portfolio-shell v2.0.6", tone: "cyan" },
  { content: "Type `help` to inspect available commands.", tone: "muted" },
];

export function TerminalCard() {
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>(initialTerminalLines);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = terminalBodyRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [terminalLines]);

  const scrollToCard = (id: string) => {
    const node = document.getElementById(id);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const executeCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;

    if (command === "clear") {
      setTerminalLines(initialTerminalLines);
      return;
    }

    const nextLines: TerminalLine[] = [{ content: `visitor@portfolio:~$ ${rawCommand}` }];

    if (command === "help") {
      nextLines.push(
        {
          content:
            "Available commands: help, projects, newsroom, stack, experience, contact, resume, top, clear",
          tone: "muted",
        },
        {
          content: "Navigation commands will jump to the matching dashboard card.",
          tone: "cyan",
        }
      );
    } else if (command === "projects") {
      scrollToCard("projects");
      nextLines.push({
        content:
          "Jumping to systems grid: Newsroom, Fatigue Detection, Waste Sorting, BeatNet, VoyageAI.",
        tone: "green",
      });
    } else if (command === "newsroom") {
      scrollToCard("newsroom");
      nextLines.push({
        content: "Pinned Local-Agentic Newsroom as active featured system.",
        tone: "green",
      });
    } else if (command === "stack") {
      scrollToCard("stack");
      nextLines.push({
        content:
          "Opening dependency graph: Python, LangGraph, Multi-Agent, FastAPI, Ollama, Edge Deploy.",
        tone: "cyan",
      });
    } else if (command === "experience") {
      scrollToCard("experience");
      nextLines.push({
        content: "Loading work history and publication telemetry.",
        tone: "cyan",
      });
    } else if (command === "contact") {
      scrollToCard("contact");
      nextLines.push({
        content: "Opening contact endpoints: email, LinkedIn, GitHub.",
        tone: "green",
      });
    } else if (command === "resume") {
      window.open("/pranav-prashant-shewale-resume.pdf", "_blank", "noopener,noreferrer");
      nextLines.push({
        content: "Launching latest resume PDF in a new tab.",
        tone: "orange",
      });
    } else if (command === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      nextLines.push({
        content: "Returned to dashboard origin.",
        tone: "muted",
      });
    } else {
      nextLines.push(
        {
          content: `Command not found: ${rawCommand}`,
          tone: "orange",
        },
        {
          content: "Run `help` to inspect the supported recruiter-friendly actions.",
          tone: "muted",
        }
      );
    }

    setTerminalLines((current) => [...current, ...nextLines]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextCommand = terminalInput.trim();
    if (!nextCommand) return;

    executeCommand(nextCommand);
    setTerminalInput("");
  };

  return (
    <Panel id="terminal" className="lg:col-span-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="panel-kicker">RECRUITER TERMINAL</p>
          <h2 className="mt-3 font-mono text-2xl font-semibold text-white">
            Command-driven navigation
          </h2>
        </div>
        <Terminal className="h-5 w-5 text-[var(--accent-cyan)]" />
      </div>

      <div
        ref={terminalBodyRef}
        className="mt-6 h-[260px] overflow-y-auto rounded-2xl border border-slate-900 bg-[#05070a] p-4"
      >
        <div className="space-y-3 font-mono text-sm">
          {terminalLines.map((line, index) => (
            <div
              key={`${line.content}-${index}`}
              className={`terminal-line terminal-line--${line.tone ?? "default"}`}
            >
              {line.content}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <label htmlFor="command" className="sr-only">
          Terminal command
        </label>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#05070a] px-4 py-3">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--accent-green)]">
            $
          </span>
          <input
            id="command"
            value={terminalInput}
            onChange={(event) => setTerminalInput(event.target.value)}
            className="w-full bg-transparent font-mono text-sm text-slate-100 outline-none placeholder:text-slate-600"
            placeholder="help / contact / projects / resume"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["help", "projects", "newsroom", "stack", "contact"].map((command) => (
            <button
              key={command}
              type="button"
              className="nav-chip"
              onClick={() => executeCommand(command)}
            >
              {command}
            </button>
          ))}
        </div>
      </form>
    </Panel>
  );
}
