import { useEffect, useRef, useState } from 'react'
import Icone from '../../componentes/Icone.jsx'
import { hero, perfil } from '../../dados/perfil.js'
import { irPara } from '../../lib/rolagem.js'
import { reduzido } from '../../lib/movimento.js'
import { iniciarFundo } from './fundo.js'
import './hero.css'

// Frase que se escreve e se apaga, trocando o que ele constrói.
function Rotativo({ frases }) {
  const [txt, setTxt] = useState(frases[0])
  useEffect(() => {
    if (reduzido()) return
    let i = 0
    let n = frases[0].length
    let apagando = true
    let t = setTimeout(function passo() {
      const alvo = frases[i]
      if (apagando) {
        n--
        if (n <= 0) {
          apagando = false
          i = (i + 1) % frases.length
          t = setTimeout(passo, 260)
          setTxt('')
          return
        }
        setTxt(alvo.slice(0, n))
        t = setTimeout(passo, 22)
      } else {
        n++
        setTxt(frases[i].slice(0, n))
        if (n >= frases[i].length) {
          apagando = true
          t = setTimeout(passo, 2400)
          return
        }
        t = setTimeout(passo, 42)
      }
    }, 2600)
    return () => clearTimeout(t)
  }, [frases])
  return (
    <span className="rotativo">
      <span className="so-leitor">{frases.join(', ')}</span>
      <span aria-hidden="true">
        {txt}
        <i className="rotativo__cursor" />
      </span>
    </span>
  )
}

export default function Hero() {
  const area = useRef(null)
  const canvas = useRef(null)
  const [entrou, setEntrou] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true))
    const parar = iniciarFundo(canvas.current, area.current)
    return () => {
      cancelAnimationFrame(id)
      parar()
    }
  }, [])

  return (
    <section id="inicio" ref={area} className={`hero${entrou ? ' em-cena' : ''}`}>
      <canvas ref={canvas} className="hero__fractal" aria-hidden="true" />
      <div className="hero__grade" aria-hidden="true" />
      <div className="conteiner hero__conteudo">
        <h1 className="hero__nome revelar">{perfil.nome}</h1>
        <p className="hero__linha revelar" style={{ '--i': 1 }}>
          {hero.linha}
        </p>
        <p className="hero__linha hero__linha--forte revelar" style={{ '--i': 2 }}>
          Construo <Rotativo frases={hero.rotativo} />
        </p>
        <div className="hero__acoes revelar" style={{ '--i': 3 }}>
          <a
            className="botao botao--sinal"
            href="#projetos"
            onClick={(e) => {
              e.preventDefault()
              irPara('#projetos')
            }}
          >
            Ver projetos <Icone nome="baixo" tamanho={16} />
          </a>
          <a className="botao" href={perfil.curriculo} target="_blank" rel="noreferrer">
            <Icone nome="download" tamanho={16} /> Baixar currículo
          </a>
        </div>
      </div>
      <div className="conteiner hero__credenciais revelar" style={{ '--i': 5 }}>
        <ul className="mono">
          {hero.credenciais.map((c, i) => (
            <li key={c}>
              {i === hero.credenciais.length - 1 ? <span className="ponto-vivo" aria-hidden="true" /> : <span className="hero__ponto" aria-hidden="true" />}
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
