import { apiFetch } from "../../accueils/apiService";

const BASE_URL =
  `${window.location.protocol}//` +
  `${window.location.hostname}:3000/api/authentifications`;


// ============================================================================
// ENVOYER OTP
// ============================================================================

export async function sendOtpSuperAdmin({ email }) {

  try {

    const res = await fetch(
      `${BASE_URL}/send-otp`,
      {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      }
    );


    const data = await res.json();


    if (!res.ok) {

      return {
        success: false,
        message:
          data.message ||
          "Impossible d'envoyer le code OTP.",
      };
    }


    return {
      success: true,
      message:
        data.message ||
        "Code OTP envoyé avec succès.",
    };


  } catch (error) {

    console.error(
      "[AUTH] Erreur send OTP :",
      error
    );

    return {
      success: false,
      message: "Erreur réseau.",
    };
  }
}


// ============================================================================
// VÉRIFIER OTP
// ============================================================================

export async function verifyOtpSuperAdmin({
  email,
  otp,
}) {

  try {

    console.log(
      "[AUTH] Vérification OTP envoyée :",
      {
        email,
        otp,
      }
    );


    const res = await fetch(
      `${BASE_URL}/verify-otp`,
      {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          otp,
        }),
      }
    );


    const data = await res.json();


    console.log(
      "[AUTH] Réponse verify OTP :",
      {
        status: res.status,
        data,
      }
    );


    if (!res.ok) {

      return {
        success: false,
        message:
          data.message ||
          "Code OTP invalide.",
        user: null,
      };
    }


    return {
      success: true,

      message:
        data.message ||
        "Authentification réussie.",

      user:
        data.data?.utilisateur ||
        null,
    };


  } catch (error) {

    console.error(
      "[AUTH] Erreur vérification OTP :",
      error
    );

    return {
      success: false,
      message: "Erreur réseau.",
      user: null,
    };
  }
}


// ============================================================================
// VÉRIFIER SI L'UTILISATEUR EST AUTHENTIFIÉ
// ============================================================================

export async function isAuthenticated() {

  try {

    const res = await apiFetch(
      "/authentifications/me"
    );


    const data = await res.json();


    console.log(
      "[AUTH] Données utilisateur reçues du backend :",
      data
    );


    if (!res.ok) {

      return {
        authenticated: false,
        user: null,
      };
    }


    return {
      authenticated:
        data.authenticated === true,

      user:
        data.user || null,
    };


  } catch (error) {

    if (
      error.message ===
      "NOT_AUTHENTICATED"
    ) {

      return {
        authenticated: false,
        user: null,
      };
    }


    console.error(
      "[AUTH] Erreur récupération utilisateur :",
      error
    );


    return {
      authenticated: false,
      user: null,
    };
  }
}


