import { useEffect, useRef, useState } from 'react'

const tracks = [
  { name: 'After Hours', beat: 300, notes: [45, 52, 57, 59, 48, 55, 60, 55, 43, 50, 55, 57, 45, 52, 57, 52] },
  { name: 'Warm Start', beat: 245, notes: [48, 55, 60, 64, 45, 52, 57, 60, 41, 48, 53, 57, 43, 50, 55, 59] },
  { name: 'Pit Exit', beat: 220, notes: [40, 52, 47, 52, 43, 55, 50, 55, 45, 57, 52, 57, 47, 59, 54, 59] },
]

function tone(context, note, volume, duration, type = 'sine') {
  const now = context.currentTime
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = type
  oscillator.frequency.value = 440 * 2 ** ((note - 69) / 12)
  gain.gain.setValueAtTime(.001, now)
  gain.gain.exponentialRampToValueAtTime(volume, now + .02)
  gain.gain.exponentialRampToValueAtTime(.001, now + duration)
  oscillator.connect(gain).connect(context.destination)
  oscillator.start(now)
  oscillator.stop(now + duration)
}

export function useSound() {
  const [enabled, setEnabled] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [index, setIndex] = useState(0)
  const [error, setError] = useState('')
  const audio = useRef(null)
  const track = tracks[index]
  useEffect(() => () => { audio.current?.close() }, [])
  useEffect(() => {
    if (!playing) return
    let step = 0
    function tick() {
      const context = audio.current
      const note = track.notes[step % track.notes.length]
      tone(context, note + 12, .055, .42, 'triangle')
      if (step % 4 === 0) tone(context, note - 12, .12, .8)
      step++
    }
    tick()
    const interval = setInterval(tick, track.beat)
    return () => clearInterval(interval)
  }, [playing, track])

  async function start() {
    try {
      audio.current ??= new AudioContext()
      await audio.current.resume()
      setError('')
      return true
    } catch {
      setError('Audio unavailable in this browser')
      return false
    }
  }
  function cue() {
    if (enabled && audio.current?.state === 'running') tone(audio.current, 78, .045, .14)
  }

  return {
    track: track.name, enabled, playing, error, cue,
    next: () => setIndex(value => (value + 1) % tracks.length),
    toggle: async () => {
      if (enabled) setEnabled(false)
      else if (await start()) {
        setEnabled(true)
        tone(audio.current, 74, .045, .18)
      }
    },
    play: async () => {
      if (playing) setPlaying(false)
      else if (await start()) setPlaying(true)
    },
  }
}
