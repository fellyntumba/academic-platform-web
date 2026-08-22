import React, { useState, useEffect } from "react";
import {
  createEnseignant,
  getEnseignantsMatricules,
  getEnseignantByMatricule,
  updateEnseignant
} from "./enseignantService";
import "./CreerModifEns.css";

const CreerModifEns = () => {
  const [mode, setMode] = useState("create");

  const [matricules, setMatricules] = useState([]);
  const [selectedMatricule, setSelectedMatricule] = useState("");
  const [statut, setStatut] = useState("");

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    titre: "",
  });

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

  // 🔹 Charger les matricules en mode modification
  useEffect(() => {
    if (mode === "edit") {
      const loadMatricules = async () => {
        try {
          const data = await getEnseignantsMatricules();
          setMatricules(data);
        } catch (err) {
          showMessage("Erreur lors du chargement des matricules.", "error");
        }
      };
      loadMatricules();
    }
  }, [mode]);

  // 🔹 Charger enseignant sélectionné
  const handleSelectMatricule = async (e) => {
    const matricule = e.target.value;
    setSelectedMatricule(matricule);

    if (!matricule) {
      setForm({ nom: "", email: "", telephone: "", titre: "" });
      return;
    }

    try {
      const enseignant = await getEnseignantByMatricule(matricule);

      setForm({
        nom: enseignant.nom || "",
        email: enseignant.email || "",
        telephone: enseignant.telephone || "",
        titre: enseignant.titre || "",
      });

      setStatut(enseignant.statut || "");
    } catch {
      showMessage("Impossible de charger les informations.", "error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Création / Modification
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nom.trim()) {
      showMessage("Le nom est requis.", "error");
      return;
    }

    try {
      if (mode === "create") {
        const res = await createEnseignant(form);
        showMessage(
          `Enseignant créé avec succès. Matricule : ${res.matricule}`,
          "success"
        ); 

        setForm({ nom: "", email: "", telephone: "", titre: "" });
      } else {
        if (!selectedMatricule) {
          showMessage("Veuillez sélectionner un matricule.", "error");
          return;
        }

        const res = await updateEnseignant({
          matricule: selectedMatricule,
          statut,
          ...form,
        });

        showMessage(res.message || "Enseignant modifié avec succès.", "success");
      }
    } catch (error) {
      showMessage(error.message || "Erreur serveur.", "error");
    }
  };

  return (
    <div className="enseignant-wrapper">

      <div className="enseignant-container">
        <h2>Gestion des comptes enseignants</h2>

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
        </div>

        <form className="enseignant-form" onSubmit={handleSubmit}>
          {mode === "edit" && (
            <>
              <select
                value={selectedMatricule}
                onChange={handleSelectMatricule}
                required
              >
                <option value="">Sélectionner un matricule</option>
                {matricules.map((m) => (
                  <option key={m.matricule} value={m.matricule}>
                    {m.matricule}
                  </option>
                ))}
              </select>

              <input
                name="statut"
                placeholder="Statut (actif, non-actif)"
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
              />
            </>
          )}

          <input
            name="nom"
            placeholder="Nom complet"
            value={form.nom}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="telephone"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={handleChange}
          />
          <input
            name="titre"
            placeholder="Titre (Dr, Prof, etc.)"
            value={form.titre}
            onChange={handleChange}
          />

          <button type="submit">
            {mode === "create" ? "Créer enseignant" : "Modifier enseignant"}
          </button>
        </form>
      </div>

      {/* 🔔 Notification globale */}
      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}

    </div>
  );
};

export default CreerModifEns;
