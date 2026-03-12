import { useState, useRef, useEffect } from 'react'

const languages = ['EN', 'FR', 'DE', 'ES', 'ZU']

const coolStuffLinks = [
  { label: 'Side Projects', href: '#' },
  { label: 'Open Source', href: '#' },
  { label: 'Experiments', href: '#' },
  { label: 'Blog Posts', href: '#' },
  { label: 'Resources', href: '#' },
]

function Navbar() {
  const [coolStuffOpen, setCoolStuffOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState('EN')

  const coolStuffRef = useRef(null)
  const langRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (coolStuffRef.current && !coolStuffRef.current.contains(e.target)) {
        setCoolStuffOpen(false)
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117] h-14 flex items-center justify-between px-6 shadow-lg select-none">
      {/* Left: Name Logo */}
      <div className="flex items-center gap-8">
        <a href="/" className="flex items-baseline text-2xl font-light tracking-wide leading-none">
          <span className="text-[#2b5c8a] font-light">Phile</span>
          <span className="text-[#5a8fb4] font-light">mon</span>
          <span className="text-[#2b5c8a] text-lg font-bold ml-0">.</span>
        </a>

        {/* Cool Stuff Dropdown */}
        <div className="relative" ref={coolStuffRef}>
          <button
            onClick={() => setCoolStuffOpen(!coolStuffOpen)}
            className="flex items-center gap-1 text-gray-300 hover:text-white text-sm transition-colors cursor-pointer"
          >
            Cool Stuff
            <svg className={`w-3 h-3 transition-transform ${coolStuffOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {coolStuffOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#161b22] border border-gray-700 rounded-md shadow-xl py-1">
              {coolStuffLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#1f2937] hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Language Switch + Contact */}
      <div className="flex items-center gap-5">
        {/* Language Switcher */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors cursor-pointer"
          >
            {/* Globe icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
              <path strokeWidth={1.5} d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
            </svg>
            ZA - {selectedLang}
            <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {langOpen && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-[#161b22] border border-gray-700 rounded-md shadow-xl py-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setSelectedLang(lang); setLangOpen(false) }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                    selectedLang === lang
                      ? 'text-white bg-[#1f2937]'
                      : 'text-gray-300 hover:bg-[#1f2937] hover:text-white'
                  }`}
                >
                  ZA - {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        <a
          href="mailto:philemonmuleya@gmail.com"
          title="Contact Me"
          className="text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0-8.953 5.468a1.5 1.5 0 0 1-1.594 0L2.25 6.75" />
          </svg>
        </a>
      </div>
    </nav>
  )
}

export default Navbar
