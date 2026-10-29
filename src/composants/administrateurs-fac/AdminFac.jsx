// import React, {
//   useState,
//   useEffect,
// } from "react";

// import {
//   isAuthenticated,
//   logout,
//   switchRole,
// } from "../accueils/serviceAuth";

// import "./AdminFac.css";

// import StatsReussitePromotion
//   from "./StatsReussitePromotion/StatsReussitePromotion";

// import FaculteAnneeForm
//   from "./FaculteAnnee/FaculteAnneeForm";

// import MiseAjourChefMention
//   from "./MiseAjourChefMention/MiseAjourChefMention";

// import Mention
//   from "./mentions/Mention";

// import Communique
//   from "./Communique/Communique";

// import {
//   useContextUniv,
// } from "../../featuresAndInfos/ContextUnivProvider";

// import {
//   ROLE_LABELS,
//   isValidRole,
// } from "../accueils/roles";


// // ============================================================================
// // MENUS — CONFIGURATION INITIALE
// // ============================================================================

// const configInitialeMenus = [

//   {
//     title: "Gestion des mentions",

//     subMenus: [
//       "Créer / Modifier les mentions",
//     ],
//   },

//   {
//     title: "Gestion des chefs de mentions",

//     subMenus: [
//       "Créer / Modifier les chefs de mentions",
//     ],
//   },

// ];


// // ============================================================================
// // MENUS — GESTION ANNUELLE
// // ============================================================================

// const gestionAnnuelleMenus = [

//   {
//     title: "Gestion faculté-année",

//     subMenus: [
//       "Créer / Modifier la faculté-année",
//     ],
//   },

//   {
//     title: "Statistiques",

//     subMenus: [
//       "Taux de réussite / échec pour l'année acad. en cours",
//     ],
//   },

//   {
//     title: "Gestion des communiqués",

//     subMenus: [
//       "Créer / Publier un communiqué",
//     ],
//   },

// ];


// // ============================================================================
// // COMPOSANT ADMINISTRATEUR FACULTAIRE
// // ============================================================================

// const AdminFac = () => {

//   // ==========================================================================
//   // ÉTATS
//   // ==========================================================================

//   const [
//     activeMenu,
//     setActiveMenu,
//   ] = useState(null);

//   const [
//     activeView,
//     setActiveView,
//   ] = useState(null);

//   const [
//     infoUser,
//     setInfoUser,
//   ] = useState(null);


//   // ==========================================================================
//   // CONTEXTE UNIVERSITÉ
//   // ==========================================================================

//   const {
//     infoUniv,
//     loading,
//   } = useContextUniv();


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
//        * Le backend supprime les cookies
//        * d'authentification.
//        *
//        * On retourne ensuite vers l'accueil.
//        */

//       window.location.replace("/home");

//     }
//   };


//   // ==========================================================================
//   // CHANGEMENT DU PROFIL ACTIF
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
//      * Cette vérification ne constitue PAS une sécurité.
//      *
//      * Le backend reste responsable de vérifier
//      * que l'utilisateur possède réellement
//      * le profil demandé.
//      */

//     if (!isValidRole(nouveauRole)) {

//       alert(
//         "Profil sélectionné invalide."
//       );

//       return;
//     }


//     try {

//       // ----------------------------------------------------------------------
//       // Demander au backend de changer le profil actif
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

//         /*
//          * Le backend peut retourner
//          * l'utilisateur complet.
//          */

//         ...(result.user || {}),

//         /*
//          * Le nouveau rôle actif est toujours
//          * conservé localement.
//          */

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
//        * Le rechargement permet à l'application
//        * de reconstruire le dashboard correspondant.
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
//   // RÉCUPÉRER LES INFORMATIONS UTILISATEUR
//   // ==========================================================================

//   useEffect(() => {

//     const loadUser = async () => {

//       try {

//         const auth =
//           await isAuthenticated();


//         // --------------------------------------------------------------------
//         // Utilisateur non authentifié
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
//          * L'utilisateur provient maintenant
//          * de /administration/me.
//          *
//          * Les propriétés importantes pour ADMIN_FAC :
//          *
//          * utilisateur_id
//          * nom
//          * email
//          * roles
//          * active_role
//          * admin_id
//          * faculte_id
//          * code_faculte
//          *
//          * selon ce que retourne ton backend.
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
//           "admin_id :",
//           auth.user?.admin_id
//         );

//         console.log(
//           "faculte_id :",
//           auth.user?.faculte_id
//         );

//         console.log(
//           "code_faculte :",
//           auth.user?.code_faculte
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
//   // OUVRIR / FERMER UN MENU
//   // ==========================================================================

//   const toggleMenu = (index) => {

//     setActiveMenu(
//       activeMenu === index
//         ? null
//         : index
//     );

//   };


