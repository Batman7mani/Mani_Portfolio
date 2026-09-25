'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, MoveDownRight } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { getProject, projects, profile, type Project } from '@/lib/portfolio-data'

gsap.registerPlugin(ScrollTrigger, Flip)

type Language = { name: string; percent: number; lines: string; color: string }

const fallbackLanguages: Language[] = [
  { name: 'JavaScript', percent: 58, lines: '1,248', color: '#f5cf3e' },
  { name: 'CSS', percent: 24, lines: '516', color: '#18d9e8' },
  { name: 'HTML', percent: 12, lines: '268', color: '#ff4f9a' },
  { name: 'Other', percent: 6, lines: '134', color: '#b4ff39' },
]

function detailLanguages(project: Project): Language[] {
  return project.languages?.map((language) => ({
    ...language,
    lines: language.lines.replace(/ lines?$/i, ''),
  })) ?? fallbackLanguages
}

function hasFullMotionBudget() {
  const navigatorWithHints = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !window.matchMedia('(pointer: coarse)').matches &&
    !(navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) &&
    !(navigatorWithHints.deviceMemory !== undefined && navigatorWithHints.deviceMemory <= 4) &&
    navigatorWithHints.connection?.saveData !== true &&
    !window.matchMedia('(update: slow)').matches
}

function settleText(element: HTMLElement, finalText: string) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/—'
  let progress = 0
  const reveal = () => {
    progress += 1
    element.textContent = finalText.split('').map((character, index) => index < progress ? character : chars[Math.floor(Math.random() * chars.length)]).join('')
    if (progress < finalText.length) window.setTimeout(reveal, 34)
  }
  reveal()
}

function CinematicCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const cursor = cursorRef.current
    if (!cursor || !hasFullMotionBudget()) return
    const core = cursor.querySelector<HTMLElement>('[data-cursor-core]')
    const particles = gsap.utils.toArray<HTMLElement>('[data-cursor-particle]')
    if (!core || particles.length === 0) return
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.16, ease: 'power3.out' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.16, ease: 'power3.out' })
    const particleX = particles.map((particle, index) => gsap.quickTo(particle, 'x', { duration: 0.18 + index * 0.055, ease: 'power3.out' }))
    const particleY = particles.map((particle, index) => gsap.quickTo(particle, 'y', { duration: 0.18 + index * 0.055, ease: 'power3.out' }))
    const trailPoints = particles.map(() => ({ x: 0, y: 0 }))
    let lastPointer = { x: 0, y: 0 }
    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      xTo(event.clientX)
      yTo(event.clientY)
      const previousPointer = lastPointer
      particles.forEach((particle, index) => {
        const target = index === 0 ? previousPointer : trailPoints[index - 1]
        particleX[index](target.x - event.clientX)
        particleY[index](target.y - event.clientY)
        trailPoints[index] = { ...target }
      })
      lastPointer = { x: event.clientX, y: event.clientY }
      gsap.set(cursor, { autoAlpha: 1 })
    }
    const handleLeave = () => gsap.to(cursor, { autoAlpha: 0, duration: 0.2, overwrite: true })
    const handleTransition = (event: Event) => {
      const { x, y } = (event as CustomEvent<{ x: number; y: number }>).detail
      gsap.killTweensOf([cursor, core, ...particles])
      gsap.to(cursor, { x, y, scale: 1.6, autoAlpha: 1, duration: 0.25, ease: 'power3.out' })
      gsap.to(particles, {
        x: (index) => Math.cos(index * 0.9) * (34 + index * 8),
        y: (index) => Math.sin(index * 0.9) * (34 + index * 8),
        scale: 0.2,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.025,
        ease: 'power3.out',
      })
      gsap.to(core, { scale: 0, autoAlpha: 0, duration: 0.45, delay: 0.12, ease: 'power2.in' })
    }
    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerleave', handleLeave)
    window.addEventListener('project-transition-start', handleTransition)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerleave', handleLeave)
      window.removeEventListener('project-transition-start', handleTransition)
      gsap.killTweensOf([cursor, core, ...particles])
    }
  }, [])

  return <div ref={cursorRef} className="cinematic-cursor" aria-hidden="true"><span data-cursor-core className="cinematic-cursor__core" />{Array.from({ length: 7 }, (_, index) => <span data-cursor-particle key={index} className="cinematic-cursor__particle" />)}</div>
}

