import React, { useState, useEffect } from "react";
import "./SuiviEnvoiNotes.css";
import { 
  getSuiviNotesService, 
  getPromotionsService, 
  getSemestresService, 
  getSessionsService ,
  publierResultatsService,
  getStatutPublicationService
} from "./serviceSuiviNotes";

const SuiviEnvoiNotes = ({ code_mention }) => {
  const [dataNotes, setDataNotes] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [promotion, setPromotion] = useState("");
  const [promotionsList, setPromotionsList] = useState([]);

  const [semestre, setSemestre] = useState("");
  const [semestresList, setSemestresList] = useState([]);

  const [session, setSession] = useState("");
  const [sessionsList, setSessionsList] = useState([]); // 🔹 nouvelle state
  const [statutPublication, setStatutPublication] = useState(null); // null | "en_cours" | "cloturee"
  const [isPublishing, setIsPublishing] = useState(false);

  const [dateFinPub, setDateFinPub] = useState("");

  // Charger les promotions au démarrage
  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const promoData = await getPromotionsService({ code_mention });
        const promos = promoData.data || promoData;
        setPromotionsList(promos);
      } catch {
        showMessage("Erreur chargement promotions", "error");
      } finally {
        setLoading(false);
      }
    };
    loadPromotions();
  }, [code_mention]);

  // Charger les semestres quand la promotion change
  useEffect(() => {
    if (!promotion) return;

    const loadSemestres = async () => {
      try {
        const semData = await getSemestresService({ id_promotion: promotion });
        const sems = semData.data || semData;
        setSemestresList(sems);
      } catch {
        showMessage("Erreur chargement semestres", "error");
      }
    };
    loadSemestres();

    // Réinitialiser semestre et sessions
    setSemestre("");
    setSession("");
    setSessionsList([]);
  }, [promotion]);

  // Charger les sessions quand la promotion ou le semestre change
  useEffect(() => {
    if (!promotion || !semestre) {
      setSessionsList([]);
      setSession("");
      return;
    }

    const loadSessions = async () => {
       
      try {
        const data = await getSessionsService({ id_version: promotion, semestre_id: semestre });
        setSessionsList(data);
      } catch (error) {
        console.error("Erreur chargement sessions", error);
      }
    };
    loadSessions();

    // Réinitialiser session sélectionnée
    setSession("");
  }, [promotion, semestre]);


  // 🔹 Vérifier statut publication 
  useEffect(() => {
    const checkPublication = async () => {
      if (!promotion || !semestre || !session) {
        setStatutPublication(null);
        return;
      }

      try {
        const statut = await getStatutPublicationService({
          promotion_version_id: promotion,
          semestre_id: semestre,
          session_id: session
        });

        setStatutPublication(statut); // "en_cours" ou "cloturee"

      } catch (error) {
        // 🔥 cas 404 → aucune publication
        if (error.message.includes("Aucune publication")) {
          setStatutPublication(null);
        } else {
          console.error("Erreur statut publication :", error);
          setStatutPublication(null);
        }
      }
    };

    checkPublication();
  }, [promotion, semestre, session]);

  // Charger les données lorsque la promotion, le semestre ou la session change
  useEffect(() => {
    const fetchData = async () => {
      if (!promotion || !semestre || !session) {
        setDataNotes([]);
        return;
      }

      setLoading(true);
      try {
        const data = await getSuiviNotesService({
          id_version: promotion,
          semestre_id: semestre,
          session_id: session,
        });
        setDataNotes(data);
      } catch (error) {
        console.error("Erreur chargement suivi notes :", error);
        setDataNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [promotion, semestre, session]);

  //Publication des resultats
  const handlePublication = async () => {
    if (!promotion || !semestre || !session || !dateFinPub) return;

    try {
      setIsPublishing(true);

      await publierResultatsService({
        promotion_version_id: promotion,
        semestre_id: semestre,
        session_id: session,
        date_fin_pub: dateFinPub
      });

      // 🔥 RECHARGER LE STATUT DEPUIS LA DB
      const statut = await getStatutPublicationService({
        promotion_version_id: promotion,
        semestre_id: semestre,
        session_id: session
      });

      setStatutPublication(statut); // "en_cours"

    } catch (error) {
      console.error("Erreur publication :", error);
      setIsPublishing(false);
    }
  };

  return (
    <div className="suivi-notes-container fade-in">

      <h2 className="suivi-title">Suivre les notes</h2>

      <div className="suivi-header">
        <select
          className="promotion-select"
          value={promotion}
          onChange={(e) => setPromotion(e.target.value)}
        >
          <option value="">-- Sélectionner la promotion --</option>
          {promotionsList.map((p) => (
            <option key={p.id_version} value={p.id_version}>
              {p.nom_promotion}
            </option>
          ))}
        </select>

        <select
          className="semestre-select"
          value={semestre}
          onChange={(e) => setSemestre(e.target.value)}
        >
          <option value="">-- Sélectionner le semestre --</option>
          {semestresList.map((s) => (
            <option key={s.id_semestre} value={s.id_semestre}>
              {s.libelle}
            </option>
          ))}
        </select>

        <select
          className="semestre-select"
          value={session}
          onChange={(e) => setSession(e.target.value)}
        >
          <option value="">-- Sélectionner la session --</option>
          {sessionsList.map((sess) => (
            <option key={sess.id_session} value={sess.id_session}>
              {sess.type_session}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="notes-table">
          <thead>
            <tr>
              <th>Cours</th>
              <th>Enseignant</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3">Chargement...</td>
              </tr>
            ) : dataNotes.length === 0 ? (
              <tr>
                <td colSpan="3">Aucune donnée disponible</td>
              </tr>
            ) : (
              dataNotes.map((item, index) => (
                <tr key={index}>
                  <td>{item.nom_cours}</td>
                  <td>{item.enseignant}
                    <div className="stats">{item.telephone}</div>
                  </td>
                  <td>
                    {item.statut === "Envoyées" ? (
                      <div className="status sent">
                        ✅ Envoyées
                        <div className="stats">
                          Réussite : {item.taux_reussite ?? 0}% | Échec : {item.taux_echec ?? 0}% |
                          MC : {item.taux_manque_cote ?? 0}% | Effectif: {item.total_etudiants}
                          
                        </div>
                      </div>
                    ) : (
                      <div className="status not-sent">❌ Non envoyées</div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
        <input
          type="date"
          className="date-select"
          value={dateFinPub}
          onChange={(e) => setDateFinPub(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          title="Choisir la date de fin de publication"
        />
        <button
          className="validation-btn not-validated"
          onClick={handlePublication}
          disabled={
            isPublishing ||
            statutPublication === "en_cours" || 
            statutPublication === "cloturee" || 
            !promotion || 
            !semestre || 
            !session || 
            !dateFinPub
          }
        >
          {statutPublication === "en_cours"
            ? "Publication en cours"
            : statutPublication === "cloturee"
            ? "Publication clôturée"
            : "Lancer la publication"}
        </button>
      </div>
    </div>
  );
};

export default SuiviEnvoiNotes;
