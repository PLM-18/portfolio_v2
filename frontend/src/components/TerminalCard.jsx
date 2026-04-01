import { useEffect, useRef, useState, useCallback } from "react";

/**
 * TerminalCard
 *
 * A faithful terminal emulator rendered inside a project card.
 *
 * ── DEMO MODE (terminalConfig.wsUrl = null) ──────────────────────────────
 *   • welcomeLines are typed out one character at a time (typewriter effect).
 *   • A blinking cursor sits at the end.
 *   • No network connection is attempted.
 *
 * ── LIVE MODE (terminalConfig.wsUrl = "wss://…") ─────────────────────────
 *   • welcomeLines are shown instantly before the socket opens.
 *   • Messages from the server are appended as new lines in real time.
 *   • The user can type commands and press Enter (or click ↵) to send.
 *   • Command history is navigable with ↑ / ↓ arrow keys.
 *   • A Reconnect button appears after the socket closes / errors.
 *
 * CMS fields consumed from terminalConfig:
 *   wsUrl        {string|null}   WebSocket endpoint URL (null = demo mode)
 *   welcomeLines {string[]}      Lines to type out (demo) or show on open (live)
 *   prompt       {string}        Shell prompt prefix, e.g. "pop3-client:~$"
 */
export default function TerminalCard({ terminalConfig, title, subtitle }) {
  const { wsUrl, welcomeLines = [], prompt = "$" } = terminalConfig ?? {};

  // ── State ──────────────────────────────────────────────────────────────
  const [lines, setLines] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [wsState, setWsState] = useState("idle"); // idle|connecting|open|closed|error
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [typewriterDone, setTypewriterDone] = useState(false);

  const wsRef     = useRef(null);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const appendLine = useCallback((text, type) => {
    setLines((prev) => [...prev, { text, type: type ?? classifyLine(text) }]);
  }, []);

  useEffect(() => {
    if (wsUrl) {
      setLines(welcomeLines.map((text) => ({ text, type: classifyLine(text) })));
      return;
    }

    let cancelled = false;
    let lineIdx   = 0;
    let charIdx   = 0;

    const tick = () => {
      if (cancelled || lineIdx >= welcomeLines.length) {
        if (!cancelled) setTypewriterDone(true);
        return;
      }
      const currentLine = welcomeLines[lineIdx];

      if (charIdx === 0) {
        setLines((prev) => [...prev, { text: "", type: classifyLine(currentLine) }]);
      }

      if (charIdx < currentLine.length) {
        setLines((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            ...copy[copy.length - 1],
            text: currentLine.slice(0, charIdx + 1),
          };
          return copy;
        });
        charIdx++;
        setTimeout(tick, charDelay(currentLine[charIdx - 1]));
      } else {
        lineIdx++;
        charIdx = 0;
        setTimeout(tick, 300);
      }
    };

    const timer = setTimeout(tick, 500);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  const openWs = useCallback(() => {
    if (!wsUrl) return;
    setWsState("connecting");

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsState("open");
      appendLine(`[ws] connected`, "ws");
      inputRef.current?.focus();
    };

    ws.onmessage = (evt) => {
      evt.data.split("\n").filter(Boolean).forEach((text) => appendLine(text));
    };

    ws.onerror = () => {
      setWsState("error");
      appendLine("[ws] connection error", "ws-error");
    };

    ws.onclose = () => {
      setWsState("closed");
      appendLine("[ws] disconnected", "ws");
    };
  }, [wsUrl, appendLine]);

  useEffect(() => {
    if (wsUrl) openWs();
    return () => wsRef.current?.close();
  }, [wsUrl]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleSend = useCallback(() => {
    const cmd = inputValue.trim();
    if (!cmd) return;

    appendLine(`${prompt} ${cmd}`, "cmd");
    setCmdHistory((h) => [cmd, ...h.slice(0, 49)]);
    setHistoryIndex(-1);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(cmd + "\r\n");
    }
    setInputValue("");
  }, [inputValue, prompt, appendLine]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { handleSend(); return; }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIndex + 1, cmdHistory.length - 1);
      setHistoryIndex(next);
      setInputValue(cmdHistory[next] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(historyIndex - 1, -1);
      setHistoryIndex(next);
      setInputValue(next === -1 ? "" : cmdHistory[next]);
    }
  };

  const STATUS = {
    idle:       { color: "text-on-surface-variant/40", label: "demo mode" },
    connecting: { color: "text-yellow-400 animate-pulse", label: "○ connecting…" },
    open:       { color: "text-tertiary-dim", label: "● live" },
    closed:     { color: "text-error/60", label: "○ closed" },
    error:      { color: "text-error", label: "✕ error" },
  };
  const status = STATUS[wsUrl ? wsState : "idle"];

  const showReconnect = wsUrl && (wsState === "closed" || wsState === "error");
  const showInput     = wsUrl && wsState === "open";

  return (
    <div
      className="terminal-glow bg-surface-container-lowest rounded-sm border border-outline-variant/10 overflow-hidden flex flex-col h-full cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── Title bar ─────────────────────────────────────────────────── */}
      <div className="bg-surface-container-high px-4 py-2 flex items-center justify-between border-b border-white/5 select-none">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-error-dim/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
          <div className="w-3 h-3 rounded-full bg-tertiary-dim/50" />
        </div>

        <div className="flex items-center gap-3">
          {showReconnect && (
            <button
              onClick={(e) => { e.stopPropagation(); openWs(); }}
              className="font-mono text-[9px] text-primary uppercase tracking-widest border border-primary/30 px-2 py-0.5 hover:bg-primary/10 transition-colors"
            >
              reconnect
            </button>
          )}
          <span className={`font-mono text-[10px] uppercase tracking-widest ${status.color}`}>
            {title.toLowerCase().replace(/\s+/g, "_")} — {status.label}
          </span>
        </div>
      </div>

      {/* ── Output area ───────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-2 font-mono text-sm flex-grow overflow-y-auto max-h-52 scrollbar-thin space-y-0.5">
        {lines.map((line, i) => (
          <TerminalLine key={i} line={line} />
        ))}

        {/* Blinking block cursor — visible after typewriter finishes in demo mode */}
        {!wsUrl && typewriterDone && (
          <span className="inline-block w-2 h-4 bg-primary/70 animate-pulse align-middle ml-0.5" />
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Live input row ────────────────────────────────────────────── */}
      {showInput && (
        <div className="border-t border-white/5 flex items-center px-4 py-2 gap-2 bg-black/20">
          <span className="text-primary font-mono text-sm select-none shrink-0">{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type a command…"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent font-mono text-sm text-on-surface outline-none placeholder:text-on-surface-variant/30 caret-primary"
          />
          <button
            onClick={handleSend}
            className="font-mono text-[10px] text-primary uppercase tracking-widest hover:text-primary/60 transition-colors shrink-0 px-1"
          >
            ↵
          </button>
        </div>
      )}

      {/* ── Card footer ───────────────────────────────────────────────── */}
      <div className="p-6 bg-surface-container-low/50 border-t border-white/5">
        <h4 className="font-headline text-xl font-bold text-on-surface">{title}</h4>
        <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function TerminalLine({ line }) {
  const CLASS = {
    cmd:       "text-on-surface",
    ok:        "text-tertiary-dim pl-2",
    err:       "text-error pl-2",
    info:      "text-on-surface-variant/60 text-xs pl-4",
    ws:        "text-on-surface-variant/40 italic text-xs pl-2",
    "ws-error":"text-error/70 italic text-xs pl-2",
    status:    "text-primary font-bold pl-2",
    default:   "text-on-surface-variant/80 pl-2",
  };

  return (
    <div className={CLASS[line.type] ?? CLASS.default}>
      {line.text}
    </div>
  );
}

function classifyLine(text = "") {
  const t = text.trim();
  if (t.startsWith("[ws]"))                                return "ws";
  if (/^\+OK/i.test(t))                                   return "ok";
  if (/^-ERR/i.test(t))                                   return "err";
  if (/STATUS:\s*RUNNING/i.test(t))                       return "status";
  if (/^\[(INFO|AUTH|XFER|LOG|WARN)\]/i.test(t))         return "info";
  if (/error|fail|denied|refused/i.test(t))               return "err";
  if (/accepted|connected|success|\+OK/i.test(t))         return "ok";
  if (/^(\$|>|#|pop3|ftp|ssh)/.test(t))                  return "cmd";
  return "default";
}

function charDelay(char) {
  if (!char)           return 30;
  if (char === " ")    return 18;
  if (/[.,;:!?]/.test(char)) return 100;
  return Math.random() * 25 + 18; // 18–43 ms
}