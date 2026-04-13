/**
 * ProjectCard — for projects with a visual (image or YouTube) media header.
 * displayType: "image" | "youtube"
 */
export default function ProjectCard({ project }) {
  const { title, subtitle, description, displayType, imageUrl, youtubeId, repo, tags } = project;

  return (
    <div className="group bg-surface-container rounded-sm overflow-hidden transition-all duration-300 hover:bg-surface-container-highest flex flex-col h-full">
      {/* Media */}
      <div className="aspect-video relative overflow-hidden bg-surface-container-low">
        {displayType === "youtube" && youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title} showcase`}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <PlaceholderMedia title={title} tags={tags} />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-surface-container via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-8 space-y-4 flex flex-col flex-grow">
        <div>
          <h4 className="font-headline text-2xl font-bold text-on-surface">{title}</h4>
          <p className="font-label text-sm text-primary uppercase tracking-widest mt-1">{subtitle}</p>
        </div>

        <p className="text-on-surface-variant text-sm leading-relaxed flex-grow">{description}</p>

        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2 py-1 bg-surface-container-highest rounded-sm text-on-surface-variant"
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
            className="inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-primary pt-2 group-hover:gap-4 transition-all self-start"
          >
            View Project{" "}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        )}
      </div>
    </div>
  );
}

/** Shown when no image/video URL is available yet */
function PlaceholderMedia({ title, tags }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 relative">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, #81ecff 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <span className="material-symbols-outlined text-4xl text-primary/30">folder_code</span>
      <span className="font-mono text-xs text-on-surface-variant/40 text-center">{title}</span>
    </div>
  );
}
