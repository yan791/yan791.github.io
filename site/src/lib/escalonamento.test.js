import { describe, expect, it } from 'vitest'
import casos from './__fixtures__/escalonador.json'
import { formatarSaida, lerEntrada, simular } from './escalonamento.js'

// Cada caso foi executado no programa em C original (gcc -std=c11 -Wall -Wextra -Wpedantic)
// e a saída dos arquivos rate_yrn.out e edf_yrn.out foi gravada como referência.
describe('escalonador igual ao programa em C', () => {
  for (const caso of casos) {
    for (const alg of ['rate', 'edf']) {
      it(`${caso.nome} · ${alg}`, () => {
        const entrada = lerEntrada(caso.entrada)
        expect(entrada.erro).toBeUndefined()
        expect(formatarSaida(simular(entrada, alg), alg)).toBe(caso[alg].replace(/\r/g, ''))
      })
    }
  }
})

describe('validação igual ao input.c', () => {
  it('rejeita C > D', () => {
    expect(lerEntrada('20\nA 5 4 6\n').erro).toBe('Erro: a linha 2 nao respeita C <= D <= P.')
  })
  it('rejeita valor não positivo', () => {
    expect(lerEntrada('20\nA 5 0 1\n').erro).toBe('Erro: valor nao positivo na linha 2.')
  })
  it('rejeita tempo total inválido', () => {
    expect(lerEntrada('x\nA 5 5 1\n').erro).toBe('Erro: a primeira linha deve ter um inteiro positivo.')
  })
  it('rejeita arquivo sem tarefas', () => {
    expect(lerEntrada('20\n\n').erro).toBe('Erro: nenhuma tarefa foi informada.')
  })
})
