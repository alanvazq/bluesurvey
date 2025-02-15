import { useEffect, useState } from "react";
import circleImg from "../assets/img/circle.svg";
import squareImg from "../assets/img/square.svg";

export const Answer = ({ typeAnswer }) => {
  const [optionAnswer, setOptionAnswer] = useState([""]);
  const [multipleOptionAnswer, setMultipleOptionAnswer] = useState([""]);

  const handleOptionAnswerChange = (index, event) => {
    const newOptions = [...optionAnswer];
    newOptions[index] = event.target.value;
    setOptionAnswer(newOptions);
  };

  const handleMultipleOptionChange = (index, event) => {
    const newMultipleOptions = [...multipleOptionAnswer];
    newMultipleOptions[index] = event.target.value;
    setMultipleOptionAnswer(newMultipleOptions);
  };

  const addNewOption = () => {
    setOptionAnswer([...optionAnswer, ""]);
    console.log(optionAnswer);
  };

  const addNewMultipleOption = () => {
    setMultipleOptionAnswer([...multipleOptionAnswer, ""]);
    console.log(multipleOptionAnswer);
  };

  useEffect(() => {
     
  }, []);

  const typeAnswerElement = () => {
    switch (typeAnswer) {
      case "Respuesta abierta":
        return <p className="answer_text">Texto de respuesta</p>;
      case "Opción única":
        return (
          <div className="content_single_option">
            {optionAnswer.map((option, index) => {
              return (
                <div key={index} className="container_single_option">
                  <img
                    src={circleImg}
                    alt="circle_icon"
                    className="img_option"
                  />
                  <input
                    className="input_option"
                    type="text"
                    placeholder="Escribe aquí..."
                    onChange={(event) => handleOptionAnswerChange(index, event)}
                  />
                </div>
              );
            })}
            <button className="button_add" onClick={addNewOption}>
              Añadir
            </button>
          </div>
        );

      case "Opción múltiple":
        return (
          <div className="content_multiple_option">
            {multipleOptionAnswer.map((option, index) => {
              return (
                <div key={index} className="container_multiple_option">
                  <img src={squareImg} alt="img_multiple_option" />
                  <input
                    className="input_option"
                    type="text"
                    placeholder="Escribe aquí..."
                    onChange={(event) =>
                      handleMultipleOptionChange(index, event)
                    }
                  />
                </div>
              );
            })}
            <button className="button_add" onClick={addNewMultipleOption}>
              Añadir
            </button>
          </div>
        );

      default:
        break;
    }
  };

  return <div>{typeAnswerElement()}</div>;
};
