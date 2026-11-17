// Grava vídeos curtos e reais de cada projeto, direto do endereço no ar.
// Uso: node ferramentas/capturar.mjs [slug ...] [--sonda]
//   --sonda  só tira uma foto depois de carregar (para planejar a gravação)
// Saída bruta: ../imagens/projetos/<slug>/bruto.webm (fora do git)
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { abrir, esperar, rolarAte, rodar } from './navegador.mjs'

const args = process.argv.slice(2)
const sonda = args.includes('--sonda')
const pedidos = args.filter((a) => !a.startsWith('--'))
const raiz = new URL('../../imagens/projetos/', import.meta.url)

const L = 1440
const A = 900

const receitas = {
  sola: {
    url: 'https://yan791.github.io/modelo_loja_tenis/?teste',
    pronto: '.fase-pronto',
    antes: 1500,
    async gravar(page) {
      const onde = (i) =>
        page.evaluate((i) => {
          const v = window.__vitrine
          const s = v.slots[i]
          const p = s.tenis.getWorldPosition(s.tenis.position.clone())
          p.y += s.aspecto * 0.4
          p.project(v.camera)
          return { x: ((p.x + 1) / 2) * v.w, y: ((1 - p.y) / 2) * v.h }
        }, i)
      await esperar(900)
      let p = await onde(0)
      await page.mouse.move(p.x, p.y, { steps: 18 })
      await esperar(900)
      p = await onde(1)
      await page.mouse.move(p.x, p.y, { steps: 18 })
      await esperar(1000)
      await page.mouse.click(p.x, p.y)
      await esperar(3600)
      await page.mouse.move(L * 0.3, A * 0.55, { steps: 20 })
      await esperar(1200)
    },
  },
  arquivo: {
    url: 'https://yan791.github.io/loja-modelo-arquivo/?teste',
    pronto: '.fase-pronto',
    antes: 5600,
    async gravar(page) {
      // entra na loja e chega na arara
      await page.evaluate(() => {
        const r = document.querySelector('.palco')
        window.scrollTo({ top: (r.offsetHeight - innerHeight) * 0.93, behavior: 'instant' })
      })
      await esperar(3800)
      const onde = (i) =>
        page.evaluate((i) => {
          const s = window.__sala
          const a = s.araras[s.secao]
          const c = a.camisas[i]
          const v = c.grupo.position.clone()
          v.x = a.grupo.position.x + c.x
          v.y = 1.4
          v.project(s.camera)
          return { x: ((v.x + 1) / 2) * s.w, y: ((1 - v.y) / 2) * s.h }
        }, i)
      for (const i of [1, 3, 5]) {
        const p = await onde(i)
        await page.mouse.move(p.x, p.y, { steps: 16 })
        await esperar(1300)
      }
      const p = await onde(8)
      await page.mouse.move(p.x, p.y, { steps: 16 })
      await esperar(1000)
      await page.mouse.click(p.x, p.y)
      await esperar(3000)
    },
  },
  livi: {
    url: 'https://livibylm.com.br/',
    pronto: 'body',
    antes: 3500,
    async gravar(page) {
      await page.mouse.move(L * 0.6, A * 0.5)
      await rodar(page, 900, 30, 70)
      await esperar(1800)
      await rodar(page, 900, 30, 70)
      await esperar(2200)
      await rodar(page, 700, 24, 70)
      await esperar(1500)
    },
  },
  'dr-notebook': {
    url: 'https://yan791.github.io/dr-notebook/',
    pronto: 'body',
    antes: 4000,
    async gravar(page) {
      await esperar(800)
      const clicar = async (texto) => {
        const ok = await page.evaluate((texto) => {
          const b = [...document.querySelectorAll('button, [role=radio], label')].find((e) => e.textContent.trim().toLowerCase().includes(texto))
          if (!b) return null
          const r = b.getBoundingClientRect()
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
        }, texto)
        if (ok) {
          await page.mouse.move(ok.x, ok.y, { steps: 14 })
          await esperar(250)
          await page.mouse.click(ok.x, ok.y)
        }
        return !!ok
      }
      await clicar('notebook')
      await esperar(1800)
      await clicar('não liga')
      await esperar(3200)
      await rodar(page, 500, 20, 60)
      await esperar(1500)
    },
  },
  jv: {
    url: 'https://yan791.github.io/site_jvimports/',
    pronto: 'body',
    antes: 4000,
    async gravar(page) {
      await page.mouse.move(L * 0.5, A * 0.5)
      await esperar(1200)
      await rodar(page, 1100, 36, 70)
      await esperar(1200)
      await rodar(page, 1100, 36, 70)
      await esperar(1500)
    },
  },
  volts: {
    url: 'https://yan791.github.io/site_volts/?animacoes',
    pronto: 'body',
    antes: 2500,
    async gravar(page) {
      await esperar(3500)
      await page.mouse.move(L * 0.5, A * 0.5)
      await rodar(page, 1500, 50, 70)
      await esperar(1500)
    },
  },
  ioma: {
    url: 'https://yan791.github.io/site_ioma/',
    pronto: 'body',
    antes: 2500,
    async gravar(page) {
      await esperar(2500)
      await page.evaluate(() => {
        const s = [...document.querySelectorAll('section')].find((e) => /implante/i.test(e.id + e.className))
        if (s) window.scrollTo(0, s.getBoundingClientRect().top + scrollY - 40)
      })
      await esperar(5000)
    },
  },
  cm3: {
    url: 'https://yan791.github.io/site_CM3/',
    pronto: 'body',
    antes: 3000,
    async gravar(page) {
      await page.mouse.move(L * 0.5, A * 0.5)
      await esperar(1500)
      await rodar(page, 1400, 45, 70)
      await esperar(2000)
    },
  },
  recifesafe: {
    url: 'http://127.0.0.1:5055/',
    pronto: 'body',
    antes: 3500,
    async gravar(page) {
      await page.mouse.move(L * 0.5, A * 0.5)
      await esperar(1200)
      await rodar(page, 900, 30, 80)
      await esperar(2000)
      await rodar(page, 900, 30, 80)
      await esperar(2000)
    },
  },
}

const lista = pedidos.length ? pedidos : Object.keys(receitas)
for (const slug of lista) {
  const r = receitas[slug]
  if (!r) {
    console.log('sem receita para', slug)
    continue
  }
  const pasta = new URL(`${slug}/`, raiz)
  mkdirSync(pasta, { recursive: true })
  const { browser, page, erros } = await abrir({ largura: L, altura: A })
  try {
    const t0 = Date.now()
    await page.goto(r.url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForSelector(r.pronto, { timeout: 60000 })
    await esperar(r.antes)
    console.log(`${slug}: pronto em ${((Date.now() - t0) / 1000).toFixed(1)} s`)
    if (sonda) {
      await page.screenshot({ path: fileURLToPath(new URL('sonda.jpg', pasta)), type: 'jpeg', quality: 80 })
    } else {
      const gravador = await page.screencast({ path: fileURLToPath(new URL('bruto.webm', pasta)) })
      await r.gravar(page)
      await gravador.stop()
      await page.screenshot({ path: fileURLToPath(new URL('fim.jpg', pasta)), type: 'jpeg', quality: 88 })
      console.log(`${slug}: gravado`)
    }
  } catch (e) {
    console.log(`${slug}: ERRO ${e.message}`)
  }
  if (erros.length) console.log(`${slug}: ${erros.length} avisos no console`)
  await browser.close()
}
