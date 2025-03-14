import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { login } from "../services/authService";
import "../assets/styles/form.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useAuth();
  const goTo = useNavigate();

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      toast.loading("Iniciando sesión...");
      const response = await login(email, password);
      const user = await response.json();
      if (user.accessToken && user.refreshToken) {
        auth.saveUser(user);
        goTo("/dashboard");
      } else {
        toast.remove();
        toast.error(user.error);
      }
    } catch (error) {
      toast.remove();
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="container-home">
        <header className="header">
          <p onClick={() => goTo("/")} className="logo-home">
            Bluesurvey
          </p>
        </header>
        <main className="content">
          <form className="form" onSubmit={handleSubmit}>
            <h2 className="title-form">Bienvenido(a)</h2>
            <p className="form-instruction">Ingresa tus datos</p>
            <div className="content-inputs-form">
              <label className="label">Correo</label>
              <input
                className="input-form"
                type="email"
                placeholder="correo@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="content-inputs-form">
              <label className="label">Contraseña</label>
              <input
                className="input-form"
                type="password"
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="buttons-form">
              <button className="button button-form">Iniciar sesión</button>
              <button
                className="button button-form button-signup"
                onClick={() => goTo("/signup")}
              >
                No tengo cuenta
              </button>
            </div>
          </form>
        </main>
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

export default Login;
