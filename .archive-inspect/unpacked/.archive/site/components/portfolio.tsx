'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Menu, X } from 'lucide-react'
import { experience, profile, projects, skills } from '@/lib/portfolio-data'
import { experiences } from '@/lib/experience-data'
import { HeroScene, IntroCurtain, PixelBye } from '@/components/motion-layer'

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

export function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false)
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
      <IntroCurtain />
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <header className="site-header">
        <Link href="#top" className="wordmark" aria-label="Back to top">M/MC<span>.</span></Link>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Primary navigation">
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <section className="hero section-pad" id="top">
        <div className="hero-copy">
          <Reveal><p className="eyebrow">Hello, I&apos;m Mani <span className="status-dot" /> Chennai / India</p></Reveal>
          <Reveal className="delay-1"><h1>Building digital<br /><em>systems</em> with intent.</h1></Reveal>
          <Reveal className="delay-2"><p className="hero-intro">Frontend engineer, cyber security student, and technical storyteller. I turn complex products into clear, tactile experiences.</p></Reveal>
          <Reveal className="delay-3"><a className="circle-link" href="#work" aria-label="Explore selected work"><ArrowDownRight size={25} /></a></Reveal>
        </div>
        <div className="hero-art" onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setTilt({ x: ((event.clientY - rect.top) / rect.height - .5) * -12, y: ((event.clientX - rect.left) / rect.width - .5) * 12 }) }} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-label label-top">CSE / CYBER SECURITY</div>
          <div className="portrait-frame" style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
            <img src={profile.portrait} alt="Portrait of Mettu Mani Chandhan Sai" />
            <span className="portrait-index">01—03</span>
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
          <Reveal className="delay-1"><p className="body-copy">I&apos;m a Computer Science and Engineering student specialising in Cyber Security at Rajalakshmi Engineering College, with an 8.88 CGPA and a habit of asking one more question before writing one more line of code.</p><p className="body-copy muted">My sweet spot is the intersection of frontend craft, interaction design, and resilient systems.</p></Reveal>
        </div>
        <div className="stats-row"><div><strong>8.88</strong><span>CGPA / 10</span></div><div><strong>120+</strong><span>LeetCode problems</span></div><div><strong>20%</strong><span>faster page loads</span></div></div>
      </section>

      <div className="about-work-transition" aria-hidden="true">
        <span className="about-work-transition__line" />
        <span className="about-work-transition__label">From thinking to making</span>
        <span className="about-work-transition__line" />
      </div>

      <section className="work section-pad" id="work">
        <Reveal><div className="section-heading"><p className="eyebrow">02 / Selected work</p><span className="section-note">Click a project to enter →</span></div></Reveal>
        <div className="project-list">{projects.map((project) => <Reveal key={project.slug}><Link href={`/projects/${project.slug}`} className={`project-row ${project.color}`}><span className="project-number">{project.index}</span><div><p className="eyebrow">{project.eyebrow}</p><h3>{project.title}</h3><p className="project-summary">{project.summary}</p></div><ArrowUpRight className="project-arrow" size={28} /></Link></Reveal>)}</div>
      </section>

      <div className="work-experience-transition" aria-hidden="true">
        <span className="work-experience-transition__orbit" />
        <span className="work-experience-transition__label">Selected work / lived experience</span>
        <span className="work-experience-transition__arrow">↓</span>
      </div>

      <section className="experience section-pad">
        <Reveal><p className="eyebrow">03 / Experience</p><h2>Learning by making<br /><span className="highlight">things real.</span></h2></Reveal>
        <div className="timeline">{experience.map((item, index) => <Link href={`/experience/${item.slug}`} className="timeline-row" key={item.title} style={{ '--timeline-index': index } as React.CSSProperties}><div className="timeline-marker" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span></div><span className="timeline-date">{item.date}</span><div className="timeline-copy"><p className="timeline-kicker">{index === 0 ? 'Field notes / current chapter' : 'Field notes / foundation'}</p><h3>{item.title}</h3><p>{item.place}</p><small>{item.detail}</small></div><ArrowUpRight className="timeline-arrow" size={22} aria-hidden="true" /></Link>)}</div>
      </section>

      <div className="experience-toolkit-transition" aria-hidden="true">
        <div className="experience-toolkit-transition__track"><span>TOOLS FOR THE NEXT IDEA</span><span>TOOLS FOR THE NEXT IDEA</span><span>TOOLS FOR THE NEXT IDEA</span></div>
        <div className="experience-toolkit-transition__marker">04</div>
      </div>

      <section className="skills section-pad"><Reveal><div className="section-heading"><p className="eyebrow">04 / Toolkit</p><p className="section-note">Always learning / never finished</p></div></Reveal><div className="skill-cloud">{skills.map((skill, index) => <span key={skill} className={index % 4 === 0 ? 'skill-accent' : ''}>{skill}</span>)}</div></section>

      <section className="contact section-pad" id="contact"><div className="contact-main"><Reveal><p className="eyebrow">05 / Start a conversation</p><div className="contact-title-row"><h2>Have a good<br /><em>problem?</em></h2><PixelBye /></div><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={24} /></a></Reveal></div><div className="footer-links"><span>© 2026 Mettu Mani Chandhan Sai</span><div><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} /></a></div></div></section>
    </main>
  )
}

export function ProjectDetail({ slug }: { slug: string }) {
  const project = projects.find((item) => item.slug === slug)
  if (!project) return null
  return <main className="project-detail"><header className="site-header"><Link href="/" className="wordmark">M/MC<span>.</span></Link><Link href="/" className="back-link">← Back to index</Link></header><section className={`detail-hero ${project.color} section-pad`}><p className="eyebrow">Project {project.index} / {project.eyebrow}</p><h1>{project.title}</h1><p className="detail-summary">{project.summary}</p><div className="detail-shape" /></section><section className="detail-content section-pad"><div><p className="eyebrow">The idea</p><p className="detail-description">{project.description}</p></div><div className="detail-side"><p className="eyebrow">Built with</p><ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul><p className="eyebrow metrics-label">Impact</p>{project.metrics.map((metric) => <strong key={metric}>{metric}</strong>)}</div></section><footer className="detail-footer section-pad"><Link href="/">← All projects</Link><div className="detail-footer-actions"><a href={project.url} target="_blank" rel="noreferrer">Open project site <ArrowUpRight size={18} /></a><a href={profile.github} target="_blank" rel="noreferrer">More on GitHub <ArrowUpRight size={18} /></a></div></footer></main>
}
