/** Static portfolio data. */

export const profile = {
  name: "Philemon Muleya",
  tagline: "Aspiring Software Engineer.",
  bio: "Final year BSc Information and Knowledge Systems student at the University of Pretoria, specializing in Computer Science and Software Development. Building scalable, secure and efficient systems — from modern React interfaces to low-level networking tools in Go, Java and C++.",
  email: "u23629810@tuks.co.za",
  phone: "067 127 2394",
  github: "https://github.com/PLM-18",
  linkedin: "https://www.linkedin.com/in/philemon-m-9a0a50268/",
  location: "Pretoria, South Africa",
  availableForCollaboration: true,
};

/** displayType values:
 *  "image"                — static image thumbnail
 *  "youtube"              — embedded YouTube iframe (set youtubeId to the video ID)
 *  "terminal-static"      — decorative, non-interactive terminal
 *  "terminal-interactive" — live terminal via WebSocket (wsEndpoint required)
 */
export const projects = [
  {
    id: "ecommerce",
    title: "E-commerce Store",
    subtitle: "Full-Stack Solution",
    description:
      "Angular frontend with a C# .NET API backend supporting cart, checkout, and user authentication.",
    displayType: "image",
    imageUrl: [
      "https://raw.githubusercontent.com/PLM-18/OnlineStore/main/Assets/screenshot_1.png",
      "https://raw.githubusercontent.com/PLM-18/OnlineStore/main/Assets/screenshot_2.png",
      "https://raw.githubusercontent.com/PLM-18/OnlineStore/main/Assets/screenshot_3.png",
      "https://raw.githubusercontent.com/PLM-18/OnlineStore/main/Assets/screenshot_4.png"
    ],
    repo: "https://github.com/PLM-18/OnlineStore",
    tags: ["Angular", "C#", ".NET", "REST API"],
    featured: true,
  },
  {
    id: "workout",
    title: "Workout Application",
    subtitle: "Progressive Web App",
    description:
      "Mobile fitness app built in Ionic for personalised workout tracking with biometric data visualisation.",
    displayType: "image",
    imageUrl: null,
    repo: "https://github.com/PLM-18/WorkoutApp",
    tags: ["Ionic", "TypeScript", "Mobile"],
    featured: true,
  },
  {
    id: "securesharing",
    title: "Secure File Sharing Platform",
    subtitle: "Security · DevOps",
    description:
      "End-to-end encrypted file sharing system ensuring access only to intended users. Led integration and CI/CD pipeline work.",
    displayType: "youtube",
    imageUrl: null,
    youtubeId: "yc_qbKQRYv0",
    repo: "https://github.com/COS301-SE-2025/Secure-File-Sharing-Platform",
    tags: ["Encryption", "Docker", "CI/CD", "Go"],
    featured: true,
  },
  {
    id: "versioncontrol",
    title: "Version Control Site",
    subtitle: "Collaborative Platform",
    description:
      "Collaborative coding platform with real-time file editing.",
    displayType: "image",
    imageUrl: null,
    repo: "https://github.com/PLM-18/VersionControlSite",
    tags: ["WebSockets", "Real-time", "Collaboration"],
    featured: false,
  },
  {
    id: "pop3",
    title: "POP3 Client",
    subtitle: "Low-Level Networking",
    description:
      "Custom POP3 client using raw sockets to retrieve, list and manage email data directly from mail servers.",
    displayType: "terminal-interactive",
    imageUrl: null,
    repo: "https://github.com/PLM-18/POP3Client",
    tags: ["Java", "Sockets", "Networking", "POP3"],
    featured: true,
    wsEndpoint: import.meta.env.VITE_POP3_WS_URL ?? null,
    terminalLabel: "pop3_client.sh — 80x24",
    // Static lines shown before the user connects
    terminalLines: [
      { type: "command", text: "./connect --host=mail.internal --port=110" },
      { type: "output", text: "Connecting to POP3 server..." },
      { type: "output", text: "+OK POP3 server ready" },
      { type: "command", text: "USER demo" },
      { type: "output", text: "+OK Password required for demo" },
      { type: "command", text: "PASS ••••••••" },
      { type: "output", text: "+OK Mailbox locked and ready" },
      { type: "command", text: "STAT" },
      { type: "output", text: "+OK 3 messages (4096 octets)" },
    ],
  },
  {
    id: "ftp",
    title: "FTP Server",
    subtitle: "Systems & Architecture",
    description:
      "File watcher that implements the FTP protocol, automatically syncing local changes to a remote server over raw sockets.",
    displayType: "terminal-static",
    imageUrl: null,
    repo: "https://github.com/PLM-18/FTPSERVER",
    tags: ["Go", "FTP", "Sockets", "File Watcher"],
    featured: true,
    terminalLabel: "ftp_daemon — active",
    terminalLines: [
      { type: "comment", text: "// Starting FTP Daemon..." },
      { type: "command", text: "ftp-server --status" },
      { type: "status", text: "STATUS: RUNNING", detail: "Uptime: 14h 22m 04s" },
      { type: "info", text: "[INFO] Listener active on port 21" },
      { type: "info", text: "[AUTH] Connection from 192.168.1.45 accepted" },
      { type: "info", text: "[STOR] /uploads/report.pdf — 100%" },
    ],
  },
];

export const skillCategories = [
  {
    id: "languages",
    title: "Programming Languages",
    skills: ["C#", "C++", "Java", "Go", "JavaScript", "PHP", "Python"],
  },
  {
    id: "frameworks",
    title: "Web Frameworks & Tools",
    skills: ["ASP.NET Core", "React", "Vue.js", "Angular", "Express.js"],
  },
  {
    id: "devops",
    title: "DevOps & Infrastructure",
    skills: ["Docker", "GitHub Actions", "CI/CD", "Linux"],
  },
  {
    id: "databases",
    title: "Databases & Security",
    skills: ["PostgreSQL", "MongoDB", "OAuth2", "JWT", "Encryption"],
  },
];

export const education = [
  {
    id: "up",
    institution: "University of Pretoria",
    degree: "BSc in Information and Knowledge Systems",
    concentration: "Computer Science and Software Development",
    coursework: [
      "Data Structures & Algorithms",
      "Concurrent Systems",
      "Software Engineering",
      "Database Systems",
      "Computer Security",
    ],
    startYear: 2023,
    endYear: null, // currently enrolled
    badge: "GRADUATE_STUDIES",
  },
];
