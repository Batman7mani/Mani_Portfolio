'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type AudioChoice = 'audio' | 'silent'

type AudioApi = {
  enabled: boolean
  playCue: (kind: 'click' | 'whoosh') => void
}

const STORAGE_KEY = 'mani-portfolio-audio-choice'

function createCueEngine(context: AudioContext, master: GainNode) {
  const playClick = () => {
    const now = context.currentTime
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(620, now)
    oscillator.frequency.exponentialRampToValueAtTime(940, now + 0.055)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085)
    oscillator.connect(gain).connect(master)
    oscillator.start(now)
    oscillator.stop(now + 0.09)
  }

  const playWhoosh = () => {
    const now = context.currentTime
    const duration = 0.72
    const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let index = 0; index < data.length; index += 1) {
      const fade = 1 - index / data.length
      data[index] = (Math.random() * 2 - 1) * fade
    }
    const source = context.createBufferSource()
    const filter = context.createBiquadFilter()
    const gain = context.createGain()
    source.buffer = buffer
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(260, now)
    filter.frequency.exponentialRampToValueAtTime(2200, now + duration)
    filter.Q.value = 0.7
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.12)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    source.connect(filter).connect(gain).connect(master)
    source.start(now)
    source.stop(now + duration)
  }

  return { playClick, playWhoosh }
}

