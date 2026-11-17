// Mede o tempo de cada quadro enquanto a página é rolada com a roda do mouse, como uma pessoa.
// Uso: node ferramentas/fluidez.mjs [url=http://localhost:5331/] [--movel]
import { abrir, esperar } from './navegador.mjs'

const args = process.argv.slice(2)
const url = args.find((a) => !a.startsWith('--')) || 'http://localhost:5331/'
const movel = args.includes('--movel')
const { browser, page, erros } = await abrir({ largura: movel ? 390 : 1440, altura: movel ? 844 : 900, movel, escala: movel ? 2 : 1 })
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
await esperar(3500)

await page.evaluate(() => {
  window.__quadros = []
  let ult = performance.now()
  const f = (t) => {
    window.__quadros.push({ dt: t - ult, y: scrollY })
    ult = t
    requestAnimationFrame(f)
  }
  requestAnimationFrame(f)
})

const alturaTotal = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
await page.mouse.move(700, 450)
let y = 0
while (y < alturaTotal) {
  if (movel) await page.evaluate(() => window.scrollBy(0, 90))
  else await page.mouse.wheel({ deltaY: 120 })
  await esperar(70)
  y = await page.evaluate(() => scrollY)
  if (y >= alturaTotal - 2) break
}
await esperar(1200)

const r = await page.evaluate(() => {
  const q = window.__quadros.slice(2)
  const secoes = [...document.querySelectorAll('[data-secao]')].map((el) => ({ nome: el.dataset.secao, de: el.offsetTop, ate: el.offsetTop + el.offsetHeight }))
  const por = secoes.map((s) => {
    const qs = q.filter((x) => x.y + innerHeight / 2 >= s.de && x.y + innerHeight / 2 < s.ate)
    const media = qs.reduce((a, b) => a + b.dt, 0) / Math.max(1, qs.length)
    return { secao: s.nome, quadros: qs.length, mediaMs: +media.toFixed(1), acima25: qs.filter((x) => x.dt > 25).length, pior: +Math.max(0, ...qs.map((x) => x.dt)).toFixed(0) }
  })
  const media = q.reduce((a, b) => a + b.dt, 0) / q.length
  return { total: q.length, mediaMs: +media.toFixed(2), acima25: q.filter((x) => x.dt > 25).length, por }
})
console.table(r.por)
console.log(`total: ${r.total} quadros · média ${r.mediaMs} ms · ${r.acima25} acima de 25 ms (${((r.acima25 / r.total) * 100).toFixed(1)}%)`)
console.log(erros.length ? erros.join('\n') : 'sem erros no console')
await browser.close()
