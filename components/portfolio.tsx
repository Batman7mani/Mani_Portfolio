'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Camera, Mail, Phone } from 'lucide-react'
import { profile, projects, skills } from '@/lib/portfolio-data'
import { experiences } from '@/lib/experience-data'
import { HeroScene, IntroCurtain, PixelBye } from '@/components/motion-layer'

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
        <div className="project-list">{projects.map((project) => <Reveal key={project.slug}><Link href={`/projects/${project.slug}`} className={`project-row ${project.color}`}><div className="project-image"><img src={project.image} alt={project.imageAlt} loading="lazy" /></div><span className="project-number">{project.index}</span><div className="project-row-copy"><p className="eyebrow">{project.eyebrow}</p><h3 className="cursor-highlight">{project.title}</h3><p className="project-summary">{project.summary}</p><div className="project-metrics">{project.metrics.slice(0, 2).map((metric) => <span key={metric}>{metric}</span>)}</div></div><ArrowUpRight className="project-arrow" size={28} /></Link></Reveal>)}</div>
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

export function ProjectDetail({ slug }: { slug: string }) {
  const project = projects.find((item) => item.slug === slug)
  const [detailTab, setDetailTab] = useState<'overview' | 'stack' | 'process'>('overview')
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null)
  const [pointer, setPointer] = useState({ x: 50, y: 50 })
  if (!project) return null
  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPointer({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 })
  }
  const languages = project.languages ?? project.stack.map((name, index) => ({ name, percent: [62, 21, 11, 6][index] ?? 5, lines: `${Math.round(1200 / (index + 1))} lines`, color: ['#ff4f9a', '#18d9e8', '#b4ff39', '#f5cf3e'][index] ?? '#f5cf3e' }))
  const process = project.process ?? [{ step: '01', title: 'Find the friction', detail: 'Understand who this is for and what should feel easier.' }, { step: '02', title: 'Shape the system', detail: 'Turn the idea into an interface with rhythm, hierarchy, and intent.' }, { step: '03', title: 'Make it click', detail: 'Polish the details until the experience feels inevitable.' }]
  const currentIndex = projects.findIndex((item) => item.slug === project.slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]
  return <main className="project-detail" onPointerMove={handlePointerMove} onClick={(event) => { const target = event.target as HTMLElement; if (target.closest('a,button')) return; const audio = document.querySelector<HTMLAudioElement>('#project-soundtrack'); audio?.play().catch(() => undefined) }} style={{ '--pointer-x': `${pointer.x}%`, '--pointer-y': `${pointer.y}%` } as React.CSSProperties}><ScrollCursor /><header className="site-header detail-header"><Link href="/" className="wordmark">M/MC<span>.</span></Link><div className="detail-header-meta"><span>Case study / {project.index}</span><Link href="/" className="back-link">Close project ×</Link></div></header><section className={`detail-hero ${project.color} section-pad`}><div className="detail-hero-grid"><div className="detail-hero-copy"><p className="eyebrow">Selected project / {project.eyebrow}</p><h1>{project.title}</h1><p className="detail-summary">{project.summary}</p><div className="detail-hero-actions"><a href={project.url} target="_blank" rel="noreferrer">Open live site <ArrowUpRight size={18} /></a><a href={project.github ?? 'https://github.com/Batman7mani'} target="_blank" rel="noreferrer">View source <ArrowUpRight size={18} /></a></div></div><div className="detail-visual-wrap"><div className="detail-visual"><img src={project.image} alt={project.imageAlt} /></div><span className="detail-orbit-label">Move your cursor<br />through the project</span></div></div><div className="detail-hero-footer"><span>{project.index} — {project.title}</span><span>Scroll to explore ↓</span><span>Designed + developed by Mettu Mani</span></div></section><section className="detail-intro section-pad"><p className="eyebrow">01 / The brief</p><p className="detail-lede">{project.description}</p><div className="detail-intro-note"><span>Built for</span><strong>{project.audience ?? 'People who value clear, thoughtful digital experiences.'}</strong></div></section><section className="detail-explorer section-pad"><div className="detail-scroll-label"><span>02 / Inside the build</span><span>Scroll to reveal ↓</span></div><audio id="project-soundtrack" src="/penguinmusic-future-abstract.mp3" preload="none" loop aria-label="Project soundtrack" /><Link className="next-project" href={`/projects/${nextProject.slug}`}><span>Next project / {nextProject.index}</span><strong>{nextProject.title}</strong><span className="next-project-arrow">↘</span></Link><div className="detail-tabs detail-tabs-hidden" role="tablist" aria-label="Project details">{(['overview', 'stack', 'process'] as const).map((tab) => <button key={tab} role="tab" aria-selected={detailTab === tab} className={detailTab === tab ? 'is-active' : ''} onClick={() => setDetailTab(tab)}>{tab}</button>)}</div>{<div className="detail-content"><div className="detail-built"><p className="eyebrow">Built for</p><p className="detail-audience">{project.audience ?? 'People who value clear, thoughtful digital experiences.'}</p></div><div className="detail-side"><p className="eyebrow metrics-label">Impact</p>{project.metrics.map((metric) => <strong key={metric}>{metric}</strong>)}</div></div>}{<div className="detail-stack"><div className="detail-ring"><span>{languages.reduce((total, language) => total + Number.parseInt(language.lines), 0)}<small> lines of code</small></span></div><div className="detail-language-list">{languages.map((language) => <div className={`detail-language-row ${activeLanguage === language.name ? 'is-active' : ''}`} key={language.name} onMouseEnter={() => setActiveLanguage(language.name)} onMouseLeave={() => setActiveLanguage(null)}><i style={{ background: language.color }} /><strong>{language.name}</strong><span>{language.lines}</span><b>{language.percent}%</b><em style={{ width: `${language.percent}%`, background: language.color }} /></div>)}</div></div>}{<div className="detail-timeline"><CurvedProcess items={process} /></div>}</section><section className="detail-proof section-pad"><p className="eyebrow">What mattered</p><div className="detail-proof-grid">{project.metrics.map((metric, index) => <div className="proof-item" key={metric}><span>0{index + 1}</span><strong>{metric}</strong><p>{index === 0 ? 'A clear path through the product, without asking the audience to work for it.' : index === 1 ? 'The interface gives the central idea room to become useful, memorable, and immediate.' : 'Designed to leave a measurable impression long after the first interaction.'}</p></div>)}</div></section><footer className="detail-footer section-pad"><Link href="/">← All projects</Link><div className="detail-footer-actions"><a href={project.url} target="_blank" rel="noreferrer">Open project site <ArrowUpRight size={18} /></a><a href={profile.github} target="_blank" rel="noreferrer">More on GitHub <ArrowUpRight size={18} /></a></div></footer></main>
}
