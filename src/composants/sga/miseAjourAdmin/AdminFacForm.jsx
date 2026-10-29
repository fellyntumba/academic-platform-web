import React, { useEffect, useState } from "react";
import "./AdminFacForm.css";

import {
  getCodeFac,
  getAdminFacsCodeFac,
  getEnseignantsStatsService,
  creerAdminFac,
  modifierStatutAdminFac,
} from "./adminFacService";

const AdminFacForm = () => {
  const [mode, setMode] = useState("create");

  const [codesFac, setCodesFac] = useState([]);
  const [selectedFaculte, setSelectedFaculte] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [matricule, setMatricule] = useState("");
  const [idAdmin, setIdAdmin] = useState("");
  const [statut, setStatut] = useState("");
  const [listAdminFacCodeFac, setListAdminFacCodeFac] = useState([]);
  const [listAdminFac, setListAdminFac] = useState([]);


  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* =======================
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

    if (result.success) {
      setCodesFac(result.data);
    } else {
      showMessage(result.message, "error");
    }
  };

  useEffect(() => {
    loadCodeFacs();
  }, []);

  /* =========================
     Charger administrateurs
     disponibles pour création
  ========================= */
  useEffect(() => {
    const loadAdministrateurs = async () => {
      try {
        const data = await getEnseignantsStatsService();

        setListAdminFac(data || []);
      } catch (error) {
        console.error(
          "Erreur chargement administrateurs facultaires :",
          error
        );

        setListAdminFac([]);
      }
    };

    loadAdministrateurs();
  }, []);

  /* =========================
     Sélection du code-fac
     
     En mode création :
     - on sélectionne simplement la faculté

     En mode désactivation :
     - on charge les administrateurs
       liés à cette faculté
  ========================= */
  const handleSelectFaculte = async (e) => {
    const code = e.target.value;

    setSelectedFaculte(code);

    /* Nettoyage des anciennes sélections */
    setIdAdmin("");
    setStatut("");

    setNom("");
    setEmail("");
    setMatricule("");

    setListAdminFacCodeFac([]);

    /* En création, aucun chargement supplémentaire */
    if (mode !== "modified" || !code) {
      return;
    }

    try {
      const data = await getAdminFacsCodeFac({
        code_fac: code,
      });

      if (data.success) {
        setListAdminFacCodeFac(data.admins || []);
      } else {
        showMessage(
          data.message ||
            "Aucun administrateur facultaire trouvé pour cette faculté.",
          "error"
        );

        setListAdminFacCodeFac([]);
      }
    } catch (error) {
      console.error(
        "Erreur chargement administrateurs facultaires :",
        error
      );

      setListAdminFacCodeFac([]);

      showMessage(
        "Erreur lors du chargement des administrateurs facultaires.",
        "error"
      );
    }
  };

  /* =========================
     Sélection administrateur
     pour le mode CRÉATION

     Identification par matricule
  ========================= */
  const handleSelectAdminFac = (e) => {
    const selectedMatricule = e.target.value;

    /* Aucune sélection */
    if (!selectedMatricule) {
      setMatricule("");
      setNom("");
      setEmail("");
      return;
    }

    /* Recherche par matricule */
    const admin = listAdminFac.find(
      (item) =>
        String(item.matricule) ===
        String(selectedMatricule)
    );

    if (!admin) {
      setMatricule("");
      setNom("");
      setEmail("");

      showMessage(
        "Administrateur facultaire introuvable.",
        "error"
      );

      return;
    }

    /* Remplissage automatique */
    setMatricule(admin.matricule || "");
    setNom(admin.nom || "");
    setEmail(admin.email || "");
  };

  /* =========================
     Sélection administrateur
     pour le mode DÉSACTIVATION

     Identification par id_admin
  ========================= */
  const handleSelectAdminFacDesactivation = (e) => {
    const selectedAdminId = e.target.value;

    /* Aucune sélection */
    if (!selectedAdminId) {
      setIdAdmin("");
      setStatut("");
      return;
    }

    /* Recherche dans les administrateurs
       de la faculté sélectionnée */
    const admin = listAdminFacCodeFac.find(
      (item) =>
        String(item.id_admin) ===
        String(selectedAdminId)
    );

    if (!admin) {
      setIdAdmin("");
      setStatut("");

      showMessage(
        "Administrateur facultaire introuvable.",
        "error"
      );

      return;
    }

    /* L'identifiant utilisé pour la désactivation */
    setIdAdmin(String(admin.id_admin));

    /* Statut actuel */
    setStatut(admin.statut || "");
  };

  /* =========================
     Changer de mode
  ========================= */
  const handleChangeMode = (newMode) => {
    setMode(newMode);

    /* Réinitialiser tous les états */
    setSelectedFaculte("");

    setNom("");
    setEmail("");
    setMatricule("");

    setIdAdmin("");
    setStatut("");

    setListAdminFacCodeFac([]);

    setMessage("");
    setMessageType("");
  };

  /* =========================
     Soumission formulaire
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* =========================
       Vérification faculté
    ========================= */
    if (!selectedFaculte) {
      return showMessage(
        "Veuillez sélectionner un code-fac.",
        "error"
      );
    }

    let result;

    /* =========================
       CRÉATION
    ========================= */
    if (mode === "create") {
      if (!matricule.trim()) {
        return showMessage(
          "Veuillez sélectionner un administrateur facultaire.",
          "error"
        );
      }

      if (!nom.trim()) {
        return showMessage(
          "Nom requis.",
          "error"
        );
      }

      if (!email.trim()) {
        return showMessage(
          "Email requis.",
          "error"
        );
      }

      result = await creerAdminFac({
        code_fac: selectedFaculte,
        nom,
        email,
      });
    }

    /* =========================
       DÉSACTIVATION
    ========================= */
    else if (mode === "modified") {
      if (!idAdmin) {
        return showMessage(
          "Veuillez sélectionner un administrateur facultaire.",
          "error"
        );
      }

      if (!statut) {
        return showMessage(
          "Statut de l'administrateur introuvable.",
          "error"
        );
      }

      /*
       * Pour l'instant, on conserve
       * exactement le contrat de ton
       * service existant.
       *
       * La transmission de id_admin
       * pourra être ajoutée lorsque
       * tu adapteras le backend.
       */
      result = await modifierStatutAdminFac({
        code_fac: selectedFaculte,
        id_admin: idAdmin,
        statut,
      });
    }

    /* =========================
       TRAITEMENT RÉSULTAT
    ========================= */
    if (result?.success) {
      showMessage(result.message, "success");

      setNom("");
      setEmail("");
      setMatricule("");

      setIdAdmin("");
      setStatut("");

      setSelectedFaculte("");

      setListAdminFacCodeFac([]);
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
          Gestion Administrateurs Facultaires
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
              FACULTÉ
          ========================= */}
          <select
            value={selectedFaculte}
            onChange={handleSelectFaculte}
            required
          >
            <option value="">
              Sélectionner code-fac
            </option>

            {codesFac.map((c) => (
              <option
                key={c.id_faculte}
                value={c.code_faculte}
              >
                {c.code_faculte}
              </option>
            ))}
          </select>

          {/* =========================
              ADMINISTRATEUR
              MODE CRÉATION
              
              Identification :
              matricule
          ========================= */}
          {mode === "create" && (
            <select
              value={matricule}
              onChange={handleSelectAdminFac}
              required
            >
              <option value="">
                Sélectionner un administrateur facultaire
              </option>

              {listAdminFac.map((admin) => (
                <option
                  key={admin.matricule}
                  value={admin.matricule}
                >
                  {admin.titre
                    ? `${admin.titre}. `
                    : ""}
                  {admin.nom}
                  {" || "}
                  {admin.matricule}
                </option>
              ))}
            </select>
          )}

          {/* =========================
              ADMINISTRATEUR
              MODE DÉSACTIVATION

              Identification :
              id_admin
          ========================= */}
          {mode === "modified" && (
            <>
              <select
                value={idAdmin}
                onChange={
                  handleSelectAdminFacDesactivation
                }
                required
              >
                <option value="">
                  Sélectionner un administrateur facultaire
                </option>

                {listAdminFacCodeFac.map((admin) => (
                  <option
                    key={admin.id_admin}
                    value={admin.id_admin}
                  >
                    {admin.nom}
                    {" || "}
                    {admin.statut}
                  </option>
                ))}
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
                  placeholder="Statut de l'administrateur"
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
              ? "Créer administrateur"
              : "Modifier administrateur"}
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

export default AdminFacForm;