//   // ==========================================================================
//   // ACTION D'UN SOUS-MENU
//   // ==========================================================================

//   const handleSubMenuClick = (title) => {

//     if (
//       title ===
//       "Créer / Modifier la faculté-année"
//     ) {

//       setActiveView(
//         "faculte-annee"
//       );

//     }

//     else if (
//       title ===
//       "Créer / Modifier les chefs de mentions"
//     ) {

//       setActiveView(
//         "chefs-mentions"
//       );

//     }

//     else if (
//       title ===
//       "Créer / Modifier les mentions"
//     ) {

//       setActiveView(
//         "mentions"
//       );

//     }

//     else if (
//       title ===
//       "Taux de réussite / échec pour l'année acad. en cours"
//     ) {

//       setActiveView(
//         "statistiques"
//       );

//     }

//     else if (
//       title ===
//       "Créer / Publier un communiqué"
//     ) {

//       setActiveView(
//         "communique"
//       );

//     }

//     else {

//       setActiveView(null);

//     }
//   };


//   // ==========================================================================
//   // RENDRE UN GROUPE DE MENUS
//   // ==========================================================================

//   const renderMenuGroup = (
//     menus,
//     groupIndex
//   ) => {

//     return menus.map(
//       (item, index) => {

//         const globalIndex =
//           `${groupIndex}-${index}`;


//         const isActive =
//           activeMenu === globalIndex;


//         return (

//           <div
//             key={item.title}
//             className={`menu-item ${
//               isActive
//                 ? "menu-item-active"
//                 : ""
//             }`}
//           >

//             <div
//               className="menu-title"

//               onClick={() =>
//                 toggleMenu(
//                   globalIndex
//                 )
//               }
//             >

//               {item.title}

//               {" "}

//               {isActive
//                 ? "▲"
//                 : "▼"}

//             </div>


//             {isActive && (

//               <ul className="sub-menu">

//                 {item.subMenus.map(
//                   (sub, subIndex) => (

//                     <li
//                       key={subIndex}
//                       className="sub-menu-item"

//                       onClick={() =>
//                         handleSubMenuClick(
//                           sub
//                         )
//                       }
//                     >

//                       {sub}

//                     </li>

//                   )
//                 )}

//               </ul>

//             )}

//           </div>

//         );

//       }
//     );

//   };


//   // ==========================================================================
//   // RENDU
//   // ==========================================================================

//   return (

//     <div className="admin-fac-dashboard">


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
//           BODY
//       ==================================================================== */}

//       <div className="dashboard-body">


//         {/* ==================================================================
//             SIDEBAR
//         ================================================================== */}

//         <nav className="sidebar">


//           {/* ================================================================
//               CONFIGURATION INITIALE
//           ================================================================ */}

//           <div className="menu-card">

//             <div className="menu-card-header">
//               Configuration initiale
//             </div>


//             <div className="menu-card-desc">

//               Ces menus servent à configurer
//               les mentions ainsi que leurs chefs.

//             </div>


//             {renderMenuGroup(
//               configInitialeMenus,
//               "config"
//             )}

//           </div>


//           {/* ================================================================
//               GESTION ANNUELLE
//           ================================================================ */}

//           <div className="menu-card">

//             <div className="menu-card-header">
//               Gestion académique annuelle
//             </div>


//             <div className="menu-card-desc">

//               Ces menus concernent la gestion annuelle.

//             </div>


//             {renderMenuGroup(
//               gestionAnnuelleMenus,
//               "annee"
//             )}

//           </div>

//         </nav>


//         {/* ==================================================================
//             CONTENU
//         ================================================================== */}

//         <main className="dashboard-content">


//           {/* ================================================================
//               ACCUEIL
//           ================================================================ */}

//           {activeView === null && (

//             <>

//               <h2>
//                 {infoUser?.nom_fac}
//               </h2>


//               <p>
//                 Veuillez sélectionner une action
//                 dans le menu à gauche.
//               </p>

//             </>

//           )}


//           {/* ================================================================
//               FACULTÉ — ANNÉE
//           ================================================================ */}

//           {activeView ===
//             "faculte-annee" && (

//             <FaculteAnneeForm
//               code_faculte={
//                 infoUser?.code_faculte
//               }
//             />

//           )}


//           {/* ================================================================
//               STATISTIQUES
//           ================================================================ */}

//           {activeView ===
//             "statistiques" && (

//             <StatsReussitePromotion
//               nomFaculte={
//                 infoUser?.code_faculte
//               }
//             />

//           )}


//           {/* ================================================================
//               MENTIONS
//           ================================================================ */}

//           {activeView ===
//             "mentions" && (

//             <Mention
//               nomFaculte={
//                 infoUser?.code_faculte
//               }
//             />

//           )}


//           {/* ================================================================
//               CHEFS DE MENTION
//           ================================================================ */}

