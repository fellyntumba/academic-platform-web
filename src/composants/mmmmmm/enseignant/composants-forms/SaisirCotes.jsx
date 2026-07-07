
import { useState, useEffect } from 'react'
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ToastContairSucces, ToastContairErreur } from "../services/ToastContair";
import { useSelector } from 'react-redux'
import '../../../styles-pages/enseignant/Composants-Styles/SaisirCotes.css'
import '../services/SaisirCotes'
import { obtenirPromoEnseign,
         obtenirCoursEnseignPromo,
         obtenirMatPromo,
         obtenirEffectifPromo,
         obtenirEffectifCote,
         ajouterCote,
         obtenirCotePromo,
         obtenirAllCote
} from '../services/SaisirCotes';


function SaisirCotes() {

  const idEnsei = useSelector((state) => state.enseignant.idEnseignant); 
  const [listePromoEnseign, setListePromoEnseign] = useState(null) //Prends la liste de promotions/Enseignant
  const [selectPromoEnseign, setSelectPromoEnseign] = useState('') //Prends la promotion séléctionnée
  const [listeCoursEnseign, setListeCoursEnseign] = useState(null) //Prends la liste de cours/Enseignant
  const [selectCoursEnseign, setSelectCoursEnseign] = useState('') //Prends le cour séléctionné
  const [listeMatPromo, setListeMatPromo] = useState(null) //Prends la liste de mat/promo
  const [selectMatPromo, setSelectMatPromo] = useState('') //Prends le mat séléctionnée
  const [effectifPromo, setEffectifPromo] = useState(null) //Prends effectif/promo
  const [effectifCote, setEffectifCote] = useState(null) //Prends effectif/promo
  const [cote, setCote] = useState(""); //Prends la cote
  const [notes, setNotes] = useState([]);
  const [imageUrl, setImageUrl] = useState(""); //Prends la cote
  const [editingIndex, setEditingIndex] = useState(null);
  const [coteInput, setCoteInput] = useState("");

  // console.log(idEnsei);

 // Compter réussites et échecs (>=10 réussi, <10 échec)
//  const reussites = listeCote.filter((n) => n.valeur >= 10).length;
//  const echecs = listeCote.filter((n) => n.valeur < 10).length;




  // Gère l' Appel API pour les noms de promotions/enseignant
  useEffect(()=>{
    const PromoEnseign  = async()=>{

      try {
        if (idEnsei){
          const promotions = await obtenirPromoEnseign(idEnsei);
         
          if (!promotions.ok){
          // console.log('promotions non retrouvées');
            return
          }
          const data = await promotions.json()
          setListePromoEnseign(data);
          // console.log(data);
        } else {
          console.log(idEnsei);
        }

      } catch (error) {
        console.log(error);
      }
    };
    PromoEnseign();
  }, []);

  // Gère l' Appel API cours pour enseignants/promo
  useEffect(()=>{
    const getCoursEnseignPromo = async()=>{
        try {
            // console.log(selectPromoEnseign);
            // console.log(idEnsei);
          if (selectPromoEnseign!='' && idEnsei!=''){
            const result = await obtenirCoursEnseignPromo(idEnsei, selectPromoEnseign);
        
            // console.log(result);
            

            if(!result.ok ){
              // console.log(result);
              // ToastContairErreur('Cours non trouvés');
              // console.log('Cours non trouvés');
              return
            }else{
              const data = await result.json()
              setListeCoursEnseign(data)
              // console.log('cours trouvés');
              // console.log(data);
              
            }
          } else{
              setListeCoursEnseign([])
              // console.log('cours non trouvés');
          }
        
      } catch (error) {
        // ToastContairErreur('Une erreur s\'est produite');
        console.log(error);
      }
    }

  getCoursEnseignPromo()

},[idEnsei, selectPromoEnseign]);
// console.log(listeCoursEnseign);


// Gère l' Appel API pour matricules/promo
useEffect(()=>{
    const getMatPromo = async()=>{
        try {
            // console.log(selectPromoEnseign);
            
          if (selectPromoEnseign!=''){
            const result = await obtenirMatPromo(selectPromoEnseign, selectCoursEnseign);
        
            // console.log(result);

            if(!result.ok ){
              // console.log(result);
              // ToastContairErreur('Matriculés non trouvés');
              // console.log('Matriculés non trouvés');
              return
            }else{
              const data = await result.json()
              setListeMatPromo(data)
              // console.log('Matriculés trouvés');
              // console.log(listeMatPromo);
              
            }
          } else{
              setListeMatPromo([])
              console.log('cours non trouvés');
          }
        
      } catch (error) {
        // ToastContairErreur('Une erreur s\'est produite');
        console.log(error);
      }
    }

  getMatPromo()

},[selectPromoEnseign, selectCoursEnseign]);


// Gère l' Appel API pour effectif/promo
useEffect(()=>{
    const getEffectifPromo = async()=>{
        try {
            // console.log(selectPromoEnseign);
            
          if (selectPromoEnseign!=''){
            const result = await obtenirEffectifPromo(selectPromoEnseign);
        
            // console.log(result);
            

            if(!result.ok ){
              // console.log(result);
              // ToastContairErreur('Matriculés non trouvés');
              console.log('Effectif non trouvé');

            }else{
              const data = await result.json()
              setEffectifPromo(data)
              // console.log('Effectif trouvé');
              // console.log(data);
              
            }
          } else{
              setEffectifPromo([])
              console.log('Effectif non trouvé');
          }
        
      } catch (error) {
        // ToastContairErreur('Une erreur s\'est produite');
        console.log(error);
      }
    }

  getEffectifPromo()

},[selectPromoEnseign]);
// console.log(effectifPromo)


// Gère l' Appel API pour effectif/promo
useEffect(()=>{
    const getEffectifCote = async()=>{
        try {
            // console.log(selectPromoEnseign);
            
          if (selectPromoEnseign!='' && selectCoursEnseign!=''){
            const result = await obtenirEffectifCote(selectPromoEnseign, selectCoursEnseign);
        
            // console.log(result);
            
            if(!result.ok ){
              // console.log(result);
              // ToastContairErreur('Matriculés non trouvés');
              console.log('Effectif non trouvé');

            }else{
              const data = await result.json()
              setEffectifCote(data)
              // console.log('Effectif trouvé');
              // console.log(data);
              
            }
          } else{
              setEffectifCote([])
              // console.log('Effectif non trouvé');
          }
        
      } catch (error) {
        // ToastContairErreur('Une erreur s\'est produite');
        console.log(error);
      }
    }

  getEffectifCote()

},[selectPromoEnseign, selectCoursEnseign]);


//Gère l' API pour generer les statistiques de cotes/cours
useEffect(()=>{
    const getCotePromo = async()=>{

      if (selectPromoEnseign && selectCoursEnseign){
        //Recupère l'image de stat
        const result = await obtenirCotePromo(selectPromoEnseign, selectCoursEnseign);
        const blob = await result.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
       
      }else{
        return;
      }
  
      }
          
  getCotePromo()
},[selectPromoEnseign, selectCoursEnseign]);

//fction pour enregistrer les cotes
const addCotes = async()=>{
    
    try {

      const res = await ajouterCote(notes);


      if(!res.ok){
        ToastContairErreur('Cotes non enregistrées');
        // console.log('Cotes non enregistrées');
        return;
      }
      const result= await res.json()
      console.log(result.data);
      ToastContairSucces(result.message);
      
    } catch (error) {
      ToastContairErreur('Une erreur s\'est produite');
      console.log(error);
    }
}

// Gère la validation de cotes dans une liste
 const handleValider = async(e)=> {
   e.preventDefault();

   if (selectMatPromo ){
      const dateActuelle = new Date().toISOString().split('T')[0]
      setNotes(prevNotes => [...prevNotes,
         { cote: (cote), date: dateActuelle, matricule: selectMatPromo, cours: selectCoursEnseign, anneeAcad: '2024-2025', promo: selectPromoEnseign}
        ]);
      
      setListeMatPromo(prevListe => prevListe.filter(m => m.matricule !== selectMatPromo)
      )

      setSelectMatPromo("");
      setCote("");
   } 
   
 };
      // console.log(listeMatPromo)
      // console.log(notes)

// Gère l' Appel API avec la fction addCotes()
 const handleEnvoyer = async (e) => {
   e.preventDefault();

    if (selectCoursEnseign && listeMatPromo.length == 0 && notes.length !== 0){
      try {
      await addCotes();

      //Recupère l'effectif de cotes soumises
      const effectif = await obtenirEffectifCote(selectPromoEnseign, selectCoursEnseign);
      const nbre = await effectif.json()
      setEffectifCote(nbre)

      //Recupère l'image de stat
      const result = await obtenirCotePromo(selectPromoEnseign, selectCoursEnseign);
      const blob = await result.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);

      setNotes([]);
      setSelectMatPromo("");
      setCote("");
        
      } catch (error) {
        console.log("Erreur")
      }
  
   } else{
    console.log("Condition non satisfaite")
   }
      
 };

 // Gère l' Appel API pour modifier la cote
 const handleModifier = async(index) => {
  
    if (coteInput === ""){
      const updatedNotes = [...notes];
      updatedNotes[index].cote = "";
      setNotes(updatedNotes);
      setEditingIndex(null);
      return
      
    }
    const newCote = Number(coteInput);
    if (Number.isNaN(newCote) || newCote < 0 || newCote > 20 ) {
      alert("Cote invalide");
      return;
    
    }
    const updatedNotes = [...notes];
    updatedNotes[index].cote = newCote;
    setNotes(updatedNotes);
    setEditingIndex(null);
    ToastContairSucces(`Cote modifiée`);
   
 };


 // Gère l' Appel API pour génerer la liste de cotes
