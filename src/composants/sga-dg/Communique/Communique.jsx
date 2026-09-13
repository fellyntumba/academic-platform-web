import React, {
  useEffect,
  useState,
} from "react";

import "./Communique.css";

import {
  createCommuniqueService,
  getFacultesVersionsAnneeEnCoursService,
} from "./communiqueService";

/* =========================================================
   TYPES DE CIBLES
========================================================= */

const TYPES_CIBLES = [
  {
    value: "etablissement",
    label: "Etablissement",
  },
  {
    value: "faculte",
    label: "Faculté",
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

const Communique = () => {

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
     FACULTÉS VERSIONS
  ====================================================== */

  const [facultesVersions, setFacultesVersions] =
    useState([]);

  /*
   * Liste contenant uniquement les id_version
   * des facultés versions.
   *
   * Exemple :
   * [12, 13, 14, 15]
   */

  const [facultesVersionsIds, setFacultesVersionsIds] =
    useState([]);

  const [faculteVersionId, setFaculteVersionId] =
    useState("");

  const [loadingFacultes, setLoadingFacultes] =
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
     CHARGER LES FACULTÉS VERSIONS
     DE L'ANNÉE ACADÉMIQUE EN COURS
  ====================================================== */

  useEffect(() => {

    let cancelled = false;

    const loadFacultesVersions = async () => {

      /*
       * Si le type de cible n'est pas encore sélectionné,
       * on ne charge rien.
       */

      if (!typeCible) {
        setFacultesVersions([]);
        setFacultesVersionsIds([]);
        setFaculteVersionId("");
        setLoadingFacultes(false);
        return;
      }

      /*
       * Les facultés versions sont nécessaires pour :
       *
       * - établissement : toutes les ID sont utilisées
       * - faculté       : l'utilisateur choisit une ID
       */

      setLoadingFacultes(true);

      try {

        const result =
          await getFacultesVersionsAnneeEnCoursService();

        if (cancelled) {
          return;
        }

        if (!result?.success) {

          setFacultesVersions([]);
          setFacultesVersionsIds([]);
          setFaculteVersionId("");

          throw new Error(
            result?.message ||
              "Impossible de récupérer les facultés versions."
          );
        }

        const versions =
          Array.isArray(result?.data)
            ? result.data
            : [];

        /*
         * Liste complète des facultés versions.
         */

        setFacultesVersions(versions);

        /*
         * On extrait uniquement les id_version.
         *
         * Exemple :
         *
         * [
         *   { id_version: 12, nom_faculte: "..." },
         *   { id_version: 13, nom_faculte: "..." }
         * ]
         *
         * devient :
         *
         * [12, 13]
         */

        const ids = versions
          .map(
            (faculte) =>
              Number(faculte.id_version)
          )
          .filter(
            (id) =>
              Number.isInteger(id) &&
              id > 0
          );

        setFacultesVersionsIds(ids);

      } catch (error) {

        if (cancelled) {
          return;
        }

        console.error(
          "Erreur chargement facultés versions :",
          error
        );

        setFacultesVersions([]);
        setFacultesVersionsIds([]);
        setFaculteVersionId("");

        showMessage(
          error.message ||
            "Erreur lors du chargement des facultés.",
          "error"
        );

      } finally {

        if (!cancelled) {
          setLoadingFacultes(false);
        }

      }
    };

    loadFacultesVersions();

    return () => {
      cancelled = true;
    };

  }, [typeCible]);

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
     * À chaque changement de type,
     * on efface la sélection précédente.
     */

    setFaculteVersionId("");

  };

  /* =====================================================
     CHANGEMENT FACULTÉ VERSION
  ====================================================== */

  const handleFaculteVersionChange = (
    event
  ) => {

    const value =
      event.target.value;

    setFaculteVersionId(value);

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
     RÉCUPÉRER LES CIBLES
  ====================================================== */

  const getCibles = () => {

    /*
     * ÉTABLISSEMENT
     * ---------------------------------------------------
     * Toutes les facultés versions constituent les cibles.
     *
     * Exemple :
     *
     * [12, 13, 14, 15]
     */

    if (typeCible === "etablissement") {

      return facultesVersionsIds;

    }

    /*
     * FACULTÉ
     * ---------------------------------------------------
     * Une seule faculté version est sélectionnée.
     *
     * Exemple :
     *
     * [13]
     */

    if (typeCible === "faculte") {

      if (!faculteVersionId) {
        return [];
      }

      const id =
        Number(faculteVersionId);

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return [];
      }

      return [id];
    }

    return [];
  };

  /* =====================================================
     RESET CRÉATION
  ====================================================== */

  const resetCreateForm = () => {

    setObjet("");

    setPriorite("");

    setTypeCible("");

    setFaculteVersionId("");

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
       FACULTÉS DISPONIBLES
    ----------------------------------------------------- */

    if (
      facultesVersionsIds.length === 0
    ) {

      showMessage(
        "Aucune faculté version disponible pour l'année académique en cours.",
        "error"
      );

      return;
    }

    /* -----------------------------------------------------
       FACULTÉ
    ----------------------------------------------------- */

    if (
      typeCible === "faculte" &&
      !faculteVersionId
    ) {

      showMessage(
        "Veuillez sélectionner une faculté.",
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
       RÉCUPÉRATION DES CIBLES
    ----------------------------------------------------- */

    const cibles =
      getCibles();

    if (
      !Array.isArray(cibles) ||
      cibles.length === 0
    ) {

      showMessage(
        "Aucune cible valide n'a été sélectionnée.",
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

          /*
           * IMPORTANT :
           *
           * On envoie maintenant toujours
           * un tableau de cibles.
           *
           * Établissement :
           * [12, 13, 14, 15]
           *
           * Faculté :
           * [13]
           */

          cibleIds:
            cibles,

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
                    Choisissez l'établissement entier
                    ou une faculté.
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
                    FACULTÉ VERSION
                ================================================= */}

                <div className="destination-field">

                  <label>
                    Faculté version
                  </label>

                  <select
                    value={
                      faculteVersionId
                    }
                    onChange={
                      handleFaculteVersionChange
                    }
                    disabled={
                      isSubmitting ||
                      typeCible !== "faculte" ||
                      loadingFacultes
                    }
                  >

                    <option value="">

                      {typeCible !== "faculte"
                        ? "Non disponible"
                        : loadingFacultes
                        ? "Chargement..."
                        : "Sélectionner une faculté"}

                    </option>

                    {typeCible === "faculte" &&
                      !loadingFacultes &&
                      facultesVersions.map(
                        (faculte) => (

                          <option
                            key={
                              faculte.id_version
                            }
                            value={
                              faculte.id_version
                            }
                          >

                            {faculte.nom_faculte}

                          </option>

                        )
                      )}

                  </select>

                  {typeCible === "faculte" &&
                    !loadingFacultes &&
                    facultesVersions.length === 0 && (

                    <small className="field-warning">
                      Aucune faculté disponible.
                    </small>

                  )}

                </div>

              </div>

              {/* =================================================
                  INFORMATION ÉTABLISSEMENT
              ================================================= */}

              {typeCible === "etablissement" && (

                <div className="mention-target-info">

                  <div className="mention-target-icon">
                    {loadingFacultes
                      ? "…"
                      : "✓"}
                  </div>

                  <div>

                    <strong>

                      {loadingFacultes
                        ? "Chargement des facultés..."
                        : `${facultesVersionsIds.length} faculté(s) version sélectionnée(s)`}

                    </strong>

                    <p>

                      {loadingFacultes
                        ? "Récupération des facultés versions de l'année académique en cours."
                        : facultesVersionsIds.length > 0
                        ? "Le communiqué sera destiné à toutes les facultés versions de l'année académique en cours."
                        : "Aucune faculté version disponible pour l'année académique en cours."}

                    </p>

                  </div>

                </div>

              )}

              {/* =================================================
                  INFORMATION FACULTÉ
              ================================================= */}

              {typeCible === "faculte" &&
                faculteVersionId && (

                <div className="mention-target-info">

                  <div className="mention-target-icon">
                    ✓
                  </div>

                  <div>

                    <strong>

                      {facultesVersions.find(
                        (faculte) =>
                          String(
                            faculte.id_version
                          ) ===
                          String(
                            faculteVersionId
                          )
                      )?.nom_faculte ||
                        "Faculté sélectionnée"}

                    </strong>

                    <p>
                      Le communiqué sera destiné
                      à cette version de faculté.
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

