import React, {
  useEffect,
  useRef,
  useState
} from "react";

import "./EnregistrementPaiementsFrais.css";

import {
  rechercherPaiementParReference,
  validerPaiementFrais,
  STATUTS_REFERENCE
} from "./enregistrementPaiementsFraisService";




// ============================================================
// COMPOSANT
// ============================================================

const EnregistrementPaiementsFrais = () => {

  // ==========================================================
  // RÉFÉRENCE
  // ==========================================================

  const [reference, setReference] =
    useState("");

  const [referenceRecherchee, setReferenceRecherchee] =
    useState("");


  // ==========================================================
  // ÉTAT DE L'INTERFACE
  // ==========================================================

  const [etape, setEtape] =
    useState("accueil");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");


  // ==========================================================
  // DONNÉES DU PAIEMENT
  // ==========================================================

  const [paiement, setPaiement] =
    useState(null);


  // ==========================================================
  // DONNÉES DE VALIDATION
  // ==========================================================

  const [montantEncaisse, setMontantEncaisse] =
    useState("");

  const [modePaiement, setModePaiement] =
    useState("");

  const [confirmation, setConfirmation] =
    useState(false);


  // ==========================================================
  // RÉSULTAT
  // ==========================================================

  const [resultat, setResultat] =
    useState(null);


  // ==========================================================
  // SCANNER
  // ==========================================================

  const [scannerOuvert, setScannerOuvert] =
    useState(false);

  const [scannerErreur, setScannerErreur] =
    useState("");

  const videoRef =
    useRef(null);

  const streamRef =
    useRef(null);

  const animationFrameRef =
    useRef(null);


  // ==========================================================
  // NOTIFICATION
  // ==========================================================

  const showMessage = (
    msg,
    type = "success"
  ) => {

    setMessage(msg);
    setMessageType(type);

    window.setTimeout(() => {

      setMessage("");
      setMessageType("");

    }, 5000);
  };


  // ==========================================================
  // NETTOYAGE SCANNER
  // ==========================================================

  const stopScanner = () => {

    if (animationFrameRef.current) {

      cancelAnimationFrame(
        animationFrameRef.current
      );

      animationFrameRef.current = null;
    }


    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }


    setScannerOuvert(false);
  };


  // ==========================================================
  // NETTOYAGE À LA DESTRUCTION
  // ==========================================================

  useEffect(() => {

    return () => {
      stopScanner();
    };

  }, []);




  // ==========================================================
  // RECHERCHE DE LA RÉFÉRENCE
  // ==========================================================

  const rechercherReference = async (
      referenceValue = reference
    ) => {

      const valeur =
        String(referenceValue || "").trim();


      if (!valeur) {

        showMessage(
          "Veuillez saisir ou scanner une référence de paiement.",
          "error"
        );

        return;
      }


      if (loading) {
        return;
      }


      try {

        setLoading(true);

        setMessage("");

        setMessageType("");

        setPaiement(null);

        setResultat(null);


        const paiementNormalise =
          await rechercherPaiementParReference(
            valeur
          );


        if (!paiementNormalise) {

          throw new Error(
            "Les informations du paiement sont invalides."
          );

        }


        setReference(
          paiementNormalise.reference
        );


        setReferenceRecherchee(
          paiementNormalise.reference
        );


        setPaiement(
          paiementNormalise
        );


        // ========================================================
        // VÉRIFICATION DU STATUT
        // ========================================================

        if (
          paiementNormalise.statutReference !==
          STATUTS_REFERENCE.VALIDE
        ) {

          setEtape(
            "verification"
          );


          showMessage(

            paiementNormalise.statutReference ===
              STATUTS_REFERENCE.EXPIREE

              ? "Cette référence de paiement a expiré."

              : paiementNormalise.statutReference ===
                STATUTS_REFERENCE.UTILISEE

              ? "Cette référence a déjà été utilisée."

              : "Cette référence n'est pas valide.",

            "error"

          );


          return;
        }


        // ========================================================
        // VÉRIFICATION CRYPTOGRAPHIQUE
        // ========================================================

        if (

          paiementNormalise.signatureValide ===
          false

          ||

          paiementNormalise.securite
            ?.signatureValide === false

        ) {

          setEtape(
            "verification"
          );


          showMessage(
            "La signature de sécurité de cette référence est invalide.",
            "error"
          );


          return;
        }


        // ========================================================
        // QR AUTHENTIQUE
        // ========================================================

        if (
          paiementNormalise.securite
            ?.qrAuthentique === false
        ) {

          setEtape(
            "verification"
          );


          showMessage(
            "Le QR code présenté n'est pas authentique.",
            "error"
          );


          return;
        }


        // ========================================================
        // MONTANT PROPOSÉ
        // ========================================================

        const montantTranche =
          Number(
            paiementNormalise.tranche?.montant ||
            0
          );


        const solde =
          Number(
            paiementNormalise.frais?.solde ||
            0
          );


        setMontantEncaisse(

          montantTranche > 0
            ? montantTranche
            : solde

        );


        setEtape(
          "confirmation"
        );


      } catch (error) {

        console.error(
          "Erreur recherche référence :",
          error
        );


        setEtape(
          "accueil"
        );


        showMessage(
          error?.message ||
          "Impossible de récupérer cette opération.",
          "error"
        );


      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // TRAITER LE CONTENU DU QR
  // ==========================================================

  const traiterQRCode = (contenu) => {

    const valeur =
      String(contenu || "").trim();


    if (!valeur) {
      return;
    }


    /*
     * Le QR peut contenir directement une référence
     * ou une URL de paiement.
     */

    let referenceExtraite =
      valeur;


    try {

      if (
        valeur.startsWith("http://") ||
        valeur.startsWith("https://")
      ) {

        const url =
          new URL(valeur);

        referenceExtraite =
          url.searchParams.get(
            "reference"
          ) ||
          url.searchParams.get(
            "ref"
          ) ||
          url.pathname.split("/").filter(Boolean).pop() ||
          valeur;
      }

    } catch {
      referenceExtraite = valeur;
    }


    setReference(
      referenceExtraite
    );

    stopScanner();

    rechercherReference(
      referenceExtraite
    );

  };


  // ==========================================================
  // SCANNER QR NATIF
  // ==========================================================

  const scannerFrame = async () => {

    if (
      !videoRef.current ||
      !streamRef.current
    ) {
      return;
    }


    if (
      !("BarcodeDetector" in window)
    ) {

      return;
    }


    try {

      const detector =
        new window.BarcodeDetector({
          formats: ["qr_code"],
        });


      const codes =
        await detector.detect(
          videoRef.current
        );


      if (
        Array.isArray(codes) &&
        codes.length > 0 &&
        codes[0]?.rawValue
      ) {

        traiterQRCode(
          codes[0].rawValue
        );

        return;
      }

    } catch (error) {

      console.warn(
        "Détection QR :",
        error
      );

    }


    animationFrameRef.current =
      requestAnimationFrame(
        scannerFrame
      );
  };


  // ==========================================================
  // OUVRIR LE SCANNER
  // ==========================================================

  const ouvrirScanner = async () => {

    setScannerErreur("");


    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {

      setScannerErreur(
        "La caméra n'est pas disponible sur cet appareil."
      );

      setScannerOuvert(true);

      return;
    }


    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
          },
          audio: false,
        });


      streamRef.current =
        stream;

      setScannerOuvert(true);


      window.setTimeout(() => {

        if (
          videoRef.current
        ) {

          videoRef.current.srcObject =
            stream;

          videoRef.current
            .play()
            .then(() => {

              if (
                "BarcodeDetector" in window
              ) {

                scannerFrame();

              } else {

                setScannerErreur(
                  "La détection automatique des QR codes n'est pas disponible dans ce navigateur. Utilisez la saisie manuelle."
                );

              }

            })
            .catch(
              (error) => {

                console.error(
                  "Lecture caméra :",
                  error
                );

                setScannerErreur(
                  "Impossible de démarrer la caméra."
                );
              }
            );

        }

      }, 50);

    } catch (error) {

      console.error(
        "Accès caméra :",
        error
      );

      setScannerOuvert(true);

      setScannerErreur(
        "Accès à la caméra refusé ou impossible. Vous pouvez saisir la référence manuellement."
      );
    }

  };


  // ==========================================================
  // ANNULER
  // ==========================================================

  const annulerOperation = () => {

    stopScanner();

    setPaiement(null);
    setReference("");
    setReferenceRecherchee("");
    setMontantEncaisse("");
    setModePaiement("");
    setConfirmation(false);
    setResultat(null);
    setEtape("accueil");
    setMessage("");
    setMessageType("");

  };


  // ==========================================================
  // VALIDER LE PAIEMENT
  // ==========================================================

  const validerPaiement = async () => {

    if (
      !paiement ||
      !referenceRecherchee
    ) {
      return;
    }


    if (!montantEncaisse) {

      showMessage(
        "Veuillez renseigner le montant réellement encaissé.",
        "error"
      );

      return;
    }


    const montant =
      Number(montantEncaisse);


    if (
      !Number.isFinite(montant) ||
      montant <= 0
    ) {

      showMessage(
        "Le montant encaissé est invalide.",
        "error"
      );

      return;
    }


    if (!modePaiement) {

      showMessage(
        "Veuillez sélectionner le mode de paiement.",
        "error"
      );

      return;
    }


    if (!confirmation) {

      showMessage(
        "Veuillez confirmer que le montant a été réellement encaissé.",
        "error"
      );

      return;
    }


    if (loading) {
      return;
    }


    try {

      setLoading(true);

      setMessage("");

      setMessageType("");


      const data =
        await validerPaiementFrais({

          reference:
            referenceRecherchee,

          montantEncaisse:
            montant,

          modePaiement:
            modePaiement,

          confirmationAgent:
            true,

        });


      setResultat({

        success: true,

        reference:
          data?.reference_operation ||
          data?.operation?.reference ||
          referenceRecherchee,

        transaction:
          data?.numero_transaction ||
          data?.operation?.numero_transaction ||
          data?.transaction?.reference ||
          "—",

        date:
          data?.date_validation ||
          data?.operation?.date_validation ||
          new Date().toISOString(),

        montant:
          Number(
            data?.montant_encaisse ??
            montant
          ),

        modePaiement:
          data?.mode_paiement ||
          modePaiement,

      });


      setEtape(
        "succes"
      );


    } catch (error) {

      console.error(
        "Erreur validation paiement :",
        error
      );


      showMessage(
        error?.message ||
        "Erreur lors de la validation du paiement.",
        "error"
      );


    } finally {

      setLoading(false);

    }

  };


  // ==========================================================
  // NOUVELLE OPÉRATION
  // ==========================================================

  const nouvelleOperation = () => {

    setPaiement(null);
    setReference("");
    setReferenceRecherchee("");
    setMontantEncaisse("");
    setModePaiement("");
    setConfirmation(false);
    setResultat(null);
    setEtape("accueil");
    setMessage("");
    setMessageType("");

  };


  // ==========================================================
  // FORMAT MONÉTAIRE
  // ==========================================================

  const formatMontant = (
    montant,
    devise = "FC"
  ) => {

    const nombre =
      Number(montant);


    if (
      !Number.isFinite(nombre)
    ) {
      return `0 ${devise}`;
    }


    return `${new Intl.NumberFormat(
      "fr-FR"
    ).format(nombre)} ${devise}`;

  };


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }


    const valeur =
      new Date(date);


    if (
      Number.isNaN(
        valeur.getTime()
      )
    ) {
      return date;
    }


    return new Intl.DateTimeFormat(
      "fr-FR",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(valeur);

  };


  // ==========================================================
  // INITIALS
  // ==========================================================

  const getInitiales = () => {

    if (!paiement?.etudiant) {
      return "ET";
    }


    const prenom =
      paiement.etudiant.prenom || "";

    const nom =
      paiement.etudiant.nom || "";


    return `${prenom.charAt(0)}${nom.charAt(0)}`
      .toUpperCase()
      .trim() || "ET";

  };


  // ==========================================================
  // RENDU
  // ==========================================================

  return (

    <section className="enregistrement-paiements-container">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="paiement-page-header">

        <div>

          <span className="paiement-eyebrow">
            Caisse / Banque
          </span>

          <h2>
            Enregistrement des paiements
          </h2>

          <p>
            Vérifiez la demande de paiement
            de l'étudiant avant de confirmer
            l'encaissement.
          </p>

        </div>


        <div className="secure-badge">

          <span className="secure-icon">
            ✓
          </span>

          <div>

            <strong>
              Session sécurisée
            </strong>

            <small>
              Opérations protégées
            </small>

          </div>

        </div>

      </div>


      {/* ======================================================
          BARRE D'ÉTAPES
      ====================================================== */}

      <div className="payment-steps">

        <div
          className={`payment-step ${
            etape === "accueil"
              ? "active"
              : ""
          } ${
            [
              "confirmation",
              "succes"
            ].includes(etape)
              ? "completed"
              : ""
          }`}
        >

          <span>
            1
          </span>

          <label>
            Identifier
          </label>

        </div>


        <div className="step-line" />


        <div
          className={`payment-step ${
            etape === "confirmation"
              ? "active"
              : ""
          } ${
            etape === "succes"
              ? "completed"
              : ""
          }`}
        >

          <span>
            2
          </span>

          <label>
            Vérifier
          </label>

        </div>


        <div className="step-line" />


        <div
          className={`payment-step ${
            etape === "succes"
              ? "active completed"
              : ""
          }`}
        >

          <span>
            3
          </span>

          <label>
            Valider
          </label>

        </div>

      </div>


      {/* ======================================================
          MESSAGE
      ====================================================== */}

      {message && (

        <div
          className={`payment-alert ${messageType}`}
        >

          <span className="alert-icon">
            {messageType === "error"
              ? "!"
              : "✓"}
          </span>

          <span>
            {message}
          </span>

        </div>

      )}


      {/* ======================================================
          ÉTAPE ACCUEIL
      ====================================================== */}

      {etape === "accueil" && (

        <div className="payment-workspace">


          <div className="scanner-card">


            <div className="scanner-card-top">

              <div className="scanner-icon">
                ▦
              </div>

              <span className="scanner-status">
                Prêt à scanner
              </span>

            </div>


            <h3>
              Scanner la référence de paiement
            </h3>


            <p>
              Demandez à l'étudiant de présenter
              le QR code généré depuis son espace
              académique.
            </p>


            <button
              type="button"
              className="scan-button"
              onClick={ouvrirScanner}
              disabled={loading}
            >

              <span className="scan-button-icon">
                ⌁
              </span>

              Scanner un QR code

            </button>


            <div className="scanner-divider">

              <span>
                ou
              </span>

            </div>


            <div className="manual-reference">

              <label htmlFor="reference-paiement">
                Saisir la référence manuellement
              </label>


              <div className="reference-input-row">

                <input
                  id="reference-paiement"
                  type="text"
                  value={reference}
                  onChange={(event) =>
                    setReference(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {

                    if (
                      event.key === "Enter"
                    ) {

                      rechercherReference();

                    }

                  }}
                  placeholder="Ex. PAY-2026-8F4K92"
                  autoComplete="off"
                />


                <button
                  type="button"
                  className="reference-search-button"
                  onClick={() =>
                    rechercherReference()
                  }
                  disabled={loading}
                >

                  {loading
                    ? "Recherche..."
                    : "Rechercher"}

                </button>

              </div>

            </div>


            <div className="scanner-security-note">

              <span>
                ◉
              </span>

              La référence est vérifiée
              côté serveur avant toute validation.

            </div>

          </div>


          <div className="agent-guide-card">

            <div className="guide-header">

              <span className="guide-icon">
                i
              </span>

              <div>

                <h3>
                  Procédure agent
                </h3>

                <p>
                  À suivre pour chaque étudiant
                </p>

              </div>

            </div>


            <div className="guide-list">

              <div className="guide-item">

                <span>
                  01
                </span>

                <div>

                  <strong>
                    Scanner
                  </strong>

                  <p>
                    Scannez le QR code présenté
                    par l'étudiant.
                  </p>

                </div>

              </div>


              <div className="guide-item">

                <span>
                  02
                </span>

                <div>

                  <strong>
                    Vérifier
                  </strong>

                  <p>
                    Comparez l'identité affichée
                    avec l'étudiant présent.
                  </p>

                </div>

              </div>


              <div className="guide-item">

                <span>
                  03
                </span>

                <div>

                  <strong>
                    Encaisser
                  </strong>

                  <p>
                    Encaissez exactement le montant
                    affiché par la plateforme.
                  </p>

                </div>

              </div>


              <div className="guide-item">

                <span>
                  04
                </span>

                <div>

                  <strong>
                    Confirmer
                  </strong>

                  <p>
                    Validez uniquement après
                    réception effective des fonds.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* ======================================================
          ÉTAPE VÉRIFICATION
      ====================================================== */}

      {etape === "verification" &&
        paiement && (

        <div className="invalid-payment-card">

          <div className="invalid-icon">
            !
          </div>

          <h3>
            Paiement non vérifiable
          </h3>

          <p>
            La référence
            <strong>
              {" "}
              {paiement.reference}
            </strong>
            {" "}
            ne peut pas être traitée.
          </p>

          <button
            type="button"
            className="secondary-action"
            onClick={annulerOperation}
          >
            Nouvelle recherche
          </button>

        </div>

      )}


      {/* ======================================================
          ÉTAPE CONFIRMATION
      ====================================================== */}

      {etape === "confirmation" &&
        paiement && (

        <div className="confirmation-workspace">


          {/* ==================================================
              IDENTITÉ
          ================================================== */}

          <div className="identity-card">

            <div className="identity-card-header">

              <div>

                <span>
                  ÉTUDIANT
                </span>

                <h3>
                  Vérification de l'identité
                </h3>

              </div>


              <div className="verified-status">

                <span>
                  ✓
                </span>

                Référence vérifiée

              </div>

            </div>


            <div className="identity-main">

              {paiement.etudiant.photo ? (

                <img
                  src={
                    paiement.etudiant.photo
                  }
                  alt={
                    paiement.etudiant.nomComplet
                  }
                  className="student-photo"
                />

              ) : (

                <div className="student-avatar">

                  {getInitiales()}

                </div>

              )}


              <div className="student-identity">

                <h3>
                  {
                    paiement.etudiant.nomComplet
                  }
                </h3>

                <span className="student-number">
                  Matricule :
                  {" "}
                  <strong>
                    {
                      paiement.etudiant.matricule
                    }
                  </strong>
                </span>

              </div>

            </div>


            <div className="identity-details">

              <div>

                <span>
                  Faculté
                </span>

                <strong>
                  {
                    paiement.formation.faculte
                  }
                </strong>

              </div>


              <div>

                <span>
                  Mention
                </span>

                <strong>
                  {
                    paiement.formation.mention
                  }
                </strong>

              </div>


              <div>

                <span>
                  Promotion
                </span>

                <strong>
                  {
                    paiement.formation.promotion
                  }
                </strong>

              </div>


              <div>

                <span>
                  Année académique
                </span>

                <strong>
                  {
                    paiement.formation.annee
                  }
                </strong>

              </div>

            </div>

          </div>


          {/* ==================================================
              PAIEMENT
          ================================================== */}

          <div className="payment-details-card">

            <div className="payment-details-header">

              <div>

                <span>
                  DEMANDE DE PAIEMENT
                </span>

                <h3>
                  {
                    paiement.frais.libelle
                  }
                </h3>

              </div>


              <div className="payment-reference">

                <span>
                  Référence
                </span>

                <strong>
                  {
                    paiement.reference
                  }
                </strong>

              </div>

            </div>


            <div className="payment-summary">

              <div className="payment-amount-main">

                <span>
                  Montant à encaisser
                </span>

                <strong>
                  {
                    formatMontant(
                      paiement.tranche?.montant ||
                      paiement.frais?.solde ||
                      paiement.frais?.montantTotal,
                      paiement.frais?.devise
                    )
                  }
                </strong>

              </div>


              <div className="payment-summary-grid">

                <div>

                  <span>
                    Type de frais
                  </span>

                  <strong>
                    {
                      paiement.frais.type
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Tranche
                  </span>

                  <strong>
                    {
                      paiement.tranche.numero
                        ? `N° ${paiement.tranche.numero} — `
                        : ""
                    }

                    {
                      paiement.tranche.libelle
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Total tarif
                  </span>

                  <strong>
                    {
                      formatMontant(
                        paiement.frais.montantTotal,
                        paiement.frais.devise
                      )
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Déjà payé
                  </span>

                  <strong>
                    {
                      formatMontant(
                        paiement.frais.montantDejaPaye,
                        paiement.frais.devise
                      )
                    }
                  </strong>

                </div>

              </div>

            </div>


            <div className="balance-row">

              <span>
                Solde après cette opération
              </span>

              <strong>

                {
                  formatMontant(
                    Math.max(
                      0,
                      (
                        paiement.frais.solde -
                        Number(
                          paiement.tranche.montant ||
                          0
                        )
                      )
                    ),
                    paiement.frais.devise
                  )
                }

              </strong>

            </div>

          </div>


          {/* ==================================================
              SÉCURITÉ
          ================================================== */}

          <div className="security-card">

            <div className="security-card-header">

              <div className="security-shield">
                ✓
              </div>

              <div>

                <h3>
                  Vérification de sécurité
                </h3>

                <p>
                  La demande a été vérifiée par
                  le serveur Academic Platform.
                </p>

              </div>

            </div>


            <div className="security-checks">

              <div className="security-check">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Référence authentique
                  </strong>

                  <small>
                    La référence correspond
                    à une opération enregistrée.
                  </small>

                </div>

              </div>


              <div className="security-check">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Signature vérifiée
                  </strong>

                  <small>
                    La signature cryptographique
                    a été validée côté serveur.
                  </small>

                </div>

              </div>


              <div className="security-check">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Référence disponible
                  </strong>

                  <small>
                    Cette référence n'a pas encore
                    été utilisée.
                  </small>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              ENCAISSEMENT
          ================================================== */}

          <div className="cashier-card">

            <div className="cashier-card-header">

              <div>

                <span>
                  ENCAISSEMENT
                </span>

                <h3>
                  Confirmer les fonds reçus
                </h3>

              </div>

            </div>


            <div className="cashier-form-grid">

              <div className="cashier-field">

                <label htmlFor="montant-encaisse">
                  Montant réellement encaissé
                </label>

                <div className="cash-amount-input">

                  <input
                    id="montant-encaisse"
                    type="number"
                    min="0"
                    step="0.01"
                    value={montantEncaisse}
                    onChange={(event) =>
                      setMontantEncaisse(
                        event.target.value
                      )
                    }
                    disabled={loading}
                  />

                  <span>
                    {
                      paiement.frais.devise
                    }
                  </span>

                </div>

              </div>


              <div className="cashier-field">

                <label htmlFor="mode-paiement">
                  Mode de paiement
                </label>

                <select
                  id="mode-paiement"
                  value={modePaiement}
                  onChange={(event) =>
                    setModePaiement(
                      event.target.value
                    )
                  }
                  disabled={loading}
                >

                  <option value="">
                    Sélectionner
                  </option>

                  <option value="especes">
                    Espèces
                  </option>

                  <option value="virement">
                    Virement bancaire
                  </option>

                  <option value="mobile_money">
                    Mobile Money
                  </option>

                  <option value="cheque">
                    Chèque
                  </option>

                  <option value="autre">
                    Autre
                  </option>

                </select>

              </div>

            </div>


            <label className="confirmation-checkbox">

              <input
                type="checkbox"
                checked={confirmation}
                onChange={(event) =>
                  setConfirmation(
                    event.target.checked
                  )
                }
                disabled={loading}
              />

              <span className="custom-checkbox">
                {confirmation
                  ? "✓"
                  : ""}
              </span>

              <span>

                Je confirme avoir effectivement
                reçu le montant indiqué avant
                de valider cette opération.

              </span>

            </label>

          </div>


          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="confirmation-actions">

            <button
              type="button"
              className="cancel-action"
              onClick={annulerOperation}
              disabled={loading}
            >
              Annuler
            </button>


            <button
              type="button"
              className="validate-payment-button"
              onClick={validerPaiement}
              disabled={
                loading ||
                !confirmation ||
                !modePaiement ||
                !montantEncaisse
              }
            >

              <span>
                ✓
              </span>

              {loading
                ? "Validation en cours..."
                : "Valider l'encaissement"}

            </button>

          </div>

        </div>

      )}


      {/* ======================================================
          SUCCÈS
      ====================================================== */}

      {etape === "succes" &&
        resultat && (

        <div className="success-workspace">

          <div className="success-icon">
            ✓
          </div>


          <span className="success-label">
            OPÉRATION ENREGISTRÉE
          </span>


          <h2>
            Paiement validé avec succès
          </h2>


          <p>
            L'opération a été enregistrée
            dans Academic Platform.
          </p>


          <div className="success-receipt">

            <div>

              <span>
                Étudiant
              </span>

              <strong>
                {
                  paiement?.etudiant?.nomComplet
                }
              </strong>

            </div>


            <div>

              <span>
                Matricule
              </span>

              <strong>
                {
                  paiement?.etudiant?.matricule
              }
              </strong>

            </div>


            <div>

              <span>
                Frais
              </span>

              <strong>
                {
                  paiement?.frais?.libelle
                }
              </strong>

            </div>


            <div>

              <span>
                Montant
              </span>

              <strong className="receipt-amount">
                {
                  formatMontant(
                    resultat.montant,
                    paiement?.frais?.devise ||
                    "FC"
                  )
                }
              </strong>

            </div>


            <div>

              <span>
                Référence
              </span>

              <strong>
                {
                  resultat.reference
                }
              </strong>

            </div>


            <div>

              <span>
                N° transaction
              </span>

              <strong>
                {
                  resultat.transaction
                }
              </strong>

            </div>


            <div>

              <span>
                Mode
              </span>

              <strong>
                {
                  resultat.modePaiement
                }
              </strong>

            </div>


            <div>

              <span>
                Date
              </span>

              <strong>
                {
                  formatDate(
                    resultat.date
                  )
                }
              </strong>

            </div>

          </div>


          <div className="student-sync-message">

            <span>
              ✓
            </span>

            <div>

              <strong>
                Situation de l'étudiant mise à jour
              </strong>

              <p>
                L'étudiant pourra voir cette
                opération dans son espace académique
                après synchronisation.

              </p>

            </div>

          </div>


          <button
            type="button"
            className="new-payment-button"
            onClick={nouvelleOperation}
          >

            + Enregistrer un autre paiement

          </button>

        </div>

      )}


      {/* ======================================================
          MODAL SCANNER
      ====================================================== */}

      {scannerOuvert && (

        <div
          className="scanner-modal-overlay"
          onClick={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              stopScanner();

            }

          }}
        >

          <div className="scanner-modal">

            <div className="scanner-modal-header">

              <div>

                <span>
                  SCANNER
                </span>

                <h3>
                  QR code de paiement
                </h3>

              </div>


              <button
                type="button"
                className="scanner-close"
                onClick={stopScanner}
              >
                ×
              </button>

            </div>


            <div className="scanner-camera">

              <video
                ref={videoRef}
                muted
                playsInline
              />

              <div className="scanner-frame">

                <span className="corner top-left" />
                <span className="corner top-right" />
                <span className="corner bottom-left" />
                <span className="corner bottom-right" />

                <div className="scanner-line" />

              </div>


              {!scannerErreur && (

                <div className="scanner-camera-label">

                  Placez le QR code
                  dans le cadre

                </div>

              )}

            </div>


            {scannerErreur && (

              <div className="scanner-error">

                <span>
                  !
                </span>

                {scannerErreur}

              </div>

            )}


            <div className="scanner-manual">

              <span>
                Vous pouvez également saisir
                directement la référence.
              </span>


              <div>

                <input
                  type="text"
                  value={reference}
                  onChange={(event) =>
                    setReference(
                      event.target.value
                    )
                  }
                  placeholder="Référence de paiement"
                />


                <button
                  type="button"
                  onClick={() => {

                    stopScanner();

                    rechercherReference();

                  }}
                >
                  Rechercher
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </section>

  );

};


export default EnregistrementPaiementsFrais;
