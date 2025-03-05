import { useEffect, useRef, useState } from "react";
import "../assets/styles/question.css";
import textImage from "../assets/img/text.svg";
import radioImage from "../assets/img/radio.svg";
import boxImage from "../assets/img/box.svg";
import { Answer } from "./Answer";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import {
  updateQuestionById,
  createNewQuestion,
} from "../services/surveyService";

export const Question = ({
  surveyId,
  id,
  accessToken,
  typeQuestion,
  questionSurvey,
  answers,
  deleteQuestion,
  onEdit,
  isEditing,
  setChangeInQue,
  cancelEditMode,
  handleRefreshSurvey,
}) => {
  const [titleQuestion, setTitleQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [answersQuestion, setAnswersQuestion] = useState([]);

  const [initialTitle, setInitialTitle] = useState("");
  const [initialOption, setInitialOption] = useState("");
  const [initialAnswers, setIntialAnswers] = useState([]);

  const [changeInQuestion, setChangeInQuestion] = useState(false);

  const questionRef = useRef(null);

  const options = [
    { type: "open", label: "Respuesta abierta", icon: textImage },
    { type: "singleOption", label: "Opción única", icon: radioImage },
    { type: "multipleOption", label: "Opción múltiple", icon: boxImage },
  ];

  const createOrUpdateQuestion = () => {
    const isNewQuestion = id.startsWith("n-");
    if (isNewQuestion) {
      createQuestion();
    } else {
      updateQuestion();
    }
  };

  const updateQuestion = async () => {
    let allAnswers = answersQuestion;
    const newAnswer = answersQuestion.filter((ans) => ans._id.startsWith("n-"));
    if (newAnswer.length > 0) {
      const notNewQuestions = answers.filter(
        (ans) => !ans._id.startsWith("n-")
      );
      const newAnswers = newAnswer.map(({ _id, ...rest }) => rest);
      allAnswers = [...notNewQuestions, ...newAnswers];
    }

    let sanitizedAnswers = allAnswers.map(({ count, ...rest }) => rest);
    sanitizedAnswers = sanitizedAnswers.filter((ans) => ans.answer !== "");
    try {
      const updatedQuestion = await updateQuestionById(
        surveyId,
        id,
        sanitizedAnswers,
        titleQuestion,
        selectedOption,
        accessToken
      );

      if (updatedQuestion) {
        setInitialTitle(_.cloneDeep(updatedQuestion.question));
        setInitialOption(_.cloneDeep(updatedQuestion.typeQuestion));
        setIntialAnswers(_.cloneDeep(updatedQuestion.answers));
        setSelectedOption(updatedQuestion.typeQuestion);
        setTitleQuestion(updatedQuestion.question);
        setAnswersQuestion(updatedQuestion.answers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createQuestion = async () => {
    let newAnswers = answersQuestion.filter((ans) => ans.answer !== "");
    newAnswers = newAnswers.map(({ _id, ...rest }) => rest);
    try {
      const newQuestion = await createNewQuestion(
        surveyId,
        titleQuestion,
        newAnswers,
        selectedOption,
        accessToken
      );
      if (newQuestion) {
        setInitialTitle(_.cloneDeep(newQuestion.question));
        setInitialOption(_.cloneDeep(newQuestion.typeQuestion));
        setIntialAnswers(_.cloneDeep(newQuestion.answers));
        setSelectedOption(newQuestion.typeQuestion);
        setTitleQuestion(newQuestion.question);
        setAnswersQuestion(newQuestion.answers);
        handleRefreshSurvey(newQuestion, id);
        setChangeInQuestion(false);
        cancelEditMode();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeEditMode = (e) => {
    e.stopPropagation();
    if (isEditing) return;
    onEdit(id);
  };

  const handleCancelEditMode = (e) => {
    e.stopPropagation();
    setTitleQuestion(initialTitle);
    setSelectedOption(initialOption);
    setAnswersQuestion(_.cloneDeep(initialAnswers));
    cancelEditMode();
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
    const newQues = answersQuestion.find((ques) => ques.answer === "");
    if (newQues) return;
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
    if (id.startsWith("n-")) {
      const lastAnswer = answersQuestion.at(-1);
      if (lastAnswer !== undefined) {
        if (lastAnswer.answer === "") {
          return false;
        }
      }
    }
    return titleQuestion !== initialTitle;
  };

  const changesInOption = () => {
    if (id.startsWith("n-")) return false;

    if (
      selectedOption === "singleOption" ||
      selectedOption === "multipleOption"
    ) {
      if (answersQuestion.length === 0) return false;

      if (answersQuestion.length === 1) {
        const empyAnswer = answersQuestion.some((ans) => ans.answer === "");
        if (empyAnswer) return false;
      }
    }

    return selectedOption !== initialOption;
  };

  const changeInAnswrs = () => {
    if (id.startsWith("n-")) {
      const anyAnswer = answersQuestion.some((answ) => answ.answer !== "");
      if (anyAnswer) {
        return true;
      }
    }
    const lastAnswer = answersQuestion.at(-1);
    if (lastAnswer !== undefined) {
      if (lastAnswer.answer === "") {
        return false;
      }
    } else {
      return false;
    }
    return !_.isEqual(answersQuestion, initialAnswers);
  };

  useEffect(() => {
    if (changesInTitleQuestion()) {
      setChangeInQuestion(true);
      setChangeInQue(true);
    } else if (changesInOption()) {
      setChangeInQuestion(true);
      setChangeInQue(true);
    } else if (changeInAnswrs()) {
      setChangeInQuestion(true);
      setChangeInQue(true);
    } else {
      setChangeInQuestion(false);
      setChangeInQue(false);
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
    if (selectedOption === "open") {
      setAnswersQuestion([]);
    } else if (
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
          <button
            onClick={changeInQuestion ? createOrUpdateQuestion : null}
            className={`button_save_question ${
              changeInQuestion ? "save_changes_question" : "no_changes_question"
            }`}
          >
            Guardar
          </button>
          <button className="cancel_question" onClick={handleCancelEditMode}>
            Cancelar
          </button>
          <button className="button_delete" onClick={() => deleteQuestion(id)}>
            Eliminar pregunta
          </button>
        </div>
      )}
    </div>
  );
};
