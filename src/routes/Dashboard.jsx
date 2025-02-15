import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from "react";
import "../assets/styles/dashboard.css";
import Header from "../layout/Header";
import SurveyModal from "../components/SurveyModal";
import createIcon from "../assets/img/createW.svg";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [stateModal, setStateModal] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const auth = useAuth();

  useEffect(() => {
    toast.loading("Cargando encuestas...");
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/surveys`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });

      if (response.ok) {
        toast.remove();
        const json = await response.json();
        setSurveys(json);
      } else {
        toast.error("Error en la conexion");
      }
    } catch (error) {
      console.log(error);
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
          </button>
          Nueva encuesta
        </div>

        <h1
          className="surveys_created
"
        >
          Encuestas creadas
        </h1>

        <div className="container_surveys">
          {surveys.map((survey) => (
            <div
              onClick={() => setSelectedSurvey(survey._id)}
              className="container_survey"
              key={survey._id}
            >
              <div className="icons"></div>
              <p className="title_survey_dashboard">{survey.title}</p>
              <p className="date_survey">02/02/2025</p>
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
