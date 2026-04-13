import { useState } from "react";

/**
 * ProjectCard — for projects with a visual (image or YouTube) media header.
 * displayType: "image" | "youtube"
 * imageUrl: string | string[]  — array enables a carousel
 */
export default function ProjectCard({ project }) {
  const { title, subtitle, description, displayType, imageUrl, youtubeId, repo, tags } = project;

  const images = Array.isArray(imageUrl) ? imageUrl : imageUrl ? [imageUrl] : [];
  const [index, setIndex] = useState(0);

  const prev = (e) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  };

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
        ) : images.length > 0 ? (
          <>
            <img
              key={index}
              src={images[index]}
              alt={`${title} screenshot ${index + 1}`}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />

            {/* Prev / Next buttons — only when multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-surface-container/70 text-on-surface opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button
                  onClick={next}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-surface-container/70 text-on-surface opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                      aria-label={`Go to image ${i + 1}`}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i === index ? "bg-primary scale-125" : "bg-on-surface/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
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
