import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/portfolio'
import { getProject, projects } from '@/lib/portfolio-data'

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getProject(slug)) notFound()
  return <ProjectDetail slug={slug} />
}
