// Capturas do site local em Chrome sem janela.
// Uso: node ferramentas/shots.mjs [url] [--movel] [--largura=1440] [--altura=900] [--alvos=#sobre,#projetos] [--espera=2500] [--nome=desktop]
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { abrir, esperar } from './navegador.mjs'

const args = process.argv.slice(2)
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v] = a.slice(2).split('='); return [k, v ?? true] }))
const url = args.find((a) => !a.startsWith('--')) || 'http://localhost:5330/'
const movel = !!opt.movel
const largura = +(opt.largura || (movel ? 390 : 1440))
const altura = +(opt.altura || (movel ? 844 : 900))
const nome = opt.nome || (movel ? 'movel' : 'desktop')
const pasta = new URL(`./shots/${nome}/`, import.meta.url)
mkdirSync(pasta, { recursive: true })

const { browser, page, erros } = await abrir({ largura, altura, movel, escala: movel ? 2 : 1 })
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
await esperar(+(opt.espera || 2500))
const foto = async (n) => {
  await page.screenshot({ path: fileURLToPath(new URL(`${n}.jpg`, pasta)), type: 'jpeg', quality: 82 })
  console.log('foto', n)
}
await foto('00-topo')
if (opt.cedo) {
  await page.reload({ waitUntil: 'domcontentloaded' })
  for (const ms of [300, 700, 1100, 1600]) {
    await esperar(ms === 300 ? 300 : 400)
    await foto(`00-cedo-${ms}`)
  }
}
const alvos = (opt.alvos || '').split(',').filter(Boolean)
let i = 1
for (const a of alvos) {
  await page.evaluate((a) => {
    const el = a.startsWith('y:') ? null : document.querySelector(a)
    const y = el ? el.getBoundingClientRect().top + scrollY - 70 : +a.slice(2)
    window.scrollTo({ top: y, behavior: 'instant' })
  }, a)
  await esperar(+(opt.pausa || 1600))
  await foto(String(i++).padStart(2, '0') + '-' + a.replace(/[^a-z0-9]/gi, ''))
}
const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
console.log('sobra lateral:', sobra, '| altura da página:', await page.evaluate(() => document.documentElement.scrollHeight))
console.log(erros.length ? erros.join('\n') : 'sem erros no console')
await browser.close()
