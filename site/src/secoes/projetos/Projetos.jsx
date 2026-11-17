import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import VideoLoop from '../../componentes/VideoLoop.jsx'
import TerminalProcessFlow from '../../componentes/TerminalProcessFlow.jsx'
import GanttCompacto from '../../componentes/GanttCompacto.jsx'
import EscalonadorInterativo from '../../componentes/EscalonadorInterativo.jsx'
import { destaque, maisCoisas, projetos, projetosIntro } from '../../dados/projetos.js'
import { perfil } from '../../dados/perfil.js'
import { useEmCena } from '../../lib/visivel.js'
import { irPara, pararTemporario } from '../../lib/rolagem.js'
import './projetos.css'

function Moldura({ endereco, children }) {
  return (
    <div className="moldura">
      <div className="moldura__barra" aria-hidden="true">
        <i />
        <i />
        <i />
        <span className="mono">{endereco}</span>
      </div>
      <div className="moldura__tela">{children}</div>
    </div>
  )
}

function Midia({ p, aoAbrirSimulador }) {
  if (p.midia) {
    return (
      <Moldura endereco={p.endereco}>
        <VideoLoop midia={p.midia} alt={p.alt} />
      </Moldura>
    )
  }
  if (p.imagem) {
    return (
      <Moldura endereco={p.endereco}>
        <img className="projeto__imagem" src={p.imagem.src} alt={p.imagem.alt} width={p.imagem.largura} height={p.imagem.altura} loading="lazy" decoding="async" />
      </Moldura>
    )
  }
  if (p.terminal) return <TerminalProcessFlow diagrama={false} />
  if (p.gantt) {
    return (
      <div className="projeto__painel">
        <GanttCompacto aoAbrir={aoAbrirSimulador} />
      </div>
    )
  }
  return null
}

