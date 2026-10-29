

// import React, {
//   useEffect,
//   useState,
// } from "react";

// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import { checkSetupStatus } from "./service";

// import SetupWizard
//   from "../composants/initialisation/setupWizard/SetupWizard";

// import Loader from "./loader/Loader";

// import Home
//   from "../composants/accueils/Home";

// import Sga
//   from "../composants/sga/Sga";

// import AdminFac
//   from "../composants/administrateurs-fac/AdminFac";

// import Enseignants
//   from "../composants/enseignants/Enseignants";

// import ChefMention
//   from "../composants/chef-mention/ChefMention";

// import Comptable
//   from "../composants/comptables/Comptable";

// import {
//   isAuthenticated,
// } from "../composants/accueils/serviceAuth";


// function App() {

//   // ============================================================
//   // ÉTATS
//   // ============================================================

//   const [loading, setLoading] =
//     useState(true);

//   const [setupStatus, setSetupStatus] =
//     useState(null);

//   const [user, setUser] =
//     useState(null);

//   const [loadingAuth, setLoadingAuth] =
//     useState(true);


//   // ============================================================
//   // CHARGER L'ÉTAT DE CONFIGURATION
//   // ============================================================

//   const loadStatus = async () => {

//     try {

//       const data =
//         await checkSetupStatus();

//       console.log(
//         "[APP] Setup status :",
//         data
//       );

//       setSetupStatus(data);

//       return data;

//     } catch (error) {

//       console.error(
//         "[APP] Erreur vérification configuration :",
//         error
//       );

//       return null;

//     }
//   };


//   // ============================================================
//   // VÉRIFIER L'AUTHENTIFICATION
//   // ============================================================

//   const loadAuth = async () => {

//     try {

//       const auth =
//         await isAuthenticated();

//       console.log(
//         "[APP] Authentification :",
//         auth
//       );


//       const authenticatedUser =
//         auth?.authenticated
//           ? auth.user
//           : null;


//       setUser(
//         authenticatedUser
//       );


//       return authenticatedUser;

//     } catch (error) {

//       console.error(
//         "[APP] Erreur authentification :",
//         error
//       );

//       setUser(null);

//       return null;

//     } finally {

//       setLoadingAuth(false);
//     }
//   };


//   // ============================================================
//   // INITIALISATION
//   // ============================================================

//   useEffect(() => {

//     const init = async () => {

//       setLoading(true);

//       await Promise.all([
//         loadStatus(),
//         loadAuth(),
//       ]);

//       setLoading(false);
//     };

//     init();

//   }, []);


//   // ============================================================
//   // AUTHENTIFICATION RÉUSSIE DANS SETUP
//   // ============================================================

//   const handleAuthenticated = (authenticatedUser) => {

//     console.log(
//       "[APP] Utilisateur authentifié :",
//       authenticatedUser
//     );

//     setUser(
//       authenticatedUser
//     );
//   };


//   // ============================================================
//   // SETUP TERMINÉ
//   // ============================================================

//   const handleSetupCompleted = async () => {

//     console.log(
//       "[APP] Configuration terminée. Actualisation..."
//     );


//     const status =
//       await loadStatus();


//     // ----------------------------------------------------------
//     // Actualiser également la session
//     // ----------------------------------------------------------

//     const authenticatedUser =
//       await loadAuth();


//     console.log(
//       "[APP] Configuration après actualisation :",
//       status
//     );


//     console.log(
//       "[APP] Utilisateur après actualisation :",
//       authenticatedUser
//     );
//   };


//   // ============================================================
//   // LOADER
//   // ============================================================

//   if (
//     loading ||
//     loadingAuth
//   ) {

//     return <Loader />;
//   }


//   // ============================================================
//   // NORMALISER LE SETUP STATUS
//   // ============================================================

//   const status =
//     setupStatus?.data ??
//     setupStatus ??
//     {};


//   // ============================================================
//   // CONFIGURATION TERMINÉE ?
//   // ============================================================

//   const setupFinished =
//     status.facultes === true;


//   console.log(
//     "[APP] setupFinished :",
//     setupFinished
//   );


//   // ============================================================
//   // ROUTES
//   // ============================================================

//   return (

//     <BrowserRouter>

//       <Routes>


//         {/* ======================================================
//             RACINE
//         ====================================================== */}

//         <Route
//           path="/"
//           element={

//             !setupFinished ? (

