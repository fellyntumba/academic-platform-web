// import React, {
//   useState,
//   useEffect,
// } from "react"; 

// import "./Enseignants.css";

// import {
//   isAuthenticated,
//   logout,
//   switchRole,
// } from "../accueils/serviceAuth";

// import {
//   getAnneeAcademiqueEnCoursService,
//   getNombreRecoursEnAttenteService,
// } from "./enseignantService";

// import Recours from "./Recours/Recours";
// import SaisirCotes from "./SaisirCotes/SaisirCotes";
// import Communiques from "./Communiques/Communiques";

// import {
//   useContextUniv,
// } from "../../featuresAndInfos/ContextUnivProvider";

// import {
//   ROLE_LABELS,
//   isValidRole,
// } from "../accueils/roles";


// const Enseignants = () => {

//   // ==========================================================================
//   // ÉTATS
//   // ==========================================================================

//   const [
//     infoUser,
//     setInfoUser,
//   ] = useState(null);

//   const [
//     annee,
//     setAnnee,
//   ] = useState("");

//   const [
//     activeView,
//     setActiveView,
//   ] = useState(null);

//   const [
//     message,
//     setMessage,
//   ] = useState("");

//   const [
//     messageType,
//     setMessageType,
//   ] = useState("");

//   const [
//     nbRecours,
//     setNbRecours,
//   ] = useState(0);


//   // ==========================================================================
//   // CONTEXTE UNIVERSITÉ
//   // ==========================================================================

//   const {
//     infoUniv,
//     loading,
//   } = useContextUniv();


//   // ==========================================================================
//   // ACTIONS ENSEIGNANT
//   // ==========================================================================

//   const actions = [

//     {
//       name: "Soumettre les cotes des étudiants",
//       icon: "📝",
//     },

//     {
//       name: "Traiter les recours des étudiants",
//       icon: "📩",
//       badge: nbRecours,
//     },

//     {
//       name: "Envoyer un communiqué",
//       icon: "📂",
//     },

//   ];


//   // ==========================================================================
//   // NOTIFICATION
//   // ==========================================================================

//   const showMessage = (
//     msg,
//     type = "error"
//   ) => {

//     setMessage(msg);
//     setMessageType(type);

//     setTimeout(() => {

//       setMessage("");
//       setMessageType("");

//     }, 4000);
//   };


//   // ==========================================================================
//   // DÉCONNEXION
//   // ==========================================================================

//   const handleQuit = async () => {

//     try {

//       await logout();

//     } catch (error) {

//       console.error(
//         "Erreur lors de la déconnexion :",
//         error
//       );

//     } finally {

//       /*
//        * Le backend supprime les cookies.
//        * On retourne ensuite vers l'accueil.
//        */

//       window.location.replace("/home");

//     }
//   };


//   // ==========================================================================
//   // CHANGEMENT DE PROFIL ACTIF
//   // ==========================================================================

//   const handleSwitchRole = async (event) => {

//     const nouveauRole =
//       event.target.value;


//     // ------------------------------------------------------------------------
//     // Aucun changement
//     // ------------------------------------------------------------------------

//     if (
//       !nouveauRole ||
//       nouveauRole === infoUser?.active_role
//     ) {
//       return;
//     }


//     // ------------------------------------------------------------------------
//     // Vérification frontend minimale
//     // ------------------------------------------------------------------------

//     /*
//      * Cette vérification sert uniquement à éviter
//      * d'envoyer un code de rôle inconnu.
//      *
//      * La vraie autorisation reste effectuée par
//      * le backend.
//      */

//     if (!isValidRole(nouveauRole)) {

//       alert(
//         "Profil sélectionné invalide."
//       );

//       return;
//     }


//     try {

//       // ----------------------------------------------------------------------
//       // Demande de changement de profil
//       // ----------------------------------------------------------------------

//       const result =
//         await switchRole(nouveauRole);


