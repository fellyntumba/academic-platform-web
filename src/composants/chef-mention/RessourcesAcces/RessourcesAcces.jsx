

// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import "./RessourcesAcces.css";

// import {
//   getPromotionsService,
//   getTarifsTranchesByPromotionVersionService,
//   createRessourceAccesAvecRegleService,
//   getRessourcesAccesByPromotionVersionService,
//   deleteRessourceAccesByPromotionService,
// } from "./ressourcesAccesService";

// /* =========================================================
//    COMPOSANT
// ========================================================= */

// const RessourcesAcces = ({ code_mention }) => {
//   /* =====================================================
//      MODE
//   ====================================================== */

//   const [mode, setMode] = useState("create");

//   /* =====================================================
//      PROMOTIONS
//   ====================================================== */

//   const [promotionsVersions, setPromotionsVersions] =
//     useState([]);

//   const [loadingPromotions, setLoadingPromotions] =
//     useState(false);

//   /* =====================================================
//      TARIFS / TRANCHES
//   ====================================================== */

//   const [tarifs, setTarifs] = useState([]);

//   const [loadingTarifs, setLoadingTarifs] =
//     useState(false);

//   /* =====================================================
//      FORMULAIRE CRÉATION
//   ====================================================== */

//   const [code, setCode] = useState("");
//   const [libelle, setLibelle] = useState("");

//   const [promotionVersionId, setPromotionVersionId] =
//     useState("");

//   const [trancheSelectionnee, setTrancheSelectionnee] =
//     useState("");

//   const [tranchesSelectionnees, setTranchesSelectionnees] =
//     useState([]);

//   /* =====================================================
//      SUPPRESSION
//   ====================================================== */

//   const [ressourceSelectionnee, setRessourceSelectionnee] =
//     useState("");

//   const [ressources, setRessources] =
//     useState([]);

//   const [loadingRessources, setLoadingRessources] =
//     useState(false);

//   /* =====================================================
//      NOTIFICATION
//   ====================================================== */

//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");

//   /* =====================================================
//      ÉTAT CHARGEMENT
//   ====================================================== */

//   const [isSubmitting, setIsSubmitting] =
//     useState(false);

//   /* =====================================================
//      AFFICHER MESSAGE
//   ====================================================== */

//   const showMessage = (
//     msg,
//     type = "success"
//   ) => {
//     setMessage(msg);
//     setMessageType(type);

//     setTimeout(() => {
//       setMessage("");
//       setMessageType("");
//     }, 4000);
//   };

//   /* =====================================================
//      CHARGER LES PROMOTIONS

//      LOGIQUE CONSERVÉE
//   ====================================================== */

//   useEffect(() => {
//     const loadPromotions = async () => {
//       try {
//         setLoadingPromotions(true);

//         const promoData =
//           await getPromotionsService({
//             code_mention,
//           });

//         const promos =
//           promoData?.data ||
//           promoData ||
//           [];

//         setPromotionsVersions(
//           Array.isArray(promos)
//             ? promos
//             : []
//         );

//       } catch (error) {
//         console.error(
//           "Erreur chargement promotions :",
//           error
//         );

//         setPromotionsVersions([]);

//         showMessage(
//           error.message ||
//             "Erreur lors du chargement des promotions.",
//           "error"
//         );

//       } finally {
//         setLoadingPromotions(false);
//       }
//     };

//     loadPromotions();
//   }, [code_mention]);

//   /* =====================================================
//      CHARGER TARIFS ET TRANCHES

//      CONSERVÉ POUR LA CRÉATION
//   ====================================================== */

//   useEffect(() => {
//     let cancelled = false;

//     const loadTarifsTranches = async () => {

//       if (!promotionVersionId) {
//         setTarifs([]);
//         setTrancheSelectionnee("");
//         setTranchesSelectionnees([]);
//         setLoadingTarifs(false);

//         return;
//       }

//       try {
//         setLoadingTarifs(true);

//         setTarifs([]);

//         setTrancheSelectionnee("");
//         setTranchesSelectionnees([]);

//         const tarifsData =
//           await getTarifsTranchesByPromotionVersionService({
//             promotion_version_id:
//               Number(promotionVersionId),
//           });

//         if (cancelled) {
//           return;
//         }

//         const tarifsBackend =
//           tarifsData?.data?.tarifs || [];

//         setTarifs(
//           Array.isArray(tarifsBackend)
//             ? tarifsBackend
//             : []
//         );

//       } catch (error) {

//         if (cancelled) {
//           return;
//         }

//         console.error(
//           "Erreur chargement tarifs et tranches :",
//           error
//         );

//         setTarifs([]);

//         setTrancheSelectionnee("");
//         setTranchesSelectionnees([]);

//         showMessage(
//           error.message ||
//             "Erreur lors du chargement des tarifs et tranches.",
//           "error"
//         );

//       } finally {

//         if (!cancelled) {
//           setLoadingTarifs(false);
//         }

//       }
//     };

//     /*
//      * En mode suppression, les tarifs ne sont pas
//      * nécessaires.
//      *
//      * On les conserve uniquement pour la création.
//      */
//     if (mode === "create") {
//       loadTarifsTranches();
//     } else {
//       setTarifs([]);
//       setTrancheSelectionnee("");
//       setTranchesSelectionnees([]);
//       setLoadingTarifs(false);
//     }

//     return () => {
//       cancelled = true;
//     };

//   }, [promotionVersionId, mode]);

//   /* =====================================================
//      CHARGER LES RESSOURCES

//      MODE SUPPRESSION UNIQUEMENT
//   ====================================================== */

//   useEffect(() => {
//     let cancelled = false;

//     const loadRessources = async () => {

//       if (mode !== "delete") {
//         setRessources([]);
//         setRessourceSelectionnee("");
//         setLoadingRessources(false);

//         return;
//       }

//       if (!promotionVersionId) {
//         setRessources([]);
//         setRessourceSelectionnee("");
//         setLoadingRessources(false);

//         return;
//       }

//       try {

//         setLoadingRessources(true);

//         setRessources([]);
//         setRessourceSelectionnee("");

//         const ressourcesData =
//           await getRessourcesAccesByPromotionVersionService({
//             promotion_version_id:
//               Number(promotionVersionId),
//           });

//         if (cancelled) {
//           return;
//         }

//         const ressourcesBackend =
//           ressourcesData?.data?.ressources ??
//           ressourcesData?.data ??
//           [];

//         setRessources(
//           Array.isArray(ressourcesBackend)
//             ? ressourcesBackend
//             : []
//         );

//       } catch (error) {

//         if (cancelled) {
//           return;
//         }

//         console.error(
//           "Erreur chargement ressources d'accès :",
//           error
//         );

//         setRessources([]);
//         setRessourceSelectionnee("");

//         showMessage(
//           error.message ||
//             "Erreur lors du chargement des ressources disponibles.",
//           "error"
//         );

//       } finally {

//         if (!cancelled) {
//           setLoadingRessources(false);
//         }

//       }
//     };

//     loadRessources();

//     return () => {
//       cancelled = true;
//     };

//   }, [
//     mode,
//     promotionVersionId,
//   ]);

//   /* =====================================================
//      PROMOTION SÉLECTIONNÉE
//   ====================================================== */

//   const promotionSelectionnee = useMemo(() => {

//     return promotionsVersions.find(
//       (promotion) =>
//         String(promotion.id_version) ===
//         String(promotionVersionId)
//     );

//   }, [
//     promotionsVersions,
//     promotionVersionId,
//   ]);

//   /* =====================================================
//      RESSOURCE SÉLECTIONNÉE
//   ====================================================== */

//   const ressourceCourante = useMemo(() => {

//     if (!ressourceSelectionnee) {
//       return null;
//     }

//     return ressources.find(
//       (ressource) =>
//         String(ressource.id_ressource) ===
//         String(ressourceSelectionnee)
//     ) || null;

//   }, [
//     ressources,
//     ressourceSelectionnee,
//   ]);

//   /* =====================================================
//      TRANCHES DISPONIBLES
//   ====================================================== */

//   const tranchesDisponibles = useMemo(() => {

//     const tranches = [];

