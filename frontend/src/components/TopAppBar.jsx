export default function TopAppBar({ activeSection, onNavClick }) {
  const navItems = [
    { id: "root", label: "Root" },
    { id: "projects", label: "Projects" },
    { id: "stack", label: "Stack" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/70 backdrop-blur-xl shadow-2xl shadow-cyan-900/10">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">terminal</span>
          <span className="font-headline tracking-widest uppercase text-xl font-bold text-primary">
            TERMINAL_CURATOR
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick?.(item.id)}
                className={[
                  "font-headline tracking-tight uppercase text-sm transition-colors",
                  activeSection === item.id
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span className="material-symbols-outlined text-primary cursor-pointer active:scale-95 md:hidden">
            menu
          </span>
        </div>
      </nav>
    </header>
  );
}
