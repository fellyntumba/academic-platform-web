
import React, {
  useEffect,
  useState,
} from "react";

import "./Communique.css";

import {
  getParcoursService,
  getPromotionsService,
  getMentionVersionService, 
  createCommuniqueService,
} from "./communiqueService"; 

/* =========================================================
   TYPES DE CIBLES
========================================================= */

const TYPES_CIBLES = [
  {
    value: "mention",
    label: "Mention",
  },
  {
    value: "parcours",
    label: "Parcours",
  },
  {
    value: "promotion",
    label: "Promotion",
  },
];

/* =========================================================
   PRIORITÉS
========================================================= */

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

/* =========================================================
   COMPOSANT
========================================================= */

const Communique = ({ code_mention }) => {

  /* =====================================================
     MODE
  ====================================================== */

  const [mode, setMode] =
    useState("create");

  /* =====================================================
     CRÉATION
  ====================================================== */

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

  /* =====================================================
     MENTION
     RÉCUPÉRÉE AU CHARGEMENT DE LA PAGE
  ====================================================== */

  const [mentionVersionId, setMentionVersionId] =
    useState("");

  const [mentionNom, setMentionNom] =
    useState("");

  /* =====================================================
     PROMOTIONS
  ====================================================== */

  const [promotionsVersions, setPromotionsVersions] =
    useState([]);

  const [loadingPromotions, setLoadingPromotions] =
    useState(false);

  const [promotionVersionId, setPromotionVersionId] =
    useState("");

  /* =====================================================
     PARCOURS
  ====================================================== */

  const [parcoursVersions, setParcoursVersions] =
    useState([]);

  const [loadingParcours, setLoadingParcours] =
    useState(false);

  const [parcoursVersionId, setParcoursVersionId] =
    useState("");

  /* =====================================================
     NOTIFICATION
  ====================================================== */

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  /* =====================================================
     ÉTAT GLOBAL
  ====================================================== */

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* =====================================================
     AFFICHER MESSAGE
  ====================================================== */

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

  /* =====================================================
     CHARGER LA VERSION DE LA MENTION
     AU CHARGEMENT DU COMPOSANT
  ====================================================== */

  useEffect(() => {

    let cancelled = false;

    const loadMentionVersion = async () => {

      if (!code_mention) {

        setMentionVersionId("");
        setMentionNom("");

        return;
      }

      try {

        const result =
          await getMentionVersionService({
            code_mention,
          });

        if (cancelled) {
          return;
        }

        if (!result?.success) {

          setMentionVersionId("");
          setMentionNom("");

          console.error(
            result?.message ||
              "Impossible de récupérer la version de la mention."
          );

          return;
        }

        const version =
          result?.version || null;

        if (!version) {

          setMentionVersionId("");
          setMentionNom("");

          console.error(
            "Aucune version de mention retournée par le serveur."
          );

          return;
        }

        setMentionVersionId(
          version.id_version
            ? String(version.id_version)
            : ""
        );

        setMentionNom(
          version.nom_mention || ""
        );

      } catch (error) {

        if (cancelled) {
          return;
        }

        console.error(
          "Erreur chargement version de mention :",
          error
        );

        setMentionVersionId("");
        setMentionNom("");

      }
    };

    loadMentionVersion();

    return () => {
      cancelled = true;
    };

  }, [code_mention]);

  /* =====================================================
     CHARGER LES PROMOTIONS
     UNIQUEMENT POUR LA CIBLE PROMOTION
  ====================================================== */

  useEffect(() => {

    let cancelled = false;

    const loadPromotions = async () => {

      if (
        mode !== "create" ||
        typeCible !== "promotion"
      ) {

        setPromotionsVersions([]);
        setPromotionVersionId("");
        setLoadingPromotions(false);

        return;
      }

      try {

        setLoadingPromotions(true);

        setPromotionsVersions([]);
        setPromotionVersionId("");

        const promoData =
          await getPromotionsService({
            code_mention,
          });

        if (cancelled) {
          return;
        }

        const promos =
          promoData?.data ||
          promoData ||
          [];

        setPromotionsVersions(
          Array.isArray(promos)
            ? promos
            : []
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
    mode,
    typeCible,
    code_mention,
  ]);

  /* =====================================================
     CHARGER LES PARCOURS
     UNIQUEMENT POUR LA CIBLE PARCOURS
  ====================================================== */

  useEffect(() => {

    let cancelled = false;

    const loadParcours = async () => {

      if (
        mode !== "create" ||
        typeCible !== "parcours"
      ) {

        setParcoursVersions([]);
        setParcoursVersionId("");
        setLoadingParcours(false);

        return;
      }

      try {

        setLoadingParcours(true);

        setParcoursVersions([]);
        setParcoursVersionId("");

        const parcoursData =
          await getParcoursService({
            code_mention,
          });

        if (cancelled) {
          return;
        }

        const parcours =
          parcoursData?.data ||
          parcoursData ||
          [];

        setParcoursVersions(
          Array.isArray(parcours)
            ? parcours
            : []
        );

      } catch (error) {

        if (cancelled) {
          return;
        }

        console.error(
          "Erreur chargement parcours :",
          error
        );

        setParcoursVersions([]);
        setParcoursVersionId("");

        showMessage(
          error.message ||
            "Erreur lors du chargement des parcours.",
          "error"
        );

      } finally {

        if (!cancelled) {
          setLoadingParcours(false);
        }

      }

    };

    loadParcours();

    return () => {
      cancelled = true;
    };

  }, [
    mode,
    typeCible,
    code_mention,
  ]);

  /* =====================================================
     CHANGEMENT DE TYPE DE CIBLE
  ====================================================== */

  const handleTypeCibleChange = (
    event
  ) => {

    const value =
      event.target.value;

    setTypeCible(value);

    setParcoursVersionId("");

    setPromotionVersionId("");

    setParcoursVersions([]);

    setPromotionsVersions([]);

  };

  /* =====================================================
     CHANGEMENT PARCOURS
  ====================================================== */

  const handleParcoursChange = (
    event
  ) => {

    const value =
      event.target.value;

    /*
     * La valeur sélectionnée est
     * directement l'id_version du parcours.
     */
    setParcoursVersionId(value);

  };

  /* =====================================================
     CHANGEMENT PROMOTION
  ====================================================== */

  const handlePromotionChange = (
    event
  ) => {

    const value =
      event.target.value;

    /*
     * La valeur sélectionnée est
     * directement l'id_version de la promotion.
     */
    setPromotionVersionId(value);

  };

  /* =====================================================
     CHANGEMENT DE FICHIER
  ====================================================== */

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

    setFichier(file);
  };

  /* =====================================================
     RESET CRÉATION
  ====================================================== */

  const resetCreateForm = () => {

    setObjet("");

    setPriorite("");

    setTypeCible("");

    setParcoursVersionId("");

    setPromotionVersionId("");

    setDateExpiration("");

    setFichier(null);

    setParcoursVersions([]);

    setPromotionsVersions([]);

    const fileInput =
      document.getElementById(
        "communique-fichier"
      );

    if (fileInput) {
      fileInput.value = "";
    }

  };

  /* =====================================================
     CHANGEMENT DE MODE
  ====================================================== */

  const handleChangeMode = (
    nouveauMode
  ) => {

    setMode(nouveauMode);

    resetCreateForm();

    setMessage("");
    setMessageType("");

    if (nouveauMode === "delete") {

      setTimeout(() => {

        showMessage(
          "Cette fonctionnalité est en cours de développement.",
          "info"
        );

      }, 50);

    }

  };

  /* =====================================================
     SOUMISSION PUBLICATION
  ====================================================== */

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    if (mode !== "create") {
      return;
    }

    setMessage("");
    setMessageType("");

    /* -----------------------------------------------------
       VALIDATION OBJET
    ----------------------------------------------------- */

    if (!objet.trim()) {

      showMessage(
        "Veuillez saisir l'objet du communiqué.",
        "error"
      );

      return;
    }

    /* -----------------------------------------------------
       VALIDATION PRIORITÉ
    ----------------------------------------------------- */

    if (!priorite) {

      showMessage(
        "Veuillez sélectionner une priorité.",
        "error"
      );

      return;
    }

    /* -----------------------------------------------------
       VALIDATION TYPE CIBLE
    ----------------------------------------------------- */

    if (!typeCible) {

      showMessage(
        "Veuillez sélectionner le type de cible.",
        "error"
      );

      return;
    }

    /* -----------------------------------------------------
       VALIDATION CIBLE PARCOURS
    ----------------------------------------------------- */

    if (
      typeCible === "parcours" &&
      !parcoursVersionId
    ) {

      showMessage(
        "Veuillez sélectionner un parcours.",
        "error"
      );

      return;
    }

    /* -----------------------------------------------------
       VALIDATION CIBLE PROMOTION
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       VALIDATION CIBLE MENTION
    ====================================================== */

    if (
      typeCible === "mention" &&
      !mentionVersionId
    ) {

      showMessage(
        "La version de la mention est introuvable.",
        "error"
      );

      return;
    }

    /* -----------------------------------------------------
       VALIDATION FICHIER
    ----------------------------------------------------- */

    if (!fichier) {

      showMessage(
        "Veuillez sélectionner le fichier du communiqué.",
        "error"
      );

      return;
    }

    /* -----------------------------------------------------
       VALIDATION EXPIRATION
    ----------------------------------------------------- */

    if (!dateExpiration) {

      showMessage(
        "Veuillez définir une date d'expiration.",
        "error"
      );

      return;
    }

    const expiration =
      new Date(
        dateExpiration
      );

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

    /* -----------------------------------------------------
       CONFIRMATION
    ----------------------------------------------------- */

    const confirmation =
      window.confirm(
        "Voulez-vous vraiment publier ce communiqué ?"
      );

    if (!confirmation) {
      return;
    }

    setIsSubmitting(true);

    try {

      /* =================================================
         DÉTERMINER CIBLE ID
      ================================================= */

      let cibleFinale = null;

      if (
        typeCible === "mention"
      ) {

        /*
         * IMPORTANT :
         * Pour une mention, cibleFinale est
         * l'id_version de mentions_versions.
         */
        cibleFinale =
          Number(mentionVersionId);

      }

      else if (
        typeCible === "parcours"
      ) {

        /*
         * IMPORTANT :
         * parcoursVersionId contient
         * l'id_version de parcours_versions.
         */
        cibleFinale =
          Number(parcoursVersionId);

      }

      else if (
        typeCible === "promotion"
      ) {

        /*
         * IMPORTANT :
         * promotionVersionId contient
         * l'id_version de promotions_versions.
         */
        cibleFinale =
          Number(promotionVersionId);

      }

      /* =================================================
         VALIDATION FINALE DE L'ID
      ================================================= */

      if (
        !Number.isInteger(
          cibleFinale
        ) ||
        cibleFinale <= 0
      ) {

        throw new Error(
          "L'identifiant de la cible est invalide."
        );
      }

      /* =================================================
         CRÉATION DU COMMUNIQUÉ
      ================================================= */

      const result =
        await createCommuniqueService({

          objet:
            objet.trim(),

          priorite,

          dateExpiration,

          typeCible,

          cibleId:
            cibleFinale,

          fichier,

        });

      /* =================================================
         VÉRIFICATION RÉSULTAT
      ================================================= */

      if (!result?.success) {

        throw new Error(
          result?.message ||
            "La publication du communiqué a échoué."
        );
      }

      /* =================================================
         SUCCÈS
      ================================================= */

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

  /* =====================================================
     RENDU
  ====================================================== */

  return (
    <div className="gestion-communiques-wrapper">

      <div className="gestion-communiques-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="gestion-communiques-header">

          <div>

            <h2>
              Gestion des communiqués
            </h2>

            <p>
              Publiez ou supprimez les communiqués
              destinés aux étudiants.
            </p>

          </div>

        </div>

        {/* =================================================
            MODE
        ================================================= */}

        <div className="communique-mode-switch">

          <button
            type="button"
            className={
              mode === "create"
                ? "active"
                : ""
            }
            onClick={() =>
              handleChangeMode(
                "create"
              )
            }
            disabled={
              isSubmitting
            }
          >

            <span className="mode-icon">
              ＋
            </span>

            Publier un communiqué

          </button>

          <button
            type="button"
            className={
              mode === "delete"
                ? "active"
                : ""
            }
            onClick={() =>
              handleChangeMode(
                "delete"
              )
            }
            disabled={
              isSubmitting
            }
          >

            <span className="mode-icon">
              ×
            </span>

            Supprimer un communiqué

          </button>

        </div>

        {/* =================================================
            MODE SUPPRESSION
        ================================================= */}

        {mode === "delete" && (

          <div className="form-section">

            <div className="section-heading">

              <div className="section-number">
                01
              </div>

              <div>

                <h3>
                  Suppression d'un communiqué
                </h3>

                <span>
                  Cette fonctionnalité sera disponible
                  prochainement.
                </span>

              </div>

            </div>

            <div className="rule-preview">

              <div className="preview-icon">
                !
              </div>

              <div className="preview-content">

                <span>
                  FONCTIONNALITÉ EN DÉVELOPPEMENT
                </span>

                <strong>
                  Suppression des communiqués
                </strong>

                <p>
                  Cette fonctionnalité est en cours
                  de développement.
                </p>

              </div>

            </div>

          </div>

        )}

        {/* =================================================
            MODE PUBLICATION
        ================================================= */}

        {mode === "create" && (

          <form
            className="communique-form"
            onSubmit={
              handleSubmit
            }
          >

            {/* =================================================
                01 — INFORMATIONS
            ================================================= */}

            <div className="form-section">

              <div className="section-heading">

                <div className="section-number">
                  01
                </div>

                <div>

                  <h3>
                    Informations du communiqué
                  </h3>

                  <span>
                    Définissez le sujet et le niveau
                    de priorité du communiqué.
                  </span>

                </div>

              </div>

              <div className="form-grid">

                <div className="field-group">

                  <label>
                    Objet du communiqué
                  </label>

                  <input
                    type="text"
                    value={
                      objet
                    }
                    onChange={(e) =>
                      setObjet(
                        e.target.value
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

                  <label>
                    Priorité
                  </label>

                  <select
                    value={
                      priorite
                    }
                    onChange={(e) =>
                      setPriorite(
                        e.target.value
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

                          {
                            item.label
                          }

                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>

            </div>

            {/* =================================================
                02 — DESTINATAIRES
            ================================================= */}

            <div className="form-section">

              <div className="section-heading">

                <div className="section-number">
                  02
                </div>

                <div>

                  <h3>
                    Destinataires
                  </h3>

                  <span>
                    Choisissez le type de cible puis,
                    si nécessaire, le parcours ou la promotion.
                  </span>

                </div>

              </div>

              <div className="destinataires-grid">

                {/* =================================================
                    TYPE CIBLE
                ================================================= */}

                <div className="destination-field">

                  <label>
                    Type cible
                  </label>

                  <select
                    value={
                      typeCible
                    }
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

                          {
                            item.label
                          }

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* =================================================
                    PARCOURS
                ================================================= */}

                <div className="destination-field">

                  <label>
                    Parcours
                  </label>

                  <select
                    value={
                      parcoursVersionId
                    }
                    onChange={
                      handleParcoursChange
                    }
                    disabled={
                      isSubmitting ||
                      typeCible !== "parcours" ||
                      loadingParcours
                    }
                  >

                    <option value="">

                      {typeCible !== "parcours"
                        ? "Non disponible"
                        : loadingParcours
                        ? "Chargement des parcours..."
                        : "Sélectionner un parcours"}

                    </option>

                    {typeCible === "parcours" &&
                      !loadingParcours &&
                      parcoursVersions.map(
                        (parcours) => (

                          <option
                            key={
                              parcours.id_version
                            }
                            value={
                              parcours.id_version
                            }
                          >

                            {
                              parcours.nom_parcours
                            }

                          </option>

                        )
                      )}

                  </select>

                  {typeCible === "parcours" &&
                    !loadingParcours &&
                    parcoursVersions.length === 0 && (

                    <small className="field-warning">

                      Aucun parcours disponible.

                    </small>

                  )}

                </div>

                {/* =================================================
                    PROMOTION
                ================================================= */}

                <div className="destination-field">

                  <label>
                    Promotion
                  </label>

                  <select
                    value={
                      promotionVersionId
                    }
                    onChange={
                      handlePromotionChange
                    }
                    disabled={
                      isSubmitting ||
                      typeCible !== "promotion" ||
                      loadingPromotions
                    }
                  >

                    <option value="">

                      {typeCible !== "promotion"
                        ? "Non disponible"
                        : loadingPromotions
                        ? "Chargement des promotions..."
                        : "Sélectionner une promotion"}

                    </option>

                    {typeCible === "promotion" &&
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

                            {promotion.code_promotion
                              ? `${promotion.code_promotion} • `
                              : ""}

                            {
                              promotion.nom_promotion
                            }

                            {promotion.annee
                              ? ` • ${promotion.annee}`
                              : ""}

                          </option>

                        )
                      )}

                  </select>

                  {typeCible === "promotion" &&
                    !loadingPromotions &&
                    promotionsVersions.length === 0 && (

                    <small className="field-warning">

                      Aucune promotion disponible.

                    </small>

                  )}

                </div>

              </div>

              {/* =================================================
                  INFORMATION MENTION
              ================================================= */}

              {typeCible === "mention" && (

                <div className="mention-target-info">

                  <div className="mention-target-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      {mentionNom ||
                        "Mention actuelle"}
                    </strong>

                    <p>
                      Le communiqué sera destiné
                      à votre mention.
                    </p>

                  </div>

                </div>

              )}

            </div>

            {/* =================================================
                03 — CONTENU
            ================================================= */}

            <div className="form-section">

              <div className="section-heading">

                <div className="section-number">
                  03
                </div>

                <div>

                  <h3>
                    Contenu du communiqué
                  </h3>

                  <span>
                    Le fichier sélectionné constitue
                    le contenu officiel du communiqué.
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
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
                />

                <label
                  htmlFor="communique-fichier"
                  className="communique-file-label"
                >

                  <span className="communique-file-icon">
                    📎
                  </span>

                  <span className="communique-file-content">

                    <strong>

                      {fichier
                        ? fichier.name
                        : "Choisir le fichier du communiqué"}

                    </strong>

                    <small>
                      PDF, Word, Excel, JPG, PNG ou WEBP
                      — 20 Mo maximum
                    </small>

                  </span>

                  <span className="communique-file-button">
                    Parcourir
                  </span>

                </label>

                <div className="communique-file-info">

                  <span>
                    ⓘ
                  </span>

                  <span>
                    Le fichier représente le contenu
                    du communiqué. Son nom sera enregistré
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

                <div>

                  <h3>
                    Durée de publication
                  </h3>

                  <span>
                    Définissez jusqu'à quelle date
                    le communiqué doit rester actif.
                  </span>

                </div>

              </div>

              <div className="field-group">

                <label>
                  Date d'expiration
                </label>

                <input
                  type="datetime-local"
                  value={
                    dateExpiration
                  }
                  onChange={(e) =>
                    setDateExpiration(
                      e.target.value
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                />

                <small>
                  Le communiqué ne devra plus être
                  considéré comme actif après cette date.
                </small>

              </div>

            </div>

            {/* =================================================
                PUBLICATION
            ================================================= */}

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

                  Publication...

                </>

              ) : (

                <>

                  <span>
                    ✓
                  </span>

                  Publier le communiqué

                </>

              )}

            </button>

          </form>

        )}

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
              : "ℹ"}

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

