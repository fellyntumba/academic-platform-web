import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import "./EnregistrementPaiementsFrais.css";

import {
  verifierPaiementParQRCode,
  verifierPaiementParReference,
  confirmerPaiement,
  rejeterPaiementAttente,
} from "./enregistrementPaiementsFraisService";

import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";


// ============================================================
// CONSTANTES
// ============================================================

const QR_READER_ELEMENT_ID =
  "paiement-qr-reader";


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
  // RÉSULTAT DE LA VÉRIFICATION
  // ==========================================================
  const [resultatVerification, setResultatVerification] =
    useState(null);


  // ==========================================================
  // RÉSULTAT DE LA VALIDATION
  // ==========================================================
  const [resultatValidation, setResultatValidation] =
    useState(null);


  // ==========================================================
  // RÉSULTAT DU REJET
  // ==========================================================
  const [resultatRejet, setResultatRejet] =
    useState(null);


  // ==========================================================
  // ORIGINE DE LA VÉRIFICATION
  // ==========================================================

  const [methodeVerification, setMethodeVerification] =
    useState("");


  // ==========================================================
  // SCANNER QR
  // ==========================================================

  const [scannerOuvert, setScannerOuvert] =
    useState(false);

  const [scannerErreur, setScannerErreur] =
    useState("");

  const [scannerDemarrage, setScannerDemarrage] =
    useState(false);

  const qrScannerRef =
    useRef(null);

  const qrScanEnCoursRef =
    useRef(false);

  const scannerMontageRef =
    useRef(false);


  // ==========================================================
  // NOTIFICATION
  // ==========================================================

  const showMessage = useCallback((
    msg,
    type = "success"
  ) => {

    setMessage(msg);
    setMessageType(type);

    window.setTimeout(() => {

      setMessage("");
      setMessageType("");

    }, 5000);

  }, []);


  // ==========================================================
  // ARRÊTER LE SCANNER
  // ==========================================================

  const stopScanner = useCallback(async () => {

    qrScanEnCoursRef.current =
      false;

    setScannerDemarrage(false);


    const scanner =
      qrScannerRef.current;


    if (!scanner) {

      setScannerOuvert(false);

      return;

    }


    try {

      const state =
        scanner.getState();


      if (
        state === 2 ||
        state === 3
      ) {

        await scanner.stop();

      }

    } catch (error) {

      console.warn(
        "Arrêt du scanner QR :",
        error
      );

    }


    try {

      scanner.clear();

    } catch (error) {

      console.warn(
        "Nettoyage du scanner QR :",
        error
      );

    }


    qrScannerRef.current =
      null;

    setScannerOuvert(false);

  }, []);


  // ==========================================================
  // EXTRAIRE LES DONNÉES DU QR CODE
  // ==========================================================

  const extraireDonneesQRCode = useCallback((
    contenu
  ) => {

    const valeur =
      String(
        contenu || ""
      ).trim();


    if (!valeur) {

      throw new Error(
        "Le QR code est vide."
      );

    }


    /*
     * ========================================================
     * CAS 1 :
     * LE QR CONTIENT DIRECTEMENT UNE URL
     * ========================================================
     */

    // if (
    //   valeur.startsWith("http://") ||
    //   valeur.startsWith("https://")
    // ) {

    //   let url;

    //   try {

    //     url =
    //       new URL(valeur);

    //   } catch {

    //     throw new Error(
    //       "L'URL contenue dans le QR code est invalide."
    //     );

    //   }


    //   const idPaiement =
    //     url.searchParams.get(
    //       "id_paiement"
    //     );


    //   const referencePaiement =
    //     url.searchParams.get(
    //       "reference_paiement"
    //     );


    //   const tokenSecurite =
    //     url.searchParams.get(
    //       "token_securite"
    //     );


    //   if (
    //     idPaiement &&
    //     referencePaiement &&
    //     tokenSecurite
    //   ) {

    //     return {

    //       idPaiement,

    //       referencePaiement,

    //       tokenSecurite,

    //     };

    //   }


    //   /*
    //    * ======================================================
    //    * COMPATIBILITÉ ALTERNATIVE
    //    * ======================================================
    //    */

    //   const referenceAlternative =
    //     url.searchParams.get(
    //       "reference"
    //     ) ||
    //     url.searchParams.get(
    //       "ref"
    //     );


    //   if (referenceAlternative) {

    //     return {

    //       idPaiement:
    //         url.searchParams.get(
    //           "id"
    //         ),

    //       referencePaiement:
    //         referenceAlternative,

    //       tokenSecurite:
    //         url.searchParams.get(
    //           "token"
    //         ) ||
    //         url.searchParams.get(
    //           "token_securite"
    //         ),

    //     };

    //   }

    // }


    /*
     * ========================================================
     * CAS 2 :
     * LE QR CONTIENT UN JSON
     * ========================================================
     */

    try {

      const json =
        JSON.parse(valeur);


      if (
        json &&
        (
          json.id_paiement ||
          json.idPaiement
        ) &&
        (
          json.reference_paiement ||
          json.referencePaiement
        ) &&
        (
          json.token_securite ||
          json.tokenSecurite
        )
      ) {

        return {

          idPaiement:
            json.id_paiement ||
            json.idPaiement,

          referencePaiement:
            json.reference_paiement ||
            json.referencePaiement,

          tokenSecurite:
            json.token_securite ||
            json.tokenSecurite,

        };

      }

    } catch {
      /*
       * Le contenu n'est pas du JSON.
       */
    }


    throw new Error(
      "Le QR code ne contient pas les informations de paiement attendues."
    );

  }, []);


  // ==========================================================
  // RECHERCHE PAR RÉFÉRENCE
  // ==========================================================

  const rechercherReference = useCallback(async (
    referenceValue = reference
  ) => {

    const valeur =
      String(
        referenceValue || ""
      ).trim();


    if (!valeur) {

      showMessage(
        "Veuillez saisir une référence de paiement.",
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

      setResultatVerification(null);
      setResultatValidation(null);
      setResultatRejet(null);


      const response =
        await verifierPaiementParReference(
          valeur
        );


      if (
        !response?.success ||
        !response?.data?.paiement
      ) {

        throw new Error(
          response?.message ||
          "Les informations du paiement sont invalides."
        );

      }


      setReference(
        response.data.paiement.reference_paiement
      );


      setReferenceRecherchee(
        response.data.paiement.reference_paiement
      );


      setPaiement(
        response.data
      );


      setResultatVerification(
        response
      );


      setMethodeVerification(
        "reference"
      );


      setEtape(
        "verification"
      );


      showMessage(
        "Paiement trouvé et vérifié avec succès.",
        "success"
      );

    } catch (error) {

      console.error(
        "Erreur vérification référence :",
        error
      );


      setPaiement(null);

      setResultatVerification(null);

      setResultatValidation(null);

      setEtape(
        "accueil"
      );


      if (
        error?.code ===
        "PAYMENT_NOT_FOUND"
      ) {

        showMessage(
          "Aucun paiement correspondant à cette référence.",
          "error"
        );

      } else if (
        error?.code ===
        "PAYMENT_NOT_PENDING"
      ) {

        showMessage(
          error?.message ||
          "Ce paiement n'est plus en attente.",
          "error"
        );

      } else {

        showMessage(
          error?.message ||
          "Impossible de vérifier ce paiement.",
          "error"
        );

      }

    } finally {

      setLoading(false);

    }

  }, [
    loading,
    reference,
    showMessage,
  ]);


  // ==========================================================
  // VÉRIFICATION PAR QR CODE
  // ==========================================================

  const verifierQRCode = useCallback(async (
    donneesQR
  ) => {

    if (loading) {

      return;

    }


    try {

      setLoading(true);

      setMessage("");
      setMessageType("");

      setPaiement(null);

      setResultatVerification(null);
      setResultatValidation(null);
      setResultatRejet(null);


      const response =
        await verifierPaiementParQRCode({

          idPaiement:
            donneesQR.idPaiement,

          referencePaiement:
            donneesQR.referencePaiement,

          tokenSecurite:
            donneesQR.tokenSecurite,

        });


      if (
        !response?.success ||
        !response?.data?.paiement
      ) {

        throw new Error(
          response?.message ||
          "Les informations du paiement sont invalides."
        );

      }


      setReference(
        response.data.paiement.reference_paiement
      );


      setReferenceRecherchee(
        response.data.paiement.reference_paiement
      );


      setPaiement(
        response.data
      );


      setResultatVerification(
        response
      );


      setMethodeVerification(
        "qr"
      );


      setEtape(
        "verification"
      );


      showMessage(
        "QR code authentifié et paiement vérifié avec succès.",
        "success"
      );

    } catch (error) {

      console.error(
        "Erreur vérification QR :",
        error
      );


      setPaiement(null);

      setResultatVerification(null);
      setResultatValidation(null);

      setEtape(
        "accueil"
      );


      if (
        error?.code ===
        "INVALID_PAYMENT_TOKEN"
      ) {

        showMessage(
          "Le token de sécurité du QR code est invalide.",
          "error"
        );

      } else if (
        error?.code ===
        "PAYMENT_NOT_FOUND"
      ) {

        showMessage(
          "Le paiement associé à ce QR code est introuvable.",
          "error"
        );

      } else if (
        error?.code ===
        "PAYMENT_NOT_PENDING"
      ) {

        showMessage(
          error?.message ||
          "Ce paiement n'est plus en attente.",
          "error"
        );

      } else {

        showMessage(
          error?.message ||
          "Impossible de vérifier le QR code.",
          "error"
        );

      }

    } finally {

      setLoading(false);

    }

  }, [
    loading,
    showMessage,
  ]);


  // ==========================================================
  // TRAITER LE CONTENU DU QR
  // ==========================================================

  const traiterQRCode = useCallback(async (
    contenu
  ) => {

    if (
      qrScanEnCoursRef.current
    ) {

      return;

    }


    qrScanEnCoursRef.current =
      true;


    try {

      const donneesQR =
        extraireDonneesQRCode(
          contenu
        );


      await stopScanner();


      await verifierQRCode(
        donneesQR
      );

    } catch (error) {

      console.error(
        "Traitement QR :",
        error
      );


      qrScanEnCoursRef.current =
        false;


      showMessage(
        error?.message ||
        "QR code invalide.",
        "error"
      );

    }

  }, [
    extraireDonneesQRCode,
    stopScanner,
    verifierQRCode,
    showMessage,
  ]);


  // ==========================================================
  // DÉMARRER LE SCANNER QR
  // ==========================================================

  const demarrerScanner = useCallback(async () => {

    if (
      scannerDemarrage
    ) {

      return;

    }


    if (
      qrScannerRef.current
    ) {

      return;

    }


    setScannerErreur("");

    setScannerDemarrage(true);


    try {

      if (
        typeof window === "undefined" ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {

        throw new Error(
          "La caméra n'est pas disponible dans ce navigateur."
        );

      }


      const hostname =
        window.location.hostname;


      const contexteSecurise =
        window.isSecureContext ||
        hostname === "localhost" ||
        hostname === "127.0.0.1";


      if (!contexteSecurise) {

        throw new Error(
          "La caméra nécessite une connexion HTTPS. Utilisez HTTPS en production."
        );

      }


      const element =
        document.getElementById(
          QR_READER_ELEMENT_ID
        );


      if (!element) {

        throw new Error(
          "Impossible d'initialiser la zone du scanner."
        );

      }


      const scanner =
        new Html5Qrcode(
          QR_READER_ELEMENT_ID,
          {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
            ],

            verbose: false,
          }
        );


      qrScannerRef.current =
        scanner;


      const cameraConfig = {

        fps: 10,

        qrbox: (
          viewfinderWidth,
          viewfinderHeight
        ) => {

          const largeur =
            Math.min(
              viewfinderWidth,
              viewfinderHeight
            );

          const taille =
            Math.floor(
              largeur * 0.70
            );

          return {

            width: taille,

            height: taille,

          };

        },

        aspectRatio: 1,

        disableFlip: false,

      };


      await scanner.start(

        {
          facingMode: {
            exact: "environment",
          },
        },

        cameraConfig,

        async (decodedText) => {

          await traiterQRCode(
            decodedText
          );

        },

        () => {}

      );


      setScannerErreur("");

    } catch (error) {

      console.error(
        "Démarrage scanner QR :",
        error
      );


      try {

        if (
          qrScannerRef.current
        ) {

          try {

            await qrScannerRef.current.clear();

          } catch {}

          qrScannerRef.current =
            null;

        }


        const scanner =
          new Html5Qrcode(
            QR_READER_ELEMENT_ID,
            {
              formatsToSupport: [
                Html5QrcodeSupportedFormats.QR_CODE,
              ],

              verbose: false,
            }
          );


        qrScannerRef.current =
          scanner;


        const cameraConfig = {

          fps: 10,

          qrbox: (
            viewfinderWidth,
            viewfinderHeight
          ) => {

            const largeur =
              Math.min(
                viewfinderWidth,
                viewfinderHeight
              );

            const taille =
              Math.floor(
                largeur * 0.70
              );

            return {

              width: taille,

              height: taille,

            };

          },

          aspectRatio: 1,

          disableFlip: false,

        };


        await scanner.start(

          {
            facingMode: "environment",
          },

          cameraConfig,

          async (decodedText) => {

            await traiterQRCode(
              decodedText
            );

          },

          () => {}

        );


        setScannerErreur("");

      } catch (fallbackError) {

        console.error(
          "Fallback caméra QR :",
          fallbackError
        );


        if (
          qrScannerRef.current
        ) {

          try {

            const state =
              qrScannerRef.current.getState();

            if (
              state === 2 ||
              state === 3
            ) {

              await qrScannerRef.current.stop();

            }

          } catch {}


          try {

            qrScannerRef.current.clear();

          } catch {}


          qrScannerRef.current =
            null;

        }


        let erreur =
          "Impossible d'accéder à la caméra.";


        const nomErreur =
          fallbackError?.name ||
          error?.name ||
          "";


        if (
          nomErreur ===
          "NotAllowedError"
        ) {

          erreur =
            "L'accès à la caméra a été refusé. Autorisez la caméra dans les paramètres du navigateur.";

        } else if (
          nomErreur ===
          "NotFoundError"
        ) {

          erreur =
            "Aucune caméra compatible n'a été trouvée sur cet appareil.";

        } else if (
          nomErreur ===
          "NotReadableError"
        ) {

          erreur =
            "La caméra est déjà utilisée par une autre application.";

        } else if (
          nomErreur ===
          "SecurityError"
        ) {

          erreur =
            "Le navigateur bloque l'accès à la caméra pour des raisons de sécurité. Utilisez HTTPS.";

        } else if (
          nomErreur ===
          "OverconstrainedError"
        ) {

          erreur =
            "La caméra arrière demandée n'est pas disponible sur cet appareil.";

        } else if (
          fallbackError?.message
        ) {

          erreur =
            fallbackError.message;

        }


        setScannerErreur(
          erreur
        );

      }

    } finally {

      setScannerDemarrage(false);

    }

  }, [
    scannerDemarrage,
    traiterQRCode,
  ]);


  // ==========================================================
  // OUVRIR LE SCANNER
  // ==========================================================

  const ouvrirScanner = useCallback(() => {

    setScannerErreur("");

    qrScanEnCoursRef.current =
      false;

    setScannerOuvert(true);

  }, []);


  // ==========================================================
  // DÉMARRER LE SCANNER APRÈS AFFICHAGE DU MODAL
  // ==========================================================

  useEffect(() => {

    if (
      !scannerOuvert
    ) {

      scannerMontageRef.current =
        false;

      return;

    }


    if (
      scannerMontageRef.current
    ) {

      return;

    }


    scannerMontageRef.current =
      true;


    const timer =
      window.setTimeout(() => {

        demarrerScanner();

      }, 100);


    return () => {

      window.clearTimeout(
        timer
      );

    };

  }, [
    scannerOuvert,
    demarrerScanner,
  ]);


  // ==========================================================
  // NETTOYAGE DU SCANNER À LA DESTRUCTION
  // ==========================================================

  useEffect(() => {

    return () => {

      const scanner =
        qrScannerRef.current;


      if (!scanner) {

        return;

      }


      const nettoyer =
        async () => {

          try {

            const state =
              scanner.getState();


            if (
              state === 2 ||
              state === 3
            ) {

              await scanner.stop();

            }

          } catch (error) {

            console.warn(
              "Nettoyage scanner :",
              error
            );

          }


          try {

            scanner.clear();

          } catch (error) {

            console.warn(
              "Nettoyage élément scanner :",
              error
            );

          }


          qrScannerRef.current =
            null;

        };


      nettoyer();

    };

  }, []);


  // ==========================================================
  // CONFIRMER / VALIDER LE PAIEMENT
  // ==========================================================

  const validerPaiement = useCallback(async () => {

    if (loading) {

      return;

    }


    if (
      resultatValidation?.success
    ) {

      return;

    }


    const paiementActuel =
      paiement?.paiement;


    const idPaiement =
      paiementActuel?.id_paiement;


    const referencePaiement =
      paiementActuel?.reference_paiement ||
      referenceRecherchee;


    if (
      idPaiement === undefined ||
      idPaiement === null ||
      idPaiement === ""
    ) {

      showMessage(
        "L'identifiant du paiement est introuvable. Impossible de confirmer ce paiement.",
        "error"
      );

      return;

    }


    if (
      !referencePaiement ||
      !String(referencePaiement).trim()
    ) {

      showMessage(
        "La référence du paiement est introuvable. Impossible de confirmer ce paiement.",
        "error"
      );

      return;

    }


    try {

      setLoading(true);

      setMessage("");
      setMessageType("");


      const response =
        await confirmerPaiement({

          idPaiement,

          referencePaiement:
            String(
              referencePaiement
            ).trim(),

        });


      if (
        !response?.success ||
        !response?.data?.paiement
      ) {

        const erreur =
          new Error(
            response?.message ||
            "Impossible de confirmer le paiement."
          );

        erreur.code =
          response?.code;

        erreur.status =
          200;

        erreur.data =
          response;

        throw erreur;

      }


      /*
       * ======================================================
       * LE BACKEND RETOURNE UNIQUEMENT :
       *
       * response.data.paiement
       *
       * On conserve donc toutes les informations déjà
       * récupérées pendant la vérification :
       *
       * étudiant
       * promotion
       * parcours
       * tranche
       * tarif
       *
       * et on remplace uniquement les données du paiement
       * par celles retournées après confirmation.
       * ======================================================
       */

      const paiementConfirme =
        response.data.paiement;


      setPaiement(
        (ancienPaiement) => {

          if (!ancienPaiement) {

            return response.data;

          }


          return {

            ...ancienPaiement,

            paiement: {

              ...ancienPaiement.paiement,

              ...paiementConfirme,

            },

          };

        }
      );


      setResultatValidation(
        response
      );


      /*
       * Passage à l'étape 3.
       */

      setEtape(
        "validation"
      );


      showMessage(
        response.message ||
        "Paiement confirmé avec succès.",
        "success"
      );

    } catch (error) {

      console.error(
        "Erreur confirmation paiement :",
        error
      );


      if (
        error?.code ===
        "PAYMENT_NOT_FOUND"
      ) {

        showMessage(
          "Le paiement à confirmer est introuvable.",
          "error"
        );

      } else if (
        error?.code ===
        "PAYMENT_NOT_PENDING"
      ) {

        showMessage(
          error?.message ||
          "Ce paiement n'est plus en attente et ne peut pas être confirmé.",
          "error"
        );

      } else if (
        error?.code ===
        "PAYMENT_CONFIRMATION_FAILED"
      ) {

        showMessage(
          error?.message ||
          "La confirmation du paiement a échoué. Aucune validation définitive n'a été effectuée.",
          "error"
        );

      } else if (
        error?.code ===
        "ID_PAIEMENT_REQUIRED" ||
        error?.code ===
        "INVALID_PAYMENT_ID"
      ) {

        showMessage(
          error?.message ||
          "L'identifiant du paiement est invalide.",
          "error"
        );

      } else if (
        error?.code ===
        "REFERENCE_REQUIRED"
      ) {

        showMessage(
          error?.message ||
          "La référence du paiement est requise.",
          "error"
        );

      } else {

        showMessage(
          error?.message ||
          "Impossible de confirmer le paiement.",
          "error"
        );

      }

    } finally {

      setLoading(false);

    }

  }, [
    loading,
    paiement,
    referenceRecherchee,
    resultatValidation,
    showMessage,
  ]);


  // ==========================================================
  // REJETER LE PAIEMENT
  // ==========================================================

  const rejeterPaiement = useCallback(async () => {

    if (loading) {
      return;
    }


    const paiementActuel =
      paiement?.paiement;


    const idPaiement =
      paiementActuel?.id_paiement;


    const referencePaiement =
      paiementActuel?.reference_paiement ||
      referenceRecherchee;


    if (
      idPaiement === undefined ||
      idPaiement === null ||
      idPaiement === ""
    ) {

      showMessage(
        "L'identifiant du paiement est introuvable. Impossible de rejeter ce paiement.",
        "error"
      );

      return;

    }


    if (
      !referencePaiement ||
      !String(referencePaiement).trim()
    ) {

      showMessage(
        "La référence du paiement est introuvable. Impossible de rejeter ce paiement.",
        "error"
      );

      return;

    }


    const confirmation =
      window.confirm(
        "Voulez-vous vraiment rejeter ce paiement ?\n\nCette opération sera enregistrée côté serveur."
      );


    if (!confirmation) {
      return;
    }


    try {

      setLoading(true);

      setMessage("");
      setMessageType("");


      const response =
        await rejeterPaiementAttente({

          idPaiement,

          referencePaiement:
            String(
              referencePaiement
            ).trim(),

        });


      if (
        !response?.success ||
        !response?.data?.paiement
      ) {

        const erreur =
          new Error(
            response?.message ||
            "Impossible de rejeter le paiement."
          );


        erreur.code =
          response?.code;


        erreur.status =
          200;


        erreur.data =
          response;


        throw erreur;

      }


      const paiementRejete =
        response.data.paiement;


      setPaiement(
        (ancienPaiement) => {

          if (!ancienPaiement) {
            return response.data;
          }


          return {

            ...ancienPaiement,

            paiement: {

              ...ancienPaiement.paiement,

              ...paiementRejete,

            },

          };

        }
      );


      setResultatRejet(
        response
      );


      showMessage(
        response.message ||
        "Paiement rejeté avec succès.",
        "success"
      );

    } catch (error) {

      console.error(
        "Erreur rejet paiement :",
        error
      );


      if (
        error?.code ===
        "PAYMENT_NOT_FOUND"
      ) {

        showMessage(
          "Le paiement à rejeter est introuvable.",
          "error"
        );

      } else if (
        error?.code ===
        "PAYMENT_NOT_PENDING"
      ) {

        showMessage(
          error?.message ||
          "Ce paiement n'est plus en attente et ne peut pas être rejeté.",
          "error"
        );

      } else if (
        error?.code ===
        "PAYMENT_REJECTION_FAILED"
      ) {

        showMessage(
          error?.message ||
          "Le rejet du paiement a échoué.",
          "error"
        );

      } else if (
        error?.code ===
        "ID_PAIEMENT_REQUIRED" ||
        error?.code ===
        "INVALID_PAYMENT_ID"
      ) {

        showMessage(
          error?.message ||
          "L'identifiant du paiement est invalide.",
          "error"
        );

      } else if (
        error?.code ===
        "REFERENCE_REQUIRED"
      ) {

        showMessage(
          error?.message ||
          "La référence du paiement est requise.",
          "error"
        );

      } else {

        showMessage(
          error?.message ||
          "Impossible de rejeter le paiement.",
          "error"
        );

      }

    } finally {

      setLoading(false);

    }

  }, [
    loading,
    paiement,
    referenceRecherchee,
    resultatRejet,
    showMessage,
  ]);

  // ==========================================================
  // ANNULER / RETOUR
  // ==========================================================

  const annulerOperation = useCallback(() => {

    void stopScanner();

    setPaiement(null);

    setReference("");

    setReferenceRecherchee("");

    setMethodeVerification("");

    setResultatVerification(null);

    setResultatValidation(null);
    setResultatRejet(null);

    setEtape("accueil");

    setMessage("");

    setMessageType("");

  }, [
    stopScanner,
  ]);


  // ==========================================================
  // NOUVELLE RECHERCHE
  // ==========================================================

  const nouvelleRecherche = useCallback(() => {

    annulerOperation();

  }, [
    annulerOperation,
  ]);


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

  const formatDate = (
    date
  ) => {

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
  // INITIALES
  // ==========================================================

  const getInitiales = () => {

    if (
      !paiement?.etudiant
    ) {

      return "ET";

    }


    const prenom =
      paiement.etudiant.prenom ||
      "";

    const nom =
      paiement.etudiant.nom ||
      "";


    return `${prenom.charAt(0)}${nom.charAt(0)}`
      .toUpperCase()
      .trim() || "ET";

  };


  // ==========================================================
  // DONNÉES COURTES
  // ==========================================================

  const paiementData =
    paiement?.paiement;

  const etudiantData =
    paiement?.etudiant;

  const trancheData =
    paiement?.tranche;

  const tarifData =
    paiement?.tarif;

  const promotionData =
    paiement?.promotion;

  const parcoursData =
    paiement?.parcours;


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
            etape === "verification" ||
            etape === "validation"
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
            etape === "verification"
              ? "active completed"
              : ""
          } ${
            etape === "validation"
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
            etape === "validation"
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
          ACCUEIL
      ====================================================== */}

      {etape === "accueil" && (

        <div className="payment-workspace">


          {/* ==================================================
              SCANNER
          ================================================== */}

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
              onClick={
                ouvrirScanner
              }
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
                  disabled={loading}
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
                    ? "Vérification..."
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


          {/* ==================================================
              GUIDE
          ================================================== */}

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
                    Contrôler
                  </strong>

                  <p>
                    Contrôlez le montant et les
                    informations académiques.
                  </p>

                </div>

              </div>


              <div className="guide-item">

                <span>
                  04
                </span>

                <div>

                  <strong>
                    Valider
                  </strong>

                  <p>
                    La validation sera effectuée
                    après cette étape de vérification.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* ======================================================
          VÉRIFICATION / VALIDATION
      ====================================================== */}

      {(etape === "verification" ||
        etape === "validation") &&
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


              <div
                className={`verified-status ${
                  etape === "validation"
                    ? "payment-confirmed-status"
                    : ""
                }`}
              >

                <span>
                  ✓
                </span>

                {etape === "validation"
                  ? "Paiement confirmé"
                  : "Paiement vérifié"}

              </div>

            </div>


            <div className="identity-main">

              <div className="student-avatar">

                {getInitiales()}

              </div>


              <div className="student-identity">

                <h3>

                  {[
                    etudiantData?.nom,
                    etudiantData?.postnom,
                    etudiantData?.prenom,
                  ]
                    .filter(Boolean)
                    .join(" ") || "Étudiant"}

                </h3>

                <span className="student-number">

                  Matricule :

                  {" "}

                  <strong>
                    {
                      etudiantData?.matricule ||
                      "—"
                    }
                  </strong>

                </span>

              </div>

            </div>


            <div className="identity-details">

              <div>

                <span>
                  Email
                </span>

                <strong>
                  {
                    etudiantData?.email ||
                    "—"
                  }
                </strong>

              </div>


              <div>

                <span>
                  Téléphone
                </span>

                <strong>
                  {
                    etudiantData?.telephone ||
                    "—"
                  }
                </strong>

              </div>


              <div>

                <span>
                  Promotion
                </span>

                <strong>
                  {
                    promotionData?.nom_promotion ||
                    "—"
                  }
                </strong>

              </div>


              <div>

                <span>
                  Année académique
                </span>

                <strong>
                  {
                    promotionData?.annee_academique ||
                    "—"
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
                    trancheData?.libelle ||
                    "Paiement"
                  }
                </h3>

              </div>


              <div className="payment-reference">

                <span>
                  Référence
                </span>

                <strong>
                  {
                    paiementData?.reference_paiement ||
                    referenceRecherchee ||
                    "—"
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
                      paiementData?.montant,
                      "FC"
                    )
                  }

                </strong>

              </div>


              <div className="payment-summary-grid">

                <div>

                  <span>
                    Type de tarif
                  </span>

                  <strong>
                    {
                      tarifData?.type_tarif ||
                      "—"
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Tranche
                  </span>

                  <strong>

                    {
                      trancheData?.numero_tranche
                        ? `N° ${trancheData.numero_tranche} — `
                        : ""
                    }

                    {
                      trancheData?.libelle ||
                      "—"
                    }

                  </strong>

                </div>


                <div>

                  <span>
                    Montant du tarif
                  </span>

                  <strong>

                    {
                      formatMontant(
                        tarifData?.montant,
                        "FC"
                      )
                    }

                  </strong>

                </div>


                <div>

                  <span>
                    Échéance
                  </span>

                  <strong>
                    {
                      formatDate(
                        trancheData?.date_echeance
                      )
                    }
                  </strong>

                </div>

              </div>

            </div>


            <div className="balance-row">

              <span>
                Date de création
              </span>

              <strong>

                {
                  formatDate(
                    paiementData?.date_creation
                  )
                }

              </strong>

            </div>

          </div>


          {/* ==================================================
              INFORMATIONS PAIEMENT
              ================================================== */}

          <div className="security-card">

            <div className="security-card-header">

              <div className="security-shield">
                ✓
              </div>

              <div>

                <h3>
                  {etape === "validation"
                    ? "Paiement confirmé"
                    : "Vérification du paiement"}
                </h3>

                <p>
                  {etape === "validation"
                    ? "Le serveur a confirmé définitivement le paiement."
                    : "Les informations ont été vérifiées par le serveur."}
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
                    Paiement trouvé
                  </strong>

                  <small>
                    Le paiement correspond à la
                    référence fournie.
                  </small>

                </div>

              </div>


              <div className="security-check">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    {etape === "validation"
                      ? "Paiement confirmé"
                      : "Paiement en attente"}
                  </strong>

                  <small>
                    {etape === "validation"
                      ? "La confirmation du paiement a été enregistrée côté serveur."
                      : "Le paiement est actuellement disponible pour vérification."}
                  </small>

                </div>

              </div>


              <div className="security-check">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Mode de vérification
                  </strong>

                  <small>

                    {
                      methodeVerification === "qr"
                        ? "QR code authentifié avec token de sécurité."
                        : "Référence de paiement vérifiée côté serveur."
                    }

                  </small>

                </div>

              </div>


              {methodeVerification === "qr" && (

                <div className="security-check">

                  <span>
                    ✓
                  </span>

                  <div>

                    <strong>
                      QR code authentifié
                    </strong>

                    <small>
                      L'identifiant, la référence et
                      le token de sécurité du QR code
                      ont été vérifiés.
                    </small>

                  </div>

                </div>

              )}


              {etape === "validation" &&
                resultatValidation?.data?.paiement && (

                <>
                  <div className="security-check">

                    <span>
                      ✓
                    </span>

                    <div>

                      <strong>
                        Date de validation
                      </strong>

                      <small>
                        {
                          formatDate(
                            resultatValidation
                              ?.data
                              ?.paiement
                              ?.date_validation
                          )
                        }
                      </small>

                    </div>

                  </div>


                  <div className="security-check">

                    <span>
                      ✓
                    </span>

                    <div>

                      <strong>
                        Statut final
                      </strong>

                      <small>
                        {
                          resultatValidation
                            ?.data
                            ?.paiement
                            ?.statut ||
                          paiementData?.statut ||
                          "Confirmé"
                        }
                      </small>

                    </div>

                  </div>

                </>

              )}

            </div>

          </div>


          {/* ==================================================
              PARCOURS ACADÉMIQUE
              ================================================== */}

          <div className="payment-details-card">

            <div className="payment-details-header">

              <div>

                <span>
                  PARCOURS ACADÉMIQUE
                </span>

                <h3>
                  Situation de l'étudiant
                </h3>

              </div>

            </div>


            <div className="payment-summary-grid">

              <div>

                <span>
                  Promotion
                </span>

                <strong>
                  {
                    promotionData?.nom_promotion ||
                    "—"
                  }
                </strong>

              </div>


              <div>

                <span>
                  Année académique
                </span>

                <strong>
                  {
                    promotionData?.annee_academique ||
                    "—"
                  }
                </strong>

              </div>


              <div>

                <span>
                  Statut du parcours
                </span>

                <strong>
                  {
                    parcoursData?.statut ||
                    "—"
                  }
                </strong>

              </div>


              <div>

                <span>
                  Statut du paiement
                </span>

                <strong>
                  {
                    paiementData?.statut ||
                    "—"
                  }
                </strong>

              </div>

            </div>

          </div>


          {/* ==================================================
              RÉCAPITULATIF DE CONFIRMATION
              ================================================== */}

          {etape === "validation" &&
            resultatValidation?.data?.paiement && (

            <div className="payment-details-card payment-confirmation-result">

              <div className="payment-details-header">

                <div>

                  <span>
                    VALIDATION TERMINÉE
                  </span>

                  <h3>
                    Paiement enregistré avec succès
                  </h3>

                </div>


                <div className="verified-status">

                  <span>
                    ✓
                  </span>

                  Confirmé

                </div>

              </div>


              <div className="payment-summary-grid">

                <div>

                  <span>
                    Référence
                  </span>

                  <strong>
                    {
                      resultatValidation
                        ?.data
                        ?.paiement
                        ?.reference_paiement ||
                      "—"
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Montant confirmé
                  </span>

                  <strong>
                    {
                      formatMontant(
                        resultatValidation
                          ?.data
                          ?.paiement
                          ?.montant,
                        "FC"
                      )
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Date du paiement
                  </span>

                  <strong>
                    {
                      formatDate(
                        resultatValidation
                          ?.data
                          ?.paiement
                          ?.date_paiement
                      )
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Date de validation
                  </span>

                  <strong>
                    {
                      formatDate(
                        resultatValidation
                          ?.data
                          ?.paiement
                          ?.date_validation
                      )
                    }
                  </strong>

                </div>

              </div>


              <div className="balance-row">

                <span>
                  Message serveur
                </span>

                <strong>
                  {
                    resultatValidation?.message ||
                    "Paiement confirmé avec succès"
                  }
                </strong>

              </div>

            </div>

          )}


          {/* ==================================================
              ACTIONS
              ================================================== */}

          <div className="confirmation-actions">

            <button
              type="button"
              className="cancel-action"
              onClick={
                nouvelleRecherche
              }
              disabled={loading}
            >

              Nouvelle recherche

            </button>


            {etape === "verification" && (

              <>

                <button
                  type="button"
                  className="reject-payment-button"
                  onClick={
                    rejeterPaiement
                  }
                  disabled={loading}
                >

                  <span>
                    {loading
                      ? "..."
                      : "×"}
                  </span>

                  {loading
                    ? "Rejet en cours..."
                    : "Rejeter le paiement"}

                </button>


                <button
                  type="button"
                  className="validate-payment-button"
                  onClick={
                    validerPaiement
                  }
                  disabled={loading}
                >

                  <span>
                    {loading
                      ? "..."
                      : "✓"}
                  </span>

                  {loading
                    ? "Confirmation en cours..."
                    : "Confirmer le paiement"}

                </button>

              </>

            )}


            {etape === "validation" && (

              <button
                type="button"
                className="validate-payment-button"
                disabled
              >

                <span>
                  ✓
                </span>

                Paiement confirmé

              </button>

            )}

          </div>

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

              void stopScanner();

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
                onClick={() =>
                  void stopScanner()
                }
                disabled={loading}
              >
                ×
              </button>

            </div>


            <div className="scanner-camera">

              <div
                id={QR_READER_ELEMENT_ID}
                className="payment-qr-reader"
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

                  {scannerDemarrage
                    ? "Initialisation de la caméra..."
                    : "Placez le QR code dans le cadre"}

                </div>

              )}

            </div>


            {scannerErreur && (

              <div className="scanner-error">

                <span>
                  !
                </span>

                <div>

                  <strong>
                    Scanner indisponible
                  </strong>

                  <p>
                    {scannerErreur}
                  </p>

                  <small>
                    Vous pouvez également saisir
                    directement la référence du paiement.
                  </small>

                </div>

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
                  onKeyDown={(event) => {

                    if (
                      event.key === "Enter"
                    ) {

                      void stopScanner();

                      rechercherReference();

                    }

                  }}
                  placeholder="Référence de paiement"
                  disabled={loading}
                />


                <button
                  type="button"
                  onClick={() => {

                    void stopScanner();

                    rechercherReference();

                  }}
                  disabled={loading}
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

