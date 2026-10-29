import { useState } from 'react'
import bank from './data/questions_bank.json'
import HomeScreen from './components/HomeScreen'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import { selectQuestions } from './lib/questionPool'

export default function App() {
  const [view, setView] = useState('home')
  const [session, setSession] = useState(null)
  const [results, setResults] = useState([])
  const [elapsedMs, setElapsedMs] = useState(0)

  function start({ difficulty, amount }) {
    const selected = selectQuestions(bank, difficulty, amount)
    setSession({ ...selected, id: Date.now() })
    setResults([])
    setView('quiz')
  }

  function finish(nextResults, nextElapsed) {
    setResults(nextResults)
    setElapsedMs(nextElapsed)
    setView('resumen')
  }

  function again() {
    setSession(null)
    setResults([])
    setView('home')
  }

  return (
    <main className="app">
      {view === 'home' && <HomeScreen bank={bank} onStart={start} />}
      {view === 'quiz' && session && (
        <QuizScreen
          key={session.id}
          questions={session.questions}
          notice={session.notice}
          onFinish={finish}
        />
      )}
      {view === 'resumen' && <ResultScreen results={results} elapsedMs={elapsedMs} onAgain={again} />}
    </main>
  )
}
