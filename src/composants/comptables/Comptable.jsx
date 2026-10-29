

// import React, { useState, useEffect } from "react";

// import {
//   isAuthenticated,
//   logout,
//   switchRole,
// } from "../accueils/serviceAuth";

// import "./Comptable.css";

// import EnregistrementPaiementsFrais from "./paiementsFrais/EnregistrementPaiementsFrais";

// // Conservé pour l'activation future de cette fonctionnalité.
// import SituationsFinancieres from "./situationsFinancieres/SituationsFinancieres";

// import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";

// import {
//   ROLE_LABELS,
//   isValidRole,
// } from "../accueils/roles";


// // ============================================================
// // MENUS COMPTABLE
// // ============================================================

// const menusComptable = [
//   {
//     title: "Gestion des paiements",
//     subMenus: [
//       "Enregistrer les paiements des frais",
//     ],
//   },
//   {
//     title: "Situation financière",
//     subMenus: [
//       "Situation financière d'une promotion ou d'un étudiant",
//     ],
//   },
// ];


// // ============================================================
// // CORRESPONDANCE DES VUES
// // ============================================================

// const viewBySubMenu = {
//   "Enregistrer les paiements des frais": "paiements-frais",

//   "Situation financière d'une promotion ou d'un étudiant":
//     "situation-financiere",
// };


// // ============================================================
// // COMPOSANT PRINCIPAL
// // ============================================================

// const Comptable = () => {
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [activeView, setActiveView] = useState(null);
//   const [infoUser, setInfoUser] = useState(null);
//   const [switchingRole, setSwitchingRole] = useState(false);

//   const { infoUniv } = useContextUniv();

//   const primaryColor = infoUniv?.primaryColor || "#2563eb";
//   const secondaryColor = infoUniv?.secondaryColor || "#f97316";

//   const activeViewTitle = Object.entries(viewBySubMenu).find(
//     ([, view]) => view === activeView
//   )?.[0];


//   // ============================================================
//   // DÉCONNEXION
//   // ============================================================

//   const handleQuit = async () => {
//     try {
//       await logout();
//     } catch (error) {
//       console.error("Erreur lors de la déconnexion :", error);
//     } finally {
//       window.location.replace("/home");
//     }
//   };


//   // ============================================================
//   // CHARGEMENT ET AUTHENTIFICATION DE L'UTILISATEUR
//   // ============================================================

//   useEffect(() => {
//     let cancelled = false;

//     const loadUser = async () => {
//       try {
//         const auth = await isAuthenticated();

//         if (cancelled) return;

//         if (!auth?.authenticated) {
//           window.location.replace("/home");
//           return;
//         }

//         setInfoUser(auth.user || null);
//       } catch (error) {
//         if (!cancelled) {
//           console.error(
//             "Erreur lors de la récupération de l'utilisateur :",
//             error
//           );

//           window.location.replace("/home");
//         }
//       }
//     };

//     loadUser();

//     return () => {
//       cancelled = true;
//     };
//   }, []);


//   // ============================================================
//   // CHANGEMENT DE PROFIL ACTIF
//   // ============================================================

//   const handleSwitchRole = async (event) => {
//     const role = event.target.value;

//     if (
//       !role ||
//       role === infoUser?.active_role ||
//       switchingRole
//     ) {
//       return;
//     }

//     if (!isValidRole(role)) {
//       console.error("Rôle invalide demandé :", role);
//       window.alert("Le profil demandé est invalide.");
//       return;
//     }

//     setSwitchingRole(true);

//     try {
//       const result = await switchRole(role);

//       if (!result?.success) {
//         window.alert(
//           result?.message || "Impossible de changer de profil."
//         );
//         return;
//       }

//       // Le backend a actualisé le profil actif.
//       // On recharge l'application pour récupérer la nouvelle session.
//       window.location.replace("/");
//     } catch (error) {
//       console.error("Erreur lors du changement de profil :", error);

