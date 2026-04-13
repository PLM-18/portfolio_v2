import { useState, useEffect, useRef, useCallback } from "react";

/**
 * TerminalCard
 *
 * displayType "terminal-static"      — decorative only, shows terminalLines
 * displayType "terminal-interactive" — shows static preview, then on "Launch Terminal"
 *                                      opens a real WebSocket session against wsEndpoint
 */
export default function TerminalCard({ project }) {
  const {
    title,
    subtitle,
    description,
    repo,
    tags,
    displayType,
    terminalLabel,
    terminalLines = [],
    wsEndpoint,
  } = project;

  const isInteractive = displayType === "terminal-interactive";

  return (
    <div className="terminal-glow bg-surface-container-lowest rounded-sm border border-outline-variant/10 overflow-hidden flex flex-col h-full">
      <TitleBar label={terminalLabel ?? `${title.toLowerCase().replace(/\s+/g, "_")}.sh`} />

      {isInteractive ? (
        <InteractiveTerminal
          terminalLines={terminalLines}
          wsEndpoint={wsEndpoint}
        />
      ) : (
        <StaticTerminal terminalLines={terminalLines} />
      )}

      <TerminalFooter
        title={title}
        subtitle={subtitle}
        description={description}
        repo={repo}
        tags={tags}
      />
    </div>
  );
}

/* ─── Sub-components ────────────────────────────────────────────────────── */

function TitleBar({ label }) {
  return (
    <div className="bg-surface-container-high px-4 py-2 flex items-center justify-between border-b border-white/5 shrink-0">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-error-dim/40" />
        <div className="w-3 h-3 rounded-full bg-secondary-container/40" />
        <div className="w-3 h-3 rounded-full bg-tertiary-dim/40" />
      </div>
      <span className="font-mono text-[10px] text-on-surface-variant/50 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

function StaticTerminal({ terminalLines }) {
  return (
    <div className="p-6 font-mono text-sm space-y-2 flex-grow">
      {terminalLines.map((line, i) => (
        <TerminalLine key={i} line={line} />
      ))}
      <div className="flex gap-3 pt-4">
        <span className="text-primary-dim animate-pulse">_</span>
      </div>
    </div>
  );
}

/** States: idle → connecting → connected → disconnected */
function InteractiveTerminal({ terminalLines, wsEndpoint }) {
  const [state, setState] = useState("idle"); // idle | connecting | connected | disconnected
  const [output, setOutput] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const wsRef = useRef(null);
  const outputEndRef = useRef(null);
  const inputRef = useRef(null);

  const appendOutput = useCallback((text, type = "output") => {
    setOutput((prev) => [...prev, { text, type }]);
  }, []);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  function connect() {
    if (!wsEndpoint) {
      appendOutput("Error: no WebSocket endpoint configured for this project.", "error");
      return;
    }

    setState("connecting");
    appendOutput("Connecting...", "info");

    const ws = new WebSocket(wsEndpoint);
    wsRef.current = ws;

    ws.onopen = () => {
      setState("connected");
      appendOutput("Connected. Type commands below.", "info");
      inputRef.current?.focus();
    };

    ws.onmessage = (e) => {
      appendOutput(e.data, "output");
    };

    ws.onerror = () => {
      appendOutput("Connection error.", "error");
    };

    ws.onclose = () => {
      setState("disconnected");
      appendOutput("Connection closed.", "info");
      wsRef.current = null;
    };
  }

  function disconnect() {
    wsRef.current?.close();
  }

  function sendCommand(e) {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const cmd = inputValue.trim();
    appendOutput(`$ ${cmd}`, "command");
    wsRef.current?.send(cmd);
    setInputValue("");
  }

  // Cleanup on unmount
  useEffect(() => () => wsRef.current?.close(), []);

  if (state === "idle") {
    return (
      <div className="p-6 flex-grow flex flex-col gap-4">
        {/* Preview of static lines */}
        <div className="font-mono text-sm space-y-2 opacity-50 pointer-events-none select-none">
          {terminalLines.slice(0, 5).map((line, i) => (
            <TerminalLine key={i} line={line} />
          ))}
        </div>
        <div className="flex-grow" />
        <button
          onClick={connect}
          className="w-full flex items-center justify-center gap-2 border border-primary/30 text-primary font-mono text-xs uppercase tracking-widest py-3 rounded-sm hover:bg-primary/5 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-sm">play_circle</span>
          Launch Terminal
        </button>
        {!wsEndpoint && (
          <p className="font-mono text-[10px] text-on-surface-variant/30 text-center">
            VM not yet provisioned — interactive mode coming soon
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      {/* Output scroll area */}
      <div className="flex-grow overflow-y-auto scrollbar-thin p-4 font-mono text-sm space-y-1 min-h-0">
        {output.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "command"
                ? "text-on-surface"
                : line.type === "error"
                ? "text-error"
                : line.type === "info"
                ? "text-on-surface-variant/60"
                : "text-tertiary-dim"
            }
          >
            {line.text}
          </div>
        ))}
        <div ref={outputEndRef} />
      </div>

      {/* Input row */}
      <form
        onSubmit={sendCommand}
        className="border-t border-white/5 flex items-center gap-2 px-4 py-2 bg-surface-container-high"
      >
        <span className="text-primary font-mono text-sm shrink-0">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={state !== "connected"}
          placeholder={state === "connecting" ? "connecting…" : "type a command"}
          className="flex-grow bg-transparent font-mono text-sm text-on-surface placeholder:text-on-surface-variant/30 outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        {state === "connected" && (
          <button
            type="button"
            onClick={disconnect}
            className="text-on-surface-variant/40 hover:text-error transition-colors"
            title="Disconnect"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </form>
    </div>
  );
}

function TerminalFooter({ title, subtitle, description, repo, tags }) {
  return (
    <div className="p-6 bg-surface-container-low/50 space-y-3 shrink-0">
      <div>
        <h4 className="font-headline text-xl font-bold text-on-surface">{title}</h4>
        <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
          {subtitle}
        </p>
      </div>
      {description && (
        <p className="text-on-surface-variant text-xs leading-relaxed">{description}</p>
      )}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2 py-1 bg-surface-container rounded-sm text-on-surface-variant"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {repo && (
        <a
          href={repo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-primary hover:gap-4 transition-all"
        >
          View Repo <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      )}
    </div>
  );
}

/** Renders a single line from terminalLines array */
function TerminalLine({ line }) {
  switch (line.type) {
    case "command":
      return (
        <div className="flex gap-3">
          <span className="text-primary">$</span>
          <span className="text-on-surface">{line.text}</span>
        </div>
      );
    case "status":
      return (
        <div className="bg-primary/10 border-l-2 border-primary p-2 my-2">
          <div className="text-primary font-bold">{line.text}</div>
          {line.detail && (
            <div className="text-on-surface-variant text-[10px]">{line.detail}</div>
          )}
        </div>
      );
    case "comment":
      return <div className="text-on-surface-variant/40 italic">{line.text}</div>;
    case "info":
      return <div className="text-on-surface-variant/60 ml-6 text-xs">{line.text}</div>;
    default:
      return <div className="text-tertiary-dim ml-6">{line.text}</div>;
  }
}