const getAllCotes = async () => {
 try {
   if (selectPromoEnseign !== null && selectCoursEnseign !== null) {
     const result = await obtenirAllCote(selectPromoEnseign, selectCoursEnseign);

     if (!result.ok) {
       console.log('Erreur : PDF non généré ou cotes non trouvées.');
       ToastContairErreur('Erreur lors du téléchargement du PDF');
     } else {
       console.log('✅ PDF téléchargé avec succès.');
       // ToastContairSucces('PDF généré avec succès');
     }
   } else {
     console.log('Veuillez sélectionner une promotion et un cours.');
   }
 } catch (error) {
   console.error('Erreur lors de getAllCotes:', error);
   // ToastContairErreur('Une erreur s\'est produite');
 }
};

const handleGetAllCotes = (e) => {
 if (e) e.preventDefault();

 if (selectPromoEnseign !== null && selectCoursEnseign !== null) {
   getAllCotes();
 } else {
   ToastContairErreur('Veuillez sélectionner une promotion et un cours.');
   console.log('Veuillez sélectionner une promotion et un cours.');
   return
 }
};


 return (
   <div className="notes-container">
     {/* Ligne 1 : infos générales */}
     <div className="card-cote">
      <div className='top-line'>

       <select value={selectPromoEnseign} onChange={(e) => setSelectPromoEnseign(e.target.value)}>
         <option value=''>Selectionner promotion</option>
         {listePromoEnseign!= null && listePromoEnseign.map((p, index) => (
           <option key={index} value={p.nom_promotion}>{p.nom_promotion}</option>
         ))}
       </select>
       <select value={selectCoursEnseign} onChange={(e) => setSelectCoursEnseign(e.target.value)}>
          <option value=''>Selectionner cours</option>
          {listeCoursEnseign!= null && listeCoursEnseign.map((c, index) => (
            <option key={index} value={c.nom_cours}>{c.nom_cours}</option>
          ))}
       </select>
 

       <div className="stat-box">Effectif : <strong>{effectifPromo!= null && effectifPromo.totaleffectif}</strong></div>
       <div className="stat-box">Cotes soumises : <strong>{effectifCote!= null && effectifCote.nb_etudiants}</strong></div>
      </div>

     </div>

     {/* Ligne 2 : saisie des notes */}
     <div className="card-cote">
      <div className='second-line'>
        <select value={selectMatPromo} onChange={(e) => setSelectMatPromo(e.target.value)}>
         <option value="">Sélectionner un matricule</option>
         {listeMatPromo!= null && listeMatPromo.map((m, index) => (
           <option key={index} value={m.matricule}>{m.matricule}</option>
         ))}
       </select>
         <input
            type="text"
            value={cote}
            inputMode="numeric"     // clavier numérique mobile
            pattern="^([0-9]|1[0-9]|20)?$"
            placeholder="Cote (0–20 ou vide)"
            onChange={(e) => {
              const value = e.target.value;

              // Autoriser le vide
              if (value === "") {
                setCote("");
                return;
              }

              // Autoriser uniquement 0 à 20
              const regex = /^([0-9]|1[0-9]|20)$/;
              if (regex.test(value)) {
                setCote(value);
              }
            }}
          />

       <button className="btn-valid" onClick={handleValider} 
       disabled={!selectCoursEnseign || listeMatPromo.length == 0 || !selectMatPromo}>Valider</button>
      </div>

     </div>

     {/* Liste dynamique */}
     <div className="notes-list card-cote">
       {/* <h3>Notes validées</h3> */}
       {notes.length === 0 ? (
         <p className="empty">Aucune note validée</p>
       ) : (
         <table>
           <thead>
             <tr>
               <th>Matricule</th>
               <th>Cote</th>
               <th>Action</th>
             </tr>
           </thead>
           <tbody>
             {notes.map((n, i) => (
               <tr key={i}>
                 <td>{n.matricule}</td>
                 <td>{n.cote}</td>
                 <td>
                   <button className="btn-modifier" onClick={() =>{
                     setEditingIndex(i);
                     setCoteInput(n.cote ?? "");
                     
                   }}>
                     Modifier
                   </button>
                   {editingIndex === i && (
                      <div className="cote-card">
                        <div className="cote-edit">
                          <input
                              type="text"
                              value={coteInput}
                              inputMode="numeric"     // clavier numérique mobile
                              pattern="^([0-9]|1[0-9]|20)?$"
                              placeholder="Cote (0–20 ou vide)"
                              onChange={(e) => {
                                const value = e.target.value;

                                // Autoriser le vide
                                if (value === "") {
                                  setCoteInput("");
                                  return;
                                }

                                // Autoriser uniquement 0 à 20
                                const regex = /^([0-9]|1[0-9]|20)$/;
                                if (regex.test(value)) {
                                  setCoteInput(value);
                                }
                              }}
                            />

                          <button onClick={() => handleModifier(i)}>
                            OK
                          </button>

                          <button onClick={() => setEditingIndex(null)}>
                            Annuler
                          </button>
                        </div>
                      </div>
                      )}
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       )}
       <button className="btn-send btn-valid" onClick={handleEnvoyer}
        disabled={!selectCoursEnseign || listeMatPromo.length !== 0 || notes.length == 0}>Envoyer</button>
     </div>

     {/* Statistiques finales */}
     <div className="bottom-line card-cote">
        <div className='summary-left'> 
            <h4>Statistiques</h4>
            {imageUrl && <img src={imageUrl} alt="Pie Chart" />}
        </div>

        <button className="btn-fiche btn-valid" onClick={handleGetAllCotes}>Générer la fiche</button>
     </div>
   </div>
 );
}

export default SaisirCotes

