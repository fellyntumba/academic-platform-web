import React, { useState, useEffect } from "react";

import {
  isAuthenticated,
  logout,
  switchRole
} from "../accueils/serviceAuth";

import "./Comptable.css";

import EnregistrementPaiementsFrais
  from "./paiementsFrais/EnregistrementPaiementsFrais";

import SituationsFinancieres
  from "./situationsFinancieres/SituationsFinancieres";


import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";

import { ROLE_LABELS } from "../accueils/roles";



// ============================================================
// MENUS COMPTABLE
// ============================================================

const menusComptable = [

  {
    title: "Gestion des paiements",

    subMenus: [
      "Enregistrer les paiements des frais"
    ]
  },


  {
    title: "Situation financière",

    subMenus: [
      "Situation financière d'une promotion ou d'un étudiant"
    ]
  }

];


// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

const Comptable = () => {

  const [activeMenu, setActiveMenu] =
    useState(null);

  const [activeView, setActiveView] =
    useState(null);

  const [infoUser, setInfoUser] =
    useState(null);

  const {
    infoUniv,
    loading
  } = useContextUniv();


  // ==========================================================
  // DÉCONNEXION
  // ==========================================================

  const handleQuit = async () => {

    try {

      await logout();

      window.location.replace("/home");

    } catch (error) {

      console.error(
        "Erreur lors de la déconnexion :",
        error
      );

      window.location.replace("/home");
    }
  };


  // ==========================================================
  // CHANGEMENT DE PROFIL ACTIF
  // ==========================================================

  const handleSwitchRole = async (e) => {

    const role = e.target.value;

    try {

      const result =
        await switchRole(role);

      if (!result.success) {

        alert(
          result.message ||
          "Impossible de changer de profil."
        );

        return;
      }

      console.log(
        "Profil actif changé vers :",
        result.active_role
      );

      window.location.replace("/");

    } catch (error) {

      console.error(
        "Erreur changement de profil :",
        error
      );

      alert(
        error?.message ||
        "Impossible de changer de profil."
      );
    }
  };


  // ==========================================================
  // RÉCUPÉRER LES INFORMATIONS UTILISATEUR
  // ==========================================================

  useEffect(() => {

    const loadUser = async () => {

      try {

        const auth =
          await isAuthenticated();

        if (!auth.authenticated) {

          window.location.replace("/home");

          return;
        }

        setInfoUser(auth.user);

      } catch (error) {

        console.error(
          "Erreur récupération utilisateur :",
          error
        );

        window.location.replace("/home");
      }
    };

    loadUser();

  }, []);


  // ==========================================================
  // OUVRIR / FERMER UN MENU
  // ==========================================================

  const toggleMenu = (index) => {

    setActiveMenu(
      activeMenu === index
        ? null
        : index
    );

  };


  // ==========================================================
  // GESTION DES SOUS-MENUS
  // ==========================================================

  const handleSubMenuClick = (title) => {

    if (
      title ===
      "Enregistrer les paiements des frais"
    ) {

      setActiveView(
        "paiements-frais"
      );

    } else if (
      title ===
      "Situation financière d'une promotion ou d'un étudiant"
    ) {

      setActiveView(
        "situation-financiere"
      );

    }  else {

      setActiveView(null);

    }

  };


  // ==========================================================
  // RENDRE UN GROUPE DE MENUS
  // ==========================================================

  const renderMenuGroup = (
    menus,
    groupIndex
  ) => {

    return menus.map(
      (item, index) => {

        const globalIndex =
          `${groupIndex}-${index}`;

        return (

          <div
            key={item.title}
            className="menu-item"
          >

            <div
              className="menu-title"
              onClick={() =>
                toggleMenu(globalIndex)
              }
            >

              {item.title}

              {" "}

              {
                activeMenu === globalIndex
                  ? "▲"
                  : "▼"
              }

            </div>


            {activeMenu === globalIndex && (

              <ul className="sub-menu">

                {item.subMenus.map(
                  (sub, i) => (

                    <li
                      key={i}
                      className="sub-menu-item"
                      onClick={() =>
                        handleSubMenuClick(sub)
                      }
                    >

                      {sub}

                    </li>

                  )
                )}

              </ul>

            )}

          </div>

        );

      }
    );

  };


  // ==========================================================
  // AFFICHAGE
  // ==========================================================

  return (

    <div className="comptable-dashboard">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <header
        className="home-header"
        style={{
          borderBottom:
            `3px solid ${
              infoUniv?.primaryColor ||
              "#3b82f6"
            }`
        }}
      >

        <div className="header-left">

          <img
            src={infoUniv?.logoUniversity}
            alt="Logo université"
            className="logo"
            onError={(e) => {

              e.target.src =
                "/default-logo.png";

            }}
          />


          <div className="university-info">

            <h1>
              {
                infoUniv?.nameUniversity ||
                "Academic Platform"
              }
            </h1>

            <span className="subtitle">
              academic Platform
            </span>

          </div>

        </div>


        <button
          className="quit-btn"
          onClick={handleQuit}
        >
          Quitter
        </button>

      </header>


      {/* ======================================================
          BODY
      ====================================================== */}

      <div className="dashboard-body">


        {/* ====================================================
            SIDEBAR
        ==================================================== */}

        <nav className="sidebar">


          {/* ==================================================
              UNE SEULE CARTE
          ================================================== */}

          <div className="menu-card">

            <div className="menu-card-header">

              Gestion des opérations financières

            </div>


            <div className="menu-card-desc">

              Ces menus permettent
              d'enregistrer les paiements
              des frais académiques,
              des documents et de consulter
              les situations financières.

            </div>


            {renderMenuGroup(
              menusComptable,
              "comptable"
            )}

          </div>


        </nav>


        {/* ====================================================
            CONTENU PRINCIPAL
        ==================================================== */}

        <main className="dashboard-content">

          {activeView === null && (

            <>

              <h2>
                {infoUser?.nom_fac}
              </h2>

              <p>
                Veuillez sélectionner une
                action dans le menu à gauche.
              </p>

            </>

          )}


          {activeView ===
            "paiements-frais" && (

            <EnregistrementPaiementsFrais />

          )}

          {activeView ===
            "situation-financiere" && (

            // <SituationsFinancieres />
            
            <p>

                Cette fonctionnalité est actuellement en cours

                de préparation. Elle permettra de consulter et

                d’imprimer les situations financières des

                promotions et des étudiants.

              </p>
          )}
       



        </main>

      </div>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="dashboard-footer">


        <div className="footer-center">

          Plateforme académique intelligente
          et sécurisée

        </div>


        {infoUser && (

          <div className="footer-user-card">


            {/* AVATAR */}

            <div className="footer-avatar">

              {infoUser.nom
                ?.split(" ")
                .map(
                  (word) =>
                    word[0]
                )
                .join("")
                .substring(0, 2)
                .toUpperCase()
              }

            </div>


            {/* INFORMATIONS */}

            <div className="footer-user-info">


              <div className="footer-user-name">

                {infoUser.nom}

              </div>


              <div className="footer-user-detail">

                {
                  infoUser.code_faculte
                    ? infoUser.code_faculte
                    : "ETABLISSEMENT"
                }

              </div>


              {/* PROFIL */}

              <div className="footer-role-row">

                <span className="role-label">
                  Profil :
                </span>


                <select
                  value={
                    infoUser.active_role
                  }
                  onChange={
                    handleSwitchRole
                  }
                >

                  {infoUser.roles?.map(
                    (role) => (

                      <option
                        key={role}
                        value={role}
                      >

                        {
                          ROLE_LABELS[role] ||
                          role
                        }

                      </option>

                    )
                  )}

                </select>

              </div>

            </div>

          </div>

        )}

      </footer>

    </div>

  );

};


export default Comptable;
