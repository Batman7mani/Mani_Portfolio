import { experiences } from '@/lib/experience-data'

export const metadata = {
  title: 'Resume — Mani Chandhan Sai',
  description: 'Resume of Mettu Mani Chandhan Sai, frontend engineer and cyber security student.',
}

export default function ResumePage() {
  return (
    <main className="resume-page">
      <header className="resume-header">
        <div>
          <p className="eyebrow">Resume / HR</p>
          <h1>Mettu Mani Chandhan Sai</h1>
          <p className="resume-role">Frontend Engineer · Cyber Security Student · Technical Storyteller</p>
        </div>
        <a className="back-link" href="/">Back to portfolio ↗</a>
      </header>

      <section className="resume-contact" aria-label="Contact information">
        <span>Chennai, India</span>
        <a href="mailto:manichandhansai@gmail.com">manichandhansai@gmail.com</a>
        <a href="https://github.com/Batman7mani" target="_blank" rel="noreferrer">github.com/Batman7mani</a>
      </section>

      <section className="resume-section">
        <p className="eyebrow">Profile</p>
        <p className="resume-summary">Frontend engineer and cyber security student focused on turning complex products into clear, tactile, and accessible digital experiences. I combine product thinking, visual design, and dependable implementation.</p>
      </section>

      <section className="resume-section">
        <p className="eyebrow">Experience</p>
        <div className="resume-list">
          {experiences.map((experience) => (
            <article className="resume-item" key={experience.slug}>
              <div className="resume-item-meta"><span>{experience.date}</span><span>{experience.place}</span></div>
              <h2>{experience.title}</h2>
              <p>{experience.detail}</p>
              <ul>{experience.did.map((item) => <li key={item}>{item}</li>)}</ul>
              <p className="resume-tools">{experience.tools.join(' · ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-section resume-skills">
        <p className="eyebrow">Core skills</p>
        <p>Next.js · React · TypeScript · JavaScript · HTML/CSS · Product design · Accessibility · Responsive UI · Prototyping · Team leadership</p>
      </section>
    </main>
  )
}
