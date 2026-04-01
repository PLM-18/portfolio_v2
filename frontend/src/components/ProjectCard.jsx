import TerminalCard from "./TerminalCard";

/**
 * ProjectCard
 *
 * Routes to the correct card variant based on project.mediaType:
 *
 *   "image"    → standard card with <img> thumbnail
 *   "video"    → card with autoplay / loop / muted <video>
 *   "terminal" → TerminalCard (live WebSocket or typewriter demo)
 *
 * All variants share the same data shape from portfolioData.
 */
export default function ProjectCard({ project }) {
  const {
    mediaType,
    mediaSrc,
    mediaAlt,
    title,
    subtitle,
    description,
    projectUrl,
    terminalConfig,
  } = project;

  if (mediaType === "terminal") {
    return (
      <div className="flex flex-col gap-0">
        <TerminalCard
          terminalConfig={terminalConfig}
          title={title}
          subtitle={subtitle}
        />
        {/* Description + link below terminal window */}
        <div className="bg-surface-container px-6 py-4 space-y-3 rounded-b-sm border border-t-0 border-outline-variant/10">
          <p className="text-on-surface-variant text-xs leading-relaxed">{description}</p>
          {projectUrl && (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-label text-[10px] font-bold uppercase tracking-widest text-primary hover:gap-3 transition-all"
            >
              View Source{" "}
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-surface-container rounded-sm overflow-hidden transition-all duration-300 hover:bg-surface-container-highest">
      {/* Media area */}
      <div className="aspect-video relative overflow-hidden bg-surface-container-low">
        {mediaType === "video" ? (
          <video
            src={mediaSrc}
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            aria-label={mediaAlt}
          />
        ) : (
          <img
            src={mediaSrc}
            alt={mediaAlt}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-60" />

        {/* Media type badge — top-right corner */}
        <span className="absolute top-3 right-3 font-mono text-[9px] px-2 py-0.5 rounded-sm bg-black/60 text-on-surface-variant uppercase tracking-wider backdrop-blur-sm">
          {mediaType}
        </span>
      </div>

      {/* Content */}
      <div className="p-8 space-y-4">
        <div>
          <h4 className="font-headline text-2xl font-bold text-on-surface">{title}</h4>
          <p className="font-label text-sm text-primary uppercase tracking-widest mt-1">{subtitle}</p>
        </div>

        <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>

        {projectUrl && (
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-primary pt-2 group-hover:gap-4 transition-all"
          >
            View Project{" "}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        )}
      </div>
    </div>
  );
}