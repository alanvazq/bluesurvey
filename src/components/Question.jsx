import { useEffect, useRef, useState } from "react";
import "../assets/styles/question.css";
import textImage from "../assets/img/text.svg";
import radioImage from "../assets/img/radio.svg";
import boxImage from "../assets/img/box.svg";
import deleteImage from "../assets/img/delete.svg";
import { Answer } from "./Answer";

export const Question = ({
  id,
  typeQuestion,
  question_survey,
  answers,
  deleteQuestion,
  changeInQuestions,
}) => {
  const [selectedOption, setSelectedOption] = useState(typeQuestion);
  const [question, setQuestion] = useState(question_survey);
  const [initialQuestionState, setInitialQuestionState] = useState(question_survey);
  const [initialTypeState, setInitialTypeState] = useState(typeQuestion);

  const questionRef = useRef(null);

  const options = [
    { type: "open", label: "Respuesta abierta", icon: textImage },
    { type: "singleOption", label: "Opción única", icon: radioImage },
    { type: "multipleOption", label: "Opción múltiple", icon: boxImage },
  ];

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleTitleChange = (event) => {
    setQuestion(event.target.value);
  };

  const adjustTextArea = (ref) => {
    if (ref.current) {
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  };

  const verifyQuestionChange = () => {
    if (question !== initialQuestionState) {
      changeInQuestions(true);
    } else {
      changeInQuestions(false);
    }
  };

  const verifyTypeChange = () => {
    if (selectedOption !== initialTypeState) {
      changeInQuestions(true);
    } else {
      changeInQuestions(false);
    }
  };

  useEffect(() => {
    adjustTextArea(questionRef);
  }, [question]);

  useEffect(() => {
    verifyQuestionChange();
  }, [question]);

  useEffect(() => {
    verifyTypeChange();
  }, [selectedOption]);

  return (
    <div className="container_question">
      <div className="question_answer">
        <textarea
          placeholder="Título de pregunta"
          className="question"
          onChange={handleTitleChange}
          value={question}
          ref={questionRef}
        />

        <div className="container_answer">
          <Answer
            typeAnswer={selectedOption}
            answers={answers}
            changeInQuestions={changeInQuestions}
          />
        </div>
      </div>

      <div className="container_type_answer">
        {options.map((option, index) => (
          <div key={index} className="type_question">
            <input
              className="input_radio"
              type="radio"
              id={`${option.type}-${id}`}
              name={`options-${id}`}
              value={option.type}
              checked={selectedOption === option.type}
              onChange={handleOptionChange}
            />
            <label className="input_label" htmlFor={`${option.type}-${id}`}>
              <img src={option.icon} alt="icon" className="option_icon" />
              {option.label}
            </label>
          </div>
        ))}
      </div>

      <div className="container_delete">
        <button className="button_delete" onClick={() => deleteQuestion(id)}>
          <img src={deleteImage} alt="delete" />
        </button>
      </div>
    </div>
  );
};
