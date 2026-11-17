// Porte fiel de src/simulation.c e das regras de src/input.c do projeto
// github.com/yan791/Escalonamento_de_tarefas_criticas_de_voo.
// Testado contra a saída real do programa em C (__fixtures__/escalonador.json).

export const ALGORITMOS = { rate: 'RATE', edf: 'EDF' }

// Lê o mesmo formato do arquivo de entrada. Devolve { tempoTotal, tarefas } ou { erro }.
export function lerEntrada(texto) {
  const linhas = texto.replace(/\r/g, '').split('\n')
  const primeira = (linhas[0] ?? '').trim()
  const tempoTotal = Number(primeira)
  if (!/^\d+$/.test(primeira) || tempoTotal <= 0) return { erro: 'Erro: a primeira linha deve ter um inteiro positivo.' }
  const tarefas = []
  for (let i = 1; i < linhas.length; i++) {
    const linha = linhas[i].trim()
    if (!linha) continue
    const partes = linha.split(/\s+/)
    const numero = i + 1
    if (partes.length !== 4 || partes[0].length > 31 || !partes.slice(1).every((p) => /^-?\d+$/.test(p))) {
      return { erro: `Erro: formato invalido na linha ${numero}.` }
    }
    const [nome, p, d, c] = [partes[0], ...partes.slice(1).map(Number)]
    if (p <= 0 || d <= 0 || c <= 0) return { erro: `Erro: valor nao positivo na linha ${numero}.` }
    if (!(c <= d && d <= p)) return { erro: `Erro: a linha ${numero} nao respeita C <= D <= P.` }
    tarefas.push({ nome, periodo: p, deadline: d, burst: c })
  }
  if (!tarefas.length) return { erro: 'Erro: nenhuma tarefa foi informada.' }
  return { tempoTotal, tarefas }
}

// Simula como o executar() em C. Devolve { trechos, tarefas } onde cada trecho é
// { inicio, fim, tarefa (índice ou -1 para idle), motivo ('F' | 'H' | 'L' | 'K' | '?') }.
export function simular({ tempoTotal, tarefas: base }, algoritmo) {
  const tarefas = base.map((t) => ({
    ...t,
    restante: 0,
    chegada: 0,
    deadlineAbsoluto: 0,
    ativa: false,
    liberadas: 0,
    concluidas: 0,
    perdidas: 0,
    encerradas: 0,
    tempoCpu: 0,
  }))
  const trechos = []
  // eventos extras para o desenho do Gantt (não mudam a saída em texto)
  const eventos = { chegadas: [], perdas: [] }

  const guardar = (tempo, tarefa) => {
    const ultimo = trechos[trechos.length - 1]
    if (ultimo && ultimo.tarefa === tarefa && ultimo.fim === tempo) {
      ultimo.fim++
      return
    }
    trechos.push({ inicio: tempo, fim: tempo + 1, tarefa, motivo: '?' })
  }

  const escolher = () => {
    let escolhida = -1
    for (let i = 0; i < tarefas.length; i++) {
      const c = tarefas[i]
      if (!c.ativa) continue
      if (escolhida === -1) {
        escolhida = i
        continue
      }
      const a = tarefas[escolhida]
      if (algoritmo === 'rate' && c.periodo < a.periodo) escolhida = i
      else if (algoritmo === 'edf' && c.deadlineAbsoluto < a.deadlineAbsoluto) escolhida = i
    }
    return escolhida
  }

  const checarPrazos = (tempo) => {
    tarefas.forEach((t, i) => {
      if (t.ativa && t.deadlineAbsoluto === tempo) {
        t.ativa = false
        t.restante = 0
        t.perdidas++
        eventos.perdas.push({ tempo, tarefa: i })
      }
    })
  }

  const criarInstancias = (tempo) => {
    for (const [i, t] of tarefas.entries()) {
      if (tempo % t.periodo) continue
      eventos.chegadas.push({ tempo, tarefa: i, prazo: tempo + t.deadline })
      t.ativa = true
      t.restante = t.burst
      t.chegada = tempo
      t.deadlineAbsoluto = tempo + t.deadline
      t.liberadas++
    }
  }

  let anterior = -1
  for (let tempo = 0; tempo < tempoTotal; tempo++) {
    const anteriorAtiva = anterior !== -1 && tarefas[anterior].ativa
    const anteriorPerdeuAgora = anteriorAtiva && tarefas[anterior].deadlineAbsoluto === tempo

    checarPrazos(tempo)
    criarInstancias(tempo)
    const escolhida = escolher()

    if (anterior !== -1 && anterior !== escolhida && anteriorAtiva) {
      trechos[trechos.length - 1].motivo = anteriorPerdeuAgora ? 'L' : 'H'
    }
    guardar(tempo, escolhida)

    if (escolhida === -1) {
      anterior = -1
      continue
    }
    const rodando = tarefas[escolhida]
    rodando.restante--
    rodando.tempoCpu++
    if (!rodando.restante) {
      rodando.ativa = false
      rodando.concluidas++
      trechos[trechos.length - 1].motivo = 'F'
    }
    anterior = escolhida
  }

  const ativaNoFim = anterior !== -1 && tarefas[anterior].ativa
  checarPrazos(tempoTotal)
  if (ativaNoFim && !tarefas[anterior].ativa) trechos[trechos.length - 1].motivo = 'L'
  tarefas.forEach((t, i) => {
    if (!t.ativa) return
    t.ativa = false
    t.restante = 0
    t.encerradas++
    if (i === anterior) trechos[trechos.length - 1].motivo = 'K'
  })

  return { trechos, tarefas, eventos, tempoTotal }
}

// Texto idêntico ao arquivo <algoritmo>_yrn.out gerado pelo programa em C.
export function formatarSaida(resultado, algoritmo) {
  const { trechos, tarefas } = resultado
  const l = [`EXECUTION BY ${ALGORITMOS[algoritmo]}`]
  for (const t of trechos) {
    const dur = t.fim - t.inicio
    l.push(t.tarefa === -1 ? `idle for ${dur} units` : `[${tarefas[t.tarefa].nome}] for ${dur} units - ${t.motivo}`)
  }
  l.push('LOST DEADLINES', ...tarefas.map((t) => `[${t.nome}] ${t.perdidas}`))
  l.push('COMPLETE EXECUTION', ...tarefas.map((t) => `[${t.nome}] ${t.concluidas}`))
  l.push('KILLED', ...tarefas.map((t) => `[${t.nome}] ${t.encerradas}`))
  return l.join('\n') + '\n'
}

export function paraTexto({ tempoTotal, tarefas }) {
  return [String(tempoTotal), ...tarefas.map((t) => `${t.nome} ${t.periodo} ${t.deadline} ${t.burst}`)].join('\n') + '\n'
}
