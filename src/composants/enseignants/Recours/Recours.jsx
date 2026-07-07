import { useEffect, useState } from "react";
import "./Recours.css";
import { getRecoursEnseignantEnCoursService, rejectRecoursService, acceptRecoursService} from "./recoursService";


function Recours({id_enseignant, annee}) {

  const [recoursData, setRecoursData] = useState([]);
  const [selectedRecours, setSelectedRecours] = useState([]);
  const [newCote, setNewCote] = useState("");
  const [showCoteInput, setShowCoteInput] = useState(false);
  const [showDetailsRecours, setShowDetailsRecours] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const FILE_BASE_URL = "http://localhost:3000/uploads/recours/";

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  // Charger les recours depuis le backend 
  useEffect(() => {
    const loadRecours = async () => {
      try {
        if (!id_enseignant) return;

        const data = await getRecoursEnseignantEnCoursService(id_enseignant);

        setRecoursData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur chargement recours :", error);
        setRecoursData([]);
      }
    };

    loadRecours();
  }, [id_enseignant]);


  //Rejeter recours
  const handleRejeter = async (id_recours) => {
    try {
      await rejectRecoursService(id_recours);

      // 🔥 update UI sans reload
      setRecoursData((prev) =>
        prev.map((rec) =>
          rec.id_recours === id_recours
            ? { ...rec, statut: "Rejeté" }
            : rec
        )
      );

      setSelectedRecours((prev) =>
        prev && { ...prev, statut: "Rejeté" }
      );
      showMessage("Recours rejeté avec succès", "success");

    } catch (error) {
      console.error("Erreur lors du rejet :", error);
    }
  };

  const handleAccepter = () => setShowCoteInput(true);

  //Accepter recours
  const handleSaveCote = async (id_recours, newCote) => {
    if (!newCote) {
      showMessage("Veuillez entrer une cote valide", "error");
      return;
    }

    try {
      await acceptRecoursService({
        id_recours,
        newCote: parseInt(newCote),
      });

      // 🔥 update UI instantané
      setRecoursData((prev) =>
        prev.map((rec) =>
          rec.id_recours === id_recours
            ? { ...rec, statut: "Accepté", cote: parseInt(newCote) }
            : rec
        )
      );

      setSelectedRecours((prev) =>
        prev && {
          ...prev,
          statut: "Accepté",
          cote: parseInt(newCote),
        }
      );

      setNewCote("");
      setShowCoteInput(false);
      showMessage("Recours accepté et cote mise à jour", "success");

    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
    }
  };
// console.log(recoursData.length)
  return (
    <div className="recours-page">

      {/* ================= HEADER ================= */}
      <div className="recours-header">
        <div className="header-left">
          <h2>Traitement des recours</h2>
        </div>

        <div className="header-right">
         
        </div>
      </div>

      {message && (
        <div className={`recours-notification ${messageType}`}>
          {message}
        </div>
      )}

      {/* ================= CONTENU ================= */}
      <div className="recours-container">

        {/* LISTE */}
        <div className="recours-list">
          <p className="recours">Liste de recours reçus</p>

          {recoursData.length === 0 ? (
            <p className="no-recours">Aucun recours reçu</p>
          ) : (
            recoursData.map((rec) => (
              <div
                key={rec.id_recours}
                className={`recours-item ${
                  selectedRecours?.id_recours === rec.id_recours ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedRecours(rec);
                  setShowDetailsRecours(true);
                  setShowCoteInput(false);
                  setNewCote("");
                }}
              >
                <span>{rec.matricule}</span>
                <span
                  className={`status-small ${
                    rec.statut === "Accepté"
                      ? "status-accepted"
                      : rec.statut === "Rejeté"
                      ? "status-rejected"
                      : "status-pending"
                  }`}
                >
                  {rec.statut}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="separator"></div>

        {/* DETAILS */}
        <div className="recours-details">
          {showDetailsRecours && selectedRecours ? (
            <div className="details-wrapper">

              <div className="card-detail"> 
                <h2>
                  Recours de {selectedRecours.prenom} {selectedRecours.nom}
                </h2>

                <p><strong>Description :</strong> {selectedRecours.motif}</p>
                <p><strong>Date :</strong> {selectedRecours.date_recours}</p>
                <p><strong>Cours :</strong> {selectedRecours.nom_cours}</p>
                {selectedRecours.pieces_joints && (
                  <p>
                    <strong>Pièce jointe :</strong>{" "}
                    <a
                      href={`${FILE_BASE_URL}${selectedRecours.pieces_joints}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#007bff", textDecoration: "underline" }}
                    >
                      Voir le fichier
                    </a>
                  </p>
                )}

                <p><strong>Statut :</strong>{" "}
                  <span
                    className={`status ${
                      selectedRecours.statut === "Accepté"
                        ? "status-accepted"
                        : selectedRecours.statut === "Rejeté"
                        ? "status-rejected"
                        : "status-pending"
                    }`}
                  >
                    {selectedRecours.statut}
                  </span>
                </p>
              </div>

              {selectedRecours.statut === "En attente" && (
                <div className="repondre-box">
                  <h3>Répondre :</h3>

                  <div className="actions">
                    <button className="btn-accept" onClick={handleAccepter}>
                      Accepté
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleRejeter(selectedRecours.id_recours)}
                    >
                      Rejeté
                    </button>
                  </div>

                  {showCoteInput && (
                    <div className="cote-section">
                      <label>Nouvelle cote :</label>
                      <input
                        type="text"
                        value={newCote}
                        inputMode="numeric"
                        pattern="^([0-9]|1[0-9]|20)?$"
                        placeholder="0 – 20"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            setNewCote("");
                            return;
                          }
                          const regex = /^([0-9]|1[0-9]|20)$/;
                          if (regex.test(value)) {
                            setNewCote(value);
                          }
                        }}
                      />
                      <button
                        className="btn-save"
                        onClick={() =>
                          handleSaveCote(selectedRecours.id_recours, newCote)
                        }
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="recours-card-consign">
              <h3>Aucun recours sélectionné</h3>
              <p>
                Veuillez sélectionner un recours dans la liste de gauche
                pour consulter ses détails.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recours;



