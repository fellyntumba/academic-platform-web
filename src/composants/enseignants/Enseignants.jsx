import React, { useState, useEffect } from "react";
import "./Enseignants.css";

import {
  isAuthenticated,
  logout,
  switchRole
} from "../accueils/serviceAuth";
import { getAnneeAcademiqueEnCoursService, getNombreRecoursEnAttenteService } from "./enseignantService";

import Recours from "./Recours/Recours";
import SaisirCotes from "./SaisirCotes/SaisirCotes";
import Documents from "./Documents/Documents";
import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";
import { ADMIN_ROLES, ROLE_LABELS } from "../accueils/roles";

  
const Enseignants = () => { 


  const [infoUser, setInfoUser] = useState(null);
  const [annee, setAnnee] = useState("");
  const [activeView, setActiveView] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [nbRecours, setNbRecours] = useState(0);
  const { infoUniv, loading } = useContextUniv();
  

  const actions = [
    { name: "Soumettre les cotes des étudiants", icon: "📝" },
    { name: "Traiter les recours des étudiants", icon: "📩", badge: nbRecours },
    { name: "Envoyer les documents", icon: "📂" },
  ];


  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

    //Deconexionn
  const handleQuit = async () => {

    await logout();

    // recharge l'application pour refaire isAuthenticated()
    window.location.replace("/home");

  };

  //changer le profile actif
  const handleSwitchRole = async (e) => {

    const role = e.target.value;

    const result = await switchRole(role);

    if (!result.success) {
      alert(result.message);
      return;
    }

    console.log("ROLE CHANGÉ");

    window.location.replace("/");
  };

  //Recuperation info de l' enseignant
  useEffect(() => {
    const loadUser = async () => {
      try {
        const auth = await isAuthenticated();

        if (!auth.authenticated) {
          window.location.replace("/home");
          return;
        }

        setInfoUser(auth.user);

      } catch {
        window.location.replace("/home");
      }
    };

    loadUser();
  }, []);


//Nombre de recours en attente
useEffect(() => {
  const loadRecoursCount = async () => {
    try {
      if (!infoUser?.id) return;

      const result = await getNombreRecoursEnAttenteService(infoUser.id);

      setNbRecours(result.total || 0);

    } catch (error) {
      console.error("Erreur chargement recours:", error);
    }
  };

  loadRecoursCount();
}, [infoUser]);

//Actions (saisir-cotes ou Traiter les recours)
const handleActionClick = async (actionName) => {

  try {

    const result = await getAnneeAcademiqueEnCoursService();

    if (!result || !result.data) {
      showMessage("Aucune année académique en cours.", "error");
      return;
    }
    setAnnee(result.data.libelle)
    if (actionName === "Soumettre les cotes des étudiants") {
      setActiveView("saisir-cotes");
    } 
    else if (actionName === "Traiter les recours des étudiants") {
      setActiveView("recours");
    }
    // else if (actionName === "Envoyer les documents") {
    //   setActiveView("documents");
    // }

  } catch (error) {
    showMessage(error.message, "error");

  }

};

  const handleBack = () => {
    setActiveView(null);
  };
// {infoUser && console.log(infoUser)}
  return (
    <div className="teacher-dashboard">

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

      {message && (
        <div className={`parcours-notification ${messageType}`}>
          {message}
        </div>
      )}

      <div className="teacher-content">

        {message && (
          <div className={`parcours-notification ${messageType}`}>
            {message}
          </div>
        )}

        {activeView === null && (
          <>
            <h2 className="dashboard-title">
              Tableau de bord Enseignant
            </h2>

            <div className="actions-grid">

              {actions.map((action) => (

                <div
                  key={action.name}
                  className="action-card"
                  onClick={() => handleActionClick(action.name)}
                >

                  <div className="action-icon">
                    {action.icon}
                  </div>

                  <p>{action.name}</p>

                  {action.badge > 0 && (
                    <span className="badge">
                      {action.badge > 99 ? "99+" : action.badge}
                    </span>
                  )}

                </div>

              ))}

            </div>
          </>
        )}


              {activeView === "saisir-cotes" && (
        <div className="component-wrapper fade-in">

          <button
            className="back-btn"
            onClick={handleBack}
          >
            ← Retour
          </button>

          <SaisirCotes id_enseignant={infoUser.id} annee= {annee}/>

        </div>
      )}
 
      {activeView === "recours" && (
        <div className="component-wrapper fade-in">

          <button
            className="back-btn"
            onClick={handleBack}
          >
            ← Retour
          </button>

          <Recours id_enseignant={infoUser.id} annee= {annee}/>

        </div>
      )}

      {activeView === "documents" && (
        <div className="component-wrapper fade-in">

          <button
            className="back-btn"
            onClick={handleBack}
          >
            ← Retour
          </button>

          <Documents id_enseignant={infoUser.id} annee={annee} />

        </div>
      )}


      </div>

      {/* {activeView === null && (
        <>
          <h2 className="dashboard-title">
            Tableau de bord Enseignant
          </h2>

          <div className="actions-grid">

            {actions.map((action) => (

              <div
                key={action.name}
                className="action-card"
                onClick={() => handleActionClick(action.name)}
              >

                <div className="action-icon">
                  {action.icon}
                </div>

                <p>{action.name}</p>

                {action.badge > 0 && (
                  <span className="badge">
                    {action.badge > 99 ? "99+" : action.badge}
                  </span>
                )}

              </div>

            ))}

          </div>
        </>
      )} */}



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
                          {infoUser.code_mention}
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

export default Enseignants;
