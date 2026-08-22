import React, { useEffect, useState } from "react";
import "./SetupWizard.css";

import Step1 from "../etapes/step1/Step1";
import Step2 from "../etapes/step2/Step2";
import StepIndicator from "../etapes/Indicator";

import AuthModal from "../authentification/AuthModal";
import { isAuthenticated } from "../authentification/serviceAuth";

const SetupWizard = ({ setupStatus, onCompleted }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [authenticated, setAuthenticated] = useState(null);

  /*
   * Vérifier l'authentification à l'ouverture
   * du wizard.
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await isAuthenticated();

        setAuthenticated(result?.user ?? null);
      } catch (error) {
        console.error(
          "Erreur vérification authentification :",
          error
        );

        setAuthenticated(null);
      }
    };

    checkAuth();
  }, []);

  /*
   * Déterminer automatiquement l'étape
   * à partir du statut de configuration.
   *
   * Étape 0 : SGA
   * Étape 1 : Facultés
   */
  useEffect(() => {
    if (!setupStatus) {
      return;
    }

    const stepsStatus = [
      !!setupStatus.sga,
      !!setupStatus.facultes,
    ];

    const firstFalseIndex = stepsStatus.findIndex(
      (value) => !value
    );

    /*
     * Si les deux étapes sont déjà terminées,
     * App s'occupera de la navigation.
     */
    if (firstFalseIndex === -1) {
      return;
    }

    setCurrentStep(firstFalseIndex);
  }, [setupStatus]);

  return (
    <div className="wizard-container">
      <h1 className="wizard-title">
        Configuration initiale
      </h1>

      {currentStep < 2 && (
        <StepIndicator currentStep={currentStep} />
      )}

      <div className="step-content">

        {/* =========================
            ÉTAPE 1 : SGA
        ========================= */}
        {currentStep === 0 && (
          <Step1
            onNext={() => {
              setCurrentStep(1);

              /*
               * On force l'affichage de l'AuthModal
               * avant l'étape finale.
               */
              setAuthenticated(null);
            }}
          />
        )}

        {/* =========================
            ÉTAPE 2 : AUTHENTIFICATION
        ========================= */}
        {currentStep === 1 && !authenticated && (
          <AuthModal
            onAuthenticated={(result) => {
              /*
               * AuthModal peut retourner directement
               * l'utilisateur ou simplement signaler
               * l'authentification.
               */
              setAuthenticated(
                result?.user ?? result ?? true
              );
            }}
          />
        )}

        {/* =========================
            ÉTAPE 2 : CODE FACULTÉ
            = ÉTAPE FINALE
        ========================= */}
        {currentStep === 1 && authenticated && (
          <Step2 onFinish={onCompleted} />
        )}

      </div>
    </div>
  );
};

export default SetupWizard;