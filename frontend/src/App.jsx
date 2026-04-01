import { useState } from "react";
import TopAppBar from "./components/TopAppBar";
import MobileNav from "./components/MobileNav";
import HeroSection from "./components/HeroSection";
import ProjectsSection from "./components/ProjectsSection";
import SkillsEducationSection from "./components/SkillsEducationSection";
import Footer from "./components/Footer";
import { portfolioData } from "./data/useportfolioData";

export default function App() {
  const [activeNav, setActiveNav] = useState("root");
  const data = portfolioData;
  const loading = false;
  const error = null;

  return (
    <div className="font-body selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <TopAppBar activeNav={activeNav} setActiveNav={setActiveNav} />

      {loading && <LoadingScreen />}

      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-error-container text-on-error-container font-mono text-xs px-4 py-2 rounded-sm border border-error/30">
          CMS error — showing cached data
        </div>
      )}

      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-24">
        <HeroSection data={data.hero} />
        <ProjectsSection projects={data.projects} />
        <SkillsEducationSection
          education={data.education}
          skills={data.skills}
        />
      </main>

      <Footer data={data.footer} />
      <MobileNav activeNav={activeNav} setActiveNav={setActiveNav} />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
      <div className="font-mono text-primary text-sm flex items-center gap-3">
        <span className="animate-spin material-symbols-outlined text-xl">settings</span>
        Booting system…
      </div>
    </div>
  );
}