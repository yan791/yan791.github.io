import { definirMovimento, useMovimento } from '../lib/movimento.js'

export default function ControleMovimento() {
  const mov = useMovimento()
  return (
    <div className="controle-movimento" role="group" aria-label="Movimento do site">
      <span className="mono">Movimento</span>
      {[
        ['completo', 'completo'],
        ['reduzido', 'reduzido'],
      ].map(([v, t]) => (
        <button key={v} type="button" aria-pressed={mov === v} onClick={() => definirMovimento(v)}>
          {t}
        </button>
      ))}
    </div>
  )
}