//     tarifs.forEach((tarif) => {

//       if (!Array.isArray(tarif.tranches)) {
//         return;
//       }

//       tarif.tranches.forEach((tranche) => {

//         tranches.push({
//           ...tranche,

//           tarif_id:
//             tarif.id_tarif,

//           type_tarif:
//             tarif.type_tarif,

//           montant_tarif:
//             tarif.montant,
//         });

//       });

//     });

//     return tranches.filter(
//       (tranche) =>
//         !tranchesSelectionnees.some(
//           (id) =>
//             String(id) ===
//             String(tranche.id_tranche)
//         )
//     );

//   }, [
//     tarifs,
//     tranchesSelectionnees,
//   ]);

//   /* =====================================================
//      TOTAL DES TRANCHES
//   ====================================================== */

//   const montantTotal = useMemo(() => {

//     return tranchesSelectionnees.reduce(
//       (total, idTranche) => {

//         let trancheTrouvee = null;

//         for (const tarif of tarifs) {

//           if (
//             !Array.isArray(
//               tarif.tranches
//             )
//           ) {
//             continue;
//           }

//           const tranche =
//             tarif.tranches.find(
//               (item) =>
//                 String(
//                   item.id_tranche
//                 ) ===
//                 String(idTranche)
//             );

//           if (tranche) {

//             trancheTrouvee =
//               tranche;

//             break;
//           }

//         }

//         return (
//           total +
//           Number(
//             trancheTrouvee?.montant ||
//               0
//           )
//         );

//       },
//       0
//     );

//   }, [
//     tarifs,
//     tranchesSelectionnees,
//   ]);

//   /* =====================================================
//      AJOUTER UNE TRANCHE
     
//      LOGIQUE CRÉATION CONSERVÉE
//   ====================================================== */

//   const handleAjouterTranche = () => {

//     if (!trancheSelectionnee) {

//       showMessage(
//         "Veuillez sélectionner une tranche tarifaire.",
//         "error"
//       );

//       return;
//     }

//     if (
//       tranchesSelectionnees.some(
//         (id) =>
//           String(id) ===
//           String(trancheSelectionnee)
//       )
//     ) {

//       showMessage(
//         "Cette tranche est déjà ajoutée.",
//         "error"
//       );

//       return;
//     }

//     setTranchesSelectionnees(
//       (previous) => [
//         ...previous,
//         Number(
//           trancheSelectionnee
//         ),
//       ]
//     );

//     setTrancheSelectionnee("");

//     showMessage(
//       "Tranche ajoutée à la règle.",
//       "success"
//     );
//   };

//   /* =====================================================
//      RETIRER UNE TRANCHE
//   ====================================================== */

//   const handleRetirerTranche = (
//     idTranche
//   ) => {

//     setTranchesSelectionnees(
//       (previous) =>
//         previous.filter(
//           (id) =>
//             String(id) !==
//             String(idTranche)
//         )
//     );
//   };

//   /* =====================================================
//      SÉLECTIONNER UNE RESSOURCE

//      SUPPRESSION UNIQUEMENT

//      Aucun détail n'est chargé dans le formulaire.
//   ====================================================== */

//   const handleSelectRessource = (
//     e
//   ) => {

//     const id =
//       e.target.value;

//     setRessourceSelectionnee(id);
//   };

//   /* =====================================================
//      CHANGEMENT DE MODE
//   ====================================================== */

//   const handleChangeMode = (
//     nouveauMode
//   ) => {

//     setMode(
//       nouveauMode
//     );

//     /*
//      * On nettoie les états dépendants,
//      * mais la logique de création reste intacte.
//      */
//     setCode("");
//     setLibelle("");
//     setPromotionVersionId("");
//     setTrancheSelectionnee("");
//     setTranchesSelectionnees([]);

//     setRessources([]);
//     setRessourceSelectionnee("");

//     setMessage("");
//     setMessageType("");
//   };

//   /* =====================================================
//      RESET
//   ====================================================== */

//   const resetForm = () => {

//     setCode("");
//     setLibelle("");
//     setPromotionVersionId("");
//     setTrancheSelectionnee("");
//     setTranchesSelectionnees([]);
//     setRessourceSelectionnee("");
//     setRessources([]);
//   };

//   /* =====================================================
//      SUPPRIMER LA RESSOURCE
//   ====================================================== */

//   const handleDelete = async () => {

//     if (!promotionVersionId) {

//       showMessage(
//         "Veuillez sélectionner une promotion.",
//         "error"
//       );

//       return;
//     }

//     if (!ressourceSelectionnee) {

//       showMessage(
//         "Veuillez sélectionner une ressource à supprimer.",
//         "error"
//       );

//       return;
//     }

//     const ressource =
//       ressources.find(
//         (item) =>
//           String(
//             item.id_ressource
//           ) ===
//           String(
//             ressourceSelectionnee
//           )
//       );

//     if (!ressource) {

//       showMessage(
//         "Ressource introuvable.",
//         "error"
//       );

//       return;
//     }

//     const confirmation =
//       window.confirm(
//         `Voulez-vous vraiment supprimer la ressource "${ressource.code ?? ""} • ${ressource.libelle ?? ""}" ?\n\nCette opération supprimera également sa règle d'accès et toutes ses associations avec les tranches.`
//       );

//     if (!confirmation) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {

//       const result =
//         await deleteRessourceAccesByPromotionService({
//           promotion_version_id:
//             Number(
//               promotionVersionId
//             ),

//           ressource_id:
//             Number(
//               ressourceSelectionnee
//             ),
//         });

//       if (!result?.success) {

//         throw new Error(
//           result?.message ||
//             "La suppression de la ressource a échoué."
//         );
//       } 

//       showMessage(
//         result.message ||
//           "Ressource d'accès supprimée avec succès.",
//         "success"
//       );

//       /*
//        * On retire immédiatement la ressource
//        * de la liste sans recharger inutilement
//        * toute la page.
//        */
//       setRessources(
//         (previous) =>
//           previous.filter(
//             (item) =>
//               String(
//                 item.id_ressource
//               ) !==
//               String(
//                 ressourceSelectionnee
//               )
//           )
//       );

//       setRessourceSelectionnee("");

//     } catch (error) {

//       console.error(
//         "Erreur suppression ressource :",
//         error
//       );

//       showMessage(
//         error.message ||
//           "Une erreur est survenue lors de la suppression.",
//         "error"
//       );

//     } finally {

//       setIsSubmitting(false);

//     }
//   };

//   /* =====================================================
//      SOUMISSION CRÉATION
     
//      LA LOGIQUE DE CRÉATION EST CONSERVÉE
//   ====================================================== */

//   const handleSubmit = async (
//     e
//   ) => {

//     e.preventDefault();

//     /*
//      * Ce submit ne concerne que la création.
//      * La suppression possède son propre bouton.
//      */

//     if (mode !== "create") {
//       return;
//     }

//     if (!code.trim()) {

//       showMessage(
//         "Le code de la ressource est requis.",
//         "error"
//       );

//       return;
//     }

//     if (!libelle.trim()) {

//       showMessage(
//         "Le libellé de la ressource est requis.",
//         "error"
//       );

//       return;
//     }

//     if (!promotionVersionId) {

//       showMessage(
//         "Veuillez sélectionner une promotion.",
//         "error"
//       );

//       return;
//     }

//     if (
//       tranchesSelectionnees.length ===
//       0
//     ) {

//       showMessage(
//         "Veuillez ajouter au moins une tranche à la règle.",
//         "error"
//       );

//       return;
//     }

//     const payload = {

//       code:
//         code.trim(),

//       libelle:
//         libelle.trim(),

//       id_promotion_version:
//         Number(
//           promotionVersionId
//         ),

//       tranche_id:
//         tranchesSelectionnees.map(
//           Number
//         ),
//     };

//     console.log(
//       "PAYLOAD CRÉATION :",
//       payload
//     );

//     setIsSubmitting(true);

//     try {

//       const result =
//         await createRessourceAccesAvecRegleService(
//           payload
//         );

//       console.log(
//         "RÉPONSE CRÉATION RESSOURCE :",
//         result
//       );

//       if (!result?.success) {

