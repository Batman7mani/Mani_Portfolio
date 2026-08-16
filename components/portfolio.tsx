'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Camera, Mail, Phone } from 'lucide-react'
import { profile, projects, skills } from '@/lib/portfolio-data'
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
      <IntroCurtain />
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <section className="hero section-pad" id="top">
        <div className="hero-copy">
          <Reveal><p className="eyebrow">Hello, I&apos;m Mani <span className="status-dot" /> Chennai / India</p></Reveal>
          <Reveal className="delay-1"><h1 className="cursor-highlight">Building digital<br /><em>systems</em> with intent.</h1></Reveal>
          <Reveal className="delay-2"><p className="hero-intro">Frontend engineer, cyber security student, and technical storyteller. I turn complex products into clear, tactile experiences.</p></Reveal>
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
  if (!project) return null
  return <main className="project-detail"><header className="site-header"><Link href="/" className="wordmark">M/MC<span>.</span></Link><Link href="/" className="back-link">← Back to index</Link></header><section className={`detail-hero ${project.color} section-pad`}><div className="detail-visual"><img src={project.image} alt={project.imageAlt} /></div><div className="detail-hero-copy"><p className="eyebrow">Project {project.index} / {project.eyebrow}</p><h1 className="cursor-highlight">{project.title}</h1><p className="detail-summary">{project.summary}</p><div className="detail-shape" /></div></section><section className="detail-content section-pad"><div><p className="eyebrow">The idea</p><p className="detail-description cursor-highlight">{project.description}</p></div><div className="detail-side"><p className="eyebrow">Built with</p><ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul><p className="eyebrow metrics-label">Impact</p>{project.metrics.map((metric) => <strong key={metric}>{metric}</strong>)}</div></section><footer className="detail-footer section-pad"><Link href="/">← All projects</Link><div className="detail-footer-actions"><a href={project.url} target="_blank" rel="noreferrer">Open project site <ArrowUpRight size={18} /></a><a href={profile.github} target="_blank" rel="noreferrer">More on GitHub <ArrowUpRight size={18} /></a></div></footer></main>
}
