import dados from '../dados/contribuicoes.json'
import { perfil } from '../dados/perfil.js'
import './contribuicoes.css'

// Calendário real de contribuições do GitHub (dados salvos no build).
const nivel = (n) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4)
const data = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export default function Contribuicoes() {
  return (
    <div className="contrib">
      <div className="contrib__topo">
        <p>
          <strong>{dados.total} contribuições</strong> no último ano
        </p>
        <a className="link mono" href={perfil.github} target="_blank" rel="noreferrer">
          @yan791 <span className="seta">↗</span>
        </a>
      </div>
      <div className="contrib__grade" role="img" aria-label={`${dados.total} contribuições no GitHub entre ${data(dados.de)} e ${data(dados.ate)}`}>
        {dados.semanas.map((s, i) => (
          <div key={i} className="contrib__semana" style={{ '--i': i }}>
            {s.map((n, k) => (
              <i key={k} className={`n${nivel(n)}`} title={n ? `${n} contribuições` : undefined} />
            ))}
          </div>
        ))}
      </div>
      <div className="contrib__pe mono">
        <span>
          {data(dados.de)} a {data(dados.ate)}
        </span>
        <span className="contrib__legenda" aria-hidden="true">
          menos <i className="n0" />
          <i className="n1" />
          <i className="n2" />
          <i className="n3" />
          <i className="n4" /> mais
        </span>
      </div>
    </div>
  )
}
