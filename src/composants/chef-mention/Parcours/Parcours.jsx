import React, { useEffect, useState } from "react";
import "./Parcours.css";
import { getParcours, modifierParcours, creerParcours, getCodeParcoursConfig } from "./parcoursService";


const Parcours = ({ code_mention }) => {
  const [parcours, setParcours] = useState([]);
  const [newName, setNewName] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [nouveau_code, setNouveau_code] = useState("");


  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [parcoursConfig, setParcoursConfig] = useState([]);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const loadParcours = async () => {
    const result = await getParcours({ code_mention });
    if (result.success) setParcours(result.data);
    else showMessage(result.message, "error");
  };

  // Récupérer les parcours configurés pour une université
  const loadParcoursConfig = async () => {
    try { 
      const data = await getCodeParcoursConfig({code_mention});

      setParcoursConfig(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      alert(
        "Erreur chargement configuration : " +
          error.message
      );
    }
  };


  useEffect(() => {
    loadParcours();
    loadParcoursConfig();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return showMessage("Code parcours requis", "error");

    const result = await creerParcours({ code_parcours: newName, code_mention });
    if (result.success) {
      showMessage(result.message, "success");
      setNewName("");
      loadParcours();
    } else showMessage(result.message, "error");
  };

  const handleSelect = (id) => {
    const parcour = parcours.find((p) => p.id_parcours === Number(id));
    setSelectedId(id);
    setNouveau_code(parcour?.code_parcours || "");
  };

  const handleUpdate = async () => {
    if (!selectedId) return showMessage("Sélectionnez un parcours", "error");
    if (!nouveau_code.trim()) return showMessage("Nouveau code parcours requis", "error");

    const parcour = parcours.find((p) => p.id_parcours === Number(selectedId));
    const result = await modifierParcours({ ancien_code: parcour.code_parcours, nouveau_code });
    if (result.success) {
      showMessage(result.message, "success");
      loadParcours();
      setSelectedId("");
      setNouveau_code("");
    } else showMessage(result.message, "error");
  };
 
 

  return (
    <div className="parcours-wrapper">
      <h2>Gestion des parcours</h2>

      {message && <div className={`notification ${messageType}`}>{message}</div>}

      <div className="parcours-top-row">

        {/* Création */}
        <div className="parcours-card">
          <h3>Créer un code-parcours</h3>
          <select
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          >
            <option value="">Sélectionner un code parcours</option>

            {parcoursConfig.map((p) => (
                <option
                  key={p.code}
                  value={p.code}
                >
                  {p.code} - {p.nom}
                </option>
            ))}
          </select>
          <button onClick={handleCreate}>Créer</button>
        </div>

        {/* Modification */}
        <div className="parcours-card">
          <h3>Modifier un code-parcours</h3>
          <select value={selectedId} onChange={(e) => handleSelect(e.target.value)}>
            <option value="">-- Sélectionner un code-parcours --</option>
            {parcours.map((p) => (
              <option key={p.id_parcours} value={p.id_parcours}>
                {p.code_parcours}
              </option>
            ))}
          </select>

          {selectedId && (
            <>
              <input
                type="text"
                placeholder="Nouveau code-parcours"
                value={nouveau_code}
                onChange={(e) => setNouveau_code(e.target.value)}
              />
              <button onClick={handleUpdate}>Modifier</button>
            </>
          )}
        </div>

      </div>

    </div>
  );
};

export default Parcours;
