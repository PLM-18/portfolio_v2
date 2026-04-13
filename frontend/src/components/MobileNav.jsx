const navItems = [
  { id: "root", label: "Root", icon: "home" },
  { id: "projects", label: "Projects", icon: "reorder" },
  { id: "stack", label: "Stack", icon: "terminal" },
  { id: "contact", label: "Contact", icon: "alternate_email" },
  { id: "games", label: "Games", icon: "grid_view" },
];

export default function MobileNav({ activeSection, onNavClick }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-3 px-4 bg-surface-container-lowest/80 backdrop-blur-lg md:hidden z-50 border-t border-white/5">
      {navItems.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavClick?.(item.id)}
            className={[
              "flex flex-col items-center justify-center transition-colors touch-manipulation",
              isActive
                ? "text-primary bg-primary/10 rounded-sm px-3 py-1"
                : "text-on-surface-variant hover:text-primary px-3 py-1",
            ].join(" ")}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-label text-[10px] font-bold uppercase tracking-tighter mt-1">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
