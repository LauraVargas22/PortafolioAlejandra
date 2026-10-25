import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { gallery, handmade, handmadeLogo, profile, services, timeline } from './data'
import { Catalog } from './components/Catalog'
import { Coverflow } from './components/Coverflow'
import { Magnetic, Reveal, SplitWords, Stagger, TiltCard } from './components/motion'
import { EASE_OUT, SPRING_SOFT, staggerChild } from './components/motionTokens'
import './App.css'

const Arrow = () => <span className="arrow" aria-hidden="true">↗</span>

const navItems = [
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'manualidades', label: 'Manualidades' },
  { id: 'galeria', label: 'Galería' },
  { id: 'catalogo', label: 'Catálogo' },
] as const

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id) })
    }, { rootMargin: '-45% 0px -50% 0px' })
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [ids])
  return active
}

function Brand({ onClick }: { onClick?: () => void }) {
  return <a className="brand" href="#inicio" onClick={onClick}><span className="brand-mark">A</span><span>Aleja<strong> Rojas</strong></span></a>
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(navItems.map((item) => item.id))
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 24))
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [menuOpen])

  return <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
    <a className="brand" href="/" onClick={closeMenu}><span className="brand-mark">A</span><span>Aleja<strong> Rojas</strong></span></a>
    <nav className="main-nav" aria-label="Navegación principal">
      {navItems.map((item) => <a key={item.id} href={item.id === 'catalogo' ? '/catalogo' : `#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>
        {active === item.id && <motion.span layoutId="nav-pill" className="nav-pill" transition={SPRING_SOFT} />}
        <span>{item.label}</span>
      </a>)}
      <Magnetic><a className="nav-cta" href="#contacto">Hablemos <Arrow /></a></Magnetic>
    </nav>
    <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen((open) => !open)}>
      <span>{menuOpen ? 'Cerrar' : 'Menú'}</span>
      <span className={`burger ${menuOpen ? 'is-open' : ''}`} aria-hidden="true"><i /><i /></span>
    </button>
    <AnimatePresence>
      {menuOpen && <motion.nav id="mobile-nav" className="mobile-nav" aria-label="Navegación móvil" initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }} exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.45, ease: EASE_OUT }}>
        <motion.ol initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } } }}>
          {[...navItems, { id: 'contacto', label: 'Contacto' }].map((item, index) => <motion.li key={item.id} variants={staggerChild}>
            <a href={item.id === 'catalogo' ? '/catalogo' : `#${item.id}`} onClick={closeMenu}><small>0{index + 1}</small>{item.label}</a>
          </motion.li>)}
        </motion.ol>
        <p className="mobile-nav-foot">Estilismo integral · Duitama, Boyacá</p>
      </motion.nav>}
    </AnimatePresence>
  </header>
}

function SectionHeading({ eyebrow, title, copy, index }: { eyebrow?: string; title: ReactNode; copy?: string; index?: string }) {
  return <Reveal className="section-heading">
    {eyebrow && <p className="eyebrow">{index && <span className="eyebrow-index">{index}</span>}{eyebrow}</p>}
    <h2>{title}</h2>
    {copy && <p className="section-copy">{copy}</p>}
  </Reveal>
}

