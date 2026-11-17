// Chrome sem janela (o painel do app pausa animações quando está escondido).
import puppeteer from 'puppeteer-core'

export const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'

export async function abrir({ largura = 1440, altura = 900, movel = false, escala = 1, extras = [] } = {}) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', ...extras],
  })
  const page = await browser.newPage()
  const erros = []
  page.on('console', (m) => {
    if (['error', 'warn', 'warning'].includes(m.type()) && !m.text().includes('X4122')) erros.push(`[${m.type()}] ${m.text()}`)
  })
  page.on('pageerror', (e) => erros.push(`[pageerror] ${e.message}`))
  page.on('requestfailed', (r) => erros.push(`[falha] ${r.url()} ${r.failure()?.errorText}`))
  await page.setViewport({ width: largura, height: altura, deviceScaleFactor: escala, isMobile: movel, hasTouch: movel })
  return { browser, page, erros }
}

export const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

// rolagem suave controlada (funciona com e sem Lenis)
export async function rolarAte(page, alvo, ms = 1600) {
  await page.evaluate(
    async (alvo, ms) => {
      const y0 = scrollY
      const y1 = typeof alvo === 'number' ? alvo : document.querySelector(alvo).getBoundingClientRect().top + scrollY
      const t0 = performance.now()
      await new Promise((ok) => {
        const passo = (t) => {
          const k = Math.min(1, (t - t0) / ms)
          const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
          window.scrollTo(0, y0 + (y1 - y0) * e)
          k < 1 ? requestAnimationFrame(passo) : ok()
        }
        requestAnimationFrame(passo)
      })
    },
    alvo,
    ms,
  )
}

// roda do mouse em passos, como uma pessoa rolando
export async function rodar(page, total, passos = 20, intervalo = 60) {
  for (let i = 0; i < passos; i++) {
    await page.mouse.wheel({ deltaY: total / passos })
    await esperar(intervalo)
  }
}
