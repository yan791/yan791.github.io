import ControleMovimento from './ControleMovimento.jsx'
import Icone from './Icone.jsx'
import { perfil } from '../dados/perfil.js'
import { irPara } from '../lib/rolagem.js'
import './rodape.css'

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="conteiner">
        <p className="rodape__nome" aria-hidden="true">
          Yan Nunes
        </p>
        <div className="rodape__linha">
          <p>© {new Date(__DATA_BUILD__).getFullYear()} Yan Ribeiro Nunes · Recife, PE</p>
          <p className="mono rodape__feito">
            React, GSAP e WebGL ·{' '}
            <a href={perfil.codigoDoSite} target="_blank" rel="noreferrer">
              código deste site ↗
            </a>
          </p>
          <div className="rodape__fim">
            <ControleMovimento />
            <button type="button" className="link" onClick={() => irPara(0)}>
              Voltar ao topo <Icone nome="topo" tamanho={15} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
