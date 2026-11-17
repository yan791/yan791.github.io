import { useMemo, useState } from 'react'
import { exemplosEscalonador } from '../dados/laboratorio.js'
import { formatarSaida, lerEntrada, paraTexto, simular } from '../lib/escalonamento.js'
import './escalonador-interativo.css'

const MOTIVOS = {
  F: 'terminou',
  H: 'preemptada, continua ativa',
  L: 'perdeu o prazo',
  K: 'encerrada pelo fim da simulação',
}
const LIMITE = { tarefas: 5, tempo: 60, valor: 40 }

function clonar(ex) {
  return { tempoTotal: ex.tempoTotal, tarefas: ex.tarefas.map((t) => ({ ...t })) }
}

function Numero({ rotulo, valor, aoMudar, min = 1, max = LIMITE.valor }) {
  return (
    <span className="numero">
      <button type="button" aria-label={`Diminuir ${rotulo}`} onClick={() => aoMudar(Math.max(min, valor - 1))}>
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={rotulo}
        value={valor}
        min={min}
        max={max}
        onChange={(e) => aoMudar(Math.min(max, Math.max(0, Math.round(+e.target.value || 0))))}
      />
      <button type="button" aria-label={`Aumentar ${rotulo}`} onClick={() => aoMudar(Math.min(max, valor + 1))}>
        +
      </button>
    </span>
  )
}

