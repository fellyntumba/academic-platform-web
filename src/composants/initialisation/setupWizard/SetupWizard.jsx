

// import React, { useEffect, useState } from "react";
// import "./SetupWizard.css";

// import Step1 from "../etapes/step1/Step1";
// import Step2 from "../etapes/step2/Step2";
// import StepIndicator from "../etapes/Indicator";

// import AuthModal from "../authentification/AuthModal";
// import { isAuthenticated } from "../authentification/serviceAuth";

// const SetupWizard = ({
//   setupStatus,
//   onCompleted,
//   onAuthenticated,
// }) => {

//   const [currentStep, setCurrentStep] = useState(null);
//   const [authenticated, setAuthenticated] = useState(null);
//   const [checkingAuth, setCheckingAuth] = useState(true);


//   // ============================================================
//   // VÉRIFICATION DE LA SESSION
//   // ============================================================

//   useEffect(() => {

//     let mounted = true;

//     const checkAuthentication = async () => {

//       try {

//         const result =
//           await isAuthenticated();

//         if (!mounted) {
//           return;
//         }

//         const user =
//           result?.authenticated
//             ? result.user
//             : null;

//         setAuthenticated(user);

//         if (user) {
//           onAuthenticated?.(user);
//         }

//       } catch (error) {

//         console.error(
//           "[SETUP] Erreur authentification :",
//           error
//         );

//         if (mounted) {
//           setAuthenticated(null);
//         }

//       } finally {

//         if (mounted) {
//           setCheckingAuth(false);
//         }
//       }
//     };

//     checkAuthentication();

//     return () => {
//       mounted = false;
//     };

//   }, [onAuthenticated]);


//   // ============================================================
//   // DÉTERMINATION DE L'ÉTAPE
//   // ============================================================

//   useEffect(() => {

//     if (!setupStatus) {
//       return;
//     }

//     const status =
//       setupStatus.data ?? setupStatus;


//     // ----------------------------------------------------------
//     // Aucun SGA
//     // ----------------------------------------------------------

//     if (!status.sga) {

//       setCurrentStep(0);

//       return;
//     }


//     // ----------------------------------------------------------
//     // SGA présent mais facultés absentes
//     // ----------------------------------------------------------

//     if (!status.facultes) {

//       setCurrentStep(1);

//       return;
//     }


//     // ----------------------------------------------------------
//     // Configuration terminée
//     // ----------------------------------------------------------

//     setCurrentStep(2);

//   }, [setupStatus]);


//   // ============================================================
//   // CHARGEMENT
//   // ============================================================

//   if (currentStep === null) {

//     return (
//       <div className="wizard-container">

//         <div className="step-content">
//           Vérification de la configuration...
//         </div>

//       </div>
//     );
//   }


//   // ============================================================
//   // INTERFACE
//   // ============================================================

//   return (

//     <div className="wizard-container">

//       <h1 className="wizard-title">
//         Configuration initiale
//       </h1>


//       {currentStep < 2 && (
//         <StepIndicator
//           currentStep={currentStep}
//         />
//       )}


//       <div className="step-content">


//         {/* ======================================================
//             ÉTAPE 1 — CRÉATION SGA
//         ====================================================== */}

//         {currentStep === 0 && (

//           <Step1
//             onNext={() => {

//               setCurrentStep(1);

//               setAuthenticated(null);

//               setCheckingAuth(false);
//             }}
//           />

//         )}


//         {/* ======================================================
//             VÉRIFICATION SESSION
//         ====================================================== */}

//         {currentStep === 1 &&
//           checkingAuth && (

//             <div className="step-content">
//               Vérification de votre session...
//             </div>

//           )}


//         {/* ======================================================
//             AUTHENTIFICATION SGA
//         ====================================================== */}

//         {currentStep === 1 &&
//           !checkingAuth &&
//           !authenticated && (

//             <AuthModal
//               onAuthenticated={(user) => {

//                 console.log(
//                   "[SETUP] Authentification réussie :",
//                   user
//                 );

//                 setAuthenticated(user);

//                 // Synchroniser avec App.jsx
//                 onAuthenticated?.(user);
//               }}
//             />

//           )}


//         {/* ======================================================
//             ÉTAPE 2 — CODES FACULTÉS
//         ====================================================== */}

//         {currentStep === 1 &&
//           !checkingAuth &&
//           authenticated && (

//             <Step2
//               onFinish={async () => {

//                 console.log(
//                   "[SETUP] Configuration des facultés terminée."
//                 );

//                 await onCompleted?.();

//               }}
//             />

//           )}


//         {/* ======================================================
//             CONFIGURATION TERMINÉE
//         ====================================================== */}

//         {currentStep === 2 && (

//           <div className="step-content">
//             Configuration terminée.
//           </div>

//         )}

//       </div>

//     </div>
//   );
// };

// export default SetupWizard;



import React, { useEffect, useState } from "react";
import "./SetupWizard.css";