function RotatingWord({ words }: { words: readonly string[] }) {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), 2600)
    return () => window.clearInterval(id)
  }, [reduce, words.length])
  return <span className="rotating-word" aria-live="off">
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span key={words[index]} initial={{ opacity: 0, transform: 'translateY(60%)', filter: 'blur(6px)' }} animate={{ opacity: 1, transform: 'translateY(0%)', filter: 'blur(0px)' }} exit={{ opacity: 0, transform: 'translateY(-60%)', filter: 'blur(6px)' }} transition={{ duration: 0.55, ease: EASE_OUT }}>{words[index]}</motion.span>
    </AnimatePresence>
  </span>
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['translateY(0px)', 'translateY(90px)'])
  const cardFast = useTransform(scrollYProgress, [0, 1], ['translateY(0px)', 'translateY(-140px)'])
  const cardSlow = useTransform(scrollYProgress, [0, 1], ['translateY(0px)', 'translateY(-60px)'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return <section id="inicio" ref={ref} className="hero section-shell">
    <div className="hero-glow" aria-hidden="true" />
    <div className="hero-grid-lines" aria-hidden="true" />
    <motion.div className="hero-copy" style={{ opacity: fade }}>
      <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}><span className="live-dot" aria-hidden="true" />Estilismo integral · [Ciudad]</motion.p>
      <h1><SplitWords text="Tu belleza," delay={0.15} /><br /><em><SplitWords text="en su mejor versión." delay={0.3} /></em></h1>
      <motion.p className="hero-specialty" initial={{ opacity: 0, transform: 'translateY(16px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.6 }}>
        <span className="specialty-label">Especialidad</span><RotatingWord words={services.map((service) => service.name)} />
      </motion.p>
      <motion.p className="hero-intro" initial={{ opacity: 0, transform: 'translateY(16px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.7 }}>Soy Alejandra Rojas, estilista profesional. En cada trabajo pongo dedicación, creatividad y amor por los detalles para resaltar la belleza y el estilo único de cada persona.</motion.p>
      <motion.div className="hero-actions" initial={{ opacity: 0, transform: 'translateY(16px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.8 }}>
        <Magnetic><a className="button button-primary" href="#servicios"><span>Descubrir servicios</span><Arrow /></a></Magnetic>
        <a className="text-link" href="#sobre-mi">Conocer el enfoque <span aria-hidden="true">↓</span></a>
      </motion.div>
    </motion.div>

    <div className="hero-visual" aria-label="Imagen editorial provisional de belleza">
      <motion.div className="hero-frame" initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0 round 240px 240px 18px 18px)' }} animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0 round 240px 240px 18px 18px)' }} transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.2 }}>
        <motion.img style={{ transform: imageY }} src={profile.heroImage} alt="Imagen provisional de una modelo con maquillaje editorial" />
      </motion.div>
      <div className="hero-frame-outline" aria-hidden="true" />
      <motion.div className="float-card float-card-a" style={{ transform: cardFast }}>
        <motion.div className="glass" initial={{ opacity: 0, transform: 'translateY(20px) scale(0.95)' }} animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }} transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.9 }}>
          <span className="float-kicker">Servicios</span><strong>0{services.length}</strong><span>rituales de belleza</span>
        </motion.div>
      </motion.div>
      <motion.div className="float-card float-card-b" style={{ transform: cardSlow }}>
        <motion.div className="glass" initial={{ opacity: 0, transform: 'translateY(20px) scale(0.95)' }} animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }} transition={{ duration: 0.8, ease: EASE_OUT, delay: 1.05 }}>
          <span className="float-kicker">Enfoque</span><em>Belleza con intención</em>
        </motion.div>
      </motion.div>
      <motion.span className="hero-stamp" initial={{ opacity: 0, transform: 'scale(0.9) rotate(-20deg)' }} animate={{ opacity: 1, transform: 'scale(1) rotate(0deg)' }} transition={{ duration: 1, ease: EASE_OUT, delay: 1.1 }}>A<small>Aleja Rojas</small></motion.span>
    </div>

    <motion.a href="#sobre-mi" className="scroll-cue" style={{ opacity: fade }} aria-label="Ir a Sobre mí">
      <span>Scroll para explorar</span><span className="scroll-track" aria-hidden="true"><i /></span><span>2024 — 2025</span>
    </motion.a>
  </section>
}

const aboutPillars = [
  { n: '01', title: 'Escuchar', copy: 'Lo que quieres.' },
  { n: '02', title: 'Observar', copy: 'Lo que te hace sentir bien.' },
  { n: '03', title: 'Traducir', copy: 'En una propuesta que se sienta propia.' },
] as const

