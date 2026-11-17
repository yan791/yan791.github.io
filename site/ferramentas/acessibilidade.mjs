// Checagem automática com axe-core (WCAG 2 A e AA) nas páginas principais.
import { fileURLToPath } from 'node:url'
import { abrir, esperar } from './navegador.mjs'
const base = process.argv[2] || 'http://localhost:5331'
const axe = fileURLToPath(new URL('../node_modules/axe-core/axe.min.js', import.meta.url))
const { browser, page } = await abrir({ largura: 1440, altura: 900 })
for (const rota of ['/']) {
  await page.goto(base + rota, { waitUntil: 'networkidle2' })
  await esperar(2500)
  // revela tudo para a análise ver o estado final
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) }
    window.scrollTo(0, 0)
  })
  await esperar(1500)
  await page.addScriptTag({ path: axe })
  const r = await page.evaluate(async () => {
    const res = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })
    return res.violations.map((v) => ({ id: v.id, impacto: v.impact, n: v.nodes.length, exemplo: v.nodes[0]?.target?.join(' '), resumo: v.nodes[0]?.failureSummary?.split('\n').slice(0, 2).join(' ') }))
  })
  console.log(`== ${rota}: ${r.length} violações`)
  r.forEach((v) => console.log(` - ${v.id} (${v.impacto}) x${v.n} · ${v.exemplo} · ${v.resumo}`))
}
await browser.close()
