# yan791.github.io

Portfólio de **Yan Ribeiro Nunes**, estudante de Ciência da Computação na CESAR School (Recife, PE).

No ar em **https://yan791.github.io**.

## Estado

Em construção. Por enquanto o endereço mostra uma página provisória (`site/index.html`).

## Stack planejada

React 19 + Vite + JavaScript, GSAP + ScrollTrigger, Lenis e WebGL2.

## Publicação

Cada push na branch `main` dispara `.github/workflows/pages.yml`:

- sem `site/package.json`: publica a pasta `site/` como está;
- com `site/package.json`: instala, roda os testes, gera o build e publica `site/dist`.
