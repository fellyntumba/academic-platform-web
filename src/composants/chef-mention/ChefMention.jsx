import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "./authentification/serviceAuth";
import "./ChefMention.css";
// import { getAnneeAcademiqueEnCoursService } from "./service";
 
import MentionAnnee from "./MentionAnnee/MentionAnnee";
import PromotionAnnee from "./PromotionAnnee/PromotionAnnee";
import Promotions from "./Promotions/Promotions";
import ParcoursAnnee from "./ParcoursAnnee/ParcoursAnnee";
import Parcours from "./Parcours/Parcours";
// import CreateModifyCourses from "./CreateModifyCourses/CreateModifyCourses";
import AffecterCours from "./AffecterCours/AffecterCours";
import ListeCoursEnseignants from "./ListeCoursEnseignants/ListeCoursEnseignants";
import SuiviEnvoiNotes from "./SuiviEnvoiNotes/SuiviEnvoiNotes";
// import PeriodeNotes from "./PeriodeNotes/PeriodeNotes";
import PeriodeRecours from "./PeriodeRecours/PeriodeRecours";

import StatsReussitePromotion from "./StatsReussitePromotion/StatsReussitePromotion";
import CreateSession from "./createSession/createSession";
import EtudiantsInscrits from "./EtudiantsInscrits/EtudiantsInscrits";
import EtudiantsOrdres from "./EtudiantsOrdres/EtudiantsOrdres";
import SuiviRecours from "./SuiviRecours/SuiviRecours";
import CreateUE from "./CreateUE/CreateUE";
import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";


  
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
      "Enregistrer étudiants en ordre avec frais",
    ],
  },
  {
    title: "Gestion des sessions",
    subMenus: [
      "Lancer les sessions"
      
    ],
  },
  {
    title: "Gestion des notes",
    subMenus: [
      "Suivre les notes envoyées/Pub des resultats"
    ],
  },
  // {
  //   title: "Suivi des notes",
  //   subMenus: ["Suivre les notes envoyées"],
  // },
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
];


