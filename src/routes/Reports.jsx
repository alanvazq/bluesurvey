import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useParams } from "react-router-dom";
import Header from "../layout/Header";
import "../assets/styles/reports.css";
import { Toaster, toast } from "react-hot-toast";
import { getSurveyData } from "../services/surveyService";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { downloadImage } from "../assets/img";
import {
  ResultOpenAnswer,
  ResultSingleOptionAnswer,
  ResultMultipleOption,
  SurveyActions,
} from "../components";

const Reports = () => {
  const { id } = useParams();

  const auth = useAuth();
  const accessToken = auth.getAccessToken();

  const [survey, setSurvey] = useState({});
  const reportRef = useRef(null);

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
    console.log(survey.questions);

    if (!survey.questions || survey.questions.length === 0 || totalAnswers === 0) {
      return <p>No hay resultados disponibles.</p>;
    }

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

  const generatePDF = async () => {
    toast.loading("Generando PDF");

    const pdf = new jsPDF("p", "mm", "a4");
    const graphs = reportRef.current.querySelectorAll(".container_result"); // Seleccionar todas las gráficas

    const pageWidth = 210;
    const pageHeight = 297;
    const marginTop = 15;
    const marginBottom = 10;
    const marginLeft = 15;
    const marginRight = 15;
    let y = marginTop;

    const titleLines = pdf.splitTextToSize(
      survey.title,
      pageWidth - marginLeft - marginRight
    );
    pdf.text(titleLines, marginLeft, y);
    y += 10 * titleLines.length;

    pdf.setFontSize(14);
    pdf.text(`Respuestas: ${totalAnswers}`, marginLeft, y);
    y += 10;

    for (let i = 0; i < graphs.length; i++) {
      const graph = graphs[i];

      const canvas = await html2canvas(graph, { scale: 2 });
      const imgData = canvas.toDataURL("image/webp");

      const imgWidth = 150;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (y + imgHeight > pageHeight - marginBottom) {
        pdf.addPage();
        y = marginTop;
      }

      pdf.addImage(imgData, "WEBP", marginLeft, y, imgWidth, imgHeight);

      y += imgHeight + marginTop;
    }

    pdf.save(`Reporte_${survey.title}.pdf`);
    toast.remove();
  };
  return (
    <>
      <Header />
      <div className="container">
        <div className="results">
          <div className="container_results" ref={reportRef}>
            <div className="header_results">
              <p className="title_survey">{survey.title}</p>
              <p>{totalAnswers} respuestas</p>
            </div>
            {renderAnswers()}
          </div>

          <div className="container_actions">
            <button
              className="button_action download_pdf"
              onClick={generatePDF}
            >
              <img
                className="img_button"
                src={downloadImage}
                alt="download_pdf"
              />
            </button>
          </div>
        </div>
      </div>

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

export default Reports;