function About() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgShift = useTransform(scrollYProgress, [0, 1], ['translateY(60px)', 'translateY(-60px)'])
  const numberShift = useTransform(scrollYProgress, [0, 1], ['translateY(-80px)', 'translateY(120px)'])

  return <section id="sobre-mi" ref={ref} className="about section-shell">
    <motion.span className="giant-number" style={{ transform: numberShift }} aria-hidden="true">01</motion.span>
    <div className="about-media">
      <motion.div className="about-image" style={{ transform: imgShift }}>
        <img src={profile.aboutImage} alt="Imagen provisional de cuidado capilar" loading="lazy" />
      </motion.div>
      <span className="about-frame" aria-hidden="true" />
      <span className="image-caption">Imagen provisional · reemplazar con fotografía propia</span>
    </div>
    <div className="about-copy">
      <SectionHeading index="01" eyebrow="Sobre mí" title={<>Más que un look.<br /><em>Un momento para ti.</em></>} />
      <Reveal as="p" className="lead">En este espacio podrás conocer un poco más sobre mi trabajo y mi pasión por la belleza. Soy Alejandra Rojas, estilista profesional, y cada servicio que realizo refleja mi dedicación, creatividad y atención a los detalles.</Reveal>
      <Reveal as="p" delay={0.08}>Mi propósito es resaltar la belleza de cada persona y crear looks que la hagan sentir auténtica, segura y especial.</Reveal>
      <Stagger as="ol" className="pillars">
        {aboutPillars.map((pillar) => <motion.li key={pillar.n} variants={staggerChild}>
          <TiltCard className="pillar-card" max={5}><span className="pillar-n">{pillar.n}</span><strong>{pillar.title}</strong><span>{pillar.copy}</span></TiltCard>
        </motion.li>)}
      </Stagger>
      <Reveal delay={0.1}><a className="text-link accent-link" href="#contacto">Conocer más sobre [Nombre] <Arrow /></a></Reveal>
    </div>
  </section>
}

function Services() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const goTo = (index: number) => {
    const next = (index + services.length) % services.length
    const card = trackRef.current?.children[next] as HTMLElement | undefined
    if (card && trackRef.current) trackRef.current.scrollTo({ left: card.offsetLeft - trackRef.current.offsetLeft, behavior: 'smooth' })
    setActive(next)
  }
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const cards = Array.from(track.children) as HTMLElement[]
      const base = track.offsetLeft
      const closest = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - base - track.scrollLeft) < Math.abs(cards[best].offsetLeft - base - track.scrollLeft) ? index : best, 0)
      setActive(closest)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  return <section id="servicios" className="services section-shell">
    <div className="services-intro">
      <SectionHeading index="02" eyebrow="Servicios" title={<>Rituales<br /><em>de belleza</em></>} />
      <Reveal as="p" className="section-copy">Propuestas provisionales para acompañar tu estilo, tu ritmo y el momento que estás viviendo.</Reveal>
      <Reveal className="carousel-controls" delay={0.1}>
        <button type="button" className="round-button" aria-label="Servicio anterior" onClick={() => goTo(active - 1)}>←</button>
        <span className="counter" aria-live="polite">0{active + 1} <i>/ 0{services.length}</i></span>
        <button type="button" className="round-button" aria-label="Siguiente servicio" onClick={() => goTo(active + 1)}>→</button>
      </Reveal>
    </div>
    <div className="service-carousel" aria-label="Servicios disponibles">
      <Stagger className="service-track">
        {/* Stagger no admite ref; el track real es este div interno */}
        <div className="service-track-inner" ref={trackRef} tabIndex={0} aria-label="Carrusel de servicios, usa las flechas del teclado" onKeyDown={(event) => { if (event.key === 'ArrowRight') goTo(active + 1); if (event.key === 'ArrowLeft') goTo(active - 1) }}>
          {services.map((service, index) => <motion.div className="service-slot" key={service.name} variants={staggerChild}>
            <TiltCard as="article" className={`service-card ${active === index ? 'is-active' : ''}`}>
              <div className="service-image"><img src={service.image} alt="" loading="lazy" /></div>
              <div className="service-card-body">
                <span className="service-index">0{index + 1}</span>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <span className="service-arrow" aria-hidden="true">↗</span>
              </div>
            </TiltCard>
          </motion.div>)}
        </div>
      </Stagger>
      <div className="carousel-dots" aria-label="Seleccionar servicio">
        {services.map((service, index) => <button key={service.name} className={active === index ? 'is-active' : ''} type="button" aria-pressed={active === index} aria-label={`Ir a ${service.name}`} onClick={() => goTo(index)}>{active === index && <motion.span layoutId="service-dot" className="dot-fill" transition={SPRING_SOFT} />}</button>)}
      </div>
    </div>
  </section>
}

