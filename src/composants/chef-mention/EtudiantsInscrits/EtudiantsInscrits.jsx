import React, { useState, useEffect } from "react";
import "./EtudiantsInscrits.css";
import { importEtudiantsInscrits, getPromotionsService } from "./etudiantsInscritsService";

const EtudiantsInscrits = ({code_mention}) => {
  const [selectedFile, setSelectedFile] = useState(null);  
  const [promotion, setPromotion] = useState("");    
  const [matricule, setMatricule] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listPromos, setListPromos] = useState([]);
  

  /* ============================= */
  /* 🔹 Gestion notification 4s    */
  /* ============================= */
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };


  // ===============================
  // Charger les promotions au démarrage
  // ===============================
  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const promoData = await getPromotionsService({ code_mention });
        const promos = promoData.data || promoData;
        setListPromos(promos);
      } catch {
        showMessage("Erreur chargement promotions", "error");
      } finally {
        setLoading(false);
      }
    };
    loadPromotions();
  }, [code_mention]);


  /* ============================= */
  /* 🔹 Gestion fichier             */
  /* ============================= */
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage("");
    setErrors([]);
  };

  /* ============================= */
  /* 🔹 Upload réel                 */
  /* ============================= */
  const handleUpload = async () => {

    if (!selectedFile) {
      return showMessage("Veuillez sélectionner un fichier Excel.", "error");
    }

    if (!promotion) {
      return showMessage("Veuillez sélectionner une promotion.", "error");
    }

    try {
      setLoading(true);
      setMessage("");
      setErrors([]);

      const result = await importEtudiantsInscrits(selectedFile, promotion );

      showMessage(`Import terminé : ${result.inserted} inséré(s), ${result.updated} mis à jour.`, "success");

      if (result.errors && result.errors.length > 0) {
        setErrors(result.errors);
      }

      setSelectedFile(null);
      setSelectedFile("");

    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    if (!matricule.trim()) return showMessage("Veuillez saisir un numéro matricule.", "error");
    showMessage(`Étudiant ${matricule} enregistré avec succès (simulation).`, "success");
    setMatricule("");
  };

// {listPromos && console.log(listPromos);}

  return (
    <div className="etudiants-container fade-in">
      <h2>Enregistrement des étudiants régulièrement inscrits</h2>

      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}

      <div className="consigne-box">
        ⚠️ <strong>Consigne :</strong> Veuillez importer uniquement un fichier Excel (.xlsx, .xls) contenant obligatoirement les colonnes <strong> "matricule", "nom", "postnom", "prenom" et "sexe"</strong>.
      </div>

      {/* Upload Excel */}
      <div className="card-section">
        <h3>Enregistrement via fichier Excel</h3>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />

        <div className="upload-row">

            <select value={promotion} onChange={(e) => setPromotion(e.target.value)}>
              <option value="">-- Sélectionner une promotion --</option>
            {listPromos.map((p) => (
              <option key={p.id_version} value={p.nom_promotion}>
                {p.nom_promotion}
              </option>
            ))}
          </select>

            <button
              className="primary-btn"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Import en cours..." : "Enregistrer la liste"}
          </button>

        </div>
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

      <div className="separator">OU</div>

      {/* Ajout manuel */}
      <div className="card-section">
        <h3>Enregistrement via matricule</h3>
        <input type="text" placeholder="Saisir le numéro matricule" value={matricule} onChange={(e) => setMatricule(e.target.value)} />
        <button className="primary-btn" onClick={handleAddStudent}>Enregistrer l'étudiant</button>
      </div>
    </div>
  );
};

export default EtudiantsInscrits;