//       // ----------------------------------------------------------------------
//       // Échec
//       // ----------------------------------------------------------------------

//       if (!result.success) {

//         console.error(
//           "Échec changement profil :",
//           result
//         );

//         alert(
//           result.message ||
//           "Impossible de changer de profil."
//         );

//         return;
//       }


//       // ----------------------------------------------------------------------
//       // Mise à jour locale
//       // ----------------------------------------------------------------------

//       setInfoUser((previousUser) => ({

//         ...previousUser,

//         ...(result.user || {}),

//         active_role:
//           result.active_role ||
//           nouveauRole,

//       }));


//       // ----------------------------------------------------------------------
//       // Rechargement de l'application
//       // ----------------------------------------------------------------------

//       /*
//        * Le backend vient de générer de nouveaux
//        * accessToken / refreshToken avec le nouvel
//        * active_role.
//        *
//        * Le rechargement permet de reconstruire
//        * l'application avec le nouveau profil.
//        */

//       window.location.replace("/");

//     } catch (error) {

//       console.error(
//         "Erreur changement de profil :",
//         error
//       );

//       alert(
//         error?.message ||
//         "Impossible de changer de profil."
//       );

//     }
//   };


//   // ==========================================================================
//   // RÉCUPÉRATION DE L'UTILISATEUR AUTHENTIFIÉ
//   // ==========================================================================

//   useEffect(() => {

//     const loadUser = async () => {

//       try {

//         const auth =
//           await isAuthenticated();


//         // --------------------------------------------------------------------
//         // Non authentifié
//         // --------------------------------------------------------------------

//         if (!auth.authenticated) {

//           window.location.replace(
//             "/home"
//           );

//           return;
//         }


//         // --------------------------------------------------------------------
//         // Utilisateur authentifié
//         // --------------------------------------------------------------------

//         /*
//          * auth.user provient maintenant de /administration/me.
//          *
//          * Les informations importantes sont notamment :
//          *
//          * utilisateur_id
//          * nom
//          * email
//          * roles
//          * active_role
//          * enseignant_id
//          * admin_id
//          * comptable_id
//          *
//          * selon les profils possédés.
//          */

//         console.log(
//           "UTILISATEUR AUTHENTIFIÉ :",
//           auth.user
//         );

//         console.log(
//           "utilisateur_id :",
//           auth.user?.utilisateur_id
//         );

//         console.log(
//           "enseignant_id :",
//           auth.user?.enseignant_id
//         );

//         console.log(
//           "admin_id :",
//           auth.user?.admin_id
//         );

//         console.log(
//           "comptable_id :",
//           auth.user?.comptable_id
//         );

//         console.log(
//           "roles :",
//           auth.user?.roles
//         );

//         console.log(
//           "active_role :",
//           auth.user?.active_role
//         );


//         setInfoUser(
//           auth.user
//         );

//       } catch (error) {

//         console.error(
//           "Erreur récupération utilisateur :",
//           error
//         );

//         window.location.replace(
//           "/home"
//         );

//       }

//     };


//     loadUser();

//   }, []);


//   // ==========================================================================
//   // NOMBRE DE RECOURS EN ATTENTE
//   // ==========================================================================

//   useEffect(() => {

//     const loadRecoursCount = async () => {

//       try {

//         /*
//          * Très important :
//          *
//          * enseignant_id correspond toujours à
//          * enseignants.id_enseignant.
//          *
//          * Il ne faut PAS remplacer ceci par
//          * utilisateur_id.
//          */

//         if (!infoUser?.enseignant_id) {
//           return;
//         }


//         const result =
//           await getNombreRecoursEnAttenteService(
//             infoUser.enseignant_id
//           );


//         setNbRecours(
//           result.total || 0
//         );

//       } catch (error) {

//         console.error(
//           "Erreur chargement recours :",
//           error
//         );

//       }

//     };


