import "../assets/styles/resultOpenAnswer.css";

export const ResultOpenAnswer = ({ question }) => {
  const totalAnswers = question.answers.reduce(
    (acc, answer) => acc + answer.count,
    0
  );

  return (
    <div className="container_open_answers container_result">
      <p className="question-title">{question.question}</p>
      <p className="total-answers">{totalAnswers} respuestas</p>{" "}
      <table>
        <thead>
          <tr>
            <th>Respuesta</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {question.answers.map((answer) => (
            <tr key={answer._id}>
              <td>{answer.answer}</td>
              <td>{answer.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