//         throw new Error(
//           result?.message ||
//             "La création de la ressource a échoué."
//         );
//       }

//       showMessage(
//         result.message ||
//           "Ressource et règle d'accès créées avec succès.",
//         "success"
//       );

//       resetForm();

//     } catch (error) {

//       console.error(
//         "Erreur lors de la création de la ressource :",
//         error
//       );

//       showMessage(
//         error.message ||
//           "Une erreur est survenue lors de la création.",
//         "error"
//       );

//     } finally {

//       setIsSubmitting(false);

//     }
//   };

//   /* =====================================================
//      RENDU
//   ====================================================== */

//   return (
//     <div className="gestion-ressources-wrapper">

//       <div className="gestion-ressources-card">

//         {/* =================================================
//             EN-TÊTE
//         ================================================= */}

//         <div className="gestion-ressources-header">

//           <div>

//             <h2>
//               Gestion des ressources d'accès
//             </h2>

//             <p>
//               Définissez les ressources accessibles
//               et les conditions financières requises.
//             </p>

//           </div>

//         </div>

//         {/* =================================================
//             MODE
//         ================================================= */}

//         <div className="access-mode-switch">

//           {/* CRÉATION */}

//           <button
//             type="button"
//             className={
//               mode === "create"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               handleChangeMode(
//                 "create"
//               )
//             }
//           >

//             <span className="mode-icon">
//               ＋
//             </span>

//             Création

//           </button>

//           {/* SUPPRESSION */}

//           <button
//             type="button"
//             className={
//               mode === "delete"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               handleChangeMode(
//                 "delete"
//               )
//             }
//           >

//             <span className="mode-icon">
//               ×
//             </span>

//             Suppression

//           </button>

//         </div>

//         {/* =================================================
//             MODE SUPPRESSION
//         ================================================= */}

//         {mode === "delete" && (

//           <>

//             {/* =================================================
//                 01 - PROMOTION
//             ================================================= */}

//             <div className="form-section edit-promotion-panel">

//               <div className="section-heading">

//                 <div className="section-number">
//                   01
//                 </div>

//                 <div>

//                   <h3>
//                     Promotion concernée
//                   </h3>

//                   <span>
//                     Sélectionnez la promotion contenant
//                     la ressource à supprimer.
//                   </span>

//                 </div>

//               </div>

//               <div className="field-group">

//                 <label>
//                   Promotion version
//                 </label>

//                 <select
//                   value={
//                     promotionVersionId
//                   }
//                   onChange={(e) =>
//                     setPromotionVersionId(
//                       e.target.value
//                     )
//                   }
//                   disabled={
//                     loadingPromotions ||
//                     isSubmitting
//                   }
//                 >

//                   <option value="">

//                     {loadingPromotions
//                       ? "Chargement des promotions..."
//                       : "Sélectionner une promotion"}

//                   </option>

//                   {!loadingPromotions &&
//                     promotionsVersions.map(
//                       (promotion) => (

//                         <option
//                           key={
//                             promotion.id_version
//                           }
//                           value={
//                             promotion.id_version
//                           }
//                         >

//                           {promotion.code_promotion
//                             ? `${promotion.code_promotion} • `
//                             : ""}

//                           {
//                             promotion.nom_promotion
//                           }

//                           {promotion.annee
//                             ? ` • ${promotion.annee}`
//                             : ""}

//                         </option>

//                       )
//                     )}

//                 </select>

//                 {promotionSelectionnee && (

//                   <div className="selected-promotion">

//                     <div className="promotion-check">
//                       ✓
//                     </div>

//                     <div>

//                       <strong>
//                         {
//                           promotionSelectionnee.nom_promotion
//                         }
//                       </strong>

//                     </div>

//                   </div>

//                 )}

//               </div>

//             </div>

//             {/* =================================================
//                 02 - RESSOURCE À SUPPRIMER
//             ================================================= */}

//             <div className="edit-resource-panel">

//               <div className="section-label">
//                 Ressource à supprimer
//               </div>

//               <select
//                 value={
//                   ressourceSelectionnee
//                 }
//                 onChange={
//                   handleSelectRessource
//                 }
//                 disabled={
//                   !promotionVersionId ||
//                   loadingRessources ||
//                   isSubmitting
//                 }
//               >

//                 <option value="">

//                   {!promotionVersionId
//                     ? "Sélectionner d'abord une promotion"
//                     : loadingRessources
//                     ? "Chargement des ressources..."
//                     : ressources.length === 0
//                     ? "Aucune ressource disponible"
//                     : "Sélectionner une ressource à supprimer"}

//                 </option>

//                 {!loadingRessources &&
//                   ressources.map(
//                     (ressource) => (

//                       <option
//                         key={
//                           ressource.id_ressource
//                         }
//                         value={
//                           ressource.id_ressource
//                         }
//                       >

//                         {ressource.code ??
//                           ressource.code_ressource ??
//                           ""}

//                         {" • "}

//                         {ressource.libelle ??
//                           ressource.nom ??
//                           ""}

//                       </option>

//                     )
//                   )}

//               </select>

//               {promotionVersionId &&
//                 loadingRessources && (

//                   <small>
//                     Récupération des ressources
//                     disponibles pour cette promotion...
//                   </small>

//                 )}

//               {ressourceCourante && (

//                 <div className="selected-promotion">

//                   <div className="promotion-check">
//                     ✓
//                   </div>

//                   <div>

//                     <strong>
//                       {ressourceCourante.code ??
//                         ressourceCourante.code_ressource ??
//                         ""}
//                     </strong>

//                     <span>
//                       {" "}
//                       •{" "}
//                       {ressourceCourante.libelle ??
//                         ressourceCourante.nom ??
//                         ""}
//                     </span>

//                   </div>

//                 </div>

//               )}

//             </div>

//             {/* =================================================
//                 AVERTISSEMENT
//             ================================================= */}

//             {ressourceCourante && (

//               <div className="rule-preview">

//                 <div className="preview-icon">
//                   !
//                 </div>

//                 <div className="preview-content">

//                   <span>
//                     SUPPRESSION DÉFINITIVE
//                   </span>

//                   <strong>

//                     {ressourceCourante.code ??
//                       ressourceCourante.code_ressource ??
//                       "RESSOURCE"}

//                     {" → "}

//                     {promotionSelectionnee
//                       ?.nom_promotion ||
//                       "Promotion"}

//                   </strong>

//                   <p>
//                     La suppression retirera la ressource,
//                     sa règle d'accès ainsi que toutes les
//                     associations de cette règle avec les
//                     tranches tarifaires.
//                   </p>

//                 </div>

//               </div>

//             )}

//             {/* =================================================
//                 BOUTON SUPPRIMER
//             ================================================= */}

//             <button
//               type="button"
//               className="submit-resource-btn modification"
//               onClick={
//                 handleDelete
//               }
//               disabled={
//                 isSubmitting ||
//                 !promotionVersionId ||
//                 !ressourceSelectionnee
//               }
//             >

//               {isSubmitting ? (

//                 <>

//                   <span className="button-spinner" />

//                   Suppression...

//                 </>

//               ) : (

//                 <>

//                   <span>
//                     ×
//                   </span>

//                   Supprimer la ressource

//                 </>

//               )}

//             </button>

//           </>

//         )}

//         {/* =================================================
//             MODE CRÉATION
//         ================================================= */}

//         {mode === "create" && (

//           <form
//             className="access-resource-form"
//             onSubmit={
//               handleSubmit
//             }
//           >

//             {/* =================================================
//                 INFORMATIONS RESSOURCE
//             ================================================= */}

//             <div className="form-section">

//               <div className="section-heading">

//                 <div className="section-number">
//                   01
//                 </div>

//                 <div>

//                   <h3>
//                     Ressource
//                   </h3>

//                   <span>
//                     Identifiez la ressource à protéger.
//                   </span>

//                 </div>

//               </div>

//               <div className="form-grid">

//                 <div className="field-group">

//                   <label>
//                     Code ressource
//                   </label>

//                   <input
//                     type="text"
//                     value={code}
//                     onChange={(e) =>
//                       setCode(
//                         e.target.value
//                       )
//                     }
//                     placeholder="Ex. RELEVE"
//                     maxLength={50}
//                   />

