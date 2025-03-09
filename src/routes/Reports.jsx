import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useParams } from "react-router-dom";
import Header from "../layout/Header";
import "../assets/styles/reports.css";
import { Toaster, toast } from "react-hot-toast";
import { getSurveyData } from "../services/surveyService";
import { ResultOpenAnswer } from "../components/ResultOpenAnswer";
import { ResultSingleOptionAnswer } from "../components/ResultSingleOptionAnswer";
import { ResultMultipleOption } from "../components/ResultMultipleOption";

const Reports = () => {
  const { id } = useParams();

  const auth = useAuth();
  const accessToken = auth.getAccessToken();

  const [survey, setSurvey] = useState({});

  useEffect(() => {
    getSurvey();
  }, []);

  const getSurvey = async () => {
    try {
      const surveyData = await getSurveyData(id, accessToken);
      if (surveyData) {
        setSurvey(surveyData);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalAnswers = () => {
    if (!survey.questions || survey.questions.length === 0) return 0;

    return survey.questions.reduce((total, question) => {
      const questionTotal = question.answers
        ? question.answers.reduce((acc, answer) => acc + answer.count, 0)
        : 0;
      return total + questionTotal;
    }, 0);
  };

  const totalAnswers = getTotalAnswers();

  const renderAnswers = () => {
    if (!survey.questions || survey.questions.length === 0)
      return <p>No hay resultados disponibles.</p>;

    return survey.questions.map((question) => {
      if (question.typeQuestion === "open") {
        return <ResultOpenAnswer question={question} key={question._id} />;
      }

      if (question.typeQuestion === "singleOption") {
        return (
          <ResultSingleOptionAnswer question={question} key={question._id} />
        );
      }

      if (question.typeQuestion === "multipleOption") {
        return <ResultMultipleOption question={question} key={question._id} />;
      }

      return null;
    });
  };

  return (
    <>
      <Header />
      <div className=" container">
        <div className="container_results">
          <div className="header_results">
            <p className="title_survey">{survey.title}</p>
            <p>{totalAnswers} respuestas</p>
          </div>
          {renderAnswers()}
        </div>
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

export default Reports;
