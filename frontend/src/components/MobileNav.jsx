const mobileNavItems = [
  { id: "root", label: "Root", icon: "home" },
  { id: "projects", label: "Projects", icon: "reorder" },
  { id: "stack", label: "Stack", icon: "terminal" },
  { id: "contact", label: "Contact", icon: "alternate_email" },
];

export default function MobileNav({ activeNav, setActiveNav }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-3 px-4 bg-slate-950/80 backdrop-blur-lg md:hidden z-50 border-t border-white/5">
      {mobileNavItems.map((item) => {
        const isActive = activeNav === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setActiveNav(item.id)}
            className={`flex flex-col items-center justify-center touch-manipulation transition-colors ${
              isActive
                ? "text-cyan-400 bg-cyan-950/30 rounded-sm px-3 py-1"
                : "text-slate-500 hover:text-cyan-200 px-3 py-1"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-label text-[10px] font-bold uppercase tracking-tighter mt-1">
              {item.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}