// import React, { useState, useEffect } from "react";
// import "./SaisirCotes.css";
// import {
//   getPromotionsEnseignantService,
//   getCoursEnseignantPromotionService,
//   getEtudiantsSessionService,
//   getCoursDettesEnseignantService,
//   getEtudiantsDettesParCoursService,
//   enregistrerCotesService,
//   getFicheCotesService,
//   obtenirStatistiquesCotesCours
// } from './saisirCoteService';
  

// const SaisirCotes = ({id_enseignant, annee}) =>{

// //   const idEnsei = useSelector((state) => state.enseignant.idEnseignant); 
//   const [session, setSession] = useState("");
//   const [sessionId, setSessionId] = useState("");
//   const [listePromoEnseign, setListePromoEnseign] = useState([]) //Prends la liste de promotions/Enseignant
//   const [selectPromoEnseignID, setSelectPromoEnseignID] = useState('') //Prends la promotion séléctionnée
//   const [listeCoursEnseign, setListeCoursEnseign] = useState([]) //Prends la liste de cours/Enseignant
//   const [selectCoursEnseignID, setSelectCoursEnseignID] = useState('') //Prends le cour séléctionné
//   const [listeMatPromo, setListeMatPromo] = useState([]) //Prends la liste de mat/promo
//   const [selectMatPromo, setSelectMatPromo] = useState('') //Prends le mat séléctionné
//   const [effectifPromo, setEffectifPromo] = useState(null) //Prends effectif/promo
//   // const [effectifCote, setEffectifCote] = useState(null) //Prends effectifCote/promo
//   const [cote, setCote] = useState(""); //Prends la cote
//   const [notes, setNotes] = useState([]);
//   const [imageUrl, setImageUrl] = useState(""); //Prends la cote
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [coteInput, setCoteInput] = useState("");
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");
//   const [promoFromMatricule, setPromoFromMatricule] = useState(""); 
//   const [coursIdDettes, setCoursIdDettes] = useState("");

//   const showMessage = (msg, type = "success") => {
//     setMessage(msg);
//     setMessageType(type);

//     setTimeout(() => {
//       setMessage("");
//       setMessageType("");
//     }, 4000);
//   };

  

// // Charge les promotions de l'enseignant selon la session(Normale, Rattrapage )
//   const chargerPromotions = async (typeSession) => {
//     try {
//       if (!id_enseignant) return;

//       setSession(typeSession);

//       setSessionId("");
//       setListeCoursEnseign([]);
//       setSelectPromoEnseignID('');
//       setSelectCoursEnseignID('');
//       setListeMatPromo([]);
//       setNotes([]);


//       const result = await getPromotionsEnseignantService({
//         enseignantId: id_enseignant,
//         typeSession: typeSession
//       });

//       if (!result.success) {
//         console.log("Promotions non trouvées");
//         setListePromoEnseign([]);
//         return;
//       }

//       setListePromoEnseign(result.data);

//     } catch (error) { 
//       console.error("Erreur récupération promotions :", error);
//       setListePromoEnseign([]);
//     }
//   }


// // Charge les cours d'une promotion pour les sessions (Normale et Rattrapage)
// const chargerCours = async (promoId, sessionId) => {

//     try {

//       if (!id_enseignant || !promoId || !sessionId) {
//         setListeCoursEnseign([]);
//         setSelectCoursEnseignID('');
//         return;
//       }

//       const result = await getCoursEnseignantPromotionService({
//         enseignantId: id_enseignant,
//         promotionVersionId: promoId,
//         sessionId
//       });

//       if (!result.success) {
//         setListeCoursEnseign([]);
//         return;
//       }

//       setListeCoursEnseign(result.data);

//       setSelectCoursEnseignID('');
//       setListeMatPromo([]);
//       setSelectMatPromo('');
//       setEffectifPromo(null);

//     } catch (error) {

//       console.error("Erreur récupération cours :", error);
//       setListeCoursEnseign([]);

//     }
//   };


// // Charge les étudiants d'un cours pour les sessions (Normale et Rattrapage)
// useEffect(() => {

//   const chargerEtudiants = async () => {

//     try {

//       if (session === "Dettes") {

//         return;

//       }

//       if (!selectPromoEnseignID || !selectCoursEnseignID || !sessionId) {
//         setListeMatPromo([]);
//         return;
//       }

//       const result = await getEtudiantsSessionService({
//         promotionVersionId: selectPromoEnseignID,
//         coursId: selectCoursEnseignID,
//         sessionId: sessionId
//       });

//       if (!result.success) {
//         setListeMatPromo([]);
//         return;
//       }

//       setListeMatPromo(result.data || []);

//       if (result.effectifTotal !== undefined) {
//         setEffectifPromo(result.effectifTotal);
//       }

//     } catch (error) {

//       console.error(error);
//       setListeMatPromo([]);

//     }

//   };

//   chargerEtudiants();

// }, [selectPromoEnseignID, selectCoursEnseignID, sessionId]);


// //Recuperer les cours et promotions attachés à un enseignant/session dettes
// const chargerSessionDettes = async () => {

//   try {

//     setSession("Dettes");

//     setSessionId("");
//     setListePromoEnseign([]);
//     setSelectPromoEnseignID("");
//     setListeCoursEnseign([]);
//     setSelectCoursEnseignID("");
//     setListeMatPromo([]);
//     setSelectMatPromo("");
//     setNotes([]);
//     setEffectifPromo(null);
//     setImageUrl("");

//     if (!id_enseignant) return;
//     const result =
//       await getCoursDettesEnseignantService({
//         enseignantId: id_enseignant
//       });

//     if (!result.success) {

//       setListeCoursEnseign([]);

//       showMessage(
//         result.message ||
//         "Aucun cours de dettes trouvé.",
//         "error"
//       );

//       return;
//     }

//     setListeCoursEnseign(
//       result.cours || []
//     );

//   } catch (error) {

//     console.error(
//       "Erreur chargement cours dettes :",
//       error
//     );

//     setListeCoursEnseign([]);

//     showMessage(
//       error.message ||
//       "Erreur lors du chargement des cours.",
//       "error"
//     );

//   }

// };


// // Récupérer les situations des étudiants ayant des dettes
// useEffect(() => {

//   const chargerDetteursCours = async () => {

//     try {

//       if (
//         session !== "Dettes" ||
//         !selectCoursEnseignID ||
//         !id_enseignant
//       ) {

//         setListeMatPromo([]);
//         setEffectifPromo(null);

//         return;
//       }

//       const result =
//         await getEtudiantsDettesParCoursService({
//           coursNom: selectCoursEnseignID,
//           enseignantId: id_enseignant,
//           typeSession: "Dettes"
//         });

//       if (!result.success) {

//         setListeMatPromo([]);
//         setEffectifPromo(0);

//         return;
//       }

//       setListeMatPromo(
//         result.data || []
//       );

//       setEffectifPromo(
//         result.total || 0
//       );

//       setSelectMatPromo("");

//     } catch (error) {

//       console.error(
//         "Erreur chargement detteurs :",
//         error
//       );

//       setListeMatPromo([]);
//       setEffectifPromo(0);

//     }

//   };

//   chargerDetteursCours();

// }, [
//   session,
//   selectCoursEnseignID,
//   id_enseignant
// ]);

// // Récupérer ids cours et promotions pour dettes
// const handleSelectMatricule = (matricule) => {
//   setSelectMatPromo(matricule);

//   const etudiant = listeMatPromo.find(
//     (e) => e.matricule === matricule
//   );

//   if (!etudiant) return;

//   // 🔥 récupération automatique de la promotion liée à cet étudiant
//   if (etudiant.promotion_id) {
//     setPromoFromMatricule(etudiant.promotion_id);
//     setSessionId(etudiant.id_session);
//     setCoursIdDettes(etudiant.id_cours);
//   }
// };

// // Charger les statistiques (image générée par FastAPI)
// useEffect(() => {

//   const chargerStatistiques = async () => {

//     try {

//       if (!selectPromoEnseignID || !selectCoursEnseignID || !session || !id_enseignant) {
//         setImageUrl("");
//         return;
//       }

//       const blob = await obtenirStatistiquesCotesCours({
//         promotionVersionId: selectPromoEnseignID,
//         coursId: selectCoursEnseignID,
//         typeSession: session,
//         enseignantId: id_enseignant
//       });

//       if (!blob) return;

//       const url = URL.createObjectURL(blob);

//       setImageUrl(url);

//     } catch (error) {

//       console.error("Erreur statistiques :", error);
//       setImageUrl("");

//     }

//   };

//   chargerStatistiques();

// }, [selectPromoEnseignID, selectCoursEnseignID, session, id_enseignant]);

// //Enregistrer les cotes
// const handleEnvoyerCotes = async () => {
//   if (!notes || notes.length === 0) {
//     showMessage("Aucune cote à envoyer", "error");
//     return;
//   }

//   try {
//     // Appel du service pour enregistrer les cotes
//     const result = await enregistrerCotesService(notes);

//     if (result.success) {
//       showMessage(result.message || "Cote(s) envoyée(s) avec succès", "success");

//       // Réinitialiser la liste des notes et la liste des étudiants pour cette session
//       setNotes([]);
//       setListeMatPromo([]); // tu peux recharger les étudiants si nécessaire
//       const blob = await obtenirStatistiquesCotesCours({
//         promotionVersionId: selectPromoEnseignID,
//         coursId: selectCoursEnseignID,
//         typeSession: session,
//         enseignantId: id_enseignant
//       });

//       if (!blob) return;

//       const url = URL.createObjectURL(blob);

//       setImageUrl(url);
//     } else {
//       showMessage(result.message || "Erreur lors de l'enregistrement", "error");
//     }

//   } catch (error) {
//     console.error(error);
    
//   }
// };

// // Gère la validation et enregistrement de cotes dans une liste
// const handleValider = (e) => {

//       e.preventDefault();
 
//       if (!selectMatPromo) return;

//       // chercher l'étudiant sélectionné
//       const etudiant = listeMatPromo.find(
//         e => e.matricule === selectMatPromo
//       );

//       if (!etudiant) return;

//       const nouvelleNote = {
//         etudiant_id:
//           session === "Dettes"
//               ? etudiant.etudiant_id
//               : etudiant.id_etudiant,
              
//         matricule: etudiant.matricule,
//         cote: cote,
//         cours_id:
//           session === "Dettes"
//               ? coursIdDettes
//               : selectCoursEnseignID,
//         session_id: sessionId
//       };

//       // éviter doublon
//       const existe = notes.some(
//         n => n.etudiant_id === etudiant.id_etudiant
//       );

//       if (existe) return;

//       // ajouter dans la liste des notes
//       setNotes(prev => [...prev, nouvelleNote]);

//       // retirer l'étudiant de la liste à coter
//       setListeMatPromo(prev =>
//         prev.filter(e => e.id_etudiant !== etudiant.id_etudiant)
//       );

//       // reset champs
//       setSelectMatPromo("");
//       setCote("");

//   };
    
      
// // Mdifier la cote
// const handleModifier = (index) => {
//   // Cloner le tableau pour éviter mutation directe
//   const updatedNotes = [...notes];

//   // Si le champ est vide, on remet vide et on sort
//   if (coteInput.trim() === "") {
//     updatedNotes[index].cote = "";
//     setNotes(updatedNotes);
//     setEditingIndex(null);
//     showMessage("Cote supprimée", "success");
//     return; 
//   }

//   // Convertir en nombre
//   const newCote = Number(coteInput);

//   // Vérification
//   if (Number.isNaN(newCote) || newCote < 0 || newCote > 20) {
//     showMessage("Cote invalide (0–20)", "error");
//     return;
//   }

//   // Mise à jour
//   updatedNotes[index].cote = newCote;
//   setNotes(updatedNotes);
//   setEditingIndex(null);
//   showMessage("Cote modifiée avec succès", "success");
// };


//  // Génerer la liste de cotes
// const getFicheCotes = async () => {
//  try {
//    if (selectPromoEnseignID  && selectCoursEnseignID  && session && id_enseignant ) {
    
//      const result = await getFicheCotesService({
//       promotionVersionId : selectPromoEnseignID,
//       coursId : selectCoursEnseignID,
//       typeSession :session,
//       enseignantId :id_enseignant
//      });

