import { DIFFICULTY_LABELS } from '../lib/questionPool'
import { formatCorrectAnswer, formatUserAnswer, summarize } from '../lib/grading'
import { formatDuration } from '../lib/time'
import QuestionCard from './QuestionCard'

const DIFFICULTY_ORDER = ['facil', 'media', 'dificil']

function countLabel(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`
}

export default function ResultScreen({ results, elapsedMs, onAgain }) {
  const summary = summarize(results)

  return (
    <section className="card">
      <p className="kicker">Resumen</p>
      <h1>
        {summary.correct} de {summary.total} correctas
      </h1>
      <p className="score">{summary.percent}%</p>
      <p className="elapsed">Tiempo: {formatDuration(elapsedMs)}</p>

      <h2 className="section-title">Por dificultad</h2>
      <ul className="breakdown">
        {DIFFICULTY_ORDER.map((difficulty) => {
          const bucket = summary.byDifficulty[difficulty]
          const total = bucket.correct + bucket.incorrect
          if (total === 0) return null
          return (
            <li key={difficulty}>
              <span>{DIFFICULTY_LABELS[difficulty]}</span>
              <span>
                {countLabel(bucket.correct, 'correcta', 'correctas')}, {countLabel(bucket.incorrect, 'incorrecta', 'incorrectas')}
              </span>
            </li>
          )
        })}
      </ul>

      <h2 className="section-title">Para repasar</h2>
      {summary.missed.length === 0 ? (
        <p className="notice">No fallaste ninguna pregunta.</p>
      ) : (
        <ol className="review">
          {summary.missed.map((result) => (
            <li key={result.question.id}>
              <QuestionCard question={result.question} heading="h3" />
              <p className="review-answer">
                <span>Tu respuesta</span>
                {formatUserAnswer(result.question, result.userAnswer)}
              </p>
              <p className="review-answer correct">
                <span>Respuesta correcta</span>
                {formatCorrectAnswer(result.question)}
              </p>
            </li>
          ))}
        </ol>
      )}

      <button type="button" className="primary" onClick={onAgain}>
        Practicar de nuevo
      </button>
    </section>
  )
}
