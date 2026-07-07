import React, { useState, useEffect } from "react";
import "./Enseignants.css";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "./authentification/serviceAuth";
import { getAnneeAcademiqueEnCoursService, getNombreRecoursEnAttenteService } from "./enseignantService";

import Recours from "./Recours/Recours";
import SaisirCotes from "./SaisirCotes/SaisirCotes";
import Documents from "./Documents/Documents";
import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";

  
const Enseignants = () => {

  const navigate = useNavigate();

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

  const handleQuit = async () => {
    await logout();
    navigate("/home");
  };

//Recuperation info de l' enseignant
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

      <footer className="dashboard-footer">

        <span className="footer-center">
          Plateforme académique intelligente et sécurisée
        </span>

        {infoUser && (
          <span className="footer-right">
            {infoUser.titre}. {infoUser.nom}
          </span>
        )}

      </footer>

    </div>
  );
};

export default Enseignants;
