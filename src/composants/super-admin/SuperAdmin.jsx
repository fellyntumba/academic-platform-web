import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated , logout} from "./authentification/serviceAuth";
import "./SuperAdmin.css";
// import CreateSemestres from "./createSemestres/CreateSemestres";
import CreerModifEns from "./miseAjourEns/CreerModifEns";
import ListeEnseignants from "./listeEnseignants/ListeEnseignants";
import StatsReussiteFaculte from "./statistiques/taux/StatsReussiteFaculte";
import EtudiantsFaculte from "./statistiques/nbreEtud/EtudiantsFaculte";
import FacultesForm from "./fac/FacultesForm";
// import PromotionForm from "./promo/PromotionForm";
import AnneeAcademique from "./anneeAcademique/AnneeAcademique";
import SuperAdminManager from "./SuperAdminManager/SuperAdminManager";
import AdminFacForm from "./miseAjourAdmin/AdminFacForm";
import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";
  

const menuItems = [
  { title: "Gérer Année Académique", subMenus: ["Lancer année / Clôturer année"] },
  {
    title: "Gestion des enseignants",
    subMenus: ["Créer / Modifier comptes enseignants", "Voir liste enseignants"]
  },
  { title: "Gestion Facultés", subMenus: ["Créer faculté / Modifier faculté"] },
  { title: "Gestion Admin. Facultaires", subMenus: ["Créer / Modifier Admin Fac"] },
  { title: "Statistiques", subMenus: ["Taux de réussite/échec par faculté", "Nombre d'étudiants par faculté"] },
  { title: "Super Administrateur", subMenus: ["Créer / Désactiver Super Admin"] },
];

const SuperAdmin = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeView, setActiveView] = useState(null);
  const [infoUser, setInfoUser] = useState(null);
  const { infoUniv, loading } = useContextUniv();
  const navigate = useNavigate();

  const handleQuit = async () => {
    await logout();
    navigate("/home");
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await isAuthenticated();
        setInfoUser(user);
      } catch {
        navigate("/home");
      }
    };
    loadUser();
  }, []);

  const toggleMenu = (index) => setActiveMenu(activeMenu === index ? null : index);

  const handleSubMenuClick = (title) => {
    if (title === "Créer / Modifier comptes enseignants") setActiveView("enseignants-form");
    else if (title === "Voir liste enseignants") setActiveView("enseignants-list");
    else if (title === "Créer faculté / Modifier faculté") setActiveView("facultes-form");
    else if (title === "Créer / Modifier Admin Fac") setActiveView("admin-fac-form");
    else if (title === "Lancer année / Clôturer année") setActiveView("annee-academique");
    else if (title === "Créer promotion / Modifier promotion") setActiveView("promotion-form");
    else if (title === "Taux de réussite/échec par faculté") setActiveView("stats-reussite");
    else if (title === "Nombre d'étudiants par faculté") setActiveView("nbre-etudiants");
    else if (title === "Créer les semestres & sessions") setActiveView("create-semestres");
    else if (title === "Créer / Désactiver Super Admin") setActiveView("super-admin-manager");
    else setActiveView(null);
  };

  return ( 
    <div className="super-admin-dashboard">
      <header className="home-header" style={{
        borderBottom: `3px solid ${infoUniv?.primaryColor || "#3b82f6"}`}}>
        <div className="header-left">
          <img
            src={infoUniv?.logoUniversity}
            alt="Logo université"
            className="logo"
            onError={(e) => {
              e.target.src = "/default-logo.png"; // fallback si logo cassé
            }}
          /> 
          <div className="university-info">
            <h1>{infoUniv?.nameUniversity || "Academic Platform"}</h1>
            <span className="subtitle">academic Platform</span>
          </div>
        </div>
        <button className="quit-btn" onClick={handleQuit}>Quitter</button>
      </header>

      <div className="dashboard-body">
        <nav className="sidebar">

          {/* Carte 1 – Facultés & Enseignants */}
          <div className="menu-card">
            <div className="menu-card-header">Configuration initiale</div>
            <div className="menu-card-desc">
              Ces menus servent à configurer les facultés et enseignants.
            </div>
            {menuItems.filter(m => m.title === "Gestion Facultés" || m.title === "Gestion des enseignants")
              .map((item, index) => (
                <div key={item.title} className="menu-item">
                  <div className="menu-title" onClick={() => toggleMenu(index)}>
                    {item.title} {activeMenu === index ? "▲" : "▼"}
                  </div>
                  {activeMenu === index && (
                    <ul className="sub-menu">
                      {item.subMenus.map((sub, i) => (
                        <li key={i} className="sub-menu-item" onClick={() => handleSubMenuClick(sub)}>
                          {sub}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            }
          </div>

          {/* Carte 2 – Année Académique, Admin Fac, Super Admin & Statistiques */}
          <div className="menu-card">
            <div className="menu-card-header">Gestion annuelle & administrateurs</div>
            <div className="menu-card-desc">
              Ces menus concernent la gestion annuelle.
            </div>
            {menuItems.filter(m => m.title !== "Gestion Facultés" && m.title !== "Gestion des enseignants")
              .map((item, index) => (
                <div key={item.title} className="menu-item">
                  <div className="menu-title" onClick={() => toggleMenu(index)}>
                    {item.title} {activeMenu === index ? "▲" : "▼"}
                  </div>
                  {activeMenu === index && (
                    <ul className="sub-menu">
                      {item.subMenus.map((sub, i) => (
                        <li key={i} className="sub-menu-item" onClick={() => handleSubMenuClick(sub)}>
                          {sub}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            }
          </div>

        </nav>

        <main className="dashboard-content">
          {activeView === null && (
            <>
              <h2>Secrétariat général académique</h2>
              <p>Veuillez sélectionner une action dans le menu à gauche.</p>
            </>
          )}
          {activeView === "annee-academique" && <AnneeAcademique />}
          {activeView === "enseignants-form" && <CreerModifEns />}
          {activeView === "enseignants-list" && <ListeEnseignants />}
          {activeView === "facultes-form" && <FacultesForm />}
          {activeView === "admin-fac-form" && <AdminFacForm />}
          {activeView === "stats-reussite" && <StatsReussiteFaculte />}
          {activeView === "nbre-etudiants" && <EtudiantsFaculte />}
          {activeView === "super-admin-manager" && <SuperAdminManager />}
        </main>
      </div>

      <footer className="dashboard-footer">
        <span className="footer-center">
          Plateforme académique intelligente et sécurisée
        </span>
        {infoUser && (
          <span className="footer-right">
            {infoUser.role} : {infoUser.nom}
          </span>
        )}
      </footer>
    </div>
  );
};

export default SuperAdmin;