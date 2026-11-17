// Rolagem suave (Lenis) ligada ao GSAP. respectReducedMotion: false porque o Windows do Yan
// tem os efeitos de animação desligados e o Lenis desligaria a rolagem suave sozinho.
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null
let tick = null

export function iniciarRolagem() {
  if (lenis) return lenis
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
    wheelMultiplier: 0.95,
    respectReducedMotion: false,
  })
  lenis.on('scroll', ScrollTrigger.update)
  tick = (t) => lenis?.raf(t * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function pararRolagem() {
  if (!lenis) return
  gsap.ticker.remove(tick)
  lenis.destroy()
  lenis = null
}

export function rolagem() {
  return lenis
}

// O Lenis já desconta o scroll-padding-top do html (altura do cabeçalho + respiro),
// então nenhum deslocamento extra é somado aqui.
export function irPara(alvo, { imediato = false } = {}) {
  const el = typeof alvo === 'string' ? document.querySelector(alvo) : alvo
  if (alvo !== 0 && !el) return
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(alvo === 0 ? 0 : el, { immediate: imediato, duration: 1.3, force: true })
  } else {
    const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
    const y = alvo === 0 ? 0 : el.getBoundingClientRect().top + scrollY - pad
    window.scrollTo({ top: y, behavior: 'instant' })
  }
}

export function pararTemporario(on) {
  if (!lenis) return
  on ? lenis.stop() : lenis.start()
}
