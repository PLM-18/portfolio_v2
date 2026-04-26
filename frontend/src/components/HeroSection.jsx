import { useState, useEffect } from "react";

export default function HeroSection({ profile }) {
  const { name, tagline, bio, availableForCollaboration, github, linkedin } = profile;
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  const [displayFirst, setDisplayFirst] = useState("");
  const [displayLast, setDisplayLast] = useState("");

  const [phase, setPhase] = useState("typingFirst");

  const done = phase === "typingLast" && displayLast.length === lastName.length;

  useEffect(() => {
    let timeout;
    if (phase === "typingFirst") {
      if (displayFirst.length < firstName.length) {
        timeout = setTimeout(() => {
          setDisplayFirst(firstName.slice(0, displayFirst.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => setPhase("typingLast"), 300);
      }
    } else if (phase === "typingLast" && !done) {
      timeout = setTimeout(() => {
        setDisplayLast(lastName.slice(0, displayLast.length + 1));
      }, 100);
    }
    return () => clearTimeout(timeout);
  }, [phase, displayFirst, displayLast, firstName, lastName, done]);

  function handleResume() {
    window.open("/Resume.pdf", "_blank");
  }

  return (
    <section id="root-section" className="relative min-h-[530px] flex flex-col justify-center">
      {/* ambient glow */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="space-y-6 relative z-10">
        {availableForCollaboration && (
          <div className="inline-flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-sm border border-outline-variant/20">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
              Available for Collaboration
            </span>
          </div>
        )}

        <h1 className="font-headline text-5xl md:text-8xl font-bold tracking-tight text-on-surface leading-none">
          {displayFirst}
          {phase === "typingFirst" && (
            <span className="inline-block w-4 h-12 md:w-8 md:h-20 bg-primary ml-2 align-middle" />
          )}
          <br />
          <span className="text-primary">
            {displayLast}{done && "."}
          </span>
          {phase !== "typingFirst" && (
            <span className={`inline-block w-4 h-12 md:w-8 md:h-20 bg-primary ml-2 align-middle${done ? " animate-pulse" : ""}`} />
          )}
        </h1>

        <h2 className="font-headline text-xl md:text-3xl text-on-surface-variant max-w-2xl font-light">
          {tagline}
        </h2>

        <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">{bio}</p>

        <div className="flex flex-wrap gap-4 pt-4">
          <button
            onClick={handleResume}
            className="bg-linear-to-br from-primary to-primary-container text-on-primary-fixed px-8 py-4 rounded-sm font-label font-bold uppercase tracking-wider active:scale-95 transition-all"
          >
            Resume.exe
          </button>
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="border border-outline-variant/20 text-primary px-8 py-4 rounded-sm font-label font-bold uppercase tracking-wider hover:bg-white/5 active:scale-95 transition-all"
          >
            GitHub
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="border border-outline-variant/20 text-on-surface-variant px-8 py-4 rounded-sm font-label font-bold uppercase tracking-wider hover:bg-white/5 active:scale-95 transition-all"
          >
            Connect
          </a>
        </div>
      </div>
    </section>
  );
}
