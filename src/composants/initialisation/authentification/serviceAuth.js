import { apiFetch } from "./apiService";
const BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000/api/administration`;
 
/* ========================= 
   Envoi OTP
========================= */
export async function sendOtpSuperAdmin({email}) {
  try {
    const res = await fetch(`${BASE_URL}/send-otp-sa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message };
    }

    return { success: true, message: data.message };

  } catch (error) {
    return { success: false, message: "Erreur réseau" };
  }
}


/* =========================
   Vérification OTP
========================= */
export async function verifyOtpSuperAdmin({email, otp}) {
  try {
    const res = await fetch(`${BASE_URL}/verify-otp-sa`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message };
    }

    return { success: true, message: data.message };

  } catch (error) {
    return { success: false, message: "Erreur réseau" };
  }
}


// Pour verifier si user est authentifié 
export async function isAuthenticated() {
  try {
    const res = await apiFetch("/auth/me");

    if (!res.ok) {
      return {
        authenticated: false,
        user: null,
      };
    }

    const data = await res.json();
  
    

    return {
      authenticated: true,
      user: data.user,
    };

  } catch (err) {
    if (err.message === "NOT_AUTHENTICATED") {
      return {
        authenticated: false,
        user: null,
      };
    }

    console.error("Erreur isAuthenticated:", err);

    return {
      authenticated: false,
      user: null,
    };
  }
}


