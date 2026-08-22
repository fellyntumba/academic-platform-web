// import React, { useEffect, useState } from "react";
// import "./FixationFraisAcademiques.css";

// import {
//   getPromotionsService,
// } from "./fixationFraisService";

// const FixationFraisAcademiques = ({ code_mention }) => {
//   /*
//    * ============================================================
//    * ÉTAT PRINCIPAL
//    * ============================================================
//    */
 
//   const [mode, setMode] = useState("fixer");
 
//   /* 
//    * ============================================================
//    * DONNÉES TEMPORAIRES
//    *
//    * Pour le moment, elles sont simulées.
//    * Elles seront remplacées par les données du backend.
//    * ============================================================
//    */
//   const [promotions, setPromotions] = useState([]);
//   const [loadingPromotions, setLoadingPromotions] = useState(false);

//     /*
//    * ============================================================
//    * FORMULAIRE FIXATION
//    * ============================================================
//    */

//   const [promotionFixer, setPromotionFixer] = useState("");
//   const [promotionID, setPromotionID] = useState("");
//   const [motifFixer, setMotifFixer] = useState("");
//   const [montantFixer, setMontantFixer] = useState("");

//   /*
//    * ============================================================
//    * FORMULAIRE MODIFICATION
//    * ============================================================
//    */

//   const [promotionModifier, setPromotionModifier] = useState("");
//   const [motifModifier, setMotifModifier] = useState("");
//   const [montantModifier, setMontantModifier] = useState("");

//   /*
//    * ============================================================
//    * FORMULAIRE SUPPRESSION
//    * ============================================================
//    */

//   const [promotionSupprimer, setPromotionSupprimer] = useState("");
//   const [fixationSupprimer, setFixationSupprimer] = useState("");


//   // Charger les promotions 
//   useEffect(() => {
//     if (mode !== "fixer") {
//       return;
//     }

//     if (!code_mention) {
//       setPromotions([]);
//       return;
//     }

//     const loadPromotions = async () => {
//       try {
//         setLoadingPromotions(true);

//         const promoData = await getPromotionsService({
//           code_mention,
//         });

//         const promos = promoData?.data || promoData || [];

//         setPromotions(Array.isArray(promos) ? promos : []);

//       } catch (error) {
//         console.error(
//           "Erreur chargement promotions :",
//           error
//         );

//         setPromotions([]);

//       } finally {
//         setLoadingPromotions(false);
//       }
//     };

//     loadPromotions();

//   }, [mode, code_mention]);
//   /*
//    * Fixations existantes.
//    *
//    * Ces données sont uniquement destinées à construire
//    * l'interface pour le moment.
//    */
//   const [fixations, setFixations] = useState([
//     {
//       id: 1,
//       promotionId: 1,
//       motif: "Frais académiques",
//       montant: 500000,
//       annee: "2026-2027",
//     },
//     {
//       id: 2,
//       promotionId: 1,
//       motif: "Frais d'enrôlement",
//       montant: 25000,
//       annee: "2026-2027",
//     },
//     {
//       id: 3,
//       promotionId: 2,
//       motif: "Frais académiques",
//       montant: 500000,
//       annee: "2026-2027",
//     },
//   ]);


//   /*
//    * ============================================================
//    * UTILITAIRES
//    * ============================================================
//    */

//   const getPromotion = (promotionId) => {
//     return promotions.find(
//       (promotion) => promotion.id === Number(promotionId)
//     );
//   };

//   const formatMontant = (montant) => {
//     if (montant === "" || montant === null || montant === undefined) {
//       return "";
//     }

//     return new Intl.NumberFormat("fr-FR").format(Number(montant));
//   };

//   /*
//    * ============================================================
//    * CHANGEMENT DE MODE
//    * ============================================================
//    */

//   const handleModeChange = (nouveauMode) => {
//     setMode(nouveauMode);

//     /*
//      * Réinitialiser les sélections du mode précédent.
//      */
//     if (nouveauMode === "fixer") {
//       setPromotionID("");
//       setMotifFixer("");
//       setMontantFixer("");
//     }

//     if (nouveauMode === "modifier") {
//       setPromotionModifier("");
//       setMotifModifier("");
//       setMontantModifier("");
//     }

//     if (nouveauMode === "supprimer") {
//       setPromotionSupprimer("");
//       setFixationSupprimer("");
//     }
//   };

//   /*
//    * ============================================================
//    * MODE FIXER
//    * ============================================================
//    */

//   const handleFixer = (event) => {
//     event.preventDefault();

//     if (!promotionFixer || !motifFixer || !montantFixer) {
//       alert("Veuillez compléter tous les champs.");
//       return;
//     }

//     const nouvelleFixation = {
//       id: Date.now(),
//       promotionId: Number(promotionFixer),
//       motif: motifFixer.trim(),
//       montant: Number(montantFixer),
//       annee: "2026-2027",
//     };

//     setFixations((ancienneListe) => [
//       ...ancienneListe,
//       nouvelleFixation,
//     ]);

//     setPromotionID("");

//     setMotifFixer("");
//     setMontantFixer("");

//     alert("La fixation des frais a été enregistrée.");
//   };

//   /*
//    * ============================================================
//    * INITIALISER DEPUIS L'ANNÉE PRÉCÉDENTE
//    * ============================================================
//    */

//   const handleInitialiser = () => {
//     /*
//      * Pour le moment :
//      * aucune logique backend.
//      *
//      * Plus tard cette fonction appellera le backend
//      * pour récupérer les fixations de l'année précédente.
//      */

//     alert(
//       "L'initialisation depuis l'année précédente sera connectée au backend."
//     );
//   };

