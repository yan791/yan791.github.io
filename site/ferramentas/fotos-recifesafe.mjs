// Capturas paradas do RecifeSafe rodando localmente (python app.py na porta 5055).
import { fileURLToPath } from 'node:url'
import { abrir, esperar } from './navegador.mjs'

const destino = new URL('../public/midia/recifesafe/', import.meta.url)
const { browser, page, erros } = await abrir({ largura: 1440, altura: 900 })
await page.goto('http://127.0.0.1:5055/', { waitUntil: 'networkidle2', timeout: 60000 })
await esperar(2500)
await page.screenshot({ path: fileURLToPath(new URL('topo.png', destino)) })
await page.screenshot({ path: fileURLToPath(new URL('inteiro.png', destino)), fullPage: true })
const altura = await page.evaluate(() => document.documentElement.scrollHeight)
console.log('altura da página', altura, erros.length, 'avisos')
await browser.close()
