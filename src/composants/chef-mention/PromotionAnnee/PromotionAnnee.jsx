import React, { useState, useEffect } from "react";
import "./PromotionAnnee.css";
import {
  getParcours,
  getNiveauxParCodeParcours,
  createPromotionVersionService,
  updatePromotionVersionNameService,
  getPromotionVersionByCodeService,
  getPromotionVersionByCodeAnneePasseeService
} from "./promotionAnneeService";

const PromotionAnnee = ({ code_mention }) => {

  const [niveaux, setNiveaux] = useState([]);
  const [niveau, setNiveau] = useState("");

  const [codeParcours, setCodeParcours] = useState([]);
  const [parcour, setParcour] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [newPromotion, setNewPromotion] = useState(""); 
  const [promotionsAnneePassee, setPromotionsAnneePassee] = useState([]);

  const [promotions, setPromotions] = useState([]);
  const [selectedPromotionModify, setSelectedPromotionModify] = useState("");
  const [nouveauNomPromotion, setNouveauNomPromotion] = useState("");

  /* =========================
     Notification
  ========================= */
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  /* =========================
     Charger les codes parcours
  ========================= */
  useEffect(() => {
    const fetchParcours = async () => {
      const result = await getParcours({ code_mention });

      if (result.success) {
        setCodeParcours(result.data || []);
      } else {
        showMessage(result.message, "error");
      }
    };

    if (code_mention) fetchParcours();
  }, [code_mention]);

  /* =========================
     Charger niveaux
  ========================= */
  useEffect(() => {

    const fetchNiveaux = async () => {

      if (!parcour) {
        setNiveaux([]);
        return;
      }

      const result = await getNiveauxParCodeParcours({
        code_parcours: parcour
      });

      if (result.success) {
        setNiveaux(result.data || []);
      } else {
        setNiveaux([]);
        showMessage(result.message, "error");
      }
    };

    fetchNiveaux();

  }, [parcour]);

  /* =========================
     Charger promotions versions
  ========================= */
  useEffect(() => {

    const fetchPromotions = async () => {

      if (!parcour) {
        setPromotions([]);
        return;
      }

      const result = await getPromotionVersionByCodeService({
        code_parcours: parcour
      });

      if (result.success) {
        setPromotions(result.data || []);
      } else {
        setPromotions([]);
        showMessage(result.message, "error");
      }
    };

    fetchPromotions();

  }, [parcour]);


  /* =========================
    Charger promotions/ année passée
  ========================= */
  useEffect(() => {

    const fetchPromotionsAnneePassee = async () => {

      if (!parcour) {
        setPromotionsAnneePassee([]);
        return;
      }

      const result =
        await getPromotionVersionByCodeAnneePasseeService({
          code_parcours: parcour
        });
 
      if (result.success) {
        setPromotionsAnneePassee(result.data || []);
      } else {
        setPromotionsAnneePassee([]);
      }
    };

    fetchPromotionsAnneePassee();

  }, [parcour]);

  /* =========================
     Création promotion
  ========================= */
  const handleCreate = async () => {
    const regex = /^(Préparatoire|L[1-3]|M[1-2]|D[1-6])/i;

    if (!parcour) {
      return showMessage("Veuillez sélectionner un code-parcours.", "error");
    }

    if (!niveau) {
      return showMessage("Veuillez sélectionner un niveau-promotion.", "error");
    }

    if (!newPromotion.trim()) {
      return showMessage("Veuillez saisir le nom de la promotion.", "error");
    }

    if (!regex.test(newPromotion)) {
      return showMessage("La promotion doit commencer par Préparatoire, L1-L3, M1-M2 ou D1-D6", "error");
    }
    
    const result = await createPromotionVersionService({
      code_parcours: parcour,
      niveau,
      nom_promotion_version: newPromotion
    });

    if (result.success) {

      showMessage("Promotion créée avec succès.", "success");

      setNewPromotion("");
      setNiveau("");

      // recharger les promotions
      const refreshed = await getPromotionVersionByCodeService({
        code_parcours: parcour
      });

      if (refreshed.success) {
        setPromotions(refreshed.data || []);
      }

    } else {
      showMessage(result.message, "error");
    }
  };
 
  /* =========================
     Sélection modification
  ========================= */
  const handleSelectModify = (nomPromotion) => {
    setSelectedPromotionModify(nomPromotion);
    setNouveauNomPromotion("");
  };

  /* =========================
     Modification promotion
  ========================= */
  const handleUpdate = async () => {

    if (!selectedPromotionModify) {
      return showMessage("Sélectionnez une promotion.", "error");
    }

    if (!nouveauNomPromotion.trim()) {
      return showMessage("Saisissez le nouveau nom.", "error");
    }

    const result = await updatePromotionVersionNameService({
       ancien_nom_promotion :selectedPromotionModify, 
       nouveau_nom_promotion :nouveauNomPromotion
    });

    if (result.success) {

      showMessage("Promotion modifiée avec succès.", "success");

      setSelectedPromotionModify("");
      setNouveauNomPromotion("");

      const refreshed = await getPromotionVersionByCodeService({
        code_parcours: parcour
      });

      if (refreshed.success) {
        setPromotions(refreshed.data || []);
      }

    } else {
      showMessage(result.message, "error");
    }
  };

  return (
    <div className="promotion-annee-wrapper">

      <h2>Gestion des promotions-année</h2>

      {/* Notification */}
      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}
  
      {/* Sélection code parcours */}
      <div className="promotion-annee-select-zone fade-in">
        <select
          value={parcour}
          onChange={(e) => setParcour(e.target.value)}
        >
          <option value="">-- Sélectionner un code-parcours --</option>

          {codeParcours.map((c) => (
            <option key={c.id_parcours} value={c.code_parcours}>
              {c.code_parcours}
            </option>
          ))}

        </select>
      </div>

      {/* Cartes */}
      <div className="promotion-annee-top-row">

        {/* Création */}
        <div className="promotion-annee-card fade-in">

          <h3>Créer une promotion-année</h3>

          <select
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
          >
            <option value="">-- Sélectionner un niveau-promotion --</option>

            {niveaux.map((n) => (
              <option key={n.id_promotion} value={n.niveau_academique}>
                {n.niveau_academique}
              </option>
            ))}

          </select>

          <input
            type="text" 
            list="liste-promotions"
            placeholder="Nom de la promotion-année (ex: L1 Informatique)"
            value={newPromotion}
            onChange={(e) => {
              const value = e.target.value.toLowerCase();

              const formatted =
                value.charAt(0).toUpperCase() + value.slice(1);

              setNewPromotion(formatted);
            }}
          />
 
          <datalist id="liste-promotions">
            {promotionsAnneePassee.map((p, index) => (
              <option
                key={index}
                value={p.nom_promotion} 
              />
            ))}
          </datalist>

          <button onClick={handleCreate}>
            Créer
          </button>

        </div>

        {/* Modification */}
        <div className="promotion-annee-card fade-in">

          <h3>Modifier une promotion-année</h3>

          <select
            value={selectedPromotionModify}
            onChange={(e) => handleSelectModify(e.target.value)}
          >
            <option value="">-- Sélectionner une promotion-année --</option>

            {promotions.map((p, index) => (
              <option key={index} value={p.nom_promotion}>
                {p.nom_promotion}
              </option>
            ))}

          </select>

          {selectedPromotionModify && (
            <>
              <input
                type="text"
                placeholder="Nouveau nom de la promotion-année"
                value={nouveauNomPromotion}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();

                  const formatted =
                    value.charAt(0).toUpperCase() + value.slice(1);

                  setNouveauNomPromotion(formatted);
                }}
              />

              <button onClick={handleUpdate}>
                Modifier
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default PromotionAnnee;