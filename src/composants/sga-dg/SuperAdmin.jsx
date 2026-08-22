import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  logout,
  switchRole
} from "../accueils/serviceAuth";

import "./SuperAdmin.css";

import CreerModifEns from "./miseAjourEns/CreerModifEns";
import ListeEnseignants from "./listeEnseignants/ListeEnseignants";
import StatsReussiteFaculte from "./statistiques/taux/StatsReussiteFaculte";
import EtudiantsFaculte from "./statistiques/nbreEtud/EtudiantsFaculte";
import FacultesForm from "./fac/FacultesForm";
import ComptableForm from "./miseAjourCptables/ComptableForm";
import AnneeAcademique from "./anneeAcademique/AnneeAcademique";
import SuperAdminManager from "./SuperAdminManager/SuperAdminManager";
import AdminFacForm from "./miseAjourAdmin/AdminFacForm";

import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";
import { ROLE_LABELS } from "../accueils/roles";


const menuItems = [
  {
    title: "Gérer Année Académique",
    subMenus: [
      "Lancer année / Clôturer année"
    ]
  },

  {
    title: "Gestion des enseignants",
    subMenus: [
      "Créer / Modifier comptes enseignants",
      "Voir liste enseignants"
    ]
  },

  {
    title: "Gestion Facultés",
    subMenus: [
      "Créer faculté / Modifier faculté"
    ]
  },

  {
    title: "Gestion Admin. Facultaires",
    subMenus: [
      "Créer / Modifier Admin Fac"
    ]
  },

  {
    title: "Gestion des comptables",
    subMenus: [
      "Créer / Modifier Comptables"
    ]
  },

  {
    title: "Statistiques",
    subMenus: [
      "Taux de réussite/échec par faculté",
      "Nombre d'étudiants par faculté"
    ]
  },

  {
    title: "Super Administrateur",
    subMenus: [
      "Créer / Désactiver Super Admin"
    ]
  },
];


