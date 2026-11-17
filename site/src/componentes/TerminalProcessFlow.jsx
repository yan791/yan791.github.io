import { useEffect, useRef, useState } from 'react'
import { reduzido } from '../lib/movimento.js'
import './terminal.css'

// Sessão no modo interativo do ProcessFlow. As mensagens são as do código (processflow.c);
// partes que mudam a cada execução (PID, saída do pipe) aparecem marcadas, nunca inventadas.
const V = (t) => ({ variavel: t })
const PASSOS = [
  { cmd: './processflow', shell: true, saida: ['ProcessFlow iniciado.'], fase: 0 },
  { cmd: 'task listar /bin/ls -l', saida: ["Tarefa 'listar' cadastrada."], fase: 1 },
  { cmd: 'task ordenar /usr/bin/sort', saida: ["Tarefa 'ordenar' cadastrada."], fase: 2 },
  { cmd: 'task contar /usr/bin/wc -l', saida: ["Tarefa 'contar' cadastrada."], fase: 3 },
  { cmd: 'run pipe listar ordenar contar', saida: [V('saída de ls -l | sort | wc -l')], fase: 4 },
  { cmd: 'task sono /bin/sleep 2', saida: ["Tarefa 'sono' cadastrada."], fase: 5 },
  { cmd: 'start sono', saida: [['[1] ', V('pid')]], fase: 6 },
  { cmd: 'jobs', saida: [['[1] ', V('pid'), ' Running sono']], fase: 7 },
  { cmd: 'exit', saida: [], fase: 8 },
]

function Saida({ s }) {
  const partes = Array.isArray(s) ? s : [s]
  return (
    <span className="term__saida">
      {partes.map((p, i) =>
        typeof p === 'string' ? (
          <span key={i}>{p}</span>
        ) : (
          <span key={i} className="term__var" title="varia a cada execução">
            ‹{p.variavel}›
          </span>
        ),
      )}
    </span>
  )
}

export default function TerminalProcessFlow({ diagrama = true, semMoldura = false }) {
  const caixa = useRef(null)
  const corpo = useRef(null)
  const [estado, setEstado] = useState({ passo: reduzido() ? PASSOS.length : 0, letras: 0, saida: reduzido() })
  const fase = estado.passo >= PASSOS.length ? 8 : PASSOS[estado.passo].fase - (estado.saida ? 0 : 1)

  useEffect(() => {
    if (reduzido()) return
    let visivel = false
    let timer = 0
    let s = { passo: 0, letras: 0, saida: false }
    const avancar = () => {
      if (!visivel) return
      const p = PASSOS[s.passo]
      if (!p) {
        timer = setTimeout(() => {
          s = { passo: 0, letras: 0, saida: false }
          setEstado(s)
          avancar()
        }, 4200)
        return
      }
      if (s.letras < p.cmd.length) {
        s = { ...s, letras: s.letras + 1 }
        setEstado(s)
        timer = setTimeout(avancar, 24 + Math.random() * 30)
      } else if (!s.saida) {
        s = { ...s, saida: true }
        setEstado(s)
        timer = setTimeout(avancar, p.fase === 4 || p.fase === 6 ? 1600 : 700)
      } else {
        s = { passo: s.passo + 1, letras: 0, saida: false }
        setEstado(s)
        timer = setTimeout(avancar, 260)
      }
    }
    const io = new IntersectionObserver(([e]) => {
      const antes = visivel
      visivel = e.isIntersecting
      if (visivel && !antes) avancar()
      if (!visivel) clearTimeout(timer)
    }, { threshold: 0.35 })
    io.observe(caixa.current)
    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const c = corpo.current
    if (c) c.scrollTop = c.scrollHeight
  }, [estado])

  const linhas = []
  PASSOS.forEach((p, i) => {
    if (i > estado.passo) return
    const atual = i === estado.passo
    const texto = atual ? p.cmd.slice(0, estado.letras) : p.cmd
    linhas.push(
      <p key={`c${i}`} className="term__linha">
        <span className="term__prompt">{p.shell ? '$' : 'processflow>'}</span> {texto}
        {atual && !estado.saida ? <span className="term__cursor" /> : null}
      </p>,
    )
    if (!atual || estado.saida) p.saida.forEach((s, k) => linhas.push(<p key={`s${i}-${k}`} className="term__linha"><Saida s={s} /></p>))
  })

  const tarefas = ['listar', 'ordenar', 'contar', 'sono'].filter((_, k) => fase >= k + 1 + (k === 3 ? 1 : 0))

  return (
    <div className={`term${semMoldura ? ' term--sem-moldura' : ''}`} ref={caixa}>
      <div className="term__janela">
        <div className="term__barra">
          <span />
          <span />
          <span />
          <p className="mono">yan@ubuntu: ~/processflow</p>
        </div>
        <div className="term__corpo mono" ref={corpo} aria-label="Sessão do ProcessFlow no modo interativo" role="log">
          {linhas}
        </div>
      </div>

      {diagrama ? (
      <svg className={`term__diagrama fase-${fase}`} viewBox="0 0 560 300" role="img" aria-label="Diagrama: o processo pai cria um filho por tarefa com fork e execvp, liga os filhos por pipes com dup2 e recolhe o job em segundo plano pelo SIGCHLD.">
        <defs>
          <marker id="seta" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="currentColor" />
          </marker>
        </defs>
        <g className="d-pai">
          <rect x="200" y="14" width="160" height="40" rx="8" />
          <text x="280" y="39">processflow (pai)</text>
        </g>
        <g className="d-tabela">
          <text x="14" y="30" className="d-rot">tarefas</text>
          {tarefas.map((t, k) => (
            <text key={t} x="14" y={52 + k * 18} className="d-item">
              {t}
            </text>
          ))}
        </g>

        <g className="d-pipe">
          {[
            ['ls -l', 70],
            ['sort', 230],
            ['wc -l', 390],
          ].map(([n, x], k) => (
            <g key={n}>
              <path className="d-fork" d={`M280 54 C 280 90, ${x + 50} 90, ${x + 50} 126`} />
              <rect x={x} y="126" width="100" height="40" rx="8" />
              <text x={x + 50} y="151">{n}</text>
              {k < 2 ? (
                <>
                  <path className="d-cano" d={`M${x + 100} 146 L${x + 160} 146`} markerEnd="url(#seta)" />
                  <text x={x + 130} y="138" className="d-mini">pipe</text>
                </>
              ) : (
                <>
                  <path className="d-cano" d={`M${x + 50} 166 L${x + 50} 196`} markerEnd="url(#seta)" />
                  <text x={x + 50} y="212" className="d-mini">terminal</text>
                </>
              )}
            </g>
          ))}
          <text x="200" y="104" className="d-mini d-esq">fork + execvp</text>
          <text x="280" y="190" className="d-mini">dup2: stdout → pipe → stdin</text>
        </g>

        <g className="d-job">
          <path className="d-fork" d="M330 54 C 470 70, 480 220, 470 236" />
          <rect x="390" y="236" width="150" height="40" rx="8" />
          <text x="465" y="261">sleep 2 · job [1]</text>
          <text x="465" y="292" className="d-mini d-estado">segundo plano</text>
          <path className="d-sinal" d="M390 256 C 250 256, 220 120, 240 58" markerEnd="url(#seta)" />
          <text x="214" y="240" className="d-mini d-sinal-txt">SIGCHLD → waitpid</text>
        </g>
      </svg>
      ) : null}
    </div>
  )
}