//               <Navigate
//                 to="/setup"
//                 replace
//               />

//             ) : user ? (

//               user.active_role === "SGA" ? (

//                 <Navigate
//                   to="/sga"
//                   replace
//                 />

//               ) : user.active_role === "ADMIN_FAC" ? (

//                 <Navigate
//                   to="/admin-fac"
//                   replace
//                 />

//               ) : user.active_role === "ADMIN_MENTION" ? (

//                 <Navigate
//                   to="/admin-mention"
//                   replace
//                 />

//               ) : user.active_role === "ENSEIGNANT" ? (

//                 <Navigate
//                   to="/enseignant"
//                   replace
//                 />

//               ) : user.active_role === "COMPTABLE" ? (

//                 <Navigate
//                   to="/comptable"
//                   replace
//                 />

//               ) : (

//                 <Navigate
//                   to="/home"
//                   replace
//                 />

//               )

//             ) : (

//               <Navigate
//                 to="/home"
//                 replace
//               />

//             )

//           }
//         />


//         {/* ======================================================
//             SETUP
//         ====================================================== */}

//         <Route
//           path="/setup"
//           element={

//             setupFinished ? (

//               <Navigate
//                 to="/home"
//                 replace
//               />

//             ) : (

//               <SetupWizard
//                 setupStatus={setupStatus}

//                 onAuthenticated={
//                   handleAuthenticated
//                 }

//                 onCompleted={
//                   handleSetupCompleted
//                 }
//               />

//             )

//           }
//         />


//         {/* ======================================================
//             HOME
//         ====================================================== */}

//         <Route
//           path="/home"
//           element={

//             !setupFinished ? (

//               <Navigate
//                 to="/setup"
//                 replace
//               />

//             ) : user ? (

//               <Navigate
//                 to="/"
//                 replace
//               />

//             ) : (

//               <Home />

//             )

//           }
//         />


//         {/* ======================================================
//             SGA
//         ====================================================== */}

//         <Route
//           path="/sga"
//           element={
//             <Sga />
//           }
//         />


//         {/* ======================================================
//             ADMIN FACULTÉ
//         ====================================================== */}

//         <Route
//           path="/admin-fac"
//           element={
//             <AdminFac />
//           }
//         />


//         {/* ======================================================
//             ADMIN MENTION
//         ====================================================== */}

//         <Route
//           path="/admin-mention"
//           element={
//             <ChefMention />
//           }
//         />


//         {/* ======================================================
//             ENSEIGNANT
//         ====================================================== */}

//         <Route
//           path="/enseignant"
//           element={
//             <Enseignants />
//           }
//         />


//         {/* ======================================================
//             COMPTABLE
//         ====================================================== */}

//         <Route
//           path="/comptable"
//           element={
//             <Comptable />
//           }
//         />

//       </Routes>

//     </BrowserRouter>
//   );
// }


// export default App;