function Handmade() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const depth = [
    useTransform(scrollYProgress, [0, 1], ['translateY(40px)', 'translateY(-40px)']),
    useTransform(scrollYProgress, [0, 1], ['translateY(110px)', 'translateY(-110px)']),
    useTransform(scrollYProgress, [0, 1], ['translateY(70px)', 'translateY(-70px)']),
  ]
  return <section id="manualidades" ref={ref} className="handmade section-shell">
    <div className="handmade-copy">
      <SectionHeading index="03" eyebrow="Otra forma de crear" title={<>También creo<br /><em>con mis manos.</em></>} />
      <Reveal as="p">{handmade.description}</Reveal>
      <Reveal className="handmade-logo-wrap"><img className="handmade-logo" src={handmadeLogo} alt="Hilos de Amor" /></Reveal>
      <Reveal delay={0.1}><Magnetic><a className="button button-primary" href="/catalogo"><span>Visitar catálogo</span><Arrow /></a></Magnetic></Reveal>
    </div>
    <div className="craft-stack">
      {handmade.items.map((item, index) => <motion.div className={`craft-layer craft-layer-${index + 1}`} key={item.title} style={{ transform: depth[index % depth.length] }}>
        <Reveal delay={index * 0.1}>
          <TiltCard as="article" className="craft-card"><img src={item.image} alt={item.title} loading="lazy" /><span>{item.title}</span></TiltCard>
        </Reveal>
      </motion.div>)}
    </div>
  </section>
}

function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const progress = useTransform(scrollYProgress, (v) => `scaleY(${v})`)
  return <section className="experience section-shell">
    <SectionHeading index="04" eyebrow="Trayectoria" title={<>En construcción,<br /><em>con intención.</em></>} copy="Un espacio preparado para sumar la experiencia y formación reales cuando estén confirmadas." />
    <div className="timeline" ref={ref}>
      <span className="timeline-rail" aria-hidden="true"><motion.i style={{ transform: progress }} /></span>
      {timeline.map((item, index) => <Reveal as="article" className="timeline-item" key={item.title} delay={index * 0.05}>
        <span className="timeline-dot" aria-hidden="true" />
        <span className="timeline-date">{item.date}</span>
        <TiltCard className="timeline-card" max={4}><h3>{item.title}</h3><p>{item.description}</p></TiltCard>
      </Reveal>)}
    </div>
  </section>
}