//           {activeView ===
//             "chefs-mentions" && (

//             <MiseAjourChefMention
//               nomFaculte={
//                 infoUser?.code_faculte
//               }
//             />

//           )}


//           {/* ================================================================
//               COMMUNIQUÉ
//           ================================================================ */}

//           {activeView ===
//             "communique" && (

//             <Communique
//               nomFaculte={
//                 infoUser?.code_faculte
//               }
//             />

//           )}

//         </main>

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
//                 INFORMATIONS UTILISATEUR
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


// export default AdminFac;





import React, { useState, useEffect } from "react";
import "./AdminFac.css";

import {
  isAuthenticated,
  logout,
  switchRole,
} from "../accueils/serviceAuth";

import { getMediaUrl } from "../accueils/apiService";

import StatsReussitePromotion
  from "./StatsReussitePromotion/StatsReussitePromotion";

import FaculteAnneeForm
  from "./FaculteAnnee/FaculteAnneeForm";

import MiseAjourChefMention
  from "./MiseAjourChefMention/MiseAjourChefMention";

import Mention from "./mentions/Mention";
import Communique from "./Communique/Communique";

import {
  useContextUniv,
} from "../../featuresAndInfos/ContextUnivProvider";

import {
  ROLE_LABELS,
  isValidRole,
} from "../accueils/roles";

// ============================================================================
// MENUS
// ============================================================================

const configInitialeMenus = [
  {
    title: "Gestion des mentions",
    subMenus: ["Créer / Modifier les mentions"],
  },
  {
    title: "Gestion des chefs de mentions",
    subMenus: ["Créer / Modifier les chefs de mentions"],
  },
];

const gestionAnnuelleMenus = [
  {
    title: "Gestion faculté-année",
    subMenus: ["Créer / Modifier la faculté-année"],
  },
  {
    title: "Statistiques",
    subMenus: [
      "Taux de réussite / échec pour l'année acad. en cours",
    ],
  },
  {
    title: "Gestion des communiqués",
    subMenus: ["Créer / Publier un communiqué"],
  },
];

// ============================================================================
// ADMINISTRATEUR FACULTAIRE
// ============================================================================