//      if (!result.ok) {
//       //  console.log('Erreur : PDF non généré ou cotes non trouvées.');
//        showMessage("PDF non généré ou cotes non trouvées.", "error");
//      } else {
//        console.log('PDF téléchargé avec succès.');
     
//      }
//    } else {
//     //  console.log('Veuillez sélectionner une promotion et un cours.');
//      showMessage("Veuillez sélectionner une promotion et un cours.", "error");
//    }
//  } catch (error) {
//   //  console.error('Erreur lors de getAllCotes:', error);
//    showMessage(error.message, "error");

//  }
// };

//  return (
//     <div className="notes-container">
//       {message && (
//         <div className={`saisir-notification ${messageType}`}>
//           {message}
//         </div>
//       )}
//     <h2>Soumission des notes ({annee})</h2>
//       {/* ================= SESSION ================= */}
//       <div className="card-session">
//         <h3 className="title-session">Sélectionner la session</h3>

//         <div className="options-session">
//           <button
//             className={`btn-session ${session === "Normale" ? "active" : ""}`}
//             onClick={() => chargerPromotions("Normale")}
//           >
//             Session Normale
//           </button>

//           <button
//             className={`btn-session ${session === "Rattrapage" ? "active" : ""}`}
//             onClick={() => chargerPromotions("Rattrapage")}
//           >
//             Session de Rattrapage
//           </button>

//           <button
//             className={`btn-session ${session === "Dettes" ? "active" : ""}`}
//             onClick={chargerSessionDettes}
//           >
//             Session Dettes
//           </button>
//         </div>

//         {!session && (
//           <p className="warning-session">
//             ⚠ Veuillez sélectionner une session avant de continuer.
//           </p>
//         )}
//       </div>

//       {/* ================= CONTENU BLOQUÉ SI PAS DE SESSION ================= */}
//       <div className={!session ? "disabled-area" : ""}>

//         {/* Ligne 1 */}
//         <div className="card-cote">
//           <div className='top-line'>

//             <select
//               value={sessionId}
//               onChange={(e) => {

//                 const value = e.target.value;

//                 const promoSelectionnee = listePromoEnseign.find(
//                   p => String(p.id_session) === String(value)
//                 );

//                 if (!promoSelectionnee) return;

//                 setSessionId(promoSelectionnee.id_session);
//                 setSelectPromoEnseignID(promoSelectionnee.id_version);

//                 chargerCours(
//                   promoSelectionnee.id_version,
//                   promoSelectionnee.id_session
//                 );
//               }} 
//               disabled={!session || session === "Dettes"}
//             >
//               <option value="">Sélectionner une promotion</option>

//               {listePromoEnseign?.map((p) => (
//                 <option
//                   key={p.id_session}
//                   value={p.id_session}
//                 >
//                   {p.nom_promotion} | {p.semestre} | {session}
//                 </option>
//               ))}
//             </select> 

//             <select
//               value={selectCoursEnseignID}
//               onChange={(e)=>setSelectCoursEnseignID(e.target.value)}
//               disabled={!session}
//             >
//               <option value=''>Selectionner cours</option>

//               {listeCoursEnseign != null &&
//                 listeCoursEnseign.map((c) => (
//                   <option
//                     key={
//                       session === "Dettes"
//                         ? `${c.nom_cours}-${c.id_version}`
//                         : c.id_cours
//                     }
//                     value={
//                       session === "Dettes"
//                         ? c.nom_cours
//                         : c.id_cours
//                     }
//                   >
//                     {
//                       session === "Dettes"
//                         ? `${c.nom_cours} (${c.nom_promotion})`
//                         : c.nom_cours
//                     }
//                   </option>
//                 ))
//               }

//             </select>

//             <div className="stat-box">
//               Effectif : <strong>{effectifPromo!= null && effectifPromo}</strong>
//             </div>

//             {/* <div className="stat-box">
//               Cotes soumises : <strong>{effectifCote!= null && effectifCote}</strong>
//             </div> */}

//           </div>
//         </div>

//         {/* Ligne 2 */}
//         <div className="card-cote">
//           <div className='second-line'>

//             <select value={selectMatPromo}
//               // onChange={(e) => setSelectMatPromo(e.target.value)}
//               onChange={(e) => handleSelectMatricule(e.target.value)}
//               disabled={!session}>
//               <option value="">Sélectionner un matricule</option>
//               {listeMatPromo!= null && listeMatPromo.map((m, index) => (
//                 <option key={index} value={m.matricule}>{m.matricule}</option>
//               ))}
//             </select>

//             <input
//               type="text"
//               value={cote}
//               inputMode="numeric"
//               pattern="^([0-9]|1[0-9]|20)?$"
//               placeholder="Cote (0–20 ou vide)"
//               disabled={!session}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 if (value === "") {
//                   setCote("");
//                   return;
//                 }
//                 const regex = /^([0-9]|1[0-9]|20)$/;
//                 if (regex.test(value)) {
//                   setCote(value);
//                 }
//               }}
//             />

//             <button
//               className="btn-valid"
//               onClick={handleValider}
//               disabled={!session || !selectCoursEnseignID || !selectMatPromo}
//             >
//               Valider
//             </button>

//           </div>
//         </div>

//         {/* Liste */}
//         <div className="notes-list card-cote">
//           {notes.length === 0 ? (
//             <p className="empty">Aucune note validée</p>
//           ) : (
//             <table>
//               <thead>
//                 <tr>
//                   <th>Matricule</th>
//                   <th>Cote</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {notes.map((n, i) => (
//                   <tr key={i}>
//                     <td>{n.matricule}</td>
//                     <td>{n.cote === "" ? "-" : n.cote}</td>
//                     <td>
//                       <button className="btn-modifier" onClick={() =>{
//                      setEditingIndex(i);
//                      setCoteInput(n.cote ?? "");
                     
//                    }}>
//                      Modifier
//                    </button>
//                    {editingIndex === i && (
//                       <div className="cote-card">
//                         <div className="cote-edit">
//                           <input
//                               type="text"
//                               value={coteInput}
//                               inputMode="numeric"     // clavier numérique mobile
//                               pattern="^([0-9]|1[0-9]|20)?$"
//                               placeholder="Cote (0–20 ou vide)"
//                               onChange={(e) => {
//                                 const value = e.target.value;

//                                 // Autoriser le vide
//                                 if (value === "") {
//                                   setCoteInput("");
//                                   return;
//                                 }

//                                 // Autoriser uniquement 0 à 20
//                                 const regex = /^([0-9]|1[0-9]|20)$/;
//                                 if (regex.test(value)) {
//                                   setCoteInput(value);
//                                 }
//                               }}
//                             />

//                           <button
//                             className="btn-ok"
//                             onClick={() => handleModifier(i)}
//                           >
//                             OK
//                           </button>

//                           <button
//                             className="btn-cancel"
//                             onClick={() => setEditingIndex(null)}
//                           >
//                             Annuler
//                           </button>
//                         </div>
//                       </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           <button
//             className="btn-send btn-valid"
//             disabled={!session || listeMatPromo.length > 0} // <-- désactivé tant qu'il reste des étudiants
//             onClick={handleEnvoyerCotes}
//           >
//             Envoyer
//           </button>
//           {listeMatPromo.length > 0 && (
//             <p className="warning-session">
//               ⚠ Veuillez saisir les cotes pour tous les étudiants avant d'envoyer.
//             </p>
//           )}
//         </div>

//         {/* Bas */}
//         <div className="bottom-line card-cote">

//           <div className="summary-left">
//             <h4>Statistiques</h4>
//             {imageUrl && <img src={imageUrl} alt="Pie Chart" />}
//           </div>

//           {/* FORMULAIRE DEROGATION */}
//           <div className="derogation-box">
//             <h4>Dérogation administrative</h4>

//             <select>
//               <option value="">Matricule concerné</option>
//               {listeMatPromo && listeMatPromo.map((m, index) => (
//                 <option key={index} value={m.matricule}>
//                   {m.matricule}
//                 </option>
//               ))} 
//             </select>

//             <textarea
//               placeholder="Motif de la dérogation..."
//               rows="3"
//             ></textarea>

//             <button className="btn-derogation">
//               Envoyer la dérogation
//             </button>
//           </div>

//           <button
//             className="btn-fiche btn-valid"
//             disabled={!selectPromoEnseignID && !selectCoursEnseignID && !session && !id_enseignant}
//             onClick={getFicheCotes}
//           >
//             Générer la fiche
//           </button>

//         </div>

//       </div>
//     </div>
//  );
// }

// export default SaisirCotes






// import React, { useState, useEffect } from "react";
// import "./SaisirCotes.css";
// import {
//   getPromotionsEnseignantService,
//   getCoursEnseignantPromotionService,
//   getEtudiantsSessionService,
//   getCoursDettesEnseignantService,
//   getEtudiantsDettesParCoursService,
//   enregistrerCotesService,
//   getFicheCotesService,
//   obtenirStatistiquesCotesCours
// } from "./saisirCoteService";

// const SaisirCotes = ({ id_enseignant, annee }) => {

//   //   const idEnsei = useSelector((state) => state.enseignant.idEnseignant);

//   const [session, setSession] = useState("");
//   const [sessionId, setSessionId] = useState("");

//   const [listePromoEnseign, setListePromoEnseign] = useState([]);
//   const [selectPromoEnseignID, setSelectPromoEnseignID] = useState("");

//   const [listeCoursEnseign, setListeCoursEnseign] = useState([]);
//   const [selectCoursEnseignID, setSelectCoursEnseignID] = useState("");

//   const [listeMatPromo, setListeMatPromo] = useState([]);
//   const [selectMatPromo, setSelectMatPromo] = useState("");

//   const [effectifPromo, setEffectifPromo] = useState(null);

//   const [cote, setCote] = useState("");
//   const [notes, setNotes] = useState([]);

//   const [imageUrl, setImageUrl] = useState("");

//   const [editingIndex, setEditingIndex] = useState(null);
//   const [coteInput, setCoteInput] = useState("");

//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");

//   const [promoFromMatricule, setPromoFromMatricule] = useState("");
//   const [coursIdDettes, setCoursIdDettes] = useState("");

//   // ================= AJOUT DE POINTS =================

//   const [pointsAjouter, setPointsAjouter] = useState("");

//   const showMessage = (msg, type = "success") => {
//     setMessage(msg);
//     setMessageType(type);

//     setTimeout(() => {
//       setMessage("");
//       setMessageType("");
//     }, 4000);
//   };

//   // ================= SESSION =================

//   // Charge les promotions de l'enseignant selon la session
//   const chargerPromotions = async (typeSession) => {
//     try {
//       if (!id_enseignant) return;

//       setSession(typeSession);

//       setSessionId("");
//       setListeCoursEnseign([]);
//       setSelectPromoEnseignID("");
//       setSelectCoursEnseignID("");
//       setListeMatPromo([]);
//       setNotes([]);
//       setPointsAjouter("");

//       const result = await getPromotionsEnseignantService({
//         enseignantId: id_enseignant,
//         typeSession: typeSession
//       });

//       if (!result.success) {
//         console.log("Promotions non trouvées");
//         setListePromoEnseign([]);
//         return;
//       }

//       setListePromoEnseign(result.data);

//     } catch (error) {
//       console.error(
//         "Erreur récupération promotions :",
//         error
//       );

//       setListePromoEnseign([]);
//     }
//   };

//   // ================= COURS =================

//   // Charge les cours d'une promotion
//   const chargerCours = async (promoId, sessionId) => {

//     try {

//       if (!id_enseignant || !promoId || !sessionId) {
//         setListeCoursEnseign([]);
//         setSelectCoursEnseignID("");
//         return;
//       }

//       const result =
//         await getCoursEnseignantPromotionService({
//           enseignantId: id_enseignant,
//           promotionVersionId: promoId,
//           sessionId
//         });

//       if (!result.success) {
//         setListeCoursEnseign([]);
//         return;
//       }

//       setListeCoursEnseign(result.data);