//       window.alert(
//         error?.message || "Impossible de changer de profil."
//       );
//     } finally {
//       setSwitchingRole(false);
//     }
//   };


//   // ============================================================
//   // OUVERTURE / FERMETURE DES MENUS
//   // ============================================================

//   const toggleMenu = (menuId) => {
//     setActiveMenu((current) =>
//       current === menuId ? null : menuId
//     );
//   };


//   // ============================================================
//   // SÉLECTION D'UNE ACTION
//   // ============================================================

//   const handleSubMenuClick = (title) => {
//     const nextView = viewBySubMenu[title];

//     if (!nextView) {
//       console.warn("Aucune vue associée à cette action :", title);
//       return;
//     }

//     setActiveView(nextView);
//   };


//   // ============================================================
//   // RENDU
//   // ============================================================

//   return (
//     <div
//       className="comptable-dashboard"
//       style={{
//         "--univ-primary": primaryColor,
//         "--univ-secondary": secondaryColor,
//       }}
//     >
//       {/* ======================================================
//           EN-TÊTE
//       ====================================================== */}

//       <header className="home-header">
//         <div className="header-left">
//           <div className="header-logo-container">
//             <img
//               src={
//                 infoUniv?.logoUniversity ||
//                 "/default-logo.png"
//               }
//               alt="Logo de l'université"
//               className="logo"
//               onError={(event) => {
//                 event.currentTarget.onerror = null;
//                 event.currentTarget.src = "/default-logo.png";
//               }}
//             />
//           </div>

//           <div className="university-info">
//             <h1>
//               {infoUniv?.nameUniversity || "Academic Platform"}
//             </h1>

//             <span className="subtitle">
//               Administration financière
//             </span>

//             <div className="university-meta">
//               <span className="university-meta-dot" />
//               <span>Espace comptable</span>
//             </div>
//           </div>
//         </div>

//         <button
//           type="button"
//           className="quit-btn"
//           onClick={handleQuit}
//         >
//           <span className="quit-btn-icon" aria-hidden="true">
//             ↗
//           </span>

//           <span>Quitter</span>
//         </button>
//       </header>


//       {/* ======================================================
//           CORPS DU DASHBOARD
//       ====================================================== */}

//       <div className="dashboard-body">
//         {/* ====================================================
//             BARRE LATÉRALE
//         ==================================================== */}

//         <aside className="sidebar">
//           <div className="sidebar-heading">
//             <span className="sidebar-heading-label">
//               ESPACE DE TRAVAIL
//             </span>

//             <h2>Gestion financière</h2>

//             <p>
//               Enregistrez les paiements et accédez aux opérations
//               financières disponibles.
//             </p>
//           </div>

//           <section className="menu-card">
//             <div className="menu-card-header">
//               <span className="menu-card-indicator payments" />

//               <div>
//                 <h3 className="menu-card-title">
//                   Opérations financières
//                 </h3>

//                 <p className="menu-card-desc">
//                   Gestion des paiements et consultation financière.
//                 </p>
//               </div>
//             </div>

//             <div className="menu-list">
//               {menusComptable.map((item, index) => {
//                 const isOpen = activeMenu === index;
//                 const isActive = item.subMenus.includes(activeViewTitle);

//                 return (
//                   <div
//                     key={item.title}
//                     className={`menu-item ${
//                       isOpen ? "menu-item-open" : ""
//                     }`}
//                   >
//                     <button
//                       type="button"
//                       className={`menu-title ${
//                         isActive ? "menu-title-active" : ""
//                       }`}
//                       onClick={() => toggleMenu(index)}
//                       aria-expanded={isOpen}
//                     >
//                       <span className="menu-title-text">
//                         {item.title}
//                       </span>

//                       <span
//                         className={`menu-chevron ${
//                           isOpen ? "menu-chevron-open" : ""
//                         }`}
//                         aria-hidden="true"
//                       >
//                         ▾
//                       </span>
//                     </button>

