import React, { useState, useEffect } from "react";

import {
  isAuthenticated,
  logout,
  switchRole,
} from "../accueils/serviceAuth";

import { getMediaUrl } from "../accueils/apiService";
import { ROLE_LABELS, isValidRole } from "../accueils/roles";
import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";

import "./Sga.css";

import CreerModifEns from "./miseAjourEns/CreerModifEns";
import ListeEnseignants from "./listeEnseignants/ListeEnseignants";
import StatsReussiteFaculte from "./statistiques/taux/StatsReussiteFaculte";
import EtudiantsFaculte from "./statistiques/nbreEtud/EtudiantsFaculte";
import FacultesForm from "./fac/FacultesForm";
import ComptableForm from "./miseAjourCptables/ComptableForm";
import AnneeAcademique from "./anneeAcademique/AnneeAcademique";
import SuperAdminManager from "./SuperAdminManager/SuperAdminManager";
import Communique from "./Communique/Communique";
import AdminFacForm from "./miseAjourAdmin/AdminFacForm";

// ============================================================================
// MENUS
// ============================================================================

const menuItems = [
  {
    title: "Gérer Année Académique",
    description: "Ouverture et clôture de l'année académique.",
    subMenus: ["Lancer année / Clôturer année"],
  },
  {
    title: "Gestion des enseignants",
    description: "Comptes et liste des enseignants.",
    subMenus: [
      "Créer / Modifier comptes enseignants",
      "Voir liste enseignants",
    ],
  },
  {
    title: "Gestion Facultés",
    description: "Organisation des facultés.",
    subMenus: ["Créer faculté / Modifier faculté"],
  },
  {
    title: "Gestion Admin. Facultaires",
    description: "Administration des facultés.",
    subMenus: ["Créer / Modifier Admin Fac"],
  },
  {
    title: "Gestion des comptables",
    description: "Gestion des comptes comptables.",
    subMenus: ["Créer / Modifier Comptables"],
  },
  {
    title: "Statistiques",
    description: "Indicateurs de réussite et effectifs.",
    subMenus: [
      "Taux de réussite/échec par faculté",
      "Nombre d'étudiants par faculté",
    ],
  },
  {
    title: "Super Administrateur",
    description: "Gestion des accès super administrateur.",
    subMenus: ["Créer / Désactiver Super Admin"],
  },
  {
    title: "Gestion des communiqués",
    description: "Création et publication des communiqués.",
    subMenus: ["Créer / Publier un communiqué"],
  },
];

// Les menus sont regroupés comme dans l'interface actuelle.
const menuGroups = [
  {
    title: "Configuration initiale",
    description: "Configuration des facultés et des enseignants.",
    menuTitles: ["Gestion Facultés", "Gestion des enseignants"],
  },
  {
    title: "Gestion annuelle & administrateurs",
    description: "Gestion académique et administrative.",
    menuTitles: menuItems
      .map((item) => item.title)
      .filter(
        (title) =>
          title !== "Gestion Facultés" &&
          title !== "Gestion des enseignants"
      ),
  },
];

// ============================================================================
// COMPOSANT SGA
// ============================================================================

