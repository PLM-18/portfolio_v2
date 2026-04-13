import { useState, useEffect } from "react";
import { usePortfolioData } from "./hooks/usePortfolioData";
import TopAppBar from "./components/TopAppBar";
import MobileNav from "./components/MobileNav";
import HeroSection from "./components/HeroSection";
import ProjectsSection from "./components/ProjectsSection";
import SkillsEducationSection from "./components/SkillsEducationSection";
import Footer from "./components/Footer";
import MemoryMatch from "./components/games/MemoryMatch";
import CodeQuiz from "./components/games/CodeQuiz";
import TypingSpeedTest from "./components/games/TypingSpeedTest";

const GAMES = [
  {
    id: "memory",
    label: "Memory_Match",
    icon: "grid_view",
    description: "Match pairs of dev tool icons in the fewest moves.",
  },
  {
    id: "quiz",
    label: "Code_Quiz",
    icon: "quiz",
    description: "7 quick CS questions on algorithms, tools, and more.",
  },
  {
    id: "typing",
    label: "Speed_Type",
    icon: "keyboard",
    description: "Type code snippets as fast as you can in 30 seconds.",
  },
];

const SECTION_IDS = {
  root: "root-section",
  projects: "projects-section",
  stack: "stack-section",
  contact: "contact-section",
};

export default function App() {
  const { profile, projects, skillCategories, education, loading } = usePortfolioData();
  const [activeSection, setActiveSection] = useState("root");
  const [showGames, setShowGames] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  // Highlight the nav item for the section currently in the viewport
  useEffect(() => {
    const observers = Object.entries(SECTION_IDS).map(([key, id]) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(key); },
        { threshold: 0.3 }
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach((obs) => obs?.disconnect());
  }, [loading]);

  function handleNavClick(sectionId) {
    if (sectionId === "games") {
      setShowGames(true);
      return;
    }
    const elId = SECTION_IDS[sectionId];
    document.getElementById(elId)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(sectionId);
  }

  return (
    <div className="font-body selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <TopAppBar activeSection={activeSection} onNavClick={handleNavClick} />

      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-24">
        <HeroSection profile={profile} />
        <ProjectsSection projects={projects} />
        <SkillsEducationSection
          skillCategories={skillCategories}
          education={education}
        />
      </main>

      <Footer profile={profile} />
      <MobileNav activeSection={activeSection} onNavClick={handleNavClick} />

      {showGames && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowGames(false); setActiveGame(null); } }}
        >
          <div className="bg-surface-container-lowest border border-outline/20 rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            {activeGame === null && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">sports_esports</span>
                    <h3 className="font-headline text-xl font-bold uppercase tracking-wider">Games</h3>
                  </div>
                  <button
                    onClick={() => setShowGames(false)}
                    className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {GAMES.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => setActiveGame(game.id)}
                      className="w-full flex items-center gap-4 p-4 bg-surface-container-low border border-outline hover:border-primary/40 rounded-sm transition-all cursor-pointer text-left group"
                    >
                      <span className="material-symbols-outlined text-primary text-2xl">{game.icon}</span>
                      <div>
                        <p className="font-headline text-sm font-bold uppercase tracking-wider text-on-surface group-hover:text-primary transition-colors">
                          {game.label}
                        </p>
                        <p className="font-mono text-xs text-on-surface-variant mt-0.5">{game.description}</p>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary/60 ml-auto transition-colors">chevron_right</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {activeGame === "memory" && (
              <MemoryMatch onBack={() => setActiveGame(null)} />
            )}
            {activeGame === "quiz" && (
              <CodeQuiz onBack={() => setActiveGame(null)} />
            )}
            {activeGame === "typing" && (
              <TypingSpeedTest onBack={() => setActiveGame(null)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
