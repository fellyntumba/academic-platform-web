import React, { useState, useEffect } from "react";
import "./EtudiantsInscrits.css";
import {
  importEtudiantsInscrits,
  getPromotionsService,
  inscrireEtudiantService
} from "./etudiantsInscritsService";

const EtudiantsInscrits = ({code_mention}) => {
  const [selectedFile, setSelectedFile] = useState(null);  
  const [promotion, setPromotion] = useState("");    
  const [ancienMatricule, setAncienMatricule] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listPromos, setListPromos] = useState([]);
  const [nom, setNom] = useState("");
  const [postnom, setPostnom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [sexe, setSexe] = useState("");
  const [promotionManuelle, setPromotionManuelle] = useState("");
  
  
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


  const handleAddStudent = async () => {
    if (
      !ancienMatricule.trim() ||
      !nom.trim() ||
      !postnom.trim() ||
      !prenom.trim() ||
      !sexe ||
      !promotionManuelle
    ) {
      return showMessage(
        "Veuillez renseigner tous les champs.",
        "error"
      );
    }

    try {

      setLoading(true);

      const result = await inscrireEtudiantService({
        ancienMatricule,
        nom,
        postnom,
        prenom,
        sexe,
        nom_promotion: promotionManuelle
      });

      showMessage(
        result.message || "Étudiant inscrit avec succès.",
        "success"
      );

      // Réinitialisation du formulaire
      setAncienMatricule("");
      setNom("");
      setPostnom("");
      setPrenom("");
      setSexe("");
      setPromotionManuelle("");

    } catch (error) {

      showMessage(
        error.message || "Erreur lors de l'inscription.",
        "error"
      );

    } finally {

      setLoading(false);

    }

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
        ⚠️ <strong>Consigne :</strong> Veuillez importer uniquement un fichier Excel (.xlsx, .xls) contenant obligatoirement les colonnes <strong> "code", "nom", "postnom" et "sexe"</strong>.
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
        <h3>Enregistrement manuel d'un étudiant</h3>

        <div className="manual-form">

          <div className="manual-column">

            <input
              type="text"
              placeholder="Code"
              value={ancienMatricule}
              onChange={(e) => setAncienMatricule(e.target.value)}
            />

            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />

            <input
              type="text"
              placeholder="Postnom"
              value={postnom}
              onChange={(e) => setPostnom(e.target.value)}
            />

          </div>

          <div className="manual-column">

            <input
              type="text"
              placeholder="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />

            <select
              value={sexe}
              onChange={(e) => setSexe(e.target.value)}
            >
              <option value="">-- Sexe --</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>

            <select
              value={promotionManuelle}
              onChange={(e) => setPromotionManuelle(e.target.value)}
            >
              <option value="">-- Promotion --</option>

              {listPromos.map((p) => (
                <option
                  key={p.id_version}
                  value={p.nom_promotion}
                >
                  {p.nom_promotion}
                </option>
              ))}

            </select>

          </div>

        </div>

        <button
          className="primary-btn"
          onClick={handleAddStudent}
        >
          Enregistrer l'étudiant
        </button>

      </div>
    </div>
  );
};

export default EtudiantsInscrits;
