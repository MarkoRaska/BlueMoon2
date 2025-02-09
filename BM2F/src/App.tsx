import React from "react";
import ReactDOM from "react-dom";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import ReaderHome from "./pages/ReaderHome.tsx";
import NotFound from "./pages/NotFound.tsx";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { SubmissionProvider } from "./context/SubmissionContext";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

const App = React.memo(() => {
  return (
    <SubmissionProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <ReaderHome />
                </>
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SubmissionProvider>
  );
});

export default App;
