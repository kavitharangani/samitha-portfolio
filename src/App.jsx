import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue, useAnimationFrame, useReducedMotion } from 'framer-motion'
import { profile, stats, experience, education, skills } from './data'
import { Reveal, SectionTitle, TiltCard, Counter } from './components/Motion'

const Scene3D = lazy(() => import('./components/Scene3D'))

const links = ['about', 'experience', 'education', 'skills', 'gallery', 'contact']

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div className="progress" style={{ scaleX }} />
}

function CursorGlow() {
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const sx = useSpring(x, { stiffness: 120, damping: 20 })
  const sy = useSpring(y, { stiffness: 120, damping: 20 })
  useEffect(() => {
    const m = (e) => {
      x.set(e.clientX - 200)
      y.set(e.clientY - 200)
    }
    window.addEventListener('pointermove', m)
    return () => window.removeEventListener('pointermove', m)
  }, [x, y])
  return <motion.div className="cursor-glow" style={{ x: sx, y: sy }} />
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', f)
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <motion.nav
      className={`nav ${scrolled ? 'nav-scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <a href="#home" className="logo">
        SP<span>.</span>
      </a>
      <ul className={open ? 'open' : ''}>
        {links.map((l, i) => (
          <motion.li key={l} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
            <a href={`#${l}`} onClick={() => setOpen(false)}>
              {l}
            </a>
          </motion.li>
        ))}
      </ul>
      <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>
        <span />
        <span />
      </button>
    </motion.nav>
  )
}

