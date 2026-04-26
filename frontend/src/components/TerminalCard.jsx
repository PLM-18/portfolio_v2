import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
  const label = terminalLabel ?? `${title.toLowerCase().replace(/\s+/g, "_")}.sh`;

  return (
    <div className="terminal-glow bg-surface-container-lowest rounded-sm border border-outline-variant/10 overflow-hidden flex flex-col h-full">
      <TitleBar label={label} />

      {isInteractive ? (
        <InteractiveTerminal
          terminalLines={terminalLines}
          wsEndpoint={wsEndpoint}
          label={label}
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

function TitleBar({ label, onClose }) {
  return (
    <div className="bg-surface-container-high px-4 py-2 flex items-center justify-between border-b border-white/5 shrink-0">
      <div className="flex gap-2">
        {onClose ? (
          <button
            onClick={onClose}
            aria-label="Close terminal"
            className="w-3 h-3 rounded-full bg-error/60 hover:bg-error transition-colors"
          />
        ) : (
          <div className="w-3 h-3 rounded-full bg-error-dim/40" />
        )}
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

function InteractiveTerminal({ terminalLines, wsEndpoint, label }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IdlePreview
        terminalLines={terminalLines}
        wsEndpoint={wsEndpoint}
        onLaunch={() => setIsOpen(true)}
      />

      {isOpen &&
        createPortal(
          <TerminalModal
            label={label}
            wsEndpoint={wsEndpoint}
            onClose={() => setIsOpen(false)}
          />,
          document.body,
        )}
    </>
  );
}

function IdlePreview({ terminalLines, wsEndpoint, onLaunch }) {
  return (
    <div className="p-6 flex-grow flex flex-col gap-4">
      <div className="font-mono text-sm space-y-2 opacity-50 pointer-events-none select-none">
        {terminalLines.slice(0, 5).map((line, i) => (
          <TerminalLine key={i} line={line} />
        ))}
      </div>
      <div className="flex-grow" />
      <button
        onClick={onLaunch}
        className="w-full flex items-center justify-center gap-2 border border-primary/30 text-primary font-mono text-xs uppercase tracking-widest py-3 rounded-sm hover:bg-primary/5 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-sm">play_circle</span>
        Launch Terminal
      </button>
      {!wsEndpoint && (
        <p className="font-mono text-[10px] text-on-surface-variant/30 text-center">
          Demo mode — simulated POP3 session
        </p>
      )}
    </div>
  );
}

function TerminalModal({ label, wsEndpoint, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="terminal-glow w-full max-w-2xl flex flex-col bg-surface-container-lowest rounded-sm border border-outline-variant/20 shadow-2xl"
        style={{ height: "min(600px, 80vh)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <TitleBar label={label} onClose={onClose} />

        {wsEndpoint ? (
          <LiveWSTerminal wsEndpoint={wsEndpoint} />
        ) : (
          <MockPOP3Terminal />
        )}
      </div>
    </div>
  );
}

function LiveWSTerminal({ wsEndpoint }) {
  const [state, setState] = useState("connecting");
  const [output, setOutput] = useState([{ text: "Connecting...", type: "info" }]);
  const [inputValue, setInputValue] = useState("");
  const wsRef = useRef(null);
  const outputEndRef = useRef(null);
  const inputRef = useRef(null);

  const appendOutput = (text, type = "output") =>
    setOutput((prev) => [...prev, { text, type }]);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  useEffect(() => {
    const ws = new WebSocket(wsEndpoint);
    wsRef.current = ws;

    ws.onopen = () => {
      setState("connected");
      appendOutput("Connected. Type commands below.", "info");
      inputRef.current?.focus();
    };
    ws.onmessage = (e) => appendOutput(e.data, "output");
    ws.onerror = () => appendOutput("Connection error.", "error");
    ws.onclose = () => {
      setState("disconnected");
      appendOutput("Connection closed.", "info");
      wsRef.current = null;
    };

    return () => ws.close();
  }, [wsEndpoint]);

  function sendCommand(e) {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const cmd = inputValue.trim();
    appendOutput(`$ ${cmd}`, "command");
    wsRef.current?.send(cmd);
    setInputValue("");
  }

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
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
      <form
        onSubmit={sendCommand}
        className="border-t border-white/5 flex items-center gap-2 px-4 py-2 bg-surface-container-high shrink-0"
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
            onClick={() => wsRef.current?.close()}
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

const MOCK_EMAILS = [
  {
    id: 1,
    size: 1843,
    from: "prof.smith@university.edu",
    subject: "Assignment Deadline Reminder",
    date: "Mon, 14 Apr 2026 09:00:00 +0200",
    body: "Just a quick reminder that your final systems assignment is due\nthis Friday at 23:59. Ensure you have tested your socket\nimplementation against the reference server before submitting.\n\nGood luck,\nProf. Smith",
  },
  {
    id: 2,
    size: 1024,
    from: "noreply@github.com",
    subject: "Your pull request #42 was merged",
    date: "Mon, 14 Apr 2026 08:30:00 +0200",
    body: 'Hi PLM-18,\n\nYour pull request "Fix POP3 RETR edge case" was merged into\nmain by reviewer octocat.\n\nView: https://github.com/PLM-18/POP3Client/pull/42\n\n-- GitHub',
  },
  {
    id: 3,
    size: 612,
    from: "noreply@stackoverflow.com",
    subject: "2 new answers on Stack Overflow",
    date: "Sun, 13 Apr 2026 20:15:00 +0200",
    body: 'Your question "Buffered reader blocking on POP3\nmulti-line response" has 2 new answers.\n\n-- Stack Overflow Notifications',
  },
];

const L = (text, cls = "out") => ({ text, cls });

const CLS_MAP = {
  c:   "text-cyan-400",
  g:   "text-emerald-400",
  gl:  "text-emerald-300/60",
  y:   "text-yellow-400",
  p:   "text-yellow-300",
  s:   "text-on-surface-variant/70",
  i:   "text-on-surface-variant/50",
  b:   "text-blue-400",
  m:   "text-purple-400",
  out: "text-on-surface",
  e:   "text-on-surface/40",
  err: "text-error",
};

function buildEmailList(emails) {
  const lines = [
    L("+==================================+", "c"),
    L("|           Email List              |", "c"),
    L("|___________________________________|", "c"),
  ];
  if (emails.length === 0) {
    lines.push(L("No emails found.", "y"));
  } else {
    emails.forEach((email, i) => {
      lines.push(L(`[${i + 1}] Message #${email.id} — ${email.size} bytes`, "g"));
      lines.push(L(`    Subject: ${email.subject}`, "g"));
      lines.push(L(`    From:    ${email.from}`, "gl"));
    });
  }
  lines.push(L(""));
  return lines;
}

function buildEmailContent(email) {
  return [
    L("+==================================+", "c"),
    L("|         Email Content             |", "c"),
    L("|___________________________________|", "c"),
    L(`From:    ${email.from}`, "b"),
    L(`Subject: ${email.subject}`, "b"),
    L(`Date:    ${email.date}`, "b"),
    L("---------- CONTENT ----------", "m"),
    ...email.body.split("\n").map((t) => L(t || " ", "out")),
    L(""),
  ];
}

function buildMenu() {
  return [
    L("+==================================+", "c"),
    L("|      POP3 Email Client Menu       |", "c"),
    L("|===================================|", "c"),
    L("|  1. List all emails               |", "g"),
    L("|  2. View email details            |", "g"),
    L("|  3. Delete emails                 |", "g"),
    L("|  4. Quit                          |", "g"),
    L("|___________________________________|", "c"),
    L("Enter your choice:", "p"),
  ];
}

function MockPOP3Terminal() {
  const [phase, setPhase] = useState("username");
  const [output, setOutput] = useState(() => [
    L("+==================================+", "c"),
    L("|      POP3 Email Client Login      |", "c"),
    L("|___________________________________|", "c"),
    L("Connecting to mail.demo:110...", "i"),
    L("+OK POP3 server ready <demo.mail.server>", "s"),
    L("Enter username:", "p"),
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isPassword, setIsPassword] = useState(false);
  const [emails, setEmails] = useState(MOCK_EMAILS.map((e) => ({ ...e })));
  const [pendingDels, setPendingDels] = useState([]);

  const outputEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [phase]);

  function push(lines) {
    setOutput((prev) => [...prev, ...lines]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const cmd = inputVal;
    setInputVal("");

    let addLines = [];
    let nextPhase = phase;
    let nextEmails = emails;
    let nextPending = pendingDels;
    let nextPassword = isPassword;

    switch (phase) {
      case "username": {
        addLines.push(L(`Enter username: ${cmd}`, "e"));
        if (!cmd.trim()) {
          addLines.push(L("Error: Username required.", "err"));
          addLines.push(L("Enter username:", "p"));
        } else {
          addLines.push(L("Enter password:", "p"));
          nextPassword = true;
          nextPhase = "password";
        }
        break;
      }

      case "password": {
        const mask = "•".repeat(Math.max(4, cmd.length || 4));
        addLines.push(L(`Enter password: ${mask}`, "e"));
        nextPassword = false;
        if (!cmd.trim()) {
          addLines.push(L("Error: Password required.", "err"));
          addLines.push(L("Enter password:", "p"));
          nextPassword = true;
        } else {
          addLines.push(
            L(`+OK Mailbox locked and ready (${emails.length} messages)`, "s"),
            L(""),
            ...buildMenu(),
          );
          nextPhase = "menu";
        }
        break;
      }

      case "menu": {
        addLines.push(L(`Enter your choice: ${cmd}`, "e"));
        const choice = cmd.trim();
        if (choice === "1") {
          addLines.push(...buildEmailList(emails));
          addLines.push(L("Press Enter to continue...", "p"));
          nextPhase = "list_wait";
        } else if (choice === "2") {
          if (emails.length === 0) {
            addLines.push(L("No emails to view.", "y"), L(""), ...buildMenu());
          } else {
            addLines.push(...buildEmailList(emails));
            addLines.push(L("Enter message number to view (or 0 to cancel):", "p"));
            nextPhase = "view_select";
          }
        } else if (choice === "3") {
          if (emails.length === 0) {
            addLines.push(L("No emails to delete.", "y"), L(""), ...buildMenu());
          } else {
            addLines.push(...buildEmailList(emails));
            addLines.push(L("Enter numbers to delete (comma-separated, 'all', or 0 to cancel):", "p"));
            nextPhase = "del_select";
          }
        } else if (choice === "4") {
          addLines.push(
            L("+OK Goodbye.", "s"),
            L(""),
            L("Thank you for using POP3 Email Client. Goodbye!", "g"),
          );
          nextPhase = "done";
        } else {
          addLines.push(L("Invalid option. Please try again.", "y"), L(""), ...buildMenu());
        }
        break;
      }

      case "list_wait": {
        addLines.push(L(""), ...buildMenu());
        nextPhase = "menu";
        break;
      }

      case "view_select": {
        addLines.push(L(`Enter message number: ${cmd}`, "e"));
        const num = parseInt(cmd.trim(), 10);
        if (cmd.trim() === "0") {
          addLines.push(L(""), ...buildMenu());
          nextPhase = "menu";
        } else if (isNaN(num) || num < 1 || num > emails.length) {
          addLines.push(
            L("Invalid message number.", "y"),
            L("Enter message number to view (or 0 to cancel):", "p"),
          );
        } else {
          const email = emails[num - 1];
          addLines.push(
            ...buildEmailContent(email),
            L("Press Enter to continue...", "p"),
          );
          nextPhase = "view_wait";
        }
        break;
      }

      case "view_wait": {
        addLines.push(L(""), ...buildMenu());
        nextPhase = "menu";
        break;
      }

      case "del_select": {
        addLines.push(L(`Selection: ${cmd}`, "e"));
        const raw = cmd.trim();
        if (raw === "0") {
          addLines.push(L(""), ...buildMenu());
          nextPhase = "menu";
          break;
        }
        let toDelete = [];
        if (raw.toLowerCase() === "all") {
          toDelete = emails.map((em) => em.id);
        } else {
          raw.split(",").forEach((part) => {
            const idx = parseInt(part.trim(), 10);
            if (!isNaN(idx) && idx >= 1 && idx <= emails.length) {
              toDelete.push(emails[idx - 1].id);
            }
          });
        }
        if (toDelete.length === 0) {
          addLines.push(
            L("No valid emails selected.", "y"),
            L("Enter numbers to delete (comma-separated, 'all', or 0 to cancel):", "p"),
          );
        } else {
          nextPending = toDelete;
          addLines.push(L(`Are you sure you want to delete ${toDelete.length} email(s)? (y/n):`, "p"));
          nextPhase = "del_confirm";
        }
        break;
      }

      case "del_confirm": {
        addLines.push(L(`Confirm: ${cmd}`, "e"));
        const answer = cmd.trim().toLowerCase();
        if (answer === "y" || answer === "yes") {
          const newEmails = emails.filter((em) => !pendingDels.includes(em.id));
          pendingDels.forEach((id) => {
            addLines.push(L(`+OK Message ${id} deleted.`, "s"));
          });
          nextEmails = newEmails;
          nextPending = [];
          addLines.push(L(""), ...buildMenu());
          nextPhase = "menu";
        } else {
          addLines.push(L("Deletion cancelled.", "y"), L(""), ...buildMenu());
          nextPending = [];
          nextPhase = "menu";
        }
        break;
      }

      default:
        break;
    }

    push(addLines);
    setPhase(nextPhase);
    setEmails(nextEmails);
    setPendingDels(nextPending);
    setIsPassword(nextPassword);
  }

  const isDone = phase === "done";

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <div className="flex-grow overflow-y-auto p-4 font-mono text-xs space-y-0.5 min-h-0">
        {output.map((line, i) => (
          <div key={i} className={CLS_MAP[line.cls] ?? "text-on-surface"}>
            {line.text || "\u00A0"}
          </div>
        ))}
        <div ref={outputEndRef} />
      </div>

      {!isDone && (
        <form
          onSubmit={handleSubmit}
          className="border-t border-white/5 flex items-center gap-2 px-4 py-2 bg-surface-container-high shrink-0"
        >
          <span className="text-yellow-300 font-mono text-sm shrink-0">›</span>
          <input
            ref={inputRef}
            type={isPassword ? "password" : "text"}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-grow bg-transparent font-mono text-sm text-on-surface placeholder:text-on-surface-variant/30 outline-none"
            placeholder={isPassword ? "password" : ""}
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      )}
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
