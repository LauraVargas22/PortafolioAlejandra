import { useRef, type ReactNode, type PointerEvent, type ElementType } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { EASE_OUT, staggerParent } from './motionTokens'

const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

type RevealProps = { children: ReactNode; className?: string; delay?: number; distance?: number; as?: 'div' | 'p' | 'li' | 'article' }

/** Fade + desplazamiento al entrar en viewport. Una sola vez: es contenido que se lee, no decoración repetida. */
export function Reveal({ children, className, delay = 0, distance = 28, as = 'div' }: RevealProps) {
  const Tag = motion[as] as ElementType
  return <Tag className={className} initial={{ opacity: 0, transform: `translateY(${distance}px)` }} whileInView={{ opacity: 1, transform: 'translateY(0px)' }} viewport={{ once: true, margin: '0px 0px -12% 0px' }} transition={{ duration: 0.8, ease: EASE_OUT, delay }}>{children}</Tag>
}

/** Contenedor que escalona a sus hijos `motion` con variants staggerChild. */
export function Stagger({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'ul' | 'ol' }) {
  const Tag = motion[as] as ElementType
  return <Tag className={className} variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }}>{children}</Tag>
}

/** Texto que sube desde una máscara, palabra por palabra. */
export function SplitWords({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return <span className={className}>{text.split(' ').map((word, index) => <span className="word-mask" key={`${word}-${index}`}><motion.span className="word" initial={{ transform: 'translateY(110%)' }} animate={{ transform: 'translateY(0%)' }} transition={{ duration: 0.9, ease: EASE_OUT, delay: delay + index * 0.06 }}>{word}</motion.span></span>).flatMap((node, index) => index === 0 ? [node] : [' ', node])}</span>
}

/** Atracción magnética sutil hacia el cursor. Solo en punteros finos; en táctil no hace nada. */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.6 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.6 })
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`
  const onMove = (event: PointerEvent) => {
    const el = ref.current
    if (!el || !finePointer()) return
    const rect = el.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * strength)
    y.set((event.clientY - rect.top - rect.height / 2) * strength)
  }
  const reset = () => { x.set(0); y.set(0) }
  return <motion.span ref={ref} className={`magnetic ${className ?? ''}`} style={{ transform }} onPointerMove={onMove} onPointerLeave={reset}>{children}</motion.span>
}

type TiltProps = { children: ReactNode; className?: string; max?: number; as?: 'div' | 'article' | 'li' }

/** Card con inclinación 3D discreta y luz borgoña que sigue al cursor (vía --mx / --my en el propio elemento). */
export function TiltCard({ children, className, max = 7, as = 'div' }: TiltProps) {
  const ref = useRef<HTMLElement>(null)
  const rx = useSpring(0, { stiffness: 160, damping: 16 })
  const ry = useSpring(0, { stiffness: 160, damping: 16 })
  const transform = useMotionTemplate`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
  const Tag = motion[as] as ElementType
  const onMove = (event: PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el || !finePointer()) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    ry.set((px - 0.5) * max * 2)
    rx.set((0.5 - py) * max * 2)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }
  const reset = () => { rx.set(0); ry.set(0) }
  return <Tag ref={ref} className={`tilt ${className ?? ''}`} style={{ transform }} onPointerMove={onMove} onPointerLeave={reset}>{children}</Tag>
}