//       setSelectCoursEnseignID("");
//       setListeMatPromo([]);
//       setSelectMatPromo("");
//       setEffectifPromo(null);
//       setPointsAjouter("");

//     } catch (error) {

//       console.error(
//         "Erreur récupération cours :",
//         error
//       );

//       setListeCoursEnseign([]);

//     }
//   };

//   // ================= ETUDIANTS =================

//   useEffect(() => {

//     const chargerEtudiants = async () => {

//       try {

//         if (session === "Dettes") {
//           return;
//         }

//         if (
//           !selectPromoEnseignID ||
//           !selectCoursEnseignID ||
//           !sessionId
//         ) {
//           setListeMatPromo([]);
//           return;
//         }

//         const result =
//           await getEtudiantsSessionService({
//             promotionVersionId:
//               selectPromoEnseignID,
//             coursId:
//               selectCoursEnseignID,
//             sessionId:
//               sessionId
//           });

//         if (!result.success) {
//           setListeMatPromo([]);
//           return;
//         }

//         setListeMatPromo(
//           result.data || []
//         );

//         if (
//           result.effectifTotal !== undefined
//         ) {
//           setEffectifPromo(
//             result.effectifTotal
//           );
//         }

//       } catch (error) {

//         console.error(error);
//         setListeMatPromo([]);

//       }

//     };

//     chargerEtudiants();

//   }, [
//     selectPromoEnseignID,
//     selectCoursEnseignID,
//     sessionId
//   ]);

//   // ================= DETTES =================

//   // Récupérer les cours attachés à un enseignant/session dettes
//   const chargerSessionDettes = async () => {

//     try {

//       setSession("Dettes");

//       setSessionId("");
//       setListePromoEnseign([]);
//       setSelectPromoEnseignID("");

//       setListeCoursEnseign([]);
//       setSelectCoursEnseignID("");

//       setListeMatPromo([]);
//       setSelectMatPromo("");

//       setNotes([]);
//       setEffectifPromo(null);
//       setImageUrl("");
//       setPointsAjouter("");

//       if (!id_enseignant) return;

//       const result =
//         await getCoursDettesEnseignantService({
//           enseignantId: id_enseignant
//         });

//       if (!result.success) {

//         setListeCoursEnseign([]);

//         showMessage(
//           result.message ||
//           "Aucun cours de dettes trouvé.",
//           "error"
//         );

//         return;
//       }

//       setListeCoursEnseign(
//         result.cours || []
//       );

//     } catch (error) {

//       console.error(
//         "Erreur chargement cours dettes :",
//         error
//       );

//       setListeCoursEnseign([]);

//       showMessage(
//         error.message ||
//         "Erreur lors du chargement des cours.",
//         "error"
//       );

//     }

//   };

//   // ================= ETUDIANTS DETTES =================

//   useEffect(() => {

//     const chargerDetteursCours = async () => {

//       try {

//         if (
//           session !== "Dettes" ||
//           !selectCoursEnseignID ||
//           !id_enseignant
//         ) {

//           setListeMatPromo([]);
//           setEffectifPromo(null);

//           return;
//         }

//         const result =
//           await getEtudiantsDettesParCoursService({
//             coursNom:
//               selectCoursEnseignID,
//             enseignantId:
//               id_enseignant,
//             typeSession:
//               "Dettes"
//           });

//         if (!result.success) {

//           setListeMatPromo([]);
//           setEffectifPromo(0);

//           return;
//         }

//         setListeMatPromo(
//           result.data || []
//         );

//         setEffectifPromo(
//           result.total || 0
//         );

//         setSelectMatPromo("");

//       } catch (error) {

//         console.error(
//           "Erreur chargement detteurs :",
//           error
//         );

//         setListeMatPromo([]);
//         setEffectifPromo(0);

//       }

//     };

//     chargerDetteursCours();

//   }, [
//     session,
//     selectCoursEnseignID,
//     id_enseignant
//   ]);

//   // ================= MATRICULE =================

//   const handleSelectMatricule = (matricule) => {

//     setSelectMatPromo(matricule);

//     const etudiant =
//       listeMatPromo.find(
//         (e) =>
//           e.matricule === matricule
//       );

//     if (!etudiant) return;

//     if (etudiant.promotion_id) {
//       setPromoFromMatricule(
//         etudiant.promotion_id
//       );

//       setSessionId(
//         etudiant.id_session
//       );

//       setCoursIdDettes(
//         etudiant.id_cours
//       );
//     }
//   };

//   // ================= STATISTIQUES =================

//   useEffect(() => {

//     const chargerStatistiques = async () => {

//       try {

//         if (
//           !selectPromoEnseignID ||
//           !selectCoursEnseignID ||
//           !session ||
//           !id_enseignant
//         ) {
//           setImageUrl("");
//           return;
//         }

//         const blob =
//           await obtenirStatistiquesCotesCours({
//             promotionVersionId:
//               selectPromoEnseignID,
//             coursId:
//               selectCoursEnseignID,
//             typeSession:
//               session,
//             enseignantId:
//               id_enseignant
//           });

//         if (!blob) return;

//         const url =
//           URL.createObjectURL(blob);

//         setImageUrl(url);

//       } catch (error) {

//         console.error(
//           "Erreur statistiques :",
//           error
//         );

//         setImageUrl("");

//       }

//     };

//     chargerStatistiques();

//   }, [
//     selectPromoEnseignID,
//     selectCoursEnseignID,
//     session,
//     id_enseignant
//   ]);

//   // ================= ENREGISTRER LES COTES =================

//   const handleEnvoyerCotes = async () => {

//     if (!notes || notes.length === 0) {
//       showMessage(
//         "Aucune cote à envoyer",
//         "error"
//       );
//       return;
//     }

//     try {

//       const result =
//         await enregistrerCotesService(
//           notes
//         );

//       if (result.success) {

//         showMessage(
//           result.message ||
//           "Cote(s) envoyée(s) avec succès",
//           "success"
//         );

//         setNotes([]);
//         setListeMatPromo([]);

//         const blob =
//           await obtenirStatistiquesCotesCours({
//             promotionVersionId:
//               selectPromoEnseignID,
//             coursId:
//               selectCoursEnseignID,
//             typeSession:
//               session,
//             enseignantId:
//               id_enseignant
//           });

//         if (!blob) return;

//         const url =
//           URL.createObjectURL(blob);

//         setImageUrl(url);

//       } else {

//         showMessage(
//           result.message ||
//           "Erreur lors de l'enregistrement",
//           "error"
//         );
//       }

//     } catch (error) {

//       console.error(error);

//     }
//   };

//   // ================= VALIDER COTE =================

//   const handleValider = (e) => {

//     e.preventDefault();

//     if (!selectMatPromo) return;

//     const etudiant =
//       listeMatPromo.find(
//         (e) =>
//           e.matricule ===
//           selectMatPromo
//       );

//     if (!etudiant) return;

//     const nouvelleNote = {

//       etudiant_id:
//         session === "Dettes"
//           ? etudiant.etudiant_id
//           : etudiant.id_etudiant,

//       matricule:
//         etudiant.matricule,

//       cote:
//         cote,

//       cours_id:
//         session === "Dettes"
//           ? coursIdDettes
//           : selectCoursEnseignID,

//       session_id:
//         sessionId
//     };

//     const existe =
//       notes.some(
//         (n) =>
//           n.etudiant_id ===
//           etudiant.id_etudiant
//       );

//     if (existe) return;

//     setNotes(
//       (prev) => [
//         ...prev,
//         nouvelleNote
//       ]
//     );

//     setListeMatPromo(
//       (prev) =>
//         prev.filter(
//           (e) =>
//             e.id_etudiant !==
//             etudiant.id_etudiant
//         )
//     );

//     setSelectMatPromo("");
//     setCote("");

//   };

//   // ================= MODIFIER COTE =================

//   const handleModifier = (index) => {

//     const updatedNotes =
//       [...notes];

//     if (
//       coteInput.trim() === ""
//     ) {

//       updatedNotes[index].cote =
//         "";

//       setNotes(updatedNotes);
//       setEditingIndex(null);

//       showMessage(
//         "Cote supprimée",
//         "success"
//       );

//       return;
//     }

//     const newCote =
//       Number(coteInput);

//     if (
//       Number.isNaN(newCote) ||
//       newCote < 0 ||
//       newCote > 20
//     ) {

//       showMessage(
//         "Cote invalide (0–20)",
//         "error"
//       );

//       return;
//     }

//     updatedNotes[index].cote =
//       newCote;

//     setNotes(updatedNotes);
//     setEditingIndex(null);

//     showMessage(
//       "Cote modifiée avec succès",
//       "success"
//     );
//   };

//   // ================= AJOUTER DES POINTS =================

//   const handleAjouterPoints = () => {

//     if (
//       !selectPromoEnseignID ||
//       !selectCoursEnseignID
//     ) {
//       showMessage(
//         "Veuillez sélectionner une promotion et un cours.",
//         "error"
//       );

//       return;
//     }

//     if (!pointsAjouter) {
//       showMessage(
//         "Veuillez sélectionner le nombre de points à ajouter.",
//         "error"
//       );

//       return;
//     }

//     /*
//       Pour le moment, aucune API n'est appelée
//       et aucune cote n'est modifiée.

//       La logique d'application des points
//       sera ajoutée ultérieurement.
//     */

//     showMessage(
//       `${pointsAjouter} point${pointsAjouter > 1 ? "s" : ""} sélectionné${pointsAjouter > 1 ? "s" : ""} pour tous les étudiants.`,
//       "success"
//     );
//   };

//   // ================= FICHE COTES =================

//   const getFicheCotes = async () => {

//     try {

//       if (
//         selectPromoEnseignID &&
//         selectCoursEnseignID &&
//         session &&
//         id_enseignant
//       ) {

//         const result =
//           await getFicheCotesService({

//             promotionVersionId:
//               selectPromoEnseignID,

//             coursId:
//               selectCoursEnseignID,

//             typeSession:
//               session,

//             enseignantId:
//               id_enseignant

//           });

//         if (!result.ok) {

//           showMessage(
//             "PDF non généré ou cotes non trouvées.",
//             "error"
//           );

//         } else {

//           console.log(
//             "PDF téléchargé avec succès."
//           );

//         }

//       } else {

//         showMessage(
//           "Veuillez sélectionner une promotion et un cours.",
//           "error"
//         );

//       }

//     } catch (error) {

//       showMessage(
//         error.message,
//         "error"
//       );

//     }
//   };

//   return (

//     <div className="notes-container">

//       {message && (
//         <div
//           className={`saisir-notification ${messageType}`}
//         >
//           {message}
//         </div>
//       )}

//       <h2>
//         Soumission des notes ({annee})
//       </h2>

//       {/* ================= SESSION ================= */}

//       <div className="card-session">

//         <h3 className="title-session">
//           Sélectionner la session
//         </h3>

//         <div className="options-session">

//           <button
//             className={`btn-session ${
//               session === "Normale"
//                 ? "active"
//                 : ""
//             }`}
//             onClick={() =>
//               chargerPromotions(
//                 "Normale"
//               )
//             }
//           >
//             Session Normale
//           </button>

//           <button
//             className={`btn-session ${
//               session === "Rattrapage"
//                 ? "active"
//                 : ""
//             }`}
//             onClick={() =>
//               chargerPromotions(
//                 "Rattrapage"
//               )
//             }
//           >
//             Session de Rattrapage
//           </button>

//           <button
//             className={`btn-session ${
//               session === "Dettes"
//                 ? "active"
//                 : ""
//             }`}
//             onClick={
//               chargerSessionDettes
//             }
//           >
//             Session Dettes
//           </button>

//         </div>

//         {!session && (
//           <p className="warning-session">
//             ⚠ Veuillez sélectionner une
//             session avant de continuer.
//           </p>
//         )}

//       </div>

//       {/* ================= CONTENU ================= */}

//       <div
//         className={
//           !session
//             ? "disabled-area"
//             : ""
//         }
//       >

//         {/* ================= LIGNE 1 ================= */}

//         <div className="card-cote">

//           <div className="top-line">

//             <select
//               value={sessionId}
//               onChange={(e) => {

//                 const value =
//                   e.target.value;

