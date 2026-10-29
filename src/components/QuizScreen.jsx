import { useEffect, useState } from 'react'
import { explainCorrectAnswer, isCorrect, matchRows } from '../lib/grading'
import { shuffle } from '../lib/questionPool'
import { formatDuration } from '../lib/time'
import AnswerMatch from './AnswerMatch'
import AnswerMC from './AnswerMC'
import AnswerNumeric from './AnswerNumeric'
import ProgressBar from './ProgressBar'
import QuestionCard from './QuestionCard'

function Stopwatch({ startedAt }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [])

  const label = formatDuration(now - startedAt)

  return (
    <p className="timer" role="timer" aria-label={`Tiempo transcurrido ${label}`}>
      <span className="progress-label">Tiempo</span>
      <span className="timer-value">{label}</span>
    </p>
  )
}

export default function QuizScreen({ questions, notice, onFinish }) {
  const [startedAt] = useState(() => Date.now())
  const [orders] = useState(
    () =>
      new Map(
        questions.map((item) => [
          item.id,
          item.type === 'mc'
            ? shuffle(item.options)
            : item.type === 'm'
              ? shuffle(item.pairs.map((pair) => pair[1]))
              : null,
        ]),
      ),
  )
  const [index, setIndex] = useState(0)
  const [records, setRecords] = useState(() => Array(questions.length).fill(null))
  const [drafts, setDrafts] = useState(() => questions.map((question) => (question.type === 'm' ? {} : '')))

  const question = questions[index]
  const saved = records[index]
  const locked = saved != null
  const value = saved ? saved.userAnswer : drafts[index]
  const showExplanation = locked && !saved.correct

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [index])

  function updateDraft(nextValue) {
    if (locked) return
    setDrafts((current) => {
      const next = [...current]
      next[index] = nextValue
      return next
    })
  }

  function canSubmit() {
    if (question.type === 'mc' || question.type === 'n') return String(value).trim() !== ''
    return question.pairs.every(([left]) => value?.[left])
  }

  function respond(event) {
    event.preventDefault()
    if (locked || !canSubmit()) return
    const userAnswer = question.type === 'm' ? { ...value } : value
    const correct = isCorrect(question, userAnswer)
    setRecords((current) => {
      const next = [...current]
      next[index] = { question, userAnswer, correct }
      return next
    })
  }

  function goBack() {
    if (index === 0) return
    setIndex((current) => current - 1)
  }

  function goNext() {
    if (!records[index]) return
    if (index + 1 >= questions.length) {
      onFinish(records, Date.now() - startedAt)
      return
    }
    setIndex((current) => current + 1)
  }

  const matched = question.type === 'm' ? matchRows(question, value).filter((row) => row.ok).length : 0

  return (
    <form className="card" onSubmit={respond}>
      {notice && <p className="notice">{notice}</p>}
      <div className={`quiz-body ${showExplanation ? 'has-explanation' : ''}`}>
        <div className="quiz-main">
          <div className="quiz-top">
            <ProgressBar current={index + 1} total={questions.length} />
            <Stopwatch startedAt={startedAt} />
          </div>
          <QuestionCard question={question} />

          {question.type === 'mc' && (
            <AnswerMC
              question={question}
              options={orders.get(question.id)}
              value={value}
              onChange={updateDraft}
              locked={locked}
            />
          )}
          {question.type === 'n' && (
            <AnswerNumeric value={value} onChange={updateDraft} locked={locked} />
          )}
          {question.type === 'm' && (
            <AnswerMatch
              question={question}
              definitions={orders.get(question.id)}
              value={value}
              onChange={updateDraft}
              locked={locked}
            />
          )}

          {locked && (
            <div className={`feedback ${saved.correct ? 'ok' : 'bad'}`} role="status">
              <strong>{saved.correct ? 'Correcto' : 'Incorrecto'}</strong>
              {question.type === 'm' && (
                <p>
                  {matched} de {question.pairs.length} pares coinciden.
                  {!saved.correct && ' La pregunta cuenta como incorrecta si falta alguno.'}
                </p>
              )}
            </div>
          )}
        </div>

        {showExplanation && (
          <aside className="explanation">
            <p className="eyebrow">Respuesta correcta</p>
            <p>{explainCorrectAnswer(question)}</p>
          </aside>
        )}
      </div>

      <div className="actions">
        <button type="button" className="secondary" onClick={goBack} disabled={index === 0}>
          Anterior
        </button>
        {locked ? (
          <button type="button" className="primary" onClick={goNext}>
            {index + 1 >= questions.length ? 'Ver resumen' : 'Siguiente pregunta'}
          </button>
        ) : (
          <button type="submit" className="primary" disabled={!canSubmit()}>
            Responder
          </button>
        )}
      </div>
    </form>
  )
}
