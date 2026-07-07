import { useEffect, useState } from "react";
import "../../../styles-pages/enseignant/Composants-Styles/RepondreRecour.css";
import { fetchRecoursByEnseignant, rejectRecours, acceptRecours } from "../services/Recours.js";

function RepondreRecours({idEnsei}) {

  const [recoursData, setRecoursData] = useState([]);
  const [selectedRecours, setSelectedRecours] = useState([]);
  const [newCote, setNewCote] = useState("");
  const [showCoteInput, setShowCoteInput] = useState(false);
  const [showDetailsRecours, setShowDetailsRecours] = useState(false);
  // 🔥 Exemple : enseignant connecté avec id = 5
  const enseignantId = idEnsei;

  // Charger les recours depuis le backend
  useEffect(() => {
    const loadRecours = async () => {

      try {
        const response = await fetchRecoursByEnseignant(enseignantId);
        if(!response.ok){
          setRecoursData([]);
          return
        }
         const recours = await response.json()
         setRecoursData(Array.isArray(recours)? recours: []);
      } catch (error) {
        console.error(error);
        setRecoursData([]);
      }
    }
    loadRecours();
  }, [enseignantId]);



  const handleRejeter = async (id_recours) => {
      try {
        await rejectRecours(id_recours);
        // const nombre = await getRecoursNonTraites(idEnsei);
        setRecoursData((prev) =>
          prev.map((rec) =>
            rec.id_recours === id_recours ? { ...rec, statut: "Rejeté" } : rec
          )
        );
        setSelectedRecours((prev) => prev && { ...prev, statut: "Rejeté" });
      } catch (error) {
        console.error("Erreur lors du rejet :", error);
      }
  };

  const handleAccepter = () => setShowCoteInput(true);



  const handleSaveCote = async (id_recours, newCote) => {
    if (!newCote) return;
    // console.log(id_recours, newCote)
    try {
      await acceptRecours(id_recours, newCote);
      // const nombre = await getRecoursNonTraites(idEnsei);
      setRecoursData((prev) =>
        prev.map((rec) =>
          rec.id_recours === id_recours
            ? { ...rec, statut: "Accepté", cote: parseInt(newCote) }
            : rec
        )
      );
      setSelectedRecours(
        (prev) => prev && { ...prev, statut: "Accepté", cote: parseInt(newCote) }
      );
      setNewCote("");
      setShowCoteInput(false);
    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
    }
};
// console.log(recoursData.length)
  return (
    <div className="recours-container">
      {/* Liste de recours */}
      <div className="recours-list">
        <p className="recours">Liste de recours reçus</p>
        {recoursData.length === 0  
        ?
        (
          <p className="no-recours">Aucun recours reçu</p>
        )
        : (recoursData.map((rec) => (
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
              </div>))
          )
        
        }

      </div>

      {/* Détails */}
      <div className="separator"></div>
      <div className="recours-details">
        {showDetailsRecours? (
          <div className="details-wrapper">
            <div className="card-detail">
              <h2>
                Recours de {selectedRecours.prenom} {selectedRecours.nom}
              </h2>
              <p>
                <strong>Description :</strong> {selectedRecours.motif}
              </p>
              <p>
                <strong>Date :</strong> {selectedRecours.date_recours}
              </p>
              <p>
                <strong>Cours :</strong> {selectedRecours.nom_cours}
              </p>
              <p>
                <strong>Pièce(s) jointe(s) :</strong>{" "}
              </p>
              {selectedRecours.pieces_jointes?.map((file, i) =>{
                const isPdf = file.endsWith('.pdf');

                return (
                  <div key={i}>
                      <p>  
                        <a
                          href={`http://localhost:3000/${file}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {isPdf ? "Voir le PDF" : "Voir l'image"}
                          {/* Voir le fichier */}
                        </a>
                      </p>
                  </div>
                );
              })}
              
              <p>
                <strong>Statut :</strong>{" "}
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
                      inputMode="numeric"     // clavier numérique mobile
                      pattern="^([0-9]|1[0-9]|20)?$"
                      placeholder="Cote (0–20 ou vide)"
                      onChange={(e) => {
                        const value = e.target.value;

                        // Autoriser le vide
                        if (value === "") {
                          setNewCote("");
                          return;
                        }

                        // Autoriser uniquement 0 à 20
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
            <h3 >
              Aucun recours sélectionné
            </h3>
            <div>
              
            </div>
              <p>
                Aucun recours n'est actuellement affiché. 
                Veuillez selectionner un recours disponible dans la liste de gauche afin d'en consulter les details.
              </p>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default RepondreRecours;



