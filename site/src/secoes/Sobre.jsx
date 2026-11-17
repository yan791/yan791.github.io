import { useState } from 'react'
import Lightbox from '../componentes/Lightbox.jsx'
import Contribuicoes from '../componentes/Contribuicoes.jsx'
import { sobre } from '../dados/perfil.js'
import { useEmCena } from '../lib/visivel.js'
import './sobre.css'

function Texto() {
  // o primeiro parágrafo destaca a expressão principal
  const [antes, depois] = sobre.paragrafos[0].split(sobre.destaque)
  return (
    <>
      <p>
        {antes}
        <mark>{sobre.destaque}</mark>
        {depois}
      </p>
      {sobre.paragrafos.slice(1).map((p) => (
        <p key={p}>{p}</p>
      ))}
    </>
  )
}

const ICONES = {
  curso: 'M3 9.5 12 5l9 4.5-9 4.5zM7 11.6V16c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.4M21 9.5V14',
  infra: 'M5 5h14v6H5zM5 13h14v6H5zM8 8h.01M8 16h.01',
  agora: 'M4 19h16M6 16l3.5-5 3 3L17 8l2 2',
}

export default function Sobre() {
  const [ref, visto] = useEmCena({ limiar: 0.08 })
  const [cert, setCert] = useState(false)
  return (
    <section id="sobre" className="secao sobre">
      <div ref={ref} className={`conteiner${visto ? ' em-cena' : ''}`}>
        <header className="secao__cabeca">
          <p className="secao__numero revelar">01</p>
          <p className="secao__rotulo revelar" style={{ '--i': 1 }}>
            Sobre
          </p>
          <h2 className="secao__titulo revelar" style={{ '--i': 2 }}>
            {sobre.titulo}
          </h2>
        </header>

        <div className="bento">
          <div className="cartao cartao--vivo bento__texto revelar" style={{ '--i': 2 }}>
            <Texto />
          </div>

          <figure className="cartao bento__foto revelar" style={{ '--i': 3 }}>
            <img src={sobre.foto.src} alt={sobre.foto.alt} width="400" height="400" loading="lazy" decoding="async" />
            <figcaption className="mono">
              <span>Yan Ribeiro Nunes</span>
              <span>Recife, PE</span>
            </figcaption>
          </figure>

          <figure className="cartao bento__mostra revelar" style={{ '--i': 4 }}>
            <img src={sobre.mostra.src} alt={sobre.mostra.alt} width="800" height="600" loading="lazy" decoding="async" />
            <figcaption>
              <span className="selo">{sobre.mostra.titulo}</span>
              <p>{sobre.mostra.texto}</p>
              <div className="bento__mostra-pe">
                <span className="mono">{sobre.mostra.quando}</span>
                <button type="button" className="link" onClick={() => setCert(true)}>
                  Ver certificado <span className="seta">↗</span>
                </button>
              </div>
            </figcaption>
          </figure>

          {sobre.cartoes.map((c, i) => (
            <article key={c.titulo} className="cartao cartao--vivo bento__mini revelar" style={{ '--i': 5 + i }}>
              <div className="bento__mini-topo">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={ICONES[c.icone]} />
                </svg>
                {c.agora ? (
                  <span className="bento__agora mono">
                    <span className="ponto-vivo" aria-hidden="true" /> agora
                  </span>
                ) : null}
              </div>
              <h3>{c.titulo}</h3>
              {!c.agora ? <p className="mono bento__onde">{c.onde}</p> : null}
              <p className="bento__mini-texto">{c.texto}</p>
            </article>
          ))}

          <div className="cartao bento__github revelar" style={{ '--i': 8 }}>
            <Contribuicoes />
          </div>
        </div>
      </div>
      <Lightbox aberto={cert} aoFechar={() => setCert(false)} src={sobre.mostra.certificado} alt={sobre.mostra.certificadoAlt} legenda="Mostra TechDesign 2024.2 · CESAR School" />
    </section>
  )
}
