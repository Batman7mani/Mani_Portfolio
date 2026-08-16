export type Experience = {
  slug: string
  date: string
  title: string
  place: string
  detail: string
  company: string
  companyAbout: string
  image: string
  imageAlt: string
  did: string[]
  learned: string[]
  tools: string[]
}

export const experiences: Experience[] = [
  {
    slug: 'ashok-leyland',
    date: '2025',
    title: 'Product Development Internship',
    place: 'Ashok Leyland / Digital Experience',
    company: 'Ashok Leyland',
    companyAbout: 'Ashok Leyland is a leading Indian commercial vehicle manufacturer building the mobility systems that keep people and businesses moving.',
    detail: 'A hands-on chapter in a large organisation, translating real product requirements into clearer, faster digital experiences.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AL-75-range-TgECgQXYxxM1GFxwmtIBQWAymGJ9CU.jpg',
    imageAlt: 'Ashok Leyland commercial vehicle range with the Ashok Leyland logo',
    did: ['Built responsive interface surfaces and reusable frontend components for internal product experiences.', 'Translated product requirements into accessible layouts, states, and interaction patterns.', 'Collaborated with a product-minded team to refine details and ship dependable work.'],
    learned: ['How enterprise products balance clarity, scale, and consistency.', 'How to communicate technical trade-offs with designers and stakeholders.', 'How performance and accessibility are part of the craft, not a final polish pass.'],
    tools: ['React', 'JavaScript', 'Responsive UI', 'Accessibility', 'Performance'],
  },
  {
    slug: 'amigos-foundation',
    date: 'Feb 2025 — Jul 2025',
    title: 'Web & Technology Volunteer',
    place: 'Amigos Foundation / NGO',
    company: 'Amigos Foundation',
    companyAbout: 'Amigos Foundation is a mission-led organisation using community, education, and practical support to create better opportunities for people.',
    detail: 'Five months of building useful digital touchpoints for a mission-led organisation.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inamigo-B5pqgQivnAsSi9DOOpO98AsvIXy5hH.jpg',
    imageAlt: 'InAmigos Foundation colorful star logo',
    did: ['Supported web content and digital communication for the foundation.', 'Improved clarity and consistency across online information.', 'Worked with a small team where initiative mattered more than hierarchy.'],
    learned: ['Technology can create trust when it is clear and accessible.', 'Mission-led work rewards patience, empathy, and practical ownership.', 'Small improvements compound when they serve real people.'],
    tools: ['Web content', 'HTML/CSS', 'Communication', 'Information design'],
  },
  {
    slug: 'ieee-web-lead',
    date: '2025 — now',
    title: 'IEEE Web Member → Web Lead',
    place: 'Rajalakshmi Engineering College / IEEE',
    company: 'IEEE Rajalakshmi Engineering College',
    companyAbout: 'IEEE REC is a student technology community where events, hackathons, and peer learning become a launchpad for builders.',
    detail: 'Promoted from web member to web lead by turning reliable execution into team-wide momentum.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-CBSS10r7sT5eo0oF5CVdPj9bdYl4I0.jpeg',
    imageAlt: 'IEEE logo on a blue background',
    did: ['Started as a web member building responsive event experiences.', 'Led the web direction for IEEE platforms, hackathons, and registrations.', 'Reviewed work, coordinated delivery, and raised the quality bar for the team.'],
    learned: ['Leadership is an extension of craft and communication.', 'A promotion is earned by making the whole team faster and clearer.', 'Systems scale when knowledge is shared, not guarded.'],
    tools: ['React', 'Figma', 'Team leadership', 'Event platforms'],
  },
  {
    slug: 'project-builder',
    date: '2022 — now',
    title: 'Independent Project Builder',
    place: 'Mani Labs / self-directed work',
    company: 'Mani Labs',
    companyAbout: 'A personal lab for building ambitious experiments where code, visual design, and storytelling meet.',
    detail: 'A personal lab for building ambitious experiments where code, visual design, and storytelling meet.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WRM8ONk7FpxMa0PWvvsCgLFLBoWuPt.png',
    imageAlt: 'Portrait of Mani from his portfolio archive',
    did: ['Designed and developed FleetSensor, ThinkIt, and Xyntra concepts.', 'Created end-to-end prototypes from product narrative to interaction.', 'Used projects as a way to test new tools and sharpen execution.'],
    learned: ['A strong concept becomes memorable through restraint.', 'Shipping small, coherent experiments compounds quickly.', 'The next level is always one more thoughtful detail.'],
    tools: ['Next.js', 'TypeScript', 'Product design', 'Prototyping'],
  },
]

export function getExperienceNeighbors(slug: string) {
  const index = experiences.findIndex((item) => item.slug === slug)
  return {
    previous: index > 0 ? experiences[index - 1] : undefined,
    next: index >= 0 && index < experiences.length - 1 ? experiences[index + 1] : undefined,
  }
}
