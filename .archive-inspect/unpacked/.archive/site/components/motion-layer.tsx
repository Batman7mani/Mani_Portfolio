'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, OrbitControls, Text } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export function IntroCurtain() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const seen = sessionStorage.getItem('mmc-intro-seen')
    if (seen) setOpen(true)
    else {
      const timer = window.setTimeout(() => { setOpen(true); sessionStorage.setItem('mmc-intro-seen', '1') }, 1900)
      return () => window.clearTimeout(timer)
    }
  }, [])
  if (open) return null
  return <div className="intro-curtain" role="status" aria-label="Loading Mani Chandhan Sai portfolio"><div className="intro-grid" /><div className="intro-mark"><span>M</span><span>M</span><span>C</span></div><p>METTU MANI CHANDHAN SAI</p><div className="intro-progress"><i /></div></div>
}

function Orb() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock, pointer }) => {
    if (!ref.current) return
    ref.current.rotation.x = clock.elapsedTime * 0.22 + pointer.y * 0.25
    ref.current.rotation.y = clock.elapsedTime * 0.3 + pointer.x * 0.35
  })
  return <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.1}><mesh ref={ref} scale={1.18}><icosahedronGeometry args={[1, 3]} /><MeshTransmissionMaterial backside thickness={0.28} roughness={0.16} transmission={0.9} color="#f1cf4b" /></mesh></Float>
}

export function HeroScene() {
  return <div className="hero-scene" aria-hidden="true"><Canvas camera={{ position: [0, 0, 4.5], fov: 34 }} dpr={[1, 1.5]}><ambientLight intensity={1.8} /><pointLight position={[2, 3, 3]} intensity={18} color="#fff5bf" /><Orb /><Text position={[0, -1.75, 0]} fontSize={0.19} letterSpacing={0.18} color="#28221f" anchorX="center">MMC / 2026</Text><OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} /></Canvas></div>
}

export function LoadingOverlay({ active }: { active: boolean }) {
  return <div className={`loading-overlay ${active ? 'is-active' : ''}`} aria-hidden={!active}><div className="loading-word">MMC<span>.</span></div><div className="loading-line"><i /></div></div>
}

export function PixelBye() {
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
    }, { threshold: 0.35 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={`pixel-bye ${visible ? 'is-visible' : ''}`} aria-label="Animated pixel character waving goodbye"><iframe src="/assets/animated-character.html" title="Animated pixel character waving goodbye" scrolling="no" /><span>UNTIL THE NEXT FRAME</span></div>
}
