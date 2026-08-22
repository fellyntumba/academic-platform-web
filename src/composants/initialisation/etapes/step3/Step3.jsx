
import React, { useEffect, useState } from "react";
import { getCodeFac, createAdminFac } from "./service";
import { isAuthenticated, logout } from "../../../accueils/serviceAuth";
// import "./Step5.css"; // on ajoutera le CSS pour l'animation

const Step3 = ({ onFinish }) => {
  const [facultes, setFacultes] = useState([]);
  const [codeFac, setCodeFac] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [admins, setAdmins] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false); // 🌟 état pour succès

  useEffect(() => {
    const load = async () => { 
      const result = await getCodeFac();
      if (result.success) setFacultes(result.data);
      else showMessage(result.message, "error");
      };
    load();
  }, []); 

  // 🔹 BOUTON 1 : AJOUTER
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!codeFac || !nom || !email) {
      return alert("Tous les champs sont requis");
    }

    try {
      const admin = await createAdminFac({ code_fac : codeFac, nom, email });
      setAdmins((prev) => [...prev, admin.admin]);
      setNom("");
      setEmail("");
    } catch (error) {
      alert(error.message); 
    }
  };

  // 🔹 BOUTON 2 : TERMINER
  const handleFinish = async () => {
    if (admins.length === 0) {
      return alert("Veuillez créer au moins un administrateur facultaire");
    }

    // 🌟 Afficher le message de succès
    setShowSuccess(true);

    //Deconnecter le S. Admin
    await logout();
    

    // Simuler un petit délai de 2,5 s avant de rediriger
    setTimeout(async () => {
      await onFinish();
    }, 2500);
  }; 


  return (
    <div className="step-form">
      <h2>Administrateurs facultaires</h2>

      <form onSubmit={handleAddAdmin}>
        <select value={codeFac} onChange={(e) => setCodeFac(e.target.value)}>
          <option value="">Sélectionner un code-fac</option>
          {facultes.map((f) => (
            <option key={f.id_faculte} value={f.code_faculte }>
              {f.code_faculte }
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nom complet"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Ajouter</button>
      </form>

      <ul className="facultes-list">
        {admins.map((a) => (
          <li key={a.id_admin}>
            {a.nom} — {a.email}
          </li>
        ))} 
      </ul>

      <div className="buttons">
        <button onClick={handleFinish} disabled={admins.length === 0}>
          Terminer
        </button>
      </div>

      {/* 🌟 Message succès animé */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-box">
            <div className="spinner"></div>
            <h3>Configuration terminée avec succès !</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3

