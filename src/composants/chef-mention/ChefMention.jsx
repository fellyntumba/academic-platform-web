import React, { useEffect, useState } from "react";

import "./ChefMention.css";

import {
  isAuthenticated,
  logout,
  switchRole,
} from "../accueils/serviceAuth";

import { getMediaUrl } from "../accueils/apiService";

import { getAnneeAcademiqueEnCoursService } from "./chefMentionService";

import MentionAnnee from "./MentionAnnee/MentionAnnee";
import PromotionAnnee from "./PromotionAnnee/PromotionAnnee";
import Promotions from "./Promotions/Promotions";
import ParcoursAnnee from "./ParcoursAnnee/ParcoursAnnee";
import Parcours from "./Parcours/Parcours";
import AffecterCours from "./AffecterCours/AffecterCours";
import ListeCoursEnseignants from "./ListeCoursEnseignants/ListeCoursEnseignants";
import SuiviEnvoiNotes from "./SuiviEnvoiNotes/SuiviEnvoiNotes";
import PeriodeRecours from "./PeriodeRecours/PeriodeRecours";
import StatsReussitePromotion from "./StatsReussitePromotion/StatsReussitePromotion";
import CreateSession from "./createSession/createSession";
import EtudiantsInscrits from "./EtudiantsInscrits/EtudiantsInscrits";
import SuiviRecours from "./SuiviRecours/SuiviRecours";
import CreateUE from "./CreateUE/CreateUE";
import FixationFraisAcademiques from "./fixationFrais/FixationFraisAcademiques";
import RessourcesAcces from "./RessourcesAcces/RessourcesAcces";
import Communique from "./Communique/Communique";
import ModelesDocuments from "./ModelesDocuments/ModelesDocuments";
import ListeFraisAcademiques from "./ListeFraisAcademiques/ListeFraisAcademiques";
import ListeRessourcesAcces from "./ListeRessourcesAcces/ListeRessourcesAcces";


import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";

import {
  ROLE_LABELS,
  isValidRole,
} from "../accueils/roles"; 
 
// ============================================================================
// MENUS — LOGIQUE MÉTIER CONSERVÉE
// ============================================================================
 
const menuItems = [
  {
    title: "Gestion de la mention-année",
    subMenus: ["Créer / Modifier la mention-année"],
  },
  {
    title: "Gestion des parcours",
    subMenus: ["Créer / Modifier un parcours"],
  },
  {
    title: "Gestion des parcours-année",
    subMenus: ["Créer / Modifier un parcours-année"],
  },
  {
    title: "Gestion des promotions",
    subMenus: ["Créer / Modifier les promotions"],
  },
  {
    title: "Gestion des promotions-année",
    subMenus: ["Créer / Modifier une promotions-année"],
  },
  {
    title: "Gestion des cours",
    subMenus: [
      "Créer / Modifier / Supprimer les unités d'enseignement",
      "Affecter les cours",
      "Voir liste enseignants et ses cours",
    ],
  },
  {
    title: "Gestion des étudiants",
    subMenus: [
      "Enregistrer étudiants régulièrement inscrits",
    ],
  },
  {
    title: "Gestion des sessions",
    subMenus: ["Lancer les sessions"],
  },
  {
    title: "Gestion des notes",
    subMenus: ["Suivre les notes envoyées/Pub des resultats"],
  },
  {
    title: "Gestion des ressources",
    subMenus: [
      "Créer / Modifier une ressource",
      "Voir la liste des ressources créées"
    ],
  },
  {
    title: "Gestion des recours",
    subMenus: [ 
      "Lancer période d'envoi des recours",
      "Suivre les recours envoyés",
    ],
  },
  {
    title: "Statistiques",
    subMenus: ["Taux de réussite / échec par promotion"],
  },
  {
    title: "Gestion des frais académiques",
    subMenus: [
      "Fixer les frais académiques",
      "Voir la liste des frais fixés"
    ],
  },
  {
    title: "Gestion des communiqués",
    subMenus: ["Créer / Publier un communiqué"],
  },

  // NOUVEAU MENU : MODÈLES DE DOCUMENTS
  {
    title: "Gestion des modèles de documents",
    subMenus: [
      "Configurer les modèles de documents de l'année",
    ],
  },
];

