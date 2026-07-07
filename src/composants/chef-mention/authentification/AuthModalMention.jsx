import React, { useState } from "react";
import { sendOtpCM, verifyOtpCM } from "./serviceAuth";
import "./AuthModalMention.css";

const AuthModalMention = ({ onAuthenticated, onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     Envoi OTP
  ========================= */
const handleSendEmail = async (e) => {
  e.preventDefault();
  setError("");

  if (!email.trim()) return setError("Veuillez entrer un email.");

  setLoading(true);
  const result = await sendOtpCM({ email });
  setLoading(false);

  if (result.success) {
    setStep(2);
  } else {
    // ✅ On affiche EXACTEMENT le message du backend
    setError(result.message);
  }
};

  /* =========================
     Vérification OTP
  ========================= */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) return setError("Veuillez entrer le code OTP.");

    setLoading(true);
    const result = await verifyOtpCM({ email, otp });
    setLoading(false);

    if (result.success) {
      onAuthenticated();
    } else {
      // ✅ Message exact du backend
      setError(result.message);
    }
};

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        {/* Croix rouge pour fermer */}
        <span className="close-btn" onClick={onClose}>×</span>

        <h2>Authentification</h2>

        {step === 1 && (
          <form onSubmit={handleSendEmail}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer OTP"}
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
            <button type="submit" disabled={loading}>
              {loading ? "Vérification..." : "Valider OTP"}
            </button>
          </form>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};


export default AuthModalMention;
