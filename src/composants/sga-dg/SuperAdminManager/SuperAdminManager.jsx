
import React, { useEffect, useState } from "react";
import "./SuperAdminManager.css";

import {
  getAllSga,
  getEnseignantsStatsService,
  creerSga,
  modifierStatutSga,
} from "./superAdminManagerService";

const SuperAdminManager = () => {
  const [mode, setMode] = useState("create");

  /* =========================
     Données SGA
  ========================= */
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [matricule, setMatricule] = useState("");

  const [idSga, setIdSga] = useState("");
  const [statut, setStatut] = useState("");

  /* =========================
     Listes
  ========================= */
  const [listEnseignants, setListEnseignants] = useState([]);
  const [listSga, setListSga] = useState([]);

  /* =========================
     Notification
  ========================= */
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
     Charger les enseignants
     disponibles pour création
  ========================= */
  useEffect(() => {
    const loadEnseignants = async () => {
      try {
        const data = await getEnseignantsStatsService();

        setListEnseignants(data || []);
      } catch (error) {
        console.error(
          "Erreur chargement enseignants pour SGA :",
          error
        );

        setListEnseignants([]);
      }
    };

    loadEnseignants();
  }, []);

  /* =========================
     Charger les SGA
     pour modification
  ========================= */
  const loadSga = async () => {
    try {
      const data = await getAllSga();

      if (data.success) {
        setListSga(data.admins || []);
      } else {
        setListSga([]);

        showMessage(
          data.message ||
            "Aucun Secrétaire Général Académique trouvé.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Erreur chargement SGA :",
        error
      );

      setListSga([]);

      showMessage(
        "Erreur lors du chargement des Secrétaires Généraux Académiques.",
        "error"
      );
    }
  };

  /* =========================
     Charger les SGA lorsqu'on
     passe en mode modification
  ========================= */
  useEffect(() => {
    if (mode === "modified") {
      loadSga();
    }
  }, [mode]);

  /* =========================
     Sélection SGA
     pour la CRÉATION
     
     Identification :
     matricule enseignant
  ========================= */
  const handleSelectEnseignant = (e) => {
    const selectedMatricule = e.target.value;

    /* Aucune sélection */
    if (!selectedMatricule) {
      setMatricule("");
      setNom("");
      setEmail("");

      return;
    }

    /* Recherche de l'enseignant */
    const enseignant = listEnseignants.find(
      (item) =>
        String(item.matricule) ===
        String(selectedMatricule)
    );

    if (!enseignant) {
      setMatricule("");
      setNom("");
      setEmail("");

      showMessage(
        "Enseignant introuvable.",
        "error"
      );

      return;
    }

    /* Remplissage automatique */
    setMatricule(
      enseignant.matricule || ""
    );

    setNom(
      enseignant.nom || ""
    );

    setEmail(
      enseignant.email || ""
    );
  };

  /* =========================
     Sélection SGA
     pour MODIFICATION

     Identification :
     id_admin
  ========================= */
  const handleSelectSgaModification = (e) => {
    const selectedIdSga = e.target.value;

    /* Aucune sélection */
    if (!selectedIdSga) {
      setIdSga("");
      setStatut("");

      return;
    }

    /* Recherche du SGA sélectionné */
    const sga = listSga.find(
      (item) =>
        String(item.id_admin) ===
        String(selectedIdSga)
    );

    if (!sga) {
      setIdSga("");
      setStatut("");

      showMessage(
        "Secrétaire Général Académique introuvable.",
        "error"
      );

      return;
    }

    /* Identifiant du SGA */
    setIdSga(
      String(sga.id_admin)
    );

    /* Statut actuel */
    setStatut(
      sga.statut || ""
    );
  };

  /* =========================
     Changer de mode
  ========================= */
  const handleChangeMode = (newMode) => {
    setMode(newMode);

    /* Réinitialisation */
    setNom("");
    setEmail("");
    setMatricule("");

    setIdSga("");
    setStatut("");

    setListSga([]);

    setMessage("");
    setMessageType("");
  };

  /* =========================
     Soumission formulaire
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;

    /* =========================
       CRÉATION SGA
    ========================= */
    if (mode === "create") {
      /* Vérifier l'enseignant */
      if (!matricule.trim()) {
        return showMessage(
          "Veuillez sélectionner un enseignant.",
          "error"
        );
      }

      /* Vérifier nom */
      if (!nom.trim()) {
        return showMessage(
          "Nom requis.",
          "error"
        );
      }

      /* Vérifier email */
      if (!email.trim()) {
        return showMessage(
          "Email requis.",
          "error"
        );
      }

      /* Création */
      result = await creerSga({
        nom,
        email,
      });
    }

    /* =========================
       MODIFICATION SGA
    ========================= */
    else if (mode === "modified") {
      /* Vérifier SGA */
      if (!idSga) {
        return showMessage(
          "Veuillez sélectionner un Secrétaire Général Académique.",
          "error"
        );
      }

      /* Vérifier statut */
      if (!statut.trim()) {
        return showMessage(
          "Statut du Secrétaire Général Académique introuvable.",
          "error"
        );
      }

      /* Modification */
      result = await modifierStatutSga({
        id_admin: idSga,
        statut,
      });
    }

    /* =========================
       TRAITEMENT RÉSULTAT
    ========================= */
    if (result?.success) {
      showMessage(
        result.message,
        "success"
      );

      /* Réinitialiser */
      setNom("");
      setEmail("");
      setMatricule("");

      setIdSga("");
      setStatut("");

      setListSga([]);

      /* Recharger les SGA si nécessaire */
      if (mode === "modified") {
        await loadSga();
      }
    } else {
      showMessage(
        result?.message ||
          "Une erreur est survenue.",
        "error"
      );
    }
  };

  return (
    <div className="admin-fac-wrapper">

      <div className="admin-fac-form-container">

        <h2>
          Gestion des S G A
        </h2>

        {/* =========================
            MODE SWITCH
        ========================= */}
        <div className="mode-switch">

          <button
            type="button"
            className={
              mode === "create"
                ? "active"
                : ""
            }
            onClick={() =>
              handleChangeMode("create")
            }
          >
            Création
          </button>

          <button
            type="button"
            className={
              mode === "modified"
                ? "active danger-btn"
                : ""
            }
            onClick={() =>
              handleChangeMode("modified")
            }
          >
            Modification
          </button>

        </div>

        {/* =========================
            FORMULAIRE
        ========================= */}
        <form
          className="admin-fac-form"
          onSubmit={handleSubmit}
        >

          {/* =========================
              CRÉATION SGA

              Sélection d'un enseignant
              par matricule
          ========================= */}
          {mode === "create" && (
            <>
              <select
                value={matricule}
                onChange={handleSelectEnseignant}
                required
              >
                <option value="">
                  Sélectionner un enseignant
                </option>

                {listEnseignants.map(
                  (enseignant) => (
                    <option
                      key={enseignant.matricule}
                      value={enseignant.matricule}
                    >
                      {enseignant.titre
                        ? `${enseignant.titre}. `
                        : ""}
                      {enseignant.nom}
                      {" || "}
                      {enseignant.matricule}
                    </option>
                  )
                )}
              </select>

              {nom && (
                <input
                  type="text"
                  value={nom}
                  readOnly
                  placeholder="Nom du SGA"
                />
              )}

              {email && (
                <input
                  type="email"
                  value={email}
                  readOnly
                  placeholder="Email du SGA"
                />
              )}
            </>
          )}

          {/* =========================
              MODIFICATION SGA

              Sélection par id_admin
          ========================= */}
          {mode === "modified" && (
            <>
              <select
                value={idSga}
                onChange={
                  handleSelectSgaModification
                }
                required
              >
                <option value="">
                  Sélectionner un Secrétaire Général Académique
                </option>

                {listSga.map((sga) => (
                  <option
                    key={sga.id_admin}
                    value={sga.id_admin}
                  >
                    {sga.nom}
                    {" || "}
                    {sga.statut}
                  </option>
                ))}
              </select>

              {/* =========================
                  STATUT ACTUEL
              ========================= */}
              {statut && (
                <input
                  type="text"
                  value={statut}
                  onChange={(e) =>
                    setStatut(e.target.value)
                  }
                  placeholder="Statut du SGA"
                />
              )}
            </>
          )}

          {/* =========================
              BOUTON
          ========================= */}
          <button
            type="submit"
            className={
              mode === "modified"
                ? "danger-submit"
                : ""
            }
          >
            {mode === "create"
              ? "Créer SGA"
              : "Modifier SGA"}
          </button>

        </form>

      </div>

      {/* =========================
          NOTIFICATION
      ========================= */}
      {message && (
        <div
          className={`notification ${messageType}`}
        >
          {message}
        </div>
      )}

    </div>
  );
};

export default SuperAdminManager;
