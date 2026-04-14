import { useState, useEffect, useRef, useCallback } from "react";
import { CodeSnippets } from "../../data/gamesData";

export default function TypingSpeedTest({ onBack }) {
    const [phase, setPhase] = useState("idle");
    const [snippet, setSnippet] = useState("");
    const [typed, setTyped] = useState("");
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [timeLeft, setTimeLeft] = useState(30);
    const [completedCount, setCompletedCount] = useState(0);

    const inputRef = useRef(null);
    const timerRef = useRef(null);

    const startTimeRef = useRef(0);
    const totalCharsRef = useRef(0);
    const correctCharsRef = useRef(0);

    const snippetRef = useRef("");
    const typedRef = useRef("");
    const timeLeftRef = useRef(30);

    const getRandomSnippet = useCallback(
        () => CodeSnippets[Math.floor(Math.random() * CodeSnippets.length)],
        []
    );

    const startGame = useCallback(() => {
        clearInterval(timerRef.current);
        const s = getRandomSnippet();
        totalCharsRef.current = 0;
        correctCharsRef.current = 0;
        snippetRef.current = s;
        typedRef.current = "";
        startTimeRef.current = Date.now();
        setSnippet(s);
        setTyped("");
        timeLeftRef.current = 30;
        setTimeLeft(30);
        setCompletedCount(0);
        setWpm(0);
        setAccuracy(100);
        setPhase("playing");
        setTimeout(() => inputRef.current?.focus(), 50);
    }, [getRandomSnippet]);

    useEffect(() => {
        if (phase !== "playing") return;
        timerRef.current = setInterval(() => {
            timeLeftRef.current -= 1;
            setTimeLeft(timeLeftRef.current);
            if (timeLeftRef.current <= 0) {
                clearInterval(timerRef.current);
                const currentTyped = typedRef.current;
                const currentSnippet = snippetRef.current;
                let partialCorrect = 0;
                for (let i = 0; i < currentTyped.length; i++) {
                    if (currentTyped[i] === currentSnippet[i]) partialCorrect++;
                }
                const total = totalCharsRef.current + currentTyped.length;
                const correct = correctCharsRef.current + partialCorrect;
                setWpm(total > 0 ? Math.round((total / 5 / 30) * 60) : 0);
                setAccuracy(total > 0 ? Math.round((correct / total) * 100) : 0);
                setPhase("done");
            }
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [phase]);

    const handleInput = (e) => {
        if (phase !== "playing") return;
        const val = e.target.value;
        typedRef.current = val;
        setTyped(val);

        if (val.length === snippet.length) {
            let correct = 0;
            for (let i = 0; i < val.length; i++) {
                if (val[i] === snippet[i]) correct++;
            }
            totalCharsRef.current += val.length;
            correctCharsRef.current += correct;

            // Live stats update on each completed snippet
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            setWpm(Math.round((totalCharsRef.current / 5 / elapsed) * 60));
            setAccuracy(Math.round((correctCharsRef.current / totalCharsRef.current) * 100));
            setCompletedCount((c) => c + 1);

            const next = getRandomSnippet();
            snippetRef.current = next;
            typedRef.current = "";
            setSnippet(next);
            setTyped("");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 cursor-pointer"
            >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span className="font-mono text-xs uppercase tracking-wider">Back to Games</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">keyboard</span>
                <h3 className="font-headline text-2xl font-bold uppercase tracking-wider">
                    Speed_Type
                </h3>
            </div>

            <p className="text-on-surface-variant text-sm mb-8">
                Type the code snippets as fast and accurately as you can. You have 30 seconds.
            </p>

            {phase === "idle" && (
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-primary/30 mb-4 block">
                        keyboard
                    </span>
                    <button
                        onClick={startGame}
                        className="bg-primary text-surface-container-lowest font-headline text-sm uppercase tracking-wider px-8 py-3 rounded-sm font-bold hover:bg-primary-dark transition-colors cursor-pointer"
                    >
                        Start Typing
                    </button>
                </div>
            )}

            {phase === "playing" && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-6">
                            <div className="text-center">
                                <p className="font-mono text-2xl font-bold text-primary">{timeLeft}</p>
                                <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                                    Seconds
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="font-mono text-2xl font-bold text-on-surface">{wpm}</p>
                                <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                                    WPM
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="font-mono text-2xl font-bold text-on-surface">{completedCount}</p>
                                <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                                    Done
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-container-low border border-outline rounded-sm p-6 mb-4 font-mono text-lg leading-relaxed select-none">
                        {snippet.split("").map((char, i) => {
                            let color = "text-on-surface-variant/50";
                            if (i < typed.length) {
                                color =
                                    typed[i] === char
                                        ? "text-green-400"
                                        : "text-red-400 bg-red-400/10";
                            } else if (i === typed.length) {
                                color = "text-on-surface bg-primary/20";
                            }
                            return (
                                <span key={i} className={color}>
                                    {char === " " && i === typed.length ? "\u00B7" : char}
                                </span>
                            );
                        })}
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={typed}
                        onChange={handleInput}
                        className="w-full bg-surface-container border border-outline rounded-sm px-4 py-3 font-mono text-on-surface focus:outline-none focus:border-primary transition-colors"
                        placeholder="Start typing..."
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                    />
                </div>
            )}

            {phase === "done" && (
                <div className="text-center py-8">
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-surface-container-low border border-outline rounded-sm p-6">
                            <p className="font-mono text-4xl font-bold text-primary">{wpm}</p>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mt-2">
                                Words/Min
                            </p>
                        </div>
                        <div className="bg-surface-container-low border border-outline rounded-sm p-6">
                            <p className="font-mono text-4xl font-bold text-on-surface">{accuracy}%</p>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mt-2">
                                Accuracy
                            </p>
                        </div>
                        <div className="bg-surface-container-low border border-outline rounded-sm p-6">
                            <p className="font-mono text-4xl font-bold text-on-surface">{completedCount}</p>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant mt-2">
                                Snippets
                            </p>
                        </div>
                    </div>

                    <p className="text-on-surface-variant mb-6">
                        {wpm >= 60
                            ? "Impressive speed! You type like a pro."
                            : wpm >= 40
                                ? "Solid typing speed! Keep practicing."
                                : "Good effort! Practice makes perfect."}
                    </p>

                    <button
                        onClick={startGame}
                        className="bg-primary text-surface-container-lowest font-headline text-sm uppercase tracking-wider px-8 py-3 rounded-sm font-bold hover:bg-primary-dark transition-colors cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