//                     {isOpen && (
//                       <ul className="sub-menu">
//                         {item.subMenus.map((sub) => (
//                           <li key={sub}>
//                             <button
//                               type="button"
//                               className={`sub-menu-item ${
//                                 activeViewTitle === sub
//                                   ? "sub-menu-item-active"
//                                   : ""
//                               }`}
//                               onClick={() => handleSubMenuClick(sub)}
//                             >
//                               <span className="sub-menu-dot" />
//                               <span>{sub}</span>
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </section>

//           <div className="sidebar-footer-note">
//             <span className="sidebar-footer-dot" />
//             <span>Espace de gestion sécurisé</span>
//           </div>
//         </aside>


//         {/* ====================================================
//             CONTENU PRINCIPAL
//         ==================================================== */}

//         <main className="dashboard-content">
//           {activeView === null && (
//             <section className="welcome-panel">
//               <div className="welcome-panel-top">
//                 <div>
//                   <span className="dashboard-eyebrow">
//                     ESPACE COMPTABLE
//                   </span>

//                   <h2 className="dashboard-title">
//                     Bienvenue dans votre espace financier
//                   </h2>

//                   <p className="dashboard-description">
//                     Sélectionnez une opération dans le menu latéral
//                     pour gérer les paiements des frais académiques.
//                   </p>
//                 </div>

//                 <div className="welcome-mark" aria-hidden="true">
//                   <span>FC</span>
//                 </div>
//               </div>

//               <div className="welcome-divider" />

//               <div className="welcome-info-grid">
//                 <div className="welcome-info-card">
//                   <span className="welcome-info-label">
//                     UTILISATEUR
//                   </span>

//                   <strong>
//                     {infoUser?.nom || "Non renseigné"}
//                   </strong>

//                   <span className="welcome-info-description">
//                     Compte connecté
//                   </span>
//                 </div>

//                 <div className="welcome-info-card">
//                   <span className="welcome-info-label">
//                     ÉTABLISSEMENT
//                   </span>

//                   <strong>
//                     {infoUser?.code_faculte ||
//                       infoUser?.nom_fac ||
//                       "Non renseigné"}
//                   </strong>

//                   <span className="welcome-info-description">
//                     Affectation du compte
//                   </span>
//                 </div>

//                 <div className="welcome-info-card">
//                   <span className="welcome-info-label">
//                     PROFIL ACTIF
//                   </span>

//                   <strong>
//                     {ROLE_LABELS[infoUser?.active_role] ||
//                       infoUser?.active_role ||
//                       "Comptable"}
//                   </strong>

//                   <span className="welcome-info-description">
//                     Accès comptable
//                   </span>
//                 </div>
//               </div>

//               <div className="welcome-instruction">
//                 <span
//                   className="welcome-instruction-icon"
//                   aria-hidden="true"
//                 >
//                   i
//                 </span>

//                 <p>
//                   Utilisez « Gestion des paiements » pour enregistrer
//                   les frais. La consultation des situations financières
//                   sera disponible lorsque cette fonctionnalité sera activée.
//                 </p>
//               </div>
//             </section>
//           )}


//           {/* ==================================================
//               ENREGISTREMENT DES PAIEMENTS
//           ================================================== */}

//           {activeView === "paiements-frais" && (
//             <section className="module-panel">
//               <div className="module-toolbar">
//                 <div className="module-heading">
//                   <span className="dashboard-eyebrow">
//                     GESTION FINANCIÈRE
//                   </span>

//                   <h2 className="module-title">
//                     Enregistrement des paiements
//                   </h2>

//                   <p className="module-description">
//                     Enregistrement des paiements des frais académiques.
//                   </p>
//                 </div>

//                 <button
//                   type="button"
//                   className="back-btn"
//                   onClick={() => setActiveView(null)}
//                 >
//                   <span aria-hidden="true">←</span>
//                   Retour à l'accueil
//                 </button>
//               </div>

//               <div className="module-divider" />

//               <div className="comptable-module-content">
//                 <EnregistrementPaiementsFrais />
//               </div>
//             </section>
//           )}


