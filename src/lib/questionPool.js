export const SESSION_CAP = 40

export const DIFFICULTY_OPTIONS = [
  { id: 'facil', label: 'Fácil' },
  { id: 'media', label: 'Media' },
  { id: 'dificil', label: 'Difícil' },
  { id: 'mixto', label: 'Mixto', detail: 'Todas mezcladas' },
]

export const DIFFICULTY_LABELS = {
  facil: 'Fácil',
  media: 'Media',
  dificil: 'Difícil',
  mixto: 'Mixto',
}

export function countLabel(count) {
  return `${count} ${count === 1 ? 'pregunta' : 'preguntas'}`
}

export function countByDifficulty(bank) {
  const counts = { facil: 0, media: 0, dificil: 0, mixto: bank.length }
  for (const question of bank) {
    if (question.difficulty === 'facil' || question.difficulty === 'media' || question.difficulty === 'dificil') {
      counts[question.difficulty] += 1
    }
  }
  return counts
}

export function shuffle(items) {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

export function poolForDifficulty(bank, difficulty) {
  if (difficulty === 'mixto') return bank
  return bank.filter((question) => question.difficulty === difficulty)
}

export function describeSession(bank, difficulty, amount) {
  const available = poolForDifficulty(bank, difficulty).length
  const isAll = amount === 'all'
  const requested = isAll ? Math.min(available, SESSION_CAP) : Number(amount)
  const actual = Math.min(requested, available)

  let notice = null
  if (available === 0) {
    notice = 'No hay preguntas disponibles en este nivel.'
  } else if (!isAll && requested > available) {
    notice = `Pediste ${countLabel(requested)} y en este nivel hay ${countLabel(available)}. Se usarán todas, sin repetir.`
  } else if (isAll && available > SESSION_CAP) {
    notice = `Hay ${countLabel(available)} en este nivel. Esta sesión toma ${countLabel(SESSION_CAP)}, al azar.`
  }

  return { available, requested, actual, notice }
}

export function selectQuestions(bank, difficulty, amount) {
  const session = describeSession(bank, difficulty, amount)
  const pool = poolForDifficulty(bank, difficulty)
  return {
    ...session,
    questions: shuffle(pool).slice(0, session.actual),
  }
}
