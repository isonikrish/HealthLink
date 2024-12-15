import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Authentication from "./pages/Authentication";
import { PatientPage } from "./pages/PatientPage";
import { DoctorPage } from "./pages/DoctorPage";
import { useAuth } from "./store/useAuth";
import { useEffect, useState } from "react";
import { Loader } from "./components/Loader";

function App() {
  const navigate = useNavigate();
  const { fetchMe, user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      await fetchMe();
      setLoading(false);
    };
    fetchUserData();
  }, [fetchMe]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (loading) {
    return <Loader />;
  }

  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  return (
    <div>
      <Routes>
        <Route path="/" element={<Authentication />} />

        {/* Role-based route redirection */}
        <Route
          path="/patient/:id"
          element={isPatient ? <PatientPage /> : <Navigate to="/doctor" />}
        />
        <Route
          path="/doctor/:id"
          element={isDoctor ? <DoctorPage /> : <Navigate to="/" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
