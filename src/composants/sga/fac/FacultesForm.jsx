import React, { useEffect, useState } from "react";
import "./FacultesForm.css";
import {
  creerFaculte,
  modifierFaculte,
  getCodeFacBDuniv,
  desactiverFaculte,
  getCodesFacultesConfig,
} from "./facultesService";

const FacultesForm = () => {
  const [facultes, setFacultes] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [nouveau_code, setNouveau_code] = useState("");
  const [selectedIdDeactivate, setSelectedIdDeactivate] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [nomFaculte, setNomFaculte] = useState("");
  const [facultesConfig, setFacultesConfig] = useState([]);

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDeactivate, setLoadingDeactivate] = useState(false);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  // Récupérer les facultés configurées pour une université
  const loadFacultesConfig = async () => {
    try {
      const data = await getCodesFacultesConfig();

      setFacultesConfig(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      alert(
        "Erreur chargement configuration : " +
          error.message
      );
    }
  };

  // Récupérer les code-facs
  const loadFacultes = async () => {
    const result = await getCodeFacBDuniv();

    if (result.success) {
      setFacultes(result.data);
    } else {
      showMessage(result.message, "error");
    }
  };

  useEffect(() => {
    loadFacultes();
    loadFacultesConfig();
  }, []);

  // Création
  const handleCreate = async () => {
    if (!nomFaculte.trim()) {
      return showMessage("Code-fac requis", "error");
    }

    setLoadingCreate(true);

    try {
      const result = await creerFaculte({
        code_faculte: nomFaculte,
      });

      if (result.success) {
        showMessage(result.message, "success");
        setNomFaculte("");
        loadFacultes();
      } else {
        showMessage(result.message, "error");
      }
    } finally {
      setLoadingCreate(false);
    }
  };

  // Sélection pour modification
  const handleSelect = (id) => {
    const fac = facultes.find(
      (f) => f.id_faculte === Number(id)
    );

    setSelectedId(id);
    setNouveau_code(fac?.code_faculte || "");
  };

  // Modification
  const handleUpdate = async () => {
    if (!selectedId) {
      return showMessage(
        "Sélectionnez une faculté",
        "error"
      );
    }

    if (!nouveau_code.trim()) {
      return showMessage(
        "Nouveau code requis",
        "error"
      );
    }

    const fac = facultes.find(
      (f) => f.id_faculte === Number(selectedId)
    );

    setLoadingUpdate(true);

    try {
      const result = await modifierFaculte({
        ancien_code: fac.code_faculte,
        nouveau_code,
      });

      if (result.success) {
        showMessage(result.message, "success");
        loadFacultes();
        setSelectedId("");
        setNouveau_code("");
      } else {
        showMessage(result.message, "error");
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Désactivation
  const handleDeactivate = async () => {
    if (!selectedIdDeactivate) {
      return showMessage(
        "Sélectionnez un code fac",
        "error"
      );
    }

    setLoadingDeactivate(true);

    try {
      const result = await desactiverFaculte({
        id_faculte: selectedIdDeactivate,
      });

      if (result.success) {
        showMessage(
          result.message,
          "success"
        );

        setSelectedIdDeactivate("");
        loadFacultes();
      } else {
        showMessage(
          result.message,
          "error"
        );
      }
    } finally {
      setLoadingDeactivate(false);
    }
  };

  return (
    <div className="facultes-wrapper fade-in">

      {/* En-tête */}
      <div className="facultes-page-header">
        <div className="facultes-header-left">
          <div className="facultes-header-icon">
            <span>▦</span>
          </div>

          <div>
            <span className="facultes-eyebrow">
              ADMINISTRATION ACADÉMIQUE
            </span>

            <h2>Gestion des facultés</h2>

            <p>
              Gérez les codes facultés associés à
              l'établissement.
            </p>
          </div>
        </div>

        <div className="facultes-count">
          <span>FACULTÉS ACTIVES</span>
          <strong>{facultes.length}</strong>
        </div>
      </div>

      {/* Notification */}
      {message && (
        <div
          className={`notification ${messageType}`}
        >
          <div className="notification-icon">
            {messageType === "success" ? "✓" : "!"}
          </div>

          <div className="notification-content">
            <strong>
              {messageType === "success"
                ? "Opération réussie"
                : "Opération impossible"}
            </strong>

            <span>{message}</span>
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

      {/* Première ligne */}
      <div className="facultes-top-row">

        {/* Création */}
        <div className="facultes-card">

          <div className="facultes-card-header">
            <div className="facultes-card-icon blue">
              +
            </div>

            <div>
              <span className="facultes-card-eyebrow">
                NOUVELLE CONFIGURATION
              </span>

              <h3>Créer un code-fac</h3>

              <p>
                Ajoutez une faculté à l'établissement.
              </p>
            </div>
          </div>

          <div className="facultes-form-group">
            <label>
              Code faculté
            </label>

            <select
              className="faculte-select"
              value={nomFaculte}
              onChange={(e) =>
                setNomFaculte(e.target.value)
              }
              disabled={loadingCreate}
            >
              <option value="">
                Sélectionner un code faculté
              </option>

              {facultesConfig.map((fac) => (
                <option
                  key={fac.code}
                  value={fac.code}
                >
                  {fac.code} - {fac.nom}
                </option>
              ))}
            </select>
          </div>

          <button
            className="facultes-action-btn primary"
            onClick={handleCreate}
            disabled={loadingCreate}
          >
            {loadingCreate ? (
              <>
                <span className="button-spinner"></span>
                Création...
              </>
            ) : (
              <>
                <span>+</span>
                Créer la faculté
              </>
            )}
          </button>
        </div>

        {/* Modification */}
        <div className="facultes-card">

          <div className="facultes-card-header">
            <div className="facultes-card-icon indigo">
              ↗
            </div>

            <div>
              <span className="facultes-card-eyebrow">
                MODIFICATION
              </span>

              <h3>Modifier un code-fac</h3>

              <p>
                Modifiez le code d'une faculté existante.
              </p>
            </div>
          </div>

          <div className="facultes-form-group">
            <label>
              Faculté à modifier
            </label>

            <select
              value={selectedId}
              onChange={(e) =>
                handleSelect(e.target.value)
              }
              disabled={loadingUpdate}
            >
              <option value="">
                Sélectionner une faculté
              </option>

              {facultes.map((f) => (
                <option
                  key={f.id_faculte}
                  value={f.id_faculte}
                >
                  {f.code_faculte}
                </option>
              ))}
            </select>
          </div>

          {selectedId && (
            <div className="facultes-edit-zone">

              <div className="facultes-form-group">
                <label>
                  Nouveau code-fac
                </label>

                <input
                  type="text"
                  placeholder="Ex. FSCI"
                  value={nouveau_code}
                  onChange={(e) =>
                    setNouveau_code(e.target.value)
                  }
                  disabled={loadingUpdate}
                />
              </div>

              <button
                className="facultes-action-btn secondary"
                onClick={handleUpdate}
                disabled={loadingUpdate}
              >
                {loadingUpdate ? (
                  <>
                    <span className="button-spinner"></span>
                    Modification...
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Désactivation */}
      <div className="facultes-card facultes-danger-card">

        <div className="facultes-card-header">

          <div className="facultes-card-icon red">
            !
          </div>

          <div>
            <span className="facultes-card-eyebrow danger-text">
              ACTION SENSIBLE
            </span>

            <h3>Désactiver un code-fac</h3>

            <p>
              Retirez une faculté de la configuration active.
            </p>
          </div>
        </div>

        <div className="facultes-danger-content">

          <div className="facultes-form-group">
            <label>
              Faculté à désactiver
            </label>

            <select
              value={selectedIdDeactivate}
              onChange={(e) =>
                setSelectedIdDeactivate(e.target.value)
              }
              disabled={loadingDeactivate}
            >
              <option value="">
                Sélectionner une faculté
              </option>

              {facultes.map((f) => (
                <option
                  key={f.id_faculte}
                  value={f.id_faculte}
                >
                  {f.code_faculte}
                </option>
              ))}
            </select>
          </div>

          {selectedIdDeactivate && (
            <button
              className="facultes-action-btn danger"
              onClick={handleDeactivate}
              disabled={loadingDeactivate}
            >
              {loadingDeactivate ? (
                <>
                  <span className="button-spinner"></span>
                  Désactivation...
                </>
              ) : (
                <> 
                  <span>×</span>
                  Désactiver
                </>
              )}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default FacultesForm;