export default function EscalonadorInterativo() {
  const [alg, setAlg] = useState('rate')
  const [exemplo, setExemplo] = useState(exemplosEscalonador[1].id)
  const [entrada, setEntrada] = useState(() => clonar(exemplosEscalonador[1]))
  const [copiado, setCopiado] = useState(false)
  const [versao, setVersao] = useState(0)

  const lida = useMemo(() => lerEntrada(paraTexto(entrada)), [entrada])
  const resultados = useMemo(() => {
    if (lida.erro) return null
    return { rate: simular(lida, 'rate'), edf: simular(lida, 'edf') }
  }, [lida])
  const r = resultados?.[alg]
  const saida = r ? formatarSaida(r, alg) : ''

  const escolherExemplo = (ex) => {
    setExemplo(ex.id)
    setEntrada(clonar(ex))
    setVersao((v) => v + 1)
  }
  const mudarTarefa = (i, campo, valor) => {
    setExemplo(null)
    setEntrada((e) => ({ ...e, tarefas: e.tarefas.map((t, k) => (k === i ? { ...t, [campo]: valor } : t)) }))
  }
  const trocarAlg = (a) => {
    setAlg(a)
    setVersao((v) => v + 1)
  }
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(saida)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1600)
    } catch {
      /* sem permissão de área de transferência */
    }
  }

  const perdidas = (a) => resultados?.[a].tarefas.reduce((s, t) => s + t.perdidas, 0)
  const T = entrada.tempoTotal
  const cores = ['var(--sinal)', 'var(--fosforo)', '#c9b8ff', '#9fe0b4', '#f2d17a']

  return (
    <div className="esc tema-tinta">
      <div className="esc__topo">
        <div className="esc__alg" role="radiogroup" aria-label="Algoritmo">
          {[
            ['rate', 'Rate-Monotonic'],
            ['edf', 'EDF'],
          ].map(([v, t]) => (
            <button key={v} type="button" role="radio" aria-checked={alg === v} onClick={() => trocarAlg(v)}>
              {t}
              {resultados ? <span className="mono">{perdidas(v)} perdido{perdidas(v) === 1 ? '' : 's'}</span> : null}
            </button>
          ))}
        </div>
        <div className="esc__exemplos">
          <span className="rotulo">Exemplos</span>
          {exemplosEscalonador.map((ex) => (
            <button key={ex.id} type="button" className={`esc__exemplo${exemplo === ex.id ? ' ativo' : ''}`} onClick={() => escolherExemplo(ex)}>
              {ex.nome}
            </button>
          ))}
        </div>
      </div>

      <div className="esc__corpo">
        <div className="esc__entrada">
          <p className="rotulo">entrada.txt</p>
          <div className="esc__tempo">
            <span>Tempo total</span>
            <Numero rotulo="tempo total" valor={T} max={LIMITE.tempo} aoMudar={(v) => (setExemplo(null), setEntrada((e) => ({ ...e, tempoTotal: v })))} />
          </div>
          <table className="esc__tabela">
            <thead>
              <tr>
                <th scope="col">Tarefa</th>
                <th scope="col" title="Período">P</th>
                <th scope="col" title="Deadline relativo">D</th>
                <th scope="col" title="Tempo de CPU (burst)">C</th>
                <th scope="col">
                  <span className="so-leitor">Remover</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {entrada.tarefas.map((t, i) => (
                <tr key={i}>
                  <th scope="row">
                    <span className="esc__cor" style={{ background: cores[i] }} aria-hidden="true" />
                    <input
                      className="esc__nome mono"
                      aria-label={`Nome da tarefa ${i + 1}`}
                      value={t.nome}
                      maxLength={8}
                      onChange={(e) => mudarTarefa(i, 'nome', e.target.value.replace(/\s/g, '').toUpperCase() || 'T')}
                    />
                  </th>
                  <td>
                    <Numero rotulo={`período de ${t.nome}`} valor={t.periodo} aoMudar={(v) => mudarTarefa(i, 'periodo', v)} />
                  </td>
                  <td>
                    <Numero rotulo={`deadline de ${t.nome}`} valor={t.deadline} aoMudar={(v) => mudarTarefa(i, 'deadline', v)} />
                  </td>
                  <td>
                    <Numero rotulo={`burst de ${t.nome}`} valor={t.burst} aoMudar={(v) => mudarTarefa(i, 'burst', v)} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="esc__remover"
                      aria-label={`Remover ${t.nome}`}
                      disabled={entrada.tarefas.length <= 1}
                      onClick={() => (setExemplo(null), setEntrada((e) => ({ ...e, tarefas: e.tarefas.filter((_, k) => k !== i) })))}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="esc__mais"
            disabled={entrada.tarefas.length >= LIMITE.tarefas}
            onClick={() => (setExemplo(null), setEntrada((e) => ({ ...e, tarefas: [...e.tarefas, { nome: `T${e.tarefas.length + 1}`, periodo: 10, deadline: 10, burst: 1 }] })))}
          >
            + tarefa
          </button>
          {lida.erro ? (
            <p className="esc__erro mono" role="alert">
              {lida.erro}
            </p>
          ) : null}
        </div>

        <div className="esc__saida">
          <div className="esc__gantt" aria-live="polite">
            {r ? (
              <figure key={`${alg}-${versao}-${paraTexto(entrada)}`} className="esc__fig" style={{ '--T': T }}>
                <div className="esc__escala mono" aria-hidden="true">
                  {Array.from({ length: Math.floor(T / 5) + 1 }, (_, k) => (
                    <span key={k} style={{ left: `${((k * 5) / T) * 100}%` }}>
                      {k * 5}
                    </span>
                  ))}
                </div>
                {r.tarefas.map((t, i) => (
                  <div className="esc__linha" key={i}>
                    <span className="esc__rot mono">{t.nome}</span>
                    <div className="esc__trilho">
                      {r.eventos.chegadas
                        .filter((c) => c.tarefa === i)
                        .map((c, k) => (
                          <span key={`c${k}`} className="esc__chegada" style={{ left: `${(c.tempo / T) * 100}%` }} title={`chegada em ${c.tempo}`} />
                        ))}
                      {r.trechos
                        .filter((s) => s.tarefa === i)
                        .map((s, k) => (
                          <span
                            key={k}
                            className={`esc__trecho esc__trecho--${s.motivo}`}
                            style={{
                              left: `${(s.inicio / T) * 100}%`,
                              width: `${((s.fim - s.inicio) / T) * 100}%`,
                              '--c': cores[i],
                              '--d': `${(s.inicio / T) * 900}ms`,
                            }}
                            title={`${t.nome}: ${s.inicio} a ${s.fim} · ${s.motivo} (${MOTIVOS[s.motivo] ?? ''})`}
                          >
                            <i>{s.fim - s.inicio > 1 || T <= 20 ? s.motivo : ''}</i>
                          </span>
                        ))}
                      {r.eventos.perdas
                        .filter((p) => p.tarefa === i)
                        .map((p, k) => (
                          <span key={`p${k}`} className="esc__perda" style={{ left: `${(p.tempo / T) * 100}%` }} title={`prazo perdido em ${p.tempo}`}>
                            <b>prazo</b>
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
                <div className="esc__linha esc__linha--cpu">
                  <span className="esc__rot mono">CPU</span>
                  <div className="esc__trilho">
                    {r.trechos.map((s, k) => (
                      <span
                        key={k}
                        className={`esc__trecho esc__trecho--cpu${s.tarefa === -1 ? ' idle' : ''}`}
                        style={{
                          left: `${(s.inicio / T) * 100}%`,
                          width: `${((s.fim - s.inicio) / T) * 100}%`,
                          '--c': s.tarefa === -1 ? 'transparent' : cores[s.tarefa],
                          '--d': `${(s.inicio / T) * 900}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <figcaption className="so-leitor">
                  Gantt do {alg === 'rate' ? 'Rate-Monotonic' : 'EDF'}: {r.trechos.length} trechos, {perdidas(alg)} prazos perdidos.
                </figcaption>
              </figure>
            ) : (
              <p className="esc__vazio mono">Corrija a entrada para ver o escalonamento.</p>
            )}
          </div>
          <dl className="esc__legenda mono">
            {Object.entries(MOTIVOS).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <div>
              <dt className="esc__legenda-perda" aria-hidden="true" />
              <dd>prazo perdido</dd>
            </div>
          </dl>

          <div className="esc__arquivo">
            <div className="esc__arquivo-topo">
              <span className="rotulo">{alg}_yrn.out</span>
              <button type="button" className="mono" onClick={copiar} disabled={!saida}>
                {copiado ? 'copiado' : 'copiar'}
              </button>
            </div>
            <pre className="mono" tabIndex={0} aria-label={`Conteúdo do arquivo ${alg}_yrn.out`}>
              {saida || '...'}
            </pre>
          </div>
        </div>
      </div>
      <p className="esc__nota mono">
        Visualização em JavaScript com as mesmas regras do programa em C. A saída acima é testada contra a saída real do binário em 16 casos.
      </p>
    </div>
  )
}