//                 const promoSelectionnee =
//                   listePromoEnseign.find(
//                     (p) =>
//                       String(
//                         p.id_session
//                       ) ===
//                       String(value)
//                   );

//                 if (
//                   !promoSelectionnee
//                 ) {
//                   return;
//                 }

//                 setSessionId(
//                   promoSelectionnee.id_session
//                 );

//                 setSelectPromoEnseignID(
//                   promoSelectionnee.id_version
//                 );

//                 chargerCours(
//                   promoSelectionnee.id_version,
//                   promoSelectionnee.id_session
//                 );
//               }}
//               disabled={
//                 !session ||
//                 session === "Dettes"
//               }
//             >

//               <option value="">
//                 Sélectionner une promotion
//               </option>

//               {listePromoEnseign?.map(
//                 (p) => (

//                   <option
//                     key={p.id_session}
//                     value={p.id_session}
//                   >
//                     {p.nom_promotion} |
//                     {p.semestre} |
//                     {session}
//                   </option>

//                 )
//               )}

//             </select>

//             <select
//               value={
//                 selectCoursEnseignID
//               }
//               onChange={(e) =>
//                 setSelectCoursEnseignID(
//                   e.target.value
//                 )
//               }
//               disabled={!session}
//             >

//               <option value="">
//                 Selectionner cours
//               </option>

//               {listeCoursEnseign !=
//                 null &&
//                 listeCoursEnseign.map(
//                   (c) => (

//                     <option
//                       key={
//                         session === "Dettes"
//                           ? `${c.nom_cours}-${c.id_version}`
//                           : c.id_cours
//                       }
//                       value={
//                         session === "Dettes"
//                           ? c.nom_cours
//                           : c.id_cours
//                       }
//                     >
//                       {
//                         session === "Dettes"
//                           ? `${c.nom_cours} (${c.nom_promotion})`
//                           : c.nom_cours
//                       }
//                     </option>

//                   )
//                 )}

//             </select>

//             <div className="stat-box">
//               Effectif :{" "}
//               <strong>
//                 {effectifPromo != null &&
//                   effectifPromo}
//               </strong>
//             </div>

//           </div>

//         </div>

//         {/* ================= LIGNE 2 ================= */}

//         <div className="card-cote">

//           <div className="second-line">

//             <select
//               value={
//                 selectMatPromo
//               }
//               onChange={(e) =>
//                 handleSelectMatricule(
//                   e.target.value
//                 )
//               }
//               disabled={!session}
//             >

//               <option value="">
//                 Sélectionner un matricule
//               </option>

//               {listeMatPromo != null &&
//                 listeMatPromo.map(
//                   (m, index) => (

//                     <option
//                       key={index}
//                       value={
//                         m.matricule
//                       }
//                     >
//                       {m.matricule}
//                     </option>

//                   )
//                 )}

//             </select>

//             <input
//               type="text"
//               value={cote}
//               inputMode="numeric"
//               pattern="^([0-9]|1[0-9]|20)?$"
//               placeholder="Cote (0–20 ou vide)"
//               disabled={!session}
//               onChange={(e) => {

//                 const value =
//                   e.target.value;

//                 if (value === "") {
//                   setCote("");
//                   return;
//                 }

//                 const regex =
//                   /^([0-9]|1[0-9]|20)$/;

//                 if (regex.test(value)) {
//                   setCote(value);
//                 }
//               }}
//             />

//             <button
//               className="btn-valid"
//               onClick={
//                 handleValider
//               }
//               disabled={
//                 !session ||
//                 !selectCoursEnseignID ||
//                 !selectMatPromo
//               }
//             >
//               Valider
//             </button>

//           </div>

//         </div>

//         {/* ================= LISTE ================= */}

//         <div className="notes-list card-cote">

//           {notes.length === 0 ? (

//             <p className="empty">
//               Aucune note validée
//             </p>

//           ) : (

//             <table>

//               <thead>

//                 <tr>
//                   <th>Matricule</th>
//                   <th>Cote</th>
//                   <th>Action</th>
//                 </tr>

//               </thead>

//               <tbody>

//                 {notes.map(
//                   (n, i) => (

//                     <tr key={i}>

//                       <td>
//                         {n.matricule}
//                       </td>

//                       <td>
//                         {n.cote === ""
//                           ? "-"
//                           : n.cote}
//                       </td>

//                       <td>

//                         <button
//                           className="btn-modifier"
//                           onClick={() => {

//                             setEditingIndex(i);

//                             setCoteInput(
//                               n.cote ?? ""
//                             );

//                           }}
//                         >
//                           Modifier
//                         </button>

//                         {editingIndex === i && (

//                           <div className="cote-card">

//                             <div className="cote-edit">

//                               <input
//                                 type="text"
//                                 value={
//                                   coteInput
//                                 }
//                                 inputMode="numeric"
//                                 pattern="^([0-9]|1[0-9]|20)?$"
//                                 placeholder="Cote (0–20 ou vide)"
//                                 onChange={(e) => {

//                                   const value =
//                                     e.target.value;

//                                   if (
//                                     value === ""
//                                   ) {

//                                     setCoteInput(
//                                       ""
//                                     );

//                                     return;
//                                   }

//                                   const regex =
//                                     /^([0-9]|1[0-9]|20)$/;

//                                   if (
//                                     regex.test(
//                                       value
//                                     )
//                                   ) {
//                                     setCoteInput(
//                                       value
//                                     );
//                                   }
//                                 }}
//                               />

//                               <button
//                                 className="btn-ok"
//                                 onClick={() =>
//                                   handleModifier(
//                                     i
//                                   )
//                                 }
//                               >
//                                 OK
//                               </button>

//                               <button
//                                 className="btn-cancel"
//                                 onClick={() =>
//                                   setEditingIndex(
//                                     null
//                                   )
//                                 }
//                               >
//                                 Annuler
//                               </button>

//                             </div>

//                           </div>

//                         )}

//                       </td>

//                     </tr>

//                   )
//                 )}

//               </tbody>

//             </table>

//           )}

//           <button
//             className="btn-send btn-valid"
//             disabled={
//               !session ||
//               listeMatPromo.length > 0
//             }
//             onClick={
//               handleEnvoyerCotes
//             }
//           >
//             Envoyer
//           </button>

//           {listeMatPromo.length > 0 && (

//             <p className="warning-session">
//               ⚠ Veuillez saisir les cotes
//               pour tous les étudiants
//               avant d'envoyer.
//             </p>

//           )}

//         </div>

//         {/* ================= BAS ================= */}

//         <div className="bottom-line card-cote">

//           {/* ================= STATISTIQUES ================= */}

//           <div className="summary-left">

//             <h4>
//               Statistiques
//             </h4>

//             {imageUrl && (
//               <img
//                 src={imageUrl}
//                 alt="Pie Chart"
//               />
//             )}

//           </div>

//           {/* ================= AJOUT DE POINTS ================= */}

//           <div className="points-box">

//             <div className="points-box-header">

//               <div>
//                 <h4>
//                   Ajouter des points
//                 </h4>

//                 <p>
//                   Ajouter le même nombre
//                   de points à tous les
//                   étudiants du cours
//                   sélectionné.
//                 </p>
//               </div>

//               <span className="points-badge">
//                 +1 à +5
//               </span>

//             </div>

//             <div className="points-box-form">

//               <label htmlFor="pointsAjouter">
//                 Nombre de points
//               </label>

//               <select
//                 id="pointsAjouter"
//                 value={pointsAjouter}
//                 onChange={(e) =>
//                   setPointsAjouter(
//                     e.target.value
//                   )
//                 }
//                 disabled={
//                   !session ||
//                   !selectPromoEnseignID ||
//                   !selectCoursEnseignID
//                 }
//               >

//                 <option value="">
//                   Sélectionner
//                 </option>

//                 <option value="1">
//                   1 point
//                 </option>

//                 <option value="2">
//                   2 points
//                 </option>

//                 <option value="3">
//                   3 points
//                 </option>

//                 <option value="4">
//                   4 points
//                 </option>

//                 <option value="5">
//                   5 points
//                 </option>

//               </select>

//               <button
//                 type="button"
//                 className="btn-points"
//                 onClick={
//                   handleAjouterPoints
//                 }
//                 disabled={
//                   !session ||
//                   !selectPromoEnseignID ||
//                   !selectCoursEnseignID ||
//                   !pointsAjouter
//                 }
//               >
//                 Ajouter les points
//               </button>

//             </div>

//             {(!selectPromoEnseignID ||
//               !selectCoursEnseignID) && (

//               <p className="points-hint">
//                 Sélectionnez d'abord une
//                 promotion et un cours.
//               </p>

//             )}

//           </div>

//           {/* ================= FICHE ================= */}

//           <button
//             className="btn-fiche btn-valid"
//             disabled={
//               !selectPromoEnseignID &&
//               !selectCoursEnseignID &&
//               !session &&
//               !id_enseignant
//             }
//             onClick={
//               getFicheCotes
//             }
//           >
//             Générer la fiche
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default SaisirCotes;




// import React, { useState, useEffect } from "react";
// import "./SaisirCotes.css";
// import {
//   getPromotionsEnseignantService,
//   getCoursEnseignantPromotionService,
//   getEtudiantsSessionService,
//   getCoursDettesEnseignantService,
//   getEtudiantsDettesParCoursService,
//   enregistrerCotesService,
//   getFicheCotesService,
//   obtenirStatistiquesCotesCours,
//   ajouterPointsToutEtudiantService
// } from "./saisirCoteService";

// const SaisirCotes = ({ id_enseignant, annee }) => {

//   //   const idEnsei = useSelector((state) => state.enseignant.idEnseignant);

//   const [session, setSession] = useState("");
//   const [sessionId, setSessionId] = useState("");

//   const [listePromoEnseign, setListePromoEnseign] = useState([]);
//   const [selectPromoEnseignID, setSelectPromoEnseignID] = useState("");

//   const [listeCoursEnseign, setListeCoursEnseign] = useState([]);
//   const [selectCoursEnseignID, setSelectCoursEnseignID] = useState("");

//   const [listeMatPromo, setListeMatPromo] = useState([]);
//   const [selectMatPromo, setSelectMatPromo] = useState("");

//   const [effectifPromo, setEffectifPromo] = useState(null);

//   const [cote, setCote] = useState("");
//   const [notes, setNotes] = useState([]);

//   const [imageUrl, setImageUrl] = useState("");

//   const [editingIndex, setEditingIndex] = useState(null);
//   const [coteInput, setCoteInput] = useState("");

//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");

//   const [promoFromMatricule, setPromoFromMatricule] = useState("");
//   const [coursIdDettes, setCoursIdDettes] = useState("");

//   // ================= AJOUT DE POINTS =================

//   const [pointsAjouter, setPointsAjouter] = useState("");

//   const showMessage = (msg, type = "success") => {
//     setMessage(msg);
//     setMessageType(type);

//     setTimeout(() => {
//       setMessage("");
//       setMessageType("");
//     }, 4000);
//   };

//   // ================= SESSION =================

//   // Charge les promotions de l'enseignant selon la session
//   const chargerPromotions = async (typeSession) => {
//     try {
//       if (!id_enseignant) return;

//       setSession(typeSession);

//       setSessionId("");
//       setListeCoursEnseign([]);
//       setSelectPromoEnseignID("");
//       setSelectCoursEnseignID("");
//       setListeMatPromo([]);
//       setNotes([]);
//       setPointsAjouter("");

//       const result = await getPromotionsEnseignantService({
//         enseignantId: id_enseignant,
//         typeSession: typeSession
//       });

//       if (!result.success) {
//         console.log("Promotions non trouvées");
//         setListePromoEnseign([]);
//         return;
//       }

//       setListePromoEnseign(result.data);

//     } catch (error) {
//       console.error(
//         "Erreur récupération promotions :",
//         error
//       );

//       setListePromoEnseign([]);
//     }
//   };

//   // ================= COURS =================

//   // Charge les cours d'une promotion
//   const chargerCours = async (promoId, sessionId) => {

//     try {

//       if (!id_enseignant || !promoId || !sessionId) {
//         setListeCoursEnseign([]);
//         setSelectCoursEnseignID("");
//         return;
//       }

