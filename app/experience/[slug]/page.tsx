import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { experiences, getExperienceNeighbors } from '@/lib/experience-data'

export function generateStaticParams() {
  return experiences.map((item) => ({ slug: item.slug }))
}

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = experiences.find((experience) => experience.slug === slug)
  if (!item) notFound()
  const { previous, next } = getExperienceNeighbors(item.slug)

  return (
    <main className="experience-detail-page">
      <header className="detail-nav">
        <Link className="wordmark" href="/">M/MC<span>.</span></Link>
        <Link className="back-link" href="/"><ArrowLeft size={16} /> Back to portfolio</Link>
      </header>
      <section className="experience-detail-hero">
        <div className="experience-detail-hero__copy">
          <p className="eyebrow">{item.date} / experience chapter</p>
          <p className="detail-kicker">{item.company}</p>
          <h1>{item.title}</h1>
          <p className="detail-lead">{item.detail}</p>
        </div>
        <div className="experience-detail-image">
          <img src={item.image} alt={item.imageAlt} />
          <span>{item.company} / field notes</span>
        </div>
      </section>
      <section className="company-context section-pad">
        <div><p className="eyebrow">The company</p><h2>Where the chapter<br /><span className="highlight">happened.</span></h2></div>
        <div><p className="company-place">{item.place}</p><p className="detail-description">{item.companyAbout}</p></div>
      </section>
      <section className="detail-grid section-pad">
        <div><p className="eyebrow">What I did</p><ul>{item.did.map((point) => <li key={point}>{point}<ArrowUpRight size={18} /></li>)}</ul></div>
        <div><p className="eyebrow">Skills I learned</p><ul>{item.learned.map((point) => <li key={point}>{point}<ArrowUpRight size={18} /></li>)}</ul><div className="detail-tools"><p className="eyebrow">Tools & focus</p><div>{item.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></div></div>
      </section>
      <nav className="chapter-nav" aria-label="Experience chapters">
        {previous ? <Link href={`/experience/${previous.slug}`}><span>Previous chapter</span><strong>{previous.company}</strong></Link> : <span />}
        {next ? <Link href={`/experience/${next.slug}`}><span>Next chapter</span><strong>{next.company} <ArrowUpRight size={18} /></strong></Link> : <Link href="/"><span>Return to index</span><strong>All experiences <ArrowUpRight size={18} /></strong></Link>}
      </nav>
    </main>
  )
}
