import { apiFetch } from "../../accueils/apiService";


// ============================================================
// 🔐 VÉRIFICATION D'UN PAIEMENT PAR QR CODE
// ============================================================

export const verifierPaiementParQRCode = async ({
  idPaiement,
  referencePaiement,
  tokenSecurite,
}) => {

  try {

    if (
      idPaiement === undefined ||
      idPaiement === null ||
      idPaiement === ""
    ) {
      throw new Error(
        "L'identifiant du paiement est requis."
      );
    }


    if (
      !referencePaiement ||
      !String(referencePaiement).trim()
    ) {
      throw new Error(
        "La référence du paiement est requise."
      );
    }


    if (
      !tokenSecurite ||
      !String(tokenSecurite).trim()
    ) {
      throw new Error(
        "Le token de sécurité est requis."
      );
    }


    const params =
      new URLSearchParams({
        id_paiement:
          String(idPaiement),

        reference_paiement:
          String(referencePaiement).trim(),

        token_securite:
          String(tokenSecurite).trim(),
      });


    const response =
      await apiFetch(
        `/comptable/paiements/verification?${params.toString()}`,
        {
          method: "GET",
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      const error =
        new Error(
          data?.message ||
          "Impossible de vérifier le paiement."
        );

      error.code =
        data?.code;

      error.status =
        response.status;

      error.data =
        data;

      throw error;
    }


    return data;

  } catch (error) {

    console.error(
      "VERIFIER PAIEMENT QR SERVICE ERROR:",
      error
    );

    throw error;
  }
};


// ============================================================
// 🔎 VÉRIFICATION D'UN PAIEMENT PAR RÉFÉRENCE
// ============================================================

export const verifierPaiementParReference = async (
  referencePaiement
) => {

  try {

    const reference =
      String(
        referencePaiement || ""
      ).trim();


    if (!reference) {

      throw new Error(
        "La référence du paiement est requise."
      );
    }


    const params =
      new URLSearchParams({
        reference_paiement:
          reference,
      });


    const response =
      await apiFetch(
        `/comptable/paiements/verification-ref?${params.toString()}`,
        {
          method: "GET",
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      const error =
        new Error(
          data?.message ||
          "Impossible de vérifier le paiement."
        );

      error.code =
        data?.code;

      error.status =
        response.status;

      error.data =
        data;

      throw error;
    }


    return data;

  } catch (error) {

    console.error(
      "VERIFIER PAIEMENT REFERENCE SERVICE ERROR:",
      error
    );

    throw error;
  }
};


// ============================================================
// ✅ CONFIRMATION / VALIDATION D'UN PAIEMENT
// ============================================================

export const confirmerPaiement = async ({
  idPaiement,
  referencePaiement,
}) => {

  try {

    // ========================================================
    // VALIDATION DE L'ID PAIEMENT
    // ========================================================

    if (
      idPaiement === undefined ||
      idPaiement === null ||
      idPaiement === ""
    ) {

      throw new Error(
        "L'identifiant du paiement est requis."
      );

    }


    const idPaiementNumber =
      Number(idPaiement);


    if (
      !Number.isInteger(idPaiementNumber) ||
      idPaiementNumber <= 0
    ) {

      throw new Error(
        "L'identifiant du paiement est invalide."
      );

    }


    // ========================================================
    // VALIDATION DE LA RÉFÉRENCE
    // ========================================================

    const reference =
      String(
        referencePaiement || ""
      ).trim();


    if (!reference) {

      throw new Error(
        "La référence du paiement est requise."
      );

    }


    // ========================================================
    // APPEL API
    // ========================================================

    const response =
      await apiFetch(
        "/comptable/paiements/validation",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            id_paiement:
              idPaiementNumber,

            reference_paiement:
              reference,

          }),
        }
      );


    // ========================================================
    // LECTURE DE LA RÉPONSE
    // ========================================================

    const data =
      await response.json();


    // ========================================================
    // ❌ ERREUR API
    // ========================================================

    if (!response.ok) {

      const error =
        new Error(
          data?.message ||
          "Impossible de confirmer le paiement."
        );


      error.code =
        data?.code;


      error.status =
        response.status;


      error.data =
        data;


      throw error;

    }


    // ========================================================
    // ✅ PAIEMENT CONFIRMÉ
    // ========================================================

    return data;


  } catch (error) {

    console.error(
      "CONFIRMER PAIEMENT SERVICE ERROR:",
      error
    );

    throw error;

  }

};


// ============================================================
// REJET  D'UN PAIEMENT EN ATTENTE
// ============================================================
export const rejeterPaiementAttente = async ({
  idPaiement,
  referencePaiement,
}) => {

  try {

    // ========================================================
    // VALIDATION DE L'ID PAIEMENT
    // ========================================================

    if (
      idPaiement === undefined ||
      idPaiement === null ||
      idPaiement === ""
    ) {

      throw new Error(
        "L'identifiant du paiement est requis."
      );

    }


    const idPaiementNumber =
      Number(idPaiement);


    if (
      !Number.isInteger(idPaiementNumber) ||
      idPaiementNumber <= 0
    ) {

      throw new Error(
        "L'identifiant du paiement est invalide."
      );

    }


    // ========================================================
    // VALIDATION DE LA RÉFÉRENCE
    // ========================================================

    const reference =
      String(
        referencePaiement || ""
      ).trim();


    if (!reference) {

      throw new Error(
        "La référence du paiement est requise."
      );

    }


    // ========================================================
    // APPEL API
    // ========================================================

    const response =
      await apiFetch(
        "/comptable/paiements/rejet",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            id_paiement:
              idPaiementNumber,

            reference_paiement:
              reference,

          }),
        }
      );


    // ========================================================
    // LECTURE DE LA RÉPONSE
    // ========================================================

    const data =
      await response.json();


    // ========================================================
    // ❌ ERREUR API
    // ========================================================

    if (!response.ok) {

      const error =
        new Error(
          data?.message ||
          "Impossible de rejeter le paiement."
        );


      error.code =
        data?.code;


      error.status =
        response.status;


      error.data =
        data;


      throw error;

    }


    // ========================================================
    // REJET CONFIRMÉ
    // ========================================================

    return data;


  } catch (error) {

    console.error(
      "REJETER PAIEMENT SERVICE ERROR:",
      error
    );

    throw error;

  }

};

