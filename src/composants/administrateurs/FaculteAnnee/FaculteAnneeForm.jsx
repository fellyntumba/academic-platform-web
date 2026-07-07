import React, { useState, useEffect } from "react";
import "./FaculteAnneeForm.css";
import { 
  createFacAnneeService, 
  getFaculteVersionService, 
  modifyFaculteVersionService 
} from "./faculteAnneeService";  

const FaculteAnneeForm = ({ code_faculte }) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // 🔹 Création
  const [nomCreer, setNomCreer] = useState("");

  // 🔹 Modification
  const [versionExistante, setVersionExistante] = useState(null);
  const [idVersionExistante, setIdVersionExistante] = useState("");
  const [nouveauNom, setNouveauNom] = useState("");

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  /* =========================
     🔹 Charger version existante pour modification
  ========================= */
  useEffect(() => {
    const loadVersion = async () => {
      try {
        const res = await getFaculteVersionService({ code_faculte });
        if (res.success && res.version) {
          setVersionExistante(res.version);
          setIdVersionExistante(res.version.id_version);
          setNouveauNom(res.version.nom_faculte);
        } else {
          setVersionExistante(null);
          setIdVersionExistante("");
          setNouveauNom("");
        }
      } catch (error) {
        showMessage(error.message,  "error");
      }
    };
    loadVersion();
  }, [code_faculte]);

  /* =========================
     🔹 Créer une version
  ========================= */
  const handleCreate = async () => {
    if (!nomCreer.trim()) return showMessage("Veuillez saisir le nom de la faculté-année.",  "error");

    try {
      const res = await createFacAnneeService({
        code_faculte,
        nom_faculte_version: nomCreer
      });
      if (res.success) {
        showMessage(res.message,  "success");
        setNomCreer("");
        setVersionExistante({ id_version: res.id_version, nom_faculte: nomCreer });
        setIdVersionExistante(res.id_version);
        setNouveauNom(nomCreer);
      } else showMessage(res.message,  "error");
    } catch (error) {
      showMessage(error.message,  "error");
    }
  };

  /* =========================
     🔹 Modifier une version
  ========================= */
  const handleModify = async () => {
    if (!versionExistante) return showMessage("Aucune version disponible pour modifier.",  "error");
    if (!nouveauNom.trim()) return showMessage("Veuillez saisir le nouveau nom.",  "error");

    try {
      const res = await modifyFaculteVersionService({
        code_faculte,
        id_version: idVersionExistante,
        nouveau_nom: nouveauNom
      });
      if (res.success) {
        showMessage(res.message,  "success");
        setVersionExistante({ ...versionExistante, nom_faculte: nouveauNom });
      } else showMessage(res.message,  "error");
    } catch (error) {
      showMessage(res.message,  "error");
    }
  };

  /* =========================
     🔹 Sélection pour modification
  ========================= */
  const handleSelect = (e) => {
    const selectedId = e.target.value;
    setIdVersionExistante(selectedId);
    if (versionExistante && versionExistante.id_version.toString() === selectedId) {
      setNouveauNom(versionExistante.nom_faculte);
    }
  };

  return (
    <div className="faculte-annee-wrapper">
      <h2>Gestion de la faculté-année</h2>

      {message && (<div className={`notification ${messageType}`}>{message}</div>)}

      <div className="faculte-annee-top-row">
        {/* Carte création */}
        <div className="faculte-annee-card">
          <h3>Créer une faculté-année</h3>
          <input
            type="text"
            placeholder="Nom de la faculté-année"
            value={nomCreer}
            onChange={(e) => setNomCreer(e.target.value)}
          />
          <button onClick={handleCreate}>Créer</button>
        </div>

        {/* Carte modification */}
        <div className="faculte-annee-card">
          <h3>Modifier une faculté-année</h3>
          <select value={idVersionExistante} onChange={handleSelect}>
            {versionExistante ? (
              <option value={versionExistante.id_version}>{versionExistante.nom_faculte}</option>
            ) : (
              <option value="">-- Aucune version disponible --</option>
            )}
          </select>
          <input
            type="text"
            placeholder="Nouveau nom de la faculté-année"
            value={nouveauNom}
            onChange={(e) => setNouveauNom(e.target.value)}
          />
          <button onClick={handleModify}>Modifier</button>
        </div>
      </div>
    </div>
  );
};

export default FaculteAnneeForm;