export default function SkillsEducationSection({ skillCategories, education }) {
  return (
    <section id="stack-section" className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <Education education={education} />
      <Skills skillCategories={skillCategories} />
    </section>
  );
}

function Education({ education }) {
  return (
    <div className="lg:col-span-1 space-y-8">
      <div className="space-y-2">
        <h3 className="font-headline text-3xl font-bold uppercase tracking-tighter text-on-surface">
          Academic_Log
        </h3>
        <div className="h-1 w-12 bg-tertiary" />
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="bg-surface-container-low p-8 rounded-sm space-y-4"
          >
            <div className="flex flex-col gap-1">
              {edu.badge && (
                <span className="font-mono text-[10px] text-primary">{edu.badge}</span>
              )}
              <h4 className="font-headline text-xl font-bold">{edu.institution}</h4>
              <p className="text-on-surface-variant leading-relaxed">{edu.degree}</p>
              {edu.concentration && (
                <p className="text-on-surface-variant/60 text-sm">{edu.concentration}</p>
              )}
            </div>

            {edu.coursework?.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-2">
                {edu.coursework.map((course) => (
                  <span
                    key={course}
                    className="bg-surface-container-high text-[10px] px-2 py-1 font-label uppercase text-on-surface-variant rounded-sm"
                  >
                    {course}
                  </span>
                ))}
              </div>
            )}

            <p className="font-mono text-[10px] text-on-surface-variant/40">
              {edu.startYear}
              {edu.endYear ? ` — ${edu.endYear}` : " — Present"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Skills({ skillCategories }) {
  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="space-y-2">
        <h3 className="font-headline text-3xl font-bold uppercase tracking-tighter text-on-surface">
          Tech_Stack
        </h3>
        <div className="h-1 w-12 bg-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillCategories.map((category) => (
          <div
            key={category.id}
            className="bg-surface-container p-6 rounded-sm space-y-4 border-l-2 border-primary/20"
          >
            <h5 className="font-headline font-bold text-sm uppercase tracking-widest text-primary">
              {category.title}
            </h5>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="font-mono text-xs px-2 py-1 bg-surface-container-highest rounded-sm text-on-surface"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
