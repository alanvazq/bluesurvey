import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Toaster, toast } from "react-hot-toast";
import "../assets/styles/modal_survey.css";
import { useNavigate } from "react-router-dom";

const Survey = ({ state, changeState, survey, updateSurvey }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const auth = useAuth();
  const goTo = useNavigate();

  useEffect(() => {
    setTitle("");
    setDescription("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/surveys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (response.ok) {
        const newSurvey = await response.json();
        updateSurvey((surveys) => [newSurvey, ...surveys]);
        toast.success("Encuesta creada");
        setTitle("");
        setDescription("");
        changeState(false);
      } else {
        const errorData = await response.json();
        const messageError = errorData.message;
        toast.error(messageError);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setTitle("");
    setDescription("");
    changeState(false);
  };

  return (
    <>
      {state && (
        <div className="overlay">
          <div className="container_modal container">
            <form className="form_modal" onSubmit={handleSubmit}>
              <div className="header_modal">
                <h2 className="h2_modal">Crear encuesta</h2>

                <div className="container_details_survey">
                  <label htmlFor="title" className="label_title">
                    Título
                  </label>
                  <input
                    id="title"
                    className="input_details_survey"
                    placeholder="Escribe un titulo..."
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="container_details_survey">
                  <label htmlFor="description" className="label_title">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    className="input_details_survey textarea"
                    placeholder="Agrega una descripción..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="footer_modal">
                <div className="buttons_modal_container">
                  <button
                    className="buttons_modal button_create_modal"
                    type="submit"
                  >
                    Crear encuesta
                  </button>
                  <button
                    className="buttons_modal button_cancel_modal"
                    onClick={toggleModal}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default Survey;
