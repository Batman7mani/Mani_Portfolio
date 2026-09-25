'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Camera, Mail, Phone } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile, projects, skills } from '@/lib/portfolio-data'
import { experiences } from '@/lib/experience-data'
import { HeroScene, IntroCurtain, PixelBye } from '@/components/motion-layer'

gsap.registerPlugin(ScrollTrigger)

function canAnimateProjectCard() {
  const navigatorWithHints = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(pointer: fine)').matches &&
    !(navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) &&
    !(navigatorWithHints.deviceMemory !== undefined && navigatorWithHints.deviceMemory <= 4) &&
    navigatorWithHints.connection?.saveData !== true &&
    !window.matchMedia('(update: slow)').matches
}

function ProjectPreviewCard({ project }: { project: (typeof projects)[number] }) {
  const cardRef = useRef<HTMLAnchorElement>(null)

  useLayoutEffect(() => {
    const card = cardRef.current
    if (!card || !canAnimateProjectCard()) return
    const image = card.querySelector<HTMLElement>('.project-image img')
    const copy = card.querySelector<HTMLElement>('.project-row-copy')
    if (!image) return
    const context = gsap.context(() => {
      const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' })
      const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' })
      const imageX = gsap.quickTo(image, 'xPercent', { duration: 0.65, ease: 'power3.out' })
      const imageY = gsap.quickTo(image, 'yPercent', { duration: 0.65, ease: 'power3.out' })
      const copyZ = copy ? gsap.quickTo(copy, 'z', { duration: 0.6, ease: 'power3.out' }) : null
      const handleMove = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return
        const rect = card.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        rotateX(y * -7)
        rotateY(x * 8)
        imageX(x * 4)
        imageY(y * 4)
        copyZ?.(14)
      }
      const handleLeave = () => {
        rotateX(0)
        rotateY(0)
        imageX(0)
        imageY(0)
        copyZ?.(0)
      }
      card.addEventListener('pointermove', handleMove, { passive: true })
      card.addEventListener('pointerleave', handleLeave, { passive: true })
      gsap.to(image, {
        yPercent: -8,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.1 },
      })
      return () => {
        card.removeEventListener('pointermove', handleMove)
        card.removeEventListener('pointerleave', handleLeave)
      }
    }, cardRef)
    return () => context.revert()
  }, [])

  return <Link ref={cardRef} href={`/projects/${project.slug}`} className={`project-row ${project.color}`}><div className="project-image"><img src={project.image} alt={project.imageAlt} loading="lazy" /></div><span className="project-number">{project.index}</span><div className="project-row-copy"><p className="eyebrow">{project.eyebrow}</p><h3 className="cursor-highlight">{project.title}</h3><p className="project-summary">{project.summary}</p><div className="project-metrics">{project.metrics.slice(0, 2).map((metric) => <span key={metric}>{metric}</span>)}</div></div><ArrowUpRight className="project-arrow" size={28} /></Link>
}

function CurvedProcess({ items }: { items: { step: string; title: string; detail: string }[] }) {
  const [progress, setProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const pathLength = 1100

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const travel = window.innerHeight * 0.72
      setProgress(Math.max(0, Math.min(1, (travel - rect.top) / (rect.height + travel - window.innerHeight))))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  return <div ref={sectionRef} className="curved-process" style={{ '--timeline-progress': progress } as React.CSSProperties}><svg className="curved-process-path" viewBox="0 0 900 420" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="timeline-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs><path className="curved-process-track" d="M40 60 C 250 60, 170 190, 390 190 S 540 320, 860 350" /><path className="curved-process-trace" pathLength="1100" d="M40 60 C 250 60, 170 190, 390 190 S 540 320, 860 350" markerEnd="url(#timeline-arrow)" style={{ strokeDashoffset: pathLength * (1 - progress) }} /></svg>{items.map((item, index) => { const active = progress >= index / items.length; return <article data-index={index} className={`curved-process-item curve-${index} ${active ? 'is-visible' : ''}`} key={item.step}><span className="curved-process-number">{item.step}</span><div><p className="eyebrow">Chapter {item.step}</p><h3>{item.title}</h3><p>{item.detail}</p></div></article> })}</div>
}

function ScrollCursor() {
  const [position, setPosition] = useState({ x: -80, y: -80 })
  const [progress, setProgress] = useState(0)
  const raf = useRef<number | null>(null)
  const target = useRef({ x: -80, y: -80 })

  useEffect(() => {
    const move = (event: MouseEvent) => { target.current = { x: event.clientX, y: event.clientY } }
    const scroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    const animate = () => {
      setPosition((current) => ({ x: current.x + (target.current.x - current.x) * 0.16, y: current.y + (target.current.y - current.y) * 0.16 }))
      raf.current = requestAnimationFrame(animate)
    }
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('scroll', scroll, { passive: true })
    scroll(); animate()
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('scroll', scroll); if (raf.current) cancelAnimationFrame(raf.current) }
  }, [])

  const radius = 21
  const circumference = 2 * Math.PI * radius
  return <div className="global-cursor" style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }} aria-hidden="true"><svg viewBox="0 0 52 52"><circle className="global-cursor-track" cx="26" cy="26" r={radius} /><circle className="global-cursor-progress" cx="26" cy="26" r={radius} style={{ strokeDasharray: circumference, strokeDashoffset: circumference * (1 - progress) }} /></svg><span /></div>
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.14 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</div>
}

