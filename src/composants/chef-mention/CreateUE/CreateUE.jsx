import React, { useState, useEffect } from "react";
import "./CreateUE.css";
import {
  getPromotionsService,
  getSemestresService,
  createUEService,
  updateUEService,
  getUEService,
  deleteUEService,
  getUEByPromotionAnneePasseeService,
  cloneUEAndCoursService
} from "./ueService";

// ============================
// 🔥 COMPOSANT
// ============================
const CreateUE = ({ code_mention }) => {

    // ============================
    // 📌 MODE D'UTILISATION (CREATE / MODIFY / DELETE)
    // ============================
    const [mode, setMode] = useState("create");


    // ============================
    // 📌 DONNÉES UE
    // ============================
    const [ues, setUEs] = useState([]);
    const [selectedUE, setSelectedUE] = useState(null);
    const [deletedCoursIds, setDeletedCoursIds] = useState([]);


    // ============================
    // 📌 FORMULAIRE UE
    // ============================
    const [nomUE, setNomUE] = useState("");
    const [promotionID, setPromotionID] = useState("");
    const [nomPromotion, setNomPromotion] = useState("");
    const [semestre, setSemestre] = useState("");


    // ============================
    // 📌 LISTE DYNAMIQUE DES COURS
    // ============================
    const [coursList, setCoursList] = useState([{ nom: "", credit: 1 }]);


    // ============================
    // 📌 DONNÉES RÉFÉRENTIELLES
    // ============================
    const [promotions, setPromotions] = useState([]);
    const [semestres, setSemestres] = useState([]);
    const [uesAnneePassee, setUEsAnneePassee] = useState([]);


    // ============================
    // 📌 NOTIFICATIONS UI
    // ============================ 
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");


    // ============================
    // 📌 AFFICHAGE DES MESSAGES (SUCCESS / ERROR)
    // ============================
    const showMessage = (msg, type = "success") => {
      setMessage(msg);
      setMessageType(type);

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 4000);

    };


    // ==========================================================
    // 📌 CHARGEMENT DES PROMOTIONS (INIT APP)
    // ==========================================================
    useEffect(() => {
      const fetchPromotions = async () => {
        try {
          const data = await getPromotionsService({ code_mention });
          const list = data.data || [];
          setPromotions(list);
          setUEs([]);

          if (list.length > 0) {
            setPromotionID(Number(list[0].id_version));
            setNomPromotion(list[0].nom_promotion);

          }

        } catch (error) {
          showMessage("Erreur chargement promotions", "error");

        }

      };

      fetchPromotions();

    }, [code_mention]);


    // ==========================================================
    // 📌 CHARGEMENT DES SEMESTRES SELON PROMOTION
    // ==========================================================
    useEffect(() => {
      const fetchSemestres = async () => {
        if (!promotionID) return;
        try {
          const data = await getSemestresService({ id_promotion: promotionID });
          const sems = data.data || [];
          setSemestres(sems);
          if (sems.length > 0) {
            setSemestre(Number(sems[0].id_semestre));

          }
        } catch (error) {
          showMessage("Erreur chargement semestres", "error");
        }

      };

      fetchSemestres();

    }, [promotionID]);


    // ==========================================================
    // 📌 CHARGEMENT DES UE D'UNE ANNÉE PASSÉE (AUTO FILL)
    // ==========================================================
    useEffect(() => {
      const fetchUEAnneePassee = async () => {
        if (!nomPromotion) {
          setUEsAnneePassee([]);
          return;
        }
        try {
          const result = await getUEByPromotionAnneePasseeService({
            nom_promotion: nomPromotion

          });
          setUEsAnneePassee(result.success ? result.data || [] : []);

        } catch (error) {

          setUEsAnneePassee([]);

        }

      };

      fetchUEAnneePassee();

    }, [nomPromotion]);

    // ==========================================================

    // 📌 CHARGEMENT DES UE (MODE MODIFIER / SUPPRIMER)

    // ==========================================================

    useEffect(() => {

      const fetchUEs = async () => {
        if (!promotionID || !semestre || mode === "create") return;
        try {

          const data = await getUEService({
            promotion_version_id: promotionID,
            semestre_id: semestre

          });
          setUEs(data.data || []);

        } catch (error) {

          showMessage("Erreur chargement UE", "error");

        }

      };

      fetchUEs();

    }, [promotionID, semestre, mode]);


    // ==========================================================
    // 📌 SÉLECTION D'UNE UE (MODIFIER / SUPPRIMER)
    // ==========================================================
    const handleSelectUE = (e) => {
      const id = Number(e.target.value);
      const ue = ues.find(u => Number(u.id_ue) === id);

      if (!ue) return;

      setSelectedUE(ue);
      setNomUE(ue.nom_ue);

      const cours = ue.cours || [];
      setCoursList(
        cours.length > 0
          ? cours.map(c => ({
              id_cours: c.id_cours || null,
              nom: c.nom_cours || c.nom || "",
              credit: Number(c.credit) || 1

            }))

          : [{ nom: "", credit: 1 }]

      );

      setDeletedCoursIds([]);

    };

 
  // ==========================================================
  // 📌 CHANGEMENT DE MODE (CREATE / MODIFY / DELETE)
  // ==========================================================
  const handleModeChange = (m) => {
    setMode(m);
    setSelectedUE(null);
    setNomUE("");
    setCoursList([{ nom: "", credit: 1 }]);

  };


  // =========================================================
  // 📌 RESET FORMULAIRE
  // ==========================================================
  const reset = () => {
    setNomUE("");
    setCoursList([{ nom: "", credit: 1 }]);
    setSelectedUE(null);

  };


  // ==========================================================
  // 📌 AJOUT D'UN COURS
  // ==========================================================
  const addCours = () => {
    setCoursList([...coursList, { id_cours: null, nom: "", credit: 1 }]);

  };


  // ==========================================================
  // 📌 SUPPRESSION D'UN COURS (AVEC TRACKING BACKEND)
  // ==========================================================
  const removeCours = (i) => {
    const cours = coursList[i];
    if (cours?.id_cours) {
      setDeletedCoursIds(prev => [...prev, cours.id_cours]);

    }
    setCoursList(coursList.filter((_, index) => index !== i));

  };


  // ==========================================================
  // 📌 MODIFICATION D'UN COURS (LIVE EDIT)
  // ==========================================================
  const updateCours = (index, field, value) => {
    const updated = [...coursList];
    updated[index][field] = value;
    setCoursList(updated);

  };


  // ==========================================================
  // 📌 AUTO-FILL UE À PARTIR D'UNE UE EXISTANTE (ANNÉE PASSÉE)
  // =========================================================
  const handleUEChange = (e) => {
    const value = e.target.value;

    setNomUE(value);

    const ueTrouvee = uesAnneePassee.find(
      ue => ue.nom_ue === value
    );

    if (!ueTrouvee) return;

    const cours = ueTrouvee.cours || [];

    if (cours.length > 0) {
      setCoursList(
        cours.map(c => ({
          nom: c.nom_cours,
          credit: Number(c.credit) || 1
        }))
      );
    }
  };

  //fction pour rechargement des ues apres modification
  const fetchUEs = async (promo = promotionID, sem = semestre) => {
    if (!promo || !sem) return;

    try {
        const data = await getUEService({
        promotion_version_id: promo,
        semestre_id: sem,
        });

        setUEs(data.data || []);
    } catch (error) {
       
        showMessage("Erreur chargement UE", "error");
    }
 };

  // ============================
  // SUBMIT (CREATE UE API)
  // ============================
  const handleSubmit = async () => {

    if (!nomUE.trim()) {
      return showMessage("Nom UE requis", "error");
    }

    if (mode === "create") {
      try {

        const payload = {
          nom_ue: nomUE,
          promotion_version_id: Number(promotionID),
          semestre_id: Number(semestre),
          cours: coursList.map(c => ({
            nom: c.nom,
            credit: Number(c.credit),
          })),
        };


        const res = await createUEService(payload);

        showMessage("UE créée avec succès", "success");

        reset();

      } catch (error) {
        
        showMessage(error.message || "Erreur création UE", "error");
      }
    }

    if (mode === "modify" && selectedUE) {
        try {
            const payload = {
            ue_id: selectedUE.id_ue,
            nom_ue: nomUE,
            promotion_version_id: Number(promotionID),
            semestre_id: Number(semestre),
            cours: coursList.map((c) => ({
                id_cours: c.id_cours || null,
                nom: c.nom,
                credit: Number(c.credit),
            })),
            delete_cours_ids: deletedCoursIds
            };

            await updateUEService(payload);

            showMessage("UE modifiée avec succès", "success");

            reset();
            setDeletedCoursIds([]);

            await fetchUEs(promotionID, semestre);
            setSelectedUE(null);
            setMode("modify");

        } catch (error) {
            console.error(error);
            showMessage(error.message || "Erreur modification UE", "error");
        }
    }

    if (mode === "delete" && selectedUE) {
        try {
            // 🔥 suppression en base
            await deleteUEService({ ue_id: selectedUE.id_ue });

            // 🔥 refresh depuis backend
            await fetchUEs(promotionID, semestre);

            showMessage("UE supprimée avec succès", "success");

            reset();

        } catch (error) {
           
            showMessage(error.message || "Erreur suppression UE", "error");
        }
    }
  };


  // ==========================================================
  // 📌 CLONER LES UE ET COURS DE L'ANNÉE PRÉCÉDENTE
  // ==========================================================
  const handleCloneUECours = async () => {

    const confirmation = window.confirm(
      "Cette opération va copier toutes les UE et tous les cours de l'année académique précédente vers l'année académique en cours pour cette mention.\n\nContinuer ?"
    );

    if (!confirmation) return;

    try {

      const resultat = await cloneUEAndCoursService({
        code_mention
      });

      showMessage(
        resultat.message || "Clonage effectué avec succès.",
        "success"
      );

    } catch (error) {

      showMessage(
        error.message || "Erreur lors du clonage.",
        "error"
      );

    }

  };
 
  return (
    <div className="ue-container fade-in">

      <h2>Gestion des unités d’enseignement</h2>

      {/* MODE */}
      <div className="mode-buttons">

        <button
          className="clone-btn"
          onClick={handleCloneUECours}
        >
          Initialiser les UE & cours
        </button>

        {["create", "modify", "delete"].map(m => (
          <button
            key={m}
            className={mode === m ? "active" : ""}
            onClick={() => handleModeChange(m)}
          >
            {m === "create" && "Créer"}
            {m === "modify" && "Modifier"}
            {m === "delete" && "Supprimer"}
          </button>
        ))}

      </div>

      {/* SELECT UE */}
      {mode !== "create" && (
        <select onChange={handleSelectUE}>
          <option value="">-- choisir UE --</option>
          {ues.map(u => (
            <option key={u.id_ue} value={u.id_ue}>
              {u.nom_ue}
            </option>
          ))}
        </select>
      )}
 
      {/* FORM */}
      {(mode === "create" || selectedUE) && (
        <> 
          <input
            type="text"
            list="liste-ue-annee-passee"
            value={nomUE}
            placeholder="Intitulé de l'UE"
            onChange={handleUEChange}
          />

          <datalist id="liste-ue-annee-passee">
            {uesAnneePassee.map((ue) => (
              <option
                key={ue.id_ue}
                value={ue.nom_ue}
              />
            ))}
          </datalist>

          {/* PROMO + SEMESTRE */}
          <div className="row">
            <div className="field">
              <label>Promotion</label>
              <select
                value={promotionID}
                onChange={(e) => {

                  const id = Number(e.target.value);

                  const promo = promotions.find(
                    p => Number(p.id_version) === id
                  );

                  setPromotionID(id);

                  if (promo) {
                    setNomPromotion(promo.nom_promotion);
                  }

                }}
              >
                {promotions.map(p => (
                  <option key={p.id_version} value={p.id_version}>
                    {p.nom_promotion}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Semestre</label>
              <select value={semestre} onChange={(e) => setSemestre(Number(e.target.value))}>
                {semestres.map(s => (
                  <option key={s.id_semestre} value={s.id_semestre}>
                    {s.libelle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* COURS */}
          <div className="cours-block">
            <label>Elément(s) constitutif(s)</label>

            {coursList.map((c, i) => (
              <div key={i} className="cours-row">

                <input
                  value={c.nom}
                  onChange={(e) => updateCours(i, "nom", e.target.value)}
                  placeholder={`Cours ${i + 1}`}
                />

                <select
                  value={c.credit}
                  onChange={(e) => updateCours(i, "credit", Number(e.target.value))}
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(cr => (
                    <option key={cr} value={cr}>{cr}</option>
                  ))}
                </select>

                <button className="delete-btn" onClick={() => removeCours(i)}>
                  ❌
                </button>

              </div>
            ))}

            <button className="add-btn" onClick={addCours}>
              + Ajouter cours
            </button>
          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            Valider
          </button>
        </>
      )}

      {/* NOTIF */}
      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CreateUE;
