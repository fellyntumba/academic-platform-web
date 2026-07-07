import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "./authentification/serviceAuth";
import "./AdminFac.css";

import StatsReussitePromotion from "./StatsReussitePromotion/StatsReussitePromotion";
import FaculteAnneeForm from "./FaculteAnnee/FaculteAnneeForm";
import MiseAjourChefMention from "./MiseAjourChefMention/MiseAjourChefMention";
import Mention from "./mentions/Mention";
import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";


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
    subMenus: ["Taux de réussite / échec pour l'année acad. en cours"],
  },
];

const AdminFac = () => {
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

  const toggleMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const handleSubMenuClick = (title) => {
    if (title === "Créer / Modifier la faculté-année") {
      setActiveView("faculte-annee");
    } else if (title === "Créer / Modifier les chefs de mentions") {
      setActiveView("chefs-mentions");
    } else if (title === "Créer / Modifier les mentions") {
      setActiveView("mentions");
    } else if (title === "Taux de réussite / échec pour l'année acad. en cours") {
      setActiveView("statistiques");
    } else {
      setActiveView(null);
    }
  };

  const renderMenuGroup = (menus, groupIndex) => {
    return menus.map((item, index) => {
      const globalIndex = `${groupIndex}-${index}`;
      return (
        <div key={item.title} className="menu-item">
          <div
            className="menu-title"
            onClick={() => toggleMenu(globalIndex)}
          >
            {item.title} {activeMenu === globalIndex ? "▲" : "▼"}
          </div>

          {activeMenu === globalIndex && (
            <ul className="sub-menu">
              {item.subMenus.map((sub, i) => (
                <li
                  key={i}
                  className="sub-menu-item"
                  onClick={() => handleSubMenuClick(sub)}
                >
                  {sub}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    });
  };

  return (
    <div className="admin-fac-dashboard">
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

          {/* Carte configuration initiale */}
          <div className="menu-card">
            <div className="menu-card-header">
              Configuration initiale
            </div>
            <div className="menu-card-desc">
              Ces menus servent à configurer les mentions ainsi que leurs chefs.
            </div>

            {renderMenuGroup(configInitialeMenus, "config")}
          </div>
 
          {/* Carte gestion annuelle */}
          <div className="menu-card">
            <div className="menu-card-header">
              Gestion académique annuelle
            </div>
            <div className="menu-card-desc">
              Ces menus concernent la gestion annuelle.
            </div>

            {renderMenuGroup(gestionAnnuelleMenus, "annee")}
          </div>

        </nav>

        <main className="dashboard-content">
          {activeView === null && (
            <>
              <h2>{infoUser?.nom_fac}</h2>
              <p>Veuillez sélectionner une action dans le menu à gauche.</p>
            </>
          )}

          {activeView === "faculte-annee" && (
            <FaculteAnneeForm code_faculte={infoUser?.code_faculte} />
          )}

          {activeView === "statistiques" && (
            <StatsReussitePromotion nomFaculte={infoUser?.code_faculte} />
          )}

          {activeView === "mentions" && (
            <Mention nomFaculte={infoUser?.code_faculte} />
          )}

          {activeView === "chefs-mentions" && (
            <MiseAjourChefMention nomFaculte={infoUser?.code_faculte} />
          )}
        </main>
      </div>

      <footer className="dashboard-footer">
        <span className="footer-center">
          Plateforme académique intelligente et sécurisée
        </span>

        {infoUser && (
          <span className="footer-right">
            {infoUser.nom}, Faculté : {infoUser.code_faculte}
          </span>
        )}
      </footer>
    </div>
  );
};

export default AdminFac;


