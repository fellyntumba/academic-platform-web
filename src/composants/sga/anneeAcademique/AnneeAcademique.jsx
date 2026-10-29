import React, { useState, useEffect } from "react";
import "./AnneeAcademique.css";
import {
  getCurrentAnneeAcademique,
  createAnneeAcademique,
  cloturerAnneeAcademique,
} from "./anneeAcadService";

const AnneeAcademique = () => {
  const [loading, setLoading] = useState(false);
  const [estEnCours, setEstEnCours] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  // =========================
  // Récupérer l'état actuel
  // =========================
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

  // =========================
  // Lancer nouvelle année
  // =========================
  const handleLancer = async () => {
    if (loading || loadingStatus || estEnCours) return;

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

  // =========================
  // Clôturer année
  // =========================
  const handleCloturer = async () => {
    if (loading || loadingStatus || !estEnCours) return;

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

      {/* =========================
          EN-TÊTE
      ========================= */}
      <div className="annee-header">
        <div>
          <span className="annee-eyebrow">
            GESTION ACADÉMIQUE
          </span>

          <h1>Année académique</h1>

          <p>
            Gérez l'ouverture et la clôture de l'année
            académique de l'établissement.
          </p>
        </div>
      </div>

      {/* =========================
          ÉTAT ACTUEL
      ========================= */}
      <div
        className={`annee-status-card ${
          loadingStatus
            ? "loading"
            : estEnCours
            ? "active"
            : "inactive"
        }`}
      >
        <div className="annee-status-icon">
          {loadingStatus ? (
            <span className="annee-spinner"></span>
          ) : estEnCours ? (
            "✓"
          ) : (
            "○"
          )}
        </div>

        <div className="annee-status-content">
          <span className="annee-status-label">
            ÉTAT ACTUEL
          </span>

          {loadingStatus ? (
            <>
              <strong>Vérification en cours...</strong>
              <p>
                Récupération de l'état de l'année académique.
              </p>
            </>
          ) : estEnCours ? (
            <>
              <strong>Une année académique est en cours</strong>
              <p>
                L'établissement dispose actuellement d'une
                année académique active.
              </p>
            </>
          ) : (
            <>
              <strong>Aucune année académique en cours</strong>
              <p>
                Vous pouvez lancer une nouvelle année
                académique.
              </p>
            </>
          )}
        </div>

        {!loadingStatus && (
          <div className="annee-status-badge">
            {estEnCours ? "ACTIVE" : "INACTIVE"}
          </div>
        )}
      </div>

      {/* =========================
          ACTIONS
      ========================= */}
      <div className="annee-section-header">
        <div>
          <span>ADMINISTRATION</span>
          <h2>Gestion de l'année</h2>
        </div>
      </div>

      <div className="annee-actions">

        {/* =========================
            LANCER
        ========================= */}
        <div
          className={`annee-card ${
            estEnCours ? "disabled-card" : ""
          }`}
        >
          <div className="annee-card-top">
            <div className="annee-card-icon launch">
              <span>▶</span>
            </div>

            <div className="annee-card-status">
              {estEnCours ? "INDISPONIBLE" : "DISPONIBLE"}
            </div>
          </div>

          <div className="annee-card-content">
            <h3>Lancer une nouvelle année</h3>

            <p>
              Créez et activez une nouvelle année académique
              pour permettre le démarrage des activités
              correspondantes.
            </p>
          </div>

          <div className="annee-card-footer">
            <span className="annee-card-info">
              {estEnCours
                ? "Une année est déjà active"
                : "Prêt à être lancé"}
            </span>

            <button
              className="annee-action-button launch"
              onClick={handleLancer}
              disabled={
                loading ||
                loadingStatus ||
                estEnCours
              }
            >
              {loading && !estEnCours ? (
                <>
                  <span className="button-spinner"></span>
                  Traitement...
                </>
              ) : (
                <>
                  <span>▶</span>
                  Lancer l'année
                </>
              )}
            </button>
          </div>
        </div>

        {/* =========================
            CLÔTURER
        ========================= */}
        <div
          className={`annee-card danger ${
            !estEnCours ? "disabled-card" : ""
          }`}
        >
          <div className="annee-card-top">
            <div className="annee-card-icon close">
              <span>■</span>
            </div>

            <div className="annee-card-status">
              {estEnCours ? "DISPONIBLE" : "INDISPONIBLE"}
            </div>
          </div>

          <div className="annee-card-content">
            <h3>Clôturer l'année en cours</h3>

            <p>
              Fermez l'année académique actuellement active.
              Cette opération met fin à la période académique
              en cours.
            </p>
          </div>

          <div className="annee-card-footer">
            <span className="annee-card-info">
              {estEnCours
                ? "Une année est actuellement active"
                : "Aucune année à clôturer"}
            </span>

            <button
              className="annee-action-button close"
              onClick={handleCloturer}
              disabled={
                loading ||
                loadingStatus ||
                !estEnCours
              }
            >
              {loading && estEnCours ? (
                <>
                  <span className="button-spinner"></span>
                  Traitement...
                </>
              ) : (
                <>
                  <span>■</span>
                  Clôturer l'année
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =========================
          NOTIFICATION
      ========================= */}
      {message && (
        <div
          className={`annee-notification ${messageType}`}
        >
          <div className="annee-notification-icon">
            {messageType === "success" ? "✓" : "!"}
          </div>

          <div className="annee-notification-content">
            <strong>
              {messageType === "success"
                ? "Opération réussie"
                : "Opération impossible"}
            </strong>

            <span>{message}</span>
          </div>

          <button
            className="annee-notification-close"
            onClick={() => {
              setMessage("");
              setMessageType("");
            }}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AnneeAcademique;

