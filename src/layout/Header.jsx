import { Link, json } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import "../assets/styles/header.css";
import userIcon from "../assets/img/user.svg";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { signout } from "../services/authService";
import toast from "react-hot-toast";

const Header = ({ children }) => {
  const auth = useAuth();
  const refreshToken = auth.getRefreshToken();
  const user = useAuth().getUser();
  const goTo = useNavigate();

  const handleSignout = async (e) => {
    e.preventDefault();

    try {
      toast.loading("Cerrando sesión...");
      const response = await signout(refreshToken);
      const data = await response.json();
      if (response.ok) {
        toast.remove();
        auth.signOut();
      } else {
        toast.remove();
        toast.error(data.error);
      }
    } catch (error) {
      toast.remove();
      toast.error(error.message);
    }
  };
  return (
    <>
      <header className="header container">
        <p className="logo-home-dashboard" onClick={() => goTo("/dashboard")}>
          Bluesurvey
        </p>

        <nav className="nav">
          <ul className="ul">
            <li className="li">
              <Link className="link link-home" to="/dashboard">
                Inicio
              </Link>
            </li>
            <li className="li">
              <a className="link link-signout" href="#" onClick={handleSignout}>
                Salir
              </a>
            </li>
          </ul>
        </nav>

        <div className="user-info-container">
          <div className="icon-user">
            <img src={userIcon} alt="user" />
          </div>
          <p className="user-name">{user.name}</p>
        </div>
      </header>
    </>
  );
};

export default Header;
