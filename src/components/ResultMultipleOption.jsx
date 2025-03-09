import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const ResultMultipleOption = ({ question }) => {
  const totalVotes = question.answers.reduce(
    (acc, answer) => acc + answer.count,
    0
  );

  const data = question.answers.map((answer) => ({
    name: answer.answer,
    cantidad: answer.count,
  }));

  return (
    <div
      className="container_multiple_option container_result"
      key={question._id}
    >
      <p className="question-title">{question.question}</p>
      <p className="total-answers">{totalVotes} respuestas</p> {/* Mostrar el total de votos */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#638ae6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
