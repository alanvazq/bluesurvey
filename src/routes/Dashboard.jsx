import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from "react";
import "../assets/styles/dashboard.css";
import Header from "../layout/Header";
import SurveyModal from "../components/SurveyModal";
import createIcon from "../assets/img/createW.svg";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getSurveys } from "../services/surveyService";

const Dashboard = () => {
  const [stateModal, setStateModal] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const goTo = useNavigate();

  const auth = useAuth();
  const accessToken = auth.getAccessToken();

  useEffect(() => {
    toast.loading("Cargando encuestas...");
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const surveysData = await getSurveys(accessToken);
      if (surveysData) {
        toast.remove();
        setSurveys(surveysData);
      } else {
        toast.error("Error en la conexion");
      }
    } catch (error) {
      toast.error("Algo salió mal");
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="container_button">
          <button
            className="create_button"
            onClick={() => setStateModal(!stateModal)}
          >
            <img src={createIcon} className="icon_create" />
            Nueva encuesta
          </button>
        </div>

        <h1 className="surveys_created">
          {surveys.length === 0
            ? "No hay encuestas creadas"
            : "Encuestas creadas"}
        </h1>

        <div className="container_surveys">
          {surveys.map((survey) => (
            <div
              className="container_survey"
              key={survey._id}
              onClick={() => {
                goTo(`/survey/${survey._id}`);
              }}
            >
              <div className="icons"></div>
              {survey.title.length > 60
                ? survey.title.slice(0, 60) + "..."
                : survey.title}
            </div>
          ))}
        </div>
        <SurveyModal
          state={stateModal}
          changeState={setStateModal}
          updateSurvey={setSurveys}
        />
      </div>
    </>
  );
};

export default Dashboard;
