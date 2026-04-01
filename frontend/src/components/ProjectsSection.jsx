import ProjectCard from "./ProjectCard";

export default function ProjectsSection({ projects }) {
  const sorted = [...projects].sort((a, b) => a.order - b.order);
  const countLabel = String(sorted.length).padStart(2, "0") + "_SELECTED";

  return (
    <section id="projects" className="space-y-12">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h3 className="font-headline text-3xl font-bold uppercase tracking-tighter text-on-surface">
            Deployed_Systems
          </h3>
          <div className="h-1 w-12 bg-primary" />
        </div>
        <span className="font-mono text-xs text-on-surface-variant opacity-50 hidden md:block">
          COUNT: {countLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sorted.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}