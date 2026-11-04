// import React, { useState, useEffect } from "react";
// import "./EtudiantsInscrits.css";

// import {
//   importEtudiantsInscrits,
//   getPromotionsService,
//   inscrireEtudiantService
// } from "./etudiantsInscritsService";

// const EtudiantsInscrits = ({ code_mention }) => {
//   const [selectedFile, setSelectedFile] = useState(null);

//   // L'identifiant envoyé est celui de promotions_versions.id_version.
//   const [promotionVersionId, setPromotionVersionId] = useState("");
//   const [promotionVersionIdManuelle, setPromotionVersionIdManuelle] =
//     useState("");

//   const [ancienMatricule, setAncienMatricule] = useState("");
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");
//   const [errors, setErrors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [listPromos, setListPromos] = useState([]);

//   const [nom, setNom] = useState("");
//   const [postnom, setPostnom] = useState("");
//   const [prenom, setPrenom] = useState("");
//   const [sexe, setSexe] = useState("");

//   /* ============================= */
//   /* Gestion des notifications     */
//   /* ============================= */

//   const showMessage = (msg, type = "success") => {
//     setMessage(msg);
//     setMessageType(type);

//     setTimeout(() => {
//       setMessage("");
//       setMessageType("");
//     }, 4000);
//   };

//   /* ============================= */
//   /* Charger les promotions        */
//   /* ============================= */

//   useEffect(() => {
//     const loadPromotions = async () => {
//       try {
//         const promoData = await getPromotionsService({ code_mention });
//         const promos = promoData.data || promoData;

//         setListPromos(Array.isArray(promos) ? promos : []);
//       } catch (error) {
//         showMessage(
//           error.message || "Erreur chargement promotions",
//           "error"
//         );
//       }
//     };

//     loadPromotions();
//   }, [code_mention]);

//   /* ============================= */
//   /* Gestion du fichier Excel      */
//   /* ============================= */

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0] || null);
//     setMessage("");
//     setErrors([]);
//   };