//                   <small>
//                     Code unique de la ressource.
//                   </small>

//                 </div>

//                 <div className="field-group">

//                   <label>
//                     Libellé
//                   </label>

//                   <input
//                     type="text"
//                     value={libelle}
//                     onChange={(e) =>
//                       setLibelle(
//                         e.target.value
//                       )
//                     }
//                     placeholder="Ex. Relevé de notes"
//                     maxLength={100}
//                   />

//                   <small>
//                     Nom affiché à l'administration.
//                   </small>

//                 </div>

//               </div>

//             </div>

//             {/* =================================================
//                 PROMOTION
//             ================================================= */}

//             <div className="form-section">

//               <div className="section-heading">

//                 <div className="section-number">
//                   02
//                 </div>

//                 <div>

//                   <h3>
//                     Promotion concernée
//                   </h3>

//                   <span>
//                     Déterminez à quelle version de
//                     promotion cette règle s'applique.
//                   </span>

//                 </div>

//               </div>

//               <div className="field-group">

//                 <label>
//                   Promotion version
//                 </label>

//                 <select
//                   value={
//                     promotionVersionId
//                   }
//                   onChange={(e) =>
//                     setPromotionVersionId(
//                       e.target.value
//                     )
//                   }
//                   disabled={
//                     loadingPromotions
//                   }
//                 >

//                   <option value="">

//                     {loadingPromotions
//                       ? "Chargement des promotions..."
//                       : "Sélectionner une promotion"}

//                   </option>

//                   {!loadingPromotions &&
//                     promotionsVersions.map(
//                       (promotion) => (

//                         <option
//                           key={
//                             promotion.id_version
//                           }
//                           value={
//                             promotion.id_version
//                           }
//                         >

//                           {promotion.code_promotion
//                             ? `${promotion.code_promotion} • `
//                             : ""}

//                           {
//                             promotion.nom_promotion
//                           }

//                           {promotion.annee
//                             ? ` • ${promotion.annee}`
//                             : ""}

//                         </option>

//                       )
//                     )}

//                 </select>

//                 {promotionSelectionnee && (

//                   <div className="selected-promotion">

//                     <div className="promotion-check">
//                       ✓
//                     </div>

//                     <div>

//                       <strong>
//                         {
//                           promotionSelectionnee.nom_promotion
//                         }
//                       </strong>

//                     </div>

//                   </div>

//                 )}

//               </div>

//             </div>

//             {/* =================================================
//                 TRANCHES
//             ================================================= */}

//             <div className="form-section">

//               <div className="section-heading">

//                 <div className="section-number">
//                   03
//                 </div>

//                 <div>

//                   <h3>
//                     Conditions financières
//                   </h3>

//                   <span>
//                     Ajoutez toutes les tranches nécessaires
//                     pour accéder à la ressource.
//                   </span>

//                 </div>

//               </div>

//               <div className="tranche-selector">

//                 <div className="field-group">

//                   <label>
//                     Tranche tarifaire
//                   </label>

//                   <select
//                     value={
//                       trancheSelectionnee
//                     }
//                     onChange={(e) =>
//                       setTrancheSelectionnee(
//                         e.target.value
//                       )
//                     }
//                     disabled={
//                       !promotionVersionId ||
//                       loadingTarifs
//                     }
//                   >

//                     <option value="">

//                       {!promotionVersionId
//                         ? "Sélectionner d'abord une promotion"
//                         : loadingTarifs
//                         ? "Chargement des tarifs et tranches..."
//                         : tranchesDisponibles.length === 0
//                         ? "Aucune tranche disponible"
//                         : "Sélectionner une tranche"}

//                     </option>

//                     {!loadingTarifs &&
//                       tranchesDisponibles.map(
//                         (tranche) => (

//                           <option
//                             key={
//                               tranche.id_tranche
//                             }
//                             value={
//                               tranche.id_tranche
//                             }
//                           >

//                             {tranche.type_tarif}

//                             {" • "}

//                             {tranche.libelle}

//                             {" • "}

//                             {Number(
//                               tranche.montant
//                             ).toLocaleString(
//                               "fr-FR"
//                             )}

//                             {" FC"}

//                           </option>

//                         )
//                       )}

//                   </select>

//                 </div>

//                 <button
//                   type="button"
//                   className="add-tranche-btn"
//                   onClick={
//                     handleAjouterTranche
//                   }
//                   disabled={
//                     !trancheSelectionnee ||
//                     loadingTarifs
//                   }
//                 >

//                   <span>
//                     ＋
//                   </span>

//                   Ajouter

//                 </button>

//               </div>

//               {/* =================================================
//                   APERÇU DES TRANCHES
//               ================================================= */}

//               <div className="selected-tranches-container">

//                 <div className="selected-tranches-header">

//                   <div>

//                     <span className="mini-label">
//                       CONDITIONS SÉLECTIONNÉES
//                     </span>

//                     <h4>
//                       Tranches requises
//                     </h4>

//                   </div>

//                   <div className="tranche-counter">

//                     {
//                       tranchesSelectionnees.length
//                     }

//                   </div>

//                 </div>

//                 {loadingTarifs ? (

//                   <div className="empty-tranches">

//                     <p>
//                       Chargement des tarifs...
//                     </p>

//                     <span>
//                       Récupération des tarifs et
//                       tranches de la promotion
//                       sélectionnée.
//                     </span>

//                   </div>

//                 ) : tranchesSelectionnees.length ===
//                   0 ? (

//                   <div className="empty-tranches">

//                     <p>
//                       Aucune tranche sélectionnée
//                     </p>

//                     <span>
//                       Ajoutez les tranches que
//                       l'étudiant devra avoir
//                       payées et validées.
//                     </span>

//                   </div>

//                 ) : (

//                   <div className="tranches-list">

//                     {tranchesSelectionnees.map(
//                       (
//                         idTranche,
//                         index
//                       ) => {

//                         let tranche =
//                           null;

//                         for (
//                           const tarif of tarifs
//                         ) {

//                           if (
//                             !Array.isArray(
//                               tarif.tranches
//                             )
//                           ) {
//                             continue;
//                           }

//                           const trouvee =
//                             tarif.tranches.find(
//                               (item) =>
//                                 Number(
//                                   item.id_tranche
//                                 ) ===
//                                 Number(
//                                   idTranche
//                                 )
//                             );

//                           if (
//                             trouvee
//                           ) {

//                             tranche = {
//                               ...trouvee,

//                               tarif_id:
//                                 tarif.id_tarif,

//                               type_tarif:
//                                 tarif.type_tarif,

//                               montant_tarif:
//                                 tarif.montant,
//                             };

//                             break;
//                           }
//                         }

//                         if (
//                           !tranche
//                         ) {
//                           return null;
//                         }

//                         return (

//                           <div
//                             className="tranche-item"
//                             key={
//                               idTranche
//                             }
//                           >

//                             <div className="tranche-index">
//                               {index + 1}
//                             </div>

//                             <div className="tranche-main">

//                               <strong>
//                                 {
//                                   tranche.type_tarif
//                                 }
//                               </strong>

//                               <span>
//                                 {
//                                   tranche.libelle
//                                 }
//                               </span>

//                             </div>

//                             <div className="tranche-amount">

//                               {Number(
//                                 tranche.montant
//                               ).toLocaleString(
//                                 "fr-FR"
//                               )}

//                               {" FC"}

//                             </div>

//                             <button
//                               type="button"
//                               className="remove-tranche-btn"
//                               onClick={() =>
//                                 handleRetirerTranche(
//                                   idTranche
//                                 )
//                               }
//                               title="Retirer"
//                             >
//                               ×
//                             </button>

//                           </div>

//                         );
//                       }
//                     )}

//                     <div className="tranches-total">

//                       <span>
//                         Total des conditions
//                       </span>

//                       <strong>

//                         {montantTotal.toLocaleString(
//                           "fr-FR"
//                         )}

//                         {" FC"}

//                       </strong>

//                     </div>

//                   </div>

//                 )}

//               </div>

//             </div>

//             {/* =================================================
//                 RÉSUMÉ
//             ================================================= */}

