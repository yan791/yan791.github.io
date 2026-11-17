# yan791.github.io

Portfólio de **Yan Ribeiro Nunes**, estudante de Ciência da Computação na CESAR School (Recife, PE).

No ar em **https://yan791.github.io**.

## Stack

- React 19 + Vite + JavaScript
- GSAP e Lenis para movimento e rolagem
- WebGL2 puro no fundo do hero (o Conjunto de Mandelbrot, tema de um dos meus projetos em C)
- CSS próprio, sem framework de estilos
- Vitest para a lógica do escalonador

## Destaques técnicos

- **Escalonador RM × EDF interativo:** `src/lib/escalonamento.js` é um porte linha a linha do `simulation.c` do [projeto em C](https://github.com/yan791/Escalonamento_de_tarefas_criticas_de_voo). Os testes comparam a saída com a do programa compilado com gcc em 8 entradas, nos dois algoritmos (`src/lib/__fixtures__/escalonador.json`).
- **Calendário do GitHub:** dados reais de contribuições, salvos em `src/dados/contribuicoes.json`.
- **Mídias reais:** o vídeo da SOLA. foi gravado do site no ar com `site/ferramentas/capturar.mjs` e convertido com `site/ferramentas/midia.py`. As telas do NutriChoice, do RecifeSafe e da análise dos livros foram capturadas com os projetos rodando localmente (`fotos-nutrichoice.mjs` e `fotos-livros.mjs`) e preparadas com `python ferramentas/imagens.py telas`.

## Rodar localmente

```bash
cd site
npm install
npm run dev      # http://localhost:5330
npm test         # testes do escalonador
npm run build    # gera site/dist, 404.html e sitemap.xml
```

Ferramentas de checagem (Chrome sem janela, com o `npm run preview` rodando na porta 5331):

- `node ferramentas/interacoes.mjs`: navegação, simulador, contato e 404
- `node ferramentas/acessibilidade.mjs`: axe-core (WCAG 2 A e AA)
- `node ferramentas/fluidez.mjs`: tempo de cada quadro durante a rolagem

## Publicação

Cada push na branch `main` dispara `.github/workflows/pages.yml`, que instala, roda os testes, gera o build e publica `site/dist` no GitHub Pages.