const ChefMention = () => {

  const [activeMenu, setActiveMenu] = useState(null);
  const [activeView, setActiveView] = useState(null);
  const [infoUser, setInfoUser] = useState(null);
  const { infoUniv, loading } = useContextUniv();
  // const [annee, setAnnee] = useState("");

  const navigate = useNavigate();

  const handleQuit = async () => {
    await logout();
    navigate("/home");
  };

//Recuperer annee acad
  // useEffect(() => {
  //   const getAnnee = async () => {
      
  //       const result = await getAnneeAcademiqueEnCoursService();

  //       if (!result || !result.data) {
  //         showMessage("Aucune année académique en cours.", "error");
  //         return;
  //       }
  //       setAnnee(result.data.libelle)
      
  //     };
  //   getAnnee();
  // }, []); 

//Recuperer info user
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

    if (title === "Créer / Modifier la mention-année") setActiveView("mention-année");
    else if (title === "Créer / Modifier un parcours") setActiveView("parcours");
    else if (title === "Créer / Modifier un parcours-année") setActiveView("parcours-année");
    else if (title === "Créer / Modifier les promotions") setActiveView("promotions");
    else if (title === "Créer / Modifier une promotions-année") setActiveView("promotions-année");
    else if (title === "Créer / Modifier / Supprimer les unités d'enseignement") setActiveView("unites-ens");
    else if (title === "Affecter les cours") setActiveView("affecter-cours");
    else if (title === "Voir liste enseignants et ses cours") setActiveView("liste-cours-enseignants");
    else if (title === "Enregistrer étudiants régulièrement inscrits") setActiveView("enregistrer-etudiants-inscrits");
    else if (title === "Enregistrer étudiants en ordre avec frais") setActiveView("enregistrer-etudiants-ordres");
    else if (title === "Suivre les notes envoyées/Pub des resultats") setActiveView("suivi-notes");
    // else if (title === "Lancer / Clôturer période d'envoi des notes") setActiveView("periode-notes");
    else if (title === "Lancer période d'envoi des recours") setActiveView("periode-recour");
    else if (title === "Suivre les recours envoyés") setActiveView("suivi-recours");
    else if (title === "Taux de réussite / échec par promotion") setActiveView("statistiques");
    // else if (title === "Créer / Modifier les semestres") setActiveView("semestres");
    else if (title === "Lancer les sessions") setActiveView("sessions");
    else setActiveView(null);

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

          {/* CONFIGURATION INITIALE */}

          <div className="menu-card">

            <div className="menu-card-title">
              Configuration initiale
            </div>

            <div className="menu-card-desc">
              Ces menus servent à configurer les parcours et promotions.
            </div>

            {[1,3].map((i) => {

              const item = menuItems[i];

              return (
                <div key={item.title} className="menu-item">

                  <div
                    className="menu-title"
                    onClick={() => toggleMenu(i)}
                  >
                    {item.title} {activeMenu === i ? "▲" : "▼"}
                  </div>

                  {activeMenu === i && (
                    <ul className="sub-menu">
                      {item.subMenus.map((sub, index) => (
                        <li
                          key={index}
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

            })}

          </div>


          {/* CONFIGURATION ANNUELLE */}

          <div className="menu-card">

            <div className="menu-card-title">
              Configuration annuelle
            </div>

            <div className="menu-card-desc">
              Ces paramètres doivent être mis à jour à chaque année académique.
            </div>

            {[0,2,4,5,6,7,8,9,10].map((i) => {

              const item = menuItems[i];

              return (
                <div key={item.title} className="menu-item">

                  <div
                    className="menu-title"
                    onClick={() => toggleMenu(i)}
                  >
                    {item.title} {activeMenu === i ? "▲" : "▼"}
                  </div>

                  {activeMenu === i && (
                    <ul className="sub-menu">
                      {item.subMenus.map((sub, index) => (
                        <li
                          key={index}
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

            })}

          </div>

        </nav>


        <main className="dashboard-content">

          {activeView === null && (
            <>
              <h2>{infoUser?.code_mention}</h2>
              <p>Veuillez sélectionner une action dans le menu à gauche.</p>
            </>
          )}

          {/* {activeView === "semestres" && <CreateSemestres />} */}
          {activeView === "sessions" && <CreateSession code_mention={infoUser?.code_mention}/>}
          {activeView === "unites-ens" && <CreateUE code_mention={infoUser?.code_mention} />}
          {activeView === "affecter-cours" && <AffecterCours code_mention={infoUser?.code_mention}/>}
          {activeView === "liste-cours-enseignants" && <ListeCoursEnseignants code_mention={infoUser?.code_mention}/>}
          {activeView === "enregistrer-etudiants-inscrits" && <EtudiantsInscrits code_mention={infoUser?.code_mention} />}
          {activeView === "enregistrer-etudiants-ordres" && <EtudiantsOrdres />}
          {activeView === "suivi-notes" && <SuiviEnvoiNotes code_mention={infoUser?.code_mention}/>}
          {activeView === "periode-recour" && <PeriodeRecours code_mention={infoUser?.code_mention}/>}
          {activeView === "suivi-recours" && <SuiviRecours code_mention={infoUser?.code_mention}/>}
          {/* {activeView === "deliberation" && <Deliberation code_mention={infoUser?.code_mention} annee={annee}/>} */}
          {activeView === "statistiques" && <StatsReussitePromotion />}
          {activeView === "mention-année" &&  <MentionAnnee code_mention={infoUser?.code_mention} />}
          {activeView === "parcours" &&  <Parcours code_mention={infoUser?.code_mention} />}
          {activeView === "parcours-année" && <ParcoursAnnee code_mention={infoUser?.code_mention} />}
          {activeView === "promotions" && <Promotions code_mention={infoUser?.code_mention} />}
          {activeView === "promotions-année" && <PromotionAnnee code_mention={infoUser?.code_mention} />}

        </main>

      </div>
  

      <footer className="dashboard-footer">

        <span className="footer-center">
          Plateforme académique intelligente et sécurisée
        </span>

        {infoUser && (
          <span className="footer-right">
            {infoUser.nom}, Mention : {infoUser.code_mention}
          </span>
        )}

      </footer>

    </div>
  );

};

export default ChefMention;