//     loadRecoursCount();

//   }, [infoUser]);


//   // ==========================================================================
//   // ACTIONS ENSEIGNANT
//   // ==========================================================================

//   const handleActionClick = async (
//     actionName
//   ) => {

//     try {

//       // ----------------------------------------------------------------------
//       // Récupérer l'année académique en cours
//       // ----------------------------------------------------------------------

//       const result =
//         await getAnneeAcademiqueEnCoursService();


//       if (
//         !result ||
//         !result.data
//       ) {

//         showMessage(
//           "Aucune année académique en cours.",
//           "error"
//         );

//         return;
//       }


//       setAnnee(
//         result.data.libelle
//       );


//       // ----------------------------------------------------------------------
//       // SAISIR LES COTES
//       // ----------------------------------------------------------------------

//       if (
//         actionName ===
//         "Soumettre les cotes des étudiants"
//       ) {

//         setActiveView(
//           "saisir-cotes"
//         );

//       }


//       // ----------------------------------------------------------------------
//       // RECOURS
//       // ----------------------------------------------------------------------

//       else if (
//         actionName ===
//         "Traiter les recours des étudiants"
//       ) {

//         setActiveView(
//           "recours"
//         );

//       }


//       // ----------------------------------------------------------------------
//       // COMMUNIQUÉS
//       // ----------------------------------------------------------------------

//       else if (
//         actionName ===
//         "Envoyer un communiqué"
//       ) {

//         setActiveView(
//           "communiques"
//         );

//       }

//     } catch (error) {

//       showMessage(
//         error.message,
//         "error"
//       );

//     }
//   };


//   // ==========================================================================
//   // RETOUR AU TABLEAU DE BORD
//   // ==========================================================================

//   const handleBack = () => {

//     setActiveView(null);

//   };


//   // ==========================================================================
//   // RENDU
//   // ==========================================================================

//   return (

//     <div className="teacher-dashboard">


//       {/* ====================================================================
//           HEADER
//       ==================================================================== */}

//       <header
//         className="home-header"

//         style={{
//           borderBottom:
//             `3px solid ${
//               infoUniv?.primaryColor ||
//               "#3b82f6"
//             }`,
//         }}
//       >

//         <div className="header-left">

//           <img
//             src={
//               infoUniv?.logoUniversity
//             }

//             alt="Logo université"

//             className="logo"

//             onError={(event) => {

//               event.currentTarget.src =
//                 "/default-logo.png";

//             }}
//           />


//           <div className="university-info">

//             <h1>
//               {
//                 infoUniv?.nameUniversity ||
//                 "Academic Platform"
//               }
//             </h1>

//             <span className="subtitle">
//               academic Platform
//             </span>

//           </div>

//         </div>


//         <button
//           className="quit-btn"
//           onClick={handleQuit}
//         >
//           Quitter
//         </button>

//       </header>


//       {/* ====================================================================
//           NOTIFICATION
//       ==================================================================== */}

//       {message && (

//         <div
//           className={`parcours-notification ${messageType}`}
//         >
//           {message}
//         </div>

//       )}


//       {/* ====================================================================
//           CONTENU ENSEIGNANT
//       ==================================================================== */}

//       <div className="teacher-content">


//         {/* ==================================================================
//             NOTIFICATION INTERNE
//         ================================================================== */}

//         {message && (

//           <div
//             className={`parcours-notification ${messageType}`}
//           >
//             {message}
//           </div>

//         )}


//         {/* ==================================================================
//             TABLEAU DE BORD
//         ================================================================== */}

//         {activeView === null && (

//           <>

//             <h2 className="dashboard-title">
//               Tableau de bord Enseignant
//             </h2>


//             <div className="actions-grid">

//               {actions.map((action) => (

//                 <div
//                   key={action.name}
//                   className="action-card"

//                   onClick={() =>
//                     handleActionClick(
//                       action.name
//                     )
//                   }
//                 >

