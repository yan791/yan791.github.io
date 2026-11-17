// Imagens de compartilhamento (1200x630) a partir do próprio site rodando localmente.
// Uso: node ferramentas/og.mjs [base=http://localhost:5330]
import { fileURLToPath } from 'node:url'
import { abrir, esperar } from './navegador.mjs'

const base = process.argv[2] || 'http://localhost:5330'
const destino = new URL('../public/og/', import.meta.url)
const rotas = [
  ['inicio', '/'],
]

const { browser, page, erros } = await abrir({ largura: 1200, altura: 630, escala: 1 })
for (const [nome, rota] of rotas) {
  await page.goto(base + rota, { waitUntil: 'networkidle2' })
  await page.addStyleTag({ content: '.topo{display:none!important}.grao{display:none}' })
  await esperar(rota === '/' ? 3200 : 2600)
  if (rota !== '/') {
    // capa sem o link de voltar, com o nome grande
    await page.evaluate(() => {
      document.querySelector('.caso__voltar')?.remove()
      const c = document.querySelector('.caso__capa')
      if (c) c.style.paddingTop = '56px'
    })
    await esperar(400)
  }
  await page.screenshot({ path: fileURLToPath(new URL(`${nome}.jpg`, destino)), type: 'jpeg', quality: 86 })
  console.log('og', nome)
}
console.log(erros.length ? erros.join('\n') : 'sem erros')
await browser.close()
