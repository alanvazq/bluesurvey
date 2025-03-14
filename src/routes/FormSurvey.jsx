import { useState, useEffect } from "react";
import "../assets/styles/formSurvey.css";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { toast, Toaster } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { getPublicSurvey, saveAnswersForm } from "../services/surveyService";

const FormSurvey = () => {
  const auth = useAuth();
  const { id } = useParams();
  const goTo = useNavigate();

  useEffect(() => {
    getSurvey();
  }, []);

  const [showSurvey, setShowSurvey] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [openQuestions, setOpenQuestions] = useState({});
  const [singleOptionsQuestions, setSingleOptionQuestions] = useState({});
  const [multipleOptionQuestions, setMultipleOptionQuestions] = useState({});

  const getSurvey = async () => {
    try {
      const response = await getPublicSurvey(id);
      const survey = await response.json()
      if (response.ok) {
        setShowSurvey(survey);
      } else {
        toast.error(survey.error || "Error al cargar el formulario");
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  const handleInputTextChange = (event, questionId) => {
    const { value } = event.target;
    setOpenQuestions((prevInputsValues) => ({
      ...prevInputsValues,
      [questionId]: value,
    }));
  };

  const handleRadioInputChange = (event, questionId) => {
    const { value } = event.target;

    setSingleOptionQuestions((prevInputsValues) => ({
      ...prevInputsValues,
      [questionId]: value,
    }));
  };

  const handleCheckboxInputChange = (event, questionId) => {
    const { value, checked } = event.target;
    setMultipleOptionQuestions((prevInputsValue) => {
      const previousValues = prevInputsValue[questionId] || [];
      let updatedValues;

      if (checked) {
        updatedValues = [...previousValues, value];
      } else {
        updatedValues = previousValues.filter((v) => v !== value);
      }
      return {
        ...prevInputsValue,
        [questionId]: updatedValues,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formSubmitted) return;

    const open = Object.keys(openQuestions).map((questionId) => {
      return {
        questionId,
        answer: openQuestions[questionId],
      };
    });

    const singleOption = Object.keys(singleOptionsQuestions).map(
      (questionId) => {
        return {
          questionId,
          answer: singleOptionsQuestions[questionId],
        };
      }
    );

    const multipleOption = Object.keys(multipleOptionQuestions).map(
      (questionId) => {
        return {
          questionId,
          answers: multipleOptionQuestions[questionId],
        };
      }
    );

    const answers = {
      open,
      singleOption,
      multipleOption,
    };

    try {
      const response = await saveAnswersForm(answers, id);
      const savedAnswers = await response.json();
      if (response.ok) {
        toast.success("Encuesta enviada, ¡Gracias por responder!", {
          duration: 3000,
          icon: "👍",
        });
      } else {
        toast.error(savedAnswers.error || "Error al enviar las respuestas")
      }
      setTimeout(() => {
        goTo("/");
      }, 3000);

      setFormSubmitted(true);
    } catch (error) {
      toast.error(error.message)
    }
  };

  return (
    <>
      <div className="container_form_public container">
        <header className="header_form_survey">
          <p onClick={() => goTo("/")} className="logo-home">
            Bluesurvey
          </p>
        </header>
        <form onSubmit={handleSubmit} className="container_form_public_content">
          <div className="header_form_public">
            <p className="title_form">{showSurvey.title} </p>
            <p>{showSurvey.description}</p>
          </div>
          <div className="form_public_content">
            {showSurvey.questions &&
              showSurvey.questions.map((question, index) => (
                <div key={question._id}>
                  <div className="container_question_public">
                    <label className="label_form_public">
                      {question.question}
                    </label>

                    {question.typeQuestion === "open" && (
                      <div className="">
                        <input
                          className="input_public"
                          type="text"
                          placeholder="Escribe aquí..."
                          name={`question_${question._id}`}
                          value={openQuestions[question._id] || ""}
                          onChange={(event) =>
                            handleInputTextChange(event, question._id)
                          }
                        />
                      </div>
                    )}

                    {question.typeQuestion === "singleOption" && (
                      <div>
                        {question.answers.map((answer, answerIndex) => (
                          <div key={answer._id} className="radio_container">
                            <input
                              type="radio"
                              id={`question_${question._id}_answer_${answer._id}`}
                              name={`question_${question._id}`}
                              value={answer.answer}
                              onChange={(event) =>
                                handleRadioInputChange(event, question._id)
                              }
                            />
                            <label
                              htmlFor={`question_${question._id}_answer_${answer._id}`}
                              className="label_radio"
                            >
                              {answer.answer}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.typeQuestion === "multipleOption" && (
                      <div>
                        {question.answers.map((answer, answerIndex) => (
                          <div key={answer._id}>
                            <input
                              type="checkbox"
                              id={`question_${question._id}_answer_${answer._id}`}
                              name={`question_${question._id}`}
                              value={answer.answer}
                              onChange={(event) =>
                                handleCheckboxInputChange(event, question._id)
                              }
                            />
                            <label
                              htmlFor={`question_${question._id}_answer_${answer._id}`}
                              className="label_checkbox"
                            >
                              {answer.answer}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

            <button
              className={`${formSubmitted ? "no_send" : "send_form"}`}
              disabled={formSubmitted}
              onClick={formSubmitted ? null : handleSubmit}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
      <Toaster
        position="top-center"
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

export default FormSurvey;
