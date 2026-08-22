import React, { useState, useEffect } from "react";
import "./ParcoursAnnee.css";
import {
  getParcours,
  creerParcoursVersion,
  getParcoursVersion,
  modifierParcoursVersion,
  getParcoursVersionByCodeAnneePasseeService
} from "./parcoursAnneeService";

const ParcoursAnnee = ({ code_mention }) => {
  const [parcours, setParcours] = useState([]);
  const [parcoursVersions, setParcoursVersions] = useState([]);
  const [parcoursVersionsAnneePassee, setParcoursVersionsAnneePassee] = useState([]);
  const [codeParcours, setCodeParcours] = useState("");
  const [ancienNom, setAncienNom] = useState("");
  const [nouveauNom, setNouveauNom] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" ou "error"

  const showMessage = (msg, type = "success") => { 
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  /* =========================
    Charger parcours version/ année passée
  ========================= */
  useEffect(() => {

    const fetchParcoursVersionAnneePassee = async () => {

      if (!codeParcours) {
        setParcoursVersionsAnneePassee([]);
        return;
      }

      const result =
        await getParcoursVersionByCodeAnneePasseeService({
          code_parcours: codeParcours
        });
  
      if (result.success) {
        setParcoursVersionsAnneePassee(result.data || []);
      } else {
        setParcoursVersionsAnneePassee([]);
      }
    };

    fetchParcoursVersionAnneePassee();

  }, [codeParcours]);

  /* =====================================================
     🔹 Charger les codes parcours
  ====================================================== */
  useEffect(() => {
    const fetchParcours = async () => {
      const result = await getParcours({ code_mention });

      if (result.success) {
        setParcours(result.data || []);
      } else {
        showMessage(result.message);
      }
    };

    if (code_mention) fetchParcours();
  }, [code_mention]);

  /* =====================================================
     Charger parcours versions
  ====================================================== */
  const fetchParcoursVersions = async () => {
    if (!codeParcours) return;

    const result = await getParcoursVersion({
      code_parcours: codeParcours
    });

    if (result.success) {
      setParcoursVersions(result.version ? [result.version] : []);
    } else {
      setParcoursVersions([]);
      showMessage(result.message);
    }
  };

  /* =====================================================
     🔹 Charger au changement de code parcours
  ====================================================== */
  useEffect(() => {
    fetchParcoursVersions();
  }, [codeParcours]);

  /* ===================== Création ===================== */
const handleCreate = async () => {
  if (!codeParcours || !nouveauNom.trim()) {
    return showMessage("Veuillez remplir tous les champs.", "error");
  }

  const result = await creerParcoursVersion({
    code_parcours: codeParcours,
    nom_parcours_version: nouveauNom
  });

  if (!result.success) {
    return showMessage(result.message, "error");
  }

  showMessage(result.message, "success");
  setNouveauNom("");

  await fetchParcoursVersions(); // refresh automatique
};

/* ===================== Modification ===================== */
const handleModify = async () => {
  if (!ancienNom || !nouveauNom.trim()) {
    return showMessage(
      "Sélectionnez un parcours et saisissez le nouveau nom.",
      "error"
    );
  }

  const result = await modifierParcoursVersion({
    ancien_nom: ancienNom,
    nouveau_nom: nouveauNom
  });

  if (!result.success) {
    return showMessage(result.message, "error");
  }

  showMessage(result.message, "success");

  setAncienNom("");
  setNouveauNom("");

  await fetchParcoursVersions(); // refresh automatique
};

  /* =====================================================
     🔹 Sélection
  ====================================================== */
  const handleSelect = (nom_parcours) => {
    setAncienNom(nom_parcours);
  };

  return (
    <div className="parcours-annee-wrapper">
      <h2>Gestion des parcours-années</h2>

      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}

      {/* Sélection code parcours */}
      <div className="parcours-annee-select-global">
        <select
          value={codeParcours}
          onChange={(e) => setCodeParcours(e.target.value)}
        >
          <option value="">
            -- Sélectionner un code-parcours --
          </option>
          {parcours.map((p) => (
            <option
              key={p.id_parcours}
              value={p.code_parcours}
            >
              {p.code_parcours}
            </option>
          ))}
        </select>
      </div>

      <div className="parcours-annee-top-row">

        {/* Création */}
        <div className="parcours-annee-card fade-in">
          <h3>Créer un parcours-année</h3>

          <input
            type="text"
            list="liste-parcours"
            placeholder="Nom du parcours-année"
            value={nouveauNom}
            onChange={(e) => {
              const value = e.target.value.toLowerCase();

              const formatted =
                value.charAt(0).toUpperCase() + value.slice(1);

              setNouveauNom(formatted);
            }}
          />
          <datalist id="liste-parcours">
            {parcoursVersionsAnneePassee.map((p, index) => (
              <option
                key={index}
                value={p.nom_parcours} 
              />
            ))}
          </datalist>

          <button onClick={handleCreate}>
            Créer
          </button>
        </div>

        {/* Modification */}
        <div className="parcours-annee-card fade-in">
          <h3>Modifier un parcour-année</h3>

          <select
            value={ancienNom}
            onChange={(e) => handleSelect(e.target.value)}
          >
            <option value="">
              -- Sélectionner un parcours-année --
            </option>
            {parcoursVersions.map((p) => (
              <option
                key={p.id_version}
                value={p.nom_parcours}
              >
                {p.nom_parcours}
              </option>
            ))}
          </select>

          {ancienNom && (
            <>
              <input
                type="text"
                placeholder="Nouveau nom du parcours-année"
                value={nouveauNom}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();

                  const formatted =
                    value.charAt(0).toUpperCase() + value.slice(1);

                  setNouveauNom(formatted);
                }}
              />
              <button onClick={handleModify}>
                Modifier
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ParcoursAnnee;