//   /* ============================= */
//   /* Importation Excel             */
//   /* ============================= */

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       return showMessage(
//         "Veuillez sélectionner un fichier Excel.",
//         "error"
//       );
//     }

//     if (!promotionVersionId) {
//       return showMessage(
//         "Veuillez sélectionner une promotion.",
//         "error"
//       );
//     }

//     try {
//       setLoading(true);
//       setMessage("");
//       setErrors([]);

//       const result = await importEtudiantsInscrits(
//         selectedFile,
//         promotionVersionId
//       );

//       showMessage(
//         `Import terminé : ${result.inserted} inséré(s), ${result.updated} mis à jour.`,
//         "success"
//       );

//       if (result.errors && result.errors.length > 0) {
//         setErrors(result.errors);
//       }

//       setSelectedFile(null);
//       setPromotionVersionId("");
//     } catch (error) {
//       showMessage(error.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ============================= */
//   /* Inscription manuelle          */
//   /* ============================= */

//   const handleAddStudent = async () => {
//     if (
//       !ancienMatricule.trim() ||
//       !nom.trim() ||
//       !postnom.trim() ||
//       !prenom.trim() ||
//       !sexe ||
//       !promotionVersionIdManuelle
//     ) {
//       return showMessage(
//         "Veuillez renseigner tous les champs.",
//         "error"
//       );
//     }

//     try {
//       setLoading(true);

//       const result = await inscrireEtudiantService({
//         ancienMatricule,
//         nom,
//         postnom,
//         prenom,
//         sexe,
//         promotionVersionId: promotionVersionIdManuelle
//       });

//       showMessage(
//         result.message || "Étudiant inscrit avec succès.",
//         "success"
//       );

//       // Réinitialisation du formulaire.
//       setAncienMatricule("");
//       setNom("");
//       setPostnom("");
//       setPrenom("");
//       setSexe("");
//       setPromotionVersionIdManuelle("");
//     } catch (error) {
//       showMessage(
//         error.message || "Erreur lors de l'inscription.",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="etudiants-container fade-in">
//       <h2>
//         Enregistrement des étudiants régulièrement inscrits
//       </h2>

//       {message && (
//         <div className={`notification ${messageType}`}>
//           {message}
//         </div>
//       )}

//       <div className="consigne-box">
//         ⚠️ <strong>Consigne :</strong> Veuillez importer uniquement
//         un fichier Excel (.xlsx, .xls) contenant obligatoirement les
//         colonnes <strong>code, nom, postnom, prenom et sexe</strong>.
//       </div>

//       {/* Importation Excel */}
//       <div className="card-section">
//         <h3>Enregistrement via fichier Excel</h3>

//         <input
//           type="file"
//           accept=".xlsx, .xls"
//           onChange={handleFileChange}
//         />

//         <div className="upload-row">
//           <select
//             value={promotionVersionId}
//             onChange={(e) => setPromotionVersionId(e.target.value)}
//           >
//             <option value="">
//               -- Sélectionner une promotion --
//             </option>

//             {listPromos.map((p) => (
//               <option
//                 key={p.id_version}
//                 value={p.id_version}
//               >
//                 {p.nom_promotion}
//               </option>
//             ))}
//           </select>

//           <button
//             className="primary-btn"
//             onClick={handleUpload}
//             disabled={loading}
//           >
//             {loading ? "Import en cours..." : "Enregistrer la liste"}
//           </button>
//         </div>
//       </div>

//       {/* Erreurs de l'importation */}
//       {errors.length > 0 && (
//         <div className="error-box">
//           <details>
//             <summary>
//               ⚠️ Erreurs détectées : {errors.length}
//             </summary>

//             <ul>
//               {errors.map((err, index) => (
//                 <li key={index}>
//                   Ligne {err.ligne} : {err.message}
//                 </li>
//               ))}
//             </ul>
//           </details>
//         </div>
//       )}

//       <div className="separator">OU</div>

//       {/* Inscription manuelle */}
//       <div className="card-section">
//         <h3>Enregistrement manuel d'un étudiant</h3>

//         <div className="manual-form">
//           <div className="manual-column">
//             <input
//               type="text"
//               placeholder="Code"
//               value={ancienMatricule}
//               onChange={(e) => setAncienMatricule(e.target.value)}
//             />

//             <input
//               type="text"
//               placeholder="Nom"
//               value={nom}
//               onChange={(e) => setNom(e.target.value)}
//             />

//             <input
//               type="text"
//               placeholder="Postnom"
//               value={postnom}
//               onChange={(e) => setPostnom(e.target.value)}
//             />
//           </div>

//           <div className="manual-column">
//             <input
//               type="text"
//               placeholder="Prénom"
//               value={prenom}
//               onChange={(e) => setPrenom(e.target.value)}
//             />

//             <select
//               value={sexe}
//               onChange={(e) => setSexe(e.target.value)}
//             >
//               <option value="">-- Sexe --</option>
//               <option value="M">Masculin</option>
//               <option value="F">Féminin</option>
//             </select>

//             <select
//               value={promotionVersionIdManuelle}
//               onChange={(e) =>
//                 setPromotionVersionIdManuelle(e.target.value)
//               }
//             >
//               <option value="">-- Promotion --</option>

//               {listPromos.map((p) => (
//                 <option
//                   key={p.id_version}
//                   value={p.id_version}
//                 >
//                   {p.nom_promotion}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <button
//           className="primary-btn"
//           onClick={handleAddStudent}
//           disabled={loading}
//         >
//           {loading
//             ? "Enregistrement en cours..."
//             : "Enregistrer l'étudiant"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EtudiantsInscrits;





import React, { useState, useEffect } from "react";
import "./EtudiantsInscrits.css";

import {
  importEtudiantsInscrits,
  getPromotionsService,
  inscrireEtudiantService,
  listeEtudiantsInscritsParMentionService
} from "./etudiantsInscritsService";

const EtudiantsInscrits = ({ code_mention }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  // L'identifiant envoyé est celui de promotions_versions.id_version.
  const [promotionVersionId, setPromotionVersionId] = useState("");
  const [promotionVersionIdManuelle, setPromotionVersionIdManuelle] =
    useState("");

  const [ancienMatricule, setAncienMatricule] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [listPromos, setListPromos] = useState([]);

  const [nom, setNom] = useState("");
  const [postnom, setPostnom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [sexe, setSexe] = useState("");

  /* ============================= */
  /* Gestion des notifications     */
  /* ============================= */

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  /* ============================= */
  /* Charger les promotions        */
  /* ============================= */

  useEffect(() => {
    let cancelled = false;

    const loadPromotions = async () => {
      try {
        const promoData = await getPromotionsService({ code_mention });

        if (cancelled) return;

        const promos = promoData.data || promoData;

        setListPromos(Array.isArray(promos) ? promos : []);

      } catch (error) {

        if (!cancelled) {
          showMessage(
            error.message || "Erreur chargement promotions",
            "error"
          );
        }

      }
    };

    if (code_mention) {
      loadPromotions();
    } else {
      setListPromos([]);
    }

    return () => {
      cancelled = true;
    };

  }, [code_mention]);

  /* ============================= */
  /* Gestion du fichier Excel      */
  /* ============================= */

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
    setMessage("");
    setErrors([]);
  };

  /* ============================= */
  /* Importation Excel             */
  /* ============================= */

  const handleUpload = async () => {
    if (!selectedFile) {
      return showMessage(
        "Veuillez sélectionner un fichier Excel.",
        "error"
      );
    }

    if (!promotionVersionId) {
      return showMessage(
        "Veuillez sélectionner une promotion.",
        "error"
      );
    }

    try {
      setLoading(true);
      setMessage("");
      setErrors([]);

      const result = await importEtudiantsInscrits(
        selectedFile,
        promotionVersionId
      );

      showMessage(
        `Import terminé : ${result.inserted} inséré(s), ${result.updated} mis à jour.`,
        "success"
      );

      if (result.errors && result.errors.length > 0) {
        setErrors(result.errors);
      }

      setSelectedFile(null);
      setPromotionVersionId("");

    } catch (error) {

      showMessage(error.message, "error");

    } finally {

      setLoading(false);

    }
  };

  /* ============================= */
  /* Inscription manuelle          */
  /* ============================= */

  const handleAddStudent = async () => {
    if (
      !ancienMatricule.trim() ||
      !nom.trim() ||
      !postnom.trim() ||
      !prenom.trim() ||
      !sexe ||
      !promotionVersionIdManuelle
    ) {
      return showMessage(
        "Veuillez renseigner tous les champs.",
        "error"
      );
    }

    try {
      setLoading(true);

      const result = await inscrireEtudiantService({
        ancienMatricule,
        nom,
        postnom,
        prenom,
        sexe,
        promotionVersionId: promotionVersionIdManuelle
      });

      showMessage(
        result.message || "Étudiant inscrit avec succès.",
        "success"
      );

      // Réinitialisation du formulaire.
      setAncienMatricule("");
      setNom("");
      setPostnom("");
      setPrenom("");
      setSexe("");
      setPromotionVersionIdManuelle("");

    } catch (error) {

      showMessage(
        error.message || "Erreur lors de l'inscription.",
        "error"
      );

    } finally {

      setLoading(false);

    }
  };

  /* ========================================================= */
  /* Télécharger la liste des étudiants inscrits au format PDF */
  /* ========================================================= */

  const getListeEtudiantsInscrits = async () => {

    try {

      // Vérifier la mention.

      if (!code_mention) {
        showMessage(
          "Aucune mention sélectionnée.",
          "error"
        );
        return;
      }

      // Éviter plusieurs générations simultanées.

      if (loadingPDF) return;

      setLoadingPDF(true);
      setMessage("");
      setMessageType("");

      // Appeler le service de génération PDF.

      const result = await listeEtudiantsInscritsParMentionService({
        codeMention: code_mention
      });

      if (result?.ok) {

        showMessage(
          result.message ||
            "La liste des étudiants inscrits a été téléchargée avec succès.",
          "success"
        );

      } else {

        showMessage(
          result?.message ||
            "Impossible de télécharger la liste des étudiants inscrits.",
          "error"
        );

      }

    } catch (error) {

      console.error(
        "Erreur téléchargement liste des étudiants inscrits :",
        error
      );

      showMessage(
        error.message ||
          "Erreur lors de la génération de la liste PDF des étudiants inscrits.",
        "error"
      );

    } finally {

      setLoadingPDF(false);

    }

  };

  return (
    <div className="etudiants-container fade-in">

      <h2>
        Enregistrement des étudiants régulièrement inscrits
      </h2>

      {/* Notifications */}

      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}

      <div className="consigne-box">
        ⚠️ <strong>Consigne :</strong> Veuillez importer uniquement
        un fichier Excel (.xlsx, .xls) contenant obligatoirement les
        colonnes <strong>code, nom, postnom, prenom et sexe</strong>.
      </div>

      {/* =====================================
          Importation Excel
      ====================================== */}

      <div className="card-section">

        <h3>Enregistrement via fichier Excel</h3>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />

        <div className="upload-row">

          <select
            value={promotionVersionId}
            onChange={(e) => setPromotionVersionId(e.target.value)}
          >

            <option value="">
              -- Sélectionner une promotion --
            </option>

            {listPromos.map((p) => (

              <option
                key={p.id_version}
                value={p.id_version}
              >
                {p.nom_promotion}
              </option>

            ))}

          </select>

          <button
            className="primary-btn"
            onClick={handleUpload}
            disabled={loading}
          >

            {loading
              ? "Import en cours..."
              : "Enregistrer la liste"}

          </button>

        </div>

      </div>

      {/* =====================================
          Erreurs de l'importation
      ====================================== */}

      {errors.length > 0 && (

        <div className="error-box">

          <details>

            <summary>
              ⚠️ Erreurs détectées : {errors.length}
            </summary>

            <ul>

              {errors.map((err, index) => (

                <li key={index}>
                  Ligne {err.ligne} : {err.message}
                </li>

              ))}

            </ul>

          </details>

        </div>

      )}

      <div className="separator">OU</div>

      {/* =====================================
          Inscription manuelle
      ====================================== */}

      <div className="card-section">

        <h3>Enregistrement manuel d'un étudiant</h3>

        <div className="manual-form">

          <div className="manual-column">

            <input
              type="text"
              placeholder="Code"
              value={ancienMatricule}
              onChange={(e) => setAncienMatricule(e.target.value)}
            />

            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />

            <input
              type="text"
              placeholder="Postnom"
              value={postnom}
              onChange={(e) => setPostnom(e.target.value)}
            />

          </div>

          <div className="manual-column">

            <input
              type="text"
              placeholder="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />

            <select
              value={sexe}
              onChange={(e) => setSexe(e.target.value)}
            >

              <option value="">-- Sexe --</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>

            </select>

            <select
              value={promotionVersionIdManuelle}
              onChange={(e) =>
                setPromotionVersionIdManuelle(e.target.value)
              }
            >

              <option value="">-- Promotion --</option>

              {listPromos.map((p) => (

                <option
                  key={p.id_version}
                  value={p.id_version}
                >
                  {p.nom_promotion}
                </option>

              ))}

            </select>

          </div>

        </div>

        <button
          className="primary-btn"
          onClick={handleAddStudent}
          disabled={loading}
        >

          {loading
            ? "Enregistrement en cours..."
            : "Enregistrer l'étudiant"}

        </button>

      </div>

      {/* =====================================
          Téléchargement de la liste PDF
      ====================================== */}

      <div className="card-section">


        <button
          type="button"
          className="download-btn"
          disabled={
            !code_mention ||
            loadingPDF ||
            loading
          }
          onClick={getListeEtudiantsInscrits}
        >

          {loadingPDF ? (

            <>
              <span className="liste-spinner"></span>
              Génération du PDF en cours...
            </>

          ) : (

            <>
              📥 Télécharger la liste PDF
            </>

          )}

        </button>

      </div>

    </div>
  );
};

export default EtudiantsInscrits;

