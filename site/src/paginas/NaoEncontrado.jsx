import { Link } from 'react-router'
import './nao-encontrado.css'

export default function NaoEncontrado() {
  return (
    <section className="nao-encontrado">
      <div className="conteiner">
        <div className="nao-encontrado__terminal mono" role="img" aria-label="Terminal do ProcessFlow mostrando que a tarefa pagina não existe">
          <p>
            <span className="prompt">processflow&gt;</span> run pagina
          </p>
          <p className="erro">Tarefa 'pagina' nao existe.</p>
          <p>
            <span className="prompt">processflow&gt;</span> <span className="cursor-texto" />
          </p>
        </div>
        <h1 className="secao__titulo">Essa página não existe.</h1>
        <p className="secao__apoio">O endereço pode ter mudado. A mensagem acima é a mesma que o ProcessFlow mostra quando a tarefa não foi cadastrada.</p>
        <Link className="botao botao--sinal" to="/">
          Voltar ao início
        </Link>
      </div>
    </section>
  )
}
