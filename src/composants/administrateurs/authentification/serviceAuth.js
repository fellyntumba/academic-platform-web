import { apiFetch } from "../apiService";
const BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000/api/administration`;


/* =========================
   Envoi OTP
========================= */
export async function sendOtpAdminFac({email}) {
  try {
    const res = await fetch(`${BASE_URL}/send-otp-af`, {
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
export async function verifyOtpAdminFac({email, otp}) {
  try {
    const res = await fetch(`${BASE_URL}/verify-otp-af`, {
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

    if (!res.ok) return null;

    const data = await res.json();
    return data.user;
  } catch (err) {
    if (err.message === "NOT_AUTHENTICATED") {
      return null;
    }
    throw err;
  }
}

//Logout
export async function logout() {
  try {
    console.log("🚪 Déconnexion en cours...");

    const res = await apiFetch("/auth/logout", {
      method: "POST",
    });

    console.log("✅ Logout status :", res.status);
  } catch (err) {
    console.error("❌ Erreur logout :", err);
  }
}

