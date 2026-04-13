import { useState, useEffect } from "react";
import { usePortfolioData } from "./hooks/usePortfolioData";
import TopAppBar from "./components/TopAppBar";
import MobileNav from "./components/MobileNav";
import HeroSection from "./components/HeroSection";
import ProjectsSection from "./components/ProjectsSection";
import SkillsEducationSection from "./components/SkillsEducationSection";
import Footer from "./components/Footer";

const SECTION_IDS = {
  root: "root-section",
  projects: "projects-section",
  stack: "stack-section",
  contact: "contact-section",
};

export default function App() {
  const { profile, projects, skillCategories, education, loading } = usePortfolioData();
  const [activeSection, setActiveSection] = useState("root");

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
    </div>
  );
}
