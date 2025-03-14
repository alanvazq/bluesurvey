import { useEffect, useRef, useState } from "react";
import "../assets/styles/edit_survey.css";
import {
  getSurveyData,
  deleteSurveyById,
  updateTitleOrDescription,
  deleteQuestionById,
} from "../services/surveyService";

import { v4 as uuidv4 } from "uuid";
import Header from "../layout/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Toaster, toast } from "react-hot-toast";

import {
  DeleteSurveyModal,
  SurveyHeader,
  SurveyQuestions,
  SurveyActions,
} from "../components";

export const Survey = () => {
  const { id } = useParams();

  const auth = useAuth();
  const accessToken = auth.getAccessToken();

  const goTo = useNavigate();

  const [survey, setSurvey] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const [changeInHeaderSurvey, setChageInHeaderSurvey] = useState(false);

  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [changeInQues, setChangeInQues] = useState(null);

  const [newQuestionAdded, setNewQuestionAdded] = useState(false);

  const lastQuestionCreatedRef = useRef(null);

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);

  const handleEditMode = (questionId) => {
    if (changeInQues) return;
    setEditingQuestionId(questionId);
  };

  const handleEditModeCancel = () => {
    setEditingQuestionId(null);
    setChangeInQues(false);
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
    setNewQuestionAdded(true);
  };

  const handleRefreshSurvey = (newQuestionData, prevQuestionId) => {
    setQuestions((prevQuestions) => [
      ...prevQuestions.filter((que) => que._id !== prevQuestionId),
      newQuestionData,
    ]);
  };

  const getSurvey = async () => {
    try {
      toast.loading("Cargando encuesta...");
      const response = await getSurveyData(id, accessToken);
      const survey = await response.json();
      if (response.ok) {
        toast.remove();
        setSurvey(survey);
        setTitle(survey.title);
        setDescription(survey.description);
      }
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
      toast.remove();
      toast.error(error.message);
    }
  };

  const updateTitleAndDescription = async () => {
    try {
      const response = await updateTitleOrDescription(
        id,
        title,
        description,
        accessToken
      );
      const surveyUpdated = await response.json();
      if (response.ok) {
        setSurvey(surveyUpdated);
        setTitle(surveyUpdated.title),
          setDescription(surveyUpdated.description);
        setChageInHeaderSurvey(false);
      } else {
        toast.error(surveyUpdated.error || "Error al actualizar");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openDeleteModal = (surveyId) => {
    setSurveyToDelete(surveyId);
    setModalDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setSurveyToDelete(null);
    setModalDeleteOpen(false);
  };

  const deleteSurvey = async () => {
    try {
      const response = await deleteSurveyById(id, accessToken);
      const surveyDeleted = await response.json();
      if (response.ok) {
        toast.success("Encuesta eliminada");
        goTo("/dashboard");
      } else {
        toast.error(surveyDeleted.error);
      }
    } catch (error) {
      toast.error(error.message);
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
      const response = await deleteQuestionById(questionId, id, accessToken);
      const deletedQuestion = await response.json();
      if (response.ok) {
        removeQuestion(questionId);
      } else {
        toast.error(deletedQuestion.error || "Error al eliminar la pregunta");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (title !== survey.title || description !== survey.description) {
      setChageInHeaderSurvey(true);
    } else {
      setChageInHeaderSurvey(false);
    }
  }, [title, description]);

  useEffect(() => {
    getSurvey();
  }, []);

  useEffect(() => {
    if (lastQuestionCreatedRef.current) {
      lastQuestionCreatedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setNewQuestionAdded(false);
    }
  }, [newQuestionAdded]);

  return (
    <>
      <Header />
      <div className="container container_edit_survey">
        <div className="container_edit">
          <SurveyHeader
            title={title}
            description={description}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
          />
          <SurveyQuestions
            accessToken={accessToken}
            surveyId={id}
            editingQuestionId={editingQuestionId}
            lastQuestionCreatedRef={lastQuestionCreatedRef}
            onDeleteQuestion={deleteQuestion}
            onEdit={handleEditMode}
            onEditModeCancel={handleEditModeCancel}
            onRefreshSurvey={handleRefreshSurvey}
            setChangeInQues={setChangeInQues}
            questions={questions}
          />
        </div>

        <SurveyActions
          changeInHeaderSurvey={changeInHeaderSurvey}
          onAddQuestion={handleAddQuestion}
          updateTitleAndDescription={updateTitleAndDescription}
          surveyId={id}
          openDeleteModal={openDeleteModal}
        />
      </div>

      <DeleteSurveyModal
        isOpen={modalDeleteOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteSurvey}
      />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "1.6rem",
            backgroundColor: "#fff",
          },
        }}
      />
    </>
  );
};