//       const result =
//         await getCoursEnseignantPromotionService({
//           enseignantId: id_enseignant,
//           promotionVersionId: promoId,
//           sessionId
//         });

//       if (!result.success) {
//         setListeCoursEnseign([]);
//         return;
//       }

//       setListeCoursEnseign(result.data);

//       setSelectCoursEnseignID("");
//       setListeMatPromo([]);
//       setSelectMatPromo("");
//       setEffectifPromo(null);
//       setPointsAjouter("");

//     } catch (error) {

//       console.error(
//         "Erreur récupération cours :",
//         error
//       );

//       setListeCoursEnseign([]);

//     }
//   };

//   // ================= ETUDIANTS =================

//   useEffect(() => {

//     const chargerEtudiants = async () => {

//       try {

//         if (session === "Dettes") {
//           return;
//         }

//         if (
//           !selectPromoEnseignID ||
//           !selectCoursEnseignID ||
//           !sessionId
//         ) {
//           setListeMatPromo([]);
//           return;
//         }

//         const result =
//           await getEtudiantsSessionService({
//             promotionVersionId:
//               selectPromoEnseignID,
//             coursId:
//               selectCoursEnseignID,
//             sessionId:
//               sessionId
//           });

//         if (!result.success) {
//           setListeMatPromo([]);
//           return;
//         }

//         setListeMatPromo(
//           result.data || []
//         );

//         if (
//           result.effectifTotal !== undefined
//         ) {
//           setEffectifPromo(
//             result.effectifTotal
//           );
//         }

//       } catch (error) {

//         console.error(error);
//         setListeMatPromo([]);

//       }

//     };

//     chargerEtudiants();

//   }, [
//     selectPromoEnseignID,
//     selectCoursEnseignID,
//     sessionId
//   ]);

//   // ================= DETTES =================

//   // Récupérer les cours attachés à un enseignant/session dettes
//   const chargerSessionDettes = async () => {

//     try {

//       setSession("Dettes");

//       setSessionId("");
//       setListePromoEnseign([]);
//       setSelectPromoEnseignID("");

//       setListeCoursEnseign([]);
//       setSelectCoursEnseignID("");

//       setListeMatPromo([]);
//       setSelectMatPromo("");

//       setNotes([]);
//       setEffectifPromo(null);
//       setImageUrl("");
//       setPointsAjouter("");

//       if (!id_enseignant) return;

//       const result =
//         await getCoursDettesEnseignantService({
//           enseignantId: id_enseignant
//         });

//       if (!result.success) {

//         setListeCoursEnseign([]);

//         showMessage(
//           result.message ||
//           "Aucun cours de dettes trouvé.",
//           "error"
//         );

//         return;
//       }

//       setListeCoursEnseign(
//         result.cours || []
//       );

//     } catch (error) {

//       console.error(
//         "Erreur chargement cours dettes :",
//         error
//       );

//       setListeCoursEnseign([]);

//       showMessage(
//         error.message ||
//         "Erreur lors du chargement des cours.",
//         "error"
//       );

//     }

//   };

//   // ================= ETUDIANTS DETTES =================

//   useEffect(() => {

//     const chargerDetteursCours = async () => {

//       try {

//         if (
//           session !== "Dettes" ||
//           !selectCoursEnseignID ||
//           !id_enseignant
//         ) {

//           setListeMatPromo([]);
//           setEffectifPromo(null);

//           return;
//         }

//         const result =
//           await getEtudiantsDettesParCoursService({
//             coursNom:
//               selectCoursEnseignID,
//             enseignantId:
//               id_enseignant,
//             typeSession:
//               "Dettes"
//           });

//         if (!result.success) {

//           setListeMatPromo([]);
//           setEffectifPromo(0);

//           return;
//         }

//         setListeMatPromo(
//           result.data || []
//         );

//         setEffectifPromo(
//           result.total || 0
//         );

//         setSelectMatPromo("");

//       } catch (error) {

//         console.error(
//           "Erreur chargement detteurs :",
//           error
//         );

//         setListeMatPromo([]);
//         setEffectifPromo(0);

//       }

//     };

//     chargerDetteursCours();

//   }, [
//     session,
//     selectCoursEnseignID,
//     id_enseignant
//   ]);

//   // ================= MATRICULE =================

//   const handleSelectMatricule = (matricule) => {

//     setSelectMatPromo(matricule);

//     const etudiant =
//       listeMatPromo.find(
//         (e) =>
//           e.matricule === matricule
//       );

//     if (!etudiant) return;

//     if (etudiant.promotion_id) {
//       setPromoFromMatricule(
//         etudiant.promotion_id
//       );

//       setSessionId(
//         etudiant.id_session
//       );

//       setCoursIdDettes(
//         etudiant.id_cours
//       );
//     }
//   };

//   // ================= STATISTIQUES =================

//   useEffect(() => {

//     const chargerStatistiques = async () => {

//       try {

//         if (
//           !selectPromoEnseignID ||
//           !selectCoursEnseignID ||
//           !session ||
//           !id_enseignant
//         ) {
//           setImageUrl("");
//           return;
//         }

//         const blob =
//           await obtenirStatistiquesCotesCours({
//             promotionVersionId:
//               selectPromoEnseignID,
//             coursId:
//               selectCoursEnseignID,
//             typeSession:
//               session,
//             enseignantId:
//               id_enseignant
//           });

//         if (!blob) return;

//         const url =
//           URL.createObjectURL(blob);

//         setImageUrl(url);

//       } catch (error) {

//         console.error(
//           "Erreur statistiques :",
//           error
//         );

//         setImageUrl("");

//       }

//     };

//     chargerStatistiques();

//   }, [
//     selectPromoEnseignID,
//     selectCoursEnseignID,
//     session,
//     id_enseignant
//   ]);

//   // ================= ENREGISTRER LES COTES =================

//   const handleEnvoyerCotes = async () => {

//     if (!notes || notes.length === 0) {
//       showMessage(
//         "Aucune cote à envoyer",
//         "error"
//       );
//       return;
//     }

//     try {

//       const result =
//         await enregistrerCotesService(
//           notes
//         );

//       if (result.success) {

//         showMessage(
//           result.message ||
//           "Cote(s) envoyée(s) avec succès",
//           "success"
//         );

//         setNotes([]);
//         setListeMatPromo([]);

//         const blob =
//           await obtenirStatistiquesCotesCours({
//             promotionVersionId:
//               selectPromoEnseignID,
//             coursId:
//               selectCoursEnseignID,
//             typeSession:
//               session,
//             enseignantId:
//               id_enseignant
//           });

//         if (!blob) return;

//         const url =
//           URL.createObjectURL(blob);

//         setImageUrl(url);

//       } else {

//         showMessage(
//           result.message ||
//           "Erreur lors de l'enregistrement",
//           "error"
//         );
//       }

//     } catch (error) {

//       console.error(error);

//     }
//   };

//   // ================= VALIDER COTE =================

//   const handleValider = (e) => {

//     e.preventDefault();

//     if (!selectMatPromo) return;

//     const etudiant =
//       listeMatPromo.find(
//         (e) =>
//           e.matricule ===
//           selectMatPromo
//       );

//     if (!etudiant) return;

//     const nouvelleNote = {

//       etudiant_id:
//         session === "Dettes"
//           ? etudiant.etudiant_id
//           : etudiant.id_etudiant,

//       matricule:
//         etudiant.matricule,

//       cote:
//         cote,

//       cours_id:
//         session === "Dettes"
//           ? coursIdDettes
//           : selectCoursEnseignID,

//       session_id:
//         sessionId
//     };

//     const existe =
//       notes.some(
//         (n) =>
//           n.etudiant_id ===
//           etudiant.id_etudiant
//       );

//     if (existe) return;

//     setNotes(
//       (prev) => [
//         ...prev,
//         nouvelleNote
//       ]
//     );

//     setListeMatPromo(
//       (prev) =>
//         prev.filter(
//           (e) =>
//             e.id_etudiant !==
//             etudiant.id_etudiant
//         )
//     );

//     setSelectMatPromo("");
//     setCote("");

//   };

//   // ================= MODIFIER COTE =================

//   const handleModifier = (index) => {

//     const updatedNotes =
//       [...notes];

//     if (
//       coteInput.trim() === ""
//     ) {

//       updatedNotes[index].cote =
//         "";

//       setNotes(updatedNotes);
//       setEditingIndex(null);

//       showMessage(
//         "Cote supprimée",
//         "success"
//       );

//       return;
//     }

//     const newCote =
//       Number(coteInput);

//     if (
//       Number.isNaN(newCote) ||
//       newCote < 0 ||
//       newCote > 20
//     ) {

//       showMessage(
//         "Cote invalide (0–20)",
//         "error"
//       );

//       return;
//     }

//     updatedNotes[index].cote =
//       newCote;

//     setNotes(updatedNotes);
//     setEditingIndex(null);

//     showMessage(
//       "Cote modifiée avec succès",
//       "success"
//     );
//   };

//   // ================= AJOUTER DES POINTS =================

//   const handleAjouterPoints = async () => {

//     if (
//       !selectPromoEnseignID ||
//       !selectCoursEnseignID ||
//       !sessionId
//     ) {
//       showMessage(
//         "Veuillez sélectionner une promotion, un cours et une session.",
//         "error"
//       );

//       return;
//     }

//     if (!pointsAjouter) {
//       showMessage(
//         "Veuillez sélectionner le nombre de points à ajouter.",
//         "error"
//       );

//       return;
//     }

//     try {

//       const result =
//         await ajouterPointsToutEtudiantService({
//           promotionVersionId:
//             selectPromoEnseignID,

//           coursId:
//             selectCoursEnseignID,

//           sessionId:
//             sessionId,

//           points:
//             pointsAjouter
//         });

//       if (!result.success) {

//         showMessage(
//           result.message ||
//           "Erreur lors de l'ajout des points.",
//           "error"
//         );

//         return;
//       }

//       showMessage(
//         result.message ||
//         "Les points ont été ajoutés avec succès.",
//         "success"
//       );

//       // Réinitialiser la sélection des points
//       setPointsAjouter("");

//       // Les notes déjà présentes dans la liste locale
//       // restent intactes. On recharge simplement les
//       // étudiants disponibles pour garder l'affichage
//       // synchronisé avec la base de données.
//       if (
//         selectPromoEnseignID &&
//         selectCoursEnseignID &&
//         sessionId
//       ) {

//         const etudiantsResult =
//           await getEtudiantsSessionService({
//             promotionVersionId:
//               selectPromoEnseignID,

//             coursId:
//               selectCoursEnseignID,

//             sessionId:
//               sessionId
//           });

//         if (etudiantsResult.success) {

//           setListeMatPromo(
//             etudiantsResult.data || []
//           );

//           if (
//             etudiantsResult.effectifTotal !==
//             undefined
//           ) {
//             setEffectifPromo(
//               etudiantsResult.effectifTotal
//             );
//           }

//         }

//       }

//     } catch (error) {

//       console.error(
//         "Erreur ajout points étudiants :",
//         error
//       );

//       showMessage(
//         error.message ||
//         "Erreur serveur lors de l'ajout des points.",
//         "error"
//       );

//     }
//   };

//   // ================= FICHE COTES =================

//   const getFicheCotes = async () => {

//     try {

//       if (
//         selectPromoEnseignID &&
//         selectCoursEnseignID &&
//         session &&
//         id_enseignant
//       ) {

//         const result =
//           await getFicheCotesService({

//             promotionVersionId:
//               selectPromoEnseignID,

//             coursId:
//               selectCoursEnseignID,

//             typeSession:
//               session,

//             enseignantId:
//               id_enseignant

//           });

//         if (!result.ok) {

//           showMessage(
//             "PDF non généré ou cotes non trouvées.",
//             "error"
//           );

//         } else {

//           console.log(
//             "PDF téléchargé avec succès."
//           );

//         }

//       } else {

//         showMessage(
//           "Veuillez sélectionner une promotion et un cours.",
//           "error"
//         );

//       }

//     } catch (error) {

//       showMessage(
//         error.message,
//         "error"
//       );

//     }
//   };

//   return (

//     <div className="notes-container">

