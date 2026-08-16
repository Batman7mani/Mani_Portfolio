export type Project = {
  slug: string
  index: string
  title: string
  eyebrow: string
  summary: string
  description: string
  stack: string[]
  metrics: string[]
  color: 'yellow' | 'ink' | 'sand' | 'orange' | 'violet'
  image: string
  imageAlt: string
  url: string
}

export const projects: Project[] = [
  {
    slug: 'vordenk-fleet-insight', index: '01', title: 'Vordenk', eyebrow: 'Fleet Insight / Diagnostic intelligence',
    summary: 'From snapshot to fingerprint: turning vehicle data into the right repair the first time.',
    description: 'Vordenk is a diagnostic workbench that reads the story before a fault code fires. The product gives testers, analyzers, and integrators a clearer way to connect vehicle events with confident maintenance decisions.',
    stack: ['React', 'TypeScript', 'Diagnostics', 'Data visualization'], metrics: ['Tester / Analyzer / Integrator', 'Fault-story timeline', 'Decision support'], color: 'sand',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-08-16%20185624-HrkwTq13tWRLnxZHrIgiSfnkN2JHvx.png', imageAlt: 'Vordenk diagnostic workbench sign-in screen', url: 'https://github.com/Batman7mani',
  },
  {
    slug: 'anipro', index: '02', title: 'AniPro', eyebrow: 'Anime discovery platform',
    summary: 'A vivid, searchable home for anime fans, built around discovery and momentum.',
    description: 'AniPro is an anime website with a bold dark interface, immersive hero artwork, searchable titles, and a visual content feed designed to make the next watch feel impossible to miss.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Responsive UI'], metrics: ['Visual content discovery', 'Search-first experience', 'Immersive hero layout'], color: 'violet',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-08-16%20185845-6ebzt8TubqZzxd4UAcS86ZZ7UAmWoh.png', imageAlt: 'AniPro anime website home screen', url: 'https://animei.netlify.app',
  },
  {
    slug: 'thinkit', index: '03', title: 'THINKIT', eyebrow: 'Accessible learning platform',
    summary: 'A calmer, more playful way for dyslexic learners to practice.',
    description: 'THINKIT is an accessibility-focused learning experience built around interactive reading tools. Phonetic segmentation, quizzes, worksheets, typing practice, and speech feedback work together to make practice feel less like a test and more like progress.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Web Speech API'], metrics: ['Phonetic reading', 'Speech feedback', 'Progress tracking'], color: 'yellow',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-08-16%20185911-5vDRwBDDawSkyotAFza9PN2TVDBOTL.png', imageAlt: 'THINKIT learning platform screen', url: 'https://thinkpro.netlify.app',
  },
  {
    slug: 'teilez', index: '04', title: 'Teilez', eyebrow: 'Automotive Shopify storefront',
    summary: 'Parts that hold the line: a sharper way to shop, configure, and build.',
    description: 'Teilez is an automotive components Shopify storefront with a confident dark visual language, parts navigation, product-led shopping, and a configurator path for drivers who know exactly how they want to build.',
    stack: ['Shopify', 'Liquid', 'JavaScript', 'Product UX'], metrics: ['Parts-first navigation', 'Configurator flow', 'Automotive commerce'], color: 'orange',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-08-16%20190131-Loq69IG3tupvhpdBNtT7om4KHbiXfV.png', imageAlt: 'Teilez automotive components storefront', url: 'https://github.com/Batman7mani',
  },
  {
    slug: 'xypher', index: '05', title: 'Xypher', eyebrow: 'Technical festival experience',
    summary: 'Where innovation meets excellence: a cinematic event platform built to convert attention.',
    description: 'Xypher is a technical festival landing experience with an editorial hero, high-contrast type, registration paths, and a visual system that makes a three-day event feel like a world worth entering.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'GSAP'], metrics: ['Cinematic hero', 'Registration CTA', 'Responsive event system'], color: 'ink',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-08-16%20190304-hyYWvj2cvWfb9g9F4RdQn08dwn4h8R.png', imageAlt: 'Xypher technical festival landing page', url: 'https://github.com/Batman7mani',
  },
]

export const getProject = (slug: string) => projects.find((project) => project.slug === slug)

export const profile = {
  name: 'Mettu Mani Chandhan Sai', shortName: 'Mani', role: 'Frontend engineer & cyber security student', email: 'mettumanichandhansai.2024.csecs@rajalakshmi.edu.in', phone: '9080201450', github: 'https://github.com/Batman7mani', linkedin: 'https://www.linkedin.com/in/mettu-mani-chandhan-sai-993b5b32a/', instagram: 'https://www.instagram.com/', portrait: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WRM8ONk7FpxMa0PWvvsCgLFLBoWuPt.png',
}

export const experience = [
  { slug: 'frontend-internship', date: '2026', title: 'Software Development Intern', place: 'Ashok Leyland', detail: 'React, TSX, Sass, MUI animations' },
  { slug: 'ieee-web-lead', date: '2025—now', title: 'IEEE Web Member → Web Lead', place: 'Rajalakshmi Engineering College', detail: 'Promoted from web member to lead · React, Vite.js, responsive digital platforms' },
  { slug: 'amigos-foundation', date: 'Feb—Jul 2025', title: 'Web & Technology Volunteer', place: 'Amigos Foundation', detail: 'Five months supporting digital communication for an NGO' },
]

export const skills = ['Java', 'Python', 'C', 'HTML', 'CSS', 'JavaScript', 'React', 'Vite.js', 'SCSS', 'Node.js', 'SQL', 'GSAP', 'Anime.js', 'Git', 'GitHub', 'Docker', 'Nmap', 'Postman', 'Vercel', 'Netlify', 'Linux']
