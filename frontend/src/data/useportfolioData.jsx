export const portfolioData = {
  // ─── Hero ────────────────────────────────────────────────────────────────
  hero: {
    // CMS field: hero.availabilityBadge
    availabilityBadge: "Available for Collaboration",

    // CMS field: hero.firstName
    firstName: "Philemon",

    // CMS field: hero.lastName
    lastName: "Muleya",

    // CMS field: hero.tagline
    tagline: "Aspiring Software Engineer.",

    // CMS field: hero.bio (rich text → plain string here)
    bio: "Crafting scalable, secure, and efficient systems from modern React interfaces to low-level networking tools.",

    // CMS field: hero.resumeUrl (asset URL)
    resumeUrl: "/resume.pdf",

    // CMS field: hero.contactEmail
    contactEmail: "philemon@example.com",
  },

  // ─── Projects ─────────────────────────────────────────────────────────────
  projects: [
    {
      // CMS field: project.id (slug)
      id: "ecommerce-store",
      order: 1,

      // CMS field: project.title
      title: "E-commerce Store",

      // CMS field: project.subtitle
      subtitle: "Full-Stack Solution",

      // CMS field: project.description (rich text → plain string)
      description:
        "A high-performance marketplace architecture featuring real-time inventory synchronization and encrypted payment gateways.",

      // CMS field: project.projectUrl
      projectUrl: "https://github.com/philemon/ecommerce",

      // CMS field: project.mediaType  → "image" | "video" | "terminal"
      mediaType: "image",

      // CMS field: project.mediaSrc (asset URL — used for image & video)
      mediaSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDa6rQz-msm0GXt_xQP2lElbJKmSyWilU1fXuNaGoTosYTPJ11zY_1ho0Gjkkncggzs_yRuuSNRu8l17Yba8tzpgeftm1Aitd1me66LIOcH6nKkQ5WI5IW2HOpnODHU7fgblSdBEPthyd8ndwrUBV94iqjfsnGXYSjDFVfnY3NinEpo7XaQ9Oscf9GR5ZPc134sFKYn_qNZ3ayP0YQxnZT8pI9XQXeg2kai-ZQkleW8DPgDffPGJTAs9CbjZcj6t_fhm0pq-4hpcg",

      // CMS field: project.mediaAlt (accessibility)
      mediaAlt: "E-commerce project showcase",

      // terminalConfig: null when mediaType !== "terminal"
      terminalConfig: null,
    },
    {
      id: "workout-app",
      order: 2,
      title: "Workout Application",
      subtitle: "Progressive Web App",
      description:
        "Personalized fitness tracking with biometric data visualization and algorithmic routine suggestions.",
      projectUrl: "https://github.com/philemon/workout-app",
      mediaType: "video",
      // CMS field: project.mediaSrc — point to a .mp4 asset
      mediaSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDQtOSmRdnlGEjfyPP892bx5LRyBcD2zE2R2vz3ULkulgTTYrBU4zMIRuTumjHxB00IVeGJegsESS0srOc4ZuXOMHeqJBy6SDsUN0QjVMqt9rA5pF3yjmEy06Qfg1jJ-IZ8nA5aX6WV5c6wqGQChF4kkmgKlD7ge3orUFOtfNluFNHFvd3MaT7CFxiyLO5DiCda5LVln2ZnyztFkQxyrdQlvykpQE_Nad1RxFzY4hTqQTMVJtjFAA8-Rpp1MYUX3LByAO_g2c7O8A",
      mediaAlt: "Workout Application showcase",
      terminalConfig: null,
    },
    {
      id: "pop3-client",
      order: 3,
      title: "POP3 Client",
      subtitle: "Low-Level Networking",
      description:
        "A fully RFC-compliant POP3 client built in Java. Handles RETR, DELE, LIST, STAT and multi-line responses over raw TCP sockets.",
      projectUrl: "https://github.com/philemon/pop3-client",

      // Switch to "terminal" when your Java service + WS proxy is ready
      mediaType: "terminal",
      mediaSrc: null,
      mediaAlt: null,

      // CMS field: project.terminalConfig (JSON object / nested object field)
      terminalConfig: {
        // Replace with your WebSocket proxy URL when ready
        // e.g. "wss://pop3.yourdomain.com/ws"
        wsUrl: null, // null = demo/mock mode (no live connection)

        // Displayed before the WS connection opens (or in mock mode)
        welcomeLines: [
          "$ ./connect --host=mail.internal --port=110",
          "  Connecting to POP3 server...",
          "  +OK POP3 server ready",
          "$ USER philemon_m",
          "  +OK password required",
          "$ PASS ••••••••",
          "  +OK philemon_m's maildrop has 4 messages",
          "$ STAT",
          "  +OK 4 8192",
        ],
        prompt: "pop3-client:~$",
      },
    },
    {
      id: "ftp-server",
      order: 4,
      title: "FTP Server",
      subtitle: "Systems & Architecture",
      description:
        "A multi-threaded FTP daemon in Java supporting active/passive modes, virtual user directories, and TLS negotiation.",
      projectUrl: "https://github.com/philemon/ftp-server",
      mediaType: "terminal",
      mediaSrc: null,
      mediaAlt: null,
      terminalConfig: {
        wsUrl: null,
        welcomeLines: [
          "$ ftp-server --status",
          "  STATUS: RUNNING",
          "  Uptime: 14h 22m 04s",
          "  [INFO] Listener active on port 21",
          "  [AUTH] 192.168.1.45 accepted",
          "  [XFER] RETR /files/report.pdf — 2.4 MB",
          "  [INFO] Passive mode: port 50021",
        ],
        prompt: "ftp-daemon:~$",
      },
    },
  ],

  // ─── Education ────────────────────────────────────────────────────────────
  education: [
    {
      // CMS field: education.id
      id: "up-bsc",

      // CMS field: education.level
      level: "UNDERGRADUATE",

      // CMS field: education.institution
      institution: "University of Pretoria",

      // CMS field: education.degree
      degree: "BSc in Information and Knowledge Systems",

      // CMS field: education.startYear / education.endYear
      startYear: 2022,
      endYear: 2025,

      // CMS field: education.tags (array of strings)
      tags: ["Systems Dev", "Data Structures", "Networking"],
    },
  ],

  // ─── Skills ───────────────────────────────────────────────────────────────
  skills: [
    {
      // CMS field: skillCategory.id
      id: "languages",

      // CMS field: skillCategory.title
      title: "Programming Languages",

      // CMS field: skillCategory.items (array of strings)
      items: ["C#", "C++", "Java", "Go", "JS", "PHP", "Python"],
    },
    {
      id: "web",
      title: "Web Frameworks & Tools",
      items: ["ASP.NET Core", "React", "Vue.js", "Angular", "Express.js"],
    },
    {
      id: "devops",
      title: "DevOps & Infrastructure",
      items: ["Docker", "Kubernetes", "CI/CD", "AWS"],
    },
    {
      id: "db-security",
      title: "Databases & Security",
      items: ["PostgreSQL", "MongoDB", "OAuth2", "JWT"],
    },
  ],

  // ─── Footer ───────────────────────────────────────────────────────────────
  footer: {
    // CMS field: footer.brandName
    brandName: "TERMINAL_CURATOR",

    // CMS field: footer.copyrightYear
    copyrightYear: 2024,

    // CMS field: footer.tagline
    tagline: "BUILT_WITH_PRECISION",

    // CMS field: footer.socialLinks (array)
    socialLinks: [
      { label: "GITHUB", url: "https://github.com/philemon" },
      { label: "LINKEDIN", url: "https://linkedin.com/in/philemon" },
      { label: "SOURCE", url: "https://github.com/philemon/portfolio" },
    ],
  },
};