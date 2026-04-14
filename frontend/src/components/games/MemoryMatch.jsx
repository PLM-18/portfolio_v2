import { useState, useEffect, useCallback } from "react";

const TECH_ICONS = [
  { icon: "code", label: "Code" },
  { icon: "terminal", label: "Terminal" },
  { icon: "storage", label: "Database" },
  { icon: "cloud", label: "Cloud" },
  { icon: "bug_report", label: "Debug" },
  { icon: "memory", label: "Memory" },
  { icon: "dns", label: "Server" },
  { icon: "security", label: "Security" },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryMatch({ onBack }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [locked, setLocked] = useState(false);

  const initGame = useCallback(() => {
    const pairs = shuffleArray(TECH_ICONS).slice(0, 8);
    const deck = shuffleArray(
      pairs.flatMap((item, idx) => [
        { id: idx * 2, icon: item.icon, label: item.label, matched: false },
        { id: idx * 2 + 1, icon: item.icon, label: item.label, matched: false },
      ])
    );
    setCards(deck);
    setFlipped([]);
    setMoves(0);
    setElapsed(0);
    setPhase("playing");
    setStartTime(Date.now());
    setLocked(false);
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, startTime]);

  const handleFlip = (id) => {
    if (locked) return;
    if (flipped.includes(id)) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.matched) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [a, b] = newFlipped;
      const cardA = cards.find((c) => c.id === a);
      const cardB = cards.find((c) => c.id === b);

      if (cardA.icon === cardB.icon) {
        setTimeout(() => {
          const alreadyMatched = cards.filter((c) => c.matched).length;
          if (alreadyMatched + 2 === cards.length) {
            setPhase("done");
          }
          setCards((prev) =>
            prev.map((c) =>
              c.id === a || c.id === b ? { ...c, matched: true } : c
            )
          );
          setFlipped([]);
          setLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 800);
      }
    }
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span className="font-mono text-xs uppercase tracking-wider">Back</span>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-primary text-3xl">grid_view</span>
        <h3 className="font-headline text-2xl font-bold uppercase tracking-wider">
          Memory_Match
        </h3>
      </div>

      <p className="text-on-surface-variant text-sm mb-8">
        Match pairs of dev tool icons. Find all pairs in the fewest moves possible.
      </p>

      {phase === "idle" && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-primary/30 mb-4 block">
            grid_view
          </span>
          <button
            onClick={initGame}
            className="bg-primary text-surface-container-lowest font-headline text-sm uppercase tracking-wider px-8 py-3 rounded-sm font-bold hover:bg-primary-dark transition-colors cursor-pointer"
          >
            Start Game
          </button>
        </div>
      )}

      {(phase === "playing" || phase === "done") && (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-6">
              <div className="text-center">
                <p className="font-mono text-xl font-bold text-primary">{formatTime(elapsed)}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                  Time
                </p>
              </div>
              <div className="text-center">
                <p className="font-mono text-xl font-bold text-on-surface">{moves}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                  Moves
                </p>
              </div>
              <div className="text-center">
                <p className="font-mono text-xl font-bold text-on-surface">
                  {cards.filter((c) => c.matched).length / 2}/8
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                  Pairs
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id) || card.matched;
              return (
                <button
                  key={card.id}
                  onClick={() => handleFlip(card.id)}
                  disabled={card.matched}
                  className={[
                    "aspect-square rounded-sm flex flex-col items-center justify-center transition-all duration-300 cursor-pointer touch-manipulation",
                    card.matched
                      ? "bg-primary/20 border-2 border-primary/40 scale-95"
                      : isFlipped
                      ? "bg-surface-container-high border-2 border-primary"
                      : "bg-surface-container-low border border-outline hover:border-primary/30 active:scale-95",
                  ].join(" ")}
                >
                  {isFlipped ? (
                    <>
                      <span className="material-symbols-outlined text-2xl md:text-3xl text-primary">
                        {card.icon}
                      </span>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-on-surface-variant mt-1">
                        {card.label}
                      </span>
                    </>
                  ) : (
                    <span className="material-symbols-outlined text-2xl text-on-surface-variant/30">
                      help
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {phase === "done" && (
            <div className="text-center mt-8">
              <p className="font-headline text-xl font-bold text-primary mb-2">
                All Pairs Found!
              </p>
              <p className="text-on-surface-variant mb-6">
                Completed in {moves} moves and {formatTime(elapsed)}.
                {moves <= 12
                  ? " Outstanding memory!"
                  : moves <= 18
                  ? " Well played!"
                  : " Keep practicing!"}
              </p>
              <button
                onClick={initGame}
                className="bg-primary text-surface-container-lowest font-headline text-sm uppercase tracking-wider px-8 py-3 rounded-sm font-bold hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Play Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
