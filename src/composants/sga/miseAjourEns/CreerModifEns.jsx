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
  const [messageType, setMessageType] = useState("");

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  /* =========================================================
     CHARGER LES MATRICULES EN MODE MODIFICATION
  ========================================================= */

  useEffect(() => {
    if (mode === "edit") {
      const loadMatricules = async () => {
        try {
          const data = await getEnseignantsMatricules();
          setMatricules(data);
        } catch (err) {
          showMessage(
            "Erreur lors du chargement des matricules.",
            "error"
          );
        }
      };

      loadMatricules();
    }
  }, [mode]);

  /* =========================================================
     CHARGER L'ENSEIGNANT SÉLECTIONNÉ
  ========================================================= */

  const handleSelectMatricule = async (e) => {
    const matricule = e.target.value;

    setSelectedMatricule(matricule);

    if (!matricule) {
      setForm({
        nom: "",
        email: "",
        telephone: "",
        titre: ""
      });

      setStatut("");

      return;
    }

    try {
      const enseignant =
        await getEnseignantByMatricule(matricule);

      setForm({
        nom: enseignant.nom || "",
        email: enseignant.email || "",
        telephone: enseignant.telephone || "",
        titre: enseignant.titre || "",
      });

      setStatut(enseignant.statut || "");
    } catch {
      showMessage(
        "Impossible de charger les informations.",
        "error"
      );
    }
  };

  /* =========================================================
     CHANGEMENT DES CHAMPS
  ========================================================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* =========================================================
     CRÉATION / MODIFICATION
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nom.trim()) {
      showMessage(
        "Le nom est requis.",
        "error"
      );

      return;
    }

    try {
      if (mode === "create") {
        const res = await createEnseignant(form);

        showMessage(
          `Enseignant créé avec succès. Matricule : ${res.matricule}`,
          "success"
        );

        setForm({
          nom: "",
          email: "",
          telephone: "",
          titre: ""
        });
      } else {
        if (!selectedMatricule) {
          showMessage(
            "Veuillez sélectionner un matricule.",
            "error"
          );

          return;
        }

        const res = await updateEnseignant({
          matricule: selectedMatricule,
          statut,
          ...form,
        });

        showMessage(
          res.message ||
            "Enseignant modifié avec succès.",
          "success"
        );
      }
    } catch (error) {
      showMessage(
        error.message || "Erreur serveur.",
        "error"
      );
    }
  };

  /* =========================================================
     CHANGEMENT DE MODE
  ========================================================= */

  const handleModeChange = (newMode) => {
    setMode(newMode);

    setSelectedMatricule("");
    setStatut("");

    setForm({
      nom: "",
      email: "",
      telephone: "",
      titre: ""
    });
  };

  return (
    <div className="enseignant-wrapper">

      <div className="enseignant-container">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="enseignant-header">

          <div className="enseignant-title-area">

            <div className="enseignant-title-icon">
              <span>EN</span>
            </div>

            <div className="enseignant-title-content">

              <span className="enseignant-eyebrow">
                ADMINISTRATION ACADÉMIQUE
              </span>

              <h2>
                Gestion des enseignants
              </h2>

              <p>
                Créez un compte enseignant ou modifiez
                les informations d’un enseignant existant.
              </p>

            </div>

          </div>

          <div className="enseignant-mode-badge">
            {mode === "create"
              ? "Nouveau compte"
              : "Modification"}
          </div>

        </div>


        {/* =====================================================
            MODE
        ===================================================== */}

        <div className="mode-area">

          <div className="mode-label">
            <span>MODE DE GESTION</span>
          </div>

          <div className="mode-switch">

            <button
              type="button"
              className={
                mode === "create"
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleModeChange("create")
              }
            >
              <span className="mode-button-icon">
                +
              </span>

              <span>
                Créer un enseignant
              </span>
            </button>

            <button
              type="button"
              className={
                mode === "edit"
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleModeChange("edit")
              }
            >
              <span className="mode-button-icon">
                ↻
              </span>

              <span>
                Modifier un enseignant
              </span>
            </button>

          </div>

        </div>


        {/* =====================================================
            FORMULAIRE
        ===================================================== */}

        <form
          className="enseignant-form"
          onSubmit={handleSubmit}
        >

          {/* ===================================================
              MODIFICATION
          =================================================== */}

          {mode === "edit" && (
            <section className="form-card">

              <div className="form-card-header">

                <div>
                  <span className="section-eyebrow">
                    SÉLECTION
                  </span>

                  <h3>
                    Compte enseignant
                  </h3>
                </div>

                <span className="section-number">
                  01
                </span>

              </div>

              <div className="form-grid">

                <div className="field">

                  <label htmlFor="matricule">
                    Matricule
                  </label>

                  <select
                    id="matricule"
                    value={selectedMatricule}
                    onChange={handleSelectMatricule}
                    required
                  >
                    <option value="">
                      Sélectionner un matricule
                    </option>

                    {matricules.map((m) => (
                      <option
                        key={m.matricule}
                        value={m.matricule}
                      >
                        {m.matricule}
                      </option>
                    ))}
                  </select>

                </div>


                <div className="field">

                  <label htmlFor="statut">
                    Statut
                  </label>

                  <input
                    id="statut"
                    name="statut"
                    placeholder="Ex. actif, non-actif"
                    value={statut}
                    onChange={(e) =>
                      setStatut(e.target.value)
                    }
                  />

                </div>

              </div>

            </section>
          )}


          {/* ===================================================
              INFORMATIONS ENSEIGNANT
          =================================================== */}

          <section className="form-card">

            <div className="form-card-header">

              <div>
                <span className="section-eyebrow">
                  INFORMATIONS
                </span>

                <h3>
                  Informations de l’enseignant
                </h3>
              </div>

              <span className="section-number">
                {mode === "edit" ? "02" : "01"}
              </span>

            </div>


            <div className="form-grid">

              {/* NOM */}

              <div className="field field-full">

                <label htmlFor="nom">
                  Nom complet
                  <span className="required-mark">
                    *
                  </span>
                </label>

                <input
                  id="nom"
                  name="nom"
                  type="text"
                  placeholder="Nom complet de l’enseignant"
                  value={form.nom}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="field">

                <label htmlFor="email">
                  Adresse email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemple@universite.cd"
                  value={form.email}
                  onChange={handleChange}
                />

              </div>


              {/* TELEPHONE */}

              <div className="field">

                <label htmlFor="telephone">
                  Téléphone
                </label>

                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  placeholder="Numéro de téléphone"
                  value={form.telephone}
                  onChange={handleChange}
                />

              </div>


              {/* TITRE */}

              <div className="field">

                <label htmlFor="titre">
                  Titre académique
                </label>

                <input
                  id="titre"
                  name="titre"
                  type="text"
                  placeholder="Dr, Prof, etc."
                  value={form.titre}
                  onChange={handleChange}
                />

              </div>

            </div>

          </section>


          {/* ===================================================
              ACTION
          =================================================== */}

          <div className="form-actions">

            <div className="action-information">

              <span className="action-indicator">
                {mode === "create"
                  ? "+"
                  : "✓"}
              </span>

              <div>
                <strong>
                  {mode === "create"
                    ? "Création du compte"
                    : "Mise à jour du compte"}
                </strong>

                <span>
                  {mode === "create"
                    ? "Les informations seront enregistrées dans le système."
                    : "Les nouvelles informations remplaceront les données actuelles."}
                </span>
              </div>

            </div>


            <button
              type="submit"
              className="enseignant-submit"
            >
              <span>
                {mode === "create"
                  ? "Créer l’enseignant"
                  : "Enregistrer les modifications"}
              </span>

              <span className="submit-arrow">
                →
              </span>

            </button>

          </div>

        </form>

      </div>


      {/* =====================================================
          NOTIFICATION
      ===================================================== */}

      {message && (
        <div
          className={`notification ${messageType}`}
        >

          <div className="notification-icon">
            {messageType === "success"
              ? "✓"
              : "!"}
          </div>

          <div className="notification-content">

            <strong>
              {messageType === "success"
                ? "Opération réussie"
                : "Erreur"}
            </strong>

            <span>
              {message}
            </span>

          </div>

        </div>
      )}

    </div>
  );
};

export default CreerModifEns;

