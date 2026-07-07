import { apiFetch } from "../authentification/apiService";

const BASE_URL = "/administration";

/* =========================
   1️⃣ Créer un administrateur fac
========================= */
export async function creerAdminFac({ code_fac, nom, email }) {
  try {
    const res = await apiFetch(`${BASE_URL}/admin-fac-desactive/create`, {
      method: "POST",
      body: JSON.stringify({ code_fac, nom, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la création." };
    }

    return { success: true, message: data.message || "Administrateur créé." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}

/* =========================
   2️⃣ Désactiver un administrateur fac
========================= */
export async function desactiverAdminFac({ code_fac, nom, email }) {
  try {
    const res = await apiFetch(`${BASE_URL}/admin-fac/desactiver`, {
      method: "POST",  // 🔹 On utilise POST comme demandé
      body: JSON.stringify({ code_fac, nom, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la désactivation." };
    }

    return { success: true, message: data.message || "Administrateur désactivé." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}

/* =========================
   3️⃣ Récupérer un administrateur fac actif pour un code-fac
========================= */
export async function getAdminFacActif({ code_fac }) {
  try {
    const res = await apiFetch(`${BASE_URL}/admin-fac/get-actif`, {
      method: "POST", // 🔹 POST
      body: JSON.stringify({ code_fac }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la récupération." };
    }

    return { success: true, admin: data.admin || null };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}

/* =========================
   4️⃣ Récupérer tous les codes-facs
========================= */
export async function getCodeFac() {
  try {
    const res = await apiFetch(`${BASE_URL}/code-fac/get`, { method: "GET" });
    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur récupération facultés" };
    }

    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}


/* =========================
   Modifier un administrateur facultaire
========================= */
export async function modifierAdminFac({ code_fac, nom, email }) {
  try {
    const res = await apiFetch(`${BASE_URL}/admin-fac/update`, {
      method: "PUT",  // POST comme demandé
      body: JSON.stringify({ code_fac, nom, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la modification." };
    }

    return { success: true, message: data.message || "Administrateur modifié." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}