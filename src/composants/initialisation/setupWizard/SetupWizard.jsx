import React, { useEffect, useState } from "react";
import "./SetupWizard.css"
import Step1 from "../etapes/step1/Step1";
import Step2 from "../etapes/step2/Step2";
import Step3 from "../etapes/step3/Step3";
// import Step4 from "../etapes/step4/Step4";
// import Step5 from "../etapes/step5/Step5";
import StepIndicator from "../etapes/Indicator";
import AuthModal from "../authentification/AuthModal";
import { isAuthenticated } from "../authentification/serviceAuth";

const SetupWizard = ({ setupStatus, onCompleted }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [authenticated, setAuthenticated] = useState(null);


  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setAuthenticated(result.user);
    };

    checkAuth(); 
  }, []);
 
  useEffect(() => {
    if (!setupStatus) return;

    const stepsStatus = [
    !!setupStatus.super_admin,         // Super admin
    // !!setupStatus.annee_academique,    // Année académique
    !!setupStatus.facultes,            // Facultés créées
    // !!setupStatus.mentions,    // Chaque faculté a au moins un cycle
    // !!setupStatus.specialites, // Chaque cycle a au moins une promotion
    !!setupStatus.admin_fac            // Admin de faculté
  ];

    const firstFalseIndex = stepsStatus.findIndex(v => !v);
    
    if (firstFalseIndex === -1) {
      onCompleted();
    } else {
      setCurrentStep(firstFalseIndex);
    }
  }, [setupStatus]);

  // {authenticated && console.log(authenticated);}
  // {setupStatus && console.log(setupStatus.facultes);}
  // console.log(currentStep);
  

  return (
    <div className="wizard-container">
      <h1 className="wizard-title">Configuration initiale</h1>
      {currentStep < 3 && <StepIndicator currentStep={currentStep} />}

      <div className="step-content">
        {currentStep === 0 && <Step1 onNext={() => {setCurrentStep(1);
                                                    setAuthenticated(false);
                                                    }} />}


        {/* 🔐 AuthModal avant Step2 */}
        {currentStep === 1 && !authenticated && (
          <AuthModal onAuthenticated={() => {setAuthenticated(true); }} />)}
        {currentStep === 1 && authenticated && (
          <Step2 onNext={() => setCurrentStep(2)} />
        )}


        {currentStep === 2 && !authenticated && (
          <AuthModal onAuthenticated={() => {setAuthenticated(true);
                                             setRequireAuth(false); }} />)}
        {currentStep === 2 && <Step3 onFinish={onCompleted} />}

      </div>
    </div>
  );
};

export default SetupWizard;
