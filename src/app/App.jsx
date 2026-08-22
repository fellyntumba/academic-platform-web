// import React, { useEffect, useState } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { checkSetupStatus } from "./service";
// import SetupWizard from "../composants/initialisation/setupWizard/SetupWizard";
// import Loader from "./loader/Loader";
// import Home from "../composants/accueils/Home"; 
// import SuperAdmin from "../composants/sga-dg/SuperAdmin"; 
// import AdminFac from "../composants/administrateurs-fac/AdminFac";
// import Enseignants from "../composants/enseignants/Enseignants";
// import ChefMention from "../composants/chef-mention/ChefMention";
// import { isAuthenticated } from "../composants/accueils/serviceAuth";
// // import ProtectedRoute from "../ProtectedRoute";

// function App() {
//   const [loading, setLoading] = useState(true);
//   const [setupStatus, setSetupStatus] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loadingAuth, setLoadingAuth] = useState(true);

//   //
//   const loadStatus = async () => {
//     setLoading(true);
//     const data = await checkSetupStatus();
//     setSetupStatus(data);
//     setLoading(false);
//   };


//   //
//   const loadAuth = async () => {

//     try {

//         const auth = await isAuthenticated();

//         setUser(
//             auth?.authenticated
//                 ? auth.user
//                 : null
//         );

//     } finally {

//         setLoadingAuth(false);

//     }

// };

//   //
//  useEffect(() => {

//     const init = async () => {
//       await Promise.all([
//         loadStatus(),
//         loadAuth()
//       ]);
//     };

//     init();

//   }, []);

//   if (loading || loadingAuth) {
//     return <Loader />;
//   }

//   const setupFinished = setupStatus?.facultes === true;




//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Racine */}
//         <Route
//           path="/" 
//           element={
//               !setupFinished ? (
//                 <Navigate to="/setup" replace />
//               ) : !user ? (
//                 <Navigate to="/home" replace />
//               ) : user.active_role === "SGA" ? (
//                 <Navigate to="/super-admin" replace />
//               ) : user.active_role === "ADMIN_FAC" ? (
//                 <Navigate to="/admin-fac" replace />
//               ) : user.active_role === "ADMIN_MENTION" ? (
//                 <Navigate to="/admin-mention" replace />
//               ) : user.active_role === "ENSEIGNANT" ? (
//                 <Navigate to="/enseignant" replace />
//               ) : (
//                 <Navigate to="/home" replace />
//               )
//           }
//           />

//         {/* Setup */}
//         <Route
//           path="/setup"
//           element={
//             setupFinished ? (
//               <Navigate to="/home" replace/>
//             ) : (
//               <SetupWizard
//                 setupStatus={setupStatus}
//                 onCompleted={loadStatus} // 🔑 HARMONIE
//               />
//             )
//           }
//         />

//         {/* Home */}
//         <Route
//           path="/home"
//           element={
//             !setupFinished ? (
//               <Navigate to="/setup" replace />
//             ) : user ? (
//               <Navigate to="/" replace />
//             ) : (
//               <Home />
//             )
//           }
//         />

//         {/* Super Admin */}
//         <Route path="/super-admin" element={<SuperAdmin />} />

//         {/* Admin Fac */}
//         <Route path="/admin-fac" element={<AdminFac />} /> 

//         {/* Chef mention*/}
//         <Route path="/admin-mention" element={<ChefMention />} /> 

//         {/* Enseignant*/}
//         <Route path="/enseignant" element={<Enseignants />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { checkSetupStatus } from "./service";

import SetupWizard from "../composants/initialisation/setupWizard/SetupWizard";
import Loader from "./loader/Loader";

import Home from "../composants/accueils/Home";
import SuperAdmin from "../composants/sga-dg/SuperAdmin";
import AdminFac from "../composants/administrateurs-fac/AdminFac";
import Enseignants from "../composants/enseignants/Enseignants";
import ChefMention from "../composants/chef-mention/ChefMention";
import Comptable from "../composants/comptables/Comptable";

import { isAuthenticated } from "../composants/accueils/serviceAuth";

// import ProtectedRoute from "../ProtectedRoute";


