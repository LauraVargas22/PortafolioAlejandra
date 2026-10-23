import type { Variants } from 'motion/react'

/** Curvas de la skill animate (Emil Kowalski). Mismas que --ease-out / --ease-in-out en CSS. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const
export const SPRING_SOFT = { type: 'spring', duration: 0.6, bounce: 0.15 } as const

export const staggerParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
export const staggerChild: Variants = { hidden: { opacity: 0, transform: 'translateY(24px) scale(0.97)' }, show: { opacity: 1, transform: 'translateY(0px) scale(1)', transition: { duration: 0.7, ease: EASE_OUT } } }
