export default function ProgressBar({ current, total }) {
  const width = total === 0 ? 0 : (current / total) * 100

  return (
    <div className="progress">
      <p className="progress-label">
        Pregunta {current} de {total}
      </p>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}
