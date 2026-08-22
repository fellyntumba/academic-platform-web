import React, { useEffect, useState } from "react";
import "./ComptableForm.css";

import {
  creerComptable,
  modifierStatutComptable,
  getComptablesUniversite,
} from "./comptableService";

const ComptableForm = () => {

  /* =====================================================
     MODE
  ===================================================== */

  const [mode, setMode] = useState("create");


  /* =====================================================
     CRÉATION / DONNÉES COMMUNES
  ===================================================== */

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");


  /* =====================================================
     MODIFICATION
  ===================================================== */

  const [listComptables, setListComptables] = useState([]);

  const [idComptable, setIdComptable] = useState("");

  const [statut, setStatut] = useState("");


  /* =====================================================
     NOTIFICATION
  ===================================================== */

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");


  /* =====================================================
     NOTIFICATION GLOBALE
  ===================================================== */

  const showMessage = (msg, type = "success") => {

    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {

      setMessage("");
      setMessageType("");

    }, 4000);
  };


  /* =====================================================
     CHARGER LES COMPTABLES
  ===================================================== */

  const loadComptables = async () => {

    try {

      const result =
        await getComptablesUniversite();

      if (result.success) {

        setListComptables(
          result.comptables || []
        );

      } else {

        setListComptables([]);

        showMessage(
          result.message ||
            "Impossible de récupérer les comptables.",
          "error"
        );
      }

    } catch (error) {

      console.error(
        "Erreur chargement comptables :",
        error
      );

      setListComptables([]);

      showMessage(
        "Erreur lors du chargement des comptables.",
        "error"
      );
    }
  };


  /* =====================================================
     CHARGEMENT INITIAL
  ===================================================== */

  useEffect(() => {

    loadComptables();

  }, []);


  /* =====================================================
     SÉLECTION COMPTABLE
     MODE MODIFICATION
  ===================================================== */

  const handleSelectComptable = (e) => {

    const selectedId =
      e.target.value;


    /* ===================================================
       AUCUNE SÉLECTION
    =================================================== */

    if (!selectedId) {

      setIdComptable("");

      setNom("");

      setEmail("");

      setTelephone("");

      setStatut("");

      return;
    }


    /* ===================================================
       RECHERCHE DU COMPTABLE
    =================================================== */

    const comptable =
      listComptables.find(
        (item) =>
          String(item.id_comptable) ===
          String(selectedId)
      );


    if (!comptable) {

      setIdComptable("");

      setNom("");

      setEmail("");

      setTelephone("");

      setStatut("");

      showMessage(
        "Comptable introuvable.",
        "error"
      );

      return;
    }


    /* ===================================================
       REMPLISSAGE
    =================================================== */

    setIdComptable(
      String(comptable.id_comptable)
    );

    setNom(
      comptable.nom || ""
    );

    setEmail(
      comptable.email || ""
    );

    setTelephone(
      comptable.telephone || ""
    );

    setStatut(
      comptable.statut || ""
    );
  };


  /* =====================================================
     CHANGEMENT DE MODE
  ===================================================== */

  const handleChangeMode = (newMode) => {

    setMode(newMode);


    /* ===================================================
       RÉINITIALISATION
    =================================================== */

    setNom("");

    setEmail("");

    setTelephone("");

    setIdComptable("");

    setStatut("");

    setMessage("");

    setMessageType("");


    /* ===================================================
       RECHARGER LES COMPTABLES
       EN MODE MODIFICATION
    =================================================== */

    if (newMode === "modified") {

      loadComptables();
    }
  };


  /* =====================================================
     SOUMISSION
  ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    let result;


    /* ===================================================
       CRÉATION
    =================================================== */

    if (mode === "create") {

      /* Nom */

      if (!nom.trim()) {

        return showMessage(
          "Nom requis.",
          "error"
        );
      }


      /* Email */

      if (!email.trim()) {

        return showMessage(
          "Email requis.",
          "error"
        );
      }


      /* =================================================
         APPEL DU SERVICE
         Conforme au service actuel :
         creerComptable({ nom, email })
      ================================================= */

      result =
        await creerComptable({
          nom: nom.trim(),
          email: email.trim(),
          telephone: telephone.trim()
        });
    }


    /* ===================================================
       MODIFICATION
    =================================================== */

    else if (mode === "modified") {

      /* Comptable obligatoire */

      if (!idComptable) {

        return showMessage(
          "Veuillez sélectionner un comptable.",
          "error"
        );
      }


      /* Statut obligatoire */

      if (!statut) {

        return showMessage(
          "Veuillez sélectionner le statut du comptable.",
          "error"
        );
      }


      /* =================================================
         APPEL DU SERVICE
      ================================================= */

      result =
        await modifierStatutComptable({
          id_comptable: idComptable,
          statut
        });
    }


    /* ===================================================
       TRAITEMENT DU RÉSULTAT
    =================================================== */

    if (result?.success) {

      showMessage(
        result.message,
        "success"
      );


      /* =================================================
         NETTOYAGE
      ================================================= */

      setNom("");

      setEmail("");

      setTelephone("");

      setIdComptable("");

      setStatut("");


      /* =================================================
         ACTUALISATION DE LA LISTE
      ================================================= */

      await loadComptables();

    } else {

      showMessage(
        result?.message ||
          "Une erreur est survenue.",
        "error"
      );
    }
  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div className="comptable-wrapper">

      <div className="comptable-form-container">


        {/* =================================================
            TITRE
        ================================================= */}

        <h2>
          Gestion des Comptables
        </h2>


        {/* =================================================
            MODE SWITCH
        ================================================= */}

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


        {/* =================================================
            FORMULAIRE
        ================================================= */}

        <form
          className="comptable-form"
          onSubmit={handleSubmit}
        >


          {/* =================================================
              MODE CRÉATION
          ================================================= */}

          {mode === "create" && (

            <>

              <input
                type="text"
                value={nom}
                onChange={(e) =>
                  setNom(e.target.value)
                }
                placeholder="Nom complet"
                required
              />


              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Adresse email"
                required
              />


              <input
                type="tel"
                value={telephone}
                onChange={(e) =>
                  setTelephone(e.target.value)
                }
                placeholder="Téléphone (facultatif)"
              />

            </>

          )}


          {/* =================================================
              MODE MODIFICATION
          ================================================= */}

          {mode === "modified" && (

            <>

              <select
                value={idComptable}
                onChange={
                  handleSelectComptable
                }
                required
              >

                <option value="">
                  Sélectionner un comptable
                </option>


                {listComptables.map(
                  (comptable) => (

                    <option
                      key={
                        comptable.id_comptable
                      }
                      value={
                        comptable.id_comptable
                      }
                    >

                      {comptable.nom}

                      {" || "}

                      {comptable.email}

                      {" || "}

                      {comptable.statut}

                    </option>

                  )
                )}

              </select>


              {nom && (

                <input
                  type="text"
                  value={nom}
                  readOnly
                  placeholder="Nom"
                />

              )}


              {email && (

                <input
                  type="email"
                  value={email}
                  readOnly
                  placeholder="Email"
                />

              )}


              {telephone && (

                <input
                  type="tel"
                  value={telephone}
                  readOnly
                  placeholder="Téléphone"
                />

              )}


              <select
                value={statut}
                onChange={(e) =>
                  setStatut(e.target.value)
                }
                required
              >

                <option value="">
                  Sélectionner le statut
                </option>


                <option value="actif">
                  Actif
                </option>


                <option value="inactif">
                  Inactif
                </option>

              </select>

            </>

          )}


          {/* =================================================
              BOUTON
          ================================================= */}

          <button
            type="submit"
            className={
              mode === "modified"
                ? "danger-submit"
                : ""
            }
          >

            {mode === "create"
              ? "Créer comptable"
              : "Modifier comptable"}

          </button>

        </form>

      </div>


      {/* =================================================
          NOTIFICATION
      ================================================= */}

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


export default ComptableForm;
