import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import AuthModalSuper from "../super-admin/authentification/AuthModalSuper";
import AuthModalAdmin from "../administrateurs/authentification/AuthModalAdmin";
import AuthModalEns from "../enseignants/authentification/AuthModalEns";
import AuthModalMention from "../chef-mention/authentification/AuthModalMention";

import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";

const roles = [
  { title: "Super Admin", desc: "Gestion centrale", icon: "🛡️" },
  { title: "Admin. Fac", desc: "Gestion de la faculté", icon: "🏛️" },
  { title: "Chef-mention", desc: "Gestion de la mention", icon: "📚" },
  { title: "Enseignant", desc: "Gestion de notes / recours", icon: "🎓" },
];

const Home = () => {
  const [authSuperAd, setAuthSuperAd] = useState(false);
  const [authAdFac, setAuthAdFac] = useState(false);
  const [authAdminMention, setAuthAdminMention] = useState(false);
  const [authEns, setAuthEns] = useState(false);

  const { infoUniv, loading } = useContextUniv();
  const navigate = useNavigate();
 
  // Attendre chargement features
  if (loading) {
    return <div>Chargement...</div>;
  }
  // {infoUniv && console.log(infoUniv?.primaryColor);
  // }

  const rolesWithState = roles.map((role) => {

    // 🔒 Enseignant désactivé si REPORTS absent
    const disabled = role.title === "Enseignant" && !infoUniv.features.includes("STUDENTS");

    return {
      ...role,
      disabled,
    };
  });

  const handleAccess = (roleTitle) => {
    if (roleTitle === "Super Admin") setAuthSuperAd(true);
    if (roleTitle === "Admin. Fac") setAuthAdFac(true);
    if (roleTitle === "Chef-mention") setAuthAdminMention(true);
    if (roleTitle === "Enseignant") setAuthEns(true);
  };
 
  return (
    <div className="home">
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
      </header>

      <section className="roles-split">
        {rolesWithState.map((role) => (
          <div
            key={role.title}
            className={`role-panel ${role.disabled ? "disabled" : ""}`}
          >
            <span className="icon">{role.icon}</span>
            <h2>{role.title}</h2>
            <p>{role.desc}</p>
            <button
              disabled={role.disabled}
              onClick={() => handleAccess(role.title)}
            >
              {role.disabled ? "Indisponible" : "Accéder"}
            </button>
          </div>
        ))}
      </section>

      {/* MODALS */}
      {authSuperAd && (
        <AuthModalSuper
          onAuthenticated={() => navigate("/super-admin")}
          onClose={() => setAuthSuperAd(false)}
        />
      )}

      {authAdFac && (
        <AuthModalAdmin
          onAuthenticated={() => navigate("/admin-fac")}
          onClose={() => setAuthAdFac(false)}
        />
      )}

      {authAdminMention && (
        <AuthModalMention
          onAuthenticated={() => navigate("/admin-mention")}
          onClose={() => setAuthAdminMention(false)}
        />
      )}

      {authEns && (
        <AuthModalEns
          onAuthenticated={() => navigate("/enseignant")}
          onClose={() => setAuthEns(false)}
        />
      )}

      <footer className="home-footer">
        Plateforme académique intelligente et sécurisée
      </footer>
    </div>
  );
};

export default Home;