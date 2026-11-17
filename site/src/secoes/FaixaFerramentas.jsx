// Só os ícones usados (importar a biblioteca inteira levaria milhares de logos para o site).
import {
  siC,
  siPython,
  siOpenjdk,
  siJavascript,
  siReact,
  siDjango,
  siFlask,
  siThreedotjs,
  siPandas,
  siPlotly,
  siMysql,
  siSqlite,
  siLinux,
  siGit,
  siGithubactions,
  siCypress,
  siSelenium,
  siVite,
  siGreensock,
  siRaylib,
} from 'simple-icons'
import { Logo } from '../componentes/Icone.jsx'
import './faixa-ferramentas.css'

const ITENS = [
  [siC, 'C'],
  [siPython, 'Python'],
  [siOpenjdk, 'Java'],
  [siJavascript, 'JavaScript'],
  [siReact, 'React'],
  [siDjango, 'Django'],
  [siFlask, 'Flask'],
  [siThreedotjs, 'three.js'],
  [siPandas, 'Pandas'],
  [siPlotly, 'Plotly'],
  [siMysql, 'MySQL'],
  [siSqlite, 'SQLite'],
  [siLinux, 'Linux'],
  [siGit, 'Git'],
  [siGithubactions, 'GitHub Actions'],
  [siCypress, 'Cypress'],
  [siSelenium, 'Selenium'],
  [siVite, 'Vite'],
  [siGreensock, 'GSAP'],
  [siRaylib, 'Raylib'],
].map(([icone, nome]) => ({ icone, nome }))

export default function FaixaFerramentas() {
  return (
    <section className="faixa" aria-labelledby="faixa-titulo">
      <div className="faixa__dentro">
        <h2 id="faixa-titulo" className="faixa__titulo mono">
          Ferramentas que uso
        </h2>
        <ul className="so-leitor">
          {ITENS.map((i) => (
            <li key={i.nome}>{i.nome}</li>
          ))}
        </ul>
        <div className="faixa__janela" aria-hidden="true">
          <div className="faixa__trilho">
            {[0, 1].map((k) => (
              <div className="faixa__grupo" key={k}>
                {ITENS.map((i) => (
                  <span key={i.nome} className="faixa__item">
                    <Logo icone={i.icone} tamanho={17} />
                    {i.nome}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
