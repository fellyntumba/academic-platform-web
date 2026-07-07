import React, { useState, useEffect } from "react";
import "./SuiviRecours.css";

import {
  getPromotionsService,
  getSemestresService,
  getSessionsService,
  getSuiviRecoursService // 🔥 AJOUT
} from "./serviceRecours";

const SuiviRecours = ({ code_mention }) => {

  // 🔥 DONNÉES RÉELLES
  const [recoursData, setRecoursData] = useState([]);

  // 🔹 filtres
  const [promotionsList, setPromotionsList] = useState([]);
  const [semestresList, setSemestresList] = useState([]);
  const [sessionsList, setSessionsList] = useState([]);

  const [promotion, setPromotion] = useState("");
  const [semestre, setSemestre] = useState("");
  const [session, setSession] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= PROMOTIONS =================
  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const res = await getPromotionsService({ code_mention });
        setPromotionsList(res.data || []);
      } catch (error) {
        console.error("Erreur promotions :", error);
        setPromotionsList([]);
      }
    };

    loadPromotions();
  }, []);

  // ================= SEMESTRES =================
  useEffect(() => {
    const loadSemestres = async () => {
      try {
        if (!promotion) {
          setSemestresList([]);
          return;
        }

        const res = await getSemestresService({
          id_promotion: promotion,
        });

        setSemestresList(res.data || []);

        // reset cascade
        setSemestre("");
        setSession("");
        setSessionsList([]);
        setRecoursData([]);

      } catch (error) {
        console.error("Erreur semestres :", error);
        setSemestresList([]);
      }
    };

    loadSemestres();
  }, [promotion]);

  // ================= SESSIONS =================
  useEffect(() => {
    const loadSessions = async () => {
      try {
        if (!promotion || !semestre) {
          setSessionsList([]);
          return;
        }

        const data = await getSessionsService({
          id_version: promotion,
          semestre_id: semestre,
        });

        setSessionsList(data || []);

        // reset
        setSession("");
        setRecoursData([]);

      } catch (error) {
        console.error("Erreur sessions :", error);
        setSessionsList([]);
      }
    };

    loadSessions();
  }, [promotion, semestre]);

  // ================= 🔥 CHARGER SUIVI RECOURS =================
  useEffect(() => {
    const loadRecours = async () => {
      try {
        if (!promotion || !semestre || !session) {
          setRecoursData([]);
          return;
        }

        setLoading(true);

        const data = await getSuiviRecoursService({
          promotion_version_id: promotion,
          semestre_id: semestre,
          session_id: session,
        });

        setRecoursData(data || []);

      } catch (error) {
        console.error("Erreur suivi recours :", error);
        setRecoursData([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecours();
  }, [promotion, semestre, session]);

  return (
    <div className="suivi-recours-container fade-in">

      {/* ================= HEADER ================= */}
      <div className="suivi-header">
        <h2>Suivi des recours</h2>
      </div>

      {/* ================= FILTRES ================= */}
      <div className="filters-bar">

        <select value={promotion} onChange={(e) => setPromotion(e.target.value)}>
          <option value="">Promotion</option>
          {promotionsList.map((p) => (
            <option key={p.id_version} value={p.id_version}>
              {p.nom_promotion}
            </option>
          ))}
        </select>

        <select
          value={semestre}
          onChange={(e) => setSemestre(e.target.value)}
          disabled={!promotion}
        >
          <option value="">Semestre</option>
          {semestresList.map((s) => (
            <option key={s.id_semestre} value={s.id_semestre}>
              {s.libelle}
            </option>
          ))}
        </select>

        <select
          value={session}
          onChange={(e) => setSession(e.target.value)}
          disabled={!semestre}
        >
          <option value="">Session</option>
          {sessionsList.map((sess) => (
            <option key={sess.id_session} value={sess.id_session}>
              {sess.type_session}
            </option>
          ))}
        </select>

      </div>

      {/* ================= TABLE ================= */}
      <div className="table-wrapper">

        {loading ? (
          <p className="empty">Chargement des recours...</p>
        ) : recoursData.length === 0 ? (
          <p className="empty">Aucune donnée trouvée</p>
        ) : (
          <table className="recours-table">
            <thead>
              <tr>
                <th>Cours</th>
                <th>Enseignant</th>
                <th>Recours en attente</th>
              </tr>
            </thead>

            <tbody>
              {recoursData.map((item, index) => (
                <tr key={index}>
                  <td>{item.nom_cours}</td>

                  <td>
                    <div className="teacher-cell">
                      <div className="teacher-name">
                       {item.titre} {item.enseignant_nom}
                      </div>
                      <div className="teacher-phone">
                        {item.telephone}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="recours-count">
                      {item.nombre_recours}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </div>
  );
};

export default SuiviRecours;
