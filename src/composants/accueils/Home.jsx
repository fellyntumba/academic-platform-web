import React, {
  useState,
} from "react";

import {
  Mail,
  LockKeyhole,
  ArrowRight,
  ArrowLeft, 
  ShieldCheck,
  AlertCircle,
  LoaderCircle,
  MapPin,
} from "lucide-react";

import "./Home.css";

import {
  sendOtp,
  verifyOtp,
} from "./serviceAuth";

import {
  getMediaUrl,
} from "./apiService";

import {
  useContextUniv,
} from "../../featuresAndInfos/ContextUnivProvider";


const Home = () => {

  // ==========================================================================
  // ÉTAT FORMULAIRE
  // ==========================================================================

  const [
    email,
    setEmail,
  ] = useState("");


  const [
    otp,
    setOtp,
  ] = useState("");


  // ==========================================================================
  // ÉTAPE AUTHENTIFICATION
  // ==========================================================================

  const [
    step,
    setStep,
  ] = useState(1);


  // ==========================================================================
  // ÉTAT INTERFACE
  // ==========================================================================

  const [
    error,
    setError,
  ] = useState("");


  const [
    message,
    setMessage,
  ] = useState("");


  const [
    loadingAuth,
    setLoadingAuth,
  ] = useState(false);


  // ==========================================================================
  // CONTEXTE UNIVERSITÉ
  // ==========================================================================

  const {
    infoUniv,
    loading,
  } = useContextUniv();


  // ==========================================================================
  // CHARGEMENT UNIVERSITÉ
  // ==========================================================================

  if (loading) {

    return (
      <main className="home-loading">

        <div className="home-loading-spinner" />

        <span>
          Chargement de la plateforme...
        </span>

      </main>
    );
  }


  // ==========================================================================
  // INFORMATIONS UNIVERSITÉ
  // ==========================================================================


  const universityName =
    infoUniv?.nameUniversity ||
    "Academic Platform";


  const universitySlogan =
    infoUniv?.slogan ||
    "Plateforme académique intelligente et sécurisée";


  const universityCity =
    infoUniv?.cityUniversity ||
    "";


  const universityCode =
    infoUniv?.code ||
    "";


  const primaryColor =
    infoUniv?.primaryColor ||
    "#2563eb";


  const secondaryColor =
    infoUniv?.secondaryColor ||
    "#f97316";


  const logoUrl =
    getMediaUrl(
      infoUniv?.logoUniversity
    );


  // ==========================================================================
  // ENVOI OTP
  // ==========================================================================

  const handleSendEmail = async (
    event
  ) => {

    event.preventDefault();

    setError("");
    setMessage("");


    const emailNormalise =
      email
        .trim()
        .toLowerCase();


    if (!emailNormalise) {

      setError(
        "Veuillez entrer votre adresse email."
      );

      return;
    }


    setLoadingAuth(true);


    try {

      const result =
        await sendOtp({
          email: emailNormalise,
        });


      if (result.success) {

        setMessage(
          result.message ||
          "Le code de vérification a été envoyé à votre adresse email."
        );

        setStep(2);

      } else {

        setError(
          result.message ||
          "Impossible d'envoyer le code de vérification."
        );

      }

    } catch (error) {

      setError(
        error.message ||
        "Une erreur est survenue lors de l'envoi du code."
      );

    } finally {

      setLoadingAuth(false);

    }

  };


  // ==========================================================================
  // VÉRIFICATION OTP
  // ==========================================================================

  const handleVerifyOtp = async (
    event
  ) => {

    event.preventDefault();

    setError("");
    setMessage("");


    const otpNormalise =
      otp.trim();


    if (!/^\d{6}$/.test(
      otpNormalise
    )) {

      setError(
        "Veuillez entrer un code OTP à 6 chiffres."
      );

      return;
    }


    setLoadingAuth(true);


    try {

      const result =
        await verifyOtp({
          email:
            email
              .trim()
              .toLowerCase(),

          otp:
            otpNormalise,
        });


      if (!result.success) {

        setError(
          result.message ||
          "Code OTP incorrect."
        );

        return;
      }


      /*
       * Le backend vient de créer
       * les cookies HttpOnly.
       *
       * Nous ne récupérons jamais
       * les tokens côté JavaScript.
       */

      window.location.replace("/");

    } catch (error) {

      setError(
        error.message ||
        "Une erreur est survenue lors de la vérification."
      );

    } finally {

      setLoadingAuth(false);

    }

  };


  // ==========================================================================
  // RETOUR EMAIL
  // ==========================================================================

  const handleBackToEmail = () => {

    setStep(1);

    setOtp("");

    setError("");

    setMessage("");

  };


  // ==========================================================================
  // AFFICHAGE
  // ==========================================================================

  return (

    <main
      className="home"
      style={{
        "--univ-primary": primaryColor,
        "--univ-secondary": secondaryColor,
      }}
    >


      {/* ====================================================================
          CONTENEUR PRINCIPAL
          ==================================================================== */}

      <div className="home-conteneur">


        {/* ==================================================================
            PANNEAU UNIVERSITÉ
            ================================================================== */}

        <section className="home-presentation">


          {/* ================================================================
              LOGO
              ================================================================ */}

          <div className="home-marque">

            {logoUrl ? (

              <img
                src={logoUrl}
                alt={`Logo ${universityName}`}
                className="home-logo"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />

            ) : (

              <div className="home-logo-fallback">

                {(
                  universityCode ||
                  universityName ||
                  "AP"
                )
                  .slice(0, 2)
                  .toUpperCase()}

              </div>

            )}

          </div>


          {/* ================================================================
              IDENTITÉ UNIVERSITÉ
              ================================================================ */}

          <div className="home-identite">

            <span className="home-label">
              ESPACE UNIVERSITAIRE
            </span>


            <h1>
              Bienvenue à
              <br />
              {universityName}
            </h1>


            <p>
              {universitySlogan}
            </p>


            {(universityCity ||
              universityCode) && (

              <div className="home-meta">

                {universityCity && (

                  <span>
                    <MapPin
                      size={14}
                    />

                    {universityCity}

                  </span>

                )}


                {universityCode && (

                  <span>
                    {universityCode}
                  </span>

                )}

              </div>

            )}

          </div>


          {/* ================================================================
              FOOTER PANNEAU
              ================================================================ */}

          <div className="home-presentation-footer">

            <span>
              Accès sécurisé
            </span>

            <span>
              Portail institutionnel
            </span>

          </div>


        </section>


        {/* ==================================================================
            PANNEAU AUTHENTIFICATION
            ================================================================== */}

        <section className="home-auth">


          <div className="home-auth-interieur">


            {/* ==============================================================
                EN-TÊTE
                ============================================================== */}

            <div className="home-auth-entete">


              <div
                className="home-auth-icone"
                style={{
                  color: primaryColor,
                  backgroundColor:
                    `${primaryColor}12`,
                  borderColor:
                    `${primaryColor}25`,
                }}
              >

                {step === 1 ? (

                  <Mail
                    size={23}
                  />

                ) : (

                  <ShieldCheck
                    size={23}
                  />

                )}

              </div>


              <span
                className="home-auth-petit-titre"
                style={{
                  color: primaryColor,
                }}
              >

                {step === 1
                  ? "Connexion"
                  : "Vérification"}

              </span>


              <h2>

                {step === 1
                  ? "Bienvenue"
                  : "Vérifiez votre email"}

              </h2>


              <p>

                {step === 1

                  ? `Connectez-vous à l'espace numérique de ${universityName}.`

                  : `Un code à 6 chiffres a été envoyé à ${email}.`

                }

              </p>

            </div>


            {/* ==============================================================
                ERREUR
                ============================================================== */}

            {error && (

              <div className="home-message home-message-erreur">

                <AlertCircle
                  size={17}
                />

                <span>
                  {error}
                </span>

              </div>

            )}


            {/* ==============================================================
                SUCCÈS
                ============================================================== */}

            {message && !error && (

              <div className="home-message home-message-succes">

                <ShieldCheck
                  size={17}
                />

                <span>
                  {message}
                </span>

              </div>

            )}


            {/* ==============================================================
                ÉTAPE 1 — EMAIL
                ============================================================== */}

            {step === 1 && (

              <form
                className="home-auth-form"
                onSubmit={handleSendEmail}
              >

                <div className="home-champ">

                  <label htmlFor="email">
                    Adresse email
                  </label>


                  <div className="home-input-wrapper">

                    <Mail
                      size={18}
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => {

                        setEmail(
                          event.target.value
                        );

                        setOtp("");

                      }}
                      placeholder="nom@gmail.com"
                      autoComplete="email"
                      disabled={loadingAuth}
                      autoFocus
                    />

                  </div>

                </div>


                <button
                  type="submit"
                  className="home-auth-button"
                  disabled={loadingAuth}
                  style={{
                    backgroundColor:
                      primaryColor,
                  }}
                >

                  {loadingAuth ? (

                    <>

                      <LoaderCircle
                        size={18}
                        className="home-spinner"
                      />

                      Envoi du code...

                    </>

                  ) : (

                    <>

                      Recevoir le code

                      <ArrowRight
                        size={18}
                      />

                    </>

                  )}

                </button>

              </form>

            )}


            {/* ==============================================================
                ÉTAPE 2 — OTP
                ============================================================== */}

            {step === 2 && (

              <form
                className="home-auth-form"
                onSubmit={handleVerifyOtp}
              >

                <div className="home-champ">

                  <label htmlFor="otp">
                    Code de vérification
                  </label>


                  <div className="home-input-wrapper home-input-otp">

                    <LockKeyhole
                      size={18}
                    />

                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(event) => {

                        const value =
                          event.target.value
                            .replace(/\D/g, "");

                        setOtp(value);

                      }}
                      placeholder="000000"
                      autoComplete="one-time-code"
                      disabled={loadingAuth}
                      autoFocus
                    />

                  </div>


                  <span className="home-aide">
                    Le code de vérification est
                    valable pendant 3 minutes.
                  </span>

                </div>


                <button
                  type="submit"
                  className="home-auth-button"
                  disabled={loadingAuth}
                  style={{
                    backgroundColor:
                      primaryColor,
                  }}
                >

                  {loadingAuth ? (

                    <>

                      <LoaderCircle
                        size={18}
                        className="home-spinner"
                      />

                      Vérification...

                    </>

                  ) : (

                    <>

                      Accéder à la plateforme

                      <ArrowRight
                        size={18}
                      />

                    </>

                  )}

                </button>


                <button
                  type="button"
                  className="home-secondary-button"
                  onClick={handleBackToEmail}
                  disabled={loadingAuth}
                >

                  <ArrowLeft
                    size={16}
                  />

                  Modifier l'adresse email

                </button>

              </form>

            )}


            {/* ==============================================================
                SÉCURITÉ
                ============================================================== */}

            <div className="home-security">

              <ShieldCheck
                size={16}
              />

              <span>
                Votre connexion est sécurisée.
                Vos informations d'authentification
                sont protégées par des cookies sécurisés.
              </span>

            </div>


          </div>

        </section>

      </div>


      {/* ====================================================================
          FOOTER GLOBAL
          ==================================================================== */}

      <footer className="home-footer">

        <span>
          {universityName}
        </span>

        <span className="home-footer-separator">
          |
        </span>

        <span>
          Plateforme académique intelligente et sécurisée
        </span>

      </footer>


    </main>
  );
};


export default Home;

