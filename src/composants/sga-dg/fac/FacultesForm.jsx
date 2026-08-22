import React, { useEffect, useState } from "react";
import "./FacultesForm.css";
import { creerFaculte, modifierFaculte, getCodeFacBDuniv, desactiverFaculte, getCodesFacultesConfig } from "./facultesService";


const FacultesForm = () => {
  const [facultes, setFacultes] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [nouveau_code, setNouveau_code] = useState("");
  const [selectedIdDeactivate, setSelectedIdDeactivate] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  const [nomFaculte, setNomFaculte] = useState("");
  const [facultesConfig, setFacultesConfig] = useState([]);

  
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type); 

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };
  
// Récupérer les facultés configurées pour une université
  const loadFacultesConfig = async () => {
    try { 
      const data = await getCodesFacultesConfig();

      setFacultesConfig(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      alert(
        "Erreur chargement configuration : " +
          error.message
      );
    }
  };


  //Récupérer code-facs 
  const loadFacultes = async () => {
    const result = await getCodeFacBDuniv();
    if (result.success) setFacultes(result.data);
    else showMessage(result.message, "error");
  };

  useEffect(() => {
    loadFacultes();
    loadFacultesConfig();
  }, []);

  // 🔹 Création
  const handleCreate = async () => {
    if (!nomFaculte.trim()) return showMessage("Code-fac requis", "error");

    const result = await creerFaculte({ code_faculte: nomFaculte });
    if (result.success) {
      showMessage(result.message, "success");
      setNewName("");
      loadFacultes();
    } else showMessage(result.message, "error");
  }; 

  // 🔹 Sélection pour modification
  const handleSelect = (id) => {
    const fac = facultes.find(f => f.id_faculte === Number(id));
    setSelectedId(id);
    setNouveau_code(fac?.code_faculte || "");
  };

  // 🔹 Modification
  const handleUpdate = async () => {
    if (!selectedId) return showMessage("Sélectionnez une faculté", "error");
    if (!nouveau_code.trim()) return showMessage("Nouveau code requis", "error");

    const fac = facultes.find(f => f.id_faculte === Number(selectedId));
    const result = await modifierFaculte({ ancien_code: fac.code_faculte, nouveau_code });
    if (result.success) {
      showMessage(result.message, "success");
      loadFacultes();
      setSelectedId("");
      setNouveau_code("");
    } else showMessage(result.message, "error");
  };

  // Désactivation
  const handleDeactivate = async () => {

    if (!selectedIdDeactivate) {
      return showMessage(
        "Sélectionnez un code fac",
        "error"
      );
    }


    const result = await desactiverFaculte({
      code_faculte: selectedIdDeactivate,
    });

    if (result.success) {

      showMessage(
        result.message,
        "success"
      );

      setSelectedIdDeactivate("");

      loadFacultes();

    } else {

      showMessage(
        result.message,
        "error"
      );
    }
  };

  return (
    <div className="facultes-wrapper">
      <h2>Gestion des facultés</h2>

      {message && <div className={`notification ${messageType}`}>{message}</div>}

      <div className="facultes-top-row">

        {/* Création */}
        <div className="facultes-card">
          <h3>Créer un code-fac</h3>
            <select
              className="faculte-select"
              value={nomFaculte}
              onChange={(e) =>
                setNomFaculte(e.target.value)
              }
            >
              <option value="">
                Sélectionner un code faculté
              </option>

              {facultesConfig.map((fac) => (
                <option
                  key={fac.code}
                  value={fac.code}
                >
                  {fac.code} - {fac.nom}
                </option>
              ))}
            </select>
          <button onClick={handleCreate}>Créer</button>
        </div>

        {/* Modification */}
        <div className="facultes-card">
          <h3>Modifier un code-fac</h3>
          <select value={selectedId} onChange={(e) => handleSelect(e.target.value)}>
            <option value="">-- Sélectionner une faculté --</option>
            {facultes.map(f => (
              <option key={f.id_faculte} value={f.id_faculte}>{f.code_faculte}</option>
            ))}
          </select>

          {selectedId && (
            <>
              <input
                type="text"
                placeholder="Nouveau code-fac"
                value={nouveau_code}
                onChange={(e) => setNouveau_code(e.target.value)}
              />
              <button onClick={handleUpdate}>Modifier</button>
            </>
          )}
        </div>

      </div>

      {/* Désactivation */}
      <div className="facultes-card facultes-full-width">
        <h3>Désactiver un code-fac</h3>
        <select value={selectedIdDeactivate} onChange={(e) => setSelectedIdDeactivate(e.target.value)}>
          <option value="">-- Sélectionner une faculté --</option>
          {facultes.map(f => (
            <option key={f.id_faculte} value={f.id_faculte}>{f.code_faculte}</option>
          ))}
        </select>
        {selectedIdDeactivate && (
          <button onClick={handleDeactivate}>Désactiver</button>
        )}
      </div>
    </div>
  );
};

export default FacultesForm;