import React, { useState } from "react";
import "./PeriodeNotes.css";

const PeriodeNotes = () => {
  // 🔹 État simulé : true = période active, false = période clôturée
  const [periodeActive, setPeriodeActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleTogglePeriode = async () => {
    setLoading(true);
    setMessage("");  

    try {
      // 🔜 Ici plus tard : appel API pour lancer ou clôturer la période
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPeriodeActive(!periodeActive);
      setMessage(
        !periodeActive
          ? "✅ La période d'envoi des notes est maintenant lancée."
          : "⚠️ La période d'envoi des notes a été clôturée."
      );
    } catch (error) {
      setMessage("❌ Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="periode-notes-container fade-in">
      <h2>Période d'envoi des notes</h2>
      <p>
        La période actuelle est :{" "}
        <span className={periodeActive ? "active" : "inactive"}>
          {periodeActive ? "Active" : "Clôturée"}
        </span>
      </p>

      <button
        className={`periode-btn ${periodeActive ? "close" : "launch"}`}
        onClick={handleTogglePeriode}
        disabled={loading}
      >
        {loading
          ? "Traitement en cours..."
          : periodeActive
          ? "Clôturer la période"
          : "Lancer la période"}
      </button>

      {message && <div className="periode-message">{message}</div>}
    </div>
  );
};

export default PeriodeNotes;