// Correspondance entre les sous-menus et les vues.
// Les identifiants des vues existantes restent inchangés.
const viewBySubMenu = {
  "Créer / Modifier la mention-année": "mention-année",
  "Créer / Modifier un parcours": "parcours",
  "Créer / Modifier un parcours-année": "parcours-année",
  "Créer / Modifier les promotions": "promotions",
  "Créer / Modifier une promotions-année": "promotions-année",
  "Créer / Modifier / Supprimer les unités d'enseignement":
    "unites-ens",
  "Affecter les cours": "affecter-cours",
  "Voir liste enseignants et ses cours": "liste-cours-enseignants",
  "Enregistrer étudiants régulièrement inscrits":
    "enregistrer-etudiants-inscrits",
  "Suivre les notes envoyées/Pub des resultats": "suivi-notes",
  "Lancer période d'envoi des recours": "periode-recour",
  "Suivre les recours envoyés": "suivi-recours",
  "Taux de réussite / échec par promotion": "statistiques",
  "Lancer les sessions": "sessions",
  "Fixer les frais académiques": "fixer-frais-academiques",
  "Voir la liste des frais fixés": "liste-des-frais",
  "Créer / Modifier une ressource": "ressource",
  "Voir la liste des ressources créées":"liste-des-ressources",
  "Créer / Publier un communiqué": "communique",
  "Configurer les modèles de documents de l'année": "modeles-documents",
};

const configurationInitiale = [1, 3];

const configurationAnnuelle = [
  0, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
  14, // Gestion des modèles de documents
];

// ============================================================================
// COMPOSANT CHEF DE MENTION
// ============================================================================