//             <div className="rule-preview">

//               <div className="preview-icon">
//                 ✓
//               </div>

//               <div className="preview-content">

//                 <span>
//                   APERÇU DE LA RÈGLE
//                 </span>

//                 <strong>

//                   {code ||
//                     "CODE_RESSOURCE"}

//                   {" → "}

//                   {promotionSelectionnee
//                     ?.nom_promotion ||
//                     "Promotion non sélectionnée"}

//                 </strong>

//                 <p>

//                   L'accès nécessitera la validation
//                   de{" "}

//                   <b>
//                     {
//                       tranchesSelectionnees.length
//                     }
//                   </b>{" "}

//                   tranche
//                   {tranchesSelectionnees.length >
//                   1
//                     ? "s"
//                     : ""}{" "}

//                   sélectionnée
//                   {tranchesSelectionnees.length >
//                   1
//                     ? "s"
//                     : ""}.

//                 </p>

//               </div>

//             </div>

//             {/* =================================================
//                 CRÉER
//             ================================================= */}

//             <button
//               type="submit"
//               className="submit-resource-btn"
//               disabled={
//                 isSubmitting
//               }
//             >

//               {isSubmitting ? (

//                 <>

//                   <span className="button-spinner" />

//                   Traitement...

//                 </>

//               ) : (

//                 <>

//                   <span>
//                     ✓
//                   </span>

//                   Créer la ressource et la règle

//                 </>

//               )}

//             </button>

//           </form>

//         )}

//       </div>

//       {/* =====================================================
//           NOTIFICATION
//       ====================================================== */}

//       {message && (

//         <div
//           className={`resource-notification ${messageType}`}
//         >

//           <span className="notification-icon">

//             {messageType === "success"
//               ? "✓"
//               : "!"}

//           </span>

//           <span>
//             {message}
//           </span>

//         </div>

//       )}

//     </div>
//   );
// };

// export default RessourcesAcces;




import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./RessourcesAcces.css";

import {
  getPromotionsService,
  getTarifsTranchesByPromotionVersionService,
  createRessourceAccesAvecRegleService,
  getRessourcesAccesByPromotionVersionService,
  deleteRessourceAccesByPromotionService,
} from "./ressourcesAccesService"; 

/* =========================================================
   CODES DES RESSOURCES
========================================================= */



const CODES_RESSOURCES = [
  {
    code: "RESULTAT_PREMIER_SEMESTRE",
    libelle: "Résultat premier semestre",
  },
  
  {
    code: "RESULTAT_ANNUEL",
    libelle: "Résultat annuel",
  },
 
  { 
    code: "RELEVE_DE_NOTES",
    libelle: "Relevé de notes",
  },
  {
    code: "ATTESTATION_LICENCE",
    libelle: "Attestation de réussite licence",
  },
  {
    code: "ATTESTATION_MASTER",
    libelle: "Attestation de réussite master",
  },
  {
    code: "DIPLOME_LICENCE",
    libelle: "Diplôme licence",
  },
  {
    code: "DIPLOME_MASTER",
    libelle: "Diplôme master",
  },
  {
    code: "LETTRE_DE_STAGE_LICENCE",
    libelle: "Lettre de stage licence",
  },
  {
    code: "LETTRE_DE_STAGE_MASTER",
    libelle: "Lettre de stage master",
  },

];

/* =========================================================
   COMPOSANT
========================================================= */

