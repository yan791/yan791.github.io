import { useState } from 'react'
import { siGithub, siWhatsapp } from 'simple-icons'
import Icone, { Logo } from '../componentes/Icone.jsx'
import { contato, perfil } from '../dados/perfil.js'
import { useEmCena } from '../lib/visivel.js'
import './contato.css'

const LinkedIn = { path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z' }

export default function Contato() {
  const [ref, visto] = useEmCena({ limiar: 0.15 })
  const [copiado, setCopiado] = useState(false)
  const [nome, setNome] = useState('')
  const [msg, setMsg] = useState('')

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(perfil.email)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      window.location.href = `mailto:${perfil.email}`
    }
  }

  const texto = `Olá, Yan!${nome.trim() ? ` Aqui é ${nome.trim()}.` : ''}${msg.trim() ? ` ${msg.trim()}` : ''}`
  const enviar = (e) => {
    e.preventDefault()
    window.open(`https://wa.me/${perfil.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
  }

  const redes = [
    ['GitHub', perfil.github, <Logo key="g" icone={siGithub} tamanho={19} />],
    ['LinkedIn', perfil.linkedin, <Logo key="l" icone={LinkedIn} tamanho={18} />],
    ['WhatsApp', `https://wa.me/${perfil.whatsapp}`, <Logo key="w" icone={siWhatsapp} tamanho={19} />],
    ['Currículo em PDF', perfil.curriculo, <Icone key="c" nome="download" tamanho={19} />],
  ]

  return (
    <section id="contato" className="secao contato">
      <div ref={ref} className={`conteiner${visto ? ' em-cena' : ''}`}>
        <header className="secao__cabeca">
          <p className="secao__numero revelar">04</p>
          <p className="secao__rotulo revelar" style={{ '--i': 1 }}>
            Contato
          </p>
          <h2 className="secao__titulo revelar" style={{ '--i': 2 }}>
            {contato.titulo}
          </h2>
          <p className="secao__apoio revelar" style={{ '--i': 3 }}>
            {contato.apoio}
          </p>
        </header>

        <div className="contato__grade">
          <div className="cartao contato__cartao revelar" style={{ '--i': 3 }}>
            <p className="rotulo">E-mail</p>
            <div className="contato__email">
              <a href={`mailto:${perfil.email}`}>{perfil.email}</a>
              <button type="button" className="contato__copiar" onClick={copiar} aria-label="Copiar e-mail">
                <Icone nome={copiado ? 'ok' : 'copiar'} tamanho={17} />
                <span aria-live="polite">{copiado ? 'copiado' : 'copiar'}</span>
              </button>
            </div>
            <p className="rotulo contato__rotulo-2">Em outros lugares</p>
            <ul className="contato__redes">
              {redes.map(([t, href, ic]) => (
                <li key={t}>
                  <a href={href} target="_blank" rel="noreferrer" aria-label={t} title={t}>
                    {ic}
                  </a>
                </li>
              ))}
            </ul>
            <a className="link contato__linkedin" href={perfil.linkedin} target="_blank" rel="noreferrer">
              Ver perfil completo no LinkedIn <span className="seta">↗</span>
            </a>
          </div>

          <form className="cartao contato__cartao contato__form revelar" style={{ '--i': 4 }} onSubmit={enviar}>
            <p className="rotulo">Mandar mensagem no WhatsApp</p>
            <label>
              <span className="so-leitor">Seu nome</span>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" autoComplete="name" maxLength={60} />
            </label>
            <label>
              <span className="so-leitor">Sua mensagem</span>
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Escreva rapidinho o que você precisa" rows={4} maxLength={600} />
            </label>
            <button type="submit" className="botao botao--claro">
              Abrir no WhatsApp <span aria-hidden="true">↗</span>
            </button>
            <p className="contato__aviso mono">O botão só abre o seu WhatsApp com o texto pronto. Nada é enviado por este site.</p>
          </form>
        </div>
      </div>
    </section>
  )
}
