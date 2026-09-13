import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  logout, 
  switchRole
} from "../accueils/serviceAuth"; 

import "./AdminFac.css"; 

import StatsReussitePromotion from "./StatsReussitePromotion/StatsReussitePromotion";
import FaculteAnneeForm from "./FaculteAnnee/FaculteAnneeForm";
import MiseAjourChefMention from "./MiseAjourChefMention/MiseAjourChefMention";
import Mention from "./mentions/Mention";
import Communique from "./Communique/Communique";
import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";
import { ADMIN_ROLES, ROLE_LABELS } from "../accueils/roles";

 
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

  {
    title: "Gestion des communiqués",
    subMenus: [
      "Créer / Publier un communiqué"
    ],
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

    // recharge l'application pour refaire isAuthenticated()
    window.location.replace("/home");

  };

  //changer le profile actif
  const handleSwitchRole = async (e) => {
    const role = e.target.value;

    console.log("=================================");
    console.log("🔄 CHANGEMENT DE PROFIL");
    console.log("➡️ Profil demandé :", role);

    const result = await switchRole(role);

    if (!result.success) {
      console.error("❌ ÉCHEC CHANGEMENT PROFIL :", result);
      alert(result.message);
      return;
    }

    console.log("✅ PROFIL CHANGÉ");
    console.log("➡️ active_role :", result.active_role);
    console.log("➡️ user reçu du backend :", result.user);

    console.log("🆔 identity_id :", result.user?.identity_id);
    console.log("👤 identity_type :", result.user?.identity_type);
    console.log("🏢 admin_id :", result.user?.admin_id);
    console.log("👨‍🏫 enseignant_id :", result.user?.enseignant_id);
    console.log("🎯 active_role :", result.user?.active_role);

    console.log("=================================");

    window.location.replace("/");
  };


  //Recuperer info user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const auth = await isAuthenticated();

        if (!auth.authenticated) {
          window.location.replace("/home");
          return;
        }

        console.log("=================================");
        console.log("🔐 UTILISATEUR APRÈS RECHARGEMENT");
        console.log("➡️ user :", auth.user);
        console.log("🆔 identity_id :", auth.user?.identity_id);
        console.log("👤 identity_type :", auth.user?.identity_type);
        console.log("🏢 admin_id :", auth.user?.admin_id);
        console.log("👨‍🏫 enseignant_id :", auth.user?.enseignant_id);
        console.log("🎯 active_role :", auth.user?.active_role);
        console.log("=================================");

        setInfoUser(auth.user);
      } catch {
        window.location.replace("/home");
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
    }else if (title === "Créer / Publier un communiqué") {
      setActiveView("communique");
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

          {activeView === "communique" && (<Communique nomFaculte={infoUser?.code_faculte} />)}
        </main>
      </div>
      <footer className="dashboard-footer">

              <div className="footer-center">
                Plateforme académique intelligente et sécurisée
              </div>


              {infoUser && (

                <div className="footer-user-card">


                  {/* Avatar */}
                  <div className="footer-avatar">
                    {infoUser.nom
                      ?.split(" ")
                      .map(word => word[0])
                      .join("")
                      .substring(0,2)
                      .toUpperCase()
                    }
                  </div>



                  {/* Informations utilisateur */}
                  <div className="footer-user-info">


                    <div className="footer-user-name">
                      {infoUser.nom}
                    </div>


                    <div className="footer-user-detail">

                      {infoUser.code_faculte && (
                        <>
                          {infoUser.code_faculte}
                        </>
                      )}

                      {infoUser.code_mention && (
                        <>
                          &nbsp; | &nbsp;
                          🎓 {infoUser.code_mention}
                        </>
                      )}

                    </div>



                    <div className="footer-role-row">

                      <span className="role-label">
                        Profil :
                      </span>


                      <select
                        value={infoUser.active_role}
                        onChange={handleSwitchRole}
                      >

                        {infoUser.roles
                          ?.map(role => (

                            <option
                              key={role}
                              value={role}
                            >
                              {ROLE_LABELS[role]}
                            </option>

                          ))
                        }


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


