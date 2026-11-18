import { useEffect, useRef, useState } from 'react'
import { certifications, education, profile, projects, skillCategories } from './data/portfolioData'
import { useSound } from './hooks/useSound'

const base = import.meta.env.BASE_URL
const tabs = { home: 'Home', projects: 'Projects', about: 'About', contact: 'Contact' }
const initialTiles = ['projects', 'pit', 'gallery', 'tools']
const tiles = {
  projects: ['code', 'Project library', 'Browse my builds', 'mint'],
  pit: ['sports_score', 'Pit lane', 'Test your reaction time', 'orange'],
  gallery: ['photo_library', 'Memory wall', 'Photos, GIFs and clips', 'purple'],
  tools: ['terminal', 'Dev toolkit', 'Languages and tools', 'blue'],
}
const panels = { ...tabs, pit: 'Pit lane', gallery: 'Memory wall', tools: 'Dev toolkit', credits: 'Model credits' }

function Icon({ name }) {
  return <span aria-hidden="true" className="material-symbols-outlined">{name}</span>
}

function readPanel() {
  const key = location.hash.slice(1)
  return Object.hasOwn(panels, key) ? key : 'home'
}

function readTiles() {
  try {
    const saved = JSON.parse(localStorage.getItem('portfolio-tiles'))
    if (Array.isArray(saved) && saved.length === initialTiles.length && initialTiles.every(id => saved.includes(id))) return saved
  } catch { /* Storage is optional. */ }
  return initialTiles
}

function Hardware({ type, label, model, icon, day, onActivate }) {
  const [status, setStatus] = useState('loading')
  const viewer = useRef(null)
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    const node = viewer.current
    const ready = () => setStatus('ready')
    const failed = () => setStatus('failed')
    node.addEventListener('load', ready)
    node.addEventListener('error', failed)
    if (node.loaded) ready()
    const timeout = setTimeout(() => {
      if (!customElements.get('model-viewer')) failed()
    }, 8000)
    return () => {
      clearTimeout(timeout)
      node.removeEventListener('load', ready)
      node.removeEventListener('error', failed)
    }
  }, [])
  return <button type="button" className={`hardware ${type} ${status}`} onClick={onActivate} onPointerEnter={() => setFocused(true)} onPointerLeave={() => setFocused(false)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
    <model-viewer ref={viewer} aria-hidden="true" tabindex="-1" src={base + 'models/' + model}
      interaction-prompt="none" camera-orbit={type === 'console' ? (focused ? '40deg 65deg auto' : '32deg 68deg auto') : (focused ? '0deg 66deg auto' : '12deg 72deg auto')}
      field-of-view="28deg" environment-image="neutral" exposure={day ? 1.8 : 1.3} shadow-intensity=".8" />
    <span className="model-placeholder"><Icon name={icon} /></span>
    <span className="hotspot"><span className="hotspot-dot" />{label}</span>
  </button>
}

function ReactionGame() {
  const [state, setState] = useState('idle')
  const [time, setTime] = useState(0)
  const [best, setBest] = useState(null)
  const timer = useRef(null)
  const started = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  function play() {
    if (state === 'waiting') {
      clearTimeout(timer.current)
      setState('early')
    } else if (state === 'go') {
      const elapsed = Math.round(performance.now() - started.current)
      setTime(elapsed)
      setBest(previous => previous === null ? elapsed : Math.min(previous, elapsed))
      setState('result')
    } else {
      setState('waiting')
      timer.current = setTimeout(() => {
        started.current = performance.now()
        setState('go')
      }, 1200 + Math.random() * 2600)
    }
  }
  const message = { idle: 'Start lap', waiting: 'Hold…', go: 'GO!', early: 'False start · Retry', result: time + ' ms · Race again' }
  return <div className="race">
    <p>Wait for the starting lights to go out, then press as fast as you can.</p>
    <div className={`race-lights ${state}`} aria-hidden="true">{[0,1,2,3,4].map(light => <i key={light} />)}</div>
    <button className="primary" onClick={play}><span aria-live="polite">{message[state]}</span></button>
    <p aria-live="polite">{best === null ? 'No laps recorded' : 'Session best · ' + best + ' ms'}</p>
  </div>
}

