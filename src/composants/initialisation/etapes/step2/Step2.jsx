// import React, { useEffect, useState } from "react";
// import {
//   getCodesFacultesConfig,
//   createCodeFac,
//   getCodeFacBDuniv,
// } from "./service";
// import { logout } from "../../../accueils/serviceAuth";

// const Step2 = ({ onFinish }) => {
//   const [nomFaculte, setNomFaculte] = useState("");
//   const [facs, setFacs] = useState([]);
//   const [facultesConfig, setFacultesConfig] = useState([]);
//   const [showSuccess, setShowSuccess] = useState(false);

//   // Récupérer les facultés configurées pour une université
//   const loadFacultesConfig = async () => {
//     try { 
//       const data = await getCodesFacultesConfig();

//       setFacultesConfig(
//         Array.isArray(data) ? data : []
//       );
//     } catch (error) {
//       alert(
//         "Erreur chargement configuration : " +
//           error.message
//       );
//     }
//   };

//   //Récupérer code-facs 
//   const loadFacs = async () => {
//     try {
//       const data = await getCodeFacBDuniv();

//       const list = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.data)
//         ? data.data
//         : [];

//       setFacs(list);
//     } catch (error) {
//       alert(
//         "Erreur chargement codes-facs : " +
//           error.message
//       );
//     }
//   };

//   useEffect(() => {
//     loadFacs();
//     loadFacultesConfig();
//   }, []);

//   // 🔹 Création
//   const handleAdd = async (e) => {
//     e.preventDefault();

//     if (!nomFaculte.trim()) {
//       alert("Veuillez sélectionner un code-fac.");
//       return;
//     }

//     try {
//       const result = await createCodeFac({
//         code_faculte: nomFaculte,
//       });

//       alert(result.message);

//       setFacs((prev) => [
//         ...prev,
//         {
//           id_faculte:
//             result.faculte?.id_faculte ??
//             `${nomFaculte}-${Date.now()}`,
//           code_faculte: nomFaculte,
//         },
//       ]);

//       setNomFaculte("");
//     } catch (error) {
//       alert("Erreur : " + error.message);
//     }
//   };

//   const handleFinish = async () => {
//     if (facs.length === 0) {
//       alert("Veuillez ajouter au moins un code-fac.");
//       return;
//     }

    
//       setShowSuccess(true);

//       //Déconnexion réelle.
//       await logout();
    
//       // Simuler un petit délai de 2,5 s avant de rediriger
//       setTimeout(async () => {
//         await onFinish();
//       }, 2500);
//   };

//   return (
//     <div className="step-form">
//       <h2>Code faculté</h2>

//       <form onSubmit={handleAdd}>
//         <select
//           className="faculte-select"
//           value={nomFaculte}
//           onChange={(e) =>
//             setNomFaculte(e.target.value)
//           }
//         >
//           <option value="">
//             Sélectionner un code faculté
//           </option>

//           {facultesConfig.map((fac) => (
//             <option
//               key={fac.code}
//               value={fac.code}
//             >
//               {fac.code} - {fac.nom}
//             </option>
//           ))}
//         </select>

//         <button type="submit">
//           Ajouter
//         </button>
//       </form>

//       {facs.length > 0 && (
//         <ul className="facultes-list horizontal">
//           {facs.map((f, index) => (
//             <li
//               key={
//                 f.id_faculte ??
//                 `${f.code_faculte}-${index}`
//               }
//             >
//               {f.code_faculte}
//             </li>
//           ))}
//         </ul>
//       )}

//       <div className="buttons">
//         <button onClick={handleFinish} disabled={facs.length === 0}>
//           Terminer
//         </button>
//       </div>

//       {/* 🌟 Message succès animé */}
//       {showSuccess && (
//         <div className="success-overlay">
//           <div className="success-box">
//             <div className="spinner"></div>
//             <h3>Configuration terminée avec succès !</h3>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Step2;





import React, { useEffect, useState } from "react";

import {
  getCodesFacultesConfig,
  createCodeFac,
  getCodeFacBDuniv,
} from "./service";

import { logout } from "../../../accueils/serviceAuth";

const Step2 = ({ onFinish }) => {
  const [nomFaculte, setNomFaculte] = useState("");
  const [facs, setFacs] = useState([]);
  const [facultesConfig, setFacultesConfig] = useState([]);
  const [finishing, setFinishing] = useState(false);

  // ============================================================
  // RÉCUPÉRER LES FACULTÉS CONFIGURÉES
  // ============================================================

  const loadFacultesConfig = async () => {
    try {
      const data = await getCodesFacultesConfig();

      setFacultesConfig(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      alert(
        "Erreur chargement configuration : " +
          error.message
      );
    }
  };

  // ============================================================
  // RÉCUPÉRER LES CODES FACULTÉS
  // ============================================================

  const loadFacs = async () => {
    try {
      const data = await getCodeFacBDuniv();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setFacs(list);
    } catch (error) {
      alert(
        "Erreur chargement codes-facs : " +
          error.message
      );
    }
  };

  useEffect(() => {
    loadFacs();
    loadFacultesConfig();
  }, []);

  // ============================================================
  // AJOUTER UN CODE FACULTÉ
  // ============================================================

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!nomFaculte.trim()) {
      alert("Veuillez sélectionner un code-fac.");
      return;
    }

    try {
      const result = await createCodeFac({
        code_faculte: nomFaculte,
      });

      alert(result.message);

      setFacs((prev) => [
        ...prev,
        {
          id_faculte:
            result.faculte?.id_faculte ??
            `${nomFaculte}-${Date.now()}`,
          code_faculte: nomFaculte,
        },
      ]);

      setNomFaculte("");
    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };

  // ============================================================
  // TERMINER LA CONFIGURATION
  // Une seule animation sera affichée par SetupWizard.
  // ============================================================

  const handleFinish = async (e) => {
    e.preventDefault();

    if (finishing) return;

    if (facs.length === 0) {
      alert("Veuillez ajouter au moins un code-fac.");
      return;
    }

    setFinishing(true);

    try {
      // Conserver la déconnexion existante.
      await logout();

      // Déclencher immédiatement l'animation de SetupWizard.
      await onFinish?.();
    } catch (error) {
      console.error(
        "[STEP2] Erreur lors de la terminaison :",
        error
      );

      alert(
        "Une erreur est survenue lors de la finalisation : " +
          error.message
      );

      setFinishing(false);
    }
  };

  // ============================================================
  // INTERFACE
  // ============================================================

  return (
    <div className="step-form">
      <h2>Code faculté</h2>

      <form onSubmit={handleAdd}>
        <select
          className="faculte-select"
          value={nomFaculte}
          onChange={(e) =>
            setNomFaculte(e.target.value)
          }
          disabled={finishing}
        >
          <option value="">
            Sélectionner un code faculté
          </option>

          {facultesConfig.map((fac) => (
            <option
              key={fac.code}
              value={fac.code}
            >
              {fac.code} - {fac.nom}
            </option>
          ))}
        </select>

        <button type="submit" disabled={finishing}>
          Ajouter
        </button>
      </form>

      {facs.length > 0 && (
        <ul className="facultes-list horizontal">
          {facs.map((f, index) => (
            <li
              key={
                f.id_faculte ??
                `${f.code_faculte}-${index}`
              }
            >
              {f.code_faculte}
            </li>
          ))}
        </ul>
      )}

      <div className="buttons">
        <button
          type="button"
          onClick={handleFinish}
          disabled={facs.length === 0 || finishing}
        >
          {finishing
            ? "Finalisation..."
            : "Terminer"}
        </button>
      </div>
    </div>
  );
};

export default Step2;