const Sga = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeView, setActiveView] = useState(null);
  const [infoUser, setInfoUser] = useState(null);
  const [switchingRole, setSwitchingRole] = useState(false);

  const { infoUniv } = useContextUniv();

  // --------------------------------------------------------------------------
  // CONTEXTE UNIVERSITAIRE
  // --------------------------------------------------------------------------

  const universityName =
    infoUniv?.nameUniversity || "Academic Platform";

  const universitySlogan =
    infoUniv?.slogan ||
    "Plateforme académique intelligente et sécurisée";

  const universityCity = infoUniv?.cityUniversity || "";
  const universityCode = infoUniv?.code || "";

  const primaryColor = infoUniv?.primaryColor || "#2563eb";
  const secondaryColor = infoUniv?.secondaryColor || "#f97316";

  const logoUrl = getMediaUrl(infoUniv?.logoUniversity);
 
  // --------------------------------------------------------------------------
  // CHARGEMENT DE L'UTILISATEUR
  // --------------------------------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const auth = await isAuthenticated();

        if (!auth?.authenticated) {
          window.location.replace("/home");
          return;
        }

        if (mounted) {
          setInfoUser(auth.user);
        }
      } catch (error) {
        console.error(
          "Erreur récupération utilisateur :",
          error
        );

        window.location.replace("/home");
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------------------------------------------------
  // DÉCONNEXION
  // --------------------------------------------------------------------------

  const handleQuit = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      window.location.replace("/home");
    }
  };

  // --------------------------------------------------------------------------
  // CHANGEMENT DE PROFIL
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
        return;
      }

      setInfoUser((previousUser) => ({
        ...previousUser,
        ...(result.user || {}),
        active_role: result.active_role || nouveauRole,
      }));

      // Reconstruit l'interface avec le nouveau profil actif.
      window.location.replace("/");
    } catch (error) {
      console.error("Erreur changement de profil :", error);

      window.alert(
        error?.message ||
          "Impossible de changer de profil."
      );
    } finally {
      setSwitchingRole(false);
    }
  };

  // --------------------------------------------------------------------------
  // OUVRIR / FERMER UN MENU
  // --------------------------------------------------------------------------

  const toggleMenu = (index) => {
    setActiveMenu((previous) =>
      previous === index ? null : index
    );
  };

  // --------------------------------------------------------------------------
  // NAVIGATION DES SOUS-MENUS
  // --------------------------------------------------------------------------

  const viewBySubMenu = {
    "Lancer année / Clôturer année": "annee-academique",
    "Créer / Modifier comptes enseignants": "enseignants-form",
    "Voir liste enseignants": "enseignants-list",
    "Créer faculté / Modifier faculté": "facultes-form",
    "Créer / Modifier Admin Fac": "admin-fac-form",
    "Créer / Modifier Comptables": "comptable-form",
    "Taux de réussite/échec par faculté": "stats-reussite",
    "Nombre d'étudiants par faculté": "nbre-etudiants",
    "Créer / Désactiver Super Admin": "super-admin-manager",
    "Créer / Publier un communiqué": "communique",
  };

  const handleSubMenuClick = (title) => {
    setActiveView(viewBySubMenu[title] || null);
  };

  const activeViewTitle =
    Object.entries(viewBySubMenu).find(
      ([, view]) => view === activeView
    )?.[0] || "";

  // --------------------------------------------------------------------------
  // COMPOSANT ASSOCIÉ À LA VUE ACTIVE
  // --------------------------------------------------------------------------

  const renderActiveView = () => {
    switch (activeView) {
      case "annee-academique":
        return <AnneeAcademique />;

      case "enseignants-form":
        return <CreerModifEns />;

      case "enseignants-list":
        return <ListeEnseignants />;

      case "facultes-form":
        return <FacultesForm />;

      case "admin-fac-form":
        return <AdminFacForm />;

      case "comptable-form":
        return <ComptableForm />;

      case "stats-reussite":
        return <StatsReussiteFaculte />;

      case "nbre-etudiants":
        return <EtudiantsFaculte />;

      case "communique":
        return <Communique />;

      case "super-admin-manager":
        return <SuperAdminManager />;

      default:
        return null;
    }
  };

  // --------------------------------------------------------------------------
  // RENDU
  // --------------------------------------------------------------------------

  return (
    <div
      className="super-admin-dashboard"
      style={{
        "--univ-primary": primaryColor,
        "--univ-secondary": secondaryColor,
      }}
    >
      {/* HEADER */}
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
              {universitySlogan}
            </span>

            {(universityCity || universityCode) && (
              <div className="university-meta">
                {universityCity && <span>{universityCity}</span>}

                {universityCity && universityCode && (
                  <span className="meta-separator">•</span>
                )}

                {universityCode && <span>{universityCode}</span>}
              </div>
            )}
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

      {/* CORPS : SIDEBAR + CONTENU */}
      <div className="dashboard-body">
        <aside className="sidebar" aria-label="Menu d'administration">
          {menuGroups.map((group) => (
            <section className="menu-card" key={group.title}>
              <div className="menu-card-header">
                {group.title}
              </div>

              <p className="menu-card-desc">
                {group.description}
              </p>

              {menuItems
                .filter((item) =>
                  group.menuTitles.includes(item.title)
                )
                .map((item) => {
                  const menuIndex = menuItems.indexOf(item);
                  const isOpen = activeMenu === menuIndex;

                  return (
                    <div
                      key={item.title}
                      className={`menu-item ${
                        isOpen ? "menu-item-active" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className={`menu-title ${
                          isOpen ? "menu-title-active" : ""
                        }`}
                        aria-expanded={isOpen}
                        onClick={() => toggleMenu(menuIndex)}
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
                          {item.subMenus.map((sub) => {
                            const isSelected =
                              viewBySubMenu[sub] === activeView;

                            return (
                              <li key={sub}>
                                <button
                                  type="button"
                                  className={`sub-menu-item ${
                                    isSelected
                                      ? "sub-menu-item-active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleSubMenuClick(sub)
                                  }
                                >
                                  {sub}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
            </section>
          ))}
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className="dashboard-content">
          {activeView === null ? (
            <section className="dashboard-welcome">
              <div className="dashboard-welcome-accent" />

              <span className="dashboard-eyebrow">
                Administration académique
              </span>

              <h2>Secrétariat général académique</h2>

              <p>
                Gérez l'année académique, les enseignants,
                les facultés et les opérations administratives
                depuis cet espace.
              </p>

              <div className="welcome-info-grid">
                <div className="welcome-info-card">
                  <span className="welcome-info-label">
                    Espace
                  </span>
                  <strong>Administration centrale</strong>
                </div>

                <div className="welcome-info-card">
                  <span className="welcome-info-label">
                    Université
                  </span>
                  <strong>{universityName}</strong>
                </div>
              </div>

              <div className="welcome-instruction">
                Sélectionnez une action dans le menu pour commencer.
              </div>
            </section>
          ) : (
            <section className="sga-module">
              <div className="module-toolbar">
                <div className="module-heading">
                  <span className="module-eyebrow">
                    Secrétariat général académique
                  </span>

                  <h2 className="module-title">
                    {activeViewTitle}
                  </h2>

                  <p className="module-description">
                    Gérez cette rubrique depuis votre espace administratif.
                  </p>
                </div>

                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setActiveView(null)}
                >
                  <span aria-hidden="true">←</span>
                  Accueil
                </button>
              </div>

              <div className="module-divider" />

              <div className="sga-module-content">
                {renderActiveView()}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="dashboard-footer">
        <div className="footer-center">
          Plateforme académique intelligente et sécurisée
        </div>

        {infoUser && (
          <div className="footer-user-card">
            <div className="footer-avatar" aria-hidden="true">
              {infoUser.nom
                ?.split(" ")
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
                {infoUser.code_faculte && (
                  <span>{infoUser.code_faculte}</span>
                )}

                {infoUser.code_faculte && infoUser.code_mention && (
                  <span className="footer-detail-separator">|</span>
                )}

                {infoUser.code_mention && (
                  <span>{infoUser.code_mention}</span>
                )}
              </div>

              <div className="footer-role-row">
                <label className="role-label" htmlFor="sga-active-role">
                  Profil :
                </label>

                <select
                  id="sga-active-role"
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

                {switchingRole && (
                  <span className="role-loading" aria-live="polite">
                    …
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

export default Sga;