import Step1 from "../etapes/step1/Step1";
import Step2 from "../etapes/step2/Step2";
import StepIndicator from "../etapes/Indicator";

import AuthModal from "../authentification/AuthModal";
import { isAuthenticated } from "../authentification/serviceAuth";

const SetupWizard = ({
  setupStatus,
  onCompleted,
  onAuthenticated,
  onCompleting,
}) => {
  const [currentStep, setCurrentStep] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  // ============================================================
  // VÉRIFICATION DE LA SESSION
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const checkAuthentication = async () => {
      try {
        const result = await isAuthenticated();

        if (!mounted) return;

        const user = result?.authenticated
          ? result.user
          : null;

        setAuthenticated(user);

        if (user) {
          onAuthenticated?.(user);
        }
      } catch (error) {
        console.error(
          "[SETUP] Erreur authentification :",
          error
        );

        if (mounted) {
          setAuthenticated(null);
        }
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    checkAuthentication();

    return () => {
      mounted = false;
    };
  }, [onAuthenticated]);

  // ============================================================
  // DÉTERMINATION DE L'ÉTAPE
  // ============================================================

  useEffect(() => {
    if (!setupStatus || isCompleting) return;

    const status = setupStatus.data ?? setupStatus;

    if (!status.sga) {
      setCurrentStep(0);
      return;
    }

    if (!status.facultes) {
      setCurrentStep(1);
      return;
    }

    setCurrentStep(2);
  }, [setupStatus, isCompleting]);

  // ============================================================
  // TERMINAISON : ANIMATION IMMÉDIATE, PUIS HOME
  // ============================================================

  const handleFinish = async () => {
    if (isCompleting) return;

    // Bloquer immédiatement toute nouvelle étape du wizard.
    setIsCompleting(true);

    // Informer App.jsx avant l'actualisation du statut.
    // Cela empêche la redirection de démonter ce composant.
    onCompleting?.();

    console.log(
      "[SETUP] Configuration terminée. Animation en cours."
    );

    try {
      // L'animation reste affichée pendant 5 secondes.
      await new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });

      // Actualiser la configuration et la session après l'animation.
      await onCompleted?.();
    } catch (error) {
      console.error(
        "[SETUP] Erreur lors de la transition :",
        error
      );
    }
  };

  // ============================================================
  // ANIMATION PRIORITAIRE
  // Aucun AuthModal ni Step2 pendant cette phase.
  // ============================================================

  if (isCompleting) {
    return (
      <div className="wizard-container">
        <div
          className="setup-completion"
          role="status"
          aria-live="polite"
        >
          <div className="completion-icon">
            <svg
              viewBox="0 0 64 64"
              className="completion-check"
              aria-hidden="true"
            >
              <circle
                cx="32"
                cy="32"
                r="28"
                className="completion-circle"
              />

              <path
                d="M18 33 L27 42 L46 22"
                className="completion-tick"
              />
            </svg>
          </div>

          <h2>Configuration terminée</h2>

          <p>
            Votre plateforme est configurée avec succès.
          </p>

          <div
            className="completion-loader"
            aria-hidden="true"
          />

          <span className="completion-caption">
            Préparation de la page d'accueil...
          </span>
        </div>
      </div>
    );
  }

  // ============================================================
  // CHARGEMENT INITIAL
  // ============================================================

  if (currentStep === null) {
    return (
      <div className="wizard-container">
        <div className="step-content">
          Vérification de la configuration...
        </div>
      </div>
    );
  }

  // ============================================================
  // INTERFACE DU WIZARD
  // ============================================================

  return (
    <div className="wizard-container">
      <h1 className="wizard-title">
        Configuration initiale
      </h1>

      {currentStep < 2 && (
        <StepIndicator currentStep={currentStep} />
      )}

      <div className="step-content">
        {/* ÉTAPE 1 — CRÉATION SGA */}

        {currentStep === 0 && (
          <Step1
            onNext={() => {
              setCurrentStep(1);
              setAuthenticated(null);
              setCheckingAuth(false);
            }}
          />
        )}

        {/* VÉRIFICATION DE SESSION */}

        {currentStep === 1 && checkingAuth && (
          <div className="step-content">
            Vérification de votre session...
          </div>
        )}

        {/* AUTHENTIFICATION SGA */}

        {currentStep === 1 &&
          !checkingAuth &&
          !authenticated && (
            <AuthModal
              onAuthenticated={(user) => {
                console.log(
                  "[SETUP] Authentification réussie :",
                  user
                );

                setAuthenticated(user);
                onAuthenticated?.(user);
              }}
            />
          )}

        {/* ÉTAPE 2 — CODES FACULTÉS */}

        {currentStep === 1 &&
          !checkingAuth &&
          authenticated && (
            <Step2 onFinish={handleFinish} />
          )}
      </div>
    </div>
  );
};

export default SetupWizard;

