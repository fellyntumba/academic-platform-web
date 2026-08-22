import React, { useState } from "react";
import "./Home.css";
import { sendOtp, verifyOtp } from "./serviceAuth";
import { useContextUniv } from "../../featuresAndInfos/ContextUnivProvider";

const Home = () => {
  
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [loadingAuth, setLoadingAuth] = useState(false);

    const { infoUniv, loading } = useContextUniv();
  
   

  if (loading) {
    return <div>Chargement...</div>;
  }

  /* ========================= 
    Envoi OTP
  ========================= */
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      return setError("Veuillez entrer un email.");
    }

    setLoadingAuth(true);

    const result = await sendOtp({ email });

    setLoadingAuth(false);

    if (result.success) {
      setStep(2);
    } else {
      setError(result.message);
    }
  };

  /* =========================
    Vérification OTP
  ========================= */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");

    if (!otp.trim()) {
      return setError("Veuillez entrer le code OTP.");
    }

    setLoadingAuth(true);

    const result = await verifyOtp({
      email,
      otp
    });

    setLoadingAuth(false);

    if (!result.success) {
      return setError(result.message);
    } 

    // Le backend a créé les cookies HttpOnly.
    // On recharge complètement l'application.
    window.location.replace("/");

  };




  return (
    <div className="home">
      <header
        className="home-header"
        style={{
          borderBottom: `3px solid ${
            infoUniv?.primaryColor || "#3b82f6"
          }`,
        }}
      >
        <div className="header-left">
          <img
            src={infoUniv?.logoUniversity}
            alt="Logo université"
            className="logo"
            onError={(e) => {
              e.target.src = "/default-logo.png";
            }}
          />

          <div className="university-info">
            <h1>{infoUniv?.nameUniversity || "academic Platform"}</h1>
            <span className="subtitle">academic Platform</span>
          </div>
        </div>
      </header>

      <main className="home-body">
        <div className="auth-card">
          <h2>Authentification</h2>

          <p className="auth-card-message">
            Veuillez accéder à la plateforme en saisissant votre adresse e-mail institutionnelle.
            Un code de vérification (OTP) vous sera envoyé pour confirmer votre identité.
          </p>

          {step === 1 && (
            <form onSubmit={handleSendEmail}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                disabled={step === 2}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setOtp("");
                }}
              />

              <button type="submit" disabled={loadingAuth}>
                {loadingAuth ? "Envoi..." : "Envoyer OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                placeholder="Entrer OTP reçu"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button type="submit" disabled={loadingAuth}>
                {loadingAuth ? "Vérification..." : "Valider OTP"}
              </button>
            </form>
          )}

          {error && <p className="error-message">{error}</p>}
        </div>
      </main>

      <footer className="home-footer">
        Plateforme académique intelligente et sécurisée
      </footer>
    </div>
  );
};

export default Home;
