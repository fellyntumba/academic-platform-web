import React, { useState, useEffect } from "react";
import "./AnneeAcademique.css";
import {
  getCurrentAnneeAcademique,
  createAnneeAcademique,
  cloturerAnneeAcademique
} from "./anneeAcadService";

const AnneeAcademique = () => {
  const [loading, setLoading] = useState(false);
  const [estEnCours, setEstEnCours] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  //fonction récupérer états des années acad.
  const loadStatus = async () => {
    setLoadingStatus(true);
    const result = await getCurrentAnneeAcademique();

    if (result.success) {
      setEstEnCours(result.EstEnCours);
    }
 
    setLoadingStatus(false);
  };

  useEffect(() => {
    loadStatus();
  }, []);


  /* =======================
     Lancer nouvelle année
  ========================= */
  const handleLancer = async () => {
    setLoading(true);

    const result = await createAnneeAcademique();
    await loadStatus();
    setLoading(false);

    if (result.success) {
      showMessage(result.message, "success");
    } else {
      showMessage(result.message, "error");
    }
  };

  /* =========================
     Clôturer année
  ========================= */
  const handleCloturer = async () => {
    setLoading(true);

    const result = await cloturerAnneeAcademique();
    await loadStatus();
    setLoading(false);

    if (result.success) {
      showMessage(result.message, "success");
    } else {
      showMessage(result.message, "error");
    }
  };

  return (
    <div className="annee-wrapper">

      {/* 🔹 Lancer */}
      <div className="annee-card">
        <h3>Lancer l' année académique</h3>
        <button onClick={handleLancer} disabled={loading || loadingStatus || estEnCours}>
          {loading ? "Traitement..." : "Lancer l'année"}
        </button>
      </div>

      {/* 🔹 Clôturer */}
      <div className="annee-card danger">
        <h3>Clôturer l'année académique en cours</h3>
        <button onClick={handleCloturer} disabled={loading || loadingStatus || !estEnCours}>
          {loading ? "Traitement..." : "Clôturer l'année"}
        </button>
      </div>

      {/* 🔔 Notification globale */}
      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}

    </div>
  );
};

export default AnneeAcademique;
