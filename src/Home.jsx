import "./assets/styles/home.css";
import { useAuth } from "./auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const Home = () => {
  const auth = useAuth();
  const goTo = useNavigate();

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <div className="container-home">
        <header className="header">
          <p className="logo-home">Bluesurvey</p>
        </header>
        <main className="content">
          <h1 className="title">Bluesurvey</h1>
          <p className="subtitle">Plataforma para la creación de encuestas</p>
          <div className="buttons">
            <button className="button" onClick={() => goTo("/login")}>
              Iniciar sesión
            </button>
            <button className="button button-signup" onClick={() => goTo("/signup")}>Crear cuenta</button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