//           {/* ==================================================
//               SITUATION FINANCIÈRE
//           ================================================== */}

//           {activeView === "situation-financiere" && (
//             <section className="module-panel">
//               <div className="module-toolbar">
//                 <div className="module-heading">
//                   <span className="dashboard-eyebrow">
//                     CONSULTATION FINANCIÈRE
//                   </span>

//                   <h2 className="module-title">
//                     Situation financière
//                   </h2>

//                   <p className="module-description">
//                     Consultation des situations financières des promotions
//                     et des étudiants.
//                   </p>
//                 </div>

//                 <button
//                   type="button"
//                   className="back-btn"
//                   onClick={() => setActiveView(null)}
//                 >
//                   <span aria-hidden="true">←</span>
//                   Retour à l'accueil
//                 </button>
//               </div>

//               <div className="module-divider" />

//               <div className="comptable-module-content">
//                 <div className="coming-soon">
//                   <div
//                     className="coming-soon-icon"
//                     aria-hidden="true"
//                   >
//                     …
//                   </div>

//                   <span className="dashboard-eyebrow">
//                     FONCTIONNALITÉ EN PRÉPARATION
//                   </span>

//                   <h3>
//                     Situation financière
//                   </h3>

//                   <p>
//                     Cette fonctionnalité permettra de consulter et
//                     d’imprimer les situations financières des promotions
//                     et des étudiants.
//                   </p>
//                 </div>
//               </div>
//             </section>
//           )}
//         </main>
//       </div>


//       {/* ======================================================
//           PIED DE PAGE
//       ====================================================== */}

//       <footer className="dashboard-footer">
//         <div className="footer-center">
//           <span className="footer-status-dot" />

//           <span>
//             Plateforme académique intelligente et sécurisée
//           </span>
//         </div>

//         {infoUser && (
//           <div className="footer-user-card">
//             <div className="footer-avatar">
//               {infoUser.nom
//                 ?.trim()
//                 .split(/\s+/)
//                 .filter(Boolean)
//                 .map((word) => word[0])
//                 .join("")
//                 .substring(0, 2)
//                 .toUpperCase() || "U"}
//             </div>

//             <div className="footer-user-info">
//               <div className="footer-user-name">
//                 {infoUser.nom || "Utilisateur"}
//               </div>

//               <div className="footer-user-detail">
//                 {infoUser.code_faculte ||
//                   infoUser.nom_fac ||
//                   "Établissement non renseigné"}
//               </div>

//               <div className="footer-role-row">
//                 <label
//                   className="role-label"
//                   htmlFor="comptable-role"
//                 >
//                   Profil
//                 </label>

//                 <select
//                   id="comptable-role"
//                   value={infoUser.active_role || ""}
//                   onChange={handleSwitchRole}
//                   disabled={
//                     switchingRole ||
//                     !infoUser.roles ||
//                     infoUser.roles.length <= 1
//                   }
//                   aria-label="Changer de profil"
//                 >
//                   {infoUser.roles?.map((role) => (
//                     <option key={role} value={role}>
//                       {ROLE_LABELS[role] || role}
//                     </option>
//                   ))}
//                 </select>

//                 {switchingRole && (
//                   <span className="role-loading" aria-live="polite">
//                     ...
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div> 
//         )}
//       </footer>
//     </div>
//   );
// };

// export default Comptable;



import React, { useState, useEffect } from "react";

import {
  isAuthenticated,
  logout,
  switchRole,
} from "../accueils/serviceAuth";

import { getMediaUrl } from "../accueils/apiService";

import "./Comptable.css";

import EnregistrementPaiementsFrais from "./paiementsFrais/EnregistrementPaiementsFrais";

// Conservé pour l'activation future de cette fonctionnalité.
import SituationsFinancieres from "./situationsFinancieres/SituationsFinancieres";

import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";

import {
  ROLE_LABELS,
  isValidRole,
} from "../accueils/roles";