//   /*
//    * ============================================================
//    * MODE MODIFIER
//    * ============================================================
//    */

//   const handlePromotionModifier = (event) => {
//     const promotionId = event.target.value;

//     setPromotionModifier(promotionId);
//     setMotifModifier("");
//     setMontantModifier("");
//   };

//   const fixationsPromotionModifier = fixations.filter(
//     (fixation) =>
//       fixation.promotionId === Number(promotionModifier)
//   );

//   const handleFixationModifier = (event) => {
//     const fixationId = event.target.value;

//     setFixationSupprimer(fixationId);

//     const fixation = fixations.find(
//       (item) => item.id === Number(fixationId)
//     );

//     if (!fixation) {
//       return;
//     }

//     setMotifModifier(fixation.motif);
//     setMontantModifier(String(fixation.montant));
//   };

//   const handleModifier = (event) => {
//     event.preventDefault();

//     if (
//       !promotionModifier ||
//       !motifModifier ||
//       !montantModifier
//     ) {
//       alert("Veuillez compléter tous les champs.");
//       return;
//     }

//     /*
//      * Pour cette version front-end,
//      * on simule la modification localement.
//      */

//     setFixations((ancienneListe) =>
//       ancienneListe.map((fixation) => {
//         if (fixation.id !== Number(fixationSupprimer)) {
//           return fixation;
//         }

//         return {
//           ...fixation,
//           motif: motifModifier.trim(),
//           montant: Number(montantModifier),
//         };
//       })
//     );

//     setPromotionModifier("");
//     setFixationSupprimer("");
//     setMotifModifier("");
//     setMontantModifier("");

//     alert("La fixation a été modifiée.");
//   };

//   /*
//    * ============================================================
//    * MODE SUPPRIMER
//    * ============================================================
//    */

//   const fixationsPromotionSuppression = fixations.filter(
//     (fixation) =>
//       fixation.promotionId === Number(promotionSupprimer)
//   );

//   const handleSupprimer = () => {
//     if (!promotionSupprimer || !fixationSupprimer) {
//       alert("Veuillez sélectionner une fixation à supprimer.");
//       return;
//     }

//     const fixation = fixations.find(
//       (item) => item.id === Number(fixationSupprimer)
//     );

//     if (!fixation) {
//       alert("Fixation introuvable.");
//       return;
//     }

//     const confirmation = window.confirm(
//       `Voulez-vous réellement supprimer "${fixation.motif}" pour cette promotion ?`
//     );

//     if (!confirmation) {
//       return;
//     }

//     setFixations((ancienneListe) =>
//       ancienneListe.filter(
//         (item) => item.id !== Number(fixationSupprimer)
//       )
//     );

//     setPromotionSupprimer("");
//     setFixationSupprimer("");

//     alert("La fixation a été supprimée.");
//   };

//   /*
//    * ============================================================
//    * RENDU
//    * ============================================================
//    */

//   return (
//     <section className="fixation-frais-container">

//       {/* ======================================================
//           EN-TÊTE
//       ====================================================== */}

//       <div className="fixation-header">

//         <div>
//           <span className="fixation-eyebrow">
//             Gestion financière
//           </span>

//           <h2>
//             Fixation des frais académiques
//           </h2>

//           <p>
//             Définissez, modifiez et gérez les frais applicables
//             aux différentes promotions.
//           </p>
//         </div>

//         <div className="academic-year-badge">
//           <span>Année académique</span>
//           <strong>2026 — 2027</strong>
//         </div>

//       </div>


//       {/* ======================================================
//           BARRE DES MODES
//       ====================================================== */}

//       <div className="fixation-mode-card">

//         <button
//           type="button"
//           className={`mode-button ${
//             mode === "fixer" ? "active" : ""
//           }`}
//           onClick={() => handleModeChange("fixer")}
//         >
//           <span className="mode-icon">＋</span>

//           <span>
//             <strong>Fixer</strong>
//             <small>Nouvelle fixation</small>
//           </span>
//         </button>


//         <button
//           type="button"
//           className={`mode-button ${
//             mode === "modifier" ? "active" : ""
//           }`}
//           onClick={() => handleModeChange("modifier")}
//         >
//           <span className="mode-icon">✎</span>

//           <span>
//             <strong>Modifier</strong>
//             <small>Modifier une fixation</small>
//           </span>
//         </button>


//         <button
//           type="button"
//           className={`mode-button ${
//             mode === "supprimer" ? "active danger" : ""
//           }`}
//           onClick={() => handleModeChange("supprimer")}
//         >
//           <span className="mode-icon">⌫</span>

//           <span>
//             <strong>Supprimer</strong>
//             <small>Supprimer une fixation</small>
//           </span>
//         </button>

//       </div>


//       {/* ======================================================
//           CONTENU
//       ====================================================== */}

//       <div className="fixation-content-card">

//         {/* ====================================================
//             MODE FIXER
//         ==================================================== */}

//         {mode === "fixer" && (

//           <form
//             className="fixation-form"
//             onSubmit={handleFixer}
//           >

//             <div className="form-section-heading">

//               <div className="section-icon blue">
//                 ＋
//               </div>

//               <div>
//                 <h3>
//                   Nouvelle fixation
//                 </h3>

//                 <p>
//                   Définissez les frais applicables à une
//                   promotion.
//                 </p>
//               </div>

//             </div>


//             <div className="form-grid three-columns">

//               <div className="form-group">

//                 <label htmlFor="promotion-fixer">
//                   Promotion
//                 </label>

//                 <select
//                   id="promotion-fixer"
//                   value={promotionID}
//                   onChange={(e) => setPromotionID(e.target.value)}
                 
