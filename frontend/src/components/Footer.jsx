export default function Footer({ profile }) {
  const { github, linkedin, email } = profile;

  const links = [
    { label: "GITHUB", href: github },
    { label: "LINKEDIN", href: linkedin || "#" },
    { label: "EMAIL", href: `mailto:${email}` },
  ];

  return (
    <footer className="bg-surface-container-lowest w-full py-12 px-8 border-t border-white/5">
      <div
        id="contact-section"
        className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto"
      >
        <div className="text-center md:text-left">
          <span className="text-primary font-bold font-mono text-xs tracking-widest">
            TERMINAL_CURATOR
          </span>
          <p className="font-mono text-xs tracking-widest text-on-surface-variant/40 mt-2">
            © {new Date().getFullYear()} TERMINAL_CURATOR // BUILT_WITH_PRECISION
          </p>
        </div>

        <div className="flex gap-8">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noreferrer"
              className="font-mono text-xs tracking-widest text-on-surface-variant/40 hover:text-tertiary transition-colors cursor-pointer"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
