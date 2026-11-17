// Preferência de movimento do visitante. Por decisão do Yan o movimento fica ligado por padrão,
// mesmo quando o sistema pede movimento reduzido; o visitante pode reduzir pelo controle do site.
import { useSyncExternalStore } from 'react'

const CHAVE = 'yan-movimento'
const ouvintes = new Set()

function ler() {
  try {
    return localStorage.getItem(CHAVE) === 'reduzido' ? 'reduzido' : 'completo'
  } catch {
    return 'completo'
  }
}

let atual = typeof window === 'undefined' ? 'completo' : ler()

export function aplicarClasse() {
  document.documentElement.classList.toggle('movimento-reduzido', atual === 'reduzido')
}

export function movimentoAtual() {
  return atual
}

export function reduzido() {
  return atual === 'reduzido'
}

export function definirMovimento(valor) {
  atual = valor
  try {
    localStorage.setItem(CHAVE, valor)
  } catch {
    /* navegação privada: vale só nesta visita */
  }
  aplicarClasse()
  ouvintes.forEach((f) => f(valor))
}

export function aoMudarMovimento(f) {
  ouvintes.add(f)
  return () => ouvintes.delete(f)
}

export function useMovimento() {
  return useSyncExternalStore(aoMudarMovimento, movimentoAtual, () => 'completo')
}

export const EASE = {
  saida: 'expo.out',
  troca: 'power3.inOut',
}