//                   disabled={loadingPromotions}
//                 >
//                   <option value="">
//                     {loadingPromotions
//                       ? "Chargement des promotions..."
//                       : "Sélectionner une promotion"}
//                   </option>

//                   {!loadingPromotions &&
//                     promotions.map((promotion) => (
//                       <option
//                         key={promotion.id_version}
//                         value={promotion.id_version}
//                       >
//                         {promotion.code_promotion
//                           ? `${promotion.code_promotion} — `
//                           : ""}
//                         {promotion.nom_promotion}
//                       </option>
//                     ))}
//                 </select>

//               </div>


//               <div className="form-group">

//                 <label htmlFor="motif-fixer">
//                   Motif
//                 </label>

//                 <input
//                   id="motif-fixer"
//                   type="text"
//                   value={motifFixer}
//                   onChange={(event) =>
//                     setMotifFixer(event.target.value)
//                   }
//                   placeholder="Ex. Frais académiques"
//                 />

//               </div>


//               <div className="form-group">

//                 <label htmlFor="montant-fixer">
//                   Montant
//                 </label>

//                 <div className="amount-input">

//                   <input
//                     id="montant-fixer"
//                     type="number"
//                     min="0"
//                     step="1"
//                     value={montantFixer}
//                     onChange={(event) =>
//                       setMontantFixer(event.target.value)
//                     }
//                     placeholder="0"
//                   />

//                   <span>
//                     FC
//                   </span>

//                 </div>

//               </div>

//             </div>


//             <div className="form-preview">

//               <div>
//                 <span>Promotion</span>

//                 <strong>
//                   {promotionFixer
//                     ? getPromotion(promotionFixer)?.nom
//                     : "—"}
//                 </strong>
//               </div>


//               <div>
//                 <span>Motif</span>

//                 <strong>
//                   {motifFixer || "—"}
//                 </strong>
//               </div>


//               <div>
//                 <span>Montant</span>

//                 <strong className="preview-amount">
//                   {montantFixer
//                     ? `${formatMontant(montantFixer)} FC`
//                     : "—"}
//                 </strong>
//               </div>

//             </div>


//             <div className="form-actions">

//               <button
//                 type="button"
//                 className="secondary-button"
//                 onClick={handleInitialiser}
//               >
//                 <span>↻</span>
//                 Initialiser l'année précédente
//               </button>

//               <button
//                 type="submit"
//                 className="primary-button"
//               >
//                 <span>✓</span>
//                 Valider la fixation
//               </button>

//             </div>

//           </form>

//         )}


//         {/* ====================================================
//             MODE MODIFIER
//         ==================================================== */}

//         {mode === "modifier" && (

//           <form
//             className="fixation-form"
//             onSubmit={handleModifier}
//           >

//             <div className="form-section-heading">

//               <div className="section-icon orange">
//                 ✎
//               </div>

//               <div>
//                 <h3>
//                   Modifier une fixation
//                 </h3>

//                 <p>
//                   Sélectionnez une promotion puis la fixation
//                   que vous souhaitez modifier.
//                 </p>
//               </div>

//             </div>


//             <div className="form-grid">

//               <div className="form-group">

//                 <label htmlFor="promotion-modifier">
//                   Promotion
//                 </label>

//                 <select
//                   id="promotion-modifier"
//                   value={promotionModifier}
//                   onChange={handlePromotionModifier}
//                 >
//                   <option value="">
//                     Sélectionner une promotion
//                   </option>

//                   {promotions.map((promotion) => (
//                     <option
//                       key={promotion.id}
//                       value={promotion.id}
//                     >
//                       {promotion.code} — {promotion.nom}
//                     </option>
//                   ))}

//                 </select>

//               </div>


//               <div className="form-group">

//                 <label htmlFor="fixation-modifier">
//                   Frais à modifier
//                 </label>

//                 <select
//                   id="fixation-modifier"
//                   value={fixationSupprimer}
//                   onChange={(event) => {
//                     const id = event.target.value;

//                     setFixationSupprimer(id);

//                     const fixation = fixations.find(
//                       (item) => item.id === Number(id)
//                     );

//                     if (fixation) {
//                       setMotifModifier(fixation.motif);
//                       setMontantModifier(
//                         String(fixation.montant)
//                       );
//                     }
//                   }}
//                   disabled={!promotionModifier}
//                 >
//                   <option value="">
//                     Sélectionner un motif
//                   </option>

//                   {fixationsPromotionModifier.map(
//                     (fixation) => (
//                       <option
//                         key={fixation.id}
//                         value={fixation.id}
//                       >
//                         {fixation.motif} —{" "}
//                         {formatMontant(fixation.montant)} FC
//                       </option>
//                     )
//                   )}

//                 </select>

//               </div>

//             </div>


//             <div className="form-grid two-columns">

//               <div className="form-group">

//                 <label htmlFor="motif-modifier">
//                   Nouveau motif
//                 </label>

//                 <input
//                   id="motif-modifier"
//                   type="text"
//                   value={motifModifier}
//                   onChange={(event) =>
//                     setMotifModifier(event.target.value)
//                   }
//                   placeholder="Motif des frais"
//                   disabled={!fixationSupprimer}
//                 />

//               </div>


//               <div className="form-group">

//                 <label htmlFor="montant-modifier">
//                   Nouveau montant
//                 </label>

//                 <div className="amount-input">

//                   <input
//                     id="montant-modifier"
//                     type="number"
//                     min="0"
//                     step="1"
//                     value={montantModifier}
//                     onChange={(event) =>
//                       setMontantModifier(event.target.value)
//                     }
//                     placeholder="0"
//                     disabled={!fixationSupprimer}
//                   />

