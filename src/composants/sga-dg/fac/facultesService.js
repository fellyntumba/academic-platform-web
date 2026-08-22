import { apiFetch } from "../../accueils/apiService"; // ton utilitaire fetch
const BASE_URL = "/administration";

/* ========================= 
   Créer un code-fac 
========================= */
export async function creerFaculte({code_faculte}) {
  try {
    const res = await apiFetch(`${BASE_URL}/code-fac/create`, {
      method: "POST",
      body: JSON.stringify({ code_faculte }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Erreur création faculté" };
    return { success: true, message: data.message || "Faculté créée avec succès" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau" };
  }
} 

/* =========================
   Modifier un code-fac
========================= */
export async function modifierFaculte({ancien_code, nouveau_code}) {
  try {
    const res = await apiFetch(`${BASE_URL}/code-fac/update`, {
      method: "PUT",
      body: JSON.stringify({ ancien_code, nouveau_code }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Erreur modification faculté" };
    return { success: true, message: data.message || "Faculté modifiée avec succès" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau" };
  }
}

/* =========================
   Récupérer toutes les facultés
========================= */
export async function getCodeFacBDuniv() {
  try {
    const res = await apiFetch(`${BASE_URL}/code-fac/get`, { method: "GET" });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Erreur récupération facultés" };
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau" };
  }
}

/* =========================
   Désactiver une faculté
========================= */
export async function desactiverFaculte({ code_faculte }) {
  try {

    const res = await apiFetch(
      `${BASE_URL}/disable-code-fac`,
      {
        method: "PUT",
        body: JSON.stringify({ code_faculte }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Erreur désactivation faculté",
      };
    }

    return {
      success: true,
      message: data.message || "Faculté désactivée avec succès",
    };

  } catch (error) {

    console.error(error);

    return {
      success: false,
      message: "Erreur réseau",
    };
  }
}

// Récupérer les facultés configurées pour une université
export const getCodesFacultesConfig = async () => {

  const response = await apiFetch("/administration/university-config/code-facultes/get", {
    method: "GET",
  });
  
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erreur lors de la récupération des facultés");
  }

  return data.data;  
};