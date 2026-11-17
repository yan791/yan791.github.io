import { useEffect, useRef, useState } from 'react'
import { aoMudarMovimento, reduzido } from '../lib/movimento.js'
import './video.css'

// Só um vídeo toca por vez: quando um começa, os outros pausam.
const ativos = new Set()

export default function VideoLoop({ midia, alt, className = '', cursor = 'Abrir ↗', href }) {
  const video = useRef(null)
  const caixa = useRef(null)
  const [tocando, setTocando] = useState(false)
  const [pausadoPelaPessoa, setPausadoPelaPessoa] = useState(false)
  const src = typeof window !== 'undefined' && matchMedia('(max-width: 700px)').matches ? midia.videoMovel : midia.video

  useEffect(() => {
    const v = video.current
    let visivel = false
    const tentar = () => {
      if (visivel && !reduzido() && !v.dataset.pausadoPelaPessoa) {
        ativos.forEach((o) => o !== v && o.pause())
        v.play().catch(() => {})
      } else v.pause()
    }
    const io = new IntersectionObserver(
      ([e]) => {
        visivel = e.intersectionRatio >= 0.45
        tentar()
      },
      { threshold: [0, 0.45, 0.8] },
    )
    io.observe(v)
    // começa a baixar um pouco antes de aparecer, para o primeiro quadro não travar a rolagem
    const perto = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && v.preload !== 'auto') {
          v.preload = 'auto'
          if (v.readyState === 0 && v.networkState !== 2) v.load()
          perto.disconnect()
        }
      },
      { rootMargin: '700px 0px' },
    )
    perto.observe(v)
    ativos.add(v)
    const tocar = () => setTocando(true)
    const parar = () => setTocando(false)
    v.addEventListener('play', tocar)
    v.addEventListener('pause', parar)
    const desliga = aoMudarMovimento(tentar)
    return () => {
      io.disconnect()
      perto.disconnect()
      ativos.delete(v)
      v.removeEventListener('play', tocar)
      v.removeEventListener('pause', parar)
      desliga()
    }
  }, [])

  const alternar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const v = video.current
    if (v.paused) {
      delete v.dataset.pausadoPelaPessoa
      setPausadoPelaPessoa(false)
      ativos.forEach((o) => o !== v && o.pause())
      v.play().catch(() => {})
    } else {
      v.dataset.pausadoPelaPessoa = '1'
      setPausadoPelaPessoa(true)
      v.pause()
    }
  }

  const Midia = (
    <video ref={video} src={src} poster={midia.poster} muted playsInline loop preload="none" aria-label={alt} disablePictureInPicture />
  )

  return (
    <div ref={caixa} className={`video-loop ${className}${tocando ? ' tocando' : ''}`}>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="video-loop__link" data-cursor={cursor} tabIndex={-1} aria-hidden="true">
          {Midia}
        </a>
      ) : (
        Midia
      )}
      <button type="button" className="video-loop__botao mono" onClick={alternar} aria-label={tocando ? 'Pausar vídeo' : 'Tocar vídeo'}>
        <span aria-hidden="true">{tocando ? '❚❚' : '▶'}</span>
        <span>{tocando ? 'pausar' : pausadoPelaPessoa ? 'tocar' : 'tocar'}</span>
      </button>
    </div>
  )
}
