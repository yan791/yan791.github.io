import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Icone from './Icone.jsx'
import { irPara } from '../lib/rolagem.js'
import './cabecalho.css'

export const SECOES = [
  ['inicio', 'Início', 'inicio'],
  ['sobre', 'Sobre', 'sobre'],
  ['projetos', 'Projetos', 'projetos'],
  ['trajetoria', 'Trajetória', 'trajetoria'],
  ['contato', 'Contato', 'contato'],
]

const formatoHora = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Recife', hour: '2-digit', minute: '2-digit' })

function useHora() {
  const [hora, setHora] = useState(() => formatoHora.format(new Date()))
  useEffect(() => {
    const t = setInterval(() => setHora(formatoHora.format(new Date())), 20000)
    return () => clearInterval(t)
  }, [])
  return hora
}

export function useIrParaSecao() {
  const loc = useLocation()
  const navegar = useNavigate()
  return (e, id) => {
    e?.preventDefault()
    if (loc.pathname === '/') irPara(id === 'inicio' ? 0 : `#${id}`)
    else navegar('/', { state: { alvo: id === 'inicio' ? null : `#${id}` } })
  }
}

export default function Cabecalho() {
  const [ativa, setAtiva] = useState('inicio')
  const [barra, setBarra] = useState({ x: 0, w: 0 })
  const pilula = useRef(null)
  const hora = useHora()
  const ir = useIrParaSecao()
  const loc = useLocation()

  // seção ativa: a que cruza o meio da tela
  useEffect(() => {
    if (loc.pathname !== '/') return
    const els = SECOES.map(([id]) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setAtiva(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [loc.pathname])

  useEffect(() => {
    const medir = () => {
      const a = pilula.current?.querySelector(`[data-id="${ativa}"]`)
      if (a) setBarra({ x: a.offsetLeft, w: a.offsetWidth })
    }
    medir()
    document.fonts?.ready.then(medir)
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [ativa])

  return (
    <>
      <header className="topo">
        <div className="topo__conteudo">
          <a href="/" className="topo__nome" onClick={(e) => ir(e, 'inicio')}>
            <img src="/midia/yan/retrato-fundo.webp" alt="" width="32" height="32" />
            <span>Yan Ribeiro Nunes</span>
          </a>

          <nav className="topo__pilula" ref={pilula} aria-label="Seções">
            <span className="topo__marcador" style={{ transform: `translateX(${barra.x}px)`, width: barra.w }} aria-hidden="true" />
            {SECOES.map(([id, t]) => (
              <a key={id} href={`/#${id}`} data-id={id} className={ativa === id ? 'ativa' : ''} aria-current={ativa === id ? 'true' : undefined} onClick={(e) => ir(e, id)}>
                {t}
              </a>
            ))}
          </nav>

          <p className="topo__hora mono" aria-label={`Recife, ${hora}`}>
            <span>Recife</span>
            <span className="topo__sep" aria-hidden="true">·</span>
            <time>{hora}</time>
          </p>
        </div>
      </header>

      <nav className="doca" aria-label="Seções">
        {SECOES.map(([id, t, ic]) => (
          <a key={id} href={`/#${id}`} className={ativa === id ? 'ativa' : ''} aria-label={t} aria-current={ativa === id ? 'true' : undefined} onClick={(e) => ir(e, id)}>
            <Icone nome={ic} tamanho={21} />
          </a>
        ))}
      </nav>
    </>
  )
}
