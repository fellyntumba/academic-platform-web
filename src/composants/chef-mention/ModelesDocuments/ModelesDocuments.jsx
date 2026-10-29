
import React, { useRef, useState } from "react";

import "./ModelesDocuments.css";
import { enregistrerModeleDocumentService } from "./modeleDocumentService";

const TYPES_DOCUMENTS = [
  {
    value: "releves",
    label: "Relevé de notes",
    description: "Modèle HTML des relevés de notes",
  },
  {
    value: "bulletins",
    label: "Bulletin",
    description: "Modèle HTML des bulletins",
  },
  {
    value: "attestations",
    label: "Attestation de réussite",
    description: "Modèle HTML des attestations",
  },
  {
    value: "lettres_stage",
    label: "Lettre de stage",
    description: "Modèle HTML des lettres de stage",
  },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ModelesDocuments = ({ code_mention }) => {
  const fileInputRef = useRef(null);

  const [typeDocument, setTypeDocument] = useState("");
  const [fichier, setFichier] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  // ============================================================
  // CHANGEMENT DU TYPE DE DOCUMENT
  // ============================================================

  const handleTypeChange = (event) => {
    setTypeDocument(event.target.value);
    setNotification(null);
  };

  // ============================================================
  // SÉLECTION ET VALIDATION DU FICHIER
  // ============================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setNotification(null);

    if (!file) {
      setFichier(null);
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!["html", "htm"].includes(extension)) {
      setFichier(null);
      event.target.value = "";

      showNotification(
        "Sélectionnez un fichier HTML (.html ou .htm).",
        "error"
      );

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFichier(null);
      event.target.value = "";

      showNotification(
        "Le fichier ne doit pas dépasser 10 Mo.",
        "error"
      );

      return;
    }

    setFichier(file);
  };

  // ============================================================
  // RÉINITIALISATION DU FORMULAIRE
  // ============================================================

  const resetForm = () => {
    setTypeDocument("");
    setFichier(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================================
  // ENREGISTREMENT DU MODÈLE
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotification(null);

    // Le code de mention provient des propriétés du composant.
    const codeMention = code_mention?.trim();

    if (!codeMention) {
      showNotification(
        "Le code de votre mention est indisponible. Vérifiez les informations transmises au composant.",
        "error"
      );

      return;
    }

    if (!typeDocument) {
      showNotification(
        "Veuillez sélectionner un type de document.",
        "error"
      );

      return;
    }

    if (!fichier) {
      showNotification(
        "Veuillez sélectionner le fichier HTML du modèle.",
        "error"
      );

      return;
    }

    const confirmation = window.confirm(
      "Confirmer l'enregistrement de ce modèle de document ?"
    );

    if (!confirmation) return;

    setIsSubmitting(true);

    try {
      // Appel du service avec les noms attendus par le backend.
      const result = await enregistrerModeleDocumentService({
        typeDocument,
        codeMention,
        fichier,
      });

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "L'enregistrement du modèle a échoué."
        );
      }

      showNotification(
        result.message ||
          "Modèle enregistré avec succès.",
        "success"
      );

      resetForm();
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement du modèle :",
        error
      );

      showNotification(
        error.message ||
          "Une erreur est survenue lors de l'enregistrement.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // TYPE SÉLECTIONNÉ
  // ============================================================

  const typeSelectionne = TYPES_DOCUMENTS.find(
    (type) => type.value === typeDocument
  );

  // ============================================================
  // AFFICHAGE
  // ============================================================

  return (
    <div className="modeles-documents-page">
      <div className="modeles-documents-container">
        <header className="modeles-documents-header">
          <div className="modeles-documents-heading-icon">
            <span aria-hidden="true">▤</span>
          </div>

          <div className="modeles-documents-heading-content">
            <span className="modeles-documents-eyebrow">
              CONFIGURATION ACADÉMIQUE
            </span>

            <h2>Gestion des modèles de documents</h2>

            <p>
              Configurez les fichiers HTML utilisés pour générer
              les documents académiques de votre mention.
            </p>
          </div>
        </header>

        <div className="modeles-documents-info">
          <span
            className="modeles-documents-info-icon"
            aria-hidden="true"
          >
            i
          </span>

          <p>
            Sélectionnez le type de document puis téléversez son
            modèle HTML. Le code de mention est transmis au serveur
            pour retrouver automatiquement la version académique.
          </p>
        </div>

        <form
          className="modeles-documents-form"
          onSubmit={handleSubmit}
        >
          {/* ÉTAPE 1 : TYPE DE DOCUMENT */}

          <section className="modeles-documents-section">
            <div className="modeles-documents-section-heading">
              <span className="modeles-documents-step">01</span>

              <div>
                <h3>Type de document</h3>
                <p>
                  Choisissez le modèle que vous souhaitez configurer.
                </p>
              </div>
            </div>

            <div className="modeles-documents-field">
              <label htmlFor="modele-type-document">
                Catégorie du document <span>*</span>
              </label>

              <select
                id="modele-type-document"
                value={typeDocument}
                onChange={handleTypeChange}
                disabled={isSubmitting}
                required
              >
                <option value="">
                  Sélectionner un type de document
                </option>

                {TYPES_DOCUMENTS.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {typeSelectionne && (
                <small>{typeSelectionne.description}</small>
              )}
            </div>

            <div className="modeles-documents-type-preview">
              <div className="modeles-documents-preview-symbol">
                HTML
              </div>

              <div>
                <strong>
                  {typeSelectionne?.label ||
                    "Aucun type sélectionné"}
                </strong>

                <p>
                  {typeSelectionne
                    ? typeSelectionne.description
                    : "Le type choisi déterminera la catégorie du modèle."}
                </p>
              </div>

              <span
                className={`modeles-documents-status ${
                  typeSelectionne ? "selected" : ""
                }`}
              >
                {typeSelectionne ? "Sélectionné" : "En attente"}
              </span>
            </div>
          </section>

          {/* ÉTAPE 2 : FICHIER HTML */}

          <section className="modeles-documents-section">
            <div className="modeles-documents-section-heading">
              <span className="modeles-documents-step">02</span>

              <div>
                <h3>Fichier du modèle</h3>
                <p>
                  Téléversez le fichier HTML qui servira de modèle
                  de document.
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              id="modele-document-fichier"
              className="modeles-documents-file-input"
              type="file"
              accept=".html,.htm,text/html"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />

            <label
              htmlFor="modele-document-fichier"
              className={`modeles-documents-dropzone ${
                fichier ? "has-file" : ""
              }`}
            >
              <span
                className="modeles-documents-upload-icon"
                aria-hidden="true"
              >
                ↑
              </span>

              <strong>
                {fichier
                  ? fichier.name
                  : "Choisir un fichier HTML"}
              </strong>

              <span className="modeles-documents-upload-description">
                Cliquez pour parcourir vos fichiers
              </span>

              <span className="modeles-documents-upload-formats">
                HTML ou HTM · 10 Mo maximum
              </span>

              <span className="modeles-documents-browse-button">
                Parcourir les fichiers
              </span>
            </label>

            {fichier && (
              <div className="modeles-documents-selected-file">
                <div className="modeles-documents-file-badge">
                  HTML
                </div>

                <div className="modeles-documents-file-details">
                  <strong>{fichier.name}</strong>

                  <span>
                    {(fichier.size / 1024).toFixed(1)} Ko
                  </span>
                </div>

                <button
                  type="button"
                  className="modeles-documents-remove-file"
                  onClick={() => {
                    setFichier(null);

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  disabled={isSubmitting}
                  aria-label="Retirer le fichier sélectionné"
                >
                  Retirer
                </button>
              </div>
            )}
          </section>

          {/* ACTIONS */}

          <footer className="modeles-documents-actions">
            <p>
              <span>*</span> Champs obligatoires
            </p>

            <button
              type="submit"
              className="modeles-documents-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="modeles-documents-spinner" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <span aria-hidden="true">✓</span>
                  Enregistrer le modèle
                </>
              )}
            </button>
          </footer>
        </form>
      </div>

      {/* NOTIFICATION */}

      {notification && (
        <div
          className={`modeles-documents-toast ${notification.type}`}
          role="status"
          aria-live="polite"
        >
          <span className="modeles-documents-toast-icon">
            {notification.type === "success" ? "✓" : "!"}
          </span>

          <span>{notification.message}</span>

          <button
            type="button"
            onClick={() => setNotification(null)}
            aria-label="Fermer la notification"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default ModelesDocuments;