const ChefMention = () => {
  // --------------------------------------------------------------------------
  // ÉTATS
  // --------------------------------------------------------------------------

  const [activeMenu, setActiveMenu] = useState(null);
  const [activeView, setActiveView] = useState(null);
  const [infoUser, setInfoUser] = useState(null);
  const [annee, setAnnee] = useState("");
  const [switchingRole, setSwitchingRole] = useState(false);

  // --------------------------------------------------------------------------
  // CONTEXTE UNIVERSITÉ
  // --------------------------------------------------------------------------

  const { infoUniv } = useContextUniv();

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
  // CHARGEMENT DE L'ANNÉE ACADÉMIQUE
  // --------------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadAnnee = async () => {
      try {
        const result =
          await getAnneeAcademiqueEnCoursService();

        if (cancelled) return;

        if (!result?.data?.libelle) {
          setAnnee("");

          window.alert(
            "Aucune année académique en cours."
          );

          return;
        }

        setAnnee(result.data.libelle);
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Erreur de chargement de l'année académique :",
          error
        );

        setAnnee("");

        window.alert(
          error?.message ||
            "Impossible de récupérer l'année académique en cours."
        );
      }
    };

    loadAnnee();

    return () => {
      cancelled = true;
    };
  }, []);

  // --------------------------------------------------------------------------
  // AUTHENTIFICATION ET RÉCUPÉRATION DE L'UTILISATEUR
  // --------------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        const auth = await isAuthenticated();

        if (cancelled) return;

        if (!auth?.authenticated || !auth?.user) {
          window.location.replace("/home");
          return;
        }

        setInfoUser(auth.user);
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error
        );

        window.location.replace("/home");
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  // --------------------------------------------------------------------------
  // CHANGEMENT DU PROFIL ACTIF
  // --------------------------------------------------------------------------

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
      window.alert("Profil sélectionné invalide.");
      return;
    }

    setSwitchingRole(true);

    try {
      const result = await switchRole(role);

      if (!result?.success) {
        window.alert(
          result?.message ||
            "Impossible de changer de profil."
        );

        return;
      }

      window.location.replace("/");
    } catch (error) {
      console.error(
        "Erreur lors du changement de profil :",
        error
      );

      window.alert(
        error?.message ||
          "Impossible de changer de profil."
      );
    } finally {
      setSwitchingRole(false);
    }
  };

  // --------------------------------------------------------------------------
  // OUVERTURE / FERMETURE DES MENUS
  // --------------------------------------------------------------------------

  const toggleMenu = (index) => {
    setActiveMenu((current) =>
      current === index ? null : index
    );
  };

  // --------------------------------------------------------------------------
  // SÉLECTION D'UNE ACTION
  // --------------------------------------------------------------------------

  const handleSubMenuClick = (title) => {
    const nextView = viewBySubMenu[title];

    if (!nextView) {
      console.warn(
        "Aucune vue associée à cette action :",
        title
      );

      return;
    }

    setActiveView(nextView);
  };

  // --------------------------------------------------------------------------
  // TITRE DE LA VUE ACTIVE
  // --------------------------------------------------------------------------

  const activeViewTitle = Object.entries(
    viewBySubMenu
  ).find(([, view]) => view === activeView)?.[0];

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
      .toUpperCase() || "CM";

  // --------------------------------------------------------------------------
  // RENDU
  // --------------------------------------------------------------------------

  return (
    <div
      className="chef-mention-dashboard"
      style={{
        "--univ-primary": primaryColor,
        "--univ-secondary": secondaryColor,
      }}
    >
      {/* ====================================================================
          EN-TÊTE
      ==================================================================== */}

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
              Administration académique
            </span>

            <div className="university-meta">
              <span>ESPACE ACADÉMIQUE</span>

              {infoUser?.code_mention && (
                <>
                  <span className="meta-separator">|</span>
                  <span>{infoUser.code_mention}</span>
                </>
              )}

              {annee && (
                <>
                  <span className="meta-separator">|</span>
                  <span>{annee}</span>
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

      {/* ====================================================================
          CORPS PRINCIPAL
      ==================================================================== */}

      <div className="dashboard-body">
        {/* ==================================================================
            SIDEBAR
        ================================================================== */}

        <nav
          className="sidebar"
          aria-label="Navigation de la mention"
        >
          {/* CONFIGURATION INITIALE */}

          <section className="menu-card">
            <div className="menu-card-header">
              Configuration initiale
            </div>

            <p className="menu-card-desc">
              Configurez les parcours et les promotions.
            </p>

            <div className="menu-list">
              {configurationInitiale.map((index) => {
                const item = menuItems[index];
                const isOpen = activeMenu === index;
                const isActive =
                  item.subMenus.includes(activeViewTitle);

                return (
                  <div
                    key={item.title}
                    className={`menu-item ${
                      isOpen ? "menu-item-open" : ""
                    } ${
                      isActive ? "menu-item-active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="menu-title"
                      onClick={() => toggleMenu(index)}
                      aria-expanded={isOpen}
                    >
                      <span className="menu-title-text">
                        {item.title}
                      </span>

                      <span
                        className="menu-arrow"
                        aria-hidden="true"
                      >
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {isOpen && (
                      <ul className="sub-menu">
                        {item.subMenus.map((sub) => (
                          <li
                            key={sub}
                            className={`sub-menu-item ${
                              activeViewTitle === sub
                                ? "sub-menu-item-active"
                                : ""
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleSubMenuClick(sub)
                              }
                            >
                              {sub}
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

          {/* CONFIGURATION ANNUELLE */}

          <section className="menu-card">
            <div className="menu-card-header">
              Configuration annuelle
            </div>

            <p className="menu-card-desc">
              Gérez les activités et paramètres de l'année académique.
            </p>

            <div className="menu-list">
              {configurationAnnuelle.map((index) => {
                const item = menuItems[index];
                const isOpen = activeMenu === index;
                const isActive =
                  item.subMenus.includes(activeViewTitle);

                return (
                  <div
                    key={item.title}
                    className={`menu-item ${
                      isOpen ? "menu-item-open" : ""
                    } ${
                      isActive ? "menu-item-active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="menu-title"
                      onClick={() => toggleMenu(index)}
                      aria-expanded={isOpen}
                    >
                      <span className="menu-title-text">
                        {item.title}
                      </span>

                      <span
                        className="menu-arrow"
                        aria-hidden="true"
                      >
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {isOpen && (
                      <ul className="sub-menu">
                        {item.subMenus.map((sub) => (
                          <li
                            key={sub}
                            className={`sub-menu-item ${
                              activeViewTitle === sub
                                ? "sub-menu-item-active"
                                : ""
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleSubMenuClick(sub)
                              }
                            >
                              {sub}
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
        </nav>

        {/* ==================================================================
            CONTENU PRINCIPAL
        ================================================================== */}

        <main className="dashboard-content">
          {/* ACCUEIL */}

          {activeView === null && (
            <section className="dashboard-welcome">
              <div className="dashboard-welcome-accent" />

              <span className="dashboard-eyebrow">
                ADMINISTRATION DE MENTION
              </span>

              <h2>
                {infoUser?.code_mention ||
                  "Espace chef de mention"}
              </h2>

              <p>
                Sélectionnez une fonctionnalité dans le menu
                pour gérer les parcours, les promotions, les cours,
                les étudiants et les activités académiques de votre
                mention.
              </p>
            </section>
          )}

          {/* MODULE ACTIF */}

          {activeView !== null && (
            <section className="chef-mention-module">
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
                {/* SESSIONS */}

                {activeView === "sessions" && (
                  <CreateSession
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* UNITÉS D'ENSEIGNEMENT */}

                {activeView === "unites-ens" && (
                  <CreateUE
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* AFFECTATION DES COURS */}

                {activeView === "affecter-cours" && (
                  <AffecterCours
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* LISTE DES ENSEIGNANTS ET DES COURS */}

                {activeView === "liste-cours-enseignants" && (
                  <ListeCoursEnseignants
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* ÉTUDIANTS INSCRITS */}

                {activeView === "enregistrer-etudiants-inscrits" && (
                  <EtudiantsInscrits
                    code_mention={infoUser?.code_mention}
                  />
                )}


                {/* SUIVI DES NOTES */}

                {activeView === "suivi-notes" && (
                  <SuiviEnvoiNotes
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* PÉRIODE DES RECOURS */}

                {activeView === "periode-recour" && (
                  <PeriodeRecours
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* SUIVI DES RECOURS */}

                {activeView === "suivi-recours" && (
                  <SuiviRecours
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* STATISTIQUES */}

                {activeView === "statistiques" && (
                  <StatsReussitePromotion
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* MENTION-ANNÉE */}

                {activeView === "mention-année" && (
                  <MentionAnnee
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* PARCOURS */}

                {activeView === "parcours" && (
                  <Parcours
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* PARCOURS-ANNÉE */}

                {activeView === "parcours-année" && (
                  <ParcoursAnnee
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* PROMOTIONS */}

                {activeView === "promotions" && (
                  <Promotions
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* PROMOTIONS-ANNÉE */}

                {activeView === "promotions-année" && (
                  <PromotionAnnee
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* FRAIS ACADÉMIQUES */}

                {activeView === "fixer-frais-academiques" && (
                  <FixationFraisAcademiques
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {activeView === "liste-des-frais" && (
                  <ListeFraisAcademiques
                    code_mention={infoUser?.code_mention}
                    annee={annee}
                  />
                )}

                {/* RESSOURCES */}

                {activeView === "ressource" && (
                  <RessourcesAcces
                    code_mention={infoUser?.code_mention}
                    annee={annee}
                  />
                )}

                {activeView === "liste-des-ressources" && (
                  <ListeRessourcesAcces
                    code_mention={infoUser?.code_mention}
                  />
                )}

                {/* COMMUNIQUÉS */}

                {activeView === "communique" && (
                  <Communique
                    code_mention={infoUser?.code_mention}
                  />
                )}

              
                {activeView === "modeles-documents" && (
                 <ModelesDocuments code_mention={infoUser?.code_mention}/>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ====================================================================
          PIED DE PAGE
      ==================================================================== */}

      <footer className="dashboard-footer">
        <div className="footer-center">
          Plateforme académique intelligente et sécurisée
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
                <label
                  className="role-label"
                  htmlFor="chef-mention-role"
                >
                  Profil :
                </label>

                <select
                  id="chef-mention-role"
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

export default ChefMention;









// import React, { useEffect, useState } from "react";

// import "./ChefMention.css";

// import {
//   isAuthenticated,
//   logout,
//   switchRole,
// } from "../accueils/serviceAuth";

// import { getMediaUrl } from "../accueils/apiService";

// import { getAnneeAcademiqueEnCoursService } from "./chefMentionService";

// import MentionAnnee from "./MentionAnnee/MentionAnnee";
// import PromotionAnnee from "./PromotionAnnee/PromotionAnnee";
// import Promotions from "./Promotions/Promotions";
// import ParcoursAnnee from "./ParcoursAnnee/ParcoursAnnee";
// import Parcours from "./Parcours/Parcours";
// import AffecterCours from "./AffecterCours/AffecterCours";
// import ListeCoursEnseignants from "./ListeCoursEnseignants/ListeCoursEnseignants";
// import SuiviEnvoiNotes from "./SuiviEnvoiNotes/SuiviEnvoiNotes";
// import PeriodeRecours from "./PeriodeRecours/PeriodeRecours";
// import StatsReussitePromotion from "./StatsReussitePromotion/StatsReussitePromotion";
// import CreateSession from "./createSession/createSession";
// import EtudiantsInscrits from "./EtudiantsInscrits/EtudiantsInscrits";
// import SuiviRecours from "./SuiviRecours/SuiviRecours";
// import CreateUE from "./CreateUE/CreateUE";
// import FixationFraisAcademiques from "./fixationFrais/FixationFraisAcademiques";
// import RessourcesAcces from "./RessourcesAcces/RessourcesAcces";
// import Communique from "./Communique/Communique";
// import ModelesDocuments from "./ModelesDocuments/ModelesDocuments";


// import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";

// import {
//   ROLE_LABELS,
//   isValidRole,
// } from "../accueils/roles";

// // ============================================================================
// // MENUS — LOGIQUE MÉTIER CONSERVÉE
// // ============================================================================

// const menuItems = [
//   {
//     title: "Gestion de la mention-année",
//     subMenus: ["Créer / Modifier la mention-année"],
//   },
//   {
//     title: "Gestion des parcours",
//     subMenus: ["Créer / Modifier un parcours"],
//   },
//   {
//     title: "Gestion des parcours-année",
//     subMenus: ["Créer / Modifier un parcours-année"],
//   },
//   {
//     title: "Gestion des promotions",
//     subMenus: ["Créer / Modifier les promotions"],
//   },
//   {
//     title: "Gestion des promotions-année",
//     subMenus: ["Créer / Modifier une promotions-année"],
//   },
//   {
//     title: "Gestion des cours",
//     subMenus: [
//       "Créer / Modifier / Supprimer les unités d'enseignement",
//       "Affecter les cours",
//       "Voir liste enseignants et ses cours",
//     ],
//   },
//   {
//     title: "Gestion des étudiants",
//     subMenus: [
//       "Enregistrer étudiants régulièrement inscrits",
//     ],
//   },
//   {
//     title: "Gestion des sessions",
//     subMenus: ["Lancer les sessions"],
//   },
//   {
//     title: "Gestion des notes",
//     subMenus: ["Suivre les notes envoyées/Pub des resultats"],
//   },
//   {
//     title: "Gestion des ressources",
//     subMenus: ["Créer / Modifier une ressource"],
//   },
//   {
//     title: "Gestion des recours",
//     subMenus: [
//       "Lancer période d'envoi des recours",
//       "Suivre les recours envoyés",
//     ],
//   },
//   {
//     title: "Statistiques",
//     subMenus: ["Taux de réussite / échec par promotion"],
//   },
//   {
//     title: "Gestion des frais académiques",
//     subMenus: ["Fixer les frais académiques"],
//   },
//   {
//     title: "Gestion des communiqués",
//     subMenus: ["Créer / Publier un communiqué"],
//   },

//   // NOUVEAU MENU : MODÈLES DE DOCUMENTS
//   {
//     title: "Gestion des modèles de documents",
//     subMenus: [
//       "Configurer les modèles de documents de l'année",
//     ],
//   },
// ];

// // Correspondance entre les sous-menus et les vues.
// // Les identifiants des vues existantes restent inchangés.
// const viewBySubMenu = {
//   "Créer / Modifier la mention-année": "mention-année",
//   "Créer / Modifier un parcours": "parcours",
//   "Créer / Modifier un parcours-année": "parcours-année",
//   "Créer / Modifier les promotions": "promotions",
//   "Créer / Modifier une promotions-année": "promotions-année",
//   "Créer / Modifier / Supprimer les unités d'enseignement":
//     "unites-ens",
//   "Affecter les cours": "affecter-cours",
//   "Voir liste enseignants et ses cours": "liste-cours-enseignants",
//   "Enregistrer étudiants régulièrement inscrits":
//     "enregistrer-etudiants-inscrits",
//   "Suivre les notes envoyées/Pub des resultats": "suivi-notes",
//   "Lancer période d'envoi des recours": "periode-recour",
//   "Suivre les recours envoyés": "suivi-recours",
//   "Taux de réussite / échec par promotion": "statistiques",
//   "Lancer les sessions": "sessions",
//   "Fixer les frais académiques": "fixer-frais-academiques",
//   "Créer / Modifier une ressource": "ressource",
//   "Créer / Publier un communiqué": "communique",
//   "Configurer les modèles de documents de l'année":
//     "modeles-documents",
// };

// const configurationInitiale = [1, 3];

// const configurationAnnuelle = [
//   0, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
//   14, // Gestion des modèles de documents
// ];

// // ============================================================================
// // COMPOSANT CHEF DE MENTION
// // ============================================================================

// const ChefMention = () => {
//   // --------------------------------------------------------------------------
//   // ÉTATS
//   // --------------------------------------------------------------------------

//   const [activeMenu, setActiveMenu] = useState(null);
//   const [activeView, setActiveView] = useState(null);
//   const [infoUser, setInfoUser] = useState(null);
//   const [annee, setAnnee] = useState("");
//   const [switchingRole, setSwitchingRole] = useState(false);

//   // --------------------------------------------------------------------------
//   // CONTEXTE UNIVERSITÉ
//   // --------------------------------------------------------------------------

//   const { infoUniv } = useContextUniv();

//   const universityName =
//     infoUniv?.nameUniversity || "Academic Platform";

//   const primaryColor =
//     infoUniv?.primaryColor || "#2563eb";

//   const secondaryColor =
//     infoUniv?.secondaryColor || "#f97316";

//   const logoUrl = getMediaUrl(infoUniv?.logoUniversity);

//   // --------------------------------------------------------------------------
//   // DÉCONNEXION
//   // --------------------------------------------------------------------------

//   const handleQuit = async () => {
//     try {
//       await logout();
//     } catch (error) {
//       console.error(
//         "Erreur lors de la déconnexion :",
//         error
//       );
//     } finally {
//       window.location.replace("/home");
//     }
//   };

//   // --------------------------------------------------------------------------
//   // CHARGEMENT DE L'ANNÉE ACADÉMIQUE
//   // --------------------------------------------------------------------------

//   useEffect(() => {
//     let cancelled = false;

//     const loadAnnee = async () => {
//       try {
//         const result =
//           await getAnneeAcademiqueEnCoursService();

//         if (cancelled) return;

//         if (!result?.data?.libelle) {
//           setAnnee("");

//           window.alert(
//             "Aucune année académique en cours."
//           );

//           return;
//         }

//         setAnnee(result.data.libelle);
//       } catch (error) {
//         if (cancelled) return;

//         console.error(
//           "Erreur de chargement de l'année académique :",
//           error
//         );

//         setAnnee("");

//         window.alert(
//           error?.message ||
//             "Impossible de récupérer l'année académique en cours."
//         );
//       }
//     };

//     loadAnnee();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // --------------------------------------------------------------------------
//   // AUTHENTIFICATION ET RÉCUPÉRATION DE L'UTILISATEUR
//   // --------------------------------------------------------------------------

//   useEffect(() => {
//     let cancelled = false;

//     const loadUser = async () => {
//       try {
//         const auth = await isAuthenticated();

//         if (cancelled) return;

//         if (!auth?.authenticated || !auth?.user) {
//           window.location.replace("/home");
//           return;
//         }

//         setInfoUser(auth.user);
//       } catch (error) {
//         if (cancelled) return;

//         console.error(
//           "Erreur lors de la récupération de l'utilisateur :",
//           error
//         );

//         window.location.replace("/home");
//       }
//     };

//     loadUser();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // --------------------------------------------------------------------------
//   // CHANGEMENT DU PROFIL ACTIF
//   // --------------------------------------------------------------------------

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
//       window.alert("Profil sélectionné invalide.");
//       return;
//     }

//     setSwitchingRole(true);

//     try {
//       const result = await switchRole(role);

//       if (!result?.success) {
//         window.alert(
//           result?.message ||
//             "Impossible de changer de profil."
//         );

//         return;
//       }

//       window.location.replace("/");
//     } catch (error) {
//       console.error(
//         "Erreur lors du changement de profil :",
//         error
//       );

//       window.alert(
//         error?.message ||
//           "Impossible de changer de profil."
//       );
//     } finally {
//       setSwitchingRole(false);
//     }
//   };

//   // --------------------------------------------------------------------------
//   // OUVERTURE / FERMETURE DES MENUS
//   // --------------------------------------------------------------------------

//   const toggleMenu = (index) => {
//     setActiveMenu((current) =>
//       current === index ? null : index
//     );
//   };

//   // --------------------------------------------------------------------------
//   // SÉLECTION D'UNE ACTION
//   // --------------------------------------------------------------------------

//   const handleSubMenuClick = (title) => {
//     const nextView = viewBySubMenu[title];

//     if (!nextView) {
//       console.warn(
//         "Aucune vue associée à cette action :",
//         title
//       );

//       return;
//     }

//     setActiveView(nextView);
//   };

//   // --------------------------------------------------------------------------
//   // TITRE DE LA VUE ACTIVE
//   // --------------------------------------------------------------------------

//   const activeViewTitle = Object.entries(
//     viewBySubMenu
//   ).find(([, view]) => view === activeView)?.[0];

//   // --------------------------------------------------------------------------
//   // INITIALES UTILISATEUR
//   // --------------------------------------------------------------------------

//   const initials =
//     infoUser?.nom
//       ?.trim()
//       .split(/\s+/)
//       .filter(Boolean)
//       .map((word) => word[0])
//       .join("")
//       .substring(0, 2)
//       .toUpperCase() || "CM";

//   // --------------------------------------------------------------------------
//   // RENDU
//   // --------------------------------------------------------------------------

//   return (
//     <div
//       className="chef-mention-dashboard"
//       style={{
//         "--univ-primary": primaryColor,
//         "--univ-secondary": secondaryColor,
//       }}
//     >
//       {/* ====================================================================
//           EN-TÊTE
//       ==================================================================== */}

//       <header className="home-header">
//         <div className="header-left">
//           <div className="header-logo-container">
//             <img
//               src={logoUrl || "/default-logo.png"}
//               alt={`Logo ${universityName}`}
//               className="logo"
//               onError={(event) => {
//                 event.currentTarget.onerror = null;
//                 event.currentTarget.src = "/default-logo.png";
//               }}
//             />
//           </div>

//           <div className="university-info">
//             <h1>{universityName}</h1>

//             <span className="subtitle">
//               Administration académique
//             </span>

//             <div className="university-meta">
//               <span>ESPACE ACADÉMIQUE</span>

//               {infoUser?.code_mention && (
//                 <>
//                   <span className="meta-separator">|</span>
//                   <span>{infoUser.code_mention}</span>
//                 </>
//               )}

//               {annee && (
//                 <>
//                   <span className="meta-separator">|</span>
//                   <span>{annee}</span>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         <button
//           type="button"
//           className="quit-btn"
//           onClick={handleQuit}
//         >
//           Quitter
//         </button>
//       </header>

//       {/* ====================================================================
//           CORPS PRINCIPAL
//       ==================================================================== */}

//       <div className="dashboard-body">
//         {/* ==================================================================
//             SIDEBAR
//         ================================================================== */}

//         <nav
//           className="sidebar"
//           aria-label="Navigation de la mention"
//         >
//           {/* CONFIGURATION INITIALE */}

//           <section className="menu-card">
//             <div className="menu-card-header">
//               Configuration initiale
//             </div>

//             <p className="menu-card-desc">
//               Configurez les parcours et les promotions.
//             </p>

//             <div className="menu-list">
//               {configurationInitiale.map((index) => {
//                 const item = menuItems[index];
//                 const isOpen = activeMenu === index;
//                 const isActive =
//                   item.subMenus.includes(activeViewTitle);

//                 return (
//                   <div
//                     key={item.title}
//                     className={`menu-item ${
//                       isOpen ? "menu-item-open" : ""
//                     } ${
//                       isActive ? "menu-item-active" : ""
//                     }`}
//                   >
//                     <button
//                       type="button"
//                       className="menu-title"
//                       onClick={() => toggleMenu(index)}
//                       aria-expanded={isOpen}
//                     >
//                       <span className="menu-title-text">
//                         {item.title}
//                       </span>

//                       <span
//                         className="menu-arrow"
//                         aria-hidden="true"
//                       >
//                         {isOpen ? "▲" : "▼"}
//                       </span>
//                     </button>

//                     {isOpen && (
//                       <ul className="sub-menu">
//                         {item.subMenus.map((sub) => (
//                           <li
//                             key={sub}
//                             className={`sub-menu-item ${
//                               activeViewTitle === sub
//                                 ? "sub-menu-item-active"
//                                 : ""
//                             }`}
//                           >
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleSubMenuClick(sub)
//                               }
//                             >
//                               {sub}
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

//           {/* CONFIGURATION ANNUELLE */}

//           <section className="menu-card">
//             <div className="menu-card-header">
//               Configuration annuelle
//             </div>

//             <p className="menu-card-desc">
//               Gérez les activités et paramètres de l'année académique.
//             </p>

//             <div className="menu-list">
//               {configurationAnnuelle.map((index) => {
//                 const item = menuItems[index];
//                 const isOpen = activeMenu === index;
//                 const isActive =
//                   item.subMenus.includes(activeViewTitle);

//                 return (
//                   <div
//                     key={item.title}
//                     className={`menu-item ${
//                       isOpen ? "menu-item-open" : ""
//                     } ${
//                       isActive ? "menu-item-active" : ""
//                     }`}
//                   >
//                     <button
//                       type="button"
//                       className="menu-title"
//                       onClick={() => toggleMenu(index)}
//                       aria-expanded={isOpen}
//                     >
//                       <span className="menu-title-text">
//                         {item.title}
//                       </span>

//                       <span
//                         className="menu-arrow"
//                         aria-hidden="true"
//                       >
//                         {isOpen ? "▲" : "▼"}
//                       </span>
//                     </button>

//                     {isOpen && (
//                       <ul className="sub-menu">
//                         {item.subMenus.map((sub) => (
//                           <li
//                             key={sub}
//                             className={`sub-menu-item ${
//                               activeViewTitle === sub
//                                 ? "sub-menu-item-active"
//                                 : ""
//                             }`}
//                           >
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleSubMenuClick(sub)
//                               }
//                             >
//                               {sub}
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
//         </nav>

//         {/* ==================================================================
//             CONTENU PRINCIPAL
//         ================================================================== */}

//         <main className="dashboard-content">
//           {/* ACCUEIL */}

//           {activeView === null && (
//             <section className="dashboard-welcome">
//               <div className="dashboard-welcome-accent" />

//               <span className="dashboard-eyebrow">
//                 ADMINISTRATION DE MENTION
//               </span>

//               <h2>
//                 {infoUser?.code_mention ||
//                   "Espace chef de mention"}
//               </h2>

//               <p>
//                 Sélectionnez une fonctionnalité dans le menu
//                 pour gérer les parcours, les promotions, les cours,
//                 les étudiants et les activités académiques de votre
//                 mention.
//               </p>
//             </section>
//           )}

//           {/* MODULE ACTIF */}

//           {activeView !== null && (
//             <section className="chef-mention-module">
//               <div className="module-toolbar module-toolbar-compact">
//                 <button
//                   type="button"
//                   className="back-btn"
//                   onClick={() => setActiveView(null)}
//                 >
//                   <span aria-hidden="true">←</span>
//                   Retour
//                 </button>
//               </div>

//               <div className="admin-fac-module-content">
//                 {/* SESSIONS */}

//                 {activeView === "sessions" && (
//                   <CreateSession
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* UNITÉS D'ENSEIGNEMENT */}

//                 {activeView === "unites-ens" && (
//                   <CreateUE
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* AFFECTATION DES COURS */}

//                 {activeView === "affecter-cours" && (
//                   <AffecterCours
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* LISTE DES ENSEIGNANTS ET DES COURS */}

//                 {activeView === "liste-cours-enseignants" && (
//                   <ListeCoursEnseignants
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* ÉTUDIANTS INSCRITS */}

//                 {activeView === "enregistrer-etudiants-inscrits" && (
//                   <EtudiantsInscrits
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* ÉTUDIANTS EN ORDRE */}

//                 {activeView === "enregistrer-etudiants-ordres" && (
//                   <EtudiantsOrdres />
//                 )}

//                 {/* SUIVI DES NOTES */}

//                 {activeView === "suivi-notes" && (
//                   <SuiviEnvoiNotes
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* PÉRIODE DES RECOURS */}

//                 {activeView === "periode-recour" && (
//                   <PeriodeRecours
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* SUIVI DES RECOURS */}

//                 {activeView === "suivi-recours" && (
//                   <SuiviRecours
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* STATISTIQUES */}

//                 {activeView === "statistiques" && (
//                   <StatsReussitePromotion
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* MENTION-ANNÉE */}

//                 {activeView === "mention-année" && (
//                   <MentionAnnee
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* PARCOURS */}

//                 {activeView === "parcours" && (
//                   <Parcours
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* PARCOURS-ANNÉE */}

//                 {activeView === "parcours-année" && (
//                   <ParcoursAnnee
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* PROMOTIONS */}

//                 {activeView === "promotions" && (
//                   <Promotions
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* PROMOTIONS-ANNÉE */}

//                 {activeView === "promotions-année" && (
//                   <PromotionAnnee
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

//                 {/* FRAIS ACADÉMIQUES */}

//                 {activeView === "fixer-frais-academiques" && (
//                   <FixationFraisAcademiques
//                     code_mention={infoUser?.code_mention}
//                     annee={annee}
//                   />
//                 )}

//                 {/* RESSOURCES */}

//                 {activeView === "ressource" && (
//                   <RessourcesAcces
//                     code_mention={infoUser?.code_mention}
//                     annee={annee}
//                   />
//                 )}

//                 {/* COMMUNIQUÉS */}

//                 {activeView === "communique" && (
//                   <Communique
//                     code_mention={infoUser?.code_mention}
//                   />
//                 )}

              
//                 {activeView === "modeles-documents" && (
//                  <ModelesDocuments code_mention={infoUser?.code_mention}/>
//                 )}
//               </div>
//             </section>
//           )}
//         </main>
//       </div>

//       {/* ====================================================================
//           PIED DE PAGE
//       ==================================================================== */}

//       <footer className="dashboard-footer">
//         <div className="footer-center">
//           Plateforme académique intelligente et sécurisée
//         </div>

//         {infoUser && (
//           <div className="footer-user-card">
//             <div className="footer-avatar">
//               {initials}
//             </div>

//             <div className="footer-user-info">
//               <div className="footer-user-name">
//                 {infoUser.nom}
//               </div>

//               <div className="footer-user-detail">
//                 {infoUser.code_faculte && (
//                   <span>{infoUser.code_faculte}</span>
//                 )}

//                 {infoUser.code_mention && (
//                   <>
//                     {infoUser.code_faculte && (
//                       <span>&nbsp; | &nbsp;</span>
//                     )}

//                     <span>{infoUser.code_mention}</span>
//                   </>
//                 )}
//               </div>

//               <div className="footer-role-row">
//                 <label
//                   className="role-label"
//                   htmlFor="chef-mention-role"
//                 >
//                   Profil :
//                 </label>

//                 <select
//                   id="chef-mention-role"
//                   value={infoUser.active_role || ""}
//                   onChange={handleSwitchRole}
//                   disabled={
//                     switchingRole ||
//                     !infoUser.roles ||
//                     infoUser.roles.length <= 1
//                   }
//                   aria-label="Profil actif"
//                 >
//                   {infoUser.roles?.map((role) => (
//                     <option key={role} value={role}>
//                       {ROLE_LABELS[role] || role}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//       </footer>
//     </div>
//   );
// };

// export default ChefMention;


