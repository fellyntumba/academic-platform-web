import React, { useState, useEffect } from "react";
import "./Promotions.css";
import {
  getParcours,
  creerNiveauPromotion
} from "./promotionservice"; 

const Promotions = ({ code_mention }) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // 🔹 Création
  const [codeParcours, setCodeParcours] = useState([]);
  const [parcour, setParcour] = useState("");
  const [niveauCreate, setNiveauCreate] = useState("");

  // 🔹 Désactivation
  const [selectedIdDeactivate, setSelectedIdDeactivate] = useState("");
  const [niveauDeactivate, setNiveauDeactivate] = useState("");

  /* =====================================================
      🔹 Charger les codes parcours
  ====================================================== */
  useEffect(() => {
    const fetchParcours = async () => {
      const result = await getParcours({ code_mention });

      if (result.success) {
        setCodeParcours(result.data || []);
      } else {
        showMessage(result.message);
      }
    };

    if (code_mention) fetchParcours();
  }, [code_mention]);

  const niveaux = Array.from({ length: 11 }, (_, i) => i); // 0 à 10

  /* =========================
     🔔 Notification
  ========================= */
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  /* =========================
     🔹 Création
  ========================= */
  const handleCreate = async() => {
    if (!parcour || !niveauCreate) {
      return showMessage("Veuillez sélectionner un code-parcours et un niveau.", "error");
    }
    
      const result = await creerNiveauPromotion({code_parcours: parcour, niveau: niveauCreate });
    
      if (!result.success) {
        return showMessage(result.message, "error");
      }
    
      showMessage(result.message, "success");
      setParcour("");
      setNiveauCreate("");
  };

  /* =========================
     🔹 Désactivation
  ========================= */
  const handleDeactivate = () => {
    if (!selectedIdDeactivate || !niveauDeactivate) {
      return showMessage("Veuillez sélectionner un parcours et un niveau.", "error");
    }

    showMessage("Niveau-promotion désactivé avec succès.", "success");
    setSelectedIdDeactivate("");
    setNiveauDeactivate("");
  };

  return (
    <div className="promotions-wrapper">
      <h2>Gestion des promotions</h2>

      {/* Notification centrée en bas */}
      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}

      {/* Deux cartes côte à côte */}
      <div className="top-row">

        {/* Création */}
        <div className="promotion-card fade-in">
          <h3>Créer un niveau-promotion</h3>

          <select
            value={parcour}
            onChange={(e) => setParcour(e.target.value)}
          >
            <option value="">-- Sélectionner un code-parcours --</option>
            {codeParcours.map((c) => (
              <option key={c.id_parcours} value={c.code_parcours}>
                {c.code_parcours}
              </option>
            ))}
          </select> 

          <select
            value={niveauCreate}
            onChange={(e) => setNiveauCreate(e.target.value)}
          >
            <option value="">-- Sélectionner un niveau --</option>
            {niveaux.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <button onClick={handleCreate}>Créer</button>
        </div>

        {/* Désactivation */}
        <div className="promotion-card fade-in"
          style={{
            opacity: 0.5,
            pointerEvents: "none",
            filter: "grayscale(100%)"
          }}
        >
          <h3>Désactiver un niveau-promotion</h3>

          <select
            value={selectedIdDeactivate}
            onChange={(e) => setSelectedIdDeactivate(e.target.value)}
          >
            <option value="">-- Sélectionner un code-parcours --</option>
            {codeParcours.map((c) => (
              <option key={c.id_parcours} value={c.code_parcours}>
                {c.code_parcours}
              </option>
            ))}
          </select>

          {selectedIdDeactivate && (
            <>
              <select
                value={niveauDeactivate}
                onChange={(e) => setNiveauDeactivate(e.target.value)}
              >
                <option value="">-- Sélectionner un niveau --</option>
                {niveaux.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <button onClick={handleDeactivate}>
                Désactiver
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Promotions;