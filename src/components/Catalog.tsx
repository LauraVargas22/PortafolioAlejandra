import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { handmadeLogo, products, type Product } from '../data'
import { EASE_OUT } from './motionTokens'

type CatalogProps = { onBack: () => void }

function ProductLightbox({ product, index, onClose, onChange }: { product: Product; index: number; onClose: () => void; onChange: (index: number) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onChange((index - 1 + products.length) % products.length)
      if (event.key === 'ArrowRight') onChange((index + 1) % products.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown) }
  }, [index, onChange, onClose])

  return <motion.div className="catalog-lightbox" role="dialog" aria-modal="true" aria-label={`Vista ampliada de ${product.name}`} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <button ref={closeRef} className="catalog-lightbox-close round-button" type="button" onClick={onClose} aria-label="Cerrar vista ampliada">×</button>
    <button className="catalog-lightbox-nav catalog-lightbox-prev round-button" type="button" onClick={(event) => { event.stopPropagation(); onChange((index - 1 + products.length) % products.length) }} aria-label="Producto anterior">←</button>
    <motion.figure className="catalog-lightbox-content" onClick={(event) => event.stopPropagation()} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: EASE_OUT }}>
      <img src={product.image} alt={`${product.name}, ${product.category}`} />
      <figcaption><span className="catalog-card-category">{product.category}</span><strong>{product.name}</strong><p>{product.description}</p></figcaption>
    </motion.figure>
    <button className="catalog-lightbox-nav catalog-lightbox-next round-button" type="button" onClick={(event) => { event.stopPropagation(); onChange((index + 1) % products.length) }} aria-label="Siguiente producto">→</button>
  </motion.div>
}

export function Catalog({ onBack }: CatalogProps) {
  const [active, setActive] = useState<number | null>(null)

  return <div className="catalog-page">
    <header className="catalog-header">
      <a className="brand" href="/" onClick={onBack}><span className="brand-mark">A</span><span>Aleja<strong> Rojas</strong></span></a>
      <a className="catalog-back text-link" href="/" onClick={onBack}>Volver al portafolio <span aria-hidden="true">↗</span></a>
    </header>
    <main className="catalog-main">
      <section className="catalog-intro" aria-labelledby="catalog-title">
        <p className="eyebrow"><span className="eyebrow-index">03</span> Hilos de Amor</p>
        <h1 id="catalog-title">Creaciones que<br /><em>guardan una historia.</em></h1>
        <p>Descubre una selección de productos artesanales hechos con paciencia, intención y mucho amor por los detalles.</p>
      </section>
      <div className="catalog-hero-art" aria-label="Logo de Hilos de Amor">
        <div className="catalog-logo-panel"><img src={handmadeLogo} alt="Logo Hilos de Amor" /></div>
      </div>
      <section className="catalog-grid" aria-label="Catálogo de productos">
        {products.map((product, index) => <motion.button key={product.id} type="button" className="catalog-card" onClick={() => setActive(index)} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: index * 0.06, ease: EASE_OUT }} aria-label={`Ampliar ${product.name}`}>
          <span className="catalog-card-image"><img src={product.image} alt={`${product.name}, ${product.category}`} loading="lazy" /></span>
          <span className="catalog-card-info"><span className="catalog-card-category">{product.category}</span><strong>{product.name}</strong><span className="catalog-card-arrow" aria-hidden="true">↗</span></span>
        </motion.button>)}
      </section>
    </main>
    <AnimatePresence>{active !== null && <ProductLightbox product={products[active]} index={active} onClose={() => setActive(null)} onChange={setActive} />}</AnimatePresence>
  </div>
}
