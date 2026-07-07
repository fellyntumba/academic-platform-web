import React, { useEffect, useState } from "react";
import "./AdminFacForm.css";
import {
  getCodeFac,
  creerAdminFac,
  desactiverAdminFac,
  getAdminFacActif,
  modifierAdminFac, // 🔹 import
} from "./adminFacService";

const AdminFacForm = () => {
  const [mode, setMode] = useState("create");
  const [codesFac, setCodesFac] = useState([]);
  const [selectedFaculte, setSelectedFaculte] = useState("");

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* =========================
     Notification globale
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
     Charger codes-facs
  ========================= */
  const loadCodeFacs = async () => {
    const result = await getCodeFac();
    if (result.success) setCodesFac(result.data);
    else showMessage(result.message, "error");
  };

  useEffect(() => {
    loadCodeFacs();
  }, []);

  /* =========================
     Quand on sélectionne une faculté
  ========================= */
  const handleSelectFaculte = async (e) => {
    const code = e.target.value;
    setSelectedFaculte(code);

    if (mode === "edit" || mode === "deactivate") {
      const result = await getAdminFacActif({ code_fac: code });
      if (result.success && result.admin) {
        setNom(result.admin.nom);
        setEmail(result.admin.email);
      } else {
        setNom("");
        setEmail("");
      }
    }
  };

  /* =========================
     Soumission formulaire
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFaculte) return showMessage("Veuillez sélectionner un code-fac.", "error");
    if (!nom.trim() || !email.trim()) return showMessage("Nom et email requis.", "error");

    let result;

    if (mode === "create") {
      result = await creerAdminFac({ code_fac: selectedFaculte, nom, email });
    } else if (mode === "edit") {
      result = await modifierAdminFac({ code_fac: selectedFaculte, nom, email }); // 🔹 modification
    } else if (mode === "deactivate") {
      result = await desactiverAdminFac({ code_fac: selectedFaculte, nom, email });
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
    <div className="admin-fac-wrapper">
      <div className="admin-fac-form-container">
        <h2>Gestion Administrateurs Facultaires</h2>

        {/* Mode switch */}
        <div className="mode-switch">
          <button className={mode === "create" ? "active" : ""} onClick={() => setMode("create")}>Créer</button>
          <button className={mode === "edit" ? "active" : ""} onClick={() => setMode("edit")}>Modifier</button>
          <button className={mode === "deactivate" ? "active danger-btn" : ""} onClick={() => setMode("deactivate")}>Désactiver</button>
        </div>

        <form className="admin-fac-form" onSubmit={handleSubmit}>
          <select value={selectedFaculte} onChange={handleSelectFaculte} required>
            <option value="">Sélectionner code-fac</option>
            {codesFac.map(c => <option key={c.id_faculte} value={c.code_faculte}>{c.code_faculte}</option>)}
          </select>

          <input type="text" placeholder="Nom complet" value={nom} onChange={e => setNom(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />

          <button type="submit" className={mode === "deactivate" ? "danger-submit" : ""}>
            {mode === "create" && "Créer administrateur"}
            {mode === "edit" && "Modifier administrateur"}
            {mode === "deactivate" && "Désactiver administrateur"}
          </button>
        </form>
      </div>

      {message && <div className={`notification ${messageType}`}>{message}</div>}
    </div>
  );
};

export default AdminFacForm;
