import { useEffect, useRef, useState } from "react";
import "../assets/styles/edit_survey.css";
import buttonDelete from "../assets/img/delete.svg";
import buttonAdd from "../assets/img/create.svg";
import buttoLink from "../assets/img/link.svg";
import buttonChart from "../assets/img/chart.svg";
import { TypeQuestion } from "../components/TypeQuestion";
import { v4 as uuidv4 } from "uuid";

export const EditSurvey = () => {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { id: uuidv4(), titleQuestion: "", selectedOption: "Respuesta abierta" },
  ]);

  const adjustTextArea = (ref) => {
    if (ref.current) {
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    adjustTextArea(titleRef);
    adjustTextArea(descriptionRef);
  }, [title, description]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: uuidv4(),
      titleQuestion: "",
      selectedOption: "Respuesta abierta",
    };
    setQuestions([...questions, newQuestion]);
  };

  return (
    <div className="container container_edit_survey">
      <div className="container_edit">
        <div className="container_title_description">
          <textarea
            className="edit_input_title edit_input"
            name="title"
            id="title"
            value={title}
            ref={titleRef}
            onChange={handleTitleChange}
            placeholder="Título de la encuesta"
          />
          <textarea
            className="edit_input_description edit_input"
            name="description"
            id="description"
            value={description}
            ref={descriptionRef}
            onChange={handleDescriptionChange}
            placeholder="Descripción de la encuesta"
          />
        </div>

        <div className="container_questions">
          {questions.map((question) => {
            return <TypeQuestion key={question.id} id={question.id} />;
          })}
        </div>
      </div>

      <div className="container_actions">
        <button
          className="button_action add_button"
          onClick={handleAddQuestion}
        >
          <img className="img_button" src={buttonAdd} alt="add_question" />
        </button>
        <button className="button_action delete_button">
          <img src={buttonDelete} alt="delete" />
        </button>
        <button className="button_action link_button">
          <img src={buttoLink} alt="link" />
        </button>
        <button className="button_action chart_button">
          <img src={buttonChart} alt="chart" />
        </button>
      </div>
    </div>
  );
};