import React, {
  useEffect,
  useCallback,
  useState,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { checkSetupStatus } from "./service";

import SetupWizard from "../composants/initialisation/setupWizard/SetupWizard";

import Loader from "./loader/Loader";

import Home from "../composants/accueils/Home";
import Sga from "../composants/sga/Sga";
import AdminFac from "../composants/administrateurs-fac/AdminFac";
import Enseignants from "../composants/enseignants/Enseignants";
import ChefMention from "../composants/chef-mention/ChefMention";
import Comptable from "../composants/comptables/Comptable";

import { isAuthenticated } from "../composants/accueils/serviceAuth";

function App() {
  // ============================================================
  // ÉTATS
  // ============================================================

  const [loading, setLoading] = useState(true);
  const [setupStatus, setSetupStatus] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Nouveau : protège le wizard pendant l'animation de fin.
  const [setupTransition, setSetupTransition] = useState(false);

  // ============================================================
  // CHARGER L'ÉTAT DE CONFIGURATION
  // ============================================================

  const loadStatus = async () => {
    try {
      const data = await checkSetupStatus();

      console.log("[APP] Setup status :", data);

      setSetupStatus(data);

      return data;
    } catch (error) {
      console.error(
        "[APP] Erreur vérification configuration :",
        error
      );

      return null;
    }
  };

  // ============================================================
  // VÉRIFIER L'AUTHENTIFICATION
  // ============================================================

  const loadAuth = async () => {
    try {
      const auth = await isAuthenticated();

      console.log("[APP] Authentification :", auth);

      const authenticatedUser = auth?.authenticated
        ? auth.user
        : null;

      setUser(authenticatedUser);

      return authenticatedUser;
    } catch (error) {
      console.error(
        "[APP] Erreur authentification :",
        error
      );

      setUser(null);

      return null;
    } finally {
      setLoadingAuth(false);
    }
  };

  // ============================================================
  // INITIALISATION
  // ============================================================

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      await Promise.all([
        loadStatus(),
        loadAuth(),
      ]);

      setLoading(false);
    };

    init();
  }, []);

  // ============================================================
  // AUTHENTIFICATION RÉUSSIE DANS SETUP
  // ============================================================

  // useCallback stabilise la fonction et évite de relancer
  // inutilement la vérification de session dans SetupWizard.
  const handleAuthenticated = useCallback(
    (authenticatedUser) => {
      console.log(
        "[APP] Utilisateur authentifié :",
        authenticatedUser
      );

      setUser(authenticatedUser);
    },
    []
  );

  // ============================================================
  // DÉBUT DE LA TRANSITION DE FIN
  // ============================================================

  const handleSetupCompleting = useCallback(() => {
    setSetupTransition(true);
  }, []);

  // ============================================================
  // SETUP TERMINÉ : ACTUALISATION APRÈS LES 5 SECONDES
  // ============================================================

  const handleSetupCompleted = async () => {
    console.log(
      "[APP] Animation terminée. Actualisation..."
    );

    try {
      // Actualiser le statut de configuration.
      await loadStatus();

      // Actualiser la session sans changer la logique existante.
      await loadAuth();
    } finally {
      // La redirection est maintenant autorisée.
      setSetupTransition(false);
    }
  };

  // ============================================================
  // LOADER
  // ============================================================

  if (loading || loadingAuth) {
    return <Loader />;
  }

  // ============================================================
  // NORMALISER LE SETUP STATUS
  // ============================================================

  const status = setupStatus?.data ?? setupStatus ?? {};

  // ============================================================
  // CONFIGURATION TERMINÉE ?
  // ============================================================

  const setupFinished = status.facultes === true;

  console.log("[APP] setupFinished :", setupFinished);

  // ============================================================
  // ROUTES
  // ============================================================

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
              <Navigate to="/setup" replace />
            ) : user ? (
              user.active_role === "SGA" ? (
                <Navigate to="/sga" replace />
              ) : user.active_role === "ADMIN_FAC" ? (
                <Navigate to="/admin-fac" replace />
              ) : user.active_role === "ADMIN_MENTION" ? (
                <Navigate to="/admin-mention" replace />
              ) : user.active_role === "ENSEIGNANT" ? (
                <Navigate to="/enseignant" replace />
              ) : user.active_role === "COMPTABLE" ? (
                <Navigate to="/comptable" replace />
              ) : (
                <Navigate to="/home" replace />
              )
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        {/* ======================================================
            SETUP
            Ne pas rediriger pendant l'animation.
        ====================================================== */}

        <Route
          path="/setup"
          element={
            setupFinished && !setupTransition ? (
              <Navigate to="/home" replace />
            ) : (
              <SetupWizard
                setupStatus={setupStatus}
                onAuthenticated={handleAuthenticated}
                onCompleting={handleSetupCompleting}
                onCompleted={handleSetupCompleted}
              />
            )
          }
        />

        {/* ======================================================
            HOME
        ====================================================== */}

        <Route
          path="/home"
          element={
            setupTransition ? (
              <Navigate to="/setup" replace />
            ) : !setupFinished ? (
              <Navigate to="/setup" replace />
            ) : user ? (
              <Navigate to="/" replace />
            ) : (
              <Home />
            )
          }
        />

        {/* ======================================================
            SGA
        ====================================================== */}

        <Route
          path="/sga"
          element={<Sga />}
        />

        {/* ======================================================
            ADMIN FACULTÉ
        ====================================================== */}

        <Route
          path="/admin-fac"
          element={<AdminFac />}
        />

        {/* ======================================================
            ADMIN MENTION
        ====================================================== */}

        <Route
          path="/admin-mention"
          element={<ChefMention />}
        />

        {/* ======================================================
            ENSEIGNANT
        ====================================================== */}

        <Route
          path="/enseignant"
          element={<Enseignants />}
        />

        {/* ======================================================
            COMPTABLE
        ====================================================== */}

        <Route
          path="/comptable"
          element={<Comptable />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