function RoleRotator() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2400)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="rotator">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 160])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const words = profile.name.split(' ')

  return (
    <section id="home" className="hero">
      <div className="hero-canvas">
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </div>
      <motion.div className="hero-content" style={{ y, opacity }}>
        <motion.span className="badge" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <i className="dot" /> Available for opportunities
        </motion.span>
        <h1 className="hero-name" aria-label={profile.name}>
          {words.map((w, wi) => (
            <span className="word" key={wi}>
              {w.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 80, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.6 + (wi * 8 + i) * 0.045, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>
        <motion.p className="hero-role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <RoleRotator />
        </motion.p>
        <motion.p className="hero-tag" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}>
          {profile.tagline}
        </motion.p>
        <motion.div className="hero-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 }}>
          <motion.a href="#contact" className="btn btn-primary" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
            Get in touch
          </motion.a>
          <motion.a href="#experience" className="btn btn-ghost" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
            View experience
          </motion.a>
        </motion.div>
      </motion.div>
      <motion.a href="#about" className="scroll-hint" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <span />
      </motion.a>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="section">
      <SectionTitle kicker="01 — Who I am" title="About Me" />
      <div className="about-grid">
        <Reveal>
          <TiltCard className="avatar-card">
            <div className="photo">
              <motion.img
                src={`${import.meta.env.BASE_URL}samitha.jpg`}
                alt={profile.name}
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="photo-tag">🎓 Graduated 2025</span>
            </div>
            <h3>{profile.name}</h3>
            <p>📍 {profile.location}</p>
          </TiltCard>
        </Reveal>
        <div>
          <Reveal delay={0.1}>
            <p className="lead">
              I'm a <strong>hard-working, proactive and result-oriented</strong> professional working in warehouse operations at{' '}
              <strong>Advantis</strong>. My background combines <strong>supply chain & stores management</strong>,{' '}
              <strong>technical draughtsmanship (AutoCAD)</strong> and a <strong>Diploma in Psychology</strong> — so I bring
              accuracy, structure and genuine people skills to every team.
            </p>
          </Reveal>
          <div className="stats">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={0.2 + i * 0.1}>
                <div className="stat">
                  <strong>
                    <Counter to={s.value} suffix={s.suffix} />
                  </strong>
                  <span>{s.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 })
  return (
    <section id="experience" className="section">
      <SectionTitle kicker="02 — Career" title="Work Experience" />
      <div className="timeline" ref={ref}>
        <motion.div className="timeline-line" style={{ scaleY }} />
        {experience.map((e, i) => (
          <motion.div
            key={e.role}
            className={`tl-item ${i % 2 ? 'right' : 'left'}`}
            initial={{ opacity: 0, x: i % 2 ? 80 : -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span className="tl-dot" whileInView={{ scale: [0, 1.4, 1] }} viewport={{ once: true }} transition={{ delay: 0.3 }} />
            <TiltCard className="tl-card">
              <div className="tl-head">
                <span className="period">{e.period}</span>
                {e.current && <span className="now">Current</span>}
              </div>
              <h3>{e.role}</h3>
              <h4>{e.company}</h4>
              <ul>
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Education() {
  return (
    <section id="education" className="section">
      <SectionTitle kicker="03 — Learning" title="Education & Qualifications" />
      <motion.div
        className="edu-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      >
        {education.map((ed) => (
          <motion.div
            key={ed.title}
            variants={{
              hidden: { opacity: 0, y: 50, rotateX: -30 },
              show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <TiltCard className="edu-card">
              <div className="edu-icon">{ed.icon}</div>
              <span className={`year ${ed.year === 'Ongoing' ? 'ongoing' : ''}`}>{ed.year}</span>
              <h3>{ed.title}</h3>
              <p>{ed.place}</p>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="section">
      <SectionTitle kicker="04 — Toolkit" title="Skills" />
      <div className="skills-grid">
        {skills.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <TiltCard className="skill-card">
              <div className="skill-top">
                <span className="skill-icon">{s.icon}</span>
                <h3>{s.title}</h3>
              </div>
              <div className="chips">
                {s.items.map((it, j) => (
                  <motion.span
                    key={it}
                    className="chip"
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + j * 0.06, type: 'spring', stiffness: 300 }}
                  >
                    {it}
                  </motion.span>
                ))}
              </div>
              <div className="bar">
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
                />
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const photos = Array.from({ length: 14 }, (_, i) => `${import.meta.env.BASE_URL}gallery/${i + 1}.jpg`)

// Rotating 3D ring of photos — auto-spins, drag to rotate, click to open
function GalleryRing({ onOpen }) {
  const rot = useMotionValue(0)
  const smooth = useSpring(rot, { stiffness: 60, damping: 18 })
  const reduce = useReducedMotion()
  const [radius, setRadius] = useState(420)
  const paused = useRef(false)
  const drag = useRef(null)
  const moved = useRef(0)

  useEffect(() => {
    const fit = () => setRadius(window.innerWidth < 760 ? 260 : 420)
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useAnimationFrame((_, delta) => {
    if (!reduce && !paused.current && !drag.current) rot.set(rot.get() - delta * 0.012)
  })

  const onDown = (e) => {
    drag.current = { x: e.clientX, start: rot.get() }
    moved.current = 0
  }
  const onMove = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    moved.current = Math.max(moved.current, Math.abs(dx))
    rot.set(drag.current.start + dx * 0.35)
  }
  const onUp = () => (drag.current = null)

  return (
    <div
      className="ring-stage"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => {
        onUp()
        paused.current = false
      }}
    >
      <motion.div className="ring" style={{ rotateY: smooth }}>
        {photos.map((src, i) => (
          <button
            key={src}
            className="ring-card"
            style={{ transform: `rotateY(${(i * 360) / photos.length}deg) translateZ(${radius}px)` }}
            onClick={() => moved.current < 6 && onOpen(i)}
            aria-label={`Open photo ${i + 1}`}
          >
            <img src={src} alt="" draggable="false" />
          </button>
        ))}
      </motion.div>
      <div className="ring-floor" />
      <span className="ring-hint">Drag to rotate · Click to view</span>
    </div>
  )
}

const flip = {
  enter: (d) => ({ opacity: 0, rotateY: d * 75, x: d * 220, scale: 0.85 }),
  center: { opacity: 1, rotateY: 0, x: 0, scale: 1 },
  exit: (d) => ({ opacity: 0, rotateY: d * -75, x: d * -220, scale: 0.85 }),
}

function Gallery() {
  const [[open, dir], setState] = useState([null, 0])
  const setOpen = (i) => setState([i, 0])
  const step = (d) => setState(([o]) => [(o + d + photos.length) % photos.length, d])

  useEffect(() => {
    if (open === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <section id="gallery" className="section">
      <SectionTitle kicker="05 — Moments" title="Gallery" />
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <GalleryRing onOpen={setOpen} />
      </motion.div>

      {createPortal(
        <AnimatePresence>
          {open !== null && (
            <motion.div
              className="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
            >
              <div className="lb-stage">
                <AnimatePresence initial={false} custom={dir} mode="popLayout">
                  <motion.img
                    key={open}
                    src={photos[open]}
                    alt={`${profile.name} — photo ${open + 1}`}
                    custom={dir}
                    variants={flip}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.6}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -80) step(1)
                      else if (info.offset.x > 80) step(-1)
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </AnimatePresence>
              </div>
              <button className="lb-btn lb-close" onClick={() => setOpen(null)} aria-label="Close">✕</button>
              <button className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous">‹</button>
              <button className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next">›</button>
              <span className="lb-count">{open + 1} / {photos.length}</span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  )
}

// Message form — emails go to profile.email through FormSubmit (no backend needed)
function MessageModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          _subject: `Portfolio message from ${form.name}`,
          _replyto: form.email,
          _template: 'table',
          _captcha: 'false',
          _honey: e.target._honey.value,
        }),
      })
      const data = await res.json()
      if (!res.ok || String(data.success) !== 'true') throw new Error(data.message)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="msg-title"
        initial={{ opacity: 0, y: 60, rotateX: 25, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        style={{ transformPerspective: 1200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div key="sent" className="modal-done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <motion.span
                className="done-icon"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
              >
                ✓
              </motion.span>
              <h3>Message sent!</h3>
              <p>Thanks {form.name.split(' ')[0]}, I'll get back to you soon.</p>
              <button className="btn btn-primary" onClick={onClose}>Close</button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0, scale: 0.95 }}>
              <span className="kicker">Say hello</span>
              <h3 id="msg-title">Send a Message</h3>
              <p className="modal-sub">It goes straight to my inbox — I usually reply within a day.</p>

              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
              <label className="field">
                <span>Your name</span>
                <input required value={form.name} onChange={set('name')} placeholder="John Perera" autoFocus />
              </label>
              <label className="field">
                <span>Your email</span>
                <input required type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
              </label>
              <label className="field">
                <span>Message</span>
                <textarea required rows={5} value={form.message} onChange={set('message')} placeholder="Hi Samitha, ..." />
              </label>

              {status === 'error' && (
                <p className="form-error">
                  Couldn't send right now. Please try again or email <a href={`mailto:${profile.email}`}>{profile.email}</a>.
                </p>
              )}

              <motion.button
                type="submit"
                className="btn btn-primary send-btn"
                disabled={status === 'sending'}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {status === 'sending' ? <span className="spinner" /> : 'Send Message →'}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

function Contact() {
  const items = [
    { icon: '✉️', label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: '📞', label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
    { icon: '📍', label: 'Location', value: profile.location },
  ]
  const [msgOpen, setMsgOpen] = useState(0) // 0 = closed; a new number each open gives a fresh form
  return (
    <section id="contact" className="section contact">
      <SectionTitle kicker="06 — Say hello" title="Let's Work Together" />
      <Reveal>
        <p className="contact-lead">Open to roles in warehouse operations, logistics, supply chain and technical drafting.</p>
      </Reveal>
      <div className="contact-grid">
        {items.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.1}>
            <TiltCard className="contact-card">
              <motion.span className="c-icon" whileHover={{ rotate: [0, -15, 15, 0] }}>
                {c.icon}
              </motion.span>
              <span className="c-label">{c.label}</span>
              {c.href ? <a href={c.href}>{c.value}</a> : <span className="c-value">{c.value}</span>}
            </TiltCard>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.3}>
        <motion.button className="btn btn-primary big" onClick={() => setMsgOpen(Date.now())} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
          Send a Message →
        </motion.button>
      </Reveal>
      {createPortal(<AnimatePresence>{msgOpen > 0 && <MessageModal key={msgOpen} onClose={() => setMsgOpen(0)} />}</AnimatePresence>, document.body)}
    </section>
  )
}

export default function App() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <div className="bg-grid" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Education />
        <Skills />
        <Gallery />
        <Contact />
      </main>
      <footer>
        © {new Date().getFullYear()} {profile.name} · Built with React, Three.js & Framer Motion
      </footer>
    </>
  )
}
