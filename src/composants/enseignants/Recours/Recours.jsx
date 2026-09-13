import { useEffect, useState } from "react";
import "./Recours.css";
import {
  getRecoursEnseignantEnCoursService,
  rejectRecoursService,
  acceptRecoursService,
} from "./recoursService";

function Recours({ id_enseignant, annee }) {
  const [recoursData, setRecoursData] = useState([]);
  const [selectedRecours, setSelectedRecours] = useState(null);

  const [newCote, setNewCote] = useState("");
  const [showCoteInput, setShowCoteInput] = useState(false);

  const [showRejectInput, setShowRejectInput] = useState(false);
  const [motifRejet, setMotifRejet] = useState("");

  const [showDetailsRecours, setShowDetailsRecours] =
    useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [isRejecting, setIsRejecting] = useState(false);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  /* ============================================================
     CHARGER LES RECOURS
  ============================================================ */

  useEffect(() => {
    const loadRecours = async () => {
      try {
        if (!id_enseignant) return;

        const data =
          await getRecoursEnseignantEnCoursService(
            id_enseignant
          ); 

        setRecoursData(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Erreur chargement recours :",
          error
        );

        setRecoursData([]);
      }
    };

    loadRecours();
  }, [id_enseignant]);

  /* ============================================================
     SÉLECTIONNER UN RECOURS
  ============================================================ */

  const handleSelectRecours = (rec) => {
    setSelectedRecours(rec);

    setShowDetailsRecours(true);

    /* Réinitialiser la saisie de cote */
    setShowCoteInput(false);
    setNewCote("");

    /* Réinitialiser la saisie du rejet */
    setShowRejectInput(false);
    setMotifRejet("");
    setIsRejecting(false);
  };

  /* ============================================================
     AFFICHER LA ZONE DE REJET
  ============================================================ */

  const handleAfficherRejet = () => {
    /*
     * On affiche simplement la zone de saisie.
     * Le recours n'est pas encore rejeté.
     */
    setShowRejectInput(true);

    /*
     * Si une saisie de cote était ouverte,
     * on la ferme.
     */
    setShowCoteInput(false);
    setNewCote("");

    /*
     * Placer le curseur sur la zone de rejet
     * sera géré naturellement par le navigateur.
     */
  };

  /* ============================================================
     * ANNULER LA SAISIE DU REJET
  ============================================================ */

  const handleAnnulerRejet = () => {
    setShowRejectInput(false);
    setMotifRejet("");
    setIsRejecting(false);
  };

  /* ============================================================
     * REJETER UN RECOURS
  ============================================================ */

  const handleRejeter = async (
    id_recours,
    motif_rejet
  ) => {
    const motif = motif_rejet?.trim();

    if (!motif) {
      showMessage(
        "Veuillez saisir le motif du rejet",
        "error"
      );

      return;
    }

    if (isRejecting) {
      return;
    }

    try {
      setIsRejecting(true);

      /*
       * Le service reçoit maintenant :
       * id_recours + motif_rejet
       */
      await rejectRecoursService({
        id_recours,
        motif_rejet : motif
       }
      );

      /* ======================================================
         UPDATE DE LA LISTE SANS RELOAD
      ====================================================== */

      setRecoursData((prev) =>
        prev.map((rec) =>
          rec.id_recours === id_recours
            ? {
                ...rec,
                statut: "Rejeté",
                motif_rejet: motif,
              }
            : rec
        )
      );

      /* ======================================================
         UPDATE DU RECOURS SÉLECTIONNÉ
      ====================================================== */

      setSelectedRecours((prev) =>
        prev
          ? {
              ...prev,
              statut: "Rejeté",
              motif_rejet: motif,
            }
          : prev
      );

      /* ======================================================
         FERMER LA ZONE DE REJET
      ====================================================== */

      setShowRejectInput(false);
      setMotifRejet("");
      setIsRejecting(false);

      setShowCoteInput(false);
      setNewCote("");

      showMessage(
        "Recours rejeté avec succès",
        "success"
      );
    } catch (error) {
      console.error(
        "Erreur lors du rejet :",
        error
      );

      setIsRejecting(false);

      showMessage(
        "Erreur lors du rejet du recours",
        "error"
      );
    }
  };

  /* ============================================================
     AFFICHER LA SAISIE DE COTE
  ============================================================ */

  const handleAccepter = () => {
    /*
     * Si la zone de rejet était ouverte,
     * on la ferme.
     */
    setShowRejectInput(false);
    setMotifRejet("");
    setIsRejecting(false);

    setShowCoteInput(true);
  };

  /* ============================================================
     ACCEPTER LE RECOURS + MODIFIER LA COTE
  ============================================================ */

  const handleSaveCote = async (
    id_recours,
    cote
  ) => {
    if (!cote) {
      showMessage(
        "Veuillez entrer une cote valide",
        "error"
      );

      return;
    }

    const numericCote = parseInt(cote, 10);

    if (
      Number.isNaN(numericCote) ||
      numericCote < 0 ||
      numericCote > 20
    ) {
      showMessage(
        "La cote doit être comprise entre 0 et 20",
        "error"
      );

      return;
    }

    try {
      await acceptRecoursService({
        id_recours,
        newCote: numericCote,
      });

      /* ======================================================
         UPDATE LISTE
      ====================================================== */

      setRecoursData((prev) =>
        prev.map((rec) =>
          rec.id_recours === id_recours
            ? {
                ...rec,
                statut: "Accepté",
                cote: numericCote,
              }
            : rec
        )
      );

      /* ======================================================
         UPDATE RECOURS SÉLECTIONNÉ
      ====================================================== */

      setSelectedRecours((prev) =>
        prev
          ? {
              ...prev,
              statut: "Accepté",
              cote: numericCote,
            }
          : prev
      );

      setNewCote("");
      setShowCoteInput(false);

      showMessage(
        "Recours accepté et cote mise à jour",
        "success"
      );
    } catch (error) {
      console.error(
        "Erreur lors de l'acceptation :",
        error
      );

      showMessage(
        "Erreur lors de l'acceptation du recours",
        "error"
      );
    }
  };

  /* ============================================================
     STATUT
  ============================================================ */

  const getStatusClass = (statut) => {
    if (statut === "Accepté") {
      return "status-accepted";
    }

    if (statut === "Rejeté") {
      return "status-rejected";
    }

    return "status-pending";
  };

  /* ============================================================
     AFFICHAGE
  ============================================================ */

  return (
    <div className="recours-page">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="recours-header">
        <div className="header-left">
          <div className="header-icon">
            ⚖️
          </div>

          <div>
            <h2>Traitement des recours</h2>

            <p>
              Consultez et traitez les recours introduits
              par les étudiants.
            </p>
          </div>
        </div>

        <div className="header-right">
          <div className="recours-counter">
            <span className="counter-number">
              {recoursData.length}
            </span>

            <span className="counter-label">
              recours
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================
          NOTIFICATION
      ====================================================== */}

      {message && (
        <div
          className={`recours-notification ${messageType}`}
        >
          <span className="notification-icon">
            {messageType === "success"
              ? "✓"
              : "!"}
          </span>

          <span>{message}</span>
        </div>
      )}

      {/* ======================================================
          CONTENU
      ====================================================== */}

      <div className="recours-container">
        {/* ====================================================
            LISTE GAUCHE
        ==================================================== */}

        <div className="recours-list">
          <div className="list-header">
            <div>
              <h3>Recours reçus</h3>

              <span>
                {recoursData.length}{" "}
                {recoursData.length > 1
                  ? "dossiers"
                  : "dossier"}
              </span>
            </div>
          </div>

          {recoursData.length === 0 ? (
            <div className="no-recours">
              <div className="empty-icon">
                ✓
              </div>

              <h3>Aucun recours reçu</h3>

              <p>
                Aucun recours n'est disponible pour
                l'année académique en cours.
              </p>
            </div>
          ) : (
            <div className="recours-items">
              {recoursData.map((rec) => (
                <div
                  key={rec.id_recours}
                  className={`recours-item ${
                    selectedRecours?.id_recours ===
                    rec.id_recours
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelectRecours(rec)
                  }
                >
                  <div className="recours-item-main">
                    <div className="student-avatar">
                      {rec.prenom
                        ?.charAt(0)
                        ?.toUpperCase()}

                      {rec.nom
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div className="student-summary">
                      <strong>
                        {rec.prenom} {rec.nom}
                      </strong>

                      <span>
                        {rec.matricule}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`status-small ${getStatusClass(
                      rec.statut
                    )}`}
                  >
                    {rec.statut}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ====================================================
            SÉPARATEUR
        ==================================================== */}

        <div className="separator"></div>

        {/* ====================================================
            DÉTAILS
        ==================================================== */}

        <div className="recours-details">
          {showDetailsRecours && selectedRecours ? (
            <div className="details-wrapper">
              {/* =================================================
                  EN-TÊTE DU DOSSIER
              ================================================= */}

              <div className="card-detail">
                <div className="detail-top">
                  <div className="detail-student">
                    <div className="student-avatar large">
                      {selectedRecours.prenom
                        ?.charAt(0)
                        ?.toUpperCase()}

                      {selectedRecours.nom
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>
                      <span className="detail-label">
                        DOSSIER DE RECOURS
                      </span>

                      <h2>
                        {selectedRecours.prenom}{" "}
                        {selectedRecours.nom}
                      </h2>

                      <p>
                        Matricule :{" "}
                        <strong>
                          {selectedRecours.matricule}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`status ${getStatusClass(
                      selectedRecours.statut
                    )}`}
                  >
                    {selectedRecours.statut}
                  </span>
                </div>

                {/* =================================================
                    INFORMATIONS
                ================================================= */}

                <div className="details-grid">
                  <div className="info-box">
                    <span className="info-label">
                      Cours
                    </span>

                    <strong>
                      {selectedRecours.nom_cours ||
                        "Non renseigné"}
                    </strong>
                  </div>

                  <div className="info-box">
                    <span className="info-label">
                      Date du recours
                    </span>

                    <strong>
                      {selectedRecours.date_recours ||
                        "Non renseignée"}
                    </strong>
                  </div>

                  {selectedRecours.email && (
                    <div className="info-box">
                      <span className="info-label">
                        Email étudiant
                      </span>

                      <strong>
                        {selectedRecours.email}
                      </strong>
                    </div>
                  )}

                  {selectedRecours.cote !==
                    undefined &&
                    selectedRecours.cote !== null && (
                      <div className="info-box">
                        <span className="info-label">
                          Nouvelle cote
                        </span>

                        <strong className="new-grade">
                          {selectedRecours.cote}/20
                        </strong>
                      </div>
                    )}
                </div>

                {/* =================================================
                    MOTIF DU RECOURS
                ================================================= */}

                <div className="detail-section">
                  <div className="section-title">
                    <span className="section-icon">
                      📝
                    </span>

                    <h3>
                      Motif du recours
                    </h3>
                  </div>

                  <div className="motif-box">
                    {selectedRecours.motif ||
                      "Aucun motif renseigné."}
                  </div>
                </div>

                {/* =================================================
                    PIÈCE JOINTE
                ================================================= */}

                <div className="detail-section">
                  <div className="section-title">
                    <span className="section-icon">
                      📎
                    </span>

                    <h3>Pièces jointes</h3>
                  </div>

                  {selectedRecours.recours_url ? (
                    <div className="attachment-box">
                      <div className="attachment-info">
                        <div className="attachment-icon">
                          📄
                        </div>

                        <div>
                          <strong>
                            Document justificatif
                          </strong>

                          <span>
                            Pièce jointe au recours
                          </span>
                        </div>
                      </div>

                      <a
                        href={
                          selectedRecours.recours_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-view-file"
                      >
                        <span>👁</span>
                        Voir le fichier
                      </a>
                    </div>
                  ) : (
                    <div className="no-attachment">
                      <span className="no-attachment-icon">
                        📎
                      </span>

                      <span>
                        Aucune pièce jointe pour ce
                        recours.
                      </span>
                    </div>
                  )}
                </div>

                {/* =================================================
                    MOTIF DU REJET DÉJÀ ENREGISTRÉ
                ================================================= */}

                {selectedRecours.statut ===
                  "Rejeté" &&
                  selectedRecours.motif_rejet && (
                    <div className="detail-section rejection-section">
                      <div className="section-title">
                        <span className="section-icon rejection-icon">
                          ⚠️
                        </span>

                        <h3>
                          Motif du rejet
                        </h3>
                      </div>

                      <div className="rejection-box">
                        {
                          selectedRecours.motif_rejet
                        }
                      </div>
                    </div>
                  )}
              </div>

              {/* =================================================
                  RÉPONSE
              ================================================= */}

              {selectedRecours.statut ===
                "En attente" && (
                <div className="repondre-box">
                  <div className="response-header">
                    <div>
                      <span className="response-label">
                        ACTION
                      </span>

                      <h3>
                        Traiter ce recours
                      </h3>
                    </div>

                    <span className="pending-indicator">
                      En attente de décision
                    </span>
                  </div>

                  <p className="response-description">
                    Choisissez d'accepter ou de
                    rejeter le recours.
                  </p>

                  {/* =============================================
                      BOUTONS PRINCIPAUX
                  ============================================= */}

                  {!showRejectInput && (
                    <div className="actions">
                      <button
                        type="button"
                        className="btn-accept"
                        onClick={
                          handleAccepter
                        }
                      >
                        <span>✓</span>
                        Accepter le recours
                      </button>

                      <button
                        type="button"
                        className="btn-reject"
                        onClick={
                          handleAfficherRejet
                        }
                      >
                        <span>×</span>
                        Rejeter le recours
                      </button>
                    </div>
                  )}

                  {/* =============================================
                      FORMULAIRE REJET
                  ============================================= */}

                  {showRejectInput && (
                    <div className="reject-section">
                      <div className="reject-form-header">
                        <div className="reject-form-icon">
                          ⚠️
                        </div>

                        <div>
                          <strong>
                            Motif du rejet
                          </strong>

                          <span>
                            Indiquez la raison pour
                            laquelle ce recours est
                            rejeté.
                          </span>
                        </div>
                      </div>

                      <textarea
                        className="reject-textarea"
                        value={motifRejet}
                        placeholder="Saisissez le motif du rejet..."
                        maxLength={255}
                        rows={5}
                        autoFocus
                        onChange={(e) =>
                          setMotifRejet(
                            e.target.value
                          )
                        }
                      />

                      <div className="reject-form-footer">
                        <span className="reject-character-count">
                          {motifRejet.length}/255
                        </span>

                        <div className="reject-form-actions">
                          <button
                            type="button"
                            className="btn-cancel-reject"
                            onClick={
                              handleAnnulerRejet
                            }
                            disabled={
                              isRejecting
                            }
                          >
                            Annuler
                          </button>

                          <button
                            type="button"
                            className="btn-confirm-reject"
                            disabled={
                              !motifRejet.trim() ||
                              isRejecting
                            }
                            onClick={() =>
                              handleRejeter(
                                selectedRecours.id_recours,
                                motifRejet
                              )
                            }
                          >
                            {isRejecting ? (
                              <>
                                <span className="button-spinner"></span>
                                Traitement...
                              </>
                            ) : (
                              <>
                                <span>✓</span>
                                Valider le rejet
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =============================================
                      SAISIE COTE
                  ============================================= */}

                  {showCoteInput && (
                    <div className="cote-section">
                      <div className="cote-title">
                        <span className="cote-icon">
                          🎓
                        </span>

                        <div>
                          <strong>
                            Nouvelle cote
                          </strong>

                          <span>
                            Entrez la nouvelle note
                            de l'étudiant.
                          </span>
                        </div>
                      </div>

                      <div className="cote-input-wrapper">
                        <input
                          type="text"
                          value={newCote}
                          inputMode="numeric"
                          pattern="^([0-9]|1[0-9]|20)?$"
                          placeholder="0 – 20"
                          aria-label="Nouvelle cote"
                          onChange={(e) => {
                            const value =
                              e.target.value;

                            if (value === "") {
                              setNewCote("");
                              return;
                            }

                            const regex =
                              /^([0-9]|1[0-9]|20)$/;

                            if (
                              regex.test(value)
                            ) {
                              setNewCote(value);
                            }
                          }}
                        />

                        <span className="cote-max">
                          / 20
                        </span>

                        <button
                          type="button"
                          className="btn-save"
                          onClick={() =>
                            handleSaveCote(
                              selectedRecours.id_recours,
                              newCote
                            )
                          }
                        >
                          Valider
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =================================================
                  RECOURS ACCEPTÉ
              ================================================= */}

              {selectedRecours.statut ===
                "Accepté" && (
                <div className="processed-box accepted-box">
                  <div className="processed-icon">
                    ✓
                  </div>

                  <div>
                    <strong>
                      Recours accepté
                    </strong>

                    <p>
                      Ce recours a déjà été traité
                      favorablement.
                    </p>
                  </div>
                </div>
              )}

              {/* =================================================
                  RECOURS REJETÉ
              ================================================= */}

              {selectedRecours.statut ===
                "Rejeté" && (
                <div className="processed-box rejected-box">
                  <div className="processed-icon">
                    ×
                  </div>

                  <div>
                    <strong>
                      Recours rejeté
                    </strong>

                    <p>
                      Ce recours a déjà été traité
                      et rejeté.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="recours-card-consign">
              <div className="empty-detail-icon">
                ⚖️
              </div>

              <h3>
                Aucun recours sélectionné
              </h3>

              <p>
                Sélectionnez un recours dans la
                liste pour consulter son dossier
                complet et effectuer son traitement.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recours;
