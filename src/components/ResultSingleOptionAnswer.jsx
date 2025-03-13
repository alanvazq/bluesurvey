import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#3674B5",
  "#578FCA",
  "#A1E3F9",
  "#A594F9",
  "#CDC1FF",
  "#F5EFFF",
  "#E5D9F2",
];

export const ResultSingleOptionAnswer = ({ question }) => {
  const totalAnswers = question.answers.reduce(
    (acc, answer) => acc + answer.count,
    0
  );

  const data = question.answers.map((answer, index) => {
    const percentage = ((answer.count / totalAnswers) * 100).toFixed(2); // Calcula el porcentaje
    return {
      name: answer.answer,
      value: answer.count,
      color: COLORS[index % COLORS.length],
      percentage,
    };
  });

  return (
    <div
      className="container_single_option container_result"
      key={question._id}
    >
      <p className="question-title">{question.question}</p>
      <p className="total-answers">{totalAnswers} respuestas</p>{" "}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ percent }) => `${(percent * 100).toFixed(2)}%`} // Muestra el porcentaje dentro del gráfico
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
