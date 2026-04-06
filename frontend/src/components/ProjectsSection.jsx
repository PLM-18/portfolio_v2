import ProjectCard from "./ProjectCard";
import TerminalCard from "./TerminalCard";

export default function ProjectsSection({ projects }) {
  const featured = projects.filter((p) => p.featured);
  const count = String(featured.length).padStart(2, "0");

  return (
    <section id="projects-section" className="space-y-12">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h3 className="font-headline text-3xl font-bold uppercase tracking-tighter text-on-surface">
            Deployed_Systems
          </h3>
          <div className="h-1 w-12 bg-primary" />
        </div>
        <span className="font-mono text-xs text-on-surface-variant opacity-50 hidden md:block">
          COUNT: {count}_SELECTED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featured.map((project) => {
          const isTerminal =
            project.displayType === "terminal-static" ||
            project.displayType === "terminal-interactive";

          return isTerminal ? (
            <TerminalCard key={project.id} project={project} />
          ) : (
            <ProjectCard key={project.id} project={project} />
          );
        })}
      </div>
    </section>
  );
}
