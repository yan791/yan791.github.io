// Ícones de traço desenhados para o site (24x24, traço 1.6).
const P = {
  inicio: 'M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z',
  sobre: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
  projetos: 'M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8M4 13h16',
  trajetoria: 'M6 4v16M6 7h9l-2 2.5L15 12H6',
  contato: 'M4 6h16v12H4zM4.5 6.5l7.5 6 7.5-6',
  seta: 'M7 17 17 7M8 7h9v9',
  baixo: 'M12 5v14M6 13l6 6 6-6',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  copiar: 'M9 9h10v10H9zM5 15V5h10',
  ok: 'M5 12.5 10 17l9-10',
  topo: 'M12 19V5M6 11l6-6 6 6',
}

export default function Icone({ nome, tamanho = 18, className = '' }) {
  return (
    <svg className={`icone ${className}`} width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[nome]} />
    </svg>
  )
}

// Logos de marcas (simple-icons, CC0), preenchidos.
export function Logo({ icone, tamanho = 18, className = '' }) {
  return (
    <svg className={`logo ${className}`} width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={icone.path} />
    </svg>
  )
}
