export default function AnswerNumeric({ value, onChange, locked }) {
  return (
    <label className="numeric">
      <span>Tu respuesta</span>
      <input
        type="number"
        inputMode="decimal"
        step="any"
        placeholder="Tu respuesta"
        value={value}
        disabled={locked}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
