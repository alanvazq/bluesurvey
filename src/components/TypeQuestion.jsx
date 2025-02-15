import { useEffect, useRef, useState } from "react";
import "../assets/styles/edit_question.css";
import textImage from "../assets/img/text.svg";
import radioImage from "../assets/img/radio.svg";
import boxImage from "../assets/img/box.svg";
import deleteImage from "../assets/img/delete.svg";

export const TypeQuestion = () => {
  const [question, setQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState("Respuesta abierta");

  const questionRef = useRef(null);

  const options = [
    { label: "Respuesta abierta", icon: textImage },
    { label: "Opción única", icon: radioImage },
    { label: "Opción múltiple", icon: boxImage },
  ];

  const handleChange = (event) => {
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

  useEffect(() => {
    adjustTextArea(questionRef);
  }, [question]);

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
      </div>

      <div className="container_type_answer">
        {options.map((option, index) => (
          <div key={index} className="type_question">
            <input
              className="input_radio"
              type="radio"
              id={option.label}
              name="options"
              value={option.label}
              checked={selectedOption === option.label}
              onChange={handleChange}
            />
            <label className="input_label" htmlFor={option.label}>
              <img src={option.icon} alt="icon" className="option_icon" />
              {option.label}
            </label>
          </div>
        ))}
      </div>
      <div className="container_delete">
        <button className="button_delete">
          <img src={deleteImage} alt="delete" />
        </button>
      </div>
    </div>
  );
};
