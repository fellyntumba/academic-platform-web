import { apiFetch } from "./apiService";
const BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000/api/administration`;
 
//Envoi OTP
export async function sendOtp({email}) {
  try {
    const res = await fetch(`${BASE_URL}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
 
    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message
      };
    }

    return {
      success: true,
      message: data.message
    };

  } catch (error) {
    return { success: false, message: "Erreur réseau" };
  }
}


//Vérification OTP
export async function verifyOtp({email, otp}) {
  try {
    const res = await fetch(`${BASE_URL}/verify-otp`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false, 
        message: data.message
      };
    } 
    return {
      success: true,
      message: data.message,
      user: data.user
    };

  } catch (error) {
    return { success: false, message: "Erreur réseau" };
  }
}


//Pour verifier si user est authentifié 
export async function isAuthenticated() {
  try {

    const res = await apiFetch("/administration/me");

    const data = await res.json();

    if (!res.ok) {
      return {
        authenticated: false,
        user: null
      };
    }

    return {
      authenticated: data.authenticated,
      user: data.user
    };

  } catch (err) {

    if (err.message === "NOT_AUTHENTICATED") {
      return {
        authenticated: false,
        user: null
      };
    }

    console.error("Erreur isAuthenticated :", err);

    return {
      authenticated: false,
      user: null
    };
  }
}


//Logout
export async function logout() {

  try {

    const res = await apiFetch("/administration/logout", {

      method: "POST",

    });

    console.log("LOGOUT STATUS:", res.status);

    console.log("LOGOUT OK:", res.ok);

    if (!res.ok) {

      let data = null;

      try {

        data = await res.json();

      } catch {

        // La réponse peut ne pas contenir de JSON.

      }

      throw new Error(

        data?.message ||

        data?.error ||

        `La déconnexion a échoué (${res.status}).`

      );

    }

    return true;

  } catch (err) {

    console.error("LOGOUT ERROR:", err); 

    throw err;

  }
}


// //Changer le profil actif
// export async function switchRole(active_role) {

//   try {  

//     const res = await apiFetch("/administration/switch-role", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         active_role
//       })
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       return {
//         success: false,
//         message: data.message || data.error || "Erreur serveur"
//       };
//     }

//     return {
//       success: true,
//       active_role: data.active_role
//     };

//   } catch (err) {

//     console.error(err);

//     return {
//       success: false,
//       message: "Erreur réseau"
//     };

//   }

// }


// Changer le profil actif
export async function switchRole(active_role) {
  try {
    const res = await apiFetch("/administration/switch-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        active_role
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          data.message ||
          data.error ||
          "Erreur serveur"
      };
    }

    return {
      success: true,
      active_role: data.active_role,
      user: data.user || null
    };

  } catch (err) {
    console.error(err);

    return {
      success: false,
      message: "Erreur réseau"
    };
  }
}


