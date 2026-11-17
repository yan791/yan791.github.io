import { useEffect, useRef, useState } from 'react'

// Marca o elemento com a classe "em-cena" quando entra na tela (uma vez).
export function useEmCena({ limiar = 0.18, margem = '0px 0px -8% 0px', uma = true } = {}) {
  const ref = useRef(null)
  const [visto, setVisto] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisto(true)
          if (uma) io.disconnect()
        } else if (!uma) setVisto(false)
      },
      { threshold: limiar, rootMargin: margem },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [limiar, margem, uma])
  return [ref, visto]
}

// true enquanto o elemento estiver (parcialmente) na tela.
export function useNaTela(ref, { limiar = 0, margem = '0px' } = {}) {
  const [dentro, setDentro] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setDentro(e.isIntersecting), { threshold: limiar, rootMargin: margem })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, limiar, margem])
  return dentro
}

export const ponteiroFino = () => typeof window !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches
