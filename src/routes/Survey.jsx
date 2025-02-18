import { useEffect, useRef, useState } from "react";
import "../assets/styles/edit_survey.css";
import buttonDelete from "../assets/img/delete.svg";
import buttonAdd from "../assets/img/create.svg";
import buttoLink from "../assets/img/link.svg";
import buttonChart from "../assets/img/chart.svg";
import buttonSave from "../assets/img/save.svg";
import { Question } from "../components/Question";
import { v4 as uuidv4 } from "uuid";
import Header from "../layout/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import {
  getSurveyData,
  deleteSurveyById,
  updateTitleOrDescription,
} from "../services/surveyService";

export const Survey = () => {
  const { id } = useParams();
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const auth = useAuth();
  const accessToken = auth.getAccessToken();
  const goTo = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [survey, setSurvey] = useState({});

  const adjustTextArea = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    adjustTextArea(titleRef);
    adjustTextArea(descriptionRef);
  }, [title, description]);

  useEffect(() => {
    getSurvey();
  }, []);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      _id: uuidv4(),
      idUser: survey.idUser,
      idSurvey: survey.idSurvey,
      typeQuestion: "open",
      question: "",
      answers: [],
    };

    setQuestions([...questions, newQuestion]);
  };

  const handleSaveChanges = () => {
    let updatedData = {};
    let titleOrDescriptionChanged = false;
    let questionsChanged = false;

    if (title !== survey.title || description !== survey.description) {
      updateTitleAndDescription();
    }
  };

  const getSurvey = async () => {
    try {
      const survey = await getSurveyData(id, accessToken);
      setSurvey(survey);
      setTitle(survey.title);
      setDescription(survey.description);
      if (survey.questions.length === 0) {
        setQuestions([
          {
            _id: uuidv4(),
            idUser: survey.idUser,
            idSurvey: survey.idSurvey,
            typeQuestion: "open",
            question: "",
            answers: [],
          },
        ]);
      } else {
        setQuestions(survey.questions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSurvey = async () => {
    try {
      const surveyDeleted = await deleteSurveyById(id, accessToken);
      if (surveyDeleted) {
        console.log("Encuesta eliminada");
        goTo("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTitleAndDescription = async () => {
    try {
      const surveyUpdated = await updateTitleOrDescription(
        id,
        title,
        description,
        accessToken
      );
      if (surveyUpdated) {
        console.log("Encuesta actualizada");
        setTitle(surveyUpdated.title),
          setDescription(surveyUpdated.description);
      } else {
        console.log("Errror al actualizar la encuesta");
      }
    } catch (error) {}
  };

  return (
    <>
      <Header />
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
              return (
                <Question
                  key={question._id}
                  id={question._id}
                  typeQuestion={question.typeQuestion}
                  question_survey={question.question}
                  answers={question.answers}
                />
              );
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
          <button className="button_action save_button" onClick={handleSaveChanges}>
            <img className="img_button" src={buttonSave} alt="save_survey" />
          </button>
          <button
            className="button_action delete_button"
            onClick={deleteSurvey}
          >
            <img src={buttonDelete} alt="delete" />
          </button>
          <button className="button_action link_button">
            <img src={buttoLink} alt="link" />
          </button>
          <button className="button_action chart_button">
            <img src={buttonChart} alt="chart" />
          </button>
        </div>

        {/* <CopyToClipboard text={`${import.meta.env.VITE_URL_SURVEY}/public-survey/${id}`}>
                            <button className='button_share' onClick={() => toast.success('Link copiado')}>
                                <img src={shareIcon} />
                            </button>
                        </CopyToClipboard> */}
      </div>
    </>
  );
};
