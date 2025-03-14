import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import Wave from "../layout/Wave";
import { Toaster, toast } from "react-hot-toast";
import { register } from "../services/authService";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = useAuth();
  const goTo = useNavigate();

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.loading("Registrando usuario...");
      const response = await register(name, email, password);
      if (response.ok) {
        toast.remove();
        toast.success("Usuario registrado");
        goTo("/login");
      } else {
        toast.remove();
        const data = await response.json();
        toast.error(data.error || "Error al registar el usuario");
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
            <h2 className="title-form">Crea tu cuenta</h2>
            <div className="content-inputs-form">
              <label className="label">Nombre</label>
              <input
                className="input-form"
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="content-inputs-form">
              <label className="label">Correo</label>
              <input
                className="input-form"
                type="email"
                placeholder="correo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="content-inputs-form">
              <label className="label">Contraseña</label>
              <input
                className="input-form"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="buttons-form">
              <button className="button button-form" onClick={handleSubmit}>
                Registrarme
              </button>
              <button
                className="button button-form button-signup"
                onClick={() => goTo("/login")}
              >
                Ya tengo cuenta
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

export default SignUp;