//       {message && (
//         <div
//           className={`saisir-notification ${messageType}`}
//         >
//           {message}
//         </div>
//       )}

//       <h2>
//         Soumission des notes ({annee})
//       </h2>

//       {/* ================= SESSION ================= */}

//       <div className="card-session">

//         <h3 className="title-session">
//           Sélectionner la session
//         </h3>

//         <div className="options-session">

//           <button
//             className={`btn-session ${
//               session === "Normale"
//                 ? "active"
//                 : ""
//             }`}
//             onClick={() =>
//               chargerPromotions(
//                 "Normale"
//               )
//             }
//           >
//             Session Normale
//           </button>

//           <button
//             className={`btn-session ${
//               session === "Rattrapage"
//                 ? "active"
//                 : ""
//             }`}
//             onClick={() =>
//               chargerPromotions(
//                 "Rattrapage"
//               )
//             }
//           >
//             Session de Rattrapage
//           </button>

//           <button
//             className={`btn-session ${
//               session === "Dettes"
//                 ? "active"
//                 : ""
//             }`}
//             onClick={
//               chargerSessionDettes
//             }
//           >
//             Session Dettes
//           </button>

//         </div>

//         {!session && (
//           <p className="warning-session">
//             ⚠ Veuillez sélectionner une
//             session avant de continuer.
//           </p>
//         )}

//       </div>

//       {/* ================= CONTENU ================= */}

//       <div
//         className={
//           !session
//             ? "disabled-area"
//             : ""
//         }
//       >

//         {/* ================= LIGNE 1 ================= */}

//         <div className="card-cote">

//           <div className="top-line">

//             <select
//               value={sessionId}
//               onChange={(e) => {

//                 const value =
//                   e.target.value;

//                 const promoSelectionnee =
//                   listePromoEnseign.find(
//                     (p) =>
//                       String(
//                         p.id_session
//                       ) ===
//                       String(value)
//                   );

//                 if (
//                   !promoSelectionnee
//                 ) {
//                   return;
//                 }

//                 setSessionId(
//                   promoSelectionnee.id_session
//                 );

//                 setSelectPromoEnseignID(
//                   promoSelectionnee.id_version
//                 );

//                 chargerCours(
//                   promoSelectionnee.id_version,
//                   promoSelectionnee.id_session
//                 );
//               }}
//               disabled={
//                 !session ||
//                 session === "Dettes"
//               }
//             >

//               <option value="">
//                 Sélectionner une promotion
//               </option>

//               {listePromoEnseign?.map(
//                 (p) => (

//                   <option
//                     key={p.id_session}
//                     value={p.id_session}
//                   >
//                     {p.nom_promotion} |
//                     {p.semestre} |
//                     {session}
//                   </option>

//                 )
//               )}

//             </select>

//             <select
//               value={
//                 selectCoursEnseignID
//               }
//               onChange={(e) =>
//                 setSelectCoursEnseignID(
//                   e.target.value
//                 )
//               }
//               disabled={!session}
//             >

//               <option value="">
//                 Selectionner cours
//               </option>

//               {listeCoursEnseign !=
//                 null &&
//                 listeCoursEnseign.map(
//                   (c) => (

//                     <option
//                       key={
//                         session === "Dettes"
//                           ? `${c.nom_cours}-${c.id_version}`
//                           : c.id_cours
//                       }
//                       value={
//                         session === "Dettes"
//                           ? c.nom_cours
//                           : c.id_cours
//                       }
//                     >
//                       {
//                         session === "Dettes"
//                           ? `${c.nom_cours} (${c.nom_promotion})`
//                           : c.nom_cours
//                       }
//                     </option>

//                   )
//                 )}

//             </select>

//             <div className="stat-box">
//               Effectif :{" "}
//               <strong>
//                 {effectifPromo != null &&
//                   effectifPromo}
//               </strong>
//             </div>

//           </div>

//         </div>

//         {/* ================= LIGNE 2 ================= */}

//         <div className="card-cote">

//           <div className="second-line">

//             <select
//               value={
//                 selectMatPromo
//               }
//               onChange={(e) =>
//                 handleSelectMatricule(
//                   e.target.value
//                 )
//               }
//               disabled={!session}
//             >

//               <option value="">
//                 Sélectionner un matricule
//               </option>

//               {listeMatPromo != null &&
//                 listeMatPromo.map(
//                   (m, index) => (

//                     <option
//                       key={index}
//                       value={
//                         m.matricule
//                       }
//                     >
//                       {m.matricule}
//                     </option>

//                   )
//                 )}

//             </select>

//             <input
//               type="text"
//               value={cote}
//               inputMode="numeric"
//               pattern="^([0-9]|1[0-9]|20)?$"
//               placeholder="Cote (0–20 ou vide)"
//               disabled={!session}
//               onChange={(e) => {

//                 const value =
//                   e.target.value;

//                 if (value === "") {
//                   setCote("");
//                   return;
//                 }

//                 const regex =
//                   /^([0-9]|1[0-9]|20)$/;

//                 if (regex.test(value)) {
//                   setCote(value);
//                 }
//               }}
//             />

//             <button
//               className="btn-valid"
//               onClick={
//                 handleValider
//               }
//               disabled={
//                 !session ||
//                 !selectCoursEnseignID ||
//                 !selectMatPromo
//               }
//             >
//               Valider
//             </button>

//           </div>

//         </div>

//         {/* ================= LISTE ================= */}

//         <div className="notes-list card-cote">

//           {notes.length === 0 ? (

//             <p className="empty">
//               Aucune note validée
//             </p>

//           ) : (

//             <table>

//               <thead>

//                 <tr>
//                   <th>Matricule</th>
//                   <th>Cote</th>
//                   <th>Action</th>
//                 </tr>

//               </thead>

//               <tbody>

//                 {notes.map(
//                   (n, i) => (

//                     <tr key={i}>

//                       <td>
//                         {n.matricule}
//                       </td>

//                       <td>
//                         {n.cote === ""
//                           ? "-"
//                           : n.cote}
//                       </td>

//                       <td>

//                         <button
//                           className="btn-modifier"
//                           onClick={() => {

//                             setEditingIndex(i);

//                             setCoteInput(
//                               n.cote ?? ""
//                             );

//                           }}
//                         >
//                           Modifier
//                         </button>

//                         {editingIndex === i && (

//                           <div className="cote-card">

//                             <div className="cote-edit">

//                               <input
//                                 type="text"
//                                 value={
//                                   coteInput
//                                 }
//                                 inputMode="numeric"
//                                 pattern="^([0-9]|1[0-9]|20)?$"
//                                 placeholder="Cote (0–20 ou vide)"
//                                 onChange={(e) => {

//                                   const value =
//                                     e.target.value;

//                                   if (
//                                     value === ""
//                                   ) {

//                                     setCoteInput(
//                                       ""
//                                     );

//                                     return;
//                                   }

//                                   const regex =
//                                     /^([0-9]|1[0-9]|20)$/;

//                                   if (
//                                     regex.test(
//                                       value
//                                     )
//                                   ) {
//                                     setCoteInput(
//                                       value
//                                     );
//                                   }
//                                 }}
//                               />

//                               <button
//                                 className="btn-ok"
//                                 onClick={() =>
//                                   handleModifier(
//                                     i
//                                   )
//                                 }
//                               >
//                                 OK
//                               </button>

//                               <button
//                                 className="btn-cancel"
//                                 onClick={() =>
//                                   setEditingIndex(
//                                     null
//                                   )
//                                 }
//                               >
//                                 Annuler
//                               </button>

//                             </div>

//                           </div>

//                         )}

//                       </td>

//                     </tr>

//                   )
//                 )}

//               </tbody>

//             </table>

//           )}

//           <button
//             className="btn-send btn-valid"
//             disabled={
//               !session ||
//               listeMatPromo.length > 0
//             }
//             onClick={
//               handleEnvoyerCotes
//             }
//           >
//             Envoyer
//           </button>

//           {listeMatPromo.length > 0 && (

//             <p className="warning-session">
//               ⚠ Veuillez saisir les cotes
//               pour tous les étudiants
//               avant d'envoyer.
//             </p>

//           )}

//         </div>

//         {/* ================= BAS ================= */}

//         <div className="bottom-line card-cote">

//           {/* ================= STATISTIQUES ================= */}

//           <div className="summary-left">

//             <h4>
//               Statistiques
//             </h4>

//             {imageUrl && (
//               <img
//                 src={imageUrl}
//                 alt="Pie Chart"
//               />
//             )}

//           </div>

//           {/* ================= AJOUT DE POINTS ================= */}

//           <div className="points-box">

//             <div className="points-box-header">

//               <div>
//                 <h4>
//                   Ajouter des points
//                 </h4>

//                 <p>
//                   Ajouter le même nombre
//                   de points à tous les
//                   étudiants du cours
//                   sélectionné.
//                 </p>
//               </div>

//               <span className="points-badge">
//                 +1 à +5
//               </span>

//             </div>

//             <div className="points-box-form">

//               <label htmlFor="pointsAjouter">
//                 Nombre de points
//               </label>

//               <select
//                 id="pointsAjouter"
//                 value={pointsAjouter}
//                 onChange={(e) =>
//                   setPointsAjouter(
//                     e.target.value
//                   )
//                 }
//                 disabled={
//                   !session ||
//                   !selectPromoEnseignID ||
//                   !selectCoursEnseignID
//                 }
//               >

//                 <option value="">
//                   Sélectionner
//                 </option>

//                 <option value="1">
//                   1 point
//                 </option>

//                 <option value="2">
//                   2 points
//                 </option>

//                 <option value="3">
//                   3 points
//                 </option>

//                 <option value="4">
//                   4 points
//                 </option>

//                 <option value="5">
//                   5 points
//                 </option>

//               </select>

//               <button
//                 type="button"
//                 className="btn-points"
//                 onClick={
//                   handleAjouterPoints
//                 }
//                 disabled={
//                   !session ||
//                   !selectPromoEnseignID ||
//                   !selectCoursEnseignID ||
//                   !sessionId ||
//                   !pointsAjouter
//                 }
//               >
//                 Ajouter les points
//               </button>

//             </div>

//             {(!selectPromoEnseignID ||
//               !selectCoursEnseignID) && (

//               <p className="points-hint">
//                 Sélectionnez d'abord une
//                 promotion et un cours.
//               </p>

//             )}

//           </div>

//           {/* ================= FICHE ================= */}

//           <button
//             className="btn-fiche btn-valid"
//             disabled={
//               !selectPromoEnseignID &&
//               !selectCoursEnseignID &&
//               !session &&
//               !id_enseignant
//             }
//             onClick={
//               getFicheCotes
//             }
//           >
//             Générer la fiche
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default SaisirCotes;


 


import React, {
  useState,
  useEffect,
  useRef
} from "react";

import "./SaisirCotes.css";

import {
  getPromotionsEnseignantService,
  getCoursEnseignantPromotionService,
  getEtudiantsSessionService,
  getCoursDettesEnseignantService,
  getEtudiantsDettesParCoursService,
  enregistrerCotesService,
  getFicheCotesService,
  obtenirStatistiquesCotesCours,
  ajouterPointsToutEtudiantService
} from "./saisirCoteService";


