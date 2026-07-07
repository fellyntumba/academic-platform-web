import React, { useEffect, useState } from "react";
import "./MiseAjourChefMention.css";
import {
  getMentions,
  creerAdminMention,
  desactiverAdminMention,
  getAdminMentionActif,
  modifierAdminMention,
} from "./miseAjourChefMentionService";

const MiseAjourChefMention = ({ nomFaculte }) => {
  const [mode, setMode] = useState("create");
  const [codesMentions, setCodesMentions] = useState([]);
  const [selectedMention, setSelectedMention] = useState("");

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState(""); 

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error
  
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  /* Charger les mentions */
  const loadCodeMentions = async () => {
    const result = await getMentions({ code_faculte: nomFaculte });
    if (result.success) setCodesMentions(result.data);
    else showMessage(result.message, "error");
  };

  useEffect(() => {
    loadCodeMentions();
  }, []);

  /* Sélectionner une mention */
  const handleSelectMention = async (e) => {
    const code = e.target.value;
    setSelectedMention(code);

    if (mode === "edit" || mode === "deactivate") {
      const result = await getAdminMentionActif({ code_mention: code });
      if (result.success && result.admin) {
        setNom(result.admin.nom);
        setEmail(result.admin.email);
      } else {
        setNom("");
        setEmail("");
      }
    }
  };

  /* Soumission du formulaire */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMention)
      return showMessage("Veuillez sélectionner un code_mention.", "error");
    if (!nom.trim() || !email.trim())
      return showMessage("Nom et email requis.", "error");

    let result;

    if (mode === "create") {
      result = await creerAdminMention({ code_mention: selectedMention, nom, email });
    } else if (mode === "edit") {
      result = await modifierAdminMention({ code_mention: selectedMention, nom, email });
    } else if (mode === "deactivate") {
      result = await desactiverAdminMention({ code_mention: selectedMention, nom, email });
    }

    if (result.success) {
      showMessage(result.message, "success");
      if (mode === "create") {
        setNom("");
        setEmail("");
      }
    } else showMessage(result.message, "error");
  };

  return (
    <div className="admin-mention-wrapper">

      <div className="admin-mention-card">
        <h2>Gestion chef-mentions</h2>
        
       
        <div className="mode-switch">
          <button
            className={mode === "create" ? "active" : ""}
            onClick={() => setMode("create")}
          >
            Créer
          </button>
          <button
            className={mode === "edit" ? "active" : ""}
            onClick={() => setMode("edit")}
          >
            Modifier
          </button>
          <button
            className={mode === "deactivate" ? "active danger-btn" : ""}
            onClick={() => setMode("deactivate")}
          >
            Désactiver
          </button>
        </div>

        {/* Formulaire */}
        <form className="admin-mention-form" onSubmit={handleSubmit}>
          <select value={selectedMention} onChange={handleSelectMention} required>
            <option value="">Sélectionner code_mention</option>
            {codesMentions.map((c) => (
              <option key={c.id_mention} value={c.code_mention}>
                {c.code_mention}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Nom complet"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className={mode === "deactivate" ? "danger-submit" : ""}>
            {mode === "create" && "Créer chef-mention"}
            {mode === "edit" && "Modifier chef-mention"}
            {mode === "deactivate" && "Désactiver chef-mention"}
          </button>
        </form>
      </div>
        {message && (<div className={`notification ${messageType}`}>{message}</div>)}
    </div>
  );
};

export default MiseAjourChefMention;
