

const StepIndicator = ({ currentStep }) => {
  const steps = ["Créer le cpt S.G.A.", "Créer les code_facs" ];
  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${currentStep === index ? "active" : currentStep > index ? "completed" : ""}`}
        >
          <div className="step-number">{index}</div>
          <div className="step-label">{step}</div>
        </div>
      ))}
    </div>
  );
};
 
export default StepIndicator;

