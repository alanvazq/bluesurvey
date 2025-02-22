import { useEffect, useState } from "react";
import circleImg from "../assets/img/circle.svg";
import squareImg from "../assets/img/square.svg";
import buttonDelete from "../assets/img/delete.svg";
import xmark from "../assets/img/xmark.svg";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

export const Answer = ({ typeAnswer, answers, changeInQuestions }) => {
  const [optionAnswers, setOptionAnswers] = useState([]);
  const [initialState, setInitialState] = useState([]);

  useEffect(() => {
    setInitialState(_.cloneDeep(answers));
    if (
      (typeAnswer === "singleOption" || typeAnswer === "multipleOption") &&
      answers.length > 0
    ) {
      setOptionAnswers(answers);
    } else if (typeAnswer === "open") {
      setOptionAnswers([]);
    } else {
      setOptionAnswers([{ answer: "", _id: `n-${uuidv4()}` }]);
    }
  }, [typeAnswer]);

  const handleOptionAnswerChange = (index, event) => {
    const newOptions = [...optionAnswers];
    newOptions[index].answer = event.target.value;
    setOptionAnswers(newOptions);
  };

  const addNewOption = () => {
    setOptionAnswers([...optionAnswers, { answer: "", _id: `n-${uuidv4()}` }]);
  };

  const removeAnswer = (id) => {
    setOptionAnswers((prevAnswer) =>
      prevAnswer.filter((answer) => answer._id !== id)
    );
  };

  const verifyChange = () => {
    return !_.isEqual(optionAnswers, initialState);
  };

  useEffect(() => {
    if (verifyChange()) {
      changeInQuestions(true);
    } else {
      changeInQuestions(false);
    }
  }, [optionAnswers]);

  if (typeAnswer == "open") {
    return <p className="answer_text">Texto de respuesta</p>;
  }

  return (
    <div className="content_options">
      {optionAnswers.map((option, index) => (
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
          <button
            className="option_delete"
            onClick={() => removeAnswer(option._id)}
          >
            <img src={xmark} alt="delete" />
          </button>
        </div>
      ))}
      <button className="button_add" onClick={addNewOption}>
        Añadir
      </button>
    </div>
  );
};
