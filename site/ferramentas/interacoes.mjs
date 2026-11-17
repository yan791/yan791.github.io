// Exercita as interações principais na build de produção.
import { abrir, esperar } from './navegador.mjs'
const base = process.argv[2] || 'http://localhost:5331'
let falhas = 0
const ok = (cond, msg) => {
  if (!cond) falhas++
  console.log(`${cond ? 'ok ' : 'FALHOU'}  ${msg}`)
}
const topoDe = (page, sel) => page.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().top), sel)

let { browser, page, erros } = await abrir({ largura: 1440, altura: 900 })
await page.goto(base + '/', { waitUntil: 'networkidle2' })
await esperar(2000)

// navegação da pílula
await page.click('.topo__pilula a[data-id="projetos"]')
await esperar(1800)
ok(Math.abs((await topoDe(page, '#projetos')) - 96) < 30, `pílula leva a Projetos (top=${await topoDe(page, '#projetos')})`)
ok(await page.$eval('.topo__pilula a[data-id="projetos"]', (a) => a.classList.contains('ativa')), 'item ativo da pílula acompanha a seção')

// a vitrine abre no primeiro projeto: a análise dos livros
ok(await page.evaluate(() => document.querySelector('.vitrine__botao[aria-controls="vitrine-livros"]').getAttribute('aria-expanded') === 'true' && document.querySelector('.vitrine__palco img')?.getAttribute('src').includes('livros')), 'vitrine abre na análise dos livros')

// Gantt compacto (escalonador, segundo da lista)
await page.evaluate(() => document.querySelector('.vitrine').scrollIntoView({ block: 'center' }))
await esperar(600)
await page.click('.vitrine__botao[aria-controls="vitrine-escalonador"]')
await esperar(900)
ok((await page.$eval('.gc__resumo', (e) => e.textContent)) === '1 prazo perdido', 'RM: 1 prazo perdido')
await page.click('.gc__alg button:nth-child(2)')
await esperar(300)
ok((await page.$eval('.gc__resumo', (e) => e.textContent)) === '0 prazos perdidos', 'EDF: 0 prazos perdidos')

// simulador completo no diálogo
await page.click('.gc__pe .link')
await esperar(600)
ok(await page.$eval('.simulador', (d) => d.open), 'simulador abre')
let saida = await page.$eval('.simulador .esc__arquivo pre', (e) => e.textContent)
ok(saida.startsWith('EXECUTION BY RATE') && saida.includes('[B] 1'), 'simulador: saída do RM igual à do C')
const inputs = await page.$$('.simulador .esc__tabela tbody tr:first-child .numero input')
await inputs[2].click({ clickCount: 3 })
await inputs[2].type('9')
await esperar(300)
const erro = await page.$eval('.simulador .esc__erro', (e) => e.textContent).catch(() => '')
ok(erro === 'Erro: a linha 2 nao respeita C <= D <= P.', `validação: "${erro}"`)
await page.keyboard.press('Escape')
await esperar(400)
ok(!(await page.$eval('.simulador', (d) => d.open)), 'Esc fecha o simulador')

// vitrine: a lista troca a prévia
const vitrine = async (slug) => {
  await page.click(`.vitrine__botao[aria-controls="vitrine-${slug}"]`)
  await esperar(900)
  return page.evaluate((slug) => ({
    aberto: document.querySelector(`.vitrine__botao[aria-controls="vitrine-${slug}"]`).getAttribute('aria-expanded') === 'true',
    abertos: document.querySelectorAll('.vitrine__botao[aria-expanded="true"]').length,
    img: document.querySelector('.vitrine__palco img')?.getAttribute('src') || '',
    terminal: !!document.querySelector('.vitrine__palco .term__janela'),
  }), slug)
}
let v = await vitrine('nutrichoice')
ok(v.aberto && v.abertos === 1 && v.img.includes('nutrichoice'), 'vitrine: NutriChoice abre com a tela do cardápio')
v = await vitrine('processflow')
ok(v.aberto && v.terminal, 'vitrine: ProcessFlow mostra o terminal')
v = await vitrine('livros')
ok(v.aberto && v.img.includes('livros'), 'vitrine: análise dos livros mostra o painel')
await page.focus('.vitrine__item:last-child .vitrine__botao')
await page.keyboard.press('ArrowDown')
ok(await page.evaluate(() => document.activeElement === document.querySelector('.vitrine__item:nth-child(1) .vitrine__botao')), 'vitrine: seta para baixo volta ao primeiro item')

// certificado
await page.evaluate(() => document.querySelector('.bento__mostra').scrollIntoView({ block: 'center' }))
await esperar(600)
await page.click('.bento__mostra .link')
await esperar(500)
ok(await page.$eval('.lightbox', (d) => d.open), 'certificado abre')
await page.keyboard.press('Escape')
await esperar(300)

// contato: WhatsApp com texto pronto
await page.evaluate(() => document.querySelector('#contato').scrollIntoView())
await esperar(800)
await page.type('.contato__form input', 'Ana')
await page.type('.contato__form textarea', 'Tenho uma vaga de estágio.')
await page.evaluate(() => { window.open = (u) => { window.__aberto = u } })
await page.click('.contato__form .botao')
const url = decodeURIComponent((await page.evaluate(() => window.__aberto)) || '')
ok(url.includes('wa.me/5581995029461') && url.includes('Aqui é Ana') && url.includes('vaga de estágio'), 'WhatsApp abre com a mensagem')

// 404
await page.goto(base + '/nao-existe', { waitUntil: 'networkidle2' })
await esperar(600)
ok((await page.$('.nao-encontrado')) !== null, 'rota inexistente mostra a página 404')
console.log(erros.filter((e) => !e.includes('ERR_ABORTED')).join('\n') || 'desktop: sem erros no console')
await browser.close()

// celular: doca
;({ browser, page, erros } = await abrir({ largura: 390, altura: 844, movel: true, escala: 2 }))
await page.goto(base + '/', { waitUntil: 'networkidle2' })
await esperar(1500)
ok(await page.$eval('.doca', (d) => getComputedStyle(d).display !== 'none'), 'doca aparece no celular')
await page.tap('.doca a[aria-label="Trajetória"]')
await esperar(1800)
ok(Math.abs((await topoDe(page, '#trajetoria')) - 96) < 40, `doca leva à Trajetória (top=${await topoDe(page, '#trajetoria')})`)
await page.evaluate(() => document.querySelector('.vitrine').scrollIntoView())
await esperar(800)
await page.tap('.vitrine__botao[aria-controls="vitrine-recifesafe"]')
await esperar(1200)
ok(await page.evaluate(() => !document.querySelector('.vitrine__palco') && !!document.querySelector('#vitrine-recifesafe .vitrine__midia-movel img')), 'celular: a vitrine vira acordeão com a tela dentro')
console.log(erros.filter((e) => !e.includes('ERR_ABORTED')).join('\n') || 'celular: sem erros no console')
await browser.close()
console.log(falhas ? `${falhas} falha(s)` : 'todas as interações passaram')
