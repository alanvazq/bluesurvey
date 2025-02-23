import { useEffect, useState } from "react";
import circleImg from "../assets/img/circle.svg";
import squareImg from "../assets/img/square.svg";
import buttonDelete from "../assets/img/delete.svg";
import xmark from "../assets/img/xmark.svg";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

export const Answer = ({
  typeAnswer,
  answers,
  isEditing,
  handleOptionAnswerChange,
  addNewAnswer,
  removeAnswer,
}) => {
  

  if (typeAnswer == "open") {
    return <p className="answer_text">Texto de respuesta</p>;
  }

  return (
    <div className="content_options">
      {answers.map((option, index) => (
        <div key={index} className="container_option">
          <img
            src={typeAnswer === "singleOption" ? circleImg : squareImg}
            alt="option_icon"
            className="img_option"
          />

          <input
            className={` ${
              isEditing ? "input_answer" : "input_preview"
            } input_option`}
            type="text"
            placeholder="Escribe aquí..."
            value={option.answer}
            onChange={(event) => handleOptionAnswerChange(index, event)}
          />

          {isEditing ? (
            <button
              className="option_delete"
              onClick={() => removeAnswer(option._id)}
            >
              <img src={xmark} alt="delete" />
            </button>
          ) : (
            <></>
          )}
        </div>
      ))}
      {isEditing ? (
        <button className="button_add" onClick={addNewAnswer}>
          Añadir
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};