//                   <span>
//                     FC
//                   </span>

//                 </div>

//               </div>

//             </div>


//             <div className="form-actions right">

//               <button
//                 type="submit"
//                 className="primary-button orange-button"
//                 disabled={!fixationSupprimer}
//               >
//                 <span>✓</span>
//                 Valider les modifications
//               </button>

//             </div>

//           </form>

//         )}


//         {/* ====================================================
//             MODE SUPPRIMER
//         ==================================================== */}

//         {mode === "supprimer" && (

//           <div className="fixation-form">

//             <div className="form-section-heading">

//               <div className="section-icon red">
//                 ⌫
//               </div>

//               <div>
//                 <h3>
//                   Supprimer une fixation
//                 </h3>

//                 <p>
//                   Sélectionnez la promotion et les frais
//                   à supprimer.
//                 </p>
//               </div>

//             </div>


//             <div className="form-grid">

//               <div className="form-group">

//                 <label htmlFor="promotion-supprimer">
//                   Promotion
//                 </label>

//                 <select
//                   id="promotion-supprimer"
//                   value={promotionSupprimer}
//                   onChange={(event) => {
//                     setPromotionSupprimer(event.target.value);
//                     setFixationSupprimer("");
//                   }}
//                 >
//                   <option value="">
//                     Sélectionner une promotion
//                   </option>

//                   {promotions.map((promotion) => (
//                     <option
//                       key={promotion.id}
//                       value={promotion.id}
//                     >
//                       {promotion.code} — {promotion.nom}
//                     </option>
//                   ))}

//                 </select>

//               </div>


//               <div className="form-group">

//                 <label htmlFor="fixation-supprimer">
//                   Fixation à supprimer
//                 </label>

//                 <select
//                   id="fixation-supprimer"
//                   value={fixationSupprimer}
//                   onChange={(event) =>
//                     setFixationSupprimer(event.target.value)
//                   }
//                   disabled={!promotionSupprimer}
//                 >
//                   <option value="">
//                     Sélectionner les frais
//                   </option>

//                   {fixationsPromotionSuppression.map(
//                     (fixation) => (
//                       <option
//                         key={fixation.id}
//                         value={fixation.id}
//                       >
//                         {fixation.motif} —{" "}
//                         {formatMontant(fixation.montant)} FC
//                       </option>
//                     )
//                   )}

//                 </select>

//               </div>

//             </div>


//             {fixationSupprimer && (

//               <div className="delete-preview">

//                 <div className="delete-warning-icon">
//                   !
//                 </div>

//                 <div>

//                   <strong>
//                     Suppression de la fixation
//                   </strong>

//                   <p>
//                     Cette opération supprimera la fixation
//                     sélectionnée pour cette promotion.
//                   </p>

//                 </div>

//               </div>

//             )}


//             <div className="form-actions right">

//               <button
//                 type="button"
//                 className="danger-button"
//                 onClick={handleSupprimer}
//                 disabled={!fixationSupprimer}
//               >
//                 <span>⌫</span>
//                 Supprimer la fixation
//               </button>

//             </div>

//           </div>

//         )}

//       </div>


//       {/* ======================================================
//           APERÇU DES FIXATIONS
//       ====================================================== */}

//       <div className="fixations-list-card">

//         <div className="list-header">

//           <div>
//             <span className="fixation-eyebrow">
//               Vue d'ensemble
//             </span>

//             <h3>
//               Fixations enregistrées
//             </h3>
//           </div>

//           <span className="fixation-count">
//             {fixations.length} fixation
//             {fixations.length > 1 ? "s" : ""}
//           </span>

//         </div>


//         <div className="fixations-table-wrapper">

//           <table className="fixations-table">

//             <thead>
//               <tr>
//                 <th>Promotion</th>
//                 <th>Motif</th>
//                 <th>Montant</th>
//                 <th>Année académique</th>
//               </tr>
//             </thead>

//             <tbody>

//               {fixations.length === 0 ? (

//                 <tr>
//                   <td
//                     colSpan="4"
//                     className="empty-table"
//                   >
//                     Aucune fixation enregistrée.
//                   </td>
//                 </tr>

//               ) : (

//                 fixations.map((fixation) => {

//                   const promotion = getPromotion(
//                     fixation.promotionId
//                   );

//                   return (
//                     <tr key={fixation.id}>

//                       <td>
//                         <div className="promotion-cell">

//                           <strong>
//                             {promotion?.code || "—"}
//                           </strong>

//                           <span>
//                             {promotion?.nom || "Promotion inconnue"}
//                           </span>

//                         </div>
//                       </td>

//                       <td>
//                         {fixation.motif}
//                       </td>

//                       <td>
//                         <strong className="table-amount">
//                           {formatMontant(fixation.montant)} FC
//                         </strong>
//                       </td>

//                       <td>
//                         <span className="year-badge">
//                           {fixation.annee}
//                         </span>
//                       </td>

//                     </tr>
//                   );
//                 })

//               )}

//             </tbody>

//           </table>

//         </div>

//       </div>

//     </section>
//   );
// };

// export default FixationFraisAcademiques;

import React, { useEffect, useState } from "react";
import "./FixationFraisAcademiques.css";

import {
  getPromotionsService,
  getFraisConfig,
  creerTarifAcademique,
} from "./fixationFraisService";

