import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Cabecalho from './componentes/Cabecalho.jsx'
import Rodape from './componentes/Rodape.jsx'
import Home from './paginas/Home.jsx'
import { iniciarRolagem, irPara, pararRolagem } from './lib/rolagem.js'
import { useMovimento } from './lib/movimento.js'

const NaoEncontrado = lazy(() => import('./paginas/NaoEncontrado.jsx'))

export default function App() {
  const loc = useLocation()
  const mov = useMovimento()

  useEffect(() => {
    if (mov === 'reduzido') pararRolagem()
    else iniciarRolagem()
    ScrollTrigger.refresh()
  }, [mov])

  useEffect(() => {
    const ocultar = () => document.body.classList.toggle('pausado', document.hidden)
    document.addEventListener('visibilitychange', ocultar)
    return () => document.removeEventListener('visibilitychange', ocultar)
  }, [])

  // troca de rota: vai ao topo, ou à seção pedida
  useEffect(() => {
    const alvo = loc.state?.alvo || (loc.hash && loc.hash.length > 1 ? loc.hash : null)
    if (alvo) {
      const t = setTimeout(() => {
        ScrollTrigger.refresh()
        irPara(alvo)
      }, 260)
      return () => clearTimeout(t)
    }
    irPara(0, { imediato: true })
  }, [loc.pathname, loc.key])

  return (
    <>
      <a className="pular" href="#main">
        Pular para o conteúdo
      </a>
      <div className="grao" aria-hidden="true" />
      <Cabecalho />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NaoEncontrado />} />
          </Routes>
        </Suspense>
      </main>
      <Rodape />
    </>
  )
}
