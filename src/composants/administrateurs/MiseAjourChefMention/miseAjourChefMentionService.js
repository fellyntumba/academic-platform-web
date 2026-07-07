import { apiFetch } from "../apiService";

const BASE_URL = "/administration";

/* =========================
   1️⃣ Créer un chef-mention 
========================= */
export async function creerAdminMention({ code_mention, nom, email }) {
  try {
    const res = await apiFetch(`${BASE_URL}/admin-mention-/create`, {
      method: "POST",
      body: JSON.stringify({ code_mention, nom, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la création." };
    }

    return { success: true, message: data.message || "Chef-mention créé." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}

/* =========================
   2️⃣ Désactiver un chef-mention 
========================= */
export async function desactiverAdminMention({ code_mention, nom, email }) {
  try {
    const res = await apiFetch(`${BASE_URL}/admin-mention/desactiver`, {
      method: "POST",  // 🔹 On utilise POST comme demandé
      body: JSON.stringify({ code_mention, nom, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la désactivation." };
    }

    return { success: true, message: data.message || "Chef-mention désactivé." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}

/* =========================
   3️⃣ Récupérer un chef-mention
========================= */
export async function getAdminMentionActif({ code_mention }) {
  try {
    const res = await apiFetch(`${BASE_URL}/admin-mention/get-actif`, {
      method: "POST", // 🔹 POST
      body: JSON.stringify({ code_mention }),
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
   4️⃣ Récupérer tous les code_mentions
========================= */
export async function getMentions({code_faculte}) {
  try {
    const res = await apiFetch(`${BASE_URL}/code-mention/get`, { 
      method: "POST",
      body: JSON.stringify({ code_faculte}),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Erreur récupération mentions" };
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau" };
  }
}


/* =========================
   Modifier un chef-mention 
========================= */
export async function modifierAdminMention({ code_mention, nom, email }) {
  try {
    const res = await apiFetch(`${BASE_URL}/admin-mention/update`, {
      method: "PUT",  // POST comme demandé
      body: JSON.stringify({ code_mention, nom, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Erreur lors de la modification." };
    }

    return { success: true, message: data.message || "Chef-mention modifié." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau." };
  }
}