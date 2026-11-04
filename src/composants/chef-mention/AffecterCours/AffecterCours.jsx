import React, { useState, useEffect } from "react";
import "./AffecterCours.css";

import {
  getActiveEnseignantsService,
  affecterCoursService,
  getCoursByMentionService,
  reconduireAffectationsService
} from "./affecterService";  



const AffecterCours = ({ code_mention }) => {

  const [enseignants, setEnseignants] = useState([]);
  const [cours, setCours] = useState([]);

  const [selectedMatricule, setSelectedMatricule] = useState("");
  const [selectedCoursID, setSelectedCoursID] = useState("");
  const [idSemestre, setIdSemestre] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 


  /* =========================
     Notification
  ========================= */

  const showMessage = (msg, type = "success") => {

    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType(""); 
    }, 6000);

  };


  /* =========================
     Charger données
  ========================= */

  useEffect(() => {

    const loadData = async () => {

      try {

        const enseignantsData = await getActiveEnseignantsService();

        setEnseignants(enseignantsData);


        const coursData = await getCoursByMentionService({ 
          code_mention 
        });

        const coursList = coursData.data || coursData;

        setCours(coursList);


      } catch (error) {

        showMessage(
          "Erreur chargement des données",
          "error"
        );

      }

    };


    if(code_mention){
      loadData();
    }


  }, [code_mention]);



  /* =========================
     Affectation
  ========================= */

  const handleAffecter = async () => {


    if (
      !selectedMatricule || 
      !selectedCoursID ||
      !idSemestre
    ) {

      return showMessage(
        "Veuillez sélectionner un enseignant et un cours.",
        "error"
      );

    }


    try {


      const res = await affecterCoursService({

        selectedMatricule,

        id_cours: Number(selectedCoursID),

        id_semestre: Number(idSemestre)

      });



      showMessage(
        res.message || "Cours affecté avec succès.",
        "success"
      );


      setSelectedCoursID("");

      setSelectedMatricule("");

      setIdSemestre("");


    } catch(error) {


      showMessage(
        error.message,
        "error"
      );

    } 


  };


  
  /* =========================
    Reconduire affectations
  ========================= */

  const handleReconduireAffectations = async () => {

    if (!code_mention) {
      return showMessage(
        "Code mention introuvable.",
        "error"
      );
    }

    const confirmation = window.confirm(
      "Voulez-vous vraiment reconduire les affectations de l'année passée pour cette mention ?"
    );

    if (!confirmation) {
      return;
    }

    try {

      const res = await reconduireAffectationsService({
        code_mention
      });

      // Le contrôleur fournit directement le message et son type.
      showMessage(
        res.message || "Opération terminée.",
        res.type || (res.success ? "success" : "error")
      );

    } catch (error) {

      showMessage(
        error.response?.data?.message ||
        error.message ||
        "Une erreur est survenue lors de la reconduction des affectations.",
        "error"
      );

    }
  };


  return (

    <div className="affecter-container fade-in">


      <h2>
        Gestion des affectations des cours aux enseignants
      </h2>


      {message && (

        <div className={`notification ${messageType}`}>

          {message}

        </div>

      )}




      {/* Enseignant */}

      <div className="form-group">


        <label>
          Choisir l'enseignant :
        </label>


        <select

          value={selectedMatricule}

          onChange={(e)=>setSelectedMatricule(e.target.value)}

        >

          <option value="">
            -- Sélectionner un enseignant --
          </option>


          {enseignants.map((e)=>(

            <option

              key={e.id_enseignant}

              value={e.matricule}

            >

              {e.titre} {e.nom} ({e.matricule})


            </option>


          ))}


        </select>


      </div>





      {/* Cours */}

      <div className="form-group">


        <label>
          Choisir le cours :
        </label>


        <select


          value={selectedCoursID}


          onChange={(e)=>{


            const idCoursSelectionne = e.target.value;


            setSelectedCoursID(idCoursSelectionne);



            const coursSelectionne = cours.find(

              (c)=>

                c.id_cours === Number(idCoursSelectionne)

            );



            if(coursSelectionne){


              setIdSemestre(
                coursSelectionne.id_semestre
              );


            }



          }}


        >


          <option value="">

            -- Sélectionner un cours --

          </option>

          {cours.map((c)=>(

            <option

              key={c.id_cours}

              value={c.id_cours}

            >

              {c.nom_cours} 
              {" | "}
              {c.nom_promotion}
              {" | "}
              {c.semestre}
            </option>
          ))}

        </select>


      </div>

      <div className="actions-buttons">
        <button className="affecter-btn" onClick={handleAffecter}>
          Affecter le cours
        </button>

        <button className="reconduire-btn" onClick={handleReconduireAffectations}>
          Reconduire les affectations de l'année passée
        </button>
      </div>



    </div>


  );

};


export default AffecterCours;
