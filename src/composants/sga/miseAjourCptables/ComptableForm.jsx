import React, { useEffect, useState } from "react";
import "./ComptableForm.css";

import {
  creerComptable,
  modifierStatutComptable,
  getComptablesUniversite,
} from "./comptableService";

const ComptableForm = () => {
  /* =====================================================
     MODE
  ===================================================== */

  const [mode, setMode] = useState("create");

  /* =====================================================
     CRÉATION / DONNÉES COMMUNES
  ===================================================== */

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  /* =====================================================
     MODIFICATION
  ===================================================== */

  const [listComptables, setListComptables] = useState([]);
  const [idComptable, setIdComptable] = useState("");
  const [statut, setStatut] = useState("");

  /* =====================================================
     NOTIFICATION
  ===================================================== */

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* =====================================================
     LOADING
  ===================================================== */

  const [loading, setLoading] = useState(false);
  const [loadingComptables, setLoadingComptables] = useState(false);

  /* =====================================================
     NOTIFICATION GLOBALE
  ===================================================== */

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  /* =====================================================
     CHARGER LES COMPTABLES
  ===================================================== */

  const loadComptables = async () => {
    setLoadingComptables(true);

    try {
      const result = await getComptablesUniversite();

      if (result.success) {
        setListComptables(result.comptables || []);
      } else {
        setListComptables([]);

        showMessage(
          result.message ||
            "Impossible de récupérer les comptables.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Erreur chargement comptables :",
        error
      );

      setListComptables([]);

      showMessage(
        "Erreur lors du chargement des comptables.",
        "error"
      );
    } finally {
      setLoadingComptables(false);
    }
  };

  /* =====================================================
     CHARGEMENT INITIAL
  ===================================================== */

  useEffect(() => {
    loadComptables();
  }, []);

  /* =====================================================
     SÉLECTION COMPTABLE
  ===================================================== */

  const handleSelectComptable = (e) => {
    const selectedId = e.target.value;

    if (!selectedId) {
      setIdComptable("");
      setNom("");
      setEmail("");
      setTelephone("");
      setStatut("");
      return;
    }

    const comptable = listComptables.find(
      (item) =>
        String(item.id_comptable) ===
        String(selectedId)
    );

    if (!comptable) {
      setIdComptable("");
      setNom("");
      setEmail("");
      setTelephone("");
      setStatut("");

      showMessage(
        "Comptable introuvable.",
        "error"
      );

      return;
    }

    setIdComptable(
      String(comptable.id_comptable)
    );

    setNom(comptable.nom || "");
    setEmail(comptable.email || "");
    setTelephone(comptable.telephone || "");
    setStatut(comptable.statut || "");
  };

  /* =====================================================
     CHANGEMENT DE MODE
  ===================================================== */

  const handleChangeMode = (newMode) => {
    setMode(newMode);

    setNom("");
    setEmail("");
    setTelephone("");
    setIdComptable("");
    setStatut("");

    setMessage("");
    setMessageType("");

    if (newMode === "modified") {
      loadComptables();
    }
  };

  /* =====================================================
     SOUMISSION
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;

    /* ===================================================
       CRÉATION
    =================================================== */

    if (mode === "create") {
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
        result = await creerComptable({
          nom: nom.trim(),
          email: email.trim(),
          telephone: telephone.trim(),
        });
      } finally {
        setLoading(false);
      }
    }

    /* ===================================================
       MODIFICATION
    =================================================== */

    else if (mode === "modified") {
      if (!idComptable) {
        return showMessage(
          "Veuillez sélectionner un comptable.",
          "error"
        );
      }

      if (!statut) {
        return showMessage(
          "Veuillez sélectionner le statut du comptable.",
          "error"
        );
      }

      setLoading(true);

      try {
        result = await modifierStatutComptable({
          id_comptable: idComptable,
          statut,
        });
      } finally {
        setLoading(false);
      }
    }

    /* ===================================================
       TRAITEMENT DU RÉSULTAT
    =================================================== */

    if (result?.success) {
      showMessage(
        result.message,
        "success"
      );

      setNom("");
      setEmail("");
      setTelephone("");
      setIdComptable("");
      setStatut("");

      await loadComptables();
    } else {
      showMessage(
        result?.message ||
          "Une erreur est survenue.",
        "error"
      );
    }
  };

  /* =====================================================
     COMPTABLE SÉLECTIONNÉ
  ===================================================== */

  const selectedComptable =
    listComptables.find(
      (item) =>
        String(item.id_comptable) ===
        String(idComptable)
    );

  return (
    <div className="comptable-wrapper fade-in">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="comptable-page-header">

        <div className="comptable-header-left">

          <div className="comptable-header-icon">
            <span>₣</span>
          </div>

          <div>
            <span className="comptable-eyebrow">
              ADMINISTRATION FINANCIÈRE
            </span>

            <h2>
              Gestion des comptables
            </h2>

            <p>
              Créez les comptes comptables et
              gérez leur statut au sein de
              l'établissement.
            </p>
          </div>

        </div>

        <div className="comptable-counter">

          <span>
            COMPTABLES
          </span>

          <strong>
            {listComptables.length}
          </strong>

        </div>

      </div>

      {/* =================================================
          CARTE PRINCIPALE
      ================================================= */}

      <div className="comptable-form-container">

        {/* =================================================
            SWITCH MODE
        ================================================= */}

        <div className="comptable-mode-header">

          <div>
            <span className="section-eyebrow">
              ACTION
            </span>

            <h3>
              {mode === "create"
                ? "Nouveau comptable"
                : "Gestion d'un comptable"}
            </h3>
          </div>

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

        {/* =================================================
            FORMULAIRE
        ================================================= */}

        <form
          className="comptable-form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              CRÉATION
          ================================================= */}

          {mode === "create" && (
            <div className="comptable-form-content">

              <div className="form-introduction">
                <div className="form-introduction-icon">
                  +
                </div>

                <div>
                  <strong>
                    Créer un compte comptable
                  </strong>

                  <span>
                    Renseignez les informations
                    principales du comptable.
                  </span>
                </div>
              </div>

              <div className="form-grid">

                <div className="form-field full">
                  <label>
                    Nom complet
                  </label>

                  <input
                    type="text"
                    value={nom}
                    onChange={(e) =>
                      setNom(e.target.value)
                    }
                    placeholder="Ex. Jean Dupont"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-field">
                  <label>
                    Adresse email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="exemple@universite.cd"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-field">
                  <label>
                    Téléphone
                    <span>
                      Facultatif
                    </span>
                  </label>

                  <input
                    type="tel"
                    value={telephone}
                    onChange={(e) =>
                      setTelephone(e.target.value)
                    }
                    placeholder="+243 ..."
                    disabled={loading}
                  />
                </div>

              </div>

            </div>
          )}

          {/* =================================================
              MODIFICATION
          ================================================= */}

          {mode === "modified" && (
            <div className="comptable-form-content">

              <div className="form-introduction modification-intro">
                <div className="form-introduction-icon">
                  ↗
                </div>

                <div>
                  <strong>
                    Modifier le statut
                  </strong>

                  <span>
                    Sélectionnez un comptable puis
                    définissez son statut.
                  </span>
                </div>
              </div>

              <div className="form-field full">

                <label>
                  Comptable
                </label>

                <select
                  value={idComptable}
                  onChange={
                    handleSelectComptable
                  }
                  required
                  disabled={
                    loading ||
                    loadingComptables
                  }
                >
                  <option value="">
                    {loadingComptables
                      ? "Chargement des comptables..."
                      : "Sélectionner un comptable"}
                  </option>

                  {listComptables.map(
                    (comptable) => (
                      <option
                        key={
                          comptable.id_comptable
                        }
                        value={
                          comptable.id_comptable
                        }
                      >
                        {comptable.nom}
                        {" — "}
                        {comptable.email}
                        {" — "}
                        {comptable.statut}
                      </option>
                    )
                  )}
                </select>

              </div>

              {idComptable && (
                <div className="selected-comptable-card">

                  <div className="selected-avatar">
                    {nom
                      ?.charAt(0)
                      ?.toUpperCase() || "C"}
                  </div>

                  <div className="selected-comptable-info">

                    <strong>
                      {nom}
                    </strong>

                    <span>
                      {email}
                    </span>

                    {telephone && (
                      <span>
                        {telephone}
                      </span>
                    )}

                  </div>

                  <div
                    className={`current-status ${
                      statut === "actif"
                        ? "status-active"
                        : "status-inactive"
                    }`}
                  >
                    <span></span>

                    {statut === "actif"
                      ? "Actif"
                      : "Inactif"}
                  </div>

                </div>
              )}

              {idComptable && (
                <div className="form-field full">

                  <label>
                    Nouveau statut
                  </label>

                  <select
                    value={statut}
                    onChange={(e) =>
                      setStatut(e.target.value)
                    }
                    required
                    disabled={loading}
                  >
                    <option value="">
                      Sélectionner le statut
                    </option>

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

          {/* =================================================
              BOUTON
          ================================================= */}

          <button
            type="submit"
            className={`comptable-submit ${
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
                  ? "Créer le comptable"
                  : "Enregistrer le statut"}
              </>
            )}
          </button>

        </form>

      </div>

      {/* =================================================
          NOTIFICATION
      ================================================= */}

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

export default ComptableForm;