const SaisirCotes = ({
  id_enseignant,
  annee
}) => {

  //   const idEnsei = useSelector((state) => state.enseignant.idEnseignant);

  const [session, setSession] = useState("");
  const [sessionId, setSessionId] = useState("");

  const [listePromoEnseign, setListePromoEnseign] =
    useState([]);

  const [selectPromoEnseignID, setSelectPromoEnseignID] =
    useState("");

  const [listeCoursEnseign, setListeCoursEnseign] =
    useState([]);

  const [selectCoursEnseignID, setSelectCoursEnseignID] =
    useState("");

  const [listeMatPromo, setListeMatPromo] =
    useState([]);

  const [selectMatPromo, setSelectMatPromo] =
    useState("");

  const [effectifPromo, setEffectifPromo] =
    useState(null);

  const [cote, setCote] =
    useState("");

  const [notes, setNotes] =
    useState([]);

  const [imageUrl, setImageUrl] =
    useState("");

  const [editingIndex, setEditingIndex] =
    useState(null);

  const [coteInput, setCoteInput] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  const [promoFromMatricule, setPromoFromMatricule] =
    useState("");

  const [coursIdDettes, setCoursIdDettes] =
    useState("");

  // ================= AJOUT DE POINTS =================

  const [pointsAjouter, setPointsAjouter] =
    useState("");


  // ==================================================
  // REFERENCES POUR LA TABULATION
  // ==================================================

  const promotionRef =
    useRef(null);

  const coursRef =
    useRef(null);

  const matriculeRef =
    useRef(null);

  const coteRef =
    useRef(null);

  const validerRef =
    useRef(null);

  const envoyerRef =
    useRef(null);


  // ================= FOCUS =================

  const focusElement = (ref) => {

    requestAnimationFrame(() => {

      if (
        ref.current &&
        !ref.current.disabled
      ) {
        ref.current.focus();
      }

    });

  };


  // ================= MESSAGE =================

  const showMessage = (
    msg,
    type = "success"
  ) => {

    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {

      setMessage("");
      setMessageType("");

    }, 4000);
  };


  // ================= SESSION =================

  // Charge les promotions de l'enseignant selon la session
  const chargerPromotions = async (
    typeSession
  ) => {

    try {

      if (!id_enseignant) return;

      setSession(typeSession);

      setSessionId("");

      setListeCoursEnseign([]);

      setSelectPromoEnseignID("");

      setSelectCoursEnseignID("");

      setListeMatPromo([]);

      setNotes([]);

      setPointsAjouter("");

      const result =
        await getPromotionsEnseignantService({
          enseignantId:
            id_enseignant,

          typeSession:
            typeSession
        });

      if (!result.success) {

        console.log(
          "Promotions non trouvées"
        );

        setListePromoEnseign([]);

        return;
      }

      setListePromoEnseign(
        result.data
      );

      // Après sélection de la session,
      // on place le curseur sur la promotion.
      focusElement(
        promotionRef
      );

    } catch (error) {

      console.error(
        "Erreur récupération promotions :",
        error
      );

      setListePromoEnseign([]);

    }

  };


  // ================= COURS =================

  // Charge les cours d'une promotion
  const chargerCours = async (
    promoId,
    sessionId
  ) => {

    try {

      if (
        !id_enseignant ||
        !promoId ||
        !sessionId
      ) {

        setListeCoursEnseign([]);

        setSelectCoursEnseignID("");

        return;
      }

      const result =
        await getCoursEnseignantPromotionService({
          enseignantId:
            id_enseignant,

          promotionVersionId:
            promoId,

          sessionId
        });

      if (!result.success) {

        setListeCoursEnseign([]);

        return;
      }

      setListeCoursEnseign(
        result.data
      );

      setSelectCoursEnseignID("");

      setListeMatPromo([]);

      setSelectMatPromo("");

      setEffectifPromo(null);

      setPointsAjouter("");

      // Promotion sélectionnée :
      // prochaine étape = cours.
      focusElement(
        coursRef
      );

    } catch (error) {

      console.error(
        "Erreur récupération cours :",
        error
      );

      setListeCoursEnseign([]);

    }

  };


  // ================= ETUDIANTS =================

  useEffect(() => {

    const chargerEtudiants =
      async () => {

        try {

          if (
            session === "Dettes"
          ) {
            return;
          }

          if (
            !selectPromoEnseignID ||
            !selectCoursEnseignID ||
            !sessionId
          ) {

            setListeMatPromo([]);

            return;
          }

          const result =
            await getEtudiantsSessionService({
              promotionVersionId:
                selectPromoEnseignID,

              coursId:
                selectCoursEnseignID,

              sessionId:
                sessionId
            });

          if (!result.success) {

            setListeMatPromo([]);

            return;
          }

          setListeMatPromo(
            result.data || []
          );

          if (
            result.effectifTotal !==
            undefined
          ) {

            setEffectifPromo(
              result.effectifTotal
            );

          }

          // Cours sélectionné :
          // prochaine étape = matricule.
          focusElement(
            matriculeRef
          );

        } catch (error) {

          console.error(error);

          setListeMatPromo([]);

        }

      };

    chargerEtudiants();

  }, [
    selectPromoEnseignID,
    selectCoursEnseignID,
    sessionId
  ]);


  // ================= DETTES =================

  // Récupérer les cours attachés à un enseignant/session dettes
  const chargerSessionDettes =
    async () => {

      try {

        setSession("Dettes");

        setSessionId("");

        setListePromoEnseign([]);

        setSelectPromoEnseignID("");

        setListeCoursEnseign([]);

        setSelectCoursEnseignID("");

        setListeMatPromo([]);

        setSelectMatPromo("");

        setNotes([]);

        setEffectifPromo(null);

        setImageUrl("");

        setPointsAjouter("");

        if (!id_enseignant) return;

        const result =
          await getCoursDettesEnseignantService({
            enseignantId:
              id_enseignant
          });

        if (!result.success) {

          setListeCoursEnseign([]);

          showMessage(
            result.message ||
            "Aucun cours de dettes trouvé.",
            "error"
          );

          return;
        }

        setListeCoursEnseign(
          result.cours || []
        );

        // Pour Dettes, il n'y a pas
        // de sélection de promotion.
        // On passe directement aux cours.
        focusElement(
          coursRef
        );

      } catch (error) {

        console.error(
          "Erreur chargement cours dettes :",
          error
        );

        setListeCoursEnseign([]);

        showMessage(
          error.message ||
          "Erreur lors du chargement des cours.",
          "error"
        );

      }

    };


  // ================= ETUDIANTS DETTES =================

  useEffect(() => {

    const chargerDetteursCours =
      async () => {

        try {

          if (
            session !== "Dettes" ||
            !selectCoursEnseignID ||
            !id_enseignant
          ) {

            setListeMatPromo([]);

            setEffectifPromo(null);

            return;
          }

          const result =
            await getEtudiantsDettesParCoursService({
              coursNom:
                selectCoursEnseignID,

              enseignantId:
                id_enseignant,

              typeSession:
                "Dettes"
            });

          if (!result.success) {

            setListeMatPromo([]);

            setEffectifPromo(0);

            return;
          }

          setListeMatPromo(
            result.data || []
          );

          setEffectifPromo(
            result.total || 0
          );

          setSelectMatPromo("");

          // Cours sélectionné :
          // prochaine étape = matricule.
          focusElement(
            matriculeRef
          );

        } catch (error) {

          console.error(
            "Erreur chargement detteurs :",
            error
          );

          setListeMatPromo([]);

          setEffectifPromo(0);

        }

      };

    chargerDetteursCours();

  }, [
    session,
    selectCoursEnseignID,
    id_enseignant
  ]);


  // ================= MATRICULE =================

  const handleSelectMatricule =
    (matricule) => {

      setSelectMatPromo(
        matricule
      );

      const etudiant =
        listeMatPromo.find(
          (e) =>
            e.matricule ===
            matricule
        );

      if (!etudiant) return;

      if (etudiant.promotion_id) {

        setPromoFromMatricule(
          etudiant.promotion_id
        );

        setSessionId(
          etudiant.id_session
        );

        setCoursIdDettes(
          etudiant.id_cours
        );

      }

      // Matricule sélectionné :
      // prochaine étape = cote.
      focusElement(
        coteRef
      );

    };


  // ================= STATISTIQUES =================

  useEffect(() => {

    const chargerStatistiques =
      async () => {

        try {

          if (
            !selectPromoEnseignID ||
            !selectCoursEnseignID ||
            !session ||
            !id_enseignant
          ) {

            setImageUrl("");

            return;
          }

          const blob =
            await obtenirStatistiquesCotesCours({
              promotionVersionId:
                selectPromoEnseignID,

              coursId:
                selectCoursEnseignID,

              typeSession:
                session,

              enseignantId:
                id_enseignant
            });

          if (!blob) return;

          const url =
            URL.createObjectURL(
              blob
            );

          setImageUrl(url);

        } catch (error) {

          console.error(
            "Erreur statistiques :",
            error
          );

          setImageUrl("");

        }

      };

    chargerStatistiques();

  }, [
    selectPromoEnseignID,
    selectCoursEnseignID,
    session,
    id_enseignant
  ]);


  // ================= ENREGISTRER LES COTES =================

  const handleEnvoyerCotes =
    async () => {

      if (
        !notes ||
        notes.length === 0
      ) {

        showMessage(
          "Aucune cote à envoyer",
          "error"
        );

        return;
      }

      try {

        const result =
          await enregistrerCotesService(
            notes
          );

        if (result.success) {

          showMessage(
            result.message ||
            "Cote(s) envoyée(s) avec succès",
            "success"
          );

          setNotes([]);

          setListeMatPromo([]);

          const blob =
            await obtenirStatistiquesCotesCours({
              promotionVersionId:
                selectPromoEnseignID,

              coursId:
                selectCoursEnseignID,

              typeSession:
                session,

              enseignantId:
                id_enseignant
            });

          if (!blob) return;

          const url =
            URL.createObjectURL(
              blob
            );

          setImageUrl(url);

        } else {

          showMessage(
            result.message ||
            "Erreur lors de l'enregistrement",
            "error"
          );

        }

      } catch (error) {

        console.error(error);

      }

    };


  // ================= VALIDER COTE =================

  const handleValider =
    (e) => {

      e.preventDefault();

      if (!selectMatPromo) return;

      const etudiant =
        listeMatPromo.find(
          (e) =>
            e.matricule ===
            selectMatPromo
        );

      if (!etudiant) return;

      const nouvelleNote = {

        etudiant_id:
          session === "Dettes"
            ? etudiant.etudiant_id
            : etudiant.id_etudiant,

        matricule:
          etudiant.matricule,

        cote:
          cote,

        cours_id:
          session === "Dettes"
            ? coursIdDettes
            : selectCoursEnseignID,

        session_id:
          sessionId

      };

      const existe =
        notes.some(
          (n) =>
            n.etudiant_id ===
            etudiant.id_etudiant
        );

      if (existe) return;

      setNotes(
        (prev) => [
          ...prev,
          nouvelleNote
        ]
      );

      const resteMatricules =
        listeMatPromo.filter(
          (e) =>
            e.id_etudiant !==
            etudiant.id_etudiant
        );

      setListeMatPromo(
        resteMatricules
      );

      setSelectMatPromo("");

      setCote("");

      // =================================================
      // PARCOURS CLAVIER
      // =================================================
      //
      // S'il reste des étudiants :
      // retour au matricule.
      //
      // S'il n'en reste plus :
      // passage au bouton Envoyer.
      // =================================================

      if (
        resteMatricules.length > 0
      ) {

        focusElement(
          matriculeRef
        );

      } else {

        focusElement(
          envoyerRef
        );

      }

    };


  // ================= MODIFIER COTE =================

  const handleModifier =
    (index) => {

      const updatedNotes =
        [...notes];

      if (
        coteInput.trim() === ""
      ) {

        updatedNotes[index].cote =
          "";

        setNotes(
          updatedNotes
        );

        setEditingIndex(
          null
        );

        showMessage(
          "Cote supprimée",
          "success"
        );

        return;
      }

      const newCote =
        Number(
          coteInput
        );

      if (
        Number.isNaN(newCote) ||
        newCote < 0 ||
        newCote > 20
      ) {

        showMessage(
          "Cote invalide (0–20)",
          "error"
        );

        return;
      }

      updatedNotes[index].cote =
        newCote;

      setNotes(
        updatedNotes
      );

      setEditingIndex(
        null
      );

      showMessage(
        "Cote modifiée avec succès",
        "success"
      );

    };


  // ================= AJOUTER DES POINTS =================

  const handleAjouterPoints =
    async () => {

      if (
        !selectPromoEnseignID ||
        !selectCoursEnseignID ||
        !sessionId
      ) {

        showMessage(
          "Veuillez sélectionner une promotion, un cours et une session.",
          "error"
        );

        return;
      }

      if (!pointsAjouter) {

        showMessage(
          "Veuillez sélectionner le nombre de points à ajouter.",
          "error"
        );

        return;
      }

      try {

        const result =
          await ajouterPointsToutEtudiantService({
            promotionVersionId:
              selectPromoEnseignID,

            coursId:
              selectCoursEnseignID,

            sessionId:
              sessionId,

            points:
              pointsAjouter
          });

        if (!result.success) {

          showMessage(
            result.message ||
            "Erreur lors de l'ajout des points.",
            "error"
          );

          return;
        }

        showMessage(
          result.message ||
          "Les points ont été ajoutés avec succès.",
          "success"
        );

        // Réinitialiser la sélection des points
        setPointsAjouter("");

        // Les notes déjà présentes dans la liste locale
        // restent intactes. On recharge simplement les
        // étudiants disponibles pour garder l'affichage
        // synchronisé avec la base de données.
        if (
          selectPromoEnseignID &&
          selectCoursEnseignID &&
          sessionId
        ) {

          const etudiantsResult =
            await getEtudiantsSessionService({
              promotionVersionId:
                selectPromoEnseignID,

              coursId:
                selectCoursEnseignID,

              sessionId:
                sessionId
            });

          if (
            etudiantsResult.success
          ) {

            setListeMatPromo(
              etudiantsResult.data ||
              []
            );

            if (
              etudiantsResult.effectifTotal !==
              undefined
            ) {

              setEffectifPromo(
                etudiantsResult.effectifTotal
              );

            }

          }

        }

      } catch (error) {

        console.error(
          "Erreur ajout points étudiants :",
          error
        );

        showMessage(
          error.message ||
          "Erreur serveur lors de l'ajout des points.",
          "error"
        );

      }

    };


  // ================= FICHE COTES =================

  const getFicheCotes =
    async () => {

      try {

        if (
          selectPromoEnseignID &&
          selectCoursEnseignID &&
          session &&
          id_enseignant
        ) {

          const result =
            await getFicheCotesService({

              promotionVersionId:
                selectPromoEnseignID,

              coursId:
                selectCoursEnseignID,

              typeSession:
                session,

              enseignantId:
                id_enseignant

            });

          if (!result.ok) {

            showMessage(
              "PDF non généré ou cotes non trouvées.",
              "error"
            );

          } else {

            console.log(
              "PDF téléchargé avec succès."
            );

          }

        } else {

          showMessage(
            "Veuillez sélectionner une promotion et un cours.",
            "error"
          );

        }

      } catch (error) {

        showMessage(
          error.message,
          "error"
        );

      }

    };


  return (

    <div className="notes-container">

      {message && (

        <div
          className={`saisir-notification ${messageType}`}
        >
          {message}
        </div>

      )}

      <h2>
        Soumission des notes ({annee})
      </h2>


      {/* ================= SESSION ================= */}

      <div className="card-session">

        <h3 className="title-session">
          Sélectionner la session
        </h3>

        <div className="options-session">

          <button
            className={`btn-session ${
              session === "Normale"
                ? "active"
                : ""
            }`}
            onClick={() =>
              chargerPromotions(
                "Normale"
              )
            }
          >
            Session Normale
          </button>


          <button
            className={`btn-session ${
              session === "Rattrapage"
                ? "active"
                : ""
            }`}
            onClick={() =>
              chargerPromotions(
                "Rattrapage"
              )
            }
          >
            Session de Rattrapage
          </button>


          <button
            className={`btn-session ${
              session === "Dettes"
                ? "active"
                : ""
            }`}
            onClick={
              chargerSessionDettes
            }
          >
            Session Dettes
          </button>

        </div>


        {!session && (

          <p className="warning-session">
            ⚠ Veuillez sélectionner une
            session avant de continuer.
          </p>

        )}

      </div>


      {/* ================= CONTENU ================= */}

      <div
        className={
          !session
            ? "disabled-area"
            : ""
        }
      >


        {/* ================= LIGNE 1 ================= */}

        <div className="card-cote">

          <div className="top-line">


            <select
              ref={
                promotionRef
              }
              value={
                sessionId
              }
              onChange={(e) => {

                const value =
                  e.target.value;

                const promoSelectionnee =
                  listePromoEnseign.find(
                    (p) =>
                      String(
                        p.id_session
                      ) ===
                      String(value)
                  );

                if (
                  !promoSelectionnee
                ) {
                  return;
                }

                setSessionId(
                  promoSelectionnee.id_session
                );

                setSelectPromoEnseignID(
                  promoSelectionnee.id_version
                );

                chargerCours(
                  promoSelectionnee.id_version,
                  promoSelectionnee.id_session
                );

              }}
              disabled={
                !session ||
                session === "Dettes"
              }
            >

              <option value="">
                Sélectionner une promotion
              </option>

              {listePromoEnseign?.map(
                (p) => (

                  <option
                    key={
                      p.id_session
                    }
                    value={
                      p.id_session
                    }
                  >
                    {
                      p.nom_promotion
                    }
                    |
                    {
                      p.semestre
                    }
                    |
                    {
                      session
                    }
                  </option>

                )
              )}

            </select>


            <select
              ref={
                coursRef
              }
              value={
                selectCoursEnseignID
              }
              onChange={(e) => {

                setSelectCoursEnseignID(
                  e.target.value
                );

              }}
              disabled={
                !session
              }
            >

              <option value="">
                Selectionner cours
              </option>

              {listeCoursEnseign !=
                null &&
                listeCoursEnseign.map(
                  (c) => (

                    <option
                      key={
                        session === "Dettes"
                          ? `${c.nom_cours}-${c.id_version}`
                          : c.id_cours
                      }
                      value={
                        session === "Dettes"
                          ? c.nom_cours
                          : c.id_cours
                      }
                    >
                      {
                        session === "Dettes"
                          ? `${c.nom_cours} (${c.nom_promotion})`
                          : c.nom_cours
                      }
                    </option>

                  )
                )}

            </select>


            <div className="stat-box">
              Effectif :{" "}
              <strong>
                {
                  effectifPromo != null &&
                  effectifPromo
                }
              </strong>
            </div>

          </div>

        </div>


        {/* ================= LIGNE 2 ================= */}

        <div className="card-cote">

          <div className="second-line">


            <select
              ref={
                matriculeRef
              }
              value={
                selectMatPromo
              }
              onChange={(e) =>
                handleSelectMatricule(
                  e.target.value
                )
              }
              disabled={
                !session
              }
            >

              <option value="">
                Sélectionner un matricule
              </option>

              {listeMatPromo != null &&
                listeMatPromo.map(
                  (m, index) => (

                    <option
                      key={
                        index
                      }
                      value={
                        m.matricule
                      }
                    >
                      {
                        m.matricule
                      }
                    </option>

                  )
                )}

            </select>


            <input
              ref={
                coteRef
              }
              type="text"
              value={
                cote
              }
              inputMode="numeric"
              pattern="^([0-9]|1[0-9]|20)?$"
              placeholder="Cote (0–20 ou vide)"
              disabled={
                !session
              }
              onChange={(e) => {

                const value =
                  e.target.value;

                if (
                  value === ""
                ) {

                  setCote("");

                  return;
                }

                const regex =
                  /^([0-9]|1[0-9]|20)$/;

                if (
                  regex.test(
                    value
                  )
                ) {

                  setCote(
                    value
                  );

                }

              }}
            />


            <button
              ref={
                validerRef
              }
              className="btn-valid"
              onClick={
                handleValider
              }
              disabled={
                !session ||
                !selectCoursEnseignID ||
                !selectMatPromo
              }
            >
              Valider
            </button>

          </div>

        </div>


        {/* ================= LISTE ================= */}

        <div className="notes-list card-cote">

          {notes.length === 0 ? (

            <p className="empty">
              Aucune note validée
            </p>

          ) : (

            <table>

              <thead>

                <tr>

                  <th>
                    Matricule
                  </th>

                  <th>
                    Cote
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {notes.map(
                  (n, i) => (

                    <tr
                      key={
                        i
                      }
                    >

                      <td>
                        {
                          n.matricule
                        }
                      </td>


                      <td>
                        {
                          n.cote === ""
                            ? "-"
                            : n.cote
                        }
                      </td>


                      <td>

                        <button
                          className="btn-modifier"
                          onClick={() => {

                            setEditingIndex(
                              i
                            );

                            setCoteInput(
                              n.cote ?? ""
                            );

                          }}
                        >
                          Modifier
                        </button>


                        {editingIndex === i && (

                          <div className="cote-card">

                            <div className="cote-edit">


                              <input
                                type="text"
                                value={
                                  coteInput
                                }
                                inputMode="numeric"
                                pattern="^([0-9]|1[0-9]|20)?$"
                                placeholder="Cote (0–20 ou vide)"
                                onChange={(e) => {

                                  const value =
                                    e.target.value;

                                  if (
                                    value === ""
                                  ) {

                                    setCoteInput(
                                      ""
                                    );

                                    return;
                                  }

                                  const regex =
                                    /^([0-9]|1[0-9]|20)$/;

                                  if (
                                    regex.test(
                                      value
                                    )
                                  ) {

                                    setCoteInput(
                                      value
                                    );

                                  }

                                }}
                              />


                              <button
                                className="btn-ok"
                                onClick={() =>
                                  handleModifier(
                                    i
                                  )
                                }
                              >
                                OK
                              </button>


                              <button
                                className="btn-cancel"
                                onClick={() =>
                                  setEditingIndex(
                                    null
                                  )
                                }
                              >
                                Annuler
                              </button>

                            </div>

                          </div>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}


          <button
            ref={
              envoyerRef
            }
            className="btn-send btn-valid"
            disabled={
              !session ||
              listeMatPromo.length > 0
            }
            onClick={
              handleEnvoyerCotes
            }
          >
            Envoyer
          </button>


          {listeMatPromo.length > 0 && (

            <p className="warning-session">
              ⚠ Veuillez saisir les cotes
              pour tous les étudiants
              avant d'envoyer.
            </p>

          )}

        </div>


        {/* ================= BAS ================= */}

        <div className="bottom-line card-cote">


          {/* ================= STATISTIQUES ================= */}

          <div className="summary-left">

            <h4>
              Statistiques
            </h4>

            {imageUrl && (

              <img
                src={
                  imageUrl
                }
                alt="Pie Chart"
              />

            )}

          </div>


          {/* ================= AJOUT DE POINTS ================= */}

          <div className="points-box">

            <div className="points-box-header">

              <div>

                <h4>
                  Ajouter des points
                </h4>

                <p>
                  Ajouter le même nombre
                  de points à tous les
                  étudiants du cours
                  sélectionné.
                </p>

              </div>


              <span className="points-badge">
                +1 à +5
              </span>

            </div>


            <div className="points-box-form">

              <label
                htmlFor="pointsAjouter"
              >
                Nombre de points
              </label>


              <select
                id="pointsAjouter"
                value={
                  pointsAjouter
                }
                onChange={(e) =>
                  setPointsAjouter(
                    e.target.value
                  )
                }
                disabled={
                  !session ||
                  !selectPromoEnseignID ||
                  !selectCoursEnseignID
                }
              >

                <option value="">
                  Sélectionner
                </option>

                <option value="1">
                  1 point
                </option>

                <option value="2">
                  2 points
                </option>

                <option value="3">
                  3 points
                </option>

                <option value="4">
                  4 points
                </option>

                <option value="5">
                  5 points
                </option>

              </select>


              <button
                type="button"
                className="btn-points"
                onClick={
                  handleAjouterPoints
                }
                disabled={
                  !session ||
                  !selectPromoEnseignID ||
                  !selectCoursEnseignID ||
                  !sessionId ||
                  !pointsAjouter
                }
              >
                Ajouter les points
              </button>

            </div>


            {(
              !selectPromoEnseignID ||
              !selectCoursEnseignID
            ) && (

              <p className="points-hint">
                Sélectionnez d'abord une
                promotion et un cours.
              </p>

            )}

          </div>


          {/* ================= FICHE ================= */}

          <button
            className="btn-fiche btn-valid"
            disabled={
              !selectPromoEnseignID &&
              !selectCoursEnseignID &&
              !session &&
              !id_enseignant
            }
            onClick={
              getFicheCotes
            }
          >
            Générer la fiche
          </button>

        </div>

      </div>

    </div>

  );

};


export default SaisirCotes;
