import { useState } from 'react'
import {
  DIFFICULTY_OPTIONS,
  SESSION_CAP,
  countByDifficulty,
  countLabel,
  describeSession,
} from '../lib/questionPool'

export default function HomeScreen({ bank, onStart }) {
  const [difficulty, setDifficulty] = useState('mixto')
  const [amount, setAmount] = useState('10')
  const counts = countByDifficulty(bank)
  const session = describeSession(bank, difficulty, amount)
  const allLabel = session.available > SESSION_CAP ? `${SESSION_CAP} de ${session.available}` : countLabel(session.available)

  return (
    <section className="card">
      <p className="kicker">Práctica de examen</p>
      <h1>Examen 2: Geometría y Estructuras</h1>
      <p className="lede">
        Practica propiedades de materiales, térmica y acústica, apoyos y uniones, bajada de cargas y factor de seguridad.
      </p>

      <fieldset>
        <legend>Nivel de dificultad</legend>
        <div className="pick-list">
          {DIFFICULTY_OPTIONS.map((option) => {
            const count = counts[option.id]
            return (
              <label key={option.id} className="pick">
                <input
                  type="radio"
                  name="difficulty"
                  value={option.id}
                  checked={difficulty === option.id}
                  onChange={() => setDifficulty(option.id)}
                />
                <span className="pick-copy">
                  <span className="pick-title">{option.label}</span>
                  {option.detail && <span className="pick-detail">{option.detail}</span>}
                </span>
                <span className="pick-meta">{countLabel(count)}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend>Cantidad de preguntas</legend>
        <div className="amount-list">
          <label className="pick amount">
            <input type="radio" name="amount" value="10" checked={amount === '10'} onChange={() => setAmount('10')} />
            <span className="pick-title">10</span>
          </label>
          <label className="pick amount">
            <input type="radio" name="amount" value="20" checked={amount === '20'} onChange={() => setAmount('20')} />
            <span className="pick-title">20</span>
          </label>
          <label className="pick amount">
            <input type="radio" name="amount" value="all" checked={amount === 'all'} onChange={() => setAmount('all')} />
            <span className="pick-copy">
              <span className="pick-title">Todas</span>
              <span className="pick-detail">{allLabel}</span>
            </span>
          </label>
        </div>
      </fieldset>

      <p className="session-size">Esta sesión: {countLabel(session.actual)}.</p>
      {session.notice && <p className="notice">{session.notice}</p>}

      <button
        type="button"
        className="primary"
        disabled={session.actual === 0}
        onClick={() => onStart({ difficulty, amount })}
      >
        Comenzar práctica
      </button>
    </section>
  )
}
