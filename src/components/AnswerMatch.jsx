import { matchRows } from '../lib/grading'

export default function AnswerMatch({ question, definitions, value, onChange, locked }) {
  const rows = matchRows(question, value)

  return (
    <fieldset className="answers">
      <legend className="hint">Relaciona cada término con su definición.</legend>
      {rows.map((row) => {
        const state = !locked ? '' : row.ok ? 'is-correct' : 'is-wrong'
        return (
          <label key={row.left} className={`match-row ${state}`}>
            <span className="match-term">{row.left}</span>
            <select
              value={row.given}
              disabled={locked}
              onChange={(event) => onChange({ ...value, [row.left]: event.target.value })}
            >
              <option value="">Elige una definición</option>
              {definitions.map((definition) => (
                <option key={definition} value={definition}>
                  {definition}
                </option>
              ))}
            </select>
            {locked && !row.ok && <span className="match-fix">Correcto: {row.expected}</span>}
          </label>
        )
      })}
    </fieldset>
  )
}
