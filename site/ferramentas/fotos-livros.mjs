// Capturas da análise dos 100 livros (Streamlit na porta 5077) e do RecifeSafe (Flask na porta 5055),
// os dois rodando localmente a partir dos repositórios do Yan.
//   streamlit run app.py --server.port 5077 --theme.base dark --client.toolbarMode viewer
//   python app.py (RecifeSafe, porta 5055)
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { abrir, esperar } from './navegador.mjs'

const pasta = (nome) => {
  const p = fileURLToPath(new URL(`../../imagens/projetos/${nome}/`, import.meta.url))
  mkdirSync(p, { recursive: true })
  return p
}
const so = process.argv[2]

const { browser, page, erros } = await abrir({ largura: 1440, altura: 900 })

if (!so || so === 'livros') {
  const destino = pasta('livros')
  await page.goto('http://127.0.0.1:5077/', { waitUntil: 'networkidle2', timeout: 60000 })
  await page.waitForSelector('.js-plotly-plot', { timeout: 60000 })
  await esperar(3500)
  await page.screenshot({ path: `${destino}01-inicio.png` })

  // preço máximo menor no slider: a tabela e o histograma se ajustam
  const trilho = await page.$('[data-testid="stSlider"] [role="slider"]')
  if (trilho) {
    await trilho.focus()
    for (let i = 0; i < 18; i++) await page.keyboard.press('ArrowLeft')
    await esperar(3500)
    await page.screenshot({ path: `${destino}02-filtro.png` })
  }

  await page.goto('http://127.0.0.1:5077/book_reviews', { waitUntil: 'networkidle2', timeout: 60000 })
  await page.waitForSelector('[data-testid="stMetric"]', { timeout: 60000 })
  await esperar(2500)
  await page.screenshot({ path: `${destino}03-avaliacoes.png` })
  console.log('livros ok')
}

if (!so || so === 'recifesafe') {
  const destino = pasta('recifesafe')
  await page.goto('http://127.0.0.1:5055/', { waitUntil: 'networkidle2', timeout: 60000 })
  await esperar(3500)
  await page.screenshot({ path: `${destino}01-topo.png` })
  await page.screenshot({ path: `${destino}02-inteira.png`, fullPage: true })
  console.log('recifesafe ok')
}

console.log(erros.length ? erros.slice(0, 8).join('\n') : 'sem erros no console')
await browser.close()