function Destaque({ p }) {
  return (
    <article className="cartao cartao--vivo projeto projeto--largo revelar" style={{ '--i': 3 }} aria-labelledby={`nome-${p.slug}`}>
      <div className="projeto__midia">
        <Midia p={p} />
      </div>
      <div className="projeto__corpo">
        <p className="projeto__meta mono">
          <span>{p.meta.join(' · ')}</span>
          {p.selo ? (
            <span className={`selo${p.selo === 'No ar' ? '' : ' selo--neutro'}`}>
              {p.selo === 'No ar' ? <span className="ponto-vivo" aria-hidden="true" /> : null}
              {p.selo}
            </span>
          ) : null}
        </p>
        <h3 id={`nome-${p.slug}`} className="projeto__nome">
          {p.nome}
        </h3>
        <p className="projeto__frase">{p.frase}</p>
        <ul className="projeto__feitos">
          {p.feitos.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <ul className="chips" aria-label="Tecnologias">
          {p.stack.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>
        <div className="projeto__links">
          {p.links.site ? (
            <a className="link" href={p.links.site} target="_blank" rel="noreferrer">
              Ver site <span className="seta">↗</span>
              <span className="so-leitor">: {p.nome}</span>
            </a>
          ) : null}
          {p.links.codigo ? (
            <a className="link" href={p.links.codigo} target="_blank" rel="noreferrer">
              Código <span className="seta">↗</span>
              <span className="so-leitor">: {p.nome}</span>
            </a>
          ) : null}
        </div>
        {p.nota ? <p className="projeto__nota mono">{p.nota}</p> : null}
      </div>
    </article>
  )
}

// lista à esquerda e prévia do projeto aberto à direita; no celular vira um acordeão com a mídia dentro
const LARGO = '(min-width: 961px)'
function useLargo() {
  return useSyncExternalStore(
    (f) => {
      const m = matchMedia(LARGO)
      m.addEventListener('change', f)
      return () => m.removeEventListener('change', f)
    },
    () => matchMedia(LARGO).matches,
    () => true,
  )
}

function Detalhe({ p }) {
  return (
    <>
      <p className="vitrine__meta mono">{p.meta.join(' · ')}</p>
      <p className="vitrine__frase">{p.frase}</p>
      <ul className="projeto__feitos">
        {p.feitos.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <ul className="chips" aria-label="Tecnologias">
        {p.stack.map((s) => (
          <li key={s} className="chip">
            {s}
          </li>
        ))}
      </ul>
      <div className="projeto__links">
        {p.links.codigo ? (
          <a className="link" href={p.links.codigo} target="_blank" rel="noreferrer">
            Código <span className="seta">↗</span>
            <span className="so-leitor">: {p.nome}</span>
          </a>
        ) : null}
      </div>
      {p.nota ? <p className="projeto__nota mono">{p.nota}</p> : null}
    </>
  )
}

function Vitrine({ aoAbrirSimulador }) {
  const [ativo, setAtivo] = useState(0)
  const largo = useLargo()
  const botoes = useRef([])
  const itens = useRef([])
  const atual = projetos[ativo]

  // no celular o item aberto acima fecha e o tocado sobe; se ele sair da tela, a página volta até ele
  const abrir = (i) => {
    setAtivo(i)
    if (largo || i === ativo) return
    setTimeout(() => {
      const el = itens.current[i]
      if (el && el.getBoundingClientRect().top < 56) irPara(el)
    }, 600)
  }

  const teclas = (e, i) => {
    const passo = { ArrowDown: 1, ArrowUp: -1 }[e.key]
    if (!passo) return
    e.preventDefault()
    const n = (i + passo + projetos.length) % projetos.length
    botoes.current[n]?.focus()
  }

  return (
    <div className="vitrine cartao revelar" style={{ '--i': 4 }}>
      <ol className="vitrine__lista">
        {projetos.map((p, i) => {
          const aberto = i === ativo
          return (
            <li key={p.slug} ref={(el) => (itens.current[i] = el)} className={`vitrine__item${aberto ? ' esta-aberto' : ''}`}>
              <h3 className="vitrine__cabeca">
                <button
                  ref={(el) => (botoes.current[i] = el)}
                  type="button"
                  className="vitrine__botao"
                  aria-expanded={aberto}
                  aria-controls={`vitrine-${p.slug}`}
                  onClick={() => abrir(i)}
                  onKeyDown={(e) => teclas(e, i)}
                >
                  <span className="vitrine__n mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="vitrine__nome">{p.nome}</span>
                  <span className="vitrine__tipo mono">{p.tipo}</span>
                  <span className="vitrine__sinal" aria-hidden="true" />
                </button>
              </h3>
              <div id={`vitrine-${p.slug}`} className="vitrine__painel" inert={!aberto}>
                <div className="vitrine__dentro">
                  <div className="vitrine__conteudo">
                    {!largo && aberto ? (
                      <div className="vitrine__midia-movel">
                        <Midia p={p} aoAbrirSimulador={aoAbrirSimulador} />
                      </div>
                    ) : null}
                    <Detalhe p={p} />
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
      {largo ? (
        <div className="vitrine__palco">
          <div key={atual.slug} className="vitrine__cena">
            <Midia p={atual} aoAbrirSimulador={aoAbrirSimulador} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Simulador({ aberto, aoFechar }) {
  const d = useRef(null)
  useEffect(() => {
    const el = d.current
    if (aberto && !el.open) {
      el.showModal()
      pararTemporario(true)
    }
    if (!aberto && el.open) el.close()
  }, [aberto])
  return (
    <dialog
      ref={d}
      className="simulador"
      aria-label="Simulador do escalonador"
      onClose={() => {
        pararTemporario(false)
        aoFechar()
      }}
      onClick={(e) => e.target === d.current && aoFechar()}
    >
      <div className="simulador__topo">
        <div>
          <p className="secao__rotulo">Escalonador RM × EDF</p>
          <p className="simulador__titulo">Troque o algoritmo, escolha um exemplo ou edite as tarefas.</p>
        </div>
        <button type="button" className="botao" onClick={aoFechar}>
          Fechar
        </button>
      </div>
      {aberto ? <EscalonadorInterativo /> : null}
    </dialog>
  )
}

export default function Projetos() {
  const [ref, visto] = useEmCena({ limiar: 0.04 })
  const [simulador, setSimulador] = useState(false)
  return (
    <section id="projetos" className="secao projetos">
      <div ref={ref} className={`conteiner${visto ? ' em-cena' : ''}`}>
        <header className="secao__cabeca">
          <p className="secao__numero revelar">02</p>
          <p className="secao__rotulo revelar" style={{ '--i': 1 }}>
            Projetos
          </p>
          <h2 className="secao__titulo revelar" style={{ '--i': 2 }}>
            {projetosIntro.titulo}
          </h2>
          <p className="secao__apoio revelar" style={{ '--i': 3 }}>
            {projetosIntro.apoio}
          </p>
        </header>

        <Destaque p={destaque} />
        <Vitrine aoAbrirSimulador={() => setSimulador(true)} />

        <div className="mais">
          <div className="mais__topo">
            <h3 className="mais__titulo">Mais projetos que fiz</h3>
            <a className="link" href={perfil.repositorios} target="_blank" rel="noreferrer">
              Todos os repositórios <span className="seta">↗</span>
            </a>
          </div>
          <ul className="mais__lista">
            {maisCoisas.map((m) => {
              const conteudo = (
                <>
                  <span className="mais__nome">
                    {m.nome}
                    {m.selo ? <span className={`selo${m.destaque ? '' : ' selo--neutro'}`}>{m.selo}</span> : null}
                  </span>
                  <span className="mais__texto">{m.texto}</span>
                  <span className="mais__ano mono">{m.ano}</span>
                  <span className="mais__seta" aria-hidden="true">
                    {m.link ? '↗' : ''}
                  </span>
                </>
              )
              return (
                <li key={m.nome}>
                  {m.link ? (
                    <a className="mais__item" href={m.link} target="_blank" rel="noreferrer">
                      {conteudo}
                    </a>
                  ) : (
                    <div className="mais__item">{conteudo}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <Simulador aberto={simulador} aoFechar={() => setSimulador(false)} />
    </section>
  )
}