const AdminFac = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeView, setActiveView] = useState(null);
  const [infoUser, setInfoUser] = useState(null);
  const [switchingRole, setSwitchingRole] = useState(false);

  const { infoUniv } = useContextUniv();

  // --------------------------------------------------------------------------
  // IDENTITÉ VISUELLE DYNAMIQUE DE L'UNIVERSITÉ
  // --------------------------------------------------------------------------

  const universityName =
    infoUniv?.nameUniversity || "Academic Platform";

  const primaryColor =
    infoUniv?.primaryColor || "#2563eb";

  const secondaryColor =
    infoUniv?.secondaryColor || "#f97316";

  const logoUrl = getMediaUrl(infoUniv?.logoUniversity);

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
      window.alert("Profil sélectionné invalide.");
      return;
    }

    setSwitchingRole(true);

    try {
      const result = await switchRole(nouveauRole);

      if (!result?.success) {
        window.alert(
          result?.message ||
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

      // Le backend définit les nouveaux cookies.
      window.location.replace("/");
    } catch (error) {
      console.error(
        "Erreur changement de profil :",
        error
      );

      window.alert(
        error?.message ||
        "Impossible de changer de profil."
      );

      setSwitchingRole(false);
    }
  };

  // --------------------------------------------------------------------------
  // RÉCUPÉRATION DE L'UTILISATEUR AUTHENTIFIÉ
  // --------------------------------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const auth = await isAuthenticated();

        if (!mounted) return;

        if (!auth?.authenticated || !auth?.user) {
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
  // OUVRIR / FERMER UN MENU
  // --------------------------------------------------------------------------

  const toggleMenu = (index) => {
    setActiveMenu((previousMenu) =>
      previousMenu === index ? null : index
    );
  };

  // --------------------------------------------------------------------------
  // ACTION D'UN SOUS-MENU
  // --------------------------------------------------------------------------

  const handleSubMenuClick = (title) => {
    const views = {
      "Créer / Modifier la faculté-année": "faculte-annee",
      "Créer / Modifier les chefs de mentions": "chefs-mentions",
      "Créer / Modifier les mentions": "mentions",
      "Taux de réussite / échec pour l'année acad. en cours":
        "statistiques",
      "Créer / Publier un communiqué": "communique",
    };

    setActiveView(views[title] || null);
  };

  // --------------------------------------------------------------------------
  // RENDRE UN GROUPE DE MENUS
  // --------------------------------------------------------------------------

  const renderMenuGroup = (menus, groupIndex) =>
    menus.map((item, index) => {
      const globalIndex = `${groupIndex}-${index}`;
      const isActive = activeMenu === globalIndex;

      return (
        <div
          key={item.title}
          className={`menu-item ${
            isActive ? "menu-item-active" : ""
          }`}
        >
          <button
            type="button"
            className="menu-title"
            onClick={() => toggleMenu(globalIndex)}
            aria-expanded={isActive}
          >
            <span>{item.title}</span>
            <span className="menu-arrow" aria-hidden="true">
              {isActive ? "▲" : "▼"}
            </span>
          </button>

          {isActive && (
            <ul className="sub-menu">
              {item.subMenus.map((sub) => (
                <li
                  key={sub}
                  className={`sub-menu-item ${
                    activeView &&
                    ({
                      "Créer / Modifier la faculté-année":
                        "faculte-annee",
                      "Créer / Modifier les chefs de mentions":
                        "chefs-mentions",
                      "Créer / Modifier les mentions":
                        "mentions",
                      "Taux de réussite / échec pour l'année acad. en cours":
                        "statistiques",
                      "Créer / Publier un communiqué":
                        "communique",
                    }[sub] === activeView)
                      ? "sub-menu-item-active"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSubMenuClick(sub)}
                  >
                    {sub}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    });

  // --------------------------------------------------------------------------
  // INITIALES UTILISATEUR
  // --------------------------------------------------------------------------

  const initials =
    infoUser?.nom
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "AF";

  // --------------------------------------------------------------------------
  // RENDU
  // --------------------------------------------------------------------------

  return (
    <div
      className="admin-fac-dashboard"
      style={{
        "--univ-primary": primaryColor,
        "--univ-secondary": secondaryColor,
      }}
    >
      {/* EN-TÊTE */}

      <header className="home-header">
        <div className="header-left">
          <div className="header-logo-container">
            <img
              src={logoUrl || "/default-logo.png"}
              alt={`Logo ${universityName}`}
              className="logo"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/default-logo.png";
              }}
            />
          </div>

          <div className="university-info">
            <h1>{universityName}</h1>
            <span className="subtitle">
              Administration facultaire
            </span>
            <div className="university-meta">
              <span>ESPACE ACADÉMIQUE</span>
              {infoUser?.code_faculte && (
                <>
                  <span className="meta-separator">|</span>
                  <span>{infoUser.code_faculte}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="quit-btn"
          onClick={handleQuit}
        >
          Quitter
        </button>
      </header>

      {/* CORPS PRINCIPAL */}

      <div className="dashboard-body">
        {/* SIDEBAR */}

        <nav
          className="sidebar"
          aria-label="Navigation facultaire"
        >
          <div className="menu-card">
            <div className="menu-card-header">
              Configuration initiale
            </div>

            <div className="menu-card-desc">
              Configurez les mentions et leurs chefs.
            </div>

            {renderMenuGroup(configInitialeMenus, "config")}
          </div>

          <div className="menu-card">
            <div className="menu-card-header">
              Gestion académique annuelle
            </div>

            <div className="menu-card-desc">
              Gérez les activités académiques annuelles.
            </div>

            {renderMenuGroup(gestionAnnuelleMenus, "annee")}
          </div>
        </nav>

        {/* CONTENU */}

        <main className="dashboard-content">
          {activeView === null && (
            <section className="dashboard-welcome">
              <div className="dashboard-welcome-accent" />

              <span className="dashboard-eyebrow">
                ADMINISTRATION FACULTAIRE
              </span>

              <h2>
                {infoUser?.nom_fac ||
                  infoUser?.code_faculte ||
                  "Espace administrateur"}
              </h2>

              <p>
                Sélectionnez une fonctionnalité dans le menu
                pour gérer les mentions, les responsables,
                les activités annuelles et les statistiques
                de votre faculté.
              </p>
            </section>
          )}

          {activeView !== null && (
            <section className="admin-fac-module">
              
              <div className="module-toolbar module-toolbar-compact">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setActiveView(null)}
                >
                  <span aria-hidden="true">←</span>
                  Retour
                </button>
              </div>


              <div className="admin-fac-module-content">
                {activeView === "faculte-annee" && (
                  <FaculteAnneeForm
                    code_faculte={infoUser?.code_faculte}
                  />
                )}

                {activeView === "statistiques" && (
                  <StatsReussitePromotion
                    nomFaculte={infoUser?.code_faculte}
                  />
                )}

                {activeView === "mentions" && (
                  <Mention
                    nomFaculte={infoUser?.code_faculte}
                  />
                )}

                {activeView === "chefs-mentions" && (
                  <MiseAjourChefMention
                    nomFaculte={infoUser?.code_faculte}
                  />
                )}

                {activeView === "communique" && (
                  <Communique
                    nomFaculte={infoUser?.code_faculte}
                  />
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* PIED DE PAGE : MÊMES CLASSES QUE LE SGA */}

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

export default AdminFac;