const FixationFraisAcademiques = ({
  code_mention,
  annee,
}) => {
  const [mode, setMode] = useState("fixer");

  const [promotions, setPromotions] = useState([]);
  const [loadingPromotions, setLoadingPromotions] =
    useState(false);

  const [frais, setFrais] = useState([]);
  const [loadingFrais, setLoadingFrais] =
    useState(false);

  const [fixations, setFixations] = useState([]);

  const [promotionID, setPromotionID] =
    useState("");

  const [typeTarif, setTypeTarif] =
    useState("");

  const [montantTarif, setMontantTarif] =
    useState("");

  const [tranches, setTranches] = useState([]);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState("");

 
  /*
   * ============================================================
   * NOTIFICATION
   * ============================================================
   */

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    window.setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };



  /*
  * ============================================================
  * CHARGEMENT DES FRAIS CONFIGURÉS
  * ============================================================
  */

  useEffect(() => {
    if (mode !== "fixer") {
      return;
    }

    if (!code_mention) {
      setFrais([]);
      setTypeTarif("");
      return;
    }

    let actif = true;

    const loadFrais = async () => {
      try {
        setLoadingFrais(true);

        const fraisData = await getFraisConfig({
          code_mention,
        });

        if (!actif) {
          return;
        }

        const fraisConfigures =
          fraisData?.data ||
          fraisData?.frais ||
          fraisData ||
          [];

        setFrais(
          Array.isArray(fraisConfigures)
            ? fraisConfigures
            : []
        );
      } catch (error) {
        if (!actif) {
          return;
        }

        console.error(
          "Erreur chargement frais :",
          error
        );

        setFrais([]);
        setTypeTarif("");

        showMessage(
          "Impossible de charger la liste des frais.",
          "error"
        );
      } finally {
        if (actif) {
          setLoadingFrais(false);
        }
      }
    };

    loadFrais();

    return () => {
      actif = false;
    };
  }, [mode, code_mention]);


  /*
   * ============================================================
   * CHARGEMENT DES PROMOTIONS
   * ============================================================
   */

  useEffect(() => {
    if (mode !== "fixer") {
      return;
    }

    if (!code_mention) {
      setPromotions([]);
      return;
    }

    let actif = true;

    const loadPromotions = async () => {
      try {
        setLoadingPromotions(true);

        const promoData =
          await getPromotionsService({
            code_mention,
          });

        if (!actif) {
          return;
        }

        const promos =
          promoData?.data ||
          promoData?.promotions ||
          promoData ||
          [];

        setPromotions(
          Array.isArray(promos)
            ? promos
            : []
        );
      } catch (error) {
        if (!actif) {
          return;
        }

        console.error(
          "Erreur chargement promotions :",
          error
        );

        setPromotions([]);

        showMessage(
          "Impossible de charger les promotions.",
          "error"
        );
      } finally {
        if (actif) {
          setLoadingPromotions(false);
        }
      }
    };

    loadPromotions();

    return () => {
      actif = false;
    };
  }, [mode, code_mention]);

  /*
   * ============================================================
   * RÉCUPÉRER UNE PROMOTION
   * ============================================================
   */

  const getPromotion = (promotionId) => {
    return promotions.find(
      (promotion) =>
        String(promotion.id_version) ===
        String(promotionId)
    );
  };

  const promotionSelectionnee = promotions.find(
    (promotion) =>
      String(promotion.id_version) ===
      String(promotionID)
  );

 
  /*
   * ============================================================
   * FORMAT MONTANT
   * ============================================================
   */

  const formatMontant = (montant) => {
    if (
      montant === "" ||
      montant === null ||
      montant === undefined
    ) {
      return "";
    }

    const nombre = Number(montant);

    if (!Number.isFinite(nombre)) {
      return "";
    }

    return new Intl.NumberFormat("fr-FR").format(
      nombre
    );
  };

  /*
   * ============================================================
   * AJOUTER UNE TRANCHE
   * ============================================================
   */

  const ajouterTranche = () => {
    setTranches((ancienneListe) => [
      ...ancienneListe,

      {
        numero_tranche:
          ancienneListe.length + 1,

        libelle: "",

        montant: "",

        date_echeance: "",
      },
    ]);
  };

  /*
   * ============================================================
   * SUPPRIMER UNE TRANCHE
   * ============================================================
   */

  const supprimerTranche = (index) => {
    setTranches((ancienneListe) =>
      ancienneListe
        .filter(
          (_, trancheIndex) =>
            trancheIndex !== index
        )
        .map(
          (tranche, trancheIndex) => ({
            ...tranche,

            numero_tranche:
              trancheIndex + 1,
          })
        )
    );
  };

  /*
   * ============================================================
   * MODIFIER UNE TRANCHE
   * ============================================================
   */

  const modifierTranche = (
    index,
    champ,
    valeur
  ) => {
    setTranches((ancienneListe) =>
      ancienneListe.map(
        (tranche, trancheIndex) => {
          if (trancheIndex !== index) {
            return tranche;
          }

          return {
            ...tranche,
            [champ]: valeur,
          };
        }
      )
    );
  };

  /*
   * ============================================================
   * RESET FORMULAIRE
   * ============================================================
   */

  const resetFormFixer = () => {
    setPromotionID("");
    setTypeTarif("");
    setMontantTarif("");
    setTranches([]);
  };

  /*
   * ============================================================
   * CHANGEMENT DE MODE
   * ============================================================
   */

  const handleModeChange = (nouveauMode) => {
    setMode(nouveauMode);

    setMessage("");
    setMessageType("");

    if (nouveauMode === "fixer") {
      resetFormFixer();
    }

    if (nouveauMode === "modifier") {
      setPromotionModifier("");
      setMotifModifier("");
      setMontantModifier("");
    }

    if (nouveauMode === "supprimer") {
      setPromotionSupprimer("");
      setFixationSupprimer("");
    }
  };

  /*
   * ============================================================
   * VALIDATION DES TRANCHES
   * ============================================================
   */

  const validerTranches = () => {
    if (tranches.length === 0) {
      return {
        success: false,
        message:
          "Veuillez ajouter au moins une tranche.",
      };
    }

    for (
      let index = 0;
      index < tranches.length;
      index++
    ) {
      const tranche = tranches[index];

      const libelle =
        String(tranche.libelle || "").trim();

      if (!libelle) {
        return {
          success: false,
          message:
            `Le libellé de la tranche ${index + 1} est requis.`,
        };
      }

      const montant =
        Number(tranche.montant);

      if (
        !Number.isFinite(montant) ||
        montant <= 0
      ) {
        return {
          success: false,
          message:
            `Le montant de la tranche ${index + 1} doit être supérieur à zéro.`,
        };
      }

      if (!tranche.date_echeance) {
        return {
          success: false,
          message:
            `La date d'échéance de la tranche ${index + 1} est requise.`,
        };
      }
    }

    return {
      success: true,
    };
  };

  /*
   * ============================================================
   * FIXER LE TARIF
   * ============================================================
   */

  const handleFixer = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    /*
     * ----------------------------------------------------------
     * PROMOTION
     * ----------------------------------------------------------
     */

    if (!promotionID) {
      showMessage(
        "Veuillez sélectionner une promotion.",
        "error"
      );

      return;
    }

    if (!typeTarif) {
      showMessage(
        "Veuillez sélectionner un type de frais.",
        "error"
      );

      return;
    }

    /*
     * ----------------------------------------------------------
     * MONTANT TOTAL
     * ----------------------------------------------------------
     */

    const montant =
      Number(montantTarif);

    if (
      !Number.isFinite(montant) ||
      montant <= 0
    ) {
      showMessage(
        "Le montant total doit être supérieur à zéro.",
        "error"
      );

      return;
    }

    /*
     * ----------------------------------------------------------
     * TRANCHES
     * ----------------------------------------------------------
     */

    const validationTranches =
      validerTranches();

    if (!validationTranches.success) {
      showMessage(
        validationTranches.message,
        "error"
      );

      return;
    }

    /*
     * ----------------------------------------------------------
     * PAYLOAD
     * ----------------------------------------------------------
     */
    const payload = {
      id_promotion_version:
        Number(promotionID),

      type_tarif:
        typeTarif,

      montant,

      tranches:
        tranches.map(
          (tranche, index) => ({
            numero_tranche:
              index + 1,

            libelle:
              String(
                tranche.libelle
              ).trim(),

            montant:
              Number(
                tranche.montant
              ),

            date_echeance:
              tranche.date_echeance,
          })
        ),
    };

    /*
     * ----------------------------------------------------------
     * ENVOI AU BACKEND
     * ----------------------------------------------------------
     */

    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      const result =
        await creerTarifAcademique(
          payload
        );

      if (!result?.success) {
        showMessage(
          result?.message ||
            "Impossible d'enregistrer le tarif.",
          "error"
        );

        return;
      }

      /*
       * --------------------------------------------------------
       * PROMOTION
       * --------------------------------------------------------
       */

      const promotion =
        getPromotion(
          promotionID
        );

      /*
       * --------------------------------------------------------
       * FIXATION CRÉÉE
       * --------------------------------------------------------
       */

      const nouvelleFixation = {
        id:
          result?.tarif?.id_tarif ||
          Date.now(),

        promotionId:
          Number(promotionID),

        promotionNom:
          promotion?.nom_promotion ||
          "Promotion inconnue",

        promotionCode:
          promotion?.code_promotion ||
          "",

        typeTarif:
          result?.tarif?.type_tarif ||
          typeTarif,

        montant:
          Number(
            result?.tarif?.montant ??
            montant
          ),

        tranches:
          result?.tranches?.length > 0
            ? result.tranches
            : payload.tranches,

        annee:
          result?.annee_academique?.libelle ||
          "Année en cours",
      };

      /*
       * --------------------------------------------------------
       * AJOUT DANS LA LISTE
       * --------------------------------------------------------
       */

      setFixations(
        (ancienneListe) => [
          ...ancienneListe,
          nouvelleFixation,
        ]
      );

      /*
       * --------------------------------------------------------
       * RESET
       * --------------------------------------------------------
       */

      resetFormFixer();

      /*
       * --------------------------------------------------------
       * SUCCÈS
       * --------------------------------------------------------
       */

      showMessage(
        result.message ||
          "Tarif académique fixé avec succès.",
        "success"
      );
    } catch (error) {
      console.error(
        "Erreur fixation tarif :",
        error
      );

      showMessage(
        "Erreur lors de la fixation du tarif.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * INITIALISATION ANNÉE PRÉCÉDENTE
   *
   * Pas encore branchée au backend.
   * ============================================================
   */

  const handleInitialiser = () => {
    showMessage(
      "L'initialisation depuis l'année précédente sera connectée ultérieurement.",
      "success"
    );
  };

  /*
   * ============================================================
   * RENDU
   * ============================================================
   */

  return (
    <section className="fixation-frais-container">

      {/* ======================================================
          EN-TÊTE
      ====================================================== */}

      <div className="fixation-header">

        <div>
          <span className="fixation-eyebrow">
            Gestion financière
          </span>

          <h2>
            Fixation des frais académiques
          </h2>

          <p>
            Définissez les frais applicables
            aux différentes promotions.
          </p>
        </div>

        <div className="academic-year-badge">

          <span>
            {annee || "Année académique"} 
          </span>

        </div>

      </div>

      {/* ======================================================
          MODES
      ====================================================== */}

      <div className="fixation-mode-card">

        {/* FIXER */}

        <button
          type="button"
          className={`mode-button ${
            mode === "fixer"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleModeChange("fixer")
          }
        >
          <span className="mode-icon">
            ＋
          </span>

          <span>
            <strong>
              Fixer
            </strong>

            <small>
              Nouvelle fixation
            </small>
          </span>
        </button>

        {/* MODIFIER */}

        <button
          type="button"
          className={`mode-button ${
            mode === "modifier"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleModeChange("modifier")
          }
        >
          <span className="mode-icon">
            ✎
          </span>

          <span>
            <strong>
              Modifier
            </strong>

            <small>
              Modifier une fixation
            </small>
          </span>
        </button>

        {/* SUPPRIMER */}

        <button
          type="button"
          className={`mode-button ${
            mode === "supprimer"
              ? "active danger"
              : ""
          }`}
          onClick={() =>
            handleModeChange("supprimer")
          }
        >
          <span className="mode-icon">
            ⌫
          </span>

          <span>
            <strong>
              Supprimer
            </strong>

            <small>
              Supprimer une fixation
            </small>
          </span>
        </button>

      </div>

      {/* ======================================================
          CONTENU
      ====================================================== */}

      <div className="fixation-content-card">

        {/* ====================================================
            FIXER
        ==================================================== */}

        {mode === "fixer" && (

          <form
            className="fixation-form"
            onSubmit={handleFixer}
          >

            <div className="form-section-heading">

              <div className="section-icon blue">
                ＋
              </div>

              <div>

                <h3>
                  Nouvelle fixation
                </h3>

                <p>
                  Définissez le type de tarif,
                  le montant total et sa
                  répartition en tranches.
                </p>

              </div>

            </div>

            {/* ==================================================
                INFORMATIONS TARIF
            ================================================== */}

            <div className="form-grid three-columns">

              {/* PROMOTION */}

              <div className="form-group">

                <label htmlFor="promotion-fixer">
                  Promotion
                </label>

                <select
                  id="promotion-fixer"
                  value={promotionID}
                  onChange={(event) =>
                    setPromotionID(
                      event.target.value
                    )
                  }
                  disabled={
                    loadingPromotions ||
                    loading
                  }
                  required
                >

                  <option value="">
                    {loadingPromotions
                      ? "Chargement des promotions..."
                      : "Sélectionner une promotion"}
                  </option>

                  {!loadingPromotions &&
                    promotions.map(
                      (promotion) => (
                        <option
                          key={
                            promotion.id_version
                          }
                          value={
                            promotion.id_version
                          }
                        >
                          {promotion.code_promotion
                            ? `${promotion.code_promotion} — `
                            : ""}

                          {
                            promotion.nom_promotion
                          }
                        </option>
                      )
                    )}

                </select>

              </div>

              {/* TYPE TARIF */}

              <div className="form-group">

                <label htmlFor="type-tarif">
                  Type de frais
                </label>

                <select
                  id="type-tarif"
                  value={typeTarif}
                  onChange={(event) =>
                    setTypeTarif(event.target.value)
                  }
                  disabled={
                    loading ||
                    loadingFrais ||
                    !code_mention
                  }
                  required
                >

                  <option value="">
                    {loadingFrais
                      ? "Chargement des frais..."
                      : frais.length === 0
                      ? "Aucun frais configuré"
                      : "Sélectionner un frais"}
                  </option>

                  {!loadingFrais &&
                    frais.map((fraisItem, index) => (
                      <option
                        key={
                          fraisItem.type_tarif ||
                          `frais-${index}`
                        }
                        value={
                          fraisItem.type_tarif
                        }
                      >
                        {fraisItem.libelle}
                      </option>
                    ))}

                </select>

              </div>

              {/* MONTANT */}

              <div className="form-group">

                <label htmlFor="montant-fixer">
                  Montant total
                </label>

                <div className="amount-input">

                  <input
                    id="montant-fixer"
                    type="number"
                    min="0"
                    step="0.01"
                    value={montantTarif}
                    onChange={(event) =>
                      setMontantTarif(
                        event.target.value
                      )
                    }
                    placeholder="0"
                    disabled={loading}
                    required
                  />

                  <span>
                    FC
                  </span>

                </div>

              </div>

            </div>

            {/* ==================================================
                TRANCHES
            ================================================== */}

            <div className="tranches-section">

              <div className="tranches-header">

                <div>

                  <h3>
                    Tranches de paiement
                  </h3>

                  <p>
                    Répartissez le montant
                    total entre les différentes
                    échéances.
                  </p>

                </div>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    ajouterTranche
                  }
                  disabled={loading}
                >
                  ＋ Ajouter une tranche
                </button>

              </div>

              {tranches.length === 0 && (

                <div className="empty-table">

                  Aucune tranche ajoutée.
                  Cliquez sur « Ajouter une
                  tranche » pour définir les
                  échéances.

                </div>

              )}

              {tranches.map(
                (tranche, index) => (

                  <div
                    className="tranche-row"
                    key={`tranche-${index}`}
                  >

                    {/* LIBELLÉ */}

                    <div className="form-group">

                      <label htmlFor={`libelle-tranche-${index}`}>
                        Libellé
                      </label>

                      <select
                        id={`libelle-tranche-${index}`}
                        value={tranche.libelle}
                        onChange={(event) =>
                          modifierTranche(
                            index,
                            "libelle",
                            event.target.value
                          )
                        }
                        disabled={loading}
                        required
                      >
                        <option value="">
                          Sélectionner une tranche
                        </option>

                        <option value="Première tranche">
                          Première tranche
                        </option>

                        <option value="Deuxième tranche">
                          Deuxième tranche
                        </option>

                        <option value="Troisième tranche">
                          Troisième tranche
                        </option>

                        <option value="Tranche unique">
                          Tranche unique
                        </option>
                      </select>

                    </div>

                    {/* MONTANT */}

                    <div className="form-group">

                      <label>
                        Montant
                      </label>

                      <div className="amount-input">

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            tranche.montant
                          }
                          onChange={(event) =>
                            modifierTranche(
                              index,
                              "montant",
                              event.target.value
                            )
                          }
                          placeholder="0"
                          disabled={loading}
                        />

                        <span>
                          FC
                        </span>

                      </div>

                    </div>

                    {/* DATE */}

                    <div className="form-group">

                      <label>
                        Date d'échéance
                      </label>

                      <input
                        type="date"
                        value={
                          tranche.date_echeance
                        }
                        onChange={(event) =>
                          modifierTranche(
                            index,
                            "date_echeance",
                            event.target.value
                          )
                        }
                        disabled={loading}
                      />

                    </div>

                    {/* SUPPRESSION TRANCHE */}

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() =>
                        supprimerTranche(
                          index
                        )
                      }
                      disabled={loading}
                    >
                      ⌫
                    </button>

                  </div>

                )
              )}

            </div>

            {/* ==================================================
                APERÇU
            ================================================== */}

            <div className="form-preview">

              <div>
                <span>Promotion</span>

                <strong>
                  {promotionSelectionnee?.nom_promotion || "—"}
                </strong>
              </div>

              <div>
                <span>Type de tarif</span>

                <strong>
                  {typeTarif || "—"}
                </strong>
              </div>

              <div>
                <span>Montant total</span>

                <strong className="preview-amount">
                  {montantTarif
                    ? `${formatMontant(montantTarif)} FC`
                    : "—"}
                </strong>
              </div>

              <div>
                <span>Total des tranches</span>

                <strong className="preview-amount">
                  {formatMontant(
                    tranches.reduce(
                      (total, tranche) =>
                        total + Number(tranche.montant || 0),
                      0
                    )
                  )}{" "}
                  FC
                </strong>
              </div>

            </div>

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={
                  handleInitialiser
                }
                disabled={loading}
              >
                <span>
                  ↻
                </span>

                Initialiser l'année précédente
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >

                <span>
                  ✓
                </span>

                {loading
                  ? "Enregistrement..."
                  : "Valider la fixation"}

              </button>

            </div>

          </form>

        )}

        {/* ====================================================
            MODIFIER
            ==================================================== */}

        {mode === "modifier" && (

          <div className="fixation-form">

            <div className="form-section-heading">

              <div className="section-icon orange">
                ✎
              </div>

              <div>

                <h3>
                  Modifier une fixation
                </h3>

                <p>
                  La modification des frais
                  sera disponible prochainement.
                </p>

              </div>

            </div>

            <div className="empty-table">

              La modification des tarifs
              n'est pas encore implémentée.

            </div>

          </div>

        )}

        {/* ====================================================
            SUPPRIMER
            ==================================================== */}

        {mode === "supprimer" && (

          <div className="fixation-form">

            <div className="form-section-heading">

              <div className="section-icon red">
                ⌫
              </div>

              <div>

                <h3>
                  Supprimer une fixation
                </h3>

                <p>
                  La suppression des frais
                  sera disponible prochainement.
                </p>

              </div>

            </div>

            <div className="empty-table">

              La suppression des tarifs
              n'est pas encore implémentée.

            </div>

          </div>

        )}

      </div>

      {/* ======================================================
          LISTE DES FIXATIONS
      ====================================================== */}

      <div className="fixations-list-card">

        <div className="list-header">

          <div>

            <span className="fixation-eyebrow">
              Vue d'ensemble
            </span>

            <h3>
              Fixations enregistrées
            </h3>

          </div>

          <span className="fixation-count">

            {fixations.length} fixation
            {fixations.length > 1
              ? "s"
              : ""}

          </span>

        </div>

        <div className="fixations-table-wrapper">

          <table className="fixations-table">

            <thead>

              <tr>

                <th>
                  Promotion
                </th>

                <th>
                  Type de tarif
                </th>

                <th>
                  Montant total
                </th>

                <th>
                  Tranches
                </th>

              </tr>

            </thead>

            <tbody>

              {fixations.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="empty-table"
                  >
                    Aucune fixation enregistrée.
                  </td>

                </tr>

              ) : (

                fixations.map(
                  (fixation) => (

                    <tr
                      key={
                        fixation.id
                      }
                    >

                      <td>

                        <div className="promotion-cell">

                          <span>
                            {
                              fixation.promotionNom ||
                              "Promotion inconnue"
                            }
                          </span>

                        </div>

                      </td>

                      <td>
                        {
                          fixation.typeTarif ||
                          "—"
                        }
                      </td>

                      <td>

                        <strong className="table-amount">

                          {
                            formatMontant(
                              fixation.montant
                            )
                          }{" "}
                          FC

                        </strong>

                      </td>

                      <td>

                        <span className="year-badge">

                          {
                            fixation.tranches
                              ?.length ||
                            0
                          }{" "}
                          tranche
                          {
                            fixation.tranches
                                ?.length > 1
                              ? "s"
                              : ""
                          }

                        </span>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ======================================================
          NOTIFICATION
      ====================================================== */}

      {message && (

        <div
          className={`notification ${messageType}`}
        >
          {message}
        </div>

      )}

    </section>
  );
};

export default FixationFraisAcademiques;
