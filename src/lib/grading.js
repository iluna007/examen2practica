function correctOptionText(question) {
  return question.options.find((option) => option.correct)?.text ?? ''
}

function formatNumber(value) {
  return String(value).replace('.', ',')
}

export function isCorrect(question, userAnswer) {
  switch (question.type) {
    case 'mc':
      return userAnswer === correctOptionText(question)
    case 'n': {
      if (userAnswer == null || String(userAnswer).trim() === '') return false
      const value = Number(userAnswer)
      if (!Number.isFinite(value)) return false
      // 1e-9 absorbs binary rounding, so a typed boundary such as 1.95
      // still counts for an answer of 2 with tolerance 0.05.
      return Math.abs(value - question.answer) <= question.tolerance + 1e-9
    }
    case 'm':
      return question.pairs.every(([left, right]) => userAnswer?.[left] === right)
    default:
      return false
  }
}

export function matchRows(question, userAnswer) {
  return question.pairs.map(([left, right]) => ({
    left,
    expected: right,
    given: userAnswer?.[left] ?? '',
    ok: userAnswer?.[left] === right,
  }))
}

export function explainCorrectAnswer(question) {
  switch (question.type) {
    case 'mc':
      return correctOptionText(question)
    case 'n':
      return `El valor correcto es ${formatNumber(question.answer)}. La tolerancia aceptada es ± ${formatNumber(question.tolerance)}.`
    case 'm':
      return question.pairs.map(([left, right]) => `${left}: ${right}`).join('\n')
    default:
      return ''
  }
}

export function formatCorrectAnswer(question) {
  switch (question.type) {
    case 'mc':
      return correctOptionText(question)
    case 'n':
      return `${formatNumber(question.answer)} (tolerancia ± ${formatNumber(question.tolerance)})`
    case 'm':
      return question.pairs.map(([left, right]) => `${left}: ${right}`).join('\n')
    default:
      return ''
  }
}

export function formatUserAnswer(question, userAnswer) {
  if (userAnswer == null || userAnswer === '') return 'Sin respuesta'
  switch (question.type) {
    case 'mc':
      return String(userAnswer)
    case 'n':
      return String(userAnswer).replace('.', ',')
    case 'm':
      return question.pairs
        .map(([left]) => `${left}: ${userAnswer?.[left] || 'sin elegir'}`)
        .join('\n')
    default:
      return String(userAnswer)
  }
}

export function summarize(results) {
  const byDifficulty = {
    facil: { correct: 0, incorrect: 0 },
    media: { correct: 0, incorrect: 0 },
    dificil: { correct: 0, incorrect: 0 },
  }

  for (const result of results) {
    const bucket = byDifficulty[result.question.difficulty]
    if (!bucket) continue
    if (result.correct) bucket.correct += 1
    else bucket.incorrect += 1
  }

  const correct = results.filter((result) => result.correct).length
  return {
    correct,
    total: results.length,
    percent: results.length === 0 ? 0 : Math.round((correct / results.length) * 100),
    byDifficulty,
    missed: results.filter((result) => !result.correct),
  }
}