// ============================================================
// MENUS COMPTABLE
// ============================================================

const menusComptable = [
  {
    title: "Gestion des paiements",
    subMenus: [
      "Enregistrer les paiements des frais",
    ],
  },
  {
    title: "Situation financière",
    subMenus: [
      "Situation financière d'une promotion ou d'un étudiant",
    ],
  },
];

// ============================================================
// CORRESPONDANCE DES VUES
// ============================================================

const viewBySubMenu = {
  "Enregistrer les paiements des frais": "paiements-frais",

  "Situation financière d'une promotion ou d'un étudiant":
    "situation-financiere",
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

const Comptable = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeView, setActiveView] = useState(null);
  const [infoUser, setInfoUser] = useState(null);
  const [switchingRole, setSwitchingRole] = useState(false);

  const { infoUniv } = useContextUniv();

  const primaryColor = infoUniv?.primaryColor || "#2563eb";
  const secondaryColor = infoUniv?.secondaryColor || "#f97316";

  // Même mécanisme de récupération du logo que dans le composant SGA.
  const logoUrl = getMediaUrl(infoUniv?.logoUniversity);

  const universityName =
    infoUniv?.nameUniversity || "Academic Platform";

  const activeViewTitle = Object.entries(viewBySubMenu).find(
    ([, view]) => view === activeView
  )?.[0];

  // ============================================================
  // DÉCONNEXION
  // ============================================================

  const handleQuit = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      window.location.replace("/home");
    }
  };

  // ============================================================
  // CHARGEMENT ET AUTHENTIFICATION DE L'UTILISATEUR
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        const auth = await isAuthenticated();

        if (cancelled) return;

        if (!auth?.authenticated) {
          window.location.replace("/home");
          return;
        }

        setInfoUser(auth.user || null);
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Erreur lors de la récupération de l'utilisateur :",
            error
          );

          window.location.replace("/home");
        }
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // CHANGEMENT DE PROFIL ACTIF
  // ============================================================

  const handleSwitchRole = async (event) => {
    const role = event.target.value;

    if (
      !role ||
      role === infoUser?.active_role ||
      switchingRole
    ) {
      return;
    }

    if (!isValidRole(role)) {
      console.error("Rôle invalide demandé :", role);
      window.alert("Le profil demandé est invalide.");
      return;
    }

    setSwitchingRole(true);

    try {
      const result = await switchRole(role);

      if (!result?.success) {
        window.alert(
          result?.message || "Impossible de changer de profil."
        );
        return;
      }

      // Le backend a actualisé le profil actif.
      // On recharge l'application pour récupérer la nouvelle session.
      window.location.replace("/");
    } catch (error) {
      console.error("Erreur lors du changement de profil :", error);

      window.alert(
        error?.message || "Impossible de changer de profil."
      );
    } finally {
      setSwitchingRole(false);
    }
  };

  // ============================================================
  // OUVERTURE / FERMETURE DES MENUS
  // ============================================================

  const toggleMenu = (menuId) => {
    setActiveMenu((current) =>
      current === menuId ? null : menuId
    );
  };

  // ============================================================
  // SÉLECTION D'UNE ACTION
  // ============================================================

  const handleSubMenuClick = (title) => {
    const nextView = viewBySubMenu[title];

    if (!nextView) {
      console.warn("Aucune vue associée à cette action :", title);
      return;
    }

    setActiveView(nextView);
  };

  // ============================================================
  // RENDU
  // ============================================================

  return (
    <div
      className="comptable-dashboard"
      style={{
        "--univ-primary": primaryColor,
        "--univ-secondary": secondaryColor,
      }}
    >
      {/* ======================================================
          EN-TÊTE
      ====================================================== */}

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
              Administration financière
            </span>

            <div className="university-meta">
              <span className="university-meta-dot" />
              <span>Espace comptable</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="quit-btn"
          onClick={handleQuit}
        >
          <span className="quit-btn-icon" aria-hidden="true">
            ↗
          </span>

          <span>Quitter</span>
        </button>
      </header>

      {/* ======================================================
          CORPS DU DASHBOARD
      ====================================================== */}

      <div className="dashboard-body">
        {/* ====================================================
            BARRE LATÉRALE
        ==================================================== */}

        <aside className="sidebar">
          <div className="sidebar-heading">
            <span className="sidebar-heading-label">
              ESPACE DE TRAVAIL
            </span>

            <h2>Gestion financière</h2>

            <p>
              Enregistrez les paiements et accédez aux opérations
              financières disponibles.
            </p>
          </div>

          <section className="menu-card">
            <div className="menu-card-header">
              <span className="menu-card-indicator payments" />

              <div>
                <h3 className="menu-card-title">
                  Opérations financières
                </h3>

                <p className="menu-card-desc">
                  Gestion des paiements et consultation financière.
                </p>
              </div>
            </div>

            <div className="menu-list">
              {menusComptable.map((item, index) => {
                const isOpen = activeMenu === index;
                const isActive = item.subMenus.includes(activeViewTitle);

                return (
                  <div
                    key={item.title}
                    className={`menu-item ${
                      isOpen ? "menu-item-open" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className={`menu-title ${
                        isActive ? "menu-title-active" : ""
                      }`}
                      onClick={() => toggleMenu(index)}
                      aria-expanded={isOpen}
                    >
                      <span className="menu-title-text">
                        {item.title}
                      </span>

                      <span
                        className={`menu-chevron ${
                          isOpen ? "menu-chevron-open" : ""
                        }`}
                        aria-hidden="true"
                      >
                        ▾
                      </span>
                    </button>

                    {isOpen && (
                      <ul className="sub-menu">
                        {item.subMenus.map((sub) => (
                          <li key={sub}>
                            <button
                              type="button"
                              className={`sub-menu-item ${
                                activeViewTitle === sub
                                  ? "sub-menu-item-active"
                                  : ""
                              }`}
                              onClick={() => handleSubMenuClick(sub)}
                            >
                              <span className="sub-menu-dot" />
                              <span>{sub}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="sidebar-footer-note">
            <span className="sidebar-footer-dot" />
            <span>Espace de gestion sécurisé</span>
          </div>
        </aside>

        {/* ====================================================
            CONTENU PRINCIPAL
        ==================================================== */}

        <main className="dashboard-content">
          {activeView === null && (
            <section className="welcome-panel">
              <div className="welcome-panel-top">
                <div>
                  <span className="dashboard-eyebrow">
                    ESPACE COMPTABLE
                  </span>

                  <h2 className="dashboard-title">
                    Bienvenue dans votre espace financier
                  </h2>

                  <p className="dashboard-description">
                    Sélectionnez une opération dans le menu latéral
                    pour gérer les paiements des frais académiques.
                  </p>
                </div>

                <div className="welcome-mark" aria-hidden="true">
                  <span>FC</span>
                </div>
              </div>

              <div className="welcome-divider" />

              <div className="welcome-info-grid">
                <div className="welcome-info-card">
                  <span className="welcome-info-label">
                    UTILISATEUR
                  </span>

                  <strong>
                    {infoUser?.nom || "Non renseigné"}
                  </strong>

                  <span className="welcome-info-description">
                    Compte connecté
                  </span>
                </div>

                <div className="welcome-info-card">
                  <span className="welcome-info-label">
                    ÉTABLISSEMENT
                  </span>

                  <strong>
                    {infoUser?.code_faculte ||
                      infoUser?.nom_fac ||
                      "Non renseigné"}
                  </strong>

                  <span className="welcome-info-description">
                    Affectation du compte
                  </span>
                </div>

                <div className="welcome-info-card">
                  <span className="welcome-info-label">
                    PROFIL ACTIF
                  </span>

                  <strong>
                    {ROLE_LABELS[infoUser?.active_role] ||
                      infoUser?.active_role ||
                      "Comptable"}
                  </strong>

                  <span className="welcome-info-description">
                    Accès comptable
                  </span>
                </div>
              </div>

              <div className="welcome-instruction">
                <span
                  className="welcome-instruction-icon"
                  aria-hidden="true"
                >
                  i
                </span>

                <p>
                  Utilisez « Gestion des paiements » pour enregistrer
                  les frais. La consultation des situations financières
                  sera disponible lorsque cette fonctionnalité sera activée.
                </p>
              </div>
            </section>
          )}

          {/* ==================================================
              ENREGISTREMENT DES PAIEMENTS
          ================================================== */}

          {activeView === "paiements-frais" && (
            <section className="module-panel">
              <div className="module-toolbar">
                <div className="module-heading">
                  <span className="dashboard-eyebrow">
                    GESTION FINANCIÈRE
                  </span>

                  <h2 className="module-title">
                    Enregistrement des paiements
                  </h2>

                  <p className="module-description">
                    Enregistrement des paiements des frais académiques.
                  </p>
                </div>

                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setActiveView(null)}
                >
                  <span aria-hidden="true">←</span>
                  Retour à l'accueil
                </button>
              </div>

              <div className="module-divider" />

              <div className="comptable-module-content">
                <EnregistrementPaiementsFrais />
              </div>
            </section>
          )}

          {/* ==================================================
              SITUATION FINANCIÈRE
          ================================================== */}

          {activeView === "situation-financiere" && (
            <section className="module-panel">
              <div className="module-toolbar">
                <div className="module-heading">
                  <span className="dashboard-eyebrow">
                    CONSULTATION FINANCIÈRE
                  </span>

                  <h2 className="module-title">
                    Situation financière
                  </h2>

                  <p className="module-description">
                    Consultation des situations financières des promotions
                    et des étudiants.
                  </p>
                </div>

                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setActiveView(null)}
                >
                  <span aria-hidden="true">←</span>
                  Retour à l'accueil
                </button>
              </div>

              <div className="module-divider" />

              <div className="comptable-module-content">
                <div className="coming-soon">
                  <div
                    className="coming-soon-icon"
                    aria-hidden="true"
                  >
                    …
                  </div>

                  <span className="dashboard-eyebrow">
                    FONCTIONNALITÉ EN PRÉPARATION
                  </span>

                  <h3>
                    Situation financière
                  </h3>

                  <p>
                    Cette fonctionnalité permettra de consulter et
                    d’imprimer les situations financières des promotions
                    et des étudiants.
                  </p>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ======================================================
          PIED DE PAGE
      ====================================================== */}

      <footer className="dashboard-footer">
        <div className="footer-center">
          <span className="footer-status-dot" />

          <span>
            Plateforme académique intelligente et sécurisée
          </span>
        </div>

        {infoUser && (
          <div className="footer-user-card">
            <div className="footer-avatar">
              {infoUser.nom
                ?.trim()
                .split(/\s+/)
                .filter(Boolean)
                .map((word) => word[0])
                .join("")
                .substring(0, 2)
                .toUpperCase() || "U"}
            </div>

            <div className="footer-user-info">
              <div className="footer-user-name">
                {infoUser.nom || "Utilisateur"}
              </div>

              <div className="footer-user-detail">
                {infoUser.code_faculte ||
                  infoUser.nom_fac ||
                  "Établissement non renseigné"}
              </div>

              <div className="footer-role-row">
                <label
                  className="role-label"
                  htmlFor="comptable-role"
                >
                  Profil
                </label>

                <select
                  id="comptable-role"
                  value={infoUser.active_role || ""}
                  onChange={handleSwitchRole}
                  disabled={
                    switchingRole ||
                    !infoUser.roles ||
                    infoUser.roles.length <= 1
                  }
                  aria-label="Changer de profil"
                >
                  {infoUser.roles?.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role] || role}
                    </option>
                  ))}
                </select>

                {switchingRole && (
                  <span className="role-loading" aria-live="polite">
                    ...
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};

export default Comptable;