function DetailHeader({ project }: { project: Project }) {
  return (
    <header className="case-study-header">
      <Link className="wordmark" href="/" aria-label="Back to Mani portfolio">M/MC<span>.</span></Link>
      <div className="case-study-header__meta">
        <span>Project {project.index}</span>
        <Link className="case-study-close" href="/" data-magnetic><ArrowLeft size={15} /> Exit case study</Link>
      </div>
    </header>
  )
}

function ProjectFacts({ project }: { project: Project }) {
  const facts = [
    ['Client', project.audience ?? 'Independent brief'],
    ['Year', '2026'],
    ['Role', 'Design & development'],
    ['Industry', project.eyebrow.split(' / ')[0]],
    ['Services', project.stack.slice(0, 3).join(' · ')],
    ['Duration', 'Concept → shipped'],
    ['Team', 'Mani / solo practice'],
  ]

  return (
    <section className="case-study-facts" aria-labelledby="facts-title">
      <div className="case-study-section-label"><span id="facts-title">Project information</span><span>02 / 05</span></div>
      <div className="case-study-facts__grid">
        {facts.map(([label, value]) => <div className="case-study-fact" data-case-stagger key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
    </section>
  )
}

function LanguageComposition({ project }: { project: Project }) {
  const languages = detailLanguages(project)
  const [active, setActive] = useState<string | null>(null)
  const total = languages.reduce((sum, language) => sum + Number(language.lines.replace(/,/g, '')), 0)

  return (
    <section className="case-study-code" aria-labelledby="code-title">
      <div className="case-study-section-label"><span id="code-title">Code composition</span><span>03 / 05</span></div>
      <div className="case-study-code__intro">
        <h2>Built in<br /><em>layers.</em></h2>
        <p>Approximate source distribution from the working build. The shape of the stack follows the shape of the experience: expressive on the surface, deliberate underneath.</p>
      </div>
      <div className="case-study-code__visual">
        <div className="case-study-code__total"><strong>{total.toLocaleString()}</strong><span>lines of code<br />across the build</span></div>
        <div className="case-study-language-list">
          {languages.map((language) => <div className={`case-study-language ${active === language.name ? 'is-active' : ''}`} data-case-stagger key={language.name} onMouseEnter={() => setActive(language.name)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(language.name)} onBlur={() => setActive(null)} tabIndex={0} style={{ '--language-color': language.color, '--language-width': `${language.percent}%` } as React.CSSProperties}>
            <i aria-hidden="true" /><strong>{language.name}</strong><span>{language.lines} lines</span><b>{language.percent}%</b><em aria-hidden="true" />
          </div>)}
        </div>
      </div>
    </section>
  )
}

function ProcessSection({ project }: { project: Project }) {
  const process = project.process ?? [
    { step: '01', title: 'Find the friction', detail: 'Understand who this is for and what should feel easier.' },
    { step: '02', title: 'Shape the system', detail: 'Turn the idea into an interface with rhythm, hierarchy, and intent.' },
    { step: '03', title: 'Make it click', detail: 'Polish the details until the experience feels inevitable.' },
  ]

  return <section className="case-study-process" aria-labelledby="process-title"><div className="case-study-section-label"><span id="process-title">Working process</span><span>04 / 05</span></div><div className="case-study-process__grid">{process.map((item) => <article data-case-stagger key={item.step}><span>{item.step}</span><h3>{item.title}</h3><p>{item.detail}</p></article>)}</div></section>
}

function TrailStatement({ text }: { text: string }) {
  const words = text.split(/\s+/)
  return <p className="case-study-statement__text" aria-label={text}><span aria-hidden="true">{words.map((word, index) => <span className="case-study-statement-word" key={`${word}-${index}`}>{word}{index < words.length - 1 ? ' ' : ''}</span>)}</span></p>
}

export function ProjectDetail({ slug }: { slug: string }) {
  const router = useRouter()
  const project = getProject(slug)
  const root = useRef<HTMLElement | null>(null)
  if (!project) return null
  const currentIndex = projects.findIndex((item) => item.slug === project.slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]

  useLayoutEffect(() => {
    if (!root.current) return
    const cleanups: (() => void)[] = []
    let lenis: Lenis | null = null
    const context = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return
      const fullMotion = hasFullMotionBudget()
      if (fullMotion) {
        lenis = new Lenis({
          autoRaf: false,
          lerp: 0.085,
          smoothWheel: true,
          syncTouch: false,
        })
        const tick = (time: number) => lenis?.raf(time * 1000)
        const updateScrollTrigger = () => ScrollTrigger.update()
        const handleVisibility = () => {
          if (document.hidden) {
            gsap.ticker.remove(tick)
            lenis?.stop()
          } else {
            lenis?.start()
            gsap.ticker.add(tick)
            ScrollTrigger.refresh()
          }
        }
        gsap.ticker.add(tick)
        lenis.on('scroll', updateScrollTrigger)
        document.addEventListener('visibilitychange', handleVisibility)
        cleanups.push(() => {
          gsap.ticker.remove(tick)
          lenis?.off('scroll', updateScrollTrigger)
          document.removeEventListener('visibilitychange', handleVisibility)
          lenis?.destroy()
          lenis = null
        })
      }
      gsap.from('[data-case-reveal]', { y: fullMotion ? 34 : 18, autoAlpha: 0, duration: fullMotion ? 0.9 : 0.45, stagger: fullMotion ? 0.07 : 0.03, ease: 'power3.out' })
      const hero = root.current?.querySelector<HTMLElement>('.case-study-hero')
      const heroCopy = root.current?.querySelector<HTMLElement>('.case-study-hero__copy')
      const heroVisual = root.current?.querySelector<HTMLElement>('.case-study-hero__visual')
      const heroFooter = root.current?.querySelector<HTMLElement>('.case-study-hero__footer')
      if (fullMotion && hero && heroCopy && heroVisual && heroFooter) {
        gsap.timeline({
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
        })
          .to(heroCopy, { yPercent: -18, autoAlpha: 0.18, ease: 'none' }, 0)
          .to(heroVisual, { yPercent: -8, rotate: -2, scale: 0.88, ease: 'none' }, 0)
          .to(heroFooter, { y: 18, autoAlpha: 0, ease: 'none' }, 0.12)
      }
      const media = root.current?.querySelector('[data-case-media]')
      if (fullMotion && media) gsap.to(media, { yPercent: -10, scale: 1.08, ease: 'none', scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: 1 } })
      const statement = root.current?.querySelector<HTMLElement>('.case-study-statement p')
      if (fullMotion && statement) {
        gsap.fromTo(statement, { xPercent: -5, autoAlpha: 0.25 }, { xPercent: 0, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: statement, start: 'top bottom', end: 'top 38%', scrub: 1 } })
        const words = gsap.utils.toArray<HTMLElement>('.case-study-statement-word')
        gsap.set(words, { color: 'var(--paper)' })
        gsap.to(words, { color: 'var(--case-accent)', stagger: 0.045, ease: 'none', scrollTrigger: { trigger: statement, start: 'top 76%', end: 'bottom 42%', scrub: 1 } })
      }
      if (fullMotion) {
        const flipClone = document.querySelector<HTMLElement>('[data-project-flip-clone]')
        const flipTitle = document.querySelector<HTMLElement>('[data-project-flip-title]')
        const destinationFrame = root.current?.querySelector<HTMLElement>('.case-study-image-frame')
        const destinationTitle = root.current?.querySelector<HTMLElement>('.case-study-hero h1')
        if (flipClone && destinationFrame) {
          const state = Flip.getState(flipClone)
          gsap.set(destinationFrame, { autoAlpha: 0 })
          const destinationRect = destinationFrame.getBoundingClientRect()
          const wash = document.querySelector<HTMLElement>('[data-project-flip-wash]')
          const titleState = flipTitle && destinationTitle ? Flip.getState(flipTitle) : null
          if (destinationTitle) gsap.set(destinationTitle, { autoAlpha: 0 })
          gsap.set(flipClone, { left: destinationRect.left, top: destinationRect.top, width: destinationRect.width, height: destinationRect.height, rotate: 0, borderRadius: 0 })
          if (flipTitle && destinationTitle) {
            const titleRect = destinationTitle.getBoundingClientRect()
            gsap.set(flipTitle, { left: titleRect.left, top: titleRect.top, width: titleRect.width, height: titleRect.height, fontSize: getComputedStyle(destinationTitle).fontSize, lineHeight: getComputedStyle(destinationTitle).lineHeight, rotate: 0 })
          }
          const flip = Flip.from(state, {
            absolute: true,
            duration: 1.05,
            ease: 'power4.inOut',
            paused: true,
          })
          gsap.timeline({ onComplete: () => {
            gsap.to(destinationFrame, { autoAlpha: 1, duration: 0.34, ease: 'power2.out' })
            if (destinationTitle) gsap.to(destinationTitle, { autoAlpha: 1, duration: 0.22, delay: 0.1 })
            gsap.from('[data-case-reveal]:not(h1)', { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.045, delay: 0.18, ease: 'power3.out' })
            root.current?.querySelectorAll<HTMLElement>('.case-study-hero__meta span').forEach((item) => settleText(item, item.textContent ?? ''))
            gsap.to(wash, { autoAlpha: 0, duration: 0.45, delay: 0.08, ease: 'power2.out', onComplete: () => wash?.remove() })
            flipClone.remove()
            flipTitle?.remove()
          } }).add(flip, 0).to(flipClone, { borderRadius: 0, duration: 1.05, ease: 'power3.inOut' }, 0).to(flipClone.querySelector('img'), { scale: 1.06, duration: 1.05, ease: 'power2.inOut' }, 0)
          if (flipTitle && titleState) Flip.from(titleState, { absolute: true, duration: 1.2, ease: 'power4.out', paused: false })
        }
        gsap.utils.toArray<HTMLElement>('[data-case-stagger]').forEach((element) => {
          gsap.from(element, { y: 28, autoAlpha: 0, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } })
        })
        gsap.utils.toArray<HTMLElement>('[data-case-section]').forEach((section) => {
          gsap.from(section, { y: 48, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 82%', once: true } })
        })
      }
      if (!fullMotion) return
      gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((element) => {
        const strength = Number(element.dataset.magneticStrength ?? 0.22)
        const xTo = gsap.quickTo(element, 'x', { duration: 0.35, ease: 'power3.out' })
        const yTo = gsap.quickTo(element, 'y', { duration: 0.35, ease: 'power3.out' })
        const rotateTo = gsap.quickTo(element, 'rotation', { duration: 0.45, ease: 'power3.out' })
        const handleMove = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect()
          const x = event.clientX - (rect.left + rect.width / 2)
          const y = event.clientY - (rect.top + rect.height / 2)
          xTo(x * strength)
          yTo(y * strength)
          rotateTo(Math.max(-3, Math.min(3, x / rect.width * 2)))
        }
        const handleLeave = () => {
          xTo(0)
          yTo(0)
          rotateTo(0)
        }
        element.addEventListener('pointermove', handleMove)
        element.addEventListener('pointerleave', handleLeave)
        cleanups.push(() => {
          element.removeEventListener('pointermove', handleMove)
          element.removeEventListener('pointerleave', handleLeave)
          gsap.killTweensOf(element)
        })
      })
    }, root)
    return () => {
      cleanups.forEach((cleanup) => cleanup())
      context.revert()
    }
  }, [project.slug])

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    root.current?.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width) * 100}%`)
    root.current?.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height) * 100}%`)
  }

  const handleNextProjectClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!hasFullMotionBudget()) return
    const frame = root.current?.querySelector<HTMLElement>('.case-study-image-frame')
    if (!frame) return
    event.preventDefault()
    const teaserImage = event.currentTarget.querySelector<HTMLElement>('[data-next-project-image]')
    const teaserTitle = event.currentTarget.querySelector<HTMLElement>('[data-next-project-title]')
    const rect = (teaserImage ?? frame).getBoundingClientRect()
    const clone = (teaserImage ?? frame).cloneNode(true) as HTMLElement
    const titleClone = teaserTitle?.cloneNode(true) as HTMLElement | undefined
    clone.removeAttribute('data-case-media')
    clone.setAttribute('data-project-flip-clone', '')
    Object.assign(clone.style, {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: '0',
      zIndex: '120',
      pointerEvents: 'none',
      transform: 'rotate(2deg)',
      borderRadius: '28px',
    })
    const wash = document.createElement('div')
    wash.setAttribute('data-project-flip-wash', '')
    wash.className = 'project-flip-wash'
    document.body.appendChild(clone)
    if (teaserImage) {
      const imageRect = teaserImage.getBoundingClientRect()
      Object.assign(clone.style, { left: `${imageRect.left}px`, top: `${imageRect.top}px`, width: `${imageRect.width}px`, height: `${imageRect.height}px`, transform: 'rotate(0deg)' })
    }
    if (titleClone && teaserTitle) {
      const titleRect = teaserTitle.getBoundingClientRect()
      titleClone.setAttribute('data-project-flip-title', '')
      Object.assign(titleClone.style, { position: 'fixed', left: `${titleRect.left}px`, top: `${titleRect.top}px`, width: `${titleRect.width}px`, height: `${titleRect.height}px`, margin: '0', zIndex: '121', pointerEvents: 'none' })
      document.body.appendChild(titleClone)
    }
    document.body.appendChild(wash)
    window.dispatchEvent(new CustomEvent('project-transition-start', { detail: { x: event.clientX, y: event.clientY } }))
    window.setTimeout(() => {
      document.querySelector('[data-project-flip-clone]')?.remove()
      document.querySelector('[data-project-flip-title]')?.remove()
      document.querySelector('[data-project-flip-wash]')?.remove()
    }, 2400)
    router.push(event.currentTarget.href)
  }

  return <main ref={root} className={`case-study case-study--${project.color}`} onPointerMove={handlePointerMove} style={{ '--pointer-x': '50%', '--pointer-y': '50%' } as React.CSSProperties}>
    <CinematicCursor />
    <DetailHeader project={project} />
    <section className="case-study-hero">
      <div className="case-study-hero__copy">
        <p className="case-study-kicker" data-case-reveal>{project.index} / Selected work</p>
        <h1 data-case-reveal>{project.title}</h1>
        <p className="case-study-hero__descriptor" data-case-reveal>{project.eyebrow}</p>
        <p className="case-study-hero__summary" data-case-reveal>{project.summary}</p>
        <div className="case-study-hero__meta" data-case-reveal><span>2026</span><span>Design + development</span><span>Mani / India</span></div>
      </div>
      <div className="case-study-hero__visual" data-case-reveal><div className="case-study-image-frame"><img data-case-media src={project.image} alt={project.imageAlt} /></div><span className="case-study-image-note">{project.title} / interface study</span><span className="case-study-hero__stamp">Scroll<br />to enter</span></div>
      <div className="case-study-hero__footer"><span>Case study / {project.index}</span><MoveDownRight size={17} /><span>Continuous interaction</span></div>
    </section>
    <section className="case-study-statement" data-case-section><div className="case-study-section-label"><span>Project statement</span><span>01 / 05</span></div><TrailStatement text={project.description} /></section>
    <ProjectFacts project={project} />
    <LanguageComposition project={project} />
    <ProcessSection project={project} />
    <section className="case-study-proof" data-case-section><p className="case-study-kicker">{project.title} / closing note</p><h2>Make the next<br /><em>interaction count.</em></h2><p>{project.description}</p><div className="case-study-actions"><a data-magnetic data-magnetic-strength="0.3" href={project.url} target="_blank" rel="noreferrer">Open live project <ArrowUpRight size={17} /></a><a data-magnetic data-magnetic-strength="0.3" href={project.github ?? profile.github} target="_blank" rel="noreferrer">View source <ArrowUpRight size={17} /></a></div></section>
    <footer className="case-study-next"><Link data-magnetic data-magnetic-strength="0.12" href={`/projects/${nextProject.slug}`} onClick={handleNextProjectClick}><span>Next project / {nextProject.index}</span><strong data-next-project-title>{nextProject.title}</strong><span className="case-study-next__image"><img data-next-project-image src={nextProject.image} alt="" /></span><ArrowUpRight size={24} /></Link><Link className="case-study-home" data-magnetic data-magnetic-strength="0.3" href="/">Back to all work</Link></footer>
  </main>
}
