import React, { useEffect, useState } from "react";
import "./MiseAjourChefMention.css";

import {
  creerChefMention,
  modifierStatutChefMention,
  getChefMentionsCodeMention,
  getEnseignantsStatsService,
  getCodeMentionsBDuniv,
} from "./miseAjourChefMentionService";

const MiseAjourChefMention = ({ nomFaculte }) => {
  /* =========================
     MODE
  ========================= */
  const [mode, setMode] = useState("create");

  /* =========================
     DONNÉES MENTIONS
  ========================= */
  const [codesMentions, setCodesMentions] = useState([]);
  const [selectedMention, setSelectedMention] = useState("");

  /* =========================
     DONNÉES ENSEIGNANT
     POUR CRÉATION
  ========================= */
  const [listEnseignants, setListEnseignants] = useState([]);

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [matricule, setMatricule] = useState("");

  /* =========================
     DONNÉES CHEFS MENTION
     POUR MODIFICATION
  ========================= */
  const [listChefMention, setListChefMention] = useState([]);

  const [idChefMention, setIdChefMention] = useState("");
  const [statut, setStatut] = useState("");

  /* =========================
     NOTIFICATION
  ========================= */
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* =========================
     NOTIFICATION GLOBALE
  ========================= */
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  /* =====================================================
     CHARGER LES ENSEIGNANTS
     DISPONIBLES POUR CRÉATION
  ===================================================== */
  useEffect(() => {
    const loadEnseignants = async () => {
      try {
        const data = await getEnseignantsStatsService();

        setListEnseignants(data || []);
      } catch (error) {
        console.error(
          "Erreur chargement enseignants pour chef-mention :",
          error
        );

        setListEnseignants([]);
      }
    };

    loadEnseignants();
  }, []);

  /* =====================================================
     CHARGER LES CODES MENTIONS
     DE LA FACULTÉ
  ===================================================== */
  const loadCodeMentions = async () => {
    if (!nomFaculte) {
      setCodesMentions([]);
      return;
    }

    try {
      const result = await getCodeMentionsBDuniv({
        code_faculte: nomFaculte,
      });

      if (result.success) {
        setCodesMentions(result.data || []);
      } else {
        setCodesMentions([]);

        showMessage(
          result.message ||
            "Aucune mention trouvée pour cette faculté.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Erreur chargement codes mentions :",
        error
      );

      setCodesMentions([]);

      showMessage(
        "Erreur lors du chargement des mentions.",
        "error"
      );
    }
  };

  useEffect(() => {
    loadCodeMentions();
  }, [nomFaculte]);

  /* =====================================================
     SÉLECTION DU CODE MENTION

     En création :
     - sélection simple

     En modification :
     - sélection
     - chargement des chefs liés à cette mention
  ===================================================== */
  const handleSelectMention = async (e) => {
    const codeMention = e.target.value;

    setSelectedMention(codeMention);

    /* Nettoyage */
    setNom("");
    setEmail("");
    setMatricule("");

    setIdChefMention("");
    setStatut("");

    setListChefMention([]);

    /* En création :
       aucun chargement supplémentaire */
    if (mode !== "modified" || !codeMention) {
      return;
    }

    try {
      const result = await getChefMentionsCodeMention({
        code_mention: codeMention,
      });

      if (result.success) {
        setListChefMention(result.admins || []);
      } else {
        setListChefMention([]);

        showMessage(
          result.message ||
            "Aucun chef de mention trouvé pour cette mention.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Erreur chargement chefs de mention :",
        error
      );

      setListChefMention([]);

      showMessage(
        "Erreur lors du chargement des chefs de mention.",
        "error"
      );
    }
  };

  /* =====================================================
     SÉLECTION ENSEIGNANT
     POUR CRÉATION

     Identification :
     matricule
  ===================================================== */
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

  /* =====================================================
     SÉLECTION CHEF MENTION
     POUR MODIFICATION

     Identification :
     id_admin
  ===================================================== */
  const handleSelectChefMentionModification = (e) => {
    const selectedId = e.target.value;

    /* Aucune sélection */
    if (!selectedId) {
      setIdChefMention("");
      setStatut("");

      return;
    }

    /* Recherche du chef */
    const chef = listChefMention.find(
      (item) =>
        String(item.id_admin) ===
        String(selectedId)
    );

    if (!chef) {
      setIdChefMention("");
      setStatut("");

      showMessage(
        "Chef de mention introuvable.",
        "error"
      );

      return;
    }

    /* Identifiant */
    setIdChefMention(
      String(chef.id_admin)
    );

    /* Statut actuel */
    setStatut(
      chef.statut || ""
    );
  };

  /* =====================================================
     CHANGEMENT DE MODE
  ===================================================== */
  const handleChangeMode = (newMode) => {
    setMode(newMode);

    /* Réinitialisation */
    setSelectedMention("");

    setNom("");
    setEmail("");
    setMatricule("");

    setIdChefMention("");
    setStatut("");

    setListChefMention([]);

    setMessage("");
    setMessageType("");
  };

  /* =====================================================
     SOUMISSION
  ===================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* =========================
       VÉRIFICATION MENTION
    ========================= */
    if (!selectedMention) {
      return showMessage(
        "Veuillez sélectionner un code mention.",
        "error"
      );
    }

    let result;

    /* =================================================
       CRÉATION
    ================================================= */
    if (mode === "create") {
      /* Vérifier enseignant */
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

      result = await creerChefMention({
        code_mention: selectedMention,
        nom,
        email,
      });
    }

    /* =================================================
       MODIFICATION
    ================================================= */
    else if (mode === "modified") {
      /* Vérifier chef */
      if (!idChefMention) {
        return showMessage(
          "Veuillez sélectionner un chef de mention.",
          "error"
        );
      }

      /* Vérifier statut */
      if (!statut.trim()) {
        return showMessage(
          "Statut du chef de mention introuvable.",
          "error"
        );
      }

      /*
       * Contrat actuel du service :
       *
       * modifierStatutChefMention({
       *   code_fac,
       *   id_admin,
       *   statut
       * })
       */
      result = await modifierStatutChefMention({
        code_mention: selectedMention,
        id_admin: idChefMention,
        statut,
      });
    }

    /* =================================================
       TRAITEMENT RÉSULTAT
    ================================================= */
    if (result?.success) {
      showMessage(
        result.message,
        "success"
      );

      /* Réinitialisation */
      setSelectedMention("");

      setNom("");
      setEmail("");
      setMatricule("");

      setIdChefMention("");
      setStatut("");

      setListChefMention([]);

      /*
       * En modification, on pourra
       * recharger les chefs si nécessaire.
       */
    } else {
      showMessage(
        result?.message ||
          "Une erreur est survenue.",
        "error"
      );
    }
  };

  return (
    <div className="admin-mention-wrapper">

      <div className="admin-mention-card">

        <h2>
          Gestion des chefs de mentions
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
          className="admin-mention-form"
          onSubmit={handleSubmit}
        >

          {/* =========================
              CODE MENTION
          ========================= */}
          <select
            value={selectedMention}
            onChange={handleSelectMention}
            required
          >
            <option value="">
              Sélectionner code_mention
            </option>

            {codesMentions.map((mention) => (
              <option
                key={mention.id_mention}
                value={mention.code_mention}
              >
                {mention.code_mention}
              </option>
            ))}
          </select>

          {/* =================================================
              CRÉATION

              Sélection enseignant
          ================================================= */}
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
                  placeholder="Nom du chef de mention"
                />
              )}

              {email && (
                <input
                  type="email"
                  value={email}
                  readOnly
                  placeholder="Email du chef de mention"
                />
              )}
            </>
          )}

          {/* =================================================
              MODIFICATION

              Sélection chef de mention
          ================================================= */}
          {mode === "modified" && (
            <>
              <select
                value={idChefMention}
                onChange={
                  handleSelectChefMentionModification
                }
                required
              >
                <option value="">
                  Sélectionner un chef de mention
                </option>

                {listChefMention.map(
                  (chef) => (
                    <option
                      key={chef.id_admin}
                      value={chef.id_admin}
                    >
                      {chef.nom}
                      {" || "}
                      {chef.statut}
                    </option>
                  )
                )}
              </select>

              {/* =========================
                  STATUT
              ========================= */}
              {statut && (
                <input
                  type="text"
                  value={statut}
                  onChange={(e) =>
                    setStatut(e.target.value)
                  }
                  placeholder="Statut du chef de mention"
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
              ? "Créer chef-mention"
              : "Modifier chef-mention"}
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

export default MiseAjourChefMention;