const hobbyCards = [
  { name: 'Visual design', tag: '01 / Make', description: 'Turning rough ideas into clear, tactile interfaces.', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=520&q=80', position: 'hobby-card-design' },
  { name: 'Running', tag: '02 / Move', description: 'Finding rhythm, focus, and better ideas in motion.', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=520&q=80', position: 'hobby-card-running' },
  { name: 'Chess', tag: '03 / Think', description: 'A quiet exercise in patience, patterns, and strategy.', image: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=520&q=80', position: 'hobby-card-chess' },
  { name: 'Movies', tag: '04 / Reset', description: 'Stories, scenes, and soundtracks for slow evenings.', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=520&q=80', position: 'hobby-card-movies' },
  { name: 'Coffee', tag: '05 / Refuel', description: 'The small ritual behind long, curious sessions.', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=520&q=80', position: 'hobby-card-coffee' },
] as const

export function Portfolio() {
  const [progress, setProgress] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max ? window.scrollY / max : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main>
      <ScrollCursor />
      <IntroCurtain />
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <section className="hero section-pad" id="top">
        <div className="hero-copy">
          <Reveal><p className="eyebrow">Hello, I&apos;m Mani <span className="status-dot" /> Chennai / India</p></Reveal>
          <Reveal className="delay-1"><h1 className="cursor-highlight">Building digital<br /><em>systems</em> with intent.</h1></Reveal>
          <Reveal className="delay-2"><p className="hero-intro">Frontend engineer, cyber security student, and technical storyteller. I turn complex products into clear, tactile experiences.</p></Reveal>
          <Reveal className="delay-3"><a className="circle-link" href="/resume.pdf" target="_blank" rel="noreferrer" aria-label="Open resume PDF"><ArrowDownRight size={25} /></a><span className="circle-link-caption">Resume / HR</span></Reveal>
        </div>
        <div className="hero-art" onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setTilt({ x: ((event.clientY - rect.top) / rect.height - .5) * -12, y: ((event.clientX - rect.left) / rect.width - .5) * 12 }) }} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-label label-top">CSE / CYBER SECURITY</div>
          <div className="portrait-frame" style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
            <img src={profile.portrait} alt="Portrait of Mettu Mani Chandhan Sai" />
            <span className="portrait-index">01—03</span>
          </div>
          <div className="hero-hobbies" aria-label="Hobbies and interests">
            {hobbyCards.map((hobby) => <article className={`hero-hobby ${hobby.position}`} key={hobby.name} tabIndex={0}>
              <img src={hobby.image} alt="" />
              <div className="hero-hobby-copy"><span>{hobby.tag}</span><strong>{hobby.name}</strong><p>{hobby.description}</p></div>
            </article>)}
          </div>
          <div className="hero-label label-bottom">Scroll to explore ↘</div>
          <HeroScene />
          <div className="yellow-disc" />
        </div>
      </section>

      <div className="ticker" aria-hidden="true"><div>DESIGNING WITH CLARITY — BUILDING WITH CURIOSITY — SECURING WITH CARE —&nbsp;</div><div>DESIGNING WITH CLARITY — BUILDING WITH CURIOSITY — SECURING WITH CARE —&nbsp;</div></div>

      <section className="about section-pad" id="about">
        <Reveal><p className="eyebrow">01 / About me</p></Reveal>
        <div className="about-grid">
          <Reveal><h2>Technology should feel <span className="highlight">human.</span></h2></Reveal>
          <Reveal className="delay-1"><p className="body-copy">I&apos;m a Computer Science and Engineering student specialising in Cyber Security at Rajalakshmi Engineering College, with an 8.94 CGPA and a habit of asking one more question before writing one more line of code.</p><p className="body-copy muted">My sweet spot is the intersection of frontend craft, interaction design, and resilient systems.</p></Reveal>
        </div>
        <div className="stats-row"><div><strong>8.94</strong><span>CGPA / 10</span></div><div><strong>160+</strong><span>LeetCode problems</span></div><div><strong>20%</strong><span>faster page loads</span></div></div>
      </section>

      <div className="about-work-transition" aria-hidden="true">
        <span className="about-work-transition__line" />
        <span className="about-work-transition__label">From thinking to making</span>
        <span className="about-work-transition__line" />
      </div>

      <section className="work section-pad" id="work">
        <Reveal><div className="section-heading"><p className="eyebrow">02 / Selected work</p><span className="section-note">Click a project to enter →</span></div></Reveal>
        <div className="project-list">{projects.map((project) => <Reveal key={project.slug}><ProjectPreviewCard project={project} /></Reveal>)}</div>
      </section>

      <div className="work-experience-transition" aria-hidden="true">
        <span className="work-experience-transition__orbit" />
        <span className="work-experience-transition__label">Selected work / lived experience</span>
        <span className="work-experience-transition__arrow">↓</span>
      </div>

      <section className="experience section-pad">
        <Reveal><p className="eyebrow">03 / Experience</p><h2 className="cursor-highlight">Learning by making<br /><span className="highlight">things real.</span></h2></Reveal>
        <div className="timeline">{experiences.map((item, index) => <Link href={`/experience/${item.slug}`} className="timeline-row" key={item.slug} style={{ '--timeline-index': index } as React.CSSProperties}><div className="timeline-marker" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span></div><span className="timeline-date">{item.date}</span><div className="timeline-copy"><p className="timeline-kicker">{index === 0 ? 'Field notes / latest chapter' : 'Field notes / foundation'}</p><h3>{item.title}</h3><p>{item.company}</p><small>{item.detail}</small><div className="timeline-skills">{item.tools.slice(0, 3).map((tool) => <span key={tool}>{tool}</span>)}</div></div><ArrowUpRight className="timeline-arrow" size={22} aria-hidden="true" /></Link>)}</div>
      </section>

      <div className="experience-toolkit-transition" aria-hidden="true">
        <div className="experience-toolkit-transition__track"><span>TOOLS FOR THE NEXT IDEA</span><span>TOOLS FOR THE NEXT IDEA</span><span>TOOLS FOR THE NEXT IDEA</span></div>
        <div className="experience-toolkit-transition__marker">04</div>
      </div>

      <section className="skills section-pad"><Reveal><div className="section-heading"><p className="eyebrow">04 / Toolkit</p><p className="section-note">Always learning / never finished</p></div></Reveal><div className="skill-cloud">{skills.map((skill, index) => <span key={skill} className={index % 4 === 0 ? 'skill-accent' : ''}>{skill}</span>)}</div></section>

      <div className="toolkit-footer-transition" aria-hidden="true"><span>MAKE SOMETHING WORTH REMEMBERING</span></div>

      <section className="contact section-pad" id="contact"><div className="contact-main"><Reveal><p className="eyebrow">05 / Start a conversation</p><div className="contact-title-row"><h2>Have a good<br /><em>problem?</em></h2><PixelBye /></div><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={24} /></a></Reveal></div><div className="footer-links"><span>© 2026 Mettu Mani Chandhan Sai</span><div><a href={`tel:${profile.phone}`}><Phone size={15} /> WhatsApp <span>{profile.phone}</span></a><a href={`mailto:${profile.email}`}><Mail size={15} /> Email</a><a href={profile.instagram} target="_blank" rel="noreferrer"><Camera size={15} /> Instagram</a><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} /></a></div></div><Reveal className="footer-signature-reveal"><div className="footer-signature" aria-label="M slash MC portfolio mark"><span className="footer-signature-black">M</span><span className="footer-signature-yellow">M</span><span className="footer-signature-black">C</span></div></Reveal></section>

    </main>
  )
}
