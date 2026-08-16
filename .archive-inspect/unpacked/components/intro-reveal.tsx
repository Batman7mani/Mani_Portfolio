'use client'

import { useEffect, useState } from 'react'

const capabilities = ['design websites', 'build websites', 'write clean code','automate tasks']

export function IntroReveal() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % capabilities.length), 1500)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="intro-reveal" aria-label="Portfolio introduction">
      <div className="intro-reveal__grain" aria-hidden="true" />
      <div className="intro-reveal__grid" aria-hidden="true" />
      <div className="intro-reveal__wave intro-reveal__wave--one" aria-hidden="true" />
      <div className="intro-reveal__wave intro-reveal__wave--two" aria-hidden="true" />
      <div className="intro-reveal__topline">
        <span>M/MC — Portfolio</span>
        <span>2026 / Chennai</span>
      </div>
      <div className="intro-reveal__center">
        <p className="intro-reveal__eyebrow">Independent digital designer &amp; developer</p>
        <h1>
          <span>I can</span>
          <span className="intro-reveal__rotator" aria-live="polite" key={capabilities[index]}>{capabilities[index]}</span>
          <span className="intro-reveal__accent">with intent<span>.</span></span>
        </h1>
        <p className="intro-reveal__support"></p>
      </div>
      <div className="intro-reveal__bottomline">
        <span className="intro-reveal__line" />
        <a className="intro-reveal__enter" href="#top" aria-label="Scroll to the portfolio hero">
          <span>Scroll to enter</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  )
}
