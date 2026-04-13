import { useState, useCallback } from "react";
import { questions as ALL_QUESTIONS } from "../../data/gamesData";

function shuffleAndPick(arr, count) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count).map((q) => {
    const correctAnswer = q.options[q.correct];
    const shuffledOptions = [...q.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    return {
      ...q,
      options: shuffledOptions,
      correct: shuffledOptions.indexOf(correctAnswer),
    };
  });
}

export default function CodeQuiz({ onBack }) {
  const [phase, setPhase] = useState("idle");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = useCallback(() => {
    setQuestions(shuffleAndPick(ALL_QUESTIONS, 7));
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setShowExplanation(false);
    setPhase("playing");
  }, []);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === questions[currentQ].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setPhase("done");
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const q = questions[currentQ];

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
        <span className="material-symbols-outlined text-primary text-3xl">quiz</span>
        <h3 className="font-headline text-2xl font-bold uppercase tracking-wider">
          Code_Quiz
        </h3>
      </div>

      <p className="text-on-surface-variant text-sm mb-8">
        Test your CS knowledge with 7 quick questions on programming, algorithms, and tools.
      </p>

      {phase === "idle" && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-primary/30 mb-4 block">
            quiz
          </span>
          <button
            onClick={startQuiz}
            className="bg-primary text-surface-container-lowest font-headline text-sm uppercase tracking-wider px-8 py-3 rounded-sm font-bold hover:bg-primary-dark transition-colors cursor-pointer"
          >
            Start Quiz
          </button>
        </div>
      )}

      {phase === "playing" && q && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
              Question {currentQ + 1}/{questions.length}
            </span>
            <span className="font-mono text-xs text-primary uppercase tracking-wider">
              Score: {score}
            </span>
          </div>

          <div className="w-full bg-surface-container-low rounded-full h-1 mb-8">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-500"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="bg-surface-container-low border border-outline rounded-sm p-6 mb-6">
            <p className="font-mono text-lg text-on-surface leading-relaxed">{q.question}</p>
          </div>

          <div className="space-y-3 mb-6">
            {q.options.map((option, idx) => {
              let style =
                "border border-outline bg-surface-container-low hover:border-primary/30 text-on-surface";
              if (selected !== null) {
                if (idx === q.correct) {
                  style = "border-2 border-green-400 bg-green-400/10 text-green-400";
                } else if (idx === selected) {
                  style = "border-2 border-red-400 bg-red-400/10 text-red-400";
                } else {
                  style = "border border-outline/50 bg-surface-container-low/50 text-on-surface-variant/50";
                }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  className={`w-full text-left rounded-sm p-4 transition-all cursor-pointer touch-manipulation ${style}`}
                >
                  <span className="font-mono text-sm">{option}</span>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="bg-surface-container border border-outline rounded-sm p-4 mb-6">
              <p className="text-on-surface-variant text-sm leading-relaxed">
                <span className="text-primary font-bold">Explanation: </span>
                {q.explanation}
              </p>
            </div>
          )}

          {selected !== null && (
            <div className="text-right">
              <button
                onClick={handleNext}
                className="bg-primary text-surface-container-lowest font-headline text-sm uppercase tracking-wider px-6 py-2.5 rounded-sm font-bold hover:bg-primary-dark transition-colors cursor-pointer"
              >
                {currentQ + 1 >= questions.length ? "See Results" : "Next"}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "done" && (
        <div className="text-center py-8">
          <div className="bg-surface-container-low border border-outline rounded-sm p-8 mb-8 inline-block">
            <p className="font-mono text-6xl font-bold text-primary">
              {score}/{questions.length}
            </p>
            <p className="font-mono text-xs uppercase tracking-wider text-on-surface-variant mt-2">
              Correct Answers
            </p>
          </div>

          <p className="text-on-surface-variant mb-6 block">
            {score === questions.length
              ? "Perfect score! You really know your stuff."
              : score >= 5
              ? "Great job! Solid CS knowledge."
              : score >= 3
              ? "Not bad! Room to grow."
              : "Keep learning! Every expert was once a beginner."}
          </p>

          <button
            onClick={startQuiz}
            className="bg-primary text-surface-container-lowest font-headline text-sm uppercase tracking-wider px-8 py-3 rounded-sm font-bold hover:bg-primary-dark transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
