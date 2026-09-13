import React, {
  useEffect,
  useState,
} from "react";

import "./CommuniqueS.css";

import {
  getPromotionsEnseignantService,
  createCommuniqueService,
} from "./communiqueService";

// =========================================================
// TYPES DE CIBLES
// =========================================================

const TYPES_CIBLES = [
  {
    value: "promotion",
    label: "Promotion",
  },
];

// =========================================================
// PRIORITÉS
// =========================================================

const PRIORITES = [
  {
    value: "normale",
    label: "Normale",
  },
  {
    value: "urgente",
    label: "Urgente",
  },
];

// =========================================================
// COMPOSANT
// =========================================================

const Communique = ({
  id_enseignant,
}) => {
  // =======================================================
  // INFORMATIONS DU COMMUNIQUÉ
  // =======================================================

  const [objet, setObjet] =
    useState("");

  const [priorite, setPriorite] =
    useState("");

  const [typeCible, setTypeCible] =
    useState("");

  const [dateExpiration, setDateExpiration] =
    useState("");

  const [fichier, setFichier] =
    useState(null);

  // =======================================================
  // PROMOTIONS
  // =======================================================

  const [promotionsVersions, setPromotionsVersions] =
    useState([]);

  const [loadingPromotions, setLoadingPromotions] =
    useState(false);

  const [promotionVersionId, setPromotionVersionId] =
    useState("");

  // =======================================================
  // ÉTAT DE PUBLICATION
  // =======================================================

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // =======================================================
  // NOTIFICATION
  // =======================================================

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  // =======================================================
  // AFFICHER UN MESSAGE
  // =======================================================

  const showMessage = (
    msg,
    type = "success"
  ) => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  // =======================================================
  // CHARGER LES PROMOTIONS DE L'ENSEIGNANT
  // =======================================================

  useEffect(() => {
    let cancelled = false;

    const loadPromotions = async () => {
      if (
        typeCible !== "promotion"
      ) {
        setPromotionsVersions([]);
        setPromotionVersionId("");
        setLoadingPromotions(false);

        return;
      }

      if (!id_enseignant) {
        setPromotionsVersions([]);
        setPromotionVersionId("");
        setLoadingPromotions(false);

        return;
      }

      try {
        setLoadingPromotions(true);

        setPromotionsVersions([]);
        setPromotionVersionId("");

        const result =
          await getPromotionsEnseignantService({
            enseignantId:
              id_enseignant,
          });

        if (cancelled) {
          return;
        }

        const promotions =
          Array.isArray(result?.data)
            ? result.data
            : [];

        setPromotionsVersions(
          promotions
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Erreur chargement promotions :",
          error
        );

        setPromotionsVersions([]);
        setPromotionVersionId("");

        showMessage(
          error.message ||
            "Erreur lors du chargement des promotions.",
          "error"
        );
      } finally {
        if (!cancelled) {
          setLoadingPromotions(false);
        }
      }
    };

    loadPromotions();

    return () => {
      cancelled = true;
    };
  }, [
    typeCible,
    id_enseignant,
  ]);

  // =======================================================
  // CHANGEMENT DU TYPE DE CIBLE
  // =======================================================

  const handleTypeCibleChange = (
    event
  ) => {
    const value =
      event.target.value;

    setTypeCible(value);

    setPromotionVersionId("");

    if (value !== "promotion") {
      setPromotionsVersions([]);
    }
  };

  // =======================================================
  // CHANGEMENT DE PROMOTION
  // =======================================================

  const handlePromotionChange = (
    event
  ) => {
    const value =
      event.target.value;

    setPromotionVersionId(value);
  };

  // =======================================================
  // CHANGEMENT DE FICHIER
  // =======================================================

  const handleFileChange = (
    event
  ) => {
    const file =
      event.target.files?.[0] ||
      null;

    setMessage("");
    setMessageType("");

    if (!file) {
      setFichier(null);
      return;
    }

    const maxSize =
      20 * 1024 * 1024;

    if (file.size > maxSize) {
      setFichier(null);

      showMessage(
        "Le fichier ne doit pas dépasser 20 Mo.",
        "error"
      );

      event.target.value = "";

      return;
    }

    const allowedExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".xls",
      ".xlsx",
    ];

    const fileName =
      file.name.toLowerCase();

    const isAllowed =
      allowedExtensions.some(
        (extension) =>
          fileName.endsWith(extension)
      );

    if (!isAllowed) {
      setFichier(null);

      showMessage(
        "Type de fichier non autorisé. Utilisez PDF, JPG, JPEG, PNG, WEBP, XLS ou XLSX.",
        "error"
      );

      event.target.value = "";

      return;
    }

    setFichier(file);
  };

  // =======================================================
  // RESET DU FORMULAIRE
  // =======================================================

  const resetCreateForm = () => {
    setObjet("");
    setPriorite("");
    setTypeCible("");
    setPromotionVersionId("");
    setDateExpiration("");
    setFichier(null);

    setPromotionsVersions([]);

    const fileInput =
      document.getElementById(
        "communique-fichier"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =======================================================
  // SOUMISSION
  // =======================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (!objet.trim()) {
      showMessage(
        "Veuillez saisir l'objet du communiqué.",
        "error"
      );

      return;
    }

    if (!priorite) {
      showMessage(
        "Veuillez sélectionner une priorité.",
        "error"
      );

      return;
    }

    if (!typeCible) {
      showMessage(
        "Veuillez sélectionner le type de cible.",
        "error"
      );

      return;
    }

    if (
      typeCible === "promotion" &&
      !promotionVersionId
    ) {
      showMessage(
        "Veuillez sélectionner une promotion.",
        "error"
      );

      return;
    }

    if (!fichier) {
      showMessage(
        "Veuillez sélectionner le fichier du communiqué.",
        "error"
      );

      return;
    }

    if (!dateExpiration) {
      showMessage(
        "Veuillez définir une date d'expiration.",
        "error"
      );

      return;
    }

    const expiration =
      new Date(dateExpiration);

    if (
      Number.isNaN(
        expiration.getTime()
      )
    ) {
      showMessage(
        "La date d'expiration est invalide.",
        "error"
      );

      return;
    }

    if (
      expiration.getTime() <=
      Date.now()
    ) {
      showMessage(
        "La date d'expiration doit être dans le futur.",
        "error"
      );

      return;
    }

    if (!id_enseignant) {
      showMessage(
        "L'identifiant de l'enseignant est introuvable.",
        "error"
      );

      return;
    }

    const cibleId =
      Number(
        promotionVersionId
      );

    if (
      !Number.isInteger(cibleId) ||
      cibleId <= 0
    ) {
      showMessage(
        "L'identifiant de la promotion est invalide.",
        "error"
      );

      return;
    }

    const confirmation =
      window.confirm(
        "Voulez-vous vraiment publier ce communiqué ?"
      );

    if (!confirmation) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result =
        await createCommuniqueService({
          objet:
            objet.trim(),

          priorite,

          dateExpiration,

          typeCible,

          cibleId,

          fichier,

          enseignantId:
            id_enseignant,
        });

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "La publication du communiqué a échoué."
        );
      }

      showMessage(
        result.message ||
          "Communiqué publié avec succès.",
        "success"
      );

      resetCreateForm();
    } catch (error) {
      console.error(
        "Erreur publication communiqué :",
        error
      );

      showMessage(
        error.message ||
          "Une erreur est survenue lors de la publication.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =======================================================
  // RENDU
  // =======================================================

  return (
    <div className="gestion-communiques-wrapper">

      <div className="gestion-communiques-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="gestion-communiques-header">

          <div className="header-title-area">

            <span className="gestion-eyebrow">
              ESPACE ENSEIGNANT
            </span>

            <h2>
              Gestion des communiqués
            </h2>

            <p>
              Publiez un communiqué officiel destiné
              aux étudiants de vos promotions.
            </p>

          </div>

          <div className="header-badge">
            <span className="header-badge-dot" />
            Publication
          </div>

        </div>

        {/* =================================================
            FORMULAIRE
        ================================================= */}

        <form
          className="communique-form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              01 — INFORMATIONS
          ================================================= */}

          <div className="form-section">

            <div className="section-heading">

              <div className="section-number">
                01
              </div>

              <div className="section-heading-content">

                <h3>
                  Informations du communiqué
                </h3>

                <span>
                  Définissez le sujet et le niveau
                  de priorité de votre publication.
                </span>

              </div>

            </div>

            <div className="form-grid">

              <div className="field-group">

                <label htmlFor="communique-objet">
                  Objet du communiqué
                </label>

                <input
                  id="communique-objet"
                  type="text"
                  value={objet}
                  onChange={(event) =>
                    setObjet(
                      event.target.value
                    )
                  }
                  placeholder="Ex. Suspension des cours"
                  maxLength={255}
                  disabled={
                    isSubmitting
                  }
                />

                <small>
                  L'objet sera utilisé comme titre
                  du communiqué.
                </small>

              </div>

              <div className="field-group">

                <label htmlFor="communique-priorite">
                  Priorité
                </label>

                <select
                  id="communique-priorite"
                  value={priorite}
                  onChange={(event) =>
                    setPriorite(
                      event.target.value
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                >

                  <option value="">
                    Sélectionner une priorité
                  </option>

                  {PRIORITES.map(
                    (item) => (
                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

          </div>

          {/* =================================================
              02 — DESTINATAIRE
          ================================================= */}

          <div className="form-section">

            <div className="section-heading">

              <div className="section-number">
                02
              </div>

              <div className="section-heading-content">

                <h3>
                  Destinataire
                </h3>

                <span>
                  Choisissez la promotion qui recevra
                  le communiqué.
                </span>

              </div>

            </div>

            <div className="destinataires-grid">

              {/* =================================================
                  TYPE CIBLE
              ================================================= */}

              <div className="destination-field">

                <label htmlFor="communique-type-cible">
                  Type de cible
                </label>

                <select
                  id="communique-type-cible"
                  value={typeCible}
                  onChange={
                    handleTypeCibleChange
                  }
                  disabled={
                    isSubmitting
                  }
                >

                  <option value="">
                    Sélectionner
                  </option>

                  {TYPES_CIBLES.map(
                    (item) => (
                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* =================================================
                  PROMOTION
              ================================================= */}

              <div className="destination-field promotion-destination">

                <label htmlFor="communique-promotion">
                  Promotion
                </label>

                <div className="select-with-status">

                  <select
                    id="communique-promotion"
                    value={
                      promotionVersionId
                    }
                    onChange={
                      handlePromotionChange
                    }
                    disabled={
                      isSubmitting ||
                      typeCible !==
                        "promotion" ||
                      loadingPromotions
                    }
                  >

                    <option value="">
                      {typeCible !==
                      "promotion"
                        ? "Sélectionnez d'abord Promotion"
                        : loadingPromotions
                        ? "Chargement des promotions..."
                        : "Sélectionner une promotion"}
                    </option>

                    {typeCible ===
                      "promotion" &&
                      !loadingPromotions &&
                      promotionsVersions.map(
                        (promotion) => (
                          <option
                            key={
                              promotion.id_version
                            }
                            value={
                              promotion.id_version
                            }
                          >
                            {
                              promotion.nom_promotion
                            }
                          </option>
                        )
                      )}

                  </select>

                  {loadingPromotions && (
                    <span className="select-spinner" />
                  )}

                </div>

                {typeCible ===
                  "promotion" &&
                  loadingPromotions && (
                    <small className="field-loading">
                      Recherche des promotions où
                      vous donnez cours...
                    </small>
                  )}

                {typeCible ===
                  "promotion" &&
                  !loadingPromotions &&
                  promotionsVersions.length ===
                    0 && (
                    <small className="field-warning">
                      Aucune promotion disponible
                      pour cet enseignant.
                    </small>
                  )}

                {typeCible ===
                  "promotion" &&
                  !loadingPromotions &&
                  promotionVersionId && (
                    <small className="field-success">
                      ✓ Promotion sélectionnée
                    </small>
                  )}

              </div>

            </div>

          </div>

          {/* =================================================
              03 — CONTENU
          ================================================= */}

          <div className="form-section">

            <div className="section-heading">

              <div className="section-number">
                03
              </div>

              <div className="section-heading-content">

                <h3>
                  Contenu du communiqué
                </h3>

                <span>
                  Sélectionnez le document officiel
                  à transmettre aux étudiants.
                </span>

              </div>

            </div>

            <div className="communique-file-area">

              <input
                id="communique-fichier"
                type="file"
                onChange={
                  handleFileChange
                }
                disabled={
                  isSubmitting
                }
                accept=".pdf,.jpg,.jpeg,.png,.webp,.xls,.xlsx"
              />

              <label
                htmlFor="communique-fichier"
                className={`communique-file-label ${
                  fichier
                    ? "has-file"
                    : ""
                }`}
              >

                <span className="communique-file-icon">
                  {fichier
                    ? "✓"
                    : "↥"}
                </span>

                <span className="communique-file-content">

                  <strong>
                    {fichier
                      ? fichier.name
                      : "Choisir le fichier du communiqué"}
                  </strong>

                  <small>
                    PDF, JPG, JPEG, PNG, WEBP,
                    XLS ou XLSX — 20 Mo maximum
                  </small>

                </span>

                <span className="communique-file-button">
                  {fichier
                    ? "Remplacer"
                    : "Parcourir"}
                </span>

              </label>

              <div className="communique-file-info">

                <span className="file-info-icon">
                  i
                </span>

                <span>
                  Un seul fichier sera envoyé avec
                  le communiqué. Son nom sera enregistré
                  dans la base de données.
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              04 — EXPIRATION
          ================================================= */}

          <div className="form-section">

            <div className="section-heading">

              <div className="section-number">
                04
              </div>

              <div className="section-heading-content">

                <h3>
                  Durée de publication
                </h3>

                <span>
                  Définissez la date jusqu'à laquelle
                  le communiqué restera actif.
                </span>

              </div>

            </div>

            <div className="expiration-field">

              <div className="field-group">

                <label htmlFor="communique-expiration">
                  Date d'expiration
                </label>

                <input
                  id="communique-expiration"
                  type="datetime-local"
                  value={
                    dateExpiration
                  }
                  onChange={(event) =>
                    setDateExpiration(
                      event.target.value
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                />

                <small>
                  Après cette date, le communiqué
                  ne sera plus considéré comme actif.
                </small>

              </div>

            </div>

          </div>

          {/* =================================================
              PUBLICATION
          ================================================= */}

          <div className="publication-area">

            <div className="publication-hint">

              <span className="publication-hint-icon">
                ✓
              </span>

              <div>
                <strong>
                  Prêt à publier ?
                </strong>

                <span>
                  Vérifiez les informations avant
                  de publier le communiqué.
                </span>
              </div>

            </div>

            <button
              type="submit"
              className="submit-communique-btn"
              disabled={
                isSubmitting
              }
            >

              {isSubmitting ? (
                <>
                  <span className="button-spinner" />
                  Publication en cours...
                </>
              ) : (
                <>
                  <span className="submit-icon">
                    ✓
                  </span>
                  Publier le communiqué
                </>
              )}

            </button>

          </div>

        </form>

      </div>

      {/* =====================================================
          NOTIFICATION
      ====================================================== */}

      {message && (
        <div
          className={`communique-notification ${messageType}`}
        >

          <span className="notification-icon">

            {messageType ===
            "success"
              ? "✓"
              : messageType === "error"
              ? "!"
              : "i"}

          </span>

          <span>
            {message}
          </span>

        </div>
      )}

    </div>
  );
};

export default Communique;
