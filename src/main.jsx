import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/main.css";
import Home from "./Home";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";
import Dashboard from "./routes/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import FormSurvey from "./routes/FormSurvey";
import { AuthProvider } from "./auth/AuthProvider";
import Reports from "./routes/Reports";
import { Survey } from "./routes/Survey";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/results/:id",
        element: <Reports />,
      },
      {
        path: "/survey/:id",
        element: <Survey />,
      },
    ],
  },
  {
    path: "/public-survey/:id",
    element: <FormSurvey />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
