import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { experiences } from '@/lib/experience-data'

export function generateStaticParams() { return experiences.map((item) => ({ slug: item.slug })) }

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = experiences.find((experience) => experience.slug === slug)
  if (!item) notFound()
  return <main className="detail-page"><Link className="back-link" href="/"><ArrowLeft size={16} /> Back to portfolio</Link><p className="eyebrow">{item.date} / EXPERIENCE</p><h1>{item.title}</h1><p className="detail-lead">{item.detail}</p><div className="detail-meta"><span>{item.place}</span><span>MANI / FIELD NOTES</span></div><div className="detail-grid"><section><p className="eyebrow">What I did</p><ul>{item.did.map((point) => <li key={point}>{point}<ArrowUpRight size={18} /></li>)}</ul></section><section><p className="eyebrow">What I learned</p><ul>{item.learned.map((point) => <li key={point}>{point}<ArrowUpRight size={18} /></li>)}</ul></section></div><div className="detail-end"><span>END OF CHAPTER</span><Link href="/">Explore the rest <ArrowUpRight size={17} /></Link></div></main>
}
