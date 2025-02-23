import { useEffect, useRef, useState } from "react";
import "../assets/styles/question.css";
import textImage from "../assets/img/text.svg";
import radioImage from "../assets/img/radio.svg";
import boxImage from "../assets/img/box.svg";
import { Answer } from "./Answer";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

export const Question = ({
  id,
  typeQuestion,
  questionSurvey,
  answers,
  deleteQuestion,
  onEdit,
  isEditing,
}) => {
  const [titleQuestion, setTitleQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [answersQuestion, setAnswersQuestion] = useState([]);

  const [initialTitle, setInitialTitle] = useState("");
  const [initialOption, setInitialOption] = useState("");
  const [initialAnswers, setIntialAnswers] = useState([]);

  const questionRef = useRef(null);

  const options = [
    { type: "open", label: "Respuesta abierta", icon: textImage },
    { type: "singleOption", label: "Opción única", icon: radioImage },
    { type: "multipleOption", label: "Opción múltiple", icon: boxImage },
  ];

  const handleChangeEditMode = () => {
    onEdit(id);
  };

  const handleTitleChange = (event) => {
    setTitleQuestion(event.target.value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleOptionAnswerChange = (index, event) => {
    const newOptions = [...answersQuestion];
    newOptions[index].answer = event.target.value;
    setAnswersQuestion(newOptions);
  };

  const addNewAnswer = () => {
    setAnswersQuestion([
      ...answersQuestion,
      { answer: "", _id: `n-${uuidv4()}` },
    ]);
  };

  const removeAnswer = (id) => {
    setAnswersQuestion((prevAnswer) =>
      prevAnswer.filter((answer) => answer._id !== id)
    );
  };

  const adjustTextArea = (ref) => {
    if (ref.current) {
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  };

  const changesInTitleQuestion = () => {
    return titleQuestion !== initialTitle;
  };

  const changesInOption = () => {
    return selectedOption !== initialOption;
  };

  const changeInAnswrs = () => {
    return !_.isEqual(answersQuestion, initialAnswers);
  };
  useEffect(() => {
    if (changesInTitleQuestion()) {
      console.log("Cambio el titulo");
    } else if (changesInOption()) {
      console.log("Cambio el tipo de pregunta");
    } else if (changeInAnswrs()) {
      console.log("Cambios en respuestas");
    }
  }, [titleQuestion, selectedOption, answersQuestion]);

  useEffect(() => {
    setInitialTitle(_.cloneDeep(questionSurvey));
    setInitialOption(_.cloneDeep(typeQuestion));
    setIntialAnswers(_.cloneDeep(answers));
    setSelectedOption(typeQuestion);
    setTitleQuestion(questionSurvey);
    setAnswersQuestion(answers);
  }, []);

  useEffect(() => {
    if (
      (selectedOption === "singleOption" ||
        selectedOption === "multipleOption") &&
      answersQuestion.length === 0
    ) {
      setAnswersQuestion([{ answer: "", _id: `n-${uuidv4()}` }]);
    }
  }, [selectedOption]);

  useEffect(() => {
    adjustTextArea(questionRef);
  }, [titleQuestion]);
  return (
    <div
      className={`container_question ${
        isEditing ? "question_edit" : "question_no_edit"
      }`}
      onClick={handleChangeEditMode}
    >
      <div className="question_answer">
        <textarea
          placeholder="Título de pregunta"
          className={`${
            isEditing ? "question" : "question_preview"
          } title_question `}
          onChange={handleTitleChange}
          value={titleQuestion}
          ref={questionRef}
        />
        <div className="container_answer">
          <Answer
            typeAnswer={selectedOption}
            answers={answersQuestion}
            isEditing={isEditing}
            handleOptionAnswerChange={handleOptionAnswerChange}
            addNewAnswer={addNewAnswer}
            removeAnswer={removeAnswer}
          />
        </div>
      </div>

      <div className="container_type_answer">
        {isEditing &&
          options.map((option, index) => (
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

      {isEditing && (
        <div className="container_savequestion">
          <button className="button_save_question">Guardar</button>
          <button className="button_delete" onClick={() => deleteQuestion(id)}>
            Eliminar pregunta
          </button>
        </div>
      )}
    </div>
  );
};
