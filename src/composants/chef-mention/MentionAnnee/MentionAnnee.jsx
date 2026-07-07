import React, { useState, useEffect } from "react";
import "./MentionAnnee.css";
import { 
  createMentionAnneeService, 
  getMentionVersionService, 
  modifyMentionVersionService 
} from "./mentionAnneeService";

const MentionAnnee = ({ code_mention }) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" ou "error"

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

  useEffect(() => {
    const loadVersion = async () => {
      try {
        const res = await getMentionVersionService({ code_mention });
        if (res.success && res.version) {
          setVersionExistante(res.version);
          setIdVersionExistante(res.version.id_version);
          setNouveauNom(res.version.nom_mention);
        } else {
          setVersionExistante(null);
          setIdVersionExistante("");
          setNouveauNom("");
        }
      } catch (error) {
        showMessage(error.message, "error");
      }
    };
    loadVersion();
  }, [code_mention]);

  const handleCreate = async () => {
    if (!nomCreer.trim()) return showMessage("Veuillez saisir le nom de la mention-année.", "error");
    try {
      const res = await createMentionAnneeService({
        code_mention,
        nom_mention_version: nomCreer
      });
      if (res.success) {
        showMessage(res.message, "success");
        setNomCreer("");
        setVersionExistante({ id_version: res.id_version, nom_mention: nomCreer });
        setIdVersionExistante(res.id_version);
        setNouveauNom(nomCreer);
      } else {
        showMessage(res.message, "error");
      }
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleModify = async () => {
    if (!versionExistante) return showMessage("Aucune version disponible pour modifier.", "error");
    if (!nouveauNom.trim()) return showMessage("Veuillez saisir le nouveau nom.", "error");
    try {
      const res = await modifyMentionVersionService({
        code_mention,
        id_version: idVersionExistante,
        nouveau_nom: nouveauNom
      });
      if (res.success) {
        showMessage(res.message, "success");
        setVersionExistante({ ...versionExistante, nom_mention: nouveauNom });
      } else {
        showMessage(res.message, "error");
      }
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    setIdVersionExistante(selectedId);
    if (versionExistante && versionExistante.id_version.toString() === selectedId) {
      setNouveauNom(versionExistante.nom_mention);
    }
  };

  return (
    <div className="mention-annee-wrapper">
      <h2>Gestion de la mention-année</h2>

      {/* Notification centrée en bas */}
      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}

      <div className="mention-annee-top-row">
        {/* Création */}
        <div className="mention-annee-card fade-in">
          <h3>Créer une mention-année</h3>
          <input
            type="text"
            placeholder="Nom de la mention-année"
            value={nomCreer}
            onChange={(e) => setNomCreer(e.target.value)}
          />
          <button onClick={handleCreate}>Créer</button>
        </div>

        {/* Modification */}
        <div className="mention-annee-card fade-in">
          <h3>Modifier une mention-année</h3>
          <select value={idVersionExistante} onChange={handleSelect}>
            {versionExistante ? (
              <option value={versionExistante.id_version}>{versionExistante.nom_mention}</option>
            ) : (
              <option value="">-- Aucune version disponible --</option>
            )}
          </select>
          <input
            type="text"
            placeholder="Nouveau nom de la mention-année"
            value={nouveauNom}
            onChange={(e) => setNouveauNom(e.target.value)}
          />
          <button onClick={handleModify}>Modifier</button>
        </div>
      </div>
    </div>
  );
};

export default MentionAnnee;