import React, { useState, useEffect } from "react";
import "./PeriodeRecours.css"; // 🔹 CSS spécifique aux périodes de recours
import {
  getPromotionsService,
  getSemestresEtSessionsRecoursService,
  lancerRecoursService
} from "./periodeRecoursService";

const PeriodeRecours = ({ code_mention }) => {
  const [promotions, setPromotions] = useState([]);
  const [promotionID, setPromotionID] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [semestres, setSemestres] = useState([]);
  const [semestreID, setSemestreID] = useState("");
  const [sessions, setSessions] = useState([]);
  const [dateFinRecours, setDateFinRecours] = useState("");

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
  // Charger promotions
  // ===============================
  useEffect(() => {
    const loadPromotions = async () => {
      try {
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
  // Charger semestres + sessions après sélection promotion 
  // ===============================
  useEffect(() => {
    if (!promotionID) {
      setSemestres([]);
      setSessions([]);
      return;
    }

    const loadData = async () => {
      try {
        const { semestres, sessions } = await getSemestresEtSessionsRecoursService({
          promotionVersionId: promotionID
        });

        setSemestres(semestres || []);
        setSessions(sessions || []); // 🔥 IMPORTANT

      } catch (error) {
        console.error(error);
        showMessage("Erreur chargement données", "error");
        setSemestres([]);
        setSessions([]);
      }
    };

    loadData();

  }, [promotionID]);

  // ===============================
  // Lancer période recours
  // ===============================
  const handleLaunchRecours = async () => {
    if (!promotionID || !sessionID || !semestreID || !dateFinRecours) {
      showMessage("Veuillez remplir tous les champs.", "error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await lancerRecoursService({
        promotionVersionId: promotionID,
        sessionId: sessionID,
        semestreID,
        dateFinRecours
      });

      if (result.success) {
        showMessage(result.message, "success");
        setPromotionID("");
        setSessionID("");
        setSemestreID("");
        setDateFinRecours("");
      } else {
        showMessage(result.message, "error");
      }
    } catch (error) {
      console.error(error);
      showMessage(error.message || "Erreur lors du lancement de la période de recours.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="recours-container">

        <div className="recours-card">

          <h2 className="recours-title">
            Lancer la période d'envoi des recours
          </h2>

          <p className="recours-description">
            Sélectionnez la promotion, le type de session, le semestre et la date de fin pour lancer la période d'envoi des recours.
          </p>

          <div className="recours-form">

            <div className="recours-field">
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

            <div className="recours-field">
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

            <div className="recours-field">
              <label>Type de session</label>
              <select value={sessionID} onChange={(e) => setSessionID(e.target.value)}>
                <option value="">Sélectionner le type</option>

                {sessions.map((s) => (
                  <option key={s.id_session} value={s.id_session}>
                    {s.type_session} {s.semestre_libelle}
                  </option>
                ))}
            </select>
            </div>

            <div className="recours-field">
              <label>Date de fin de la période de recours</label>
              <input
                type="date"
                value={dateFinRecours}
                onChange={(e) => setDateFinRecours(e.target.value)}
              />
            </div>

          </div>

          <button
            className="recours-btn"
            onClick={handleLaunchRecours}
            disabled={loading}
          >
            {loading ? "Lancement..." : "Lancer la période de recours"}
          </button>

        </div>

        {message && (
          <div className={`notification ${messageType}`}> {message}
          </div>
        )}

      </div>
    );
};

export default PeriodeRecours;
