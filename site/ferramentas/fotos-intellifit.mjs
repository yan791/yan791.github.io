// Telas reais do IntelliFit rodando localmente (python manage.py runserver 127.0.0.1:5066),
// com um usuário de demonstração criado só para as capturas.
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { abrir, esperar } from './navegador.mjs'

const BASE = 'http://127.0.0.1:5066'
const bruto = new URL('../../imagens/projetos/intellifit/', import.meta.url)
mkdirSync(bruto, { recursive: true })
const usuario = process.env.IF_USUARIO || 'demo'
const senha = process.env.IF_SENHA

const { browser, page, erros } = await abrir({ largura: 1440, altura: 900 })
const foto = async (nome) => page.screenshot({ path: fileURLToPath(new URL(`${nome}.png`, bruto)) })

await page.goto(`${BASE}/login/`, { waitUntil: 'networkidle2' })
await foto('00-login')
await page.type('#username', usuario)
await page.type('#password', senha)
await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.click('.login-btn')])
console.log('depois do login:', page.url())

const rotas = [
  ['01-dashboard', '/dashboard/'],
  ['02-anotacoes', '/notes/'],
  ['03-nova-anotacao', '/notes/create/'],
  ['04-progresso', '/progress/'],
  ['05-treinos', '/workout/'],
]
for (const [nome, rota] of rotas) {
  await page.goto(BASE + rota, { waitUntil: 'networkidle2' })
  await esperar(600)
  await foto(nome)
}
const detalhe = await page.evaluate(async () => {
  const r = await fetch('/notes/')
  const t = await r.text()
  return (t.match(/href="(\/notes\/\d+\/)"/) || [])[1]
})
if (detalhe) {
  await page.goto(BASE + detalhe, { waitUntil: 'networkidle2' })
  await foto('06-anotacao')
}

// gravação curta: anotações -> nova anotação -> progresso
await page.goto(`${BASE}/notes/`, { waitUntil: 'networkidle2' })
await esperar(500)
const gravador = await page.screencast({ path: fileURLToPath(new URL('bruto.webm', bruto)) })
await esperar(1600)
await page.goto(`${BASE}/notes/create/`, { waitUntil: 'networkidle2' })
await esperar(500)
const campos = await page.$$('input[type=text], input:not([type]), textarea')
if (campos[0]) {
  await campos[0].click()
  await page.keyboard.type('Meta da semana', { delay: 60 })
}
if (campos[1]) {
  await campos[1].click()
  await page.keyboard.type('Treinar 4 vezes e registrar o peso na sexta.', { delay: 35 })
}
await esperar(900)
await page.goto(`${BASE}/progress/`, { waitUntil: 'networkidle2' })
await esperar(2200)
await gravador.stop()
console.log(erros.length ? erros.slice(0, 5).join('\n') : 'sem erros')
await browser.close()
