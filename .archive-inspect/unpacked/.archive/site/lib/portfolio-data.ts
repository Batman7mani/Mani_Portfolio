export type Project = {
  slug: string
  index: string
  title: string
  eyebrow: string
  summary: string
  description: string
  stack: string[]
  metrics: string[]
  color: 'yellow' | 'ink' | 'sand'
  url: string
}

export const projects: Project[] = [
  {
    slug: 'fleetsensor',
    index: '01',
    title: 'FleetSensor',
    eyebrow: 'Predictive fault intelligence',
    summary: 'Turning engine telemetry into confident maintenance decisions.',
    description: 'FleetSensor is a predictive diagnostics platform that correlates pre-fault engine telemetry across 200+ fleet vehicles. It gives teams a visual fingerprint for every diagnostic trouble code, helping engineers move from reactive guesswork to pattern-driven root cause analysis.',
    stack: ['React / TSX', 'SCSS', 'MUI', 'Node.js', 'Supabase SQL'],
    metrics: ['200+ vehicles', '~65% less misdiagnosis', '3-tier RBAC'],
    color: 'yellow',
    url: 'https://github.com/Batman7mani',
  },
  {
    slug: 'thinkit',
    index: '02',
    title: 'THINKIT',
    eyebrow: 'Accessible learning platform',
    summary: 'A calmer, more playful way for dyslexic learners to practice.',
    description: 'THINKIT is an accessibility-focused learning experience built around interactive reading tools. Phonetic segmentation, quizzes, worksheets, typing practice, and speech feedback work together to make practice feel less like a test and more like progress.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Web Speech API', 'HTML5 Audio'],
    metrics: ['Phonetic reading', 'Speech feedback', 'Progress tracking'],
    color: 'ink',
    url: 'https://github.com/Batman7mani',
  },
  {
    slug: 'xyntra',
    index: '03',
    title: 'XYNTRA',
    eyebrow: 'IEEE hackathon platform',
    summary: 'An animated event system designed to turn attention into action.',
    description: 'XYNTRA is a responsive hackathon landing platform for IEEE. I built a modular event interface with countdowns, motion-led transitions, Unstop registration, and Razorpay payment support so the experience could take a participant from first glance to confirmed registration without friction.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'GSAP', 'Framer Motion'],
    metrics: ['~30% faster navigation', 'Interactive countdown', 'Secure payments'],
    color: 'sand',
    url: 'https://github.com/Batman7mani',
  },
]

export const getProject = (slug: string) => projects.find((project) => project.slug === slug)

export const profile = {
  name: 'Mettu Mani Chandhan Sai',
  shortName: 'Mani',
  role: 'Frontend engineer & cyber security student',
  email: 'mettumanichandhansai.2024.csecs@rajalakshmi.edu.in',
  phone: '9080201450',
  github: 'https://github.com/Batman7mani',
  linkedin: 'https://www.linkedin.com/in/mettu-mani-chandhan-sai-993b5b32a/',
  portrait: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WRM8ONk7FpxMa0PWvvsCgLFLBoWuPt.png',
}

export const experience = [
  { slug: 'frontend-internship', date: '2026', title: 'Software Development Intern', place: 'Ashok Leyland', detail: 'React, TSX, Sass, MUI animations' },
  { slug: 'ieee-web-lead', date: '2025—now', title: 'IEEE Web Member → Web Lead', place: 'Rajalakshmi Engineering College', detail: 'Promoted from web member to lead · React, Vite.js, responsive digital platforms' },
  { slug: 'amigos-foundation', date: 'Feb—Jul 2025', title: 'Web & Technology Volunteer', place: 'Amigos Foundation', detail: 'Five months supporting digital communication for an NGO' },
]

export const skills = ['Java', 'Python', 'C', 'JavaScript', 'React', 'Vite.js', 'SCSS', 'Node.js', 'SQL', 'GSAP', 'Git', 'Linux']
