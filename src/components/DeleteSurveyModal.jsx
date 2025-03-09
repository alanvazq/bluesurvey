import "../assets/styles/modal_delete_survey.css";
import { Toaster, toast } from "react-hot-toast";

export const DeleteSurveyModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal_overlay">
        <div className="modal_content">
          <p>¿Estás seguro de eliminar la encuesta?</p>
          <div className="modal_actions">
            <button
              className="buttons_modal button_modal_cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="buttons_modal button_modal_delete"
              onClick={onConfirm}
            >
              Eliminar
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
