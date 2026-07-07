import React, { useState } from "react";
import { generateSemestres } from "./semestreService"; // ✅ IMPORT SERVICE
import "./CreateSemestres.css";

const CreateSemestres = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  /* =========================
     Notification comme Parcours
  ========================= */

  const showMessage = (msg, type = "success") => {

    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType(""); 
    }, 4000);

  };

  const handleCreate = async () => {
    try {
      setLoading(true);

      const result = await generateSemestres(); 

      if (result.success) {
        showMessage(result.message, "success");
      } else {
         showMessage(result.message, "error");
      }

    } catch (error) {
       showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="semestre-container">
      <div className="semestre-card">
        <h2 className="semestre-title">
          Création des semestres & sessions
        </h2>
              {message && (
                <div className={`notification ${messageType}`}>
                  {message}
                </div>
              )}

        <p className="semestre-description">
          Cliquez sur le bouton ci-dessous pour générer automatiquement
          les semestres et les sessions académiques.
        </p>

        <button
          className="semestre-btn"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? "Création en cours..." : "Créer les semestres"}
        </button>

        {/* ✅ MESSAGE DYNAMIQUE */}
        {message && (
          <div
            className={
              success
                ? "semestre-success"
                : "semestre-error"
            }
          >
            {success ? "✅ " : "❌ "}
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSemestres;
