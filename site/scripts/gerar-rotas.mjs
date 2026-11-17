// Depois do build: 404.html (para o GitHub Pages) e sitemap.xml.
// Também barra a publicação se sobrar algum marcador de pendência.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SITE = 'https://yan791.github.io'
const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const base = readFileSync(dist + 'index.html', 'utf8')

writeFileSync(
  `${dist}404.html`,
  base
    .replace(/<title>[^<]*<\/title>/, '<title>Página não encontrada | Yan Ribeiro Nunes</title>')
    .replace('<meta name="theme-color"', '<meta name="robots" content="noindex" />\n    <meta name="theme-color"'),
)

const hoje = new Date().toISOString().slice(0, 10)
writeFileSync(
  `${dist}sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE}/</loc><lastmod>${hoje}</lastmod></url>\n</urlset>\n`,
)

const proibidos = /\[\[(PREENCHER|CONFIRMAR)|\byrn\b/
const verificar = (dir) => {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = dir + f.name
    if (f.isDirectory()) verificar(p + '/')
    else if (/\.(html|js|css)$/.test(f.name) && proibidos.test(readFileSync(p, 'utf8'))) {
      throw new Error(`marcador proibido encontrado em ${p}`)
    }
  }
}
verificar(dist)
console.log('404.html e sitemap.xml gerados; nenhum marcador pendente')
