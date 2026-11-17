// Capturas do NutriChoice rodando localmente (python manage.py runserver 127.0.0.1:5088).
// Usuário de demonstração criado só na cópia local; a senha vem de NC_SENHA.
// Uso: NC_SENHA=... node ferramentas/fotos-nutrichoice.mjs
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { abrir, esperar } from './navegador.mjs'

const BASE = 'http://127.0.0.1:5088'
const destino = fileURLToPath(new URL('../../imagens/projetos/nutrichoice/', import.meta.url))
mkdirSync(destino, { recursive: true })

const { browser, page, erros } = await abrir({ largura: 1440, altura: 900 })
const foto = async (nome, cheia = false) => {
  await esperar(900)
  await page.screenshot({ path: `${destino}${nome}.png`, fullPage: cheia })
  console.log('ok', nome)
}

await page.goto(`${BASE}/login/`, { waitUntil: 'networkidle2' })
await foto('00-login')
await page.type('input[name="username"]', 'visitante')
await page.type('input[name="password"]', process.env.NC_SENHA)
await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.keyboard.press('Enter')])

// questionário: objetivo, rotina e preferências
await page.goto(`${BASE}/questionario/`, { waitUntil: 'networkidle2' })
await page.evaluate(() => {
  const valores = { objetivo: 'perder', atividade_fisica: '3-4x', estresse: 'medio', come_carne: 'sim', gosta_de_legumes: 'sim', usa_suplementos: 'nao' }
  for (const [nome, v] of Object.entries(valores)) {
    const el = document.querySelector(`[name="${nome}"]`)
    if (el) el.value = v
  }
  const texto = { restricoes: 'Lactose', preferencia: 'Comida caseira', refeicoes_por_dia: '4', sono: '7' }
  for (const [nome, v] of Object.entries(texto)) {
    const el = document.querySelector(`[name="${nome}"]`)
    if (el) el.value = v
  }
})
await foto('01-questionario', true)
await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.evaluate(() => document.querySelector('form[method="POST"], form[method="post"]').submit())])

for (const [nome, rota] of [
  ['02-perfil', '/perfil/'],
  ['03-cardapio', '/cardapio/'],
  ['04-receitas', '/receitas/'],
  ['05-agua', '/agua/'],
  ['06-calorias', '/calorias/'],
  ['07-dicas', '/dicas-nutricionais/'],
  ['08-peso', '/registrar-peso/'],
]) {
  await page.goto(`${BASE}${rota}`, { waitUntil: 'networkidle2' })
  await foto(nome)
  await foto(`${nome}-inteira`, true)
}

console.log(erros.length ? erros.join('\n') : 'sem erros no console')
await browser.close()
