export default function QuestionCard({ question, heading = 'h2' }) {
  const Heading = heading
  const images = question.images ?? []

  return (
    <div className="question">
      <p className="eyebrow">{question.category}</p>
      <Heading className="statement">{question.statement}</Heading>
      {images.length > 0 && (
        <div className="question-images">
          {images.map((src, index) => (
            <img
              key={`${question.id}-${index}`}
              src={src}
              alt={images.length === 1 ? 'Figura de la pregunta' : `Figura ${index + 1} de la pregunta`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
