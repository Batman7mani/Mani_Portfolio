'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, MoveDownRight } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { getProject, projects, profile, type Project } from '@/lib/portfolio-data'

gsap.registerPlugin(ScrollTrigger)

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
  const project = getProject(slug)
  const root = useRef<HTMLElement | null>(null)
  const [pointer, setPointer] = useState({ x: 50, y: 50 })
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
      const prefersNativeScroll = window.matchMedia('(pointer: coarse)').matches
      const navigatorWithHints = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
      const lowPowerDevice = prefersNativeScroll ||
        (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) ||
        (navigatorWithHints.deviceMemory !== undefined && navigatorWithHints.deviceMemory <= 4) ||
        navigatorWithHints.connection?.saveData === true ||
        window.matchMedia('(update: slow)').matches
      const fullMotion = !lowPowerDevice
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
    setPointer({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 })
  }

  return <main ref={root} className={`case-study case-study--${project.color}`} onPointerMove={handlePointerMove} style={{ '--pointer-x': `${pointer.x}%`, '--pointer-y': `${pointer.y}%` } as React.CSSProperties}>
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
    <footer className="case-study-next"><Link data-magnetic data-magnetic-strength="0.12" href={`/projects/${nextProject.slug}`}><span>Next project / {nextProject.index}</span><strong>{nextProject.title}</strong><ArrowUpRight size={24} /></Link><Link className="case-study-home" data-magnetic data-magnetic-strength="0.3" href="/">Back to all work</Link></footer>
  </main>
}
