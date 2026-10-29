
import { apiFetch } from "./apiService";


// ============================================================
// AUTHENTIFICATION
// ============================================================

const BASE_URL =
  `${window.location.protocol}//${window.location.hostname}:3000/api/authentifications`;

 
// ============================================================
// ENVOYER UN OTP
// ============================================================

export async function sendOtp({ email }) {

  try {

    const res = await fetch(`${BASE_URL}/send-otp`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        email,
      }),
    });

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

    console.error("SEND OTP ERROR:", error);

    return {
      success: false,
      message: "Erreur réseau.",
    };
  }
}
 

// ============================================================
// VÉRIFIER OTP
// ============================================================

export async function verifyOtp({
  email,
  otp,
}) {

  try {

    const res = await fetch(`${BASE_URL}/verify-otp`, {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        otp,
      }),
    });

    const data = await res.json();

    if (!res.ok) {

      return {
        success: false,
        message:
          data.message ||
          "Code OTP invalide.",
      };
    }

    return {
      success: true,
      message: data.message,
      user: data.data?.utilisateur || null,
    };

  } catch (error) {

    console.error("VERIFY OTP ERROR:", error);

    return {
      success: false,
      message: "Erreur réseau.",
    };
  }
}


// ============================================================
// VÉRIFIER L'AUTHENTIFICATION
// ============================================================

export async function isAuthenticated() {

  try {

    const res = await apiFetch(
      "/authentifications/me"
    );

    const data = await res.json();

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

    if (error.message === "NOT_AUTHENTICATED") {

      return {
        authenticated: false,
        user: null,
      };
    }

    console.error(
      "IS AUTHENTICATED ERROR:",
      error
    );

    return {
      authenticated: false,
      user: null,
    };
  }
}


// ============================================================
// DÉCONNEXION
// ============================================================

export async function logout() {

  try {

    const res = await apiFetch(
      "/authentifications/logout",
      {
        method: "POST",
      }
    );

    if (!res.ok) {

      let data = null;

      try {
        data = await res.json();
      } catch {
        // Réponse éventuellement sans JSON.
      }

      throw new Error(
        data?.message ||
        data?.error ||
        `La déconnexion a échoué (${res.status}).`
      );
    }

    return true;

  } catch (error) {

    console.error(
      "LOGOUT ERROR:",
      error
    );

    throw error;
  }
}


// ============================================================
// CHANGER LE PROFIL / RÔLE ACTIF
// ============================================================

export async function switchRole(active_role) {

  try {

    const res = await apiFetch(
      "/authentifications/switch-role",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          active_role,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {

      return {
        success: false,

        message:
          data.message ||
          data.error ||
          "Impossible de changer de profil.",
      };
    }

    return {
        success: true,
        active_role: data.data?.active_role || active_role,
        roles: data.data?.roles || [],
        user: null,
    };

  } catch (error) {

    console.error(
      "SWITCH ROLE ERROR:",
      error
    );

    return {
      success: false,
      message: "Erreur réseau.",
    };
  }
}