//                   <div className="action-icon">
//                     {action.icon}
//                   </div>


//                   <p>
//                     {action.name}
//                   </p>


//                   {action.badge > 0 && (

//                     <span className="badge">

//                       {action.badge > 99
//                         ? "99+"
//                         : action.badge}

//                     </span>

//                   )}

//                 </div>

//               ))}

//             </div>

//           </>

//         )}


//         {/* ==================================================================
//             SAISIR LES COTES
//         ================================================================== */}

//         {activeView ===
//           "saisir-cotes" && (

//           <div className="component-wrapper fade-in">

//             <button
//               className="back-btn"
//               onClick={handleBack}
//             >
//               ← Retour
//             </button>


//             <SaisirCotes
//               id_enseignant={
//                 infoUser?.enseignant_id
//               }
//               annee={annee}
//             />

//           </div>

//         )}


//         {/* ==================================================================
//             RECOURS
//         ================================================================== */}

//         {activeView ===
//           "recours" && (

//           <div className="component-wrapper fade-in">

//             <button
//               className="back-btn"
//               onClick={handleBack}
//             >
//               ← Retour
//             </button>


//             <Recours
//               id_enseignant={
//                 infoUser?.enseignant_id
//               }
//               annee={annee}
//             />

//           </div>

//         )}


//         {/* ==================================================================
//             COMMUNIQUÉS
//         ================================================================== */}

//         {activeView ===
//           "communiques" && (

//           <div className="component-wrapper fade-in">

//             <button
//               className="back-btn"
//               onClick={handleBack}
//             >
//               ← Retour
//             </button>


//             <Communiques
//               id_enseignant={
//                 infoUser?.enseignant_id
//               }
//               annee={annee}
//             />

//           </div>

//         )}

//       </div>


//       {/* ====================================================================
//           FOOTER
//       ==================================================================== */}

//       <footer className="dashboard-footer">


//         <div className="footer-center">

//           Plateforme académique intelligente
//           et sécurisée

//         </div>


//         {/* ==================================================================
//             UTILISATEUR
//         ================================================================== */}

//         {infoUser && (

//           <div className="footer-user-card">


//             {/* ==============================================================
//                 AVATAR
//             ============================================================== */}

//             <div className="footer-avatar">

//               {infoUser.nom
//                 ?.split(" ")
//                 .map(
//                   (word) =>
//                     word[0]
//                 )
//                 .join("")
//                 .substring(0, 2)
//                 .toUpperCase()}

//             </div>


//             {/* ==============================================================
//                 INFORMATIONS
//             ============================================================== */}

//             <div className="footer-user-info">


//               <div className="footer-user-name">

//                 {infoUser.nom}

//               </div>


//               {/* ============================================================
//                   FACULTÉ / MENTION
//               ============================================================ */}

//               <div className="footer-user-detail">

//                 {infoUser.code_faculte && (

//                   <span>
//                     {infoUser.code_faculte}
//                   </span>

//                 )}


//                 {infoUser.code_mention && (

//                   <>

//                     {infoUser.code_faculte && (

//                       <span>
//                         &nbsp; | &nbsp;
//                       </span>

//                     )}

//                     <span>
//                       {infoUser.code_mention}
//                     </span>

//                   </>

//                 )}

//               </div>


//               {/* ============================================================
//                   CHANGEMENT DE PROFIL
//               ============================================================ */}

//               <div className="footer-role-row">

//                 <span className="role-label">
//                   Profil :
//                 </span>


//                 <select
//                   value={
//                     infoUser.active_role ||
//                     ""
//                   }

//                   onChange={
//                     handleSwitchRole
//                   }

//                   disabled={
//                     !infoUser.roles ||
//                     infoUser.roles.length <= 1
//                   }

//                   aria-label="Profil actif"
//                 >

//                   {infoUser.roles?.map(
//                     (role) => (

