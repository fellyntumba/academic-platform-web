import React, { useState, useEffect } from "react";
import "./CreateSession.css";
import {
  getPromotionsService,
  lancerSessionService,
  getSemestresService
} from "./sessionService";     

const CreateSession = ({ code_mention }) => { 
  const [promotions, setPromotions] = useState([]);
  const [promotionID, setPromotionID] = useState("");
  const [typeSession, setTypeSession] = useState("");
  const [semestres, setSemestres] = useState([]);  
  const [semestreID, setSemestreID] = useState("");      // 🔹 Nouveau champ semestre
  const [dateFin, setDateFin] = useState("");

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

  // ===============================
  // Charger les promotions au démarrage
  // ===============================
  useEffect(() => {
    const loadPromotions = async () => { 
      try {
        setLoading(true); // ✅ AJOUT

        const promoData = await getPromotionsService({ code_mention });
        const promos = promoData.data || promoData;

        setPromotions(promos);

      } catch {
        showMessage("Erreur chargement promotions", "error");
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, [code_mention]);

  // ===============================
    // Charger les semestres quand la promotion change
    // ===============================
    useEffect(() => {
      if (!promotionID) {
        setSemestreID("");
        setSemestres([]);
        return;
      }

      const loadSemestres = async () => {
        try {
          const semData = await getSemestresService({ id_promotion: promotionID });
          const sems = semData.data || semData;
          setSemestres(sems);

          setSemestreID(""); // reset propre après chargement
        } catch {
          showMessage("Erreur chargement semestres", "error");
        }
      };

      loadSemestres();
    }, [promotionID]);


  // ===============================
  // Lancer la session
  // ===============================
  const handleLaunch = async () => {
    if ( !typeSession || !dateFin) {
      showMessage("Veuillez remplir tous les champs.", "error");
      return;
    }

    // ❗ semestre obligatoire sauf DETTES
    if (typeSession !== "Dettes" && !semestreID) {
      showMessage("Veuillez sélectionner un semestre.", "error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await lancerSessionService({
        promotionVersionId: promotionID,
        typeSession,
        semestreID,
        dateFin,
        codeMention: code_mention
      });

      if (result.success) {
        showMessage(result.message, "success");

        setPromotionID("");
        setTypeSession("");
        setSemestreID("");
        setDateFin("");
        setSemestres([]); // ✅ important
      } else {
        showMessage(result.message, "error");
      }

    } catch (error) {
      showMessage(error.message || "Erreur lors du lancement.", "error");
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <div className="session-container">
          {message && (
            <div className={`session-notification ${messageType}`}>
              {message}
            </div>
          )}
      <div className="session-card">

        <h2 className="session-title">Lancer une session académique</h2>

        <p className="session-description">
          Sélectionnez la promotion, le type de session, le semestre et la date de fin pour lancer une session académique.
        </p>

        <div className="session-form">

          <div className="session-field">
            <label>Type de session</label>
            <select value={typeSession} onChange={(e) => setTypeSession(e.target.value)}>
              <option value="">-- Sélectionner le type --</option>
              <option value="Normale">Normale</option>
              <option value="Rattrapage">Rattrapage</option>
              <option value="Dettes">Dettes</option>
            </select>
          </div>

          {typeSession !== "Dettes" && (
            <div className="session-field">
              <label>Promotion</label>
              <select value={promotionID} onChange={(e) => setPromotionID(e.target.value)}>
                <option value="">-- Sélectionner la promotion --</option>
                {promotions.map((p) => (
                  <option key={p.id_version} value={p.id_version}>
                    {p.nom_promotion}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 🔹 Champ semestre */}
          {typeSession !== "Dettes" && (
            <div className="session-field">
              <label>Semestre</label>
              <select value={semestreID} onChange={(e) => setSemestreID(e.target.value)}>
                <option value="">-- Sélectionner le semestre --</option>
                {semestres.map((s) => (
                  <option key={s.id_semestre} value={s.id_semestre}>
                    {s.libelle}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="session-field">
            <label>Date de fin de session</label>
            <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
          </div>

        </div>

        <button className="session-btn" onClick={handleLaunch} disabled={loading}>
          {loading ? "Lancement..." : "Lancer la session"}
        </button>

      </div>

 

 
    </div>
  );
};

export default CreateSession;
