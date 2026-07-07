

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { checkSetupStatus } from "./service";
import SetupWizard from "../composants/initialisation/setupWizard/SetupWizard";
import Loader from "./loader/Loader";
import Home from "../composants/accueil/Home";
import SuperAdmin from "../composants/super-admin/SuperAdmin";
import AdminFac from "../composants/administrateurs/AdminFac";
import Enseignants from "../composants/enseignants/Enseignants";
import ChefMention from "../composants/chef-mention/ChefMention";
// import ProtectedRoute from "../ProtectedRoute";

function App() {
  const [loading, setLoading] = useState(true);
  const [setupStatus, setSetupStatus] = useState(null);

  const loadStatus = async () => {
    setLoading(true);
    const data = await checkSetupStatus();
    setSetupStatus(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStatus();
  }, []);

  // {setupStatus && console.log(setupStatus.super_admin);}
  
  if (loading) return <Loader />;

  const setupFinished = setupStatus?.admin_fac === true;

  return (
    <BrowserRouter>
      <Routes>
        {/* Racine */}
        <Route
          path="/"
          element={
            setupFinished ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/setup" />
            )
          }
        />

        {/* Setup */}
        <Route
          path="/setup"
          element={
            setupFinished ? (
              <Navigate to="/home" />
            ) : (
              <SetupWizard
                setupStatus={setupStatus}
                onCompleted={loadStatus} // 🔑 HARMONIE
              />
            )
          }
        />

        {/* Home */}
        <Route
          path="/home"
          element={
            setupFinished ? <Home /> : <Navigate to="/setup" />
          }
        />

        {/* Super Admin */}
        <Route path="/super-admin" element={<SuperAdmin />} />

        {/* Admin Fac */}
        <Route path="/admin-fac" element={<AdminFac />} /> 

        {/* Chef mention*/}
        <Route path="/admin-mention" element={<ChefMention />} /> 

        {/* Enseignant*/}
        <Route path="/enseignant" element={<Enseignants />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;