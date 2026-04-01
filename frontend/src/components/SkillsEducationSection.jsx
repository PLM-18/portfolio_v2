export default function SkillsEducationSection({ education, skills }) {
  return (
    <section id="stack" className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Education */}
      <div className="lg:col-span-1 space-y-8">
        <div className="space-y-2">
          <h3 className="font-headline text-3xl font-bold uppercase tracking-tighter text-on-surface">
            Academic_Log
          </h3>
          <div className="h-1 w-12 bg-tertiary" />
        </div>

        {education.map((entry) => (
          <div key={entry.id} className="bg-surface-container-low p-8 rounded-sm space-y-4">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-primary">{entry.level}</span>
              <h4 className="font-headline text-xl font-bold text-on-surface">{entry.institution}</h4>
              <p className="text-on-surface-variant leading-relaxed">{entry.degree}</p>
              {entry.startYear && (
                <p className="font-mono text-[10px] text-on-surface-variant/50">
                  {entry.startYear} — {entry.endYear ?? "present"}
                </p>
              )}
            </div>
            <div className="pt-4 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-surface-container-high text-[10px] px-2 py-1 font-label uppercase text-on-surface-variant"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="lg:col-span-2 space-y-8">
        <div className="space-y-2">
          <h3 className="font-headline text-3xl font-bold uppercase tracking-tighter text-on-surface">
            Tech_Stack
          </h3>
          <div className="h-1 w-12 bg-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((category) => (
            <div
              key={category.id}
              className="bg-surface-container p-6 rounded-sm space-y-4 border-l-2 border-primary/20"
            >
              <h5 className="font-headline font-bold text-sm uppercase tracking-widest text-primary">
                {category.title}
              </h5>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-xs px-2 py-1 bg-surface-container-highest rounded-sm text-on-surface"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}