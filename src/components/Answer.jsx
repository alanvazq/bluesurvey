import { useEffect, useState } from "react";
import circleImg from "../assets/img/circle.svg";
import squareImg from "../assets/img/square.svg";

export const Answer = ({ typeAnswer, answers }) => {
  const [optionAnswer, setOptionAnswer] = useState([]);

  const handleOptionAnswerChange = (index, event) => {
    const newOptions = [...optionAnswer];
    newOptions[index].answer = event.target.value;
    setOptionAnswer(newOptions);
  };

  const addNewOption = () => {
    setOptionAnswer([...optionAnswer, { answer: "" }]);
  };

  useEffect(() => {
    if (
      typeAnswer == "singleOption" ||
      (typeAnswer == "multipleOption" && answers)
    ) {
      setOptionAnswer(answers);
    } else {
      setOptionAnswer([{ answer: "" }]);
    }
  }, []);

  if (typeAnswer == "open") {
    return <p className="answer_text">Texto de respuesta</p>;
  }

  return (
    <div className="content_options">
      {optionAnswer.map((option, index) => (
        <div key={index} className="container_option">
          <img
            src={typeAnswer === "singleOption" ? circleImg : squareImg}
            alt="option_icon"
            className="img_option"
          />
          <input
            className="input_option"
            type="text"
            placeholder="Escribe aquí..."
            value={option.answer}
            onChange={(event) => handleOptionAnswerChange(index, event)}
          />
        </div>
      ))}
      <button className="button_add" onClick={addNewOption}>
        Añadir
      </button>
    </div>
  );
};