//                       <option
//                         key={role}
//                         value={role}
//                       >

//                         {ROLE_LABELS[role] ||
//                           role}

//                       </option>

//                     )
//                   )}

//                 </select>

//               </div>

//             </div>

//           </div>

//         )}

//       </footer>

//     </div>

//   );
// };


// export default Enseignants;



import React, { useEffect, useRef, useState } from "react";
import "./Enseignants.css";

import {
  isAuthenticated,
  logout,
  switchRole,
} from "../accueils/serviceAuth";

import {
  getMediaUrl,
} from "../accueils/apiService";

import {
  getAnneeAcademiqueEnCoursService,
  getNombreRecoursEnAttenteService,
} from "./enseignantService";

import Recours from "./Recours/Recours";
import SaisirCotes from "./SaisirCotes/SaisirCotes";
import Communiques from "./Communiques/Communiques";

import {
  useContextUniv,
} from "../../featuresAndInfos/ContextUnivProvider";

import {
  ROLE_LABELS,
  isValidRole,
} from "../accueils/roles";


const ACTIONS = [
  {
    id: "saisir-cotes",
    name: "Soumettre les cotes des étudiants",
    description: "Enregistrer et gérer les résultats académiques.",
    icon: "📝",
  },
  {
    id: "recours",
    name: "Traiter les recours des étudiants",
    description: "Consulter les recours et assurer leur traitement.",
    icon: "📩",
    hasBadge: true,
  },
  {
    id: "communiques",
    name: "Envoyer un communiqué",
    description: "Préparer et publier des communications.",
    icon: "📢",
  },
];


