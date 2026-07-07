import { apiFetch } from "../authentification/apiService"; // 🔹 Ton utilitaire fetch

const BASE_URL = "/administration";

/* =========================
   1️⃣ Créer un super administrateur
========================= */
export async function creerSuperAdmin({ nom, email }) {
  try {
    const res = await apiFetch(`${BASE_URL}/super-admin-desactive/create`, {
      method: "POST",
      body: JSON.stringify({ nom, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la création." };
    }

    return { success: true, message: data.message || "Super administrateur créé." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}

/* =========================
   2️⃣ Désactiver un super administrateur
========================= */
export async function desactiverSuperAdmin({ nom, email }) {
  try {
    const res = await apiFetch(`${BASE_URL}/super-admin/desactiver`, {
      method: "PUT",
      body: JSON.stringify({ nom, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la désactivation." };
    }

    return { success: true, message: data.message || "Super administrateur désactivé." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}

/* =========================
   3️⃣ Récupérer tous les super administrateurs actifs
========================= */
export async function getSuperAdminsActifs() {
  try {
    const res = await apiFetch(`${BASE_URL}/super-admin/get-actifs`);
    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la récupération." };
    }

    return { success: true, data: data.superAdmins || [] };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}