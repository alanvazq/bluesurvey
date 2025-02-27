import { useEffect, useRef, useState } from "react";
import "../assets/styles/edit_survey.css";
import buttonDelete from "../assets/img/delete.svg";
import buttonAdd from "../assets/img/create.svg";
import buttoLink from "../assets/img/link.svg";
import buttonChart from "../assets/img/chart.svg";
import buttonSave from "../assets/img/save.svg";
import noChanges from "../assets/img/changes.svg";
import { Question } from "../components/Question";
import { v4 as uuidv4 } from "uuid";
import Header from "../layout/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

import {
  getSurveyData,
  deleteSurveyById,
  updateTitleOrDescription,
  deleteQuestionById,
} from "../services/surveyService";

export const Survey = () => {
  const { id } = useParams();
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const auth = useAuth();
  const accessToken = auth.getAccessToken();
  const goTo = useNavigate();

  const [survey, setSurvey] = useState({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const [changeInTitleOrDescription, setChangeInTitleOrDescription] =
    useState(false);

  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [changeInQues, setChangeInQues] = useState(null);

  const adjustTextArea = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  };

  const handleEditMode = (questionId) => {
    if (changeInQues) return;
    setEditingQuestionId(questionId);
  };

  const handleEditModeCancel = () => {
    setEditingQuestionId(null);
    setChangeInQues(false);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      _id: `n-${uuidv4()}`,
      idUser: survey.idUser,
      idSurvey: survey.idSurvey,
      typeQuestion: "open",
      question: "",
      answers: [],
    };

    setQuestions([...questions, newQuestion]);
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
            _id: `n-${uuidv4()}`,
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

  const updateTitleAndDescription = async () => {
    try {
      const surveyUpdated = await updateTitleOrDescription(
        id,
        title,
        description,
        accessToken
      );
      if (surveyUpdated) {
        setSurvey(surveyUpdated);
        setTitle(surveyUpdated.title),
          setDescription(surveyUpdated.description);
        setChangeInTitleOrDescription(false);
      } else {
        console.log("Errror al actualizar la encuesta");
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

  const handleSaveChanges = () => {
    if (changeInTitleOrDescription) {
      updateTitleAndDescription();
    }
  };

  const removeQuestion = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question._id !== questionId)
    );
  };

  const deleteQuestion = async (questionId) => {
    if (questionId.startsWith("n-")) {
      removeQuestion(questionId);
      return;
    }
    try {
      const deletedQuestion = await deleteQuestionById(
        questionId,
        id,
        accessToken
      );
      if (deletedQuestion) {
        removeQuestion(questionId);
      }
    } catch (error) {
      console.log("Error al borrar la pregunta");
    }
  };

  useEffect(() => {
    if (title !== survey.title || description !== survey.description) {
      setChangeInTitleOrDescription(true);
    } else {
      setChangeInTitleOrDescription(false);
    }
  }, [title, description]);

  useEffect(() => {
    adjustTextArea(titleRef);
    adjustTextArea(descriptionRef);
  }, [title, description]);

  useEffect(() => {
    getSurvey();
  }, []);

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
                  surveyId={id}
                  accessToken={accessToken}
                  id={question._id}
                  typeQuestion={question.typeQuestion}
                  questionSurvey={question.question}
                  answers={question.answers}
                  deleteQuestion={deleteQuestion}
                  onEdit={handleEditMode}
                  isEditing={editingQuestionId === question._id}
                  setChangeInQue={setChangeInQues}
                  cancelEditMode={handleEditModeCancel}
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
          <button
            className={`button_action ${
              changeInTitleOrDescription ? "save_button" : "no_changes"
            } `}
            onClick={handleSaveChanges}
          >
            <img
              className="img_button"
              src={changeInTitleOrDescription ? buttonSave : noChanges}
              alt="save_survey"
            />
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
