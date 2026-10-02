import { useCallback, useEffect, useRef, useState } from 'react'

const popularProjects = [
  { tag: '#Casamento', title: 'Casamento', subtitle: 'Votos e encontros', desc: 'Histórias verdadeiras registradas com delicadeza, presença e luz natural.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85' },
  { tag: '#Amor', title: 'História de amor', subtitle: 'Afeto em movimento', desc: 'Ensaios espontâneos que preservam gestos, olhares e a personalidade do casal.', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=85' },
  { tag: '#Família', title: 'Família', subtitle: 'Memórias compartilhadas', desc: 'Retratos naturais de vínculos que crescem e atravessam gerações.', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85' },
  { tag: '#Retrato', title: 'Retrato', subtitle: 'Identidade e presença', desc: 'Imagens marcantes que revelam expressão, força e autenticidade.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85' },
]

const categories = [
  { title: 'Editorial', image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Moda', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Eventos', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Comercial', image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=85' },
]

function CameraIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none">
      <path d="M4 10.5h5l2-3h10l2 3h5v15H4v-15Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="18" r="5" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function Header() {
  return (
    <header className="site-header page-shell">
      <a className="logo" href="/" aria-label="Página inicial da Reflect">
        <CameraIcon />
        <span>Reflect</span>
      </a>
      <nav aria-label="Navegação principal">
        <a href="/#portfolio">Portfólio</a>
        <a href="/#about">Sobre nós</a>
        <a href="/#services">Serviços</a>
        <a href="/#contact">Contato</a>
      </nav>
    </header>
  )
}

function PhotoCard({ item, category = false }) {
  return (
    <article className={`photo-card ${category ? 'category-card' : ''}`}>
      <img src={item.image} alt={`Fotografia da categoria ${item.title}`} loading="lazy" />
      <div className="card-label">
        <span>{item.title}</span>
        <span aria-hidden="true">↗</span>
      </div>
    </article>
  )
}

function ChevronIcon({ direction }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d={direction === 'left' ? 'M15 19 8 12l7-7' : 'm9 5 7 7-7 7'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProjectsCoverflow({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef(0)
  const total = items.length

  const next = useCallback(() => setCurrentIndex((index) => (index + 1) % total), [total])
  const previous = useCallback(() => setCurrentIndex((index) => (index - 1 + total) % total), [total])

  useEffect(() => {
    if (paused || total < 2) return undefined
    const timer = window.setInterval(next, 5000)
    return () => window.clearInterval(timer)
  }, [next, paused, total])

  function getPosition(index) {
    const offset = (index - currentIndex + total) % total
    if (offset === 0) return 'is-active'
    if (offset === 1) return 'is-next'
    if (offset === total - 1) return 'is-previous'
    return 'is-far'
  }

  function handleTouchEnd(event) {
    const distance = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(distance) > 45) distance < 0 ? next() : previous()
  }

  return (
    <div
      className="coverflow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(event) => { touchStart.current = event.touches[0].clientX }}
      onTouchEnd={handleTouchEnd}
    >
      <div className="coverflow-ambience" style={{ backgroundImage: `url(${items[currentIndex].image})` }} aria-hidden="true" />
      <div className="coverflow-stage">
        {items.map((item, index) => {
          const active = index === currentIndex
          return (
            <article
              className={`coverflow-card ${getPosition(index)}`}
              key={item.title}
              onClick={() => !active && setCurrentIndex(index)}
              aria-hidden={!active}
            >
              <img src={item.image} alt={active ? `Projeto fotográfico: ${item.title}` : ''} />
              <div className="coverflow-shade" />
              <div className="coverflow-content">
                <span className="coverflow-tag">{item.tag}</span>
                <div>
                  <h3>{item.title}</h3>
                  <strong>{item.subtitle}</strong>
                  <i aria-hidden="true" />
                  <p>{item.desc}</p>
                  <a href="#contact">Ver projeto <span aria-hidden="true">→</span></a>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      <button className="coverflow-arrow coverflow-prev" type="button" onClick={previous} aria-label="Projeto anterior"><ChevronIcon direction="left" /></button>
      <button className="coverflow-arrow coverflow-next" type="button" onClick={next} aria-label="Próximo projeto"><ChevronIcon direction="right" /></button>
      <div className="coverflow-dots" aria-label="Selecionar projeto">
        {items.map((item, index) => (
          <button key={item.title} type="button" className={index === currentIndex ? 'is-active' : ''} onClick={() => setCurrentIndex(index)} aria-label={`Ir para o projeto ${index + 1}`} aria-current={index === currentIndex ? 'true' : undefined} />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (window.location.pathname === '/contact') {
      window.history.replaceState(null, '', '/#contact')
      document.getElementById('contact')?.scrollIntoView()
    }
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    setNotice('Esta é uma prévia — conecte um serviço de e-mail para receber as mensagens.')
  }

  return (
    <main>
      <Header />

      <section className="hero page-shell" id="top">
        <p className="eyebrow">Estúdio visual independente · Desde 2018</p>
        <div className="hero-collage">
          <h1 className="hero-title hero-title-top">
            FOTÓ<span className="outline">GRAFO</span>
          </h1>
          <img className="hero-photo hero-photo-left" src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85" alt="Câmera organizada sobre uma superfície de trabalho" />
          <img className="hero-photo hero-photo-center" src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=85" alt="Fotógrafa segurando uma câmera" />
          <img className="hero-photo hero-photo-right" src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=900&q=85" alt="Mãos segurando fotografias instantâneas" />
          <div className="hero-title hero-title-bottom" aria-label="Capturando movimentos">
            <span>CAPTURANDO</span>
            <span className="outline offset-word">MOVIMENTOS</span>
          </div>
        </div>
      </section>

      <section className="about page-shell" id="about">
        <div className="about-copy">
          <p className="section-index">01 / Estúdio</p>
          <h2>SOBRE NÓS</h2>
          <p className="about-intro">DOCUMENTAMOS MOMENTOS VERDADEIROS E ESPONTÂNEOS QUE TORNAM CADA HISTÓRIA ÚNICA.</p>
          <p className="about-lead">Nosso trabalho vive entre a observação e o instinto — imagens atemporais moldadas por pessoas reais, movimentos naturais e pela beleza encontrada nos intervalos.</p>
          <div className="stats" aria-label="Estatísticas do estúdio">
            <div><strong>6+</strong><span>Anos de experiência</span></div>
            <div><strong>62+</strong><span>Ensaios</span></div>
            <div><strong>300+</strong><span>Clientes</span></div>
          </div>
        </div>
        <div className="about-image-wrap">
          <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85" alt="Equipe criativa reunida ao ar livre" loading="lazy" />
          <span>AS PESSOAS POR TRÁS DAS LENTES</span>
        </div>
      </section>

      <section className="projects page-shell" id="portfolio">
        <div className="section-heading">
          <p className="section-index">02 / Trabalhos selecionados</p>
          <h2>PROJETOS MAIS<br /><span>POPULARES</span></h2>
        </div>
        <ProjectsCoverflow items={popularProjects} />
      </section>

      <section className="categories page-shell" id="services">
        <div className="section-heading categories-heading">
          <p className="section-index">03 / Especialidades</p>
          <h2>CATEGORIAS COM<br /><span>QUE TRABALHAMOS</span></h2>
        </div>
        <div className="category-grid">
          {categories.map((item) => <PhotoCard item={item} category key={item.title} />)}
        </div>
      </section>

      <section className="contact-hero page-shell" id="contact">
        <div className="contact-intro">
          <p className="section-index">04 / Contato</p>
          <h2>VAMOS CRIAR<br /><span className="outline">ALGO</span><br />ATEMPORAL.</h2>
          <p>Conte o que você está planejando, onde será realizado e qual sensação deseja transmitir pelas imagens.</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">Seu nome</label>
            <input id="name" name="name" type="text" autoComplete="name" required placeholder="Ana Silva" />
          </div>
          <div className="form-field">
            <label htmlFor="email">Endereço de e-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" required placeholder="ana@exemplo.com" />
          </div>
          <div className="form-field">
            <label htmlFor="project">Tipo de projeto</label>
            <select id="project" name="project" defaultValue="" required>
              <option value="" disabled>Selecione uma categoria</option>
              <option>Casamento</option>
              <option>História de amor</option>
              <option>Família</option>
              <option>Retrato</option>
              <option>Editorial</option>
              <option>Comercial</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="message">Conte sobre sua ideia</label>
            <textarea id="message" name="message" rows="5" required placeholder="Data, local e a história que você deseja registrar..." />
          </div>
          <button type="submit">ENVIAR SOLICITAÇÃO <span aria-hidden="true">↗</span></button>
          {notice && <p className="form-notice" role="status">{notice}</p>}
        </form>
      </section>
      <div className="contact-marquee" aria-hidden="true">CAPTURE A EMOÇÃO · GUARDE O MOMENTO · CAPTURE A EMOÇÃO ·</div>

      <footer className="page-shell">
        <p>Tem uma história que merece ser lembrada?</p>
        <a href="#contact">VAMOS CRIAR ALGO ↗</a>
        <span>© 2026 ESTÚDIO REFLECT</span>
      </footer>
    </main>
  )
}

