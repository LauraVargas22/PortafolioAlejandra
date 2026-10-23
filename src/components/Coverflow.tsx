import { useState, type ReactNode, type KeyboardEvent } from 'react'
import { motion, type PanInfo } from 'motion/react'
import { SPRING_SOFT } from './motionTokens'

type CoverflowProps<T> = {
  items: readonly T[]
  label: string
  getKey: (item: T) => string
  getLabel: (item: T) => string
  renderItem: (item: T, isActive: boolean) => ReactNode
  /** Se llama al pulsar la card activa (p. ej. abrir lightbox). */
  onOpen?: (index: number) => void
}

/** Carrusel coverflow: card activa al frente, vecinas en profundidad. Flechas, teclado, arrastre táctil e indicadores. */
export function Coverflow<T>({ items, label, getKey, getLabel, renderItem, onOpen }: CoverflowProps<T>) {
  const [active, setActive] = useState(0)
  const count = items.length
  const goTo = (index: number) => setActive((index + count) % count)

  const offsetOf = (index: number) => {
    let offset = index - active
    if (offset > count / 2) offset -= count
    if (offset < -count / 2) offset += count
    return offset
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.2
    if (swipe < -60) goTo(active + 1)
    else if (swipe > 60) goTo(active - 1)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); goTo(active + 1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(active - 1) }
  }

  return <div className="coverflow" role="region" aria-roledescription="carrusel" aria-label={label} onKeyDown={onKeyDown}>
    <motion.div className="coverflow-stage" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18} onDragEnd={onDragEnd}>
      {items.map((item, index) => {
        const offset = offsetOf(index)
        const distance = Math.abs(offset)
        const isActive = offset === 0
        return <motion.button
          key={getKey(item)}
          type="button"
          className={`coverflow-card ${isActive ? 'is-active' : ''}`}
          aria-label={isActive ? `Ampliar ${getLabel(item)}` : `Ver ${getLabel(item)}`}
          aria-current={isActive ? 'true' : undefined}
          tabIndex={distance > 1 ? -1 : 0}
          initial={false}
          animate={{
            transform: `translateX(${offset * 58}%) scale(${1 - Math.min(distance, 2) * 0.15}) rotateY(${offset * -16}deg)`,
            opacity: distance > 2 ? 0 : 1 - distance * 0.25,
          }}
          style={{ zIndex: count - distance }}
          transition={SPRING_SOFT}
          onClick={() => (isActive ? onOpen?.(index) : goTo(index))}
        >{renderItem(item, isActive)}</motion.button>
      })}
    </motion.div>
    <div className="coverflow-controls">
      <button type="button" className="round-button" aria-label="Anterior" onClick={() => goTo(active - 1)}>←</button>
      <div className="coverflow-dots">
        {items.map((item, index) => <button key={getKey(item)} type="button" aria-label={`Ir a ${getLabel(item)}`} aria-pressed={index === active} className={index === active ? 'is-active' : ''} onClick={() => goTo(index)}>{index === active && <motion.span layoutId={`${label}-dot`} className="dot-fill" transition={SPRING_SOFT} />}</button>)}
      </div>
      <span className="counter" aria-live="polite">{String(active + 1).padStart(2, '0')} <i>/ {String(count).padStart(2, '0')}</i></span>
      <button type="button" className="round-button" aria-label="Siguiente" onClick={() => goTo(active + 1)}>→</button>
    </div>
  </div>
}
