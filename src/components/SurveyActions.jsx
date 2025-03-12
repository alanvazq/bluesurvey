import {
  buttonDelete,
  buttonAdd,
  buttoLink,
  buttonChart,
  buttonSave,
  noChanges,
} from "../assets/img";
import CopyToClipboard from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";


export const SurveyActions = ({
  onAddQuestion,
  changeInHeaderSurvey,
  updateTitleAndDescription,
  surveyId,
  openDeleteModal,
}) => {
  const goTo = useNavigate();

  return (
    <div className="container_actions">
      <button className="button_action add_button" onClick={onAddQuestion}>
        <img className="img_button" src={buttonAdd} alt="add_question" />
      </button>
      <div className="button-save-container">
        <button
          className={`button_action ${
            changeInHeaderSurvey ? "save_button" : "no_changes"
          } `}
          onClick={changeInHeaderSurvey ? updateTitleAndDescription : null}
        >
          <img
            className="img_button"
            src={changeInHeaderSurvey ? buttonSave : noChanges}
            alt="save_survey"
          />
        </button>
        {changeInHeaderSurvey && (
          <span
            className={`changes-warning ${
              changeInHeaderSurvey ? "visible" : "hidden"
            }`}
          >
            Tienes cambios por guardar
          </span>
        )}
      </div>
      <button
        className="button_action delete_button"
        onClick={() => openDeleteModal(surveyId)}
      >
        <img src={buttonDelete} alt="delete" />
      </button>
      <CopyToClipboard
        text={`${import.meta.env.VITE_URL_SURVEY}/public/survey/${surveyId}`}
      >
        <button
          className="button_action link_button"
          onClick={() => toast.success("Link copiado")}
        >
          <img src={buttoLink} alt="link" />
        </button>
      </CopyToClipboard>
      <button
        className="button_action chart_button"
        onClick={() => goTo(`/results/${surveyId}`)}
      >
        <img src={buttonChart} alt="chart" />
      </button>
    </div>
  );
};
