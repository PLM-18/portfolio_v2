export default function Footer({ data }) {
  const { brandName, copyrightYear, tagline, socialLinks } = data;

  return (
    <footer className="bg-slate-950 w-full py-12 px-8 border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
        <div className="text-center md:text-left">
          <span className="text-cyan-400 font-bold font-mono text-xs tracking-widest">
            {brandName}
          </span>
          <p className="font-mono text-xs tracking-widest text-slate-600 mt-2">
            &copy; {copyrightYear} {brandName} // {tagline}
          </p>
        </div>

        <div className="flex gap-8">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-widest text-slate-600 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}