function MemoryWall() {
  const [media, setMedia] = useState([])
  const urls = useRef(new Set())
  useEffect(() => {
    const active = urls.current
    return () => { active.forEach(URL.revokeObjectURL); active.clear() }
  }, [])
  function add(event) {
    const selected = Array.from(event.target.files).filter(file => /^(image|video)\//.test(file.type))
    const items = selected.map(file => {
      const url = URL.createObjectURL(file)
      urls.current.add(url)
      return { url, name: file.name, video: file.type.startsWith('video/') }
    })
    setMedia(previous => [...previous, ...items])
    event.target.value = ''
  }
  return <>
    <p>Add photos, GIFs or clips to try out the memory wall. Files stay in this browser tab while the wall is open.</p>
    <label className="upload">Add media <input type="file" accept="image/*,video/*" multiple onChange={add} /></label>
    <div className="panel-grid">{media.map(item => <figure key={item.url}>
      {item.video ? <video src={item.url} controls aria-label={item.name} /> : <img src={item.url} alt={item.name} />}
      <figcaption>{item.name}</figcaption>
      <button className="quiet" onClick={() => {
        URL.revokeObjectURL(item.url)
        urls.current.delete(item.url)
        setMedia(previous => previous.filter(mediaItem => mediaItem !== item))
      }}>Remove</button>
    </figure>)}</div>
  </>
}

function ProjectCard({ project }) {
  const [media, setMedia] = useState(false)
  const [image, setImage] = useState(0)
  const images = project.imageUrl ?? []
  return <article className="project">
    <p className="eyebrow">{project.subtitle}</p>
    <h3>{project.title}</h3>
    <p>{project.description}</p>
    <ul className="tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
    <div className="project-actions">
      <a href={project.repo} target="_blank" rel="noreferrer">Repository</a>
      {(project.youtubeId || images.length > 0 || project.terminalLines) && <button className="quiet" aria-expanded={media} onClick={() => setMedia(!media)}>
        {media ? 'Hide preview' : 'Show preview'}
      </button>}
    </div>
    {media && project.youtubeId && <iframe title={project.title + ' demo'} src={'https://www.youtube-nocookie.com/embed/' + project.youtubeId} allowFullScreen />}
    {media && images.length > 0 && <div className="screenshots">
      <img src={images[image]} alt={project.title + ' screenshot ' + (image + 1)} />
      {images.length > 1 && <button className="quiet" onClick={() => setImage((image + 1) % images.length)}>Next screenshot ({image + 1}/{images.length})</button>}
    </div>}
    {media && project.terminalLines && <pre>{project.terminalLines.map(line => line.text).join('\n')}</pre>}
  </article>
}

function PanelContent({ panel }) {
  switch (panel) {
    case 'projects': return <div className="panel-grid">{projects.map(project => <ProjectCard key={project.id} project={project} />)}</div>
    case 'pit': return <ReactionGame />
    case 'gallery': return <MemoryWall />
    case 'tools': return <div className="panel-grid">{skillCategories.map(category => <article className="project" key={category.id}>
      <h3>{category.title}</h3><ul className="tags">{category.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
    </article>)}</div>
    case 'about': return <>
      <h3>{profile.name}</h3>
      <p>I’m an aspiring software engineer based in {profile.location}. My projects span full-stack web development, networking and developer infrastructure.</p>
      {education.map(item => <article className="project" key={item.id}>
        <h3>{item.institution}</h3><p>{item.degree} · {item.startYear}–{item.endYear}</p><p>{item.concentration}</p>
      </article>)}
      <p><a href={base + 'Resume.pdf'} target="_blank" rel="noreferrer">Résumé (PDF)</a></p>
      {certifications.map(item => <p key={item.id}><a href={item.credentialUrl} target="_blank" rel="noreferrer">{item.title} · {item.issuer}</a></p>)}
    </>
    case 'credits': return <div className="panel-grid">
      <article className="project">
        <h3><a href="https://sketchfab.com/3d-models/xbox-elite-d93405595eea48a483eb57ae10eceb20">Xbox Elite controller</a></h3>
        <p>By <a href="https://sketchfab.com/ENKI_360">ENKI 360°</a> · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></p>
      </article>
      <article className="project">
        <h3><a href="https://sketchfab.com/3d-models/xbox-series-x-console-e983b0e9ef984aa6934176e310b7f0f2">Xbox Series X console</a></h3>
        <p>By <a href="https://sketchfab.com/jordanger88">jordanger88</a> · <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a></p>
      </article>
    </div>
    case 'contact': return <>
      <p>Get in touch about software engineering roles, projects or collaborations.</p>
      <div className="contact-links">
        <a href={'mailto:' + profile.email}><Icon name="mail" /> {profile.email}</a>
        <a href={profile.github} target="_blank" rel="noreferrer"><Icon name="code" /> GitHub</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer"><Icon name="work" /> LinkedIn</a>
      </div>
    </>
    default: return null
  }
}

export default function App() {
  const [panel, setPanel] = useState(readPanel)
  const [day, setDay] = useState(false)
  const [order, setOrder] = useState(readTiles)
  const [dragging, setDragging] = useState(null)
  const [reordering, setReordering] = useState(false)
  const dialog = useRef(null)
  const sound = useSound()
  useEffect(() => {
    const sync = () => setPanel(readPanel())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  useEffect(() => {
    const node = dialog.current
    if (panel !== 'home' && !node.open) node.showModal()
    if (panel === 'home' && node.open) node.close()
  }, [panel])
  useEffect(() => {
    try { localStorage.setItem('portfolio-tiles', JSON.stringify(order)) } catch { /* Storage is optional. */ }
  }, [order])

  function activate(key) {
    sound.cue()
    location.hash = key
  }
  function switchMode() {
    sound.cue()
    setDay(value => !value)
  }
  function move(from, to) {
    setOrder(previous => {
      const next = [...previous]
      next.splice(next.indexOf(from), 1)
      next.splice(previous.indexOf(to), 0, from)
      return next
    })
  }
  function tilt(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--tilt-x', ((event.clientX - bounds.left) / bounds.width - .5) * 14 + 'px')
    event.currentTarget.style.setProperty('--tilt-y', ((event.clientY - bounds.top) / bounds.height - .5) * 10 + 'px')
  }

  return <div className={`site ${day ? 'day' : 'night'}`}>
    <header className="topbar shell">
      <a href="#home" className="brand"><span className="brand-icon"><Icon name="stadia_controller" /></span><span>PHILEMON<span className="brand-sub">.DEV</span></span></a>
      <nav aria-label="Main navigation">{Object.entries(tabs).map(([key, label]) => <a key={key} href={'#' + key}
        aria-current={key === panel ? 'page' : undefined} onClick={() => sound.cue()}>{label}</a>)}</nav>
      <div className="system">
        <button className="icon-button" aria-label={day ? 'Switch to night' : 'Switch to day'} onClick={switchMode}><Icon name={day ? 'light_mode' : 'dark_mode'} /></button>
        <button className="icon-button" aria-label="Sound" aria-pressed={sound.enabled} onClick={sound.toggle}><Icon name={sound.enabled ? 'volume_up' : 'volume_off'} /></button>
      </div>
    </header>

    <main className="shell">
      <section className="hero" aria-labelledby="hero-title">
        <div className="intro">
          <p className="eyebrow hero-label"><span className="signal" /> PLAYER 01 <span className="label-divider" /> DEVELOPER PORTFOLIO</p>
          <h1 id="hero-title">Philemon<br /><em>Muleya.</em></h1>
          <p className="hero-description">Aspiring software engineer. Into full-stack development, systems and games.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => activate('projects')}><Icon name="play_arrow" /> Explore projects</button>
            <button className="secondary" onClick={() => activate('about')}>About me</button>
          </div>
          <p className="location"><Icon name="location_on" /> {profile.location}</p>
        </div>
        <div className="stage" onPointerMove={tilt} onPointerLeave={event => {
          event.currentTarget.style.removeProperty('--tilt-x')
          event.currentTarget.style.removeProperty('--tilt-y')
        }}>
          <div className="stage-grid" aria-hidden="true" />
          <div className="stage-rings" aria-hidden="true" />
          <div className="stage-header"><span><i /> THE SETUP</span><span>{day ? 'DAY MODE' : 'NIGHT MODE'}</span></div>
          <div className="hardware-layer">
            <Hardware type="console" model="xbox_series_x_console.glb" icon="developer_board" day={day} label="Switch lighting" onActivate={switchMode} />
            <Hardware type="controller" model="xbox_elite.glb" icon="sports_esports" day={day} label="Open projects" onActivate={() => activate('projects')} />
          </div>
          <div className="stage-footer"><Icon name="touch_app" /> Select an object to interact</div>
        </div>
      </section>

      <section className="dashboard" aria-labelledby="dashboard-title">
        <div className="section-heading">
          <div><p className="eyebrow">QUICK ACCESS</p><h2 id="dashboard-title">The dashboard</h2></div>
          <button className="quiet reorder" aria-pressed={reordering} onClick={() => setReordering(!reordering)}>
            <Icon name="drag_indicator" /> {reordering ? 'Done' : 'Rearrange tiles'}
          </button>
        </div>
        <div className="tile-grid">{order.map((id, index) => {
          const [icon, title, subtitle, color] = tiles[id]
          return <article key={id} className={`tile ${color} ${dragging === id ? 'dragging' : ''}`}
            draggable onDragStart={event => { event.dataTransfer.setData('text/plain', id); event.dataTransfer.effectAllowed = 'move'; setDragging(id) }}
            onDragEnd={() => setDragging(null)} onDragOver={event => { if (dragging) event.preventDefault() }}
            onDrop={event => { event.preventDefault(); if (dragging && dragging !== id) move(dragging, id); setDragging(null) }}>
            <Icon name={icon} />
            <button className="tile-link" onClick={() => activate(id)}><strong>{title}</strong><span>{subtitle}</span></button>
            {reordering && <div className="tile-reorder">
              <button disabled={index === 0} aria-label={'Move ' + title + ' earlier'} onClick={() => move(id, order[index - 1])}><Icon name="chevron_left" /></button>
              <button disabled={index === order.length - 1} aria-label={'Move ' + title + ' later'} onClick={() => move(id, order[index + 1])}><Icon name="chevron_right" /></button>
            </div>}
          </article>
        })}</div>
      </section>

      <section className="music" aria-label="Music player">
        <div className="album"><Icon name="graphic_eq" /></div>
        <div className="track"><strong>{sound.track}</strong><span>{sound.error || 'Studio radio · Synth loops'}</span></div>
        <button className="icon-button music-play" aria-label={sound.playing ? 'Pause music' : 'Play music'} onClick={sound.play}>
          <Icon name={sound.playing ? 'pause' : 'play_arrow'} />
        </button>
        <button className="icon-button" aria-label="Next track" onClick={sound.next}><Icon name="skip_next" /></button>
        <div className={`equalizer ${sound.playing ? 'playing' : ''}`} aria-hidden="true">{[10, 18, 13, 23, 16, 9].map((height, index) =>
          <i key={index} style={{ height, animationDelay: index * -.12 + 's' }} />)}</div>
      </section>
    </main>

    <footer className="shell footer">
      <span>© {new Date().getFullYear()} {profile.name}</span>
      <div><a href={profile.github}>GitHub</a><a href={profile.linkedin}>LinkedIn</a><a href={base + 'Resume.pdf'}>Résumé</a><a href="#credits">Model credits</a></div>
    </footer>

    <dialog ref={dialog} className="panel" aria-labelledby="panel-title"
      onCancel={event => { event.preventDefault(); activate('home') }}
      onClick={event => { if (event.target === event.currentTarget) activate('home') }}>
      {panel !== 'home' && <div className="panel-inner" key={panel}>
        <header className="panel-header"><h2 id="panel-title">{panels[panel]}</h2><button className="icon-button" aria-label="Close panel" onClick={() => activate('home')}><Icon name="close" /></button></header>
        <PanelContent panel={panel} />
      </div>}
    </dialog>
  </div>
}
