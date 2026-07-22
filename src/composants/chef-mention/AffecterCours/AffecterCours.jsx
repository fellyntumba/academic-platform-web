import React, { useState, useEffect } from "react";
import "./AffecterCours.css";

import {
  getActiveEnseignantsService,
  affecterCoursService,
  getCoursByMentionService
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
    }, 4000);

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



  // console.log("Cours disponibles :", cours);



  return (

    <div className="affecter-container fade-in">


      <h2>
        Affecter un cours à un enseignant
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





      <button

        className="affecter-btn"

        onClick={handleAffecter}

      >

        Affecter le cours

      </button>



    </div>


  );

};


export default AffecterCours;
