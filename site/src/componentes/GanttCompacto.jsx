import { useMemo, useState } from 'react'
import { exemplosEscalonador } from '../dados/laboratorio.js'
import { simular } from '../lib/escalonamento.js'
import './gantt-compacto.css'

const CORES = ['var(--sinal)', 'var(--fosforo)', '#c9b8ff', '#9fe0b4', '#f2d17a']

// Gantt do caso em que o Rate-Monotonic perde um prazo e o EDF não.
export default function GanttCompacto({ aoAbrir }) {
  const ex = exemplosEscalonador[1]
  const [alg, setAlg] = useState('rate')
  const r = useMemo(() => ({ rate: simular(ex, 'rate'), edf: simular(ex, 'edf') }), [ex])
  const atual = r[alg]
  const T = ex.tempoTotal
  const perdidos = (a) => r[a].tarefas.reduce((s, t) => s + t.perdidas, 0)
  return (
    <div className="gc">
      <div className="gc__topo">
        <div className="gc__alg" role="radiogroup" aria-label="Algoritmo">
          {[
            ['rate', 'Rate-Monotonic'],
            ['edf', 'EDF'],
          ].map(([v, t]) => (
            <button key={v} type="button" role="radio" aria-checked={alg === v} onClick={() => setAlg(v)}>
              {t}
            </button>
          ))}
        </div>
        <p className="gc__resumo mono" aria-live="polite">
          {perdidos(alg)} prazo{perdidos(alg) === 1 ? '' : 's'} perdido{perdidos(alg) === 1 ? '' : 's'}
        </p>
      </div>
      <div className="gc__grafico" key={alg} style={{ '--T': T }}>
        {atual.tarefas.map((t, i) => (
          <div className="gc__linha" key={t.nome}>
            <span className="gc__rot mono">{t.nome}</span>
            <div className="gc__trilho">
              {atual.trechos
                .filter((s) => s.tarefa === i)
                .map((s, k) => (
                  <span
                    key={k}
                    className={`gc__trecho gc__trecho--${s.motivo}`}
                    style={{ left: `${(s.inicio / T) * 100}%`, width: `${((s.fim - s.inicio) / T) * 100}%`, '--c': CORES[i], '--d': `${(s.inicio / T) * 700}ms` }}
                  />
                ))}
              {atual.eventos.perdas
                .filter((p) => p.tarefa === i)
                .map((p, k) => (
                  <span key={`p${k}`} className="gc__perda" style={{ left: `${(p.tempo / T) * 100}%` }}>
                    <b className="mono">prazo</b>
                  </span>
                ))}
            </div>
          </div>
        ))}
        <div className="gc__eixo mono" aria-hidden="true">
          <span>0</span>
          <span>{T}</span>
        </div>
      </div>
      <div className="gc__pe">
        <p className="mono">
          {ex.tarefas.map((t) => `${t.nome} ${t.periodo} ${t.deadline} ${t.burst}`).join(' · ')} · tempo {T}
        </p>
        {aoAbrir ? (
          <button type="button" className="link" onClick={aoAbrir}>
            Abrir o simulador <span className="seta">↗</span>
          </button>
        ) : null}
      </div>
    </div>
  )
}
