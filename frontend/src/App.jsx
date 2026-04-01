import './App.css'
import Navbar from './components/Navbar'
import ScrollReveal from './components/ScrollReveal'

const dummyProjects = [
  { id: 1, title: 'Secure File Sharing Platform', tech: 'Node.js, React, Docker' },
  { id: 2, title: 'POP3 Client Implementation', tech: 'C++, Raw Sockets' },
  { id: 3, title: 'FTP Server Sync Utility', tech: 'Java, Multithreading' },
  { id: 4, title: 'E-commerce Store API', tech: 'C# .NET, Angular' },
];

function App() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans">
      <Navbar />


      <main className="flex flex-col items-center justify-center min-h-screen px-6 pt-14 text-center">
        <h1 className="text-5xl font-light mb-4 text-white">
          Philemon Muleya. <br />
          <span className="font-bold text-[#5a8fb4]">Aspiring Software Engineer.</span>
        </h1>
        <p className="max-w-xl text-gray-400">
          Scroll down to see the projects load in using the Intersection Observer API.
        </p>
      </main>


      <section className="max-w-4xl mx-auto px-6 py-24 space-y-32">
        {dummyProjects.map((project) => (
          <ScrollReveal key={project.id}>
            <div className="bg-[#161b22] border border-gray-700 rounded-lg p-10 shadow-2xl hover:border-[#5a8fb4] transition-colors cursor-pointer text-left">
              <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>
              <p className="text-[#5a8fb4] font-mono text-sm mb-6">{project.tech}</p>
              <div className="h-48 bg-[#0d1117] rounded border border-gray-800 flex items-center justify-center">
                <span className="text-gray-600 font-mono text-sm">Project Interface / Terminal Simulation Here</span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </section>


      <div className="h-64"></div>
    </div>
  )
}

export default App
