import React, { useState } from "react";
import "./EtudiantsOrdres.css";
import {
  importEtudiantsOrdres,
  enregistrerSituationFinanciereService
} from "./etudiantsOrdresService";

const EtudiantsOrdres = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matricule, setMatricule] = useState("");

  /* ============================= */ 
  /* 🔹 Notification 4s */
  /* ============================= */
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  /* ============================= */
  /* 🔹 Gestion sélection fichier */
  /* ============================= */
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage("");
    setErrors([]);
  };

  /* ============================= */
  /* 🔹 Upload réel */
  /* ============================= */
  const handleUpload = async () => {
    if (!selectedFile) return showMessage("Veuillez sélectionner un fichier Excel.", "error");

    try {
      setLoading(true);
      setMessage("");
      setErrors([]);

      const result = await importEtudiantsOrdres(selectedFile);

      showMessage(`Import terminé : ${result.inserted} étudiant(s) en ordre ajouté(s).`, "success");

      if (result.errors && result.errors.length > 0) {
        setErrors(result.errors);
      }

      setSelectedFile(null);
    } catch (error) {
      showMessage(error.message || "Erreur lors de l'importation.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!matricule.trim()) {
      return showMessage(
        "Veuillez saisir un numéro matricule.",
        "error"
      );
    }

    try {

      setLoading(true);

      const result =
        await enregistrerSituationFinanciereService({
          matricule
        });

      showMessage(
        result.message ||
        "Situation financière enregistrée avec succès.",
        "success"
      );

      setMatricule("");

    } catch (error) {

      showMessage(
        error.message ||
        "Erreur lors de l'enregistrement.",
        "error"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="etudiants-container fade-in">
      <h2>Enregistrement des étudiants en ordre avec les frais</h2>

      {message && (
        <div className={`etudiants-notification ${messageType}`}>
          {message}
        </div>
      )}

      {/* Consigne */}.    
      <div className="consigne-box">
        ⚠️ <strong>Consigne :</strong>  
        Veuillez importer uniquement un fichier Excel (.xlsx, .xls) contenant <strong>une seule colonne "Matricule"</strong>.
      </div>

      {/* Upload Excel */}
      <div className="card-section">
        <h3>Enregistrement via fichier Excel</h3>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button className="primary-btn" onClick={handleUpload} disabled={loading}>
          {loading ? "Import en cours..." : "Enregistrer la liste"}
        </button>
      </div>

      {/* Affichage erreurs */}
      {errors.length > 0 && (
        <div className="error-box">
          <details>
            <summary>⚠️ Erreurs détectées : {errors.length}</summary>
            <ul>
              {errors.map((err, index) => (
                <li key={index}>Ligne {err.ligne} : {err.message}</li>
              ))}
            </ul>
          </details>
        </div>
      )}

      {/* Séparateur */}
      <div className="separator">OU</div>

      {/* Ajout manuel */}
      <div className="card-section">
        <h3>Enregistrement via matricule</h3>

        <input
          type="text"
          placeholder="Saisir le numéro matricule"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
        />

        <button
          className="primary-btn"
          onClick={handleAddStudent}
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Enregistrer l'étudiant"}
        </button>

      </div>
    </div>
  );
};

export default EtudiantsOrdres;