const RessourcesAcces = ({ code_mention }) => {
  /* =====================================================
     MODE
  ====================================================== */

  const [mode, setMode] = useState("create");

  /* =====================================================
     PROMOTIONS
  ====================================================== */

  const [promotionsVersions, setPromotionsVersions] =
    useState([]);

  const [loadingPromotions, setLoadingPromotions] =
    useState(false);

  /* =====================================================
     TARIFS / TRANCHES
  ====================================================== */

  const [tarifs, setTarifs] = useState([]);

  const [loadingTarifs, setLoadingTarifs] =
    useState(false);

  /* =====================================================
     FORMULAIRE CRÉATION
  ====================================================== */

  const [code, setCode] = useState("");
  const [libelle, setLibelle] = useState("");

  const [promotionVersionId, setPromotionVersionId] =
    useState("");

  const [trancheSelectionnee, setTrancheSelectionnee] =
    useState("");

  const [tranchesSelectionnees, setTranchesSelectionnees] =
    useState([]);

  /* =====================================================
     SUPPRESSION
  ====================================================== */

  const [ressourceSelectionnee, setRessourceSelectionnee] =
    useState("");

  const [ressources, setRessources] =
    useState([]);

  const [loadingRessources, setLoadingRessources] =
    useState(false);

  /* =====================================================
     NOTIFICATION
  ====================================================== */

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* =====================================================
     ÉTAT CHARGEMENT
  ====================================================== */

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* =====================================================
     AFFICHER MESSAGE
  ====================================================== */

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

  /* =====================================================
     CHARGER LES PROMOTIONS

     LOGIQUE CONSERVÉE
  ====================================================== */

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        setLoadingPromotions(true);

        const promoData =
          await getPromotionsService({
            code_mention,
          });

        const promos =
          promoData?.data ||
          promoData ||
          [];

        setPromotionsVersions(
          Array.isArray(promos)
            ? promos
            : []
        );

      } catch (error) {
        console.error(
          "Erreur chargement promotions :",
          error
        );

        setPromotionsVersions([]);

        showMessage(
          error.message ||
            "Erreur lors du chargement des promotions.",
          "error"
        );

      } finally {
        setLoadingPromotions(false);
      }
    };

    loadPromotions();
  }, [code_mention]);

  /* =====================================================
     CHARGER TARIFS ET TRANCHES

     CONSERVÉ POUR LA CRÉATION
  ====================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadTarifsTranches = async () => {

      if (!promotionVersionId) {
        setTarifs([]);
        setTrancheSelectionnee("");
        setTranchesSelectionnees([]);
        setLoadingTarifs(false);

        return;
      }

      try {
        setLoadingTarifs(true);

        setTarifs([]);

        setTrancheSelectionnee("");
        setTranchesSelectionnees([]);

        const tarifsData =
          await getTarifsTranchesByPromotionVersionService({
            promotion_version_id:
              Number(promotionVersionId),
          });

        if (cancelled) {
          return;
        }

        const tarifsBackend =
          tarifsData?.data?.tarifs || [];

        setTarifs(
          Array.isArray(tarifsBackend)
            ? tarifsBackend
            : []
        );

      } catch (error) {

        if (cancelled) {
          return;
        }

        console.error(
          "Erreur chargement tarifs et tranches :",
          error
        );

        setTarifs([]);

        setTrancheSelectionnee("");
        setTranchesSelectionnees([]);

        showMessage(
          error.message ||
            "Erreur lors du chargement des tarifs et tranches.",
          "error"
        );

      } finally {

        if (!cancelled) {
          setLoadingTarifs(false);
        }

      }
    };

    /*
     * En mode suppression, les tarifs ne sont pas
     * nécessaires.
     *
     * On les conserve uniquement pour la création.
     */
    if (mode === "create") {
      loadTarifsTranches();
    } else {
      setTarifs([]);
      setTrancheSelectionnee("");
      setTranchesSelectionnees([]);
      setLoadingTarifs(false);
    }

    return () => {
      cancelled = true;
    };

  }, [promotionVersionId, mode]);

  /* =====================================================
     CHARGER LES RESSOURCES

     MODE SUPPRESSION UNIQUEMENT
  ====================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadRessources = async () => {

      if (mode !== "delete") {
        setRessources([]);
        setRessourceSelectionnee("");
        setLoadingRessources(false);

        return;
      }

      if (!promotionVersionId) {
        setRessources([]);
        setRessourceSelectionnee("");
        setLoadingRessources(false);

        return;
      }

      try {

        setLoadingRessources(true);

        setRessources([]);
        setRessourceSelectionnee("");

        const ressourcesData =
          await getRessourcesAccesByPromotionVersionService({
            promotion_version_id:
              Number(promotionVersionId),
          });

        if (cancelled) {
          return;
        }

        const ressourcesBackend =
          ressourcesData?.data?.ressources ??
          ressourcesData?.data ??
          [];

        setRessources(
          Array.isArray(ressourcesBackend)
            ? ressourcesBackend
            : []
        );

      } catch (error) {

        if (cancelled) {
          return;
        }

        console.error(
          "Erreur chargement ressources d'accès :",
          error
        );

        setRessources([]);
        setRessourceSelectionnee("");

        showMessage(
          error.message ||
            "Erreur lors du chargement des ressources disponibles.",
          "error"
        );

      } finally {

        if (!cancelled) {
          setLoadingRessources(false);
        }

      }
    };

    loadRessources();

    return () => {
      cancelled = true;
    };

  }, [
    mode,
    promotionVersionId,
  ]);

  /* =====================================================
     PROMOTION SÉLECTIONNÉE
  ====================================================== */

  const promotionSelectionnee = useMemo(() => {

    return promotionsVersions.find(
      (promotion) =>
        String(promotion.id_version) ===
        String(promotionVersionId)
    );

  }, [
    promotionsVersions,
    promotionVersionId,
  ]);

  /* =====================================================
     RESSOURCE SÉLECTIONNÉE
  ====================================================== */

  const ressourceCourante = useMemo(() => {

    if (!ressourceSelectionnee) {
      return null;
    }

    return ressources.find(
      (ressource) =>
        String(ressource.id_ressource) ===
        String(ressourceSelectionnee)
    ) || null;

  }, [
    ressources,
    ressourceSelectionnee,
  ]);

  /* =====================================================
     TRANCHES DISPONIBLES
  ====================================================== */

  const tranchesDisponibles = useMemo(() => {

    const tranches = [];

    tarifs.forEach((tarif) => {

      if (!Array.isArray(tarif.tranches)) {
        return;
      }

      tarif.tranches.forEach((tranche) => {

        tranches.push({
          ...tranche,

          tarif_id:
            tarif.id_tarif,

          type_tarif:
            tarif.type_tarif,

          montant_tarif:
            tarif.montant,
        });

      });

    });

    return tranches.filter(
      (tranche) =>
        !tranchesSelectionnees.some(
          (id) =>
            String(id) ===
            String(tranche.id_tranche)
        )
    );

  }, [
    tarifs,
    tranchesSelectionnees,
  ]);

  /* =====================================================
     TOTAL DES TRANCHES
  ====================================================== */

  const montantTotal = useMemo(() => {

    return tranchesSelectionnees.reduce(
      (total, idTranche) => {

        let trancheTrouvee = null;

        for (const tarif of tarifs) {

          if (
            !Array.isArray(
              tarif.tranches
            )
          ) {
            continue;
          }

          const tranche =
            tarif.tranches.find(
              (item) =>
                String(
                  item.id_tranche
                ) ===
                String(idTranche)
            );

          if (tranche) {

            trancheTrouvee =
              tranche;

            break;
          }

        }

        return (
          total +
          Number(
            trancheTrouvee?.montant ||
              0
          )
        );

      },
      0
    );

  }, [
    tarifs,
    tranchesSelectionnees,
  ]);

  /* =====================================================
     AJOUTER UNE TRANCHE

     LOGIQUE CRÉATION CONSERVÉE
  ====================================================== */

  const handleAjouterTranche = () => {

    if (!trancheSelectionnee) {

      showMessage(
        "Veuillez sélectionner une tranche tarifaire.",
        "error"
      );

      return;
    }

    if (
      tranchesSelectionnees.some(
        (id) =>
          String(id) ===
          String(trancheSelectionnee)
      )
    ) {

      showMessage(
        "Cette tranche est déjà ajoutée.",
        "error"
      );

      return;
    }

    setTranchesSelectionnees(
      (previous) => [
        ...previous,
        Number(
          trancheSelectionnee
        ),
      ]
    );

    setTrancheSelectionnee("");

    showMessage(
      "Tranche ajoutée à la règle.",
      "success"
    );
  };

  /* =====================================================
     RETIRER UNE TRANCHE
  ====================================================== */

  const handleRetirerTranche = (
    idTranche
  ) => {

    setTranchesSelectionnees(
      (previous) =>
        previous.filter(
          (id) =>
            String(id) !==
            String(idTranche)
        )
    );
  };

  /* =====================================================
     SÉLECTIONNER UNE RESSOURCE

     SUPPRESSION UNIQUEMENT

     Aucun détail n'est chargé dans le formulaire.
  ====================================================== */

  const handleSelectRessource = (
    e
  ) => {

    const id =
      e.target.value;

    setRessourceSelectionnee(id);
  };

  /* =====================================================
     CHANGEMENT DE MODE
  ====================================================== */

  const handleChangeMode = (
    nouveauMode
  ) => {

    setMode(
      nouveauMode
    );

    /*
     * On nettoie les états dépendants,
     * mais la logique de création reste intacte.
     */
    setCode("");
   
    setPromotionVersionId("");
    setTrancheSelectionnee("");
    setTranchesSelectionnees([]);

    setRessources([]);
    setRessourceSelectionnee("");

    setMessage("");
    setMessageType("");
  };

  /* =====================================================
     RESET
  ====================================================== */

  const resetForm = () => {

    setCode("");
   
    setPromotionVersionId("");
    setTrancheSelectionnee("");
    setTranchesSelectionnees([]);
    setRessourceSelectionnee("");
    setRessources([]);
  };

  /* =====================================================
     SUPPRIMER LA RESSOURCE
  ====================================================== */

  const handleDelete = async () => {

    if (!promotionVersionId) {

      showMessage(
        "Veuillez sélectionner une promotion.",
        "error"
      );

      return;
    }

    if (!ressourceSelectionnee) {

      showMessage(
        "Veuillez sélectionner une ressource à supprimer.",
        "error"
      );

      return;
    }

    const ressource =
      ressources.find(
        (item) =>
          String(
            item.id_ressource
          ) ===
          String(
            ressourceSelectionnee
          )
      );

    if (!ressource) {

      showMessage(
        "Ressource introuvable.",
        "error"
      );

      return;
    }

    const confirmation =
      window.confirm(
        `Voulez-vous vraiment supprimer la ressource "${ressource.code ?? ""} • ${ressource.libelle ?? ""}" ?\n\nCette opération supprimera également sa règle d'accès et toutes ses associations avec les tranches.`
      );

    if (!confirmation) {
      return;
    }

    setIsSubmitting(true);

    try {

      const result =
        await deleteRessourceAccesByPromotionService({
          promotion_version_id:
            Number(
              promotionVersionId
            ),

          ressource_id:
            Number(
              ressourceSelectionnee
            ),
        });

      if (!result?.success) {

        throw new Error(
          result?.message ||
            "La suppression de la ressource a échoué."
        );
      }

      showMessage(
        result.message ||
          "Ressource d'accès supprimée avec succès.",
        "success"
      );

      /*
       * On retire immédiatement la ressource
       * de la liste sans recharger inutilement
       * toute la page.
       */
      setRessources(
        (previous) =>
          previous.filter(
            (item) =>
              String(
                item.id_ressource
              ) !==
              String(
                ressourceSelectionnee
              )
          )
      );

      setRessourceSelectionnee("");

    } catch (error) {

      console.error(
        "Erreur suppression ressource :",
        error
      );

      showMessage(
        error.message ||
          "Une erreur est survenue lors de la suppression.",
        "error"
      );

    } finally {

      setIsSubmitting(false);

    }
  };

  /* =====================================================
     SOUMISSION CRÉATION

     LA LOGIQUE DE CRÉATION EST CONSERVÉE
  ====================================================== */

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    /*
     * Ce submit ne concerne que la création.
     * La suppression possède son propre bouton.
     */

    if (mode !== "create") {
      return;
    }

    if (!code.trim()) {

      showMessage(
        "Le code de la ressource est requis.",
        "error"
      );

      return;
    }

    // if (!libelle.trim()) {

    //   showMessage(
    //     "Le libellé de la ressource est requis.",
    //     "error"
    //   );

    //   return;
    // }

    if (!promotionVersionId) {

      showMessage(
        "Veuillez sélectionner une promotion.",
        "error"
      );

      return;
    }

    if (
      tranchesSelectionnees.length ===
      0
    ) {

      showMessage(
        "Veuillez ajouter au moins une tranche à la règle.",
        "error"
      );

      return;
    }

    const payload = {

      code:
        code.trim(),

      id_promotion_version:
        Number(
          promotionVersionId
        ),

      tranche_id:
        tranchesSelectionnees.map(
          Number
        ),
    };

    console.log(
      "PAYLOAD CRÉATION :",
      payload
    );

    setIsSubmitting(true);

    try {

      const result =
        await createRessourceAccesAvecRegleService(
          payload
        );

      console.log(
        "RÉPONSE CRÉATION RESSOURCE :",
        result
      );

      if (!result?.success) {

        throw new Error(
          result?.message ||
            "La création de la ressource a échoué."
        );
      }

      showMessage(
        result.message ||
          "Ressource et règle d'accès créées avec succès.",
        "success"
      );

      resetForm();

    } catch (error) {

      console.error(
        "Erreur lors de la création de la ressource :",
        error
      );

      showMessage(
        error.message ||
          "Une erreur est survenue lors de la création.",
        "error"
      );

    } finally {

      setIsSubmitting(false);

    }
  };

  /* =====================================================
     RENDU
  ====================================================== */

  return (
    <div className="gestion-ressources-wrapper">

      <div className="gestion-ressources-card">

        {/* =================================================
            EN-TÊTE
        ================================================= */}

        <div className="gestion-ressources-header">

          <div>

            <h2>
              Gestion des ressources d'accès
            </h2>

            <p>
              Définissez les ressources accessibles
              et les conditions financières requises.
            </p>

          </div>

        </div>

        {/* =================================================
            MODE
        ================================================= */}

        <div className="access-mode-switch">

          {/* CRÉATION */}

          <button
            type="button"
            className={
              mode === "create"
                ? "active"
                : ""
            }
            onClick={() =>
              handleChangeMode(
                "create"
              )
            }
          >

            <span className="mode-icon">
              ＋
            </span>

            Création

          </button>

          {/* SUPPRESSION */}

          <button
            type="button"
            className={
              mode === "delete"
                ? "active"
                : ""
            }
            onClick={() =>
              handleChangeMode(
                "delete"
              )
            }
          >

            <span className="mode-icon">
              ×
            </span>

            Suppression

          </button>

        </div>

        {/* =================================================
            MODE SUPPRESSION
        ================================================= */}

        {mode === "delete" && (

          <>

            {/* =================================================
                01 - PROMOTION
            ================================================= */}

            <div className="form-section edit-promotion-panel">

              <div className="section-heading">

                <div className="section-number">
                  01
                </div>

                <div>

                  <h3>
                    Promotion concernée
                  </h3>

                  <span>
                    Sélectionnez la promotion contenant
                    la ressource à supprimer.
                  </span>

                </div>

              </div>

              <div className="field-group">

                <label>
                  Promotion version
                </label>

                <select
                  value={
                    promotionVersionId
                  }
                  onChange={(e) =>
                    setPromotionVersionId(
                      e.target.value
                    )
                  }
                  disabled={
                    loadingPromotions ||
                    isSubmitting
                  }
                >

                  <option value="">

                    {loadingPromotions
                      ? "Chargement des promotions..."
                      : "Sélectionner une promotion"}

                  </option>

                  {!loadingPromotions &&
                    promotionsVersions.map(
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
                            ? `${promotion.code_promotion} • `
                            : ""}

                          {
                            promotion.nom_promotion
                          }

                          {promotion.annee
                            ? ` • ${promotion.annee}`
                            : ""}

                        </option>

                      )
                    )}

                </select>

                {promotionSelectionnee && (

                  <div className="selected-promotion">

                    <div className="promotion-check">
                      ✓
                    </div>

                    <div>

                      <strong>
                        {
                          promotionSelectionnee.nom_promotion
                        }
                      </strong>

                    </div>

                  </div>

                )}

              </div>

            </div>

            {/* =================================================
                02 - RESSOURCE À SUPPRIMER
            ================================================= */}

            <div className="edit-resource-panel">

              <div className="section-label">
                Ressource à supprimer
              </div>

              <select
                value={
                  ressourceSelectionnee
                }
                onChange={
                  handleSelectRessource
                }
                disabled={
                  !promotionVersionId ||
                  loadingRessources ||
                  isSubmitting
                }
              >

                <option value="">

                  {!promotionVersionId
                    ? "Sélectionner d'abord une promotion"
                    : loadingRessources
                    ? "Chargement des ressources..."
                    : ressources.length === 0
                    ? "Aucune ressource disponible"
                    : "Sélectionner une ressource à supprimer"}

                </option>

                {!loadingRessources &&
                  ressources.map(
                    (ressource) => (

                      <option
                        key={
                          ressource.id_ressource
                        }
                        value={
                          ressource.id_ressource
                        }
                      >

                        {ressource.code ??
                          ressource.code_ressource ??
                          ""}

                        {" • "}

                        {ressource.libelle ??
                          ressource.nom ??
                          ""}

                      </option>

                    )
                  )}

              </select>

              {promotionVersionId &&
                loadingRessources && (

                  <small>
                    Récupération des ressources
                    disponibles pour cette promotion...
                  </small>

                )}

              {ressourceCourante && (

                <div className="selected-promotion">

                  <div className="promotion-check">
                    ✓
                  </div>

                  <div>

                    <strong>
                      {ressourceCourante.code ??
                        ressourceCourante.code_ressource ??
                        ""}
                    </strong>

                    <span>
                      {" "}
                      •{" "}
                      {ressourceCourante.code ??
                        ressourceCourante.code ??
                        ""}
                    </span>

                  </div>

                </div>

              )}

            </div>

            {/* =================================================
                AVERTISSEMENT
            ================================================= */}

            {ressourceCourante && (

              <div className="rule-preview">

                <div className="preview-icon">
                  !
                </div>

                <div className="preview-content">

                  <span>
                    SUPPRESSION DÉFINITIVE
                  </span>

                  <strong>

                    {ressourceCourante.code ??
                      ressourceCourante.code_ressource ??
                      "RESSOURCE"}

                    {" → "}

                    {promotionSelectionnee
                      ?.nom_promotion ||
                      "Promotion"}

                  </strong>

                  <p>
                    La suppression retirera la ressource,
                    sa règle d'accès ainsi que toutes les
                    associations de cette règle avec les
                    tranches tarifaires.
                  </p>

                </div>

              </div>

            )}

            {/* =================================================
                BOUTON SUPPRIMER
            ================================================= */}

            <button
              type="button"
              className="submit-resource-btn modification"
              onClick={
                handleDelete
              }
              disabled={
                isSubmitting ||
                !promotionVersionId ||
                !ressourceSelectionnee
              }
            >

              {isSubmitting ? (

                <>

                  <span className="button-spinner" />

                  Suppression...

                </>

              ) : (

                <>

                  <span>
                    ×
                  </span>

                  Supprimer la ressource

                </>

              )}

            </button>

          </>

        )}

        {/* =================================================
            MODE CRÉATION
        ================================================= */}

        {mode === "create" && (

          <form
            className="access-resource-form"
            onSubmit={
              handleSubmit
            }
          >

            {/* =================================================
                INFORMATIONS RESSOURCE
            ================================================= */}

            <div className="form-section">

              <div className="section-heading">

                <div className="section-number">
                  01
                </div>

                <div>

                  <h3>
                    Ressource
                  </h3>

                  <span>
                    Identifiez la ressource à protéger.
                  </span>

                </div>

              </div>

              <div className="form-grid">

                <div className="field-group">

                  <label>
                    Code ressource
                  </label>

                  <select
                    value={code}
                    onChange={(e) =>
                      setCode(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Sélectionner un code ressource
                    </option>

                    {CODES_RESSOURCES.map(
                      (ressource) => (

                        <option
                          key={ressource.code}
                          value={ressource.code}
                        >
                          {ressource.libelle}
                        </option>

                      )
                    )}

                  </select>

                  <small>
                    Sélectionnez le code correspondant à la ressource.
                  </small>

                </div>

              </div>

            </div>

            {/* =================================================
                PROMOTION
            ================================================= */}

            <div className="form-section">

              <div className="section-heading">

                <div className="section-number">
                  02
                </div>

                <div>

                  <h3>
                    Promotion concernée
                  </h3>

                  <span>
                    Déterminez à quelle version de
                    promotion cette règle s'applique.
                  </span>

                </div>

              </div>

              <div className="field-group">

                <label>
                  Promotion version
                </label>

                <select
                  value={
                    promotionVersionId
                  }
                  onChange={(e) =>
                    setPromotionVersionId(
                      e.target.value
                    )
                  }
                  disabled={
                    loadingPromotions
                  }
                >

                  <option value="">

                    {loadingPromotions
                      ? "Chargement des promotions..."
                      : "Sélectionner une promotion"}

                  </option>

                  {!loadingPromotions &&
                    promotionsVersions.map(
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
                            ? `${promotion.code_promotion} • `
                            : ""}

                          {
                            promotion.nom_promotion
                          }

                          {promotion.annee
                            ? ` • ${promotion.annee}`
                            : ""}

                        </option>

                      )
                    )}

                </select>

                {promotionSelectionnee && (

                  <div className="selected-promotion">

                    <div className="promotion-check">
                      ✓
                    </div>

                    <div>

                      <strong>
                        {
                          promotionSelectionnee.nom_promotion
                        }
                      </strong>

                    </div>

                  </div>

                )}

              </div>

            </div>

            {/* =================================================
                TRANCHES
            ================================================= */}

            <div className="form-section">

              <div className="section-heading">

                <div className="section-number">
                  03
                </div>

                <div>

                  <h3>
                    Conditions financières
                  </h3>

                  <span>
                    Ajoutez toutes les tranches nécessaires
                    pour accéder à la ressource.
                  </span>

                </div>

              </div>

              <div className="tranche-selector">

                <div className="field-group">

                  <label>
                    Tranche tarifaire
                  </label>

                  <select
                    value={
                      trancheSelectionnee
                    }
                    onChange={(e) =>
                      setTrancheSelectionnee(
                        e.target.value
                      )
                    }
                    disabled={
                      !promotionVersionId ||
                      loadingTarifs
                    }
                  >

                    <option value="">

                      {!promotionVersionId
                        ? "Sélectionner d'abord une promotion"
                        : loadingTarifs
                        ? "Chargement des tarifs et tranches..."
                        : tranchesDisponibles.length === 0
                        ? "Aucune tranche disponible"
                        : "Sélectionner une tranche"}

                    </option>

                    {!loadingTarifs &&
                      tranchesDisponibles.map(
                        (tranche) => (

                          <option
                            key={
                              tranche.id_tranche
                            }
                            value={
                              tranche.id_tranche
                            }
                          >

                            {tranche.type_tarif}

                            {" • "}

                            {tranche.libelle}

                            {" • "}

                            {Number(
                              tranche.montant
                            ).toLocaleString(
                              "fr-FR"
                            )}

                            {" FC"}

                          </option>

                        )
                      )}

                  </select>

                </div>

                <button
                  type="button"
                  className="add-tranche-btn"
                  onClick={
                    handleAjouterTranche
                  }
                  disabled={
                    !trancheSelectionnee ||
                    loadingTarifs
                  }
                >

                  <span>
                    ＋
                  </span>

                  Ajouter

                </button>

              </div>

              {/* =================================================
                  APERÇU DES TRANCHES
              ================================================= */}

              <div className="selected-tranches-container">

                <div className="selected-tranches-header">

                  <div>

                    <span className="mini-label">
                      CONDITIONS SÉLECTIONNÉES
                    </span>

                    <h4>
                      Tranches requises
                    </h4>

                  </div>

                  <div className="tranche-counter">

                    {
                      tranchesSelectionnees.length
                    }

                  </div>

                </div>

                {loadingTarifs ? (

                  <div className="empty-tranches">

                    <p>
                      Chargement des tarifs...
                    </p>

                    <span>
                      Récupération des tarifs et
                      tranches de la promotion
                      sélectionnée.
                    </span>

                  </div>

                ) : tranchesSelectionnees.length ===
                  0 ? (

                  <div className="empty-tranches">

                    <p>
                      Aucune tranche sélectionnée
                    </p>

                    <span>
                      Ajoutez les tranches que
                      l'étudiant devra avoir
                      payées et validées.
                    </span>

                  </div>

                ) : (

                  <div className="tranches-list">

                    {tranchesSelectionnees.map(
                      (
                        idTranche,
                        index
                      ) => {

                        let tranche =
                          null;

                        for (
                          const tarif of tarifs
                        ) {

                          if (
                            !Array.isArray(
                              tarif.tranches
                            )
                          ) {
                            continue;
                          }

                          const trouvee =
                            tarif.tranches.find(
                              (item) =>
                                Number(
                                  item.id_tranche
                                ) ===
                                Number(
                                  idTranche
                                )
                            );

                          if (
                            trouvee
                          ) {

                            tranche = {
                              ...trouvee,

                              tarif_id:
                                tarif.id_tarif,

                              type_tarif:
                                tarif.type_tarif,

                              montant_tarif:
                                tarif.montant,
                            };

                            break;
                          }
                        }

                        if (
                          !tranche
                        ) {
                          return null;
                        }

                        return (

                          <div
                            className="tranche-item"
                            key={
                              idTranche
                            }
                          >

                            <div className="tranche-index">
                              {index + 1}
                            </div>

                            <div className="tranche-main">

                              <strong>
                                {
                                  tranche.type_tarif
                                }
                              </strong>

                              <span>
                                {
                                  tranche.libelle
                                }
                              </span>

                            </div>

                            <div className="tranche-amount">

                              {Number(
                                tranche.montant
                              ).toLocaleString(
                                "fr-FR"
                              )}

                              {" FC"}

                            </div>

                            <button
                              type="button"
                              className="remove-tranche-btn"
                              onClick={() =>
                                handleRetirerTranche(
                                  idTranche
                                )
                              }
                              title="Retirer"
                            >
                              ×
                            </button>

                          </div>

                        );
                      }
                    )}

                    <div className="tranches-total">

                      <span>
                        Total des conditions
                      </span>

                      <strong>

                        {montantTotal.toLocaleString(
                          "fr-FR"
                        )}

                        {" FC"}

                      </strong>

                    </div>

                  </div>

                )}

              </div>

            </div>

            {/* =================================================
                RÉSUMÉ
            ================================================= */}

            <div className="rule-preview">

              <div className="preview-icon">
                ✓
              </div>

              <div className="preview-content">

                <span>
                  APERÇU DE LA RÈGLE
                </span>

                <strong>

                  {code ||
                    "CODE_RESSOURCE"}

                  {" → "}

                  {promotionSelectionnee
                    ?.nom_promotion ||
                    "Promotion non sélectionnée"}

                </strong>

                <p>

                  L'accès nécessitera la validation
                  de{" "}

                  <b>
                    {
                      tranchesSelectionnees.length
                    }
                  </b>{" "}

                  tranche
                  {tranchesSelectionnees.length >
                  1
                    ? "s"
                    : ""}{" "}

                  sélectionnée
                  {tranchesSelectionnees.length >
                  1
                    ? "s"
                    : ""}.

                </p>

              </div>

            </div>

            {/* =================================================
                CRÉER
            ================================================= */}

            <button
              type="submit"
              className="submit-resource-btn"
              disabled={
                isSubmitting
              }
            >

              {isSubmitting ? (

                <>

                  <span className="button-spinner" />

                  Traitement...

                </>

              ) : (

                <>

                  <span>
                    ✓
                  </span>

                  Créer la ressource et la règle

                </>

              )}

            </button>

          </form>

        )}

      </div>

      {/* =====================================================
          NOTIFICATION
      ====================================================== */}

      {message && (

        <div
          className={`resource-notification ${messageType}`}
        >

          <span className="notification-icon">

            {messageType === "success"
              ? "✓"
              : "!"}

          </span>

          <span>
            {message}
          </span>

        </div>

      )}

    </div>
  );
};

export default RessourcesAcces;

