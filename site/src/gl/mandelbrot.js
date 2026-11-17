// Mandelbrot em WebGL2 com revelação por blocos (cada bloco tem seu progresso de varredura).
// Cores: escala PGM (como as imagens .pgm do projeto em C) de tinta a papel, com o sinal laranja na borda.

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform vec2 uCentro;
uniform float uEscala;
uniform float uIter;
uniform float uRev[30];
uniform vec2 uGrade;
out vec4 cor;

const vec3 TINTA0 = vec3(0.031, 0.043, 0.075);
const vec3 TINTA1 = vec3(0.051, 0.071, 0.125);
const vec3 TINTA2 = vec3(0.066, 0.090, 0.150);
const vec3 PAPEL = vec3(0.949, 0.941, 0.918);
const vec3 SINAL = vec3(1.0, 0.357, 0.133);

float mandel(vec2 c) {
  float x = c.x - 0.25;
  float q = x * x + c.y * c.y;
  if (q * (q + x) <= 0.25 * c.y * c.y) return -1.0;
  if ((c.x + 1.0) * (c.x + 1.0) + c.y * c.y <= 0.0625) return -1.0;
  vec2 z = vec2(0.0);
  float i = 0.0;
  for (int k = 0; k < 1400; k++) {
    if (float(k) >= uIter) break;
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    if (dot(z, z) > 256.0) break;
    i += 1.0;
  }
  if (i >= uIter) return -1.0;
  return i - log2(log2(dot(z, z))) + 4.0;
}

void main() {
  vec2 f = gl_FragCoord.xy;
  vec2 uv = vec2(f.x / uRes.x, 1.0 - f.y / uRes.y);
  vec2 cel = min(floor(uv * uGrade), uGrade - 1.0);
  int idx = int(cel.y * uGrade.x + cel.x);
  float local = fract(uv.y * uGrade.y);
  float rev = uRev[idx];
  if (local > rev) {
    cor = vec4(TINTA1, 1.0);
    return;
  }
  vec2 c = uCentro + (f - 0.5 * uRes) * uEscala;
  float m = mandel(c);
  vec3 col = TINTA0;
  if (m >= 0.0) {
    float g = clamp(log(max(m, 1.0)) / log(uIter), 0.0, 1.0);
    g = pow(g, 1.25);
    col = mix(TINTA2, PAPEL, g);
    col = mix(col, SINAL, smoothstep(0.74, 0.98, g) * 0.42);
  }
  float borda = 0.028;
  if (rev < 1.0 && local > rev - borda) col = mix(col, SINAL, 0.92);
  cor = vec4(col, 1.0);
}`

function compilar(gl, tipo, fonte) {
  const s = gl.createShader(tipo)
  gl.shaderSource(s, fonte)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s))
  return s
}

export const GRADE = { colunas: 6, linhas: 5 }

export function criarMandelbrot(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' })
  if (!gl) return null
  let prog
  try {
    prog = gl.createProgram()
    gl.attachShader(prog, compilar(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compilar(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog))
  } catch (e) {
    console.warn('mandelbrot: shader', e)
    return null
  }
  gl.useProgram(prog)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const u = {}
  for (const n of ['uRes', 'uCentro', 'uEscala', 'uIter', 'uRev', 'uGrade']) u[n] = gl.getUniformLocation(prog, n)
  gl.uniform2f(u.uGrade, GRADE.colunas, GRADE.linhas)

  return {
    gl,
    redimensionar(w, h) {
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    },
    // altura = unidades do plano complexo visíveis na vertical
    desenhar({ cx, cy, altura, iter, revelados }) {
      const w = canvas.width
      const h = canvas.height
      if (!w || !h) return
      gl.uniform2f(u.uRes, w, h)
      gl.uniform2f(u.uCentro, cx, cy)
      gl.uniform1f(u.uEscala, altura / h)
      gl.uniform1f(u.uIter, iter)
      gl.uniform1fv(u.uRev, revelados)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    destruir() {
      // sem loseContext: o mesmo canvas pode ser reaproveitado (StrictMode monta duas vezes)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    },
  }
}

// Mesma conta na CPU, para estimar o custo de cada bloco (iterações), como no projeto em C.
export function iteracoes(cx, cy, max) {
  let x = 0
  let y = 0
  let i = 0
  const xq = cx - 0.25
  const q = xq * xq + cy * cy
  if (q * (q + xq) <= 0.25 * cy * cy || (cx + 1) * (cx + 1) + cy * cy <= 0.0625) return max
  while (i < max && x * x + y * y <= 4) {
    const t = x * x - y * y + cx
    y = 2 * x * y + cy
    x = t
    i++
  }
  return i
}
