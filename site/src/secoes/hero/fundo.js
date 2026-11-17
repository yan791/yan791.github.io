// Fundo do hero: o Conjunto de Mandelbrot (projeto do Yan em C com Pthreads e OpenMP)
// desenhado em WebGL, bem apagado, com uma aproximação lenta e um leve parallax do mouse.
import { criarMandelbrot } from '../../gl/mandelbrot.js'
import { reduzido } from '../../lib/movimento.js'

const ALVO = { cx: -0.743643887037151, cy: 0.13182590420533 }
const ZOOM_MAX = 1 / 700
const CICLO = 150

export function iniciarFundo(canvas, area) {
  const gl = criarMandelbrot(canvas)
  if (!gl) return () => {}
  const cheios = new Float32Array(30).fill(1)
  let vista0 = { cx: -0.75, cy: 0, altura: 3 }
  let largura = 1
  let altura = 1
  let t0 = performance.now() / 1000
  let visivel = true
  let raf = 0
  let quadro = 0
  const mouse = { x: 0, y: 0, ax: 0, ay: 0 }

  const posicionar = () => {
    const r = area.getBoundingClientRect()
    const escala = Math.min(window.devicePixelRatio || 1, 1.5) * 0.62
    largura = Math.max(2, Math.round(r.width * escala))
    altura = Math.max(2, Math.round(r.height * escala))
    gl.redimensionar(largura, altura)
    const aspecto = r.width / r.height
    if (aspecto > 1.1) {
      // desktop: o conjunto fica à direita, longe do texto
      const alt = 3.1
      const larg = alt * aspecto
      vista0 = { cx: -0.62 - 0.24 * larg, cy: 0.05, altura: alt }
    } else {
      // celular: o conjunto fica embaixo
      const alt = 4.6
      vista0 = { cx: -0.6, cy: 0.27 * alt, altura: alt }
    }
  }
  const ro = new ResizeObserver(posicionar)
  ro.observe(area)
  posicionar()

  const iter = (alt) => Math.min(900, Math.max(200, 200 + 70 * Math.log2(vista0.altura / alt)))

  const passo = (ms) => {
    raf = requestAnimationFrame(passo)
    if (!visivel) return
    quadro++
    if (quadro % 2) return // 30 quadros por segundo bastam para um fundo lento
    const seg = ms / 1000 - t0
    const k = reduzido() ? 0 : 0.5 - 0.5 * Math.cos((2 * Math.PI * seg) / CICLO)
    const alt = vista0.altura * Math.pow(ZOOM_MAX, k)
    const f = alt / vista0.altura
    mouse.ax += (mouse.x - mouse.ax) * 0.05
    mouse.ay += (mouse.y - mouse.ay) * 0.05
    gl.desenhar({
      cx: ALVO.cx + (vista0.cx - ALVO.cx) * f - mouse.ax * 0.03 * alt,
      cy: ALVO.cy + (vista0.cy - ALVO.cy) * f + mouse.ay * 0.03 * alt,
      altura: alt,
      iter: iter(alt),
      revelados: cheios,
    })
  }
  raf = requestAnimationFrame(passo)
  requestAnimationFrame(() => canvas.classList.add('visivel'))

  const mover = (e) => {
    mouse.x = e.clientX / window.innerWidth - 0.5
    mouse.y = e.clientY / window.innerHeight - 0.5
  }
  window.addEventListener('pointermove', mover, { passive: true })
  const io = new IntersectionObserver(([e]) => {
    visivel = e.isIntersecting && !document.hidden
  })
  io.observe(area)
  const aoOcultar = () => {
    visivel = !document.hidden
  }
  document.addEventListener('visibilitychange', aoOcultar)

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    window.removeEventListener('pointermove', mover)
    document.removeEventListener('visibilitychange', aoOcultar)
    gl.destruir()
  }
}
