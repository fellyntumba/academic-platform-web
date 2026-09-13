import React, {
  useEffect,
  useState,
} from "react";

import "./Communique.css";

import {
  createCommuniqueService,
  getFaculteVersionByCodeFacService,
  getMentionsVersionsByCodeFacService,
  getParcoursVersionsByCodeFacService,
  getPromotionsVersionsByCodeFacService,
} from "./communiqueService";

/* =========================================================
   TYPES DE CIBLES
========================================================= */

const TYPES_CIBLES = [
  {
    value: "faculte",
    label: "Faculté",
  },
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

const Communique = ({ nomFaculte}) => {

  /* =====================================================
     MODE
  ====================================================== */

  const [mode, setMode] = useState("create");

  /* =====================================================
     CRÉATION
  ====================================================== */

  const [objet, setObjet] = useState("");

  const [priorite, setPriorite] = useState("");

  const [typeCible, setTypeCible] = useState("");

  const [dateExpiration, setDateExpiration] =
    useState("");

  const [fichier, setFichier] = useState(null);

  /* =====================================================
     FACULTÉ VERSION
  ====================================================== */

  const [faculteVersion, setFaculteVersion] =
    useState(null);

  const [loadingFaculte, setLoadingFaculte] =
    useState(false);

  /* =====================================================
     MENTIONS VERSIONS
  ====================================================== */

  const [mentionsVersions, setMentionsVersions] =
    useState([]);

  const [mentionVersionId, setMentionVersionId] =
    useState("");

  const [loadingMentions, setLoadingMentions] =
    useState(false);

  /* =====================================================
     PARCOURS VERSIONS
  ====================================================== */

  const [parcoursVersions, setParcoursVersions] =
    useState([]);

  const [parcoursVersionId, setParcoursVersionId] =
    useState("");

  const [loadingParcours, setLoadingParcours] =
    useState(false);

  /* =====================================================
     PROMOTIONS VERSIONS
  ====================================================== */

  const [promotionsVersions, setPromotionsVersions] =
    useState([]);

  const [promotionVersionId, setPromotionVersionId] =
    useState("");

  const [loadingPromotions, setLoadingPromotions] =
    useState(false);

  /* =====================================================
     NOTIFICATION
  ====================================================== */

  const [message, setMessage] = useState("");

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
     CHARGER LES DONNÉES DE LA FACULTÉ
     
     On utilise les quatre services :
     - faculté version
     - mentions versions
     - parcours versions
     - promotions versions
  ====================================================== */

  useEffect(() => {

    let cancelled = false;

    const loadFaculteData = async () => {

      if (!nomFaculte) {

        setFaculteVersion(null);

        setMentionsVersions([]);

        setParcoursVersions([]);

        setPromotionsVersions([]);

        return;
      }

      setLoadingFaculte(true);
      setLoadingMentions(true);
      setLoadingParcours(true);
      setLoadingPromotions(true);

      try {

        /* =================================================
           FACULTÉ VERSION
        ================================================= */

        const faculteResult =
          await getFaculteVersionByCodeFacService({
            code_faculte:nomFaculte,
          });

        if (!cancelled) {

          if (faculteResult?.success) {

            setFaculteVersion(
              faculteResult.data || null
            );

          } else {

            setFaculteVersion(null);

            console.error(
              faculteResult?.message ||
                "Impossible de récupérer la version de la faculté."
            );
          }

        }

      } catch (error) {

        if (!cancelled) {

          console.error(
            "Erreur chargement version faculté :",
            error
          );

          setFaculteVersion(null);

          showMessage(
            error.message ||
              "Erreur lors du chargement de la faculté.",
            "error"
          );
        }

      } finally {

        if (!cancelled) {
          setLoadingFaculte(false);
        }

      }

      try {

        /* =================================================
           MENTIONS VERSIONS
        ================================================= */

        const mentionsResult =
          await getMentionsVersionsByCodeFacService({
            code_faculte:nomFaculte,
          });

        if (!cancelled) {

          const mentions =
            Array.isArray(
              mentionsResult?.data
            )
              ? mentionsResult.data
              : [];

          setMentionsVersions(
            mentions
          );

        }

      } catch (error) {

        if (!cancelled) {

          console.error(
            "Erreur chargement mentions :",
            error
          );

          setMentionsVersions([]);

          showMessage(
            error.message ||
              "Erreur lors du chargement des mentions.",
            "error"
          );
        }

      } finally {

        if (!cancelled) {
          setLoadingMentions(false);
        }

      }

      try {

        /* =================================================
           PARCOURS VERSIONS
        ================================================= */

        const parcoursResult =
          await getParcoursVersionsByCodeFacService({
            code_faculte:nomFaculte,
          });

        if (!cancelled) {

          const parcours =
            Array.isArray(
              parcoursResult?.data
            )
              ? parcoursResult.data
              : [];

          setParcoursVersions(
            parcours
          );

        }

      } catch (error) {

        if (!cancelled) {

          console.error(
            "Erreur chargement parcours :",
            error
          );

          setParcoursVersions([]);

          showMessage(
            error.message ||
              "Erreur lors du chargement des parcours.",
            "error"
          );
        }

      } finally {

        if (!cancelled) {
          setLoadingParcours(false);
        }

      }

      try {

        /* =================================================
           PROMOTIONS VERSIONS
        ================================================= */

        const promotionsResult =
          await getPromotionsVersionsByCodeFacService({
            code_faculte:nomFaculte,
          });

        if (!cancelled) {

          const promotions =
            Array.isArray(
              promotionsResult?.data
            )
              ? promotionsResult.data
              : [];

          setPromotionsVersions(
            promotions
          );

        }

      } catch (error) {

        if (!cancelled) {

          console.error(
            "Erreur chargement promotions :",
            error
          );

          setPromotionsVersions([]);

          showMessage(
            error.message ||
              "Erreur lors du chargement des promotions.",
            "error"
          );
        }

      } finally {

        if (!cancelled) {
          setLoadingPromotions(false);
        }

      }

    };

    loadFaculteData();

    return () => {
      cancelled = true;
    };

  }, [nomFaculte]);

  /* =====================================================
     CHANGEMENT DE TYPE DE CIBLE
  ====================================================== */

  const handleTypeCibleChange = (
    event
  ) => {

    const value =
      event.target.value;

    setTypeCible(value);

    /*
     * On efface les anciennes sélections.
     * Une seule cible peut être active à la fois.
     */

    setMentionVersionId("");

    setParcoursVersionId("");

    setPromotionVersionId("");

  };

  /* =====================================================
     CHANGEMENT MENTION
  ====================================================== */

  const handleMentionChange = (
    event
  ) => {

    const value =
      event.target.value;

    /*
     * La valeur correspond directement
     * à mentions_versions.id_version.
     */

    setMentionVersionId(value);

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
     * La valeur correspond directement
     * à parcours_versions.id_version.
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
     * La valeur correspond directement
     * à promotions_versions.id_version.
     */

    setPromotionVersionId(value);

  };

  /* =====================================================
     CHANGEMENT FICHIER
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

    const allowedExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".xls",
      ".xlsx",
      ".doc",
      ".docx",
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
        "Type de fichier non autorisé.",
        "error"
      );

      event.target.value = "";

      return;
    }

    setFichier(file);
  };

  /* =====================================================
     RÉCUPÉRER L'ID DE LA CIBLE
  ====================================================== */

  const getCibleId = () => {

    /*
     * FACULTÉ
     * ----------
     * On prend l'id_version de facultes_versions.
     */

    if (typeCible === "faculte") {

      return faculteVersion?.id_version
        ? Number(
            faculteVersion.id_version
          )
        : null;
    }

    /*
     * MENTION
     * ----------
     * On prend l'id_version de mentions_versions.
     */

    if (typeCible === "mention") {

      return mentionVersionId
        ? Number(
            mentionVersionId
          )
        : null;
    }

    /*
     * PARCOURS
     * ----------
     * On prend l'id_version de parcours_versions.
     */

    if (typeCible === "parcours") {

      return parcoursVersionId
        ? Number(
            parcoursVersionId
          )
        : null;
    }

    /*
     * PROMOTION
     * ----------
     * On prend l'id_version de promotions_versions.
     */

    if (typeCible === "promotion") {

      return promotionVersionId
        ? Number(
            promotionVersionId
          )
        : null;
    }

    return null;
  };

  /* =====================================================
     RESET CRÉATION
  ====================================================== */

  const resetCreateForm = () => {

    setObjet("");

    setPriorite("");

    setTypeCible("");

    setMentionVersionId("");

    setParcoursVersionId("");

    setPromotionVersionId("");

    setDateExpiration("");

    setFichier(null);

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

    if (
      nouveauMode === "delete"
    ) {

      setTimeout(() => {

        showMessage(
          "Cette fonctionnalité est en cours de développement.",
          "info"
        );

      }, 50);

    }

  };

  /* =====================================================
     SOUMISSION
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
       OBJET
    ----------------------------------------------------- */

    if (!objet.trim()) {

      showMessage(
        "Veuillez saisir l'objet du communiqué.",
        "error"
      );

      return;
    }

    /* -----------------------------------------------------
       PRIORITÉ
    ----------------------------------------------------- */

    if (!priorite) {

      showMessage(
        "Veuillez sélectionner une priorité.",
        "error"
      );

      return;
    }

    /* -----------------------------------------------------
       TYPE CIBLE
    ----------------------------------------------------- */

    if (!typeCible) {

      showMessage(
        "Veuillez sélectionner le type de cible.",
        "error"
      );

      return;
    }

    /* -----------------------------------------------------
       FACULTÉ
    ----------------------------------------------------- */

    if (
      typeCible === "faculte" &&
      !faculteVersion?.id_version
    ) {

      showMessage(
        "La version de la faculté est introuvable.",
        "error"
      );

      return;
    }

    /* -----------------------------------------------------
       MENTION
    ----------------------------------------------------- */

    if (
      typeCible === "mention" &&
      !mentionVersionId
    ) {

      showMessage(
        "Veuillez sélectionner une mention.",
        "error"
      );

      return;
    }

    /* -----------------------------------------------------
       PARCOURS
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
       PROMOTION
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
       FICHIER
    ----------------------------------------------------- */

    if (!fichier) {

      showMessage(
        "Veuillez sélectionner le fichier du communiqué.",
        "error"
      );

      return;
    }

    /* -----------------------------------------------------
       DATE EXPIRATION
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
       ID CIBLE
    ----------------------------------------------------- */

    const cibleId =
      getCibleId();

    if (
      !Number.isInteger(
        cibleId
      ) ||
      cibleId <= 0
    ) {

      showMessage(
        "L'identifiant de la cible est invalide.",
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
         CRÉATION DU COMMUNIQUÉ
      ================================================= */

      const result =
        await createCommuniqueService({

          objet:
            objet.trim(),

          priorite,

          dateExpiration,

          typeCible,

          cibleId,

          fichier,

        });

      /* =================================================
         VÉRIFICATION
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
              Publiez un communiqué destiné
              aux étudiants.
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
            SUPPRESSION
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
            CRÉATION
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

                  <label>
                    Priorité
                  </label>

                  <select
                    value={
                      priorite
                    }
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
                    Choisissez le type de cible puis
                    la version correspondante.
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
                    MENTION
                ================================================= */}

                <div className="destination-field">

                  <label>
                    Mention version
                  </label>

                  <select
                    value={
                      mentionVersionId
                    }
                    onChange={
                      handleMentionChange
                    }
                    disabled={
                      isSubmitting ||
                      typeCible !== "mention" ||
                      loadingMentions
                    }
                  >

                    <option value="">

                      {typeCible !== "mention"
                        ? "Non disponible"
                        : loadingMentions
                        ? "Chargement..."
                        : "Sélectionner une mention"}

                    </option>

                    {typeCible === "mention" &&
                      !loadingMentions &&
                      mentionsVersions.map(
                        (mention) => (

                          <option
                            key={
                              mention.id_version
                            }
                            value={
                              mention.id_version
                            }
                          >

                            {mention.nom_mention}

                          </option>

                        )
                      )}

                  </select>

                  {typeCible === "mention" &&
                    !loadingMentions &&
                    mentionsVersions.length === 0 && (

                    <small className="field-warning">
                      Aucune mention disponible.
                    </small>

                  )}

                </div>

                {/* =================================================
                    PARCOURS
                ================================================= */}

                <div className="destination-field">

                  <label>
                    Parcours version
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
                        ? "Chargement..."
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

                            {parcours.nom_parcours}

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
                    Promotion version
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
                        ? "Chargement..."
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

                            {promotion.nom_promotion}

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
                  FACULTÉ
              ================================================= */}

              {typeCible === "faculte" && (

                <div className="mention-target-info">

                  <div className="mention-target-icon">
                    {loadingFaculte
                      ? "…"
                      : "✓"}
                  </div>

                  <div>

                    <strong>

                      {loadingFaculte
                        ? "Chargement de la faculté..."
                        : faculteVersion?.nom_faculte ||
                          "Faculté introuvable"}

                    </strong>

                    <p>

                      {faculteVersion?.id_version
                        ? "Le communiqué sera destiné à toute la faculté pour l'année académique en cours."
                        : "Aucune version de faculté disponible pour l'année académique en cours."}

                    </p>

                  </div>

                </div>

              )}

              {/* =================================================
                  MENTION
              ================================================= */}

              {typeCible === "mention" &&
                mentionVersionId && (

                <div className="mention-target-info">

                  <div className="mention-target-icon">
                    ✓
                  </div>

                  <div>

                    <strong>

                      {mentionsVersions.find(
                        (mention) =>
                          String(
                            mention.id_version
                          ) ===
                          String(
                            mentionVersionId
                          )
                      )?.nom_mention ||
                        "Mention sélectionnée"}

                    </strong>

                    <p>
                      Le communiqué sera destiné
                      à cette version de mention.
                    </p>

                  </div>

                </div>

              )}

            </div>

            {/* =================================================
                03 — FICHIER
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
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.xls,.xlsx,.doc,.docx"
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
                    Un seul fichier sera envoyé avec
                    le communiqué.
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
                  Le communiqué ne devra plus être
                  considéré comme actif après cette date.
                </small>

              </div>

            </div>

            {/* =================================================
                BOUTON PUBLICATION
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

            {messageType === "success"
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
