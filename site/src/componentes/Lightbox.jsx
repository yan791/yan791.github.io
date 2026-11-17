import { useEffect, useRef } from 'react'
import { pararTemporario } from '../lib/rolagem.js'

export default function Lightbox({ aberto, aoFechar, src, alt, legenda }) {
  const dialogo = useRef(null)
  useEffect(() => {
    const d = dialogo.current
    if (!d) return
    if (aberto && !d.open) {
      d.showModal()
      pararTemporario(true)
    }
    if (!aberto && d.open) d.close()
    return () => pararTemporario(false)
  }, [aberto])
  return (
    <dialog
      ref={dialogo}
      className="lightbox"
      onClose={() => {
        pararTemporario(false)
        aoFechar()
      }}
      onClick={(e) => e.target === dialogo.current && aoFechar()}
    >
      <figure>
        <img src={src} alt={alt} />
        {legenda ? <figcaption className="mono">{legenda}</figcaption> : null}
      </figure>
      <button type="button" className="botao botao--contorno lightbox__fechar" onClick={aoFechar}>
        Fechar
      </button>
    </dialog>
  )
}
