import { useEffect, useRef, useState } from "react";
import "../assets/styles/edit_survey.css";
import {
  getSurveyData,
  deleteSurveyById,
  updateTitleOrDescription,
  deleteQuestionById,
} from "../services/surveyService";

import { Question } from "../components/Question";
import { v4 as uuidv4 } from "uuid";
import Header from "../layout/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Toaster, toast } from "react-hot-toast";

import { DeleteSurveyModal } from "../components/DeleteSurveyModal";
import { SurveyHeader } from "../components/SurveyHeader";
import { SurveyQuestions } from "../components/SurveyQuestions";
import { SurveyActions } from "../components/SurveyActions";
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
        setChageInHeaderSurvey(false);
      } else {
        console.log("Errror al actualizar la encuesta");
      }
    } catch (error) {
      console.log(error);
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

  const handleDeleteSurvey = async () => {
    try {
      const surveyDeleted = await deleteSurveyById(id, accessToken);
      if (surveyDeleted) {
        toast.success("Encuesta eliminada");
        goTo("/dashboard");
      } else {
        toast.error("Error al eliminar la encuesta");
        goTo("/dashboard");
      }
    } catch (error) {
      console.log(error);
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
        onConfirm={handleDeleteSurvey}
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