const SuperAdmin = () => {

  const [activeMenu, setActiveMenu] = useState(null);
  const [activeView, setActiveView] = useState(null);
  const [infoUser, setInfoUser] = useState(null);

  const { infoUniv } = useContextUniv();

  const navigate = useNavigate();


  /* =====================================================
     DÉCONNEXION
  ===================================================== */

  const handleQuit = async () => {

    await logout();

    window.location.replace("/home");
  };


  /* =====================================================
     CHANGER LE PROFIL ACTIF
  ===================================================== */

  const handleSwitchRole = async (e) => {

    const role = e.target.value;

    try {

      const result = await switchRole(role);

      if (!result.success) {

        alert(result.message);

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


  /* =====================================================
     RÉCUPÉRER INFORMATIONS UTILISATEUR
  ===================================================== */

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


  /* =====================================================
     OUVERTURE / FERMETURE MENU
  ===================================================== */

  const toggleMenu = (index) => {

    setActiveMenu(
      activeMenu === index
        ? null
        : index
    );
  };


  /* =====================================================
     ACTION SOUS-MENU
  ===================================================== */

  const handleSubMenuClick = (title) => {

    if (
      title ===
      "Créer / Modifier comptes enseignants"
    ) {

      setActiveView("enseignants-form");
    }

    else if (
      title ===
      "Voir liste enseignants"
    ) {

      setActiveView("enseignants-list");
    }

    else if (
      title ===
      "Créer faculté / Modifier faculté"
    ) {

      setActiveView("facultes-form");
    }

    else if (
      title ===
      "Créer / Modifier Admin Fac"
    ) {

      setActiveView("admin-fac-form");
    }

    else if (
      title ===
      "Créer / Modifier Comptables"
    ) {

      setActiveView("comptable-form");
    }

    else if (
      title ===
      "Lancer année / Clôturer année"
    ) {

      setActiveView("annee-academique");
    }

    else if (
      title ===
      "Créer promotion / Modifier promotion"
    ) {

      setActiveView("promotion-form");
    }

    else if (
      title ===
      "Taux de réussite/échec par faculté"
    ) {

      setActiveView("stats-reussite");
    }

    else if (
      title ===
      "Nombre d'étudiants par faculté"
    ) {

      setActiveView("nbre-etudiants");
    }

    else if (
      title ===
      "Créer les semestres & sessions"
    ) {

      setActiveView("create-semestres");
    }

    else if (
      title ===
      "Créer / Désactiver Super Admin"
    ) {

      setActiveView("super-admin-manager");
    }

    else {

      setActiveView(null);
    }
  };


  return (

    <div className="super-admin-dashboard">


      {/* =====================================================
          HEADER
      ===================================================== */}

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


      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="dashboard-body">


        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <nav className="sidebar">


          {/* =================================================
              CARTE 1
              
              UNIQUEMENT :
              - Enseignants
              - Facultés
          ================================================= */}

          <div className="menu-card">

            <div className="menu-card-header">
              Configuration initiale
            </div>

            <div className="menu-card-desc">
              Ces menus servent à configurer
              les facultés et enseignants.
            </div>


            {menuItems
              .filter(
                (item) =>
                  item.title ===
                    "Gestion Facultés" ||
                  item.title ===
                    "Gestion des enseignants"
              )
              .map((item, index) => (

                <div
                  key={item.title}
                  className="menu-item"
                >

                  <div
                    className="menu-title"
                    onClick={() =>
                      toggleMenu(index)
                    }
                  >

                    {item.title}{" "}

                    {
                      activeMenu === index
                        ? "▲"
                        : "▼"
                    }

                  </div>


                  {activeMenu === index && (

                    <ul className="sub-menu">

                      {item.subMenus.map(
                        (sub, i) => (

                          <li
                            key={i}
                            className="sub-menu-item"
                            onClick={() =>
                              handleSubMenuClick(
                                sub
                              )
                            }
                          >
                            {sub}
                          </li>

                        )
                      )}

                    </ul>

                  )}

                </div>

              ))
            }

          </div>


          {/* =================================================
              CARTE 2
              
              - Année académique
              - Admin Fac
              - Comptables
              - Statistiques
              - Super Admin
          ================================================= */}

          <div className="menu-card">

            <div className="menu-card-header">
              Gestion annuelle & administrateurs
            </div>

            <div className="menu-card-desc">
              Ces menus concernent la gestion annuelle
              et administrative.
            </div>


            {menuItems
              .filter(
                (item) =>
                  item.title !==
                    "Gestion Facultés" &&
                  item.title !==
                    "Gestion des enseignants"
              )
              .map((item, index) => (

                <div
                  key={item.title}
                  className="menu-item"
                >

                  <div
                    className="menu-title"
                    onClick={() =>
                      toggleMenu(index)
                    }
                  >

                    {item.title}{" "}

                    {
                      activeMenu === index
                        ? "▲"
                        : "▼"
                    }

                  </div>


                  {activeMenu === index && (

                    <ul className="sub-menu">

                      {item.subMenus.map(
                        (sub, i) => (

                          <li
                            key={i}
                            className="sub-menu-item"
                            onClick={() =>
                              handleSubMenuClick(
                                sub
                              )
                            }
                          >
                            {sub}
                          </li>

                        )
                      )}

                    </ul>

                  )}

                </div>

              ))
            }

          </div>

        </nav>


        {/* ===================================================
            CONTENU
        =================================================== */}

        <main className="dashboard-content">

          {activeView === null && (

            <>
              <h2>
                Secrétariat général académique
              </h2>

              <p>
                Veuillez sélectionner une action
                dans le menu à gauche.
              </p>
            </>

          )}


          {activeView === "annee-academique" && (
            <AnneeAcademique />
          )}


          {activeView === "enseignants-form" && (
            <CreerModifEns />
          )}


          {activeView === "enseignants-list" && (
            <ListeEnseignants />
          )}


          {activeView === "facultes-form" && (
            <FacultesForm />
          )}


          {activeView === "admin-fac-form" && (
            <AdminFacForm />
          )}


          {activeView === "comptable-form" && (
            <ComptableForm />
          )}


          {activeView === "stats-reussite" && (
            <StatsReussiteFaculte />
          )}


          {activeView === "nbre-etudiants" && (
            <EtudiantsFaculte />
          )}


          {activeView === "super-admin-manager" && (
            <SuperAdminManager />
          )}

        </main>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="dashboard-footer">

        <div className="footer-center">
          Plateforme académique intelligente et sécurisée
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

                {infoUser.code_faculte && (
                  <>
                    {infoUser.code_faculte}
                  </>
                )}


                {infoUser.code_mention && (
                  <>
                    &nbsp; | &nbsp;
                    🎓{" "}
                    {infoUser.code_mention}
                  </>
                )}

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
                          ROLE_LABELS[
                            role
                          ]
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


export default SuperAdmin;
