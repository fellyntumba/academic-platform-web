import React, { useEffect, useState } from "react";
import "./SuperAdminManager.css";

import {
  getAllSga,
  getEnseignantsStatsService,
  creerSga,
  modifierStatutSga,
} from "./superAdminManagerService";

const SuperAdminManager = () => {
  const [mode, setMode] = useState("create");

  /* =========================
     Données SGA
  ========================= */
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [matricule, setMatricule] = useState("");

  const [idSga, setIdSga] = useState("");
  const [statut, setStatut] = useState("");

  /* =========================
     Listes
  ========================= */
  const [listEnseignants, setListEnseignants] = useState([]);
  const [listSga, setListSga] = useState([]);

  /* =========================
     Notification
  ========================= */
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* =========================
     Loading
  ========================= */
  const [loading, setLoading] = useState(false);
  const [loadingEnseignants, setLoadingEnseignants] = useState(false);
  const [loadingSga, setLoadingSga] = useState(false);

  /* =========================
     Notification globale
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
     Charger les enseignants
  ========================= */
  useEffect(() => {
    const loadEnseignants = async () => {
      setLoadingEnseignants(true);

      try {
        const data = await getEnseignantsStatsService();

        setListEnseignants(data || []);
      } catch (error) {
        console.error(
          "Erreur chargement enseignants pour SGA :",
          error
        );

        setListEnseignants([]);
      } finally {
        setLoadingEnseignants(false);
      }
    };

    loadEnseignants();
  }, []);

  /* =========================
     Charger les SGA
  ========================= */
  const loadSga = async () => {
    setLoadingSga(true);

    try {
      const data = await getAllSga();

      if (data.success) {
        setListSga(data.admins || []);
      } else {
        setListSga([]);

        showMessage(
          data.message ||
            "Aucun Secrétaire Général Académique trouvé.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Erreur chargement SGA :",
        error
      );

      setListSga([]);

      showMessage(
        "Erreur lors du chargement des Secrétaires Généraux Académiques.",
        "error"
      );
    } finally {
      setLoadingSga(false);
    }
  };

  /* =========================
     Charger les SGA en modification
  ========================= */
  useEffect(() => {
    if (mode === "modified") {
      loadSga();
    }
  }, [mode]);

  /* =========================
     Sélection enseignant
  ========================= */
  const handleSelectEnseignant = (e) => {
    const selectedMatricule = e.target.value;

    if (!selectedMatricule) {
      setMatricule("");
      setNom("");
      setEmail("");
      return;
    }

    const enseignant = listEnseignants.find(
      (item) =>
        String(item.matricule) ===
        String(selectedMatricule)
    );

    if (!enseignant) {
      setMatricule("");
      setNom("");
      setEmail("");

      showMessage(
        "Enseignant introuvable.",
        "error"
      );

      return;
    }

    setMatricule(
      enseignant.matricule || ""
    );

    setNom(
      enseignant.nom || ""
    );

    setEmail(
      enseignant.email || ""
    );
  };

  /* =========================
     Sélection SGA
  ========================= */
  const handleSelectSgaModification = (e) => {
    const selectedIdSga = e.target.value;

    if (!selectedIdSga) {
      setIdSga("");
      setStatut("");
      return;
    }

    const sga = listSga.find(
      (item) =>
        String(item.id_admin) ===
        String(selectedIdSga)
    );

    if (!sga) {
      setIdSga("");
      setStatut("");

      showMessage(
        "Secrétaire Général Académique introuvable.",
        "error"
      );

      return;
    }

    setIdSga(
      String(sga.id_admin)
    );

    setStatut(
      sga.statut || ""
    );
  };

  /* =========================
     Changer de mode
  ========================= */
  const handleChangeMode = (newMode) => {
    setMode(newMode);

    setNom("");
    setEmail("");
    setMatricule("");

    setIdSga("");
    setStatut("");

    setListSga([]);

    setMessage("");
    setMessageType("");
  };

  /* =========================
     Soumission
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;

    /* =========================
       CRÉATION
    ========================= */
    if (mode === "create") {
      if (!matricule.trim()) {
        return showMessage(
          "Veuillez sélectionner un enseignant.",
          "error"
        );
      }

      if (!nom.trim()) {
        return showMessage(
          "Nom requis.",
          "error"
        );
      }

      if (!email.trim()) {
        return showMessage(
          "Email requis.",
          "error"
        );
      }

      setLoading(true);

      try {
        result = await creerSga({
          nom,
          email,
        });
      } finally {
        setLoading(false);
      }
    }

    /* =========================
       MODIFICATION
    ========================= */
    else if (mode === "modified") {
      if (!idSga) {
        return showMessage(
          "Veuillez sélectionner un Secrétaire Général Académique.",
          "error"
        );
      }

      if (!statut.trim()) {
        return showMessage(
          "Statut du Secrétaire Général Académique introuvable.",
          "error"
        );
      }

      setLoading(true);

      try {
        result = await modifierStatutSga({
          id_admin: idSga,
          statut,
        });
      } finally {
        setLoading(false);
      }
    }

    /* =========================
       TRAITEMENT RÉSULTAT
    ========================= */
    if (result?.success) {
      showMessage(
        result.message,
        "success"
      );

      setNom("");
      setEmail("");
      setMatricule("");

      setIdSga("");
      setStatut("");

      setListSga([]);

      if (mode === "modified") {
        await loadSga();
      }
    } else {
      showMessage(
        result?.message ||
          "Une erreur est survenue.",
        "error"
      );
    }
  };

  const selectedSga = listSga.find(
    (item) =>
      String(item.id_admin) ===
      String(idSga)
  );

  return (
    <div className="admin-fac-wrapper fade-in">

      {/* =========================
          HEADER
      ========================= */}
      <div className="sga-page-header">

        <div className="sga-header-left">

          <div className="sga-header-icon">
            <span>SG</span>
          </div>

          <div>
            <span className="sga-eyebrow">
              ADMINISTRATION ACADÉMIQUE
            </span>

            <h2>
              Gestion des SGA
            </h2>

            <p>
              Gérez les Secrétaires Généraux
              Académiques de l'établissement.
            </p>
          </div>

        </div>

        <div className="sga-counter">

          <span>
            SGA ENREGISTRÉS
          </span>

          <strong>
            {listSga.length}
          </strong>

        </div>

      </div>

      {/* =========================
          CARTE PRINCIPALE
      ========================= */}
      <div className="admin-fac-form-container">

        {/* =========================
            HEADER ACTION
        ========================= */}
        <div className="sga-action-header">

          <div>
            <span className="section-eyebrow">
              ACTION
            </span>

            <h3>
              {mode === "create"
                ? "Créer un SGA"
                : "Modifier un SGA"}
            </h3>
          </div>

          {/* =========================
              MODE SWITCH
          ========================= */}
          <div className="mode-switch">

            <button
              type="button"
              className={
                mode === "create"
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleChangeMode("create")
              }
              disabled={loading}
            >
              <span className="mode-icon">
                +
              </span>

              Création
            </button>

            <button
              type="button"
              className={
                mode === "modified"
                  ? "active modification"
                  : ""
              }
              onClick={() =>
                handleChangeMode("modified")
              }
              disabled={loading}
            >
              <span className="mode-icon">
                ↗
              </span>

              Modification
            </button>

          </div>

        </div>

        {/* =========================
            FORMULAIRE
        ========================= */}
        <form
          className="admin-fac-form"
          onSubmit={handleSubmit}
        >

          {/* =========================
              CRÉATION
          ========================= */}
          {mode === "create" && (
            <div className="sga-form-content">

              <div className="sga-introduction">

                <div className="sga-introduction-icon">
                  +
                </div>

                <div>
                  <strong>
                    Nommer un Secrétaire Général Académique
                  </strong>

                  <span>
                    Sélectionnez d'abord un enseignant
                    enregistré dans l'établissement.
                  </span>
                </div>

              </div>

              <div className="form-field">

                <label>
                  Enseignant
                </label>

                <select
                  value={matricule}
                  onChange={handleSelectEnseignant}
                  required
                  disabled={
                    loading ||
                    loadingEnseignants
                  }
                >
                  <option value="">
                    {loadingEnseignants
                      ? "Chargement des enseignants..."
                      : "Sélectionner un enseignant"}
                  </option>

                  {listEnseignants.map(
                    (enseignant) => (
                      <option
                        key={
                          enseignant.matricule
                        }
                        value={
                          enseignant.matricule
                        }
                      >
                        {enseignant.titre
                          ? `${enseignant.titre}. `
                          : ""}
                        {enseignant.nom}
                        {" — "}
                        {enseignant.matricule}
                      </option>
                    )
                  )}
                </select>

              </div>

              {matricule && (
                <div className="sga-selected-card">

                  <div className="sga-avatar">
                    {nom
                      ?.charAt(0)
                      ?.toUpperCase() || "E"}
                  </div>

                  <div className="sga-selected-info">

                    <strong>
                      {nom}
                    </strong>

                    <span>
                      {email}
                    </span>

                    <span>
                      Matricule : {matricule}
                    </span>

                  </div>

                  <div className="selection-badge">
                    Sélectionné
                  </div>

                </div>
              )}

              {nom && (
                <div className="form-grid">

                  <div className="form-field">
                    <label>
                      Nom du SGA
                    </label>

                    <input
                      type="text"
                      value={nom}
                      readOnly
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      Adresse email
                    </label>

                    <input
                      type="email"
                      value={email}
                      readOnly
                    />
                  </div>

                </div>
              )}

            </div>
          )}

          {/* =========================
              MODIFICATION
          ========================= */}
          {mode === "modified" && (
            <div className="sga-form-content">

              <div className="sga-introduction modification">

                <div className="sga-introduction-icon">
                  ↗
                </div>

                <div>
                  <strong>
                    Gérer le statut d'un SGA
                  </strong>

                  <span>
                    Sélectionnez un Secrétaire Général
                    Académique pour modifier son statut.
                  </span>
                </div>

              </div>

              <div className="form-field">

                <label>
                  Secrétaire Général Académique
                </label>

                <select
                  value={idSga}
                  onChange={
                    handleSelectSgaModification
                  }
                  required
                  disabled={
                    loading ||
                    loadingSga
                  }
                >
                  <option value="">
                    {loadingSga
                      ? "Chargement des SGA..."
                      : "Sélectionner un Secrétaire Général Académique"}
                  </option>

                  {listSga.map((sga) => (
                    <option
                      key={sga.id_admin}
                      value={sga.id_admin}
                    >
                      {sga.nom}
                      {" — "}
                      {sga.statut}
                    </option>
                  ))}
                </select>

              </div>

              {idSga && (
                <div className="sga-selected-card">

                  <div className="sga-avatar modification-avatar">
                    {selectedSga?.nom
                      ?.charAt(0)
                      ?.toUpperCase() || "S"}
                  </div>

                  <div className="sga-selected-info">

                    <strong>
                      {selectedSga?.nom || "SGA"}
                    </strong>

                    <span>
                      {selectedSga?.email || ""}
                    </span>

                    <span>
                      Identifiant : {idSga}
                    </span>

                  </div>

                  <div
                    className={`status-badge ${
                      statut === "actif"
                        ? "active-status"
                        : "inactive-status"
                    }`}
                  >
                    <span></span>

                    {statut === "actif"
                      ? "Actif"
                      : "Inactif"}
                  </div>

                </div>
              )}

              {idSga && statut && (
                <div className="form-field">

                  <label>
                    Statut du SGA
                  </label>

                  <select
                    value={statut}
                    onChange={(e) =>
                      setStatut(e.target.value)
                    }
                    required
                    disabled={loading}
                  >
                    <option value="actif">
                      Actif
                    </option>

                    <option value="inactif">
                      Inactif
                    </option>
                  </select>

                </div>
              )}

            </div>
          )}

          {/* =========================
              BOUTON
          ========================= */}
          <button
            type="submit"
            className={`sga-submit ${
              mode === "modified"
                ? "modification-submit"
                : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>

                {mode === "create"
                  ? "Création..."
                  : "Modification..."}
              </>
            ) : (
              <>
                <span>
                  {mode === "create"
                    ? "+"
                    : "✓"}
                </span>

                {mode === "create"
                  ? "Créer le SGA"
                  : "Enregistrer le statut"}
              </>
            )}
          </button>

        </form>

      </div>

      {/* =========================
          NOTIFICATION
      ========================= */}
      {message && (
        <div
          className={`notification ${messageType}`}
        >

          <div className="notification-icon">
            {messageType === "success"
              ? "✓"
              : "!"}
          </div>

          <div className="notification-content">

            <strong>
              {messageType === "success"
                ? "Opération réussie"
                : "Opération impossible"}
            </strong>

            <span>
              {message}
            </span>

          </div>

          <button
            type="button"
            className="notification-close"
            onClick={() => {
              setMessage("");
              setMessageType("");
            }}
          >
            ×
          </button>

        </div>
      )}

    </div>
  );
};

export default SuperAdminManager;