const Enseignants = () => {
  const [infoUser, setInfoUser] = useState(null);
  const [annee, setAnnee] = useState("");
  const [activeView, setActiveView] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [nbRecours, setNbRecours] = useState(0);
  const [switchingRole, setSwitchingRole] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const notificationTimer = useRef(null);

  const { infoUniv } = useContextUniv();

  const universityName =
    infoUniv?.nameUniversity || "Academic Platform";

  const universitySlogan =
    infoUniv?.slogan ||
    "Plateforme académique intelligente et sécurisée";

  const primaryColor =
    infoUniv?.primaryColor || "#2563eb";

  const logoUrl = getMediaUrl(infoUniv?.logoUniversity);

  // --------------------------------------------------------------------------
  // NOTIFICATIONS
  // --------------------------------------------------------------------------

  const showMessage = (msg, type = "error") => {
    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
    }

    setMessage(msg);
    setMessageType(type);

    notificationTimer.current = setTimeout(() => {
      setMessage("");
      setMessageType("error");
      notificationTimer.current = null;
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // AUTHENTIFICATION
  // --------------------------------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const auth = await isAuthenticated();


        if (!mounted) return;

        if (!auth.authenticated || !auth.user) {
          window.location.replace("/home");
          return;
        }

        setInfoUser(auth.user);
      } catch (error) {
        console.error(
          "Erreur récupération utilisateur :",
          error
        );

        if (mounted) {
          window.location.replace("/home");
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------------------------------------------------
  // NOMBRE DE RECOURS EN ATTENTE
  // --------------------------------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadRecoursCount = async () => {
      if (!infoUser?.enseignant_id) return;

      try {
        const result =
          await getNombreRecoursEnAttenteService(
            infoUser.enseignant_id
          );

        if (mounted) {
          setNbRecours(result?.total || 0);
        }
      } catch (error) {
        console.error(
          "Erreur chargement recours :",
          error
        );
      }
    };

    loadRecoursCount();

    return () => {
      mounted = false;
    };
  }, [infoUser?.enseignant_id]);

  // --------------------------------------------------------------------------
  // DÉCONNEXION
  // --------------------------------------------------------------------------

  const handleQuit = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        "Erreur lors de la déconnexion :",
        error
      );
    } finally {
      window.location.replace("/home");
    }
  };

  // --------------------------------------------------------------------------
  // CHANGEMENT DE PROFIL ACTIF
  // --------------------------------------------------------------------------

  const handleSwitchRole = async (event) => {
    const nouveauRole = event.target.value;

    if (
      !nouveauRole ||
      nouveauRole === infoUser?.active_role ||
      switchingRole
    ) {
      return;
    }

    if (!isValidRole(nouveauRole)) {
      showMessage("Le profil sélectionné est invalide.");
      return;
    }

    setSwitchingRole(true);

    try {
      const result = await switchRole(nouveauRole);

      if (!result.success) {
        showMessage(
          result.message ||
          "Impossible de changer de profil."
        );
        setSwitchingRole(false);
        return;
      }

      setInfoUser((previousUser) => ({
        ...previousUser,
        ...(result.user || {}),
        active_role: result.active_role || nouveauRole,
      }));

      // Les nouveaux cookies sont définis par le backend.
      // Le routage choisira l'interface correspondant au rôle actif.
      window.location.replace("/");
    } catch (error) {
      console.error(
        "Erreur changement de profil :",
        error
      );

      showMessage(
        error?.message ||
        "Impossible de changer de profil."
      );

      setSwitchingRole(false);
    }
  };

  // --------------------------------------------------------------------------
  // OUVRIR UNE FONCTIONNALITÉ
  // --------------------------------------------------------------------------

  const handleActionClick = async (actionId) => {
    if (loadingAction) return;

    setLoadingAction(true);

    try {
      const result =
        await getAnneeAcademiqueEnCoursService();

      if (!result?.data) {
        showMessage(
          "Aucune année académique en cours."
        );
        return;
      }

      setAnnee(result.data.libelle);
      setActiveView(actionId);
    } catch (error) {
      console.error(
        "Erreur ouverture fonctionnalité :",
        error
      );

      showMessage(
        error?.message ||
        "Impossible de charger l'année académique."
      );
    } finally {
      setLoadingAction(false);
    }
  };

  const handleBack = () => {
    setActiveView(null);
  };

  const initials =
    infoUser?.nom
      ?.trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "EN";

  // --------------------------------------------------------------------------
  // RENDU
  // --------------------------------------------------------------------------

  return (
    <div
      className="teacher-dashboard"
      style={{ "--teacher-primary": primaryColor }}
    >
      <header className="teacher-header">
        <div className="teacher-brand">
          <div className="teacher-logo-wrap">
            <img
              src={logoUrl || "/default-logo.png"}
              alt={`Logo ${universityName}`}
              className="teacher-logo"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/default-logo.png";
              }}
            />
          </div>

          <div className="teacher-brand-info">
            <h1>{universityName}</h1>
            <p>{universitySlogan}</p>
            <span className="teacher-brand-label">
              ESPACE ACADÉMIQUE
            </span>
          </div>
        </div>

        <button
          type="button"
          className="teacher-logout"
          onClick={handleQuit}
        >
          <span aria-hidden="true">↪</span>
          <span>Quitter</span>
        </button>
      </header>

      <main className="teacher-main">
        {message && (
          <div
            className={`teacher-notification ${messageType}`}
            role="alert"
          >
            <span className="teacher-notification-icon">
              {messageType === "success" ? "✓" : "!"}
            </span>
            <span>{message}</span>
            <button
              type="button"
              aria-label="Fermer la notification"
              onClick={() => {
                if (notificationTimer.current) {
                  clearTimeout(notificationTimer.current);
                  notificationTimer.current = null;
                }
                setMessage("");
              }}
            >
              ×
            </button>
          </div>
        )}

        {activeView === null ? (
          <>
            <section className="teacher-welcome">
              <div className="teacher-welcome-content">
                <span className="teacher-eyebrow">
                  ESPACE ENSEIGNANT
                </span>

                <h2>Tableau de bord</h2>

                <p>
                  Accédez rapidement à vos outils de gestion
                  académique et au suivi des étudiants.
                </p>
              </div>

              <div className="teacher-welcome-mark" aria-hidden="true">
                <span>EN</span>
              </div>
            </section>

            <section className="teacher-section">
              <div className="teacher-section-heading">
                <div>
                  <h3>Vos espaces de travail</h3>
                  <p>
                    Sélectionnez une fonctionnalité pour continuer.
                  </p>
                </div>

                <span className="teacher-section-count">
                  {ACTIONS.length} fonctionnalités
                </span>
              </div>

              <div className="teacher-actions-grid">
                {ACTIONS.map((action) => (
                  <button
                    type="button"
                    key={action.id}
                    className="teacher-action-card"
                    onClick={() => handleActionClick(action.id)}
                    disabled={loadingAction}
                  >
                    <span className="teacher-action-icon">
                      {action.icon}
                    </span>

                    {action.hasBadge && nbRecours > 0 && (
                      <span className="teacher-action-badge">
                        {nbRecours > 99 ? "99+" : nbRecours}
                      </span>
                    )}

                    <span className="teacher-action-title">
                      {action.name}
                    </span>

                    <span className="teacher-action-description">
                      {action.description}
                    </span>

                    <span className="teacher-action-link">
                      {loadingAction
                        ? "Chargement..."
                        : "Ouvrir l'espace"}
                      <span aria-hidden="true">→</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="teacher-info-strip">
              <span className="teacher-info-icon" aria-hidden="true">
                i
              </span>
              <div>
                <strong>Année académique</strong>
                <p>
                  L'année en cours est vérifiée automatiquement
                  à l'ouverture d'une fonctionnalité.
                </p>
              </div>
            </section>
          </>
        ) : (
          <section className="teacher-module">
            <div className="teacher-module-toolbar">
              <button
                type="button"
                className="teacher-back-button"
                onClick={handleBack}
              >
                <span aria-hidden="true">←</span>
                Retour au tableau de bord
              </button>

              <span className="teacher-module-year">
                {annee}
              </span>
            </div>

            <div className="teacher-module-content">
              {activeView === "saisir-cotes" && (
                <SaisirCotes
                  id_enseignant={infoUser?.enseignant_id}
                  annee={annee}
                />
              )}

              {activeView === "recours" && (
                <Recours
                  id_enseignant={infoUser?.enseignant_id}
                  annee={annee}
                />
              )}

              {activeView === "communiques" && (
                <Communiques
                  id_enseignant={infoUser?.enseignant_id}
                  annee={annee}
                />
              )}
            </div>
          </section>
        )}
      </main>

        <footer className="dashboard-footer">
          <div className="footer-center">
            Plateforme académique intelligente
            et sécurisée
          </div>

          {infoUser && (
            <div className="footer-user-card">
              <div className="footer-avatar">
                {initials}
              </div>

              <div className="footer-user-info">
                <div className="footer-user-name">
                  {infoUser.nom}
                </div>

                <div className="footer-user-detail">
                  {infoUser.code_faculte && (
                    <span>{infoUser.code_faculte}</span>
                  )}

                  {infoUser.code_mention && (
                    <>
                      {infoUser.code_faculte && (
                        <span>&nbsp; | &nbsp;</span>
                      )}
                      <span>{infoUser.code_mention}</span>
                    </>
                  )}
                </div>

                <div className="footer-role-row">
                  <span className="role-label">
                    Profil :
                  </span>

                  <select
                    value={infoUser.active_role || ""}
                    onChange={handleSwitchRole}
                    disabled={
                      switchingRole ||
                      !infoUser.roles ||
                      infoUser.roles.length <= 1
                    }
                    aria-label="Profil actif"
                  >
                    {infoUser.roles?.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role] || role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </footer>
    </div>
  );
};

export default Enseignants;


