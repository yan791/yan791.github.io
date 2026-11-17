import { marcos, trajetoriaIntro } from '../dados/trajetoria.js'
import { useEmCena } from '../lib/visivel.js'
import './trajetoria.css'

function Marco({ m, i }) {
  const [ref, visto] = useEmCena({ limiar: 0.3 })
  return (
    <li ref={ref} className={`marco${visto ? ' em-cena' : ''}${m.destaque ? ' marco--destaque' : ''}`}>
      <p className="marco__quando mono revelar">{m.quando}</p>
      <span className="marco__ponto" aria-hidden="true" />
      <div className="cartao cartao--vivo marco__cartao revelar" style={{ '--i': 1 }}>
        <p className="marco__onde mono">{m.onde}</p>
        <h3>{m.titulo}</h3>
        <p className="marco__texto">{m.texto}</p>
      </div>
    </li>
  )
}

export default function Trajetoria() {
  const [ref, visto] = useEmCena({ limiar: 0.2 })
  return (
    <section id="trajetoria" className="secao trajetoria">
      <div className="conteiner">
        <header ref={ref} className={`secao__cabeca${visto ? ' em-cena' : ''}`}>
          <p className="secao__numero revelar">03</p>
          <p className="secao__rotulo revelar" style={{ '--i': 1 }}>
            Trajetória
          </p>
          <h2 className="secao__titulo revelar" style={{ '--i': 2 }}>
            {trajetoriaIntro.titulo}
          </h2>
        </header>
        <ol className="linha">
          {marcos.map((m, i) => (
            <Marco key={m.titulo} m={m} i={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}
