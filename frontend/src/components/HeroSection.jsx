export default function HeroSection({ data }) {
  const { availabilityBadge, firstName, lastName, tagline, bio, resumeUrl, contactEmail } = data;

  return (
    <section id="root" className="relative min-h-[530px] flex flex-col justify-center">
      {/* Ambient glow */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />

      <div className="space-y-6 relative z-10">
        {/* Availability badge */}
        <div className="inline-flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-sm border border-outline-variant/20">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
            {availabilityBadge}
          </span>
        </div>

        {/* Name */}
        <h1 className="font-headline text-5xl md:text-8xl font-bold tracking-tight text-on-surface leading-none">
          {firstName} <br />
          <span className="text-primary">{lastName}.</span>
          <span className="inline-block w-4 h-12 md:w-8 md:h-20 bg-primary ml-2 animate-pulse align-middle" />
        </h1>

        {/* Tagline */}
        <h2 className="font-headline text-xl md:text-3xl text-on-surface-variant max-w-2xl font-light">
          {tagline}
        </h2>

        {/* Bio */}
        <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">{bio}</p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 pt-4">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed px-8 py-4 rounded-sm font-label font-bold uppercase tracking-wider active:scale-95 transition-all"
          >
            Resume.exe
          </a>
          <a
            href={`mailto:${contactEmail}`}
            className="border border-outline-variant/20 text-primary px-8 py-4 rounded-sm font-label font-bold uppercase tracking-wider hover:bg-white/5 active:scale-95 transition-all"
          >
            Connect
          </a>
        </div>
      </div>
    </section>
  );
}