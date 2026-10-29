export default function AnswerMC({ question, options, value, onChange, locked }) {
  return (
    <fieldset className="answers">
      <legend className="sr-only">Opciones</legend>
      {options.map((option) => {
        const selected = value === option.text
        const state = !locked ? '' : option.correct ? 'is-correct' : selected ? 'is-wrong' : ''

        return (
          <label key={option.text} className={`choice ${state}`}>
            <input
              type="radio"
              name={`mc-${question.id}`}
              value={option.text}
              checked={selected}
              disabled={locked}
              onChange={() => onChange(option.text)}
            />
            <span>{option.text}</span>
          </label>
        )
      })}
    </fieldset>
  )
}
