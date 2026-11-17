import Hero from '../secoes/hero/Hero.jsx'
import FaixaFerramentas from '../secoes/FaixaFerramentas.jsx'
import Sobre from '../secoes/Sobre.jsx'
import Projetos from '../secoes/projetos/Projetos.jsx'
import Trajetoria from '../secoes/Trajetoria.jsx'
import Contato from '../secoes/Contato.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <FaixaFerramentas />
      <Sobre />
      <Projetos />
      <Trajetoria />
      <Contato />
    </>
  )
}