function App() {

  const [loading, setLoading] = useState(true);
  const [setupStatus, setSetupStatus] = useState(null);

  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);


  /* ============================================================
     VÉRIFICATION CONFIGURATION UNIVERSITÉ
  ============================================================ */

  const loadStatus = async () => {

    setLoading(true);

    try {

      const data = await checkSetupStatus();

      setSetupStatus(data);

    } catch (error) {

      console.error(
        "Erreur lors de la vérification de la configuration :",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  /* ============================================================
     VÉRIFICATION AUTHENTIFICATION
  ============================================================ */

  const loadAuth = async () => {

    try {

      const auth = await isAuthenticated();

      setUser(
        auth?.authenticated
          ? auth.user
          : null
      );

    } catch (error) {

      console.error(
        "Erreur lors de la vérification de l'authentification :",
        error
      );

      setUser(null);

    } finally {

      setLoadingAuth(false);

    }

  };


  /* ============================================================
     INITIALISATION
  ============================================================ */

  useEffect(() => {

    const init = async () => {

      await Promise.all([
        loadStatus(),
        loadAuth()
      ]);

    };

    init();

  }, []);


  /* ============================================================
     LOADER INITIAL
  ============================================================ */

  if (loading || loadingAuth) {
    return <Loader />;
  }


  /* ============================================================
     ÉTAT DE CONFIGURATION
  ============================================================ */

  const setupFinished =
    setupStatus?.facultes === true;


  /* ============================================================
     ROUTES
  ============================================================ */

  return (

    <BrowserRouter>

      <Routes>


        {/* ======================================================
            RACINE
        ====================================================== */}

        <Route
          path="/"
          element={

            !setupFinished ? (

              <Navigate
                to="/setup"
                replace
              />

            ) : !user ? (

              <Navigate
                to="/home"
                replace
              />

            ) : user.active_role === "SGA" ? (

              <Navigate
                to="/super-admin"
                replace
              />

            ) : user.active_role === "ADMIN_FAC" ? (

              <Navigate
                to="/admin-fac"
                replace
              />

            ) : user.active_role === "ADMIN_MENTION" ? (

              <Navigate
                to="/admin-mention"
                replace
              />

            ) : user.active_role === "ENSEIGNANT" ? (

              <Navigate
                to="/enseignant"
                replace
              />

            ) : user.active_role === "COMPTABLE" ? (

              /*
               * NOUVEAU RÔLE
               */
              <Navigate
                to="/comptable"
                replace
              />

            ) : (

              /*
               * Rôle inconnu :
               * comportement conservé.
               */
              <Navigate
                to="/home"
                replace
              />

            )

          }
        />


        {/* ======================================================
            SETUP
        ====================================================== */}

        <Route
          path="/setup"
          element={

            setupFinished ? (

              <Navigate
                to="/home"
                replace
              />

            ) : (

              <SetupWizard
                setupStatus={setupStatus}
                onCompleted={loadStatus}
              />

            )

          }
        />


        {/* ======================================================
            HOME / AUTHENTIFICATION
        ====================================================== */}

        <Route
          path="/home"
          element={

            !setupFinished ? (

              <Navigate
                to="/setup"
                replace
              />

            ) : user ? (

              <Navigate
                to="/"
                replace
              />

            ) : (

              <Home />

            )

          }
        />


        {/* ======================================================
            SUPER ADMIN / SGA
        ====================================================== */}

        <Route
          path="/super-admin"
          element={
            <SuperAdmin />
          }
        />


        {/* ======================================================
            ADMINISTRATION FACULTÉ
        ====================================================== */}

        <Route
          path="/admin-fac"
          element={
            <AdminFac />
          }
        />


        {/* ======================================================
            ADMINISTRATION MENTION
        ====================================================== */}

        <Route
          path="/admin-mention"
          element={
            <ChefMention />
          }
        />


        {/* ======================================================
            ENSEIGNANT
        ====================================================== */}

        <Route
          path="/enseignant"
          element={
            <Enseignants />
          }
        />


        {/* ======================================================
            COMPTABLE
        ====================================================== */}

        <Route
          path="/comptable"
          element={
            <Comptable />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;