function Gallery() {
  const [active, setActive] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (active === null) return
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight') setActive((active + 1) % gallery.length)
      if (event.key === 'ArrowLeft') setActive((active - 1 + gallery.length) % gallery.length)
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [active])

  return <section id="galeria" className="gallery section-shell">
    <div className="gallery-header">
      <SectionHeading index="05" eyebrow="Galería / provisional" title={<>Detalles que<br /><em>hablan por sí solos.</em></>} />
      <Reveal as="p" className="section-copy">Una selección de imágenes de referencia. Reemplazar con trabajos, procesos y resultados propios.</Reveal>
    </div>
    <Reveal distance={40}>
      <Coverflow items={gallery} label="Galería" getKey={(item) => item.title} getLabel={(item) => item.title} onOpen={setActive} renderItem={(item, isActive) => <>
        <img src={item.image} alt={item.title} draggable={false} loading="lazy" />
        <span className="coverflow-caption"><span>{item.title}</span>{isActive && <span className="coverflow-hint">Ampliar <Arrow /></span>}</span>
      </>} />
    </Reveal>
    <AnimatePresence>
      {active !== null && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Vista ampliada de la galería" onClick={() => setActive(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE_OUT }}>
        <button ref={closeRef} className="lightbox-close round-button" type="button" onClick={() => setActive(null)} aria-label="Cerrar galería">×</button>
        <button className="lightbox-nav lightbox-prev round-button" type="button" aria-label="Imagen anterior" onClick={(event) => { event.stopPropagation(); setActive((active - 1 + gallery.length) % gallery.length) }}>←</button>
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure key={active} onClick={(event) => event.stopPropagation()} initial={{ opacity: 0, transform: 'scale(0.96)' }} animate={{ opacity: 1, transform: 'scale(1)' }} exit={{ opacity: 0, transform: 'scale(0.96)' }} transition={{ duration: 0.25, ease: EASE_OUT }}>
            <img src={gallery[active].image} alt={gallery[active].title} />
            <figcaption>{gallery[active].title}</figcaption>
          </motion.figure>
        </AnimatePresence>
        <button className="lightbox-nav lightbox-next round-button" type="button" aria-label="Imagen siguiente" onClick={(event) => { event.stopPropagation(); setActive((active + 1) % gallery.length) }}>→</button>
      </motion.div>}
    </AnimatePresence>
  </section>
}

const contactLinks = [
  { label: 'Correo', value: 'alejarojaspersonal@gmail.com', href: 'mailto:alejarojaspersonal@gmail.com', external: false },
  { label: 'Teléfono', value: '310 349 70 78', href: 'tel:+573103497078', external: false },
  { label: 'Instagram', value: '@mrojasbecerra', href: 'https://www.instagram.com/mrojasbecerra?exln=MTc3dmFreWZiejNjMg==', external: true },
] as const

function Contact() {
  return <section id="contacto" className="contact section-shell">
    <div className="contact-glow" aria-hidden="true" />
    <div className="contact-head">
      <Reveal as="p" className="eyebrow"><span className="eyebrow-index">06</span>¿Hablamos?</Reveal>
      <h2 className="contact-title"><Reveal distance={50}>Tu próximo</Reveal><Reveal distance={50} delay={0.08}><em>capítulo empieza aquí.</em></Reveal></h2>
      <Reveal delay={0.15}><Magnetic strength={0.35}><a className="button button-primary button-xl" href={contactLinks[0].href}><span>Escríbeme</span><Arrow /></a></Magnetic></Reveal>
    </div>
    <div className="contact-details">
      <Reveal as="p">No dudes en contactarme para cualquier consulta o reserva.</Reveal>
      <Stagger as="ul" className="contact-list">
        {contactLinks.map((link) => <motion.li key={link.label} variants={staggerChild}>
          <a className="contact-link" href={link.href} {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}><small>{link.label}</small><span>{link.value}</span><Arrow /></a>
        </motion.li>)}
      </Stagger>
    </div>
  </section>
}

function Footer() {
  return <footer className="footer section-shell">
    <p className="footer-word" aria-hidden="true">Aleja<em> Rojas</em></p>
    <div className="footer-row">
      <Brand />
      <span>© 2026 Laura Vargas · Desarrollo web</span>
      <a className="text-link" href="#inicio">Volver arriba ↑</a>
    </div>
  </footer>
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
  if (path.replace(/\/+$/, '') === '/catalogo') return <Catalog onBack={() => setPath('/')} />
  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#sobre-mi">Saltar al contenido</a>
    <Header />
    <main><Hero /><About /><Services /><Handmade /><Experience /><Gallery /><Contact /></main>
    <Footer />
  </MotionConfig>
}

export default App
