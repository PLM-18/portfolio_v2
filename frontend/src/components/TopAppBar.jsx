const navLinks = [
    {id: "root", label: "Root"},
    {id: "projects", label: "Projects"},
    {id: "stack", label: "Stack"}
];

export default function TopAppBar({ activeNav, setActiveNav }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-xl shadow-2xl shadow-cyan-900/10">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-cyan-400">terminal</span>
          <span className="font-headline tracking-widest uppercase text-xl font-bold text-cyan-400">
            TERMINAL_CURATOR
          </span>
        </div>
 
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setActiveNav(link.id)}
              className={`font-headline tracking-tight uppercase transition-colors ${
                activeNav === link.id
                  ? "text-cyan-400 border-b-2 border-cyan-400 pb-1"
                  : "text-slate-400 hover:text-cyan-300"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
 
        <span className="material-symbols-outlined text-cyan-400 cursor-pointer active:scale-95 md:hidden">
          menu
        </span>
      </nav>
    </header>
  );
}
