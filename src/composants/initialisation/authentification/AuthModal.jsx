import React, {
  useRef,
  useState,
} from "react";

import {
  sendOtpSuperAdmin,
  verifyOtpSuperAdmin,
} from "./serviceAuth";

import "./AuthModal.css";


const AuthModal = ({
  onAuthenticated,
}) => {

  // ==========================================================================
  // ÉTAT
  // ==========================================================================

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [step, setStep] =
    useState(1);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ==========================================================================
  // VERROUS
  // ==========================================================================

  const sendingOtpRef =
    useRef(false);

  const verifyingOtpRef =
    useRef(false);


  // ==========================================================================
  // ENVOYER OTP
  // ==========================================================================

  const handleSendEmail = async (e) => {

    e.preventDefault();


    // ------------------------------------------------------------------------
    // Empêcher deux envois simultanés
    // ------------------------------------------------------------------------

    if (sendingOtpRef.current) {
      return;
    }


    setError("");


    const normalizedEmail =
      email
        .trim()
        .toLowerCase();


    if (!normalizedEmail) {

      setError(
        "Veuillez entrer votre adresse email."
      );

      return;
    }


    // ------------------------------------------------------------------------
    // Verrouillage
    // ------------------------------------------------------------------------

    sendingOtpRef.current = true;

    setLoading(true);


    try {

      const result =
        await sendOtpSuperAdmin({
          email: normalizedEmail,
        });


      if (!result?.success) {

        setError(
          result?.message ||
          "Impossible d'envoyer le code OTP."
        );

        return;
      }


      // ----------------------------------------------------------------------
      // Passage à l'étape OTP
      // ----------------------------------------------------------------------

      setEmail(
        normalizedEmail
      );

      setOtp("");

      setStep(2);


    } catch (error) {

      console.error(
        "[AUTH MODAL] Erreur envoi OTP :",
        error
      );


      setError(
        "Une erreur est survenue lors de l'envoi du code OTP."
      );


    } finally {

      setLoading(false);

      sendingOtpRef.current = false;
    }
  };


  // ==========================================================================
  // VÉRIFIER OTP
  // ==========================================================================

  const handleVerifyOtp = async (e) => {

    e.preventDefault();


    // ------------------------------------------------------------------------
    // IMPORTANT :
    // empêcher absolument une deuxième requête
    // ------------------------------------------------------------------------

    if (verifyingOtpRef.current) {

      console.log(
        "[AUTH MODAL] Vérification déjà en cours."
      );

      return;
    }


    setError("");


    const normalizedOtp =
      otp.trim();


    if (!normalizedOtp) {

      setError(
        "Veuillez entrer le code OTP reçu."
      );

      return;
    }


    // ------------------------------------------------------------------------
    // Verrouillage immédiat
    // ------------------------------------------------------------------------

    verifyingOtpRef.current = true;

    setLoading(true);


    try {

      console.log(
        "[AUTH MODAL] Vérification OTP..."
      );


      const result =
        await verifyOtpSuperAdmin({
          email,
          otp: normalizedOtp,
        });


      console.log(
        "[AUTH MODAL] Résultat OTP :",
        result
      );


      // ----------------------------------------------------------------------
      // ÉCHEC
      // ----------------------------------------------------------------------

      if (!result?.success) {

        setError(
          result?.message ||
          "Le code OTP est invalide ou expiré."
        );

        // On autorise une nouvelle tentative
        verifyingOtpRef.current = false;

        return;
      }


      // ----------------------------------------------------------------------
      // SUCCÈS
      // ----------------------------------------------------------------------

      console.log(
        "[AUTH MODAL] Authentification réussie."
      );


      /*
       * Le backend a déjà créé :
       *
       * access_token
       * refresh_token
       *
       * Nous transmettons également l'utilisateur
       * au composant parent.
       */

      onAuthenticated?.(
        result.user || null
      );


      /*
       * IMPORTANT :
       *
       * Nous ne remettons PAS
       * verifyingOtpRef.current à false.
       *
       * Le code OTP vient d'être consommé.
       *
       * Cela empêche une nouvelle soumission
       * du même OTP.
       */


    } catch (error) {

      console.error(
        "[AUTH MODAL] Erreur vérification OTP :",
        error
      );


      setError(
        "Une erreur est survenue lors de la vérification du code."
      );


      // Autoriser une nouvelle tentative
      verifyingOtpRef.current = false;


    } finally {

      setLoading(false);
    }
  };


  // ==========================================================================
  // MODIFIER EMAIL
  // ==========================================================================

  const handleChangeEmail = () => {

    if (loading) {
      return;
    }


    // Réinitialiser le verrou OTP
    verifyingOtpRef.current = false;


    setError("");

    setOtp("");

    setStep(1);
  };


  // ==========================================================================
  // INTERFACE
  // ==========================================================================

  return (

    <div
      className="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >

      <div className="auth-modal">


        {/* ==================================================================
            EN-TÊTE
        ================================================================== */}

        <div className="auth-modal-header">

          <div className="auth-modal-icon">

            {step === 1
              ? "✉"
              : "✓"}

          </div>


          <div>

            <h2 id="auth-modal-title">
              Authentification requise
            </h2>


            <p className="auth-modal-subtitle">

              {step === 1

                ? "Authentifiez-vous avec votre adresse email."

                : "Entrez le code envoyé à votre adresse email."

              }

            </p>

          </div>

        </div>


        {/* ==================================================================
            INDICATEUR D'ÉTAPES
        ================================================================== */}

        <div className="auth-steps">


          <div
            className={`auth-step ${
              step >= 1
                ? "active"
                : ""
            }`}
          >

            <span>
              1
            </span>

            <small>
              Email
            </small>

          </div>


          <div className="auth-step-line" />


          <div
            className={`auth-step ${
              step >= 2
                ? "active"
                : ""
            }`}
          >

            <span>
              2
            </span>

            <small>
              Code OTP
            </small>

          </div>

        </div>


        {/* ==================================================================
            ÉTAPE 1 — EMAIL
        ================================================================== */}

        {step === 1 && (

          <form
            className="auth-form"
            onSubmit={handleSendEmail}
          >


            <div className="auth-field">

              <label htmlFor="auth-email">
                Adresse email
              </label>


              <input
                id="auth-email"
                type="email"
                value={email}

                onChange={(e) => {

                  setEmail(
                    e.target.value
                  );

                  if (error) {
                    setError("");
                  }

                }}

                placeholder="exemple@universite.cd"

                autoComplete="email"

                autoFocus

                disabled={loading}

                className={
                  error
                    ? "input-error"
                    : ""
                }
              />

            </div>


            {error && (

              <div
                className="error-message"
                role="alert"
              >
                {error}
              </div>

            )}


            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >

              {loading ? (

                <>
                  <span className="auth-spinner" />
                  Envoi en cours...
                </>

              ) : (

                "Envoyer le code OTP"

              )}

            </button>

          </form>

        )}


        {/* ==================================================================
            ÉTAPE 2 — OTP
        ================================================================== */}

        {step === 2 && (

          <form
            className="auth-form"
            onSubmit={handleVerifyOtp}
          >


            <div className="auth-email-display">

              <span>
                Code envoyé à
              </span>

              <strong>
                {email}
              </strong>

            </div>


            <div className="auth-field">

              <label htmlFor="auth-otp">
                Code de vérification
              </label>


              <input
                id="auth-otp"
                type="text"
                value={otp}

                onChange={(e) => {

                  const value =
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6);


                  setOtp(value);


                  if (error) {
                    setError("");
                  }

                }}

                placeholder="000000"

                inputMode="numeric"

                autoComplete="one-time-code"

                maxLength={6}

                autoFocus

                disabled={loading}

                className={
                  `auth-otp-input ${
                    error
                      ? "input-error"
                      : ""
                  }`
                }
              />

            </div>


            {error && (

              <div
                className="error-message"
                role="alert"
              >
                {error}
              </div>

            )}


            <button
              type="submit"
              className="auth-submit-button"

              disabled={
                loading ||
                otp.length === 0
              }
            >

              {loading ? (

                <>
                  <span className="auth-spinner" />
                  Vérification...
                </>

              ) : (

                "Valider le code"

              )}

            </button>


            <button
              type="button"
              className="auth-secondary-button"

              onClick={
                handleChangeEmail
              }

              disabled={loading}
            >
              Modifier l'adresse email
            </button>

          </form>

        )}


        {/* ==================================================================
            SÉCURITÉ
        ================================================================== */}

        <div className="auth-security-info">

          <span className="security-icon">
            ●
          </span>

          <span>
            Votre connexion est sécurisée.
          </span>

        </div>

      </div>

    </div>
  );
};


export default AuthModal;

