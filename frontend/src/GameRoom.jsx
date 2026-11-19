import { useEffect, useRef, useState } from 'react'

const controller = import.meta.env.BASE_URL + 'models/xbox_elite.glb'
const minimumLoadTime = 1600
const maximumLoadTime = 6500
// Center of the A glyph on the supplied controller in glTF scene coordinates.
const aButtonPosition = '4.188m 0.322m 1.538m'
const menu = [
  ['about', 'person', 'About me'],
  ['projects', 'code', 'Projects'],
  ['contact', 'mail', 'Contact'],
]

function Symbol({ name }) {
  return <span className="material-symbols-outlined" aria-hidden="true">{name}</span>
}

export default function GameRoom({ phase, setPhase, day, switchMode, activate, sound, consoleModel }) {
  const model = useRef(null)
  const start = useRef(null)
  const prompt = useRef(null)
  const firstMenuItem = useRef(null)
  const pressTimer = useRef(null)
  const hotspotPointer = useRef(null)
  const [modelReady, setModelReady] = useState(false)
  const booting = phase === 'loading' || phase === 'controller' || phase === 'pressing'
  const entered = phase === 'menu'

  useEffect(() => {
    const node = model.current
    const started = performance.now()
    let advanceTimer
    function finish() {
      if (advanceTimer !== undefined) return
      const remaining = Math.max(0, minimumLoadTime - (performance.now() - started))
      advanceTimer = setTimeout(() => setPhase(previous => previous === 'loading' ? 'controller' : previous), remaining)
    }
    function loaded() {
      setModelReady(true)
      finish()
    }
    node.addEventListener('load', loaded)
    node.addEventListener('error', finish)
    if (node.loaded) loaded()
    const deadline = setTimeout(finish, maximumLoadTime)
    return () => {
      clearTimeout(deadline)
      clearTimeout(advanceTimer)
      clearTimeout(pressTimer.current)
      node.removeEventListener('load', loaded)
      node.removeEventListener('error', finish)
    }
  }, [setPhase])

  useEffect(() => {
    if (phase === 'controller') prompt.current?.focus({ preventScroll: true })
    if (phase === 'start') start.current?.focus({ preventScroll: true })
    if (phase === 'menu' && !document.querySelector('dialog[open]')) {
      firstMenuItem.current?.focus({ preventScroll: true })
    }
  }, [phase])

  function powerOn() {
    if (phase !== 'controller' || pressTimer.current !== null) return
    sound.cue()
    setPhase('pressing')
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 560
    pressTimer.current = setTimeout(() => {
      pressTimer.current = null
      setPhase('start')
    }, duration)
  }

  useEffect(() => {
    if (phase !== 'controller') return
    function pressA(event) {
      if (event.key.toLowerCase() === 'a' && !event.altKey && !event.ctrlKey && !event.metaKey && !event.repeat) {
        prompt.current?.click()
      }
    }
    window.addEventListener('keydown', pressA)
    return () => window.removeEventListener('keydown', pressA)
  }, [phase])

  return <>
    <section className={`boot-scene boot-${phase}`} hidden={!booting} aria-label="Controller boot sequence">
      <div className="boot-grid" aria-hidden="true" />
      <div className="boot-ring" aria-hidden="true" />
      <div className="boot-brand"><Symbol name="stadia_controller" /> PHILEMON<span>.DEV</span></div>
      <div className={`floating-controller ${modelReady ? 'model-ready' : ''}`}>
        <model-viewer ref={model} aria-label="Xbox Elite controller. Drag to rotate." tabindex="-1" src={controller} loading="eager"
          camera-controls={phase === 'controller' ? '' : undefined} disable-zoom disable-pan touch-action="pan-y"
          interaction-prompt="none" camera-orbit="0deg 87deg auto" field-of-view="33deg"
          environment-image="neutral" exposure="1.45">
          <button slot="hotspot-a-button" data-position={aButtonPosition} data-normal="0 0 1" data-visibility-attribute="visible"
            className="controller-hotspot" aria-label="Press the controller A button" disabled={phase !== 'controller'}
            onPointerDown={event => { hotspotPointer.current = { x: event.clientX, y: event.clientY, dragged: false } }}
            onPointerMove={event => {
              const pointer = hotspotPointer.current
              if (pointer && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 6) pointer.dragged = true
            }}
            onClick={event => {
              const dragged = hotspotPointer.current?.dragged
              hotspotPointer.current = null
              if (!event.detail || !dragged) powerOn()
            }}
          />
        </model-viewer>
        <span className="boot-fallback" aria-hidden="true"><Symbol name="sports_esports" /></span>
      </div>
      {phase === 'loading' ? <div className="boot-status" role="status">
        <h1>Loading the setup</h1>
        <progress aria-label="Loading controller model" />
      </div> : <div className="boot-status">
        <h1>Power on</h1>
        <p>{modelReady ? "Drag to rotate. Select the highlighted A button or press A to wake the TV." : "Press A to wake the TV."}</p>
        <button ref={prompt} className="power-key" disabled={phase === 'pressing'} onClick={powerOn}>
          <span className="a-key" aria-hidden="true">A</span> Press A
        </button>
      </div>}
    </section>

    {!booting && <section className="game-room" aria-label="Portfolio room">
      <div className="room-top"><span><i /> {entered ? 'PORTFOLIO ROOM' : 'SYSTEM ONLINE'}</span><span>{day ? 'DAY MODE' : 'NIGHT MODE'}</span></div>
      <div className="room-window" aria-hidden="true"><span /></div>
      <div className="room-desk" aria-hidden="true" />
      <div className="room-tv">
        <div className={`tv-display ${entered ? 'tv-menu' : 'tv-start'}`}>
          <div className="tv-content">
            {entered ? <>
              <p className="tv-label">DEVELOPER PORTFOLIO</p>
              <h1>Philemon <em>Muleya.</em></h1>
              <p className="tv-description">Aspiring software engineer</p>
              <div className="tv-options" aria-label="TV menu">
                {menu.map(([id, icon, label], index) => <button key={id} ref={index === 0 ? firstMenuItem : undefined} onClick={() => activate(id)}>
                  <Symbol name={icon} /><span>{label}</span>
                </button>)}
              </div>
            </> : <>
              <p className="tv-label">PHILEMON.DEV</p>
              <h1>Press start<span>.</span></h1>
              <button className="primary start-game" ref={start} onClick={() => { sound.cue(); setPhase('menu') }}>
                <Symbol name="play_arrow" /> Start Game
              </button>
            </>}
          </div>
        </div>
        <div className="tv-bezel" aria-hidden="true"><i /></div>
      </div>

      {entered && <div className="desk-props" aria-label="Interactive desk objects">
        <button className="desk-prop trophy" onClick={() => activate('pit')}><span className="prop-object"><Symbol name="emoji_events" /></span><span>Pit lane</span></button>
        <button className="desk-prop map" onClick={() => activate('map')}><span className="prop-object"><Symbol name="map" /></span><span>Map</span></button>
        <button className="desk-prop camera" onClick={() => activate('gallery')}><span className="prop-object"><Symbol name="photo_camera" /></span><span>Memory wall</span></button>
        <button className="desk-prop radio" onClick={sound.play} aria-pressed={sound.playing}><span className="prop-object"><Symbol name="radio" /></span><span>Studio radio</span></button>
        <button className="desk-prop lamp" onClick={switchMode} aria-pressed={day}><span className="prop-object"><Symbol name="desk_lamp" /></span><span>Lighting</span></button>
      </div>}
      {entered && <div className="room-console">{consoleModel}</div>}
    </section>}
  </>
}