export function AudioExperience() {
  const [choice, setChoice] = useState<AudioChoice | null>(null)
  const [muted, setMuted] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const [entering, setEntering] = useState(false)
  const [scrubbing, setScrubbing] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const cueRef = useRef<AudioApi['playCue']>(() => undefined)
  const visualizerRef = useRef<HTMLCanvasElement>(null)
  const gateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as AudioChoice | null
    if (saved === 'audio' || saved === 'silent') {
      setChoice(saved)
      setMuted(saved === 'silent')
    }
  }, [])

  const enableAudio = async (nextChoice: AudioChoice) => {
    setChoice(nextChoice)
    setMuted(nextChoice === 'silent')
    window.localStorage.setItem(STORAGE_KEY, nextChoice)
    if (nextChoice === 'silent') return
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextConstructor) return
    const context = contextRef.current ?? new AudioContextConstructor()
    const master = masterRef.current ?? context.createGain()
    master.gain.value = 0.8
    if (!masterRef.current) master.connect(context.destination)
    contextRef.current = context
    masterRef.current = master
    if (audioRef.current && !sourceRef.current) {
      const source = context.createMediaElementSource(audioRef.current)
      const analyser = context.createAnalyser()
      analyser.fftSize = 128
      analyser.smoothingTimeConstant = 0.82
      source.connect(analyser).connect(context.destination)
      sourceRef.current = source
      analyserRef.current = analyser
    }
    setAudioReady(true)
    cueRef.current = (kind) => {
      if (context.state === 'suspended') void context.resume()
      const engine = createCueEngine(context, master)
      if (kind === 'click') engine.playClick()
      else engine.playWhoosh()
    }
    await context.resume()
    if (audioRef.current) {
      audioRef.current.volume = 0.32
      await audioRef.current.play().catch(() => undefined)
    }
  }

  useEffect(() => {
    if (choice !== 'audio') return
    let lastCue = 0
    const handleUnlock = () => { void enableAudio('audio') }
    const handlePointer = (event: PointerEvent) => {
      const now = performance.now()
      if (event.pointerType !== 'touch' && Math.abs(event.movementX) + Math.abs(event.movementY) > 12 && now - lastCue > 180) {
        lastCue = now
        cueRef.current('click')
      }
    }
    const handleTransition = () => cueRef.current('whoosh')
    window.addEventListener('pointerdown', handleUnlock, { once: true, passive: true })
    window.addEventListener('keydown', handleUnlock, { once: true })
    window.addEventListener('pointermove', handlePointer, { passive: true })
    window.addEventListener('project-transition-start', handleTransition)
    return () => {
      window.removeEventListener('pointermove', handlePointer)
      window.removeEventListener('project-transition-start', handleTransition)
      window.removeEventListener('pointerdown', handleUnlock)
      window.removeEventListener('keydown', handleUnlock)
    }
  }, [choice])

  useEffect(() => {
    const canvas = visualizerRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser || choice !== 'audio') return
    const context = canvas.getContext('2d')
    if (!context) return
    const values = new Uint8Array(analyser.frequencyBinCount)
    let frame = 0
    let lastFrame = 0
    const draw = (time: number) => {
      if (time - lastFrame < 33) {
        frame = requestAnimationFrame(draw)
        return
      }
      lastFrame = time
      analyser.getByteFrequencyData(values)
      const width = canvas.clientWidth * window.devicePixelRatio
      const height = canvas.clientHeight * window.devicePixelRatio
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      context.clearRect(0, 0, width, height)
      const bars = 32
      const gap = 2 * window.devicePixelRatio
      const barWidth = (width - gap * (bars - 1)) / bars
      for (let index = 0; index < bars; index += 1) {
        const value = values[Math.floor(index * values.length / bars)] / 255
        const barHeight = Math.max(2, value * height * 0.9)
        context.fillStyle = `rgba(255, 221, 62, ${0.28 + value * 0.72})`
        context.fillRect(index * (barWidth + gap), height - barHeight, barWidth, barHeight)
      }
      if (audioRef.current && Number.isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
        const progress = audioRef.current.currentTime / audioRef.current.duration
        context.fillStyle = 'rgba(255, 253, 248, .92)'
        context.fillRect(Math.max(0, Math.min(width - 1, progress * width)), 0, window.devicePixelRatio, height)
      }
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [choice, muted, audioReady])

  const toggleAudio = async () => {
    if (muted) {
      await enableAudio('audio')
    } else {
      setMuted(true)
      window.localStorage.setItem(STORAGE_KEY, 'silent')
      audioRef.current?.pause()
    }
  }

  const beginEntry = async (nextChoice: AudioChoice) => {
    await enableAudio(nextChoice)
    setEntering(true)
    if (gateRef.current) {
      gsap.timeline({ onComplete: () => setEntering(false) })
        .to(gateRef.current, { backgroundColor: 'transparent', duration: 0.35, ease: 'power2.inOut' })
        .to(gateRef.current.querySelector('.audio-gate__panel'), { yPercent: -9, scale: 1.04, autoAlpha: 0, duration: 0.72, ease: 'power4.inOut' }, 0.08)
        .to(gateRef.current, { autoAlpha: 0, duration: 0.45, ease: 'power2.out' }, 0.5)
    }
  }

  const seekFromPointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const audio = audioRef.current
    const canvas = visualizerRef.current
    if (!audio || !canvas || !Number.isFinite(audio.duration) || audio.duration <= 0) return
    const rect = canvas.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * audio.duration
  }

  return <>
    <audio ref={audioRef} src="/sounddelicious-portfolio-harmony-221983.mp3" loop preload="metadata" aria-hidden="true" />
    {(choice === null || entering) && <div ref={gateRef} className={`audio-gate ${entering ? 'is-entering' : ''}`} role="dialog" aria-modal="true" aria-labelledby="audio-gate-title"><div className="audio-gate__panel"><span className="audio-gate__eyebrow">M/MC<span>.</span> / An interactive portfolio / 2026</span><h2 id="audio-gate-title">Enter with<br /><em>sound?</em></h2><p>A subtle score, clicks, and transition whooshes shape the experience. You can change this anytime.</p><div className="audio-gate__actions"><button type="button" onClick={() => void beginEntry('audio')}>Enter with audio <span>↘</span></button><button type="button" onClick={() => void beginEntry('silent')}>Enter silently <span>→</span></button></div><small>Your choice is saved on this device.</small></div></div>}
    {choice !== null && <><canvas ref={visualizerRef} className={`audio-visualizer ${muted ? 'is-muted' : ''} ${scrubbing ? 'is-scrubbing' : ''}`} onPointerDown={(event) => { setScrubbing(true); event.currentTarget.setPointerCapture(event.pointerId); seekFromPointer(event) }} onPointerMove={(event) => { if (scrubbing) seekFromPointer(event) }} onPointerUp={() => setScrubbing(false)} onPointerCancel={() => setScrubbing(false)} onKeyDown={(event) => { const audio = audioRef.current; if (!audio || !Number.isFinite(audio.duration)) return; if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + (event.key === 'ArrowRight' ? 5 : -5))) } }} aria-label="Drag to scrub through the portfolio soundtrack" role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} /><button type="button" className={`audio-toggle ${muted ? 'is-muted' : ''}`} onClick={() => void toggleAudio()} aria-label={muted ? 'Turn portfolio audio on' : 'Mute portfolio audio'}>{muted ? 'Audio off' : 'Audio on'} <span aria-hidden="true">{muted ? '×' : '◌'}</span></button></>}
  </>
}
