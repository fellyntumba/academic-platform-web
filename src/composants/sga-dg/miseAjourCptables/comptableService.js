import { apiFetch } from "../../accueils/apiService";

const BASE_URL = "/administration";

/* =====================================================
   1️⃣ CRÉER UN COMPTABLE
===================================================== */
export async function creerComptable({ nom, email , telephone}) {
  try {
    const res = await apiFetch(
      `${BASE_URL}/comptable/create`,
      {
        method: "POST",
        body: JSON.stringify({
          nom,
          email,
          telephone
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la création du comptable."
      };
    }

    return {
      success: true,
      message:
        data.message ||
        "Comptable créé avec succès.",
      comptable:
        data.comptable || null
    };

  } catch (error) {

    console.error(
      "Erreur creerComptable :",
      error
    );

    return {
      success: false,
      message: "Erreur réseau."
    };
  }
}


/* =====================================================
   2️⃣ MODIFIER LE STATUT D'UN COMPTABLE
===================================================== */
export async function modifierStatutComptable({
  id_comptable,
  statut
}) {
  try {

    const res = await apiFetch(
      `${BASE_URL}/comptable/modifier-statut`,
      {
        method: "PUT",
        body: JSON.stringify({
          id_comptable,
          statut
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la modification du statut."
      };
    }

    return {
      success: true,
      message:
        data.message ||
        "Statut du comptable modifié avec succès.",
      comptable:
        data.comptable || null
    };

  } catch (error) {

    console.error(
      "Erreur modifierStatutComptable :",
      error
    );

    return {
      success: false,
      message: "Erreur réseau."
    };
  }
}


/* =====================================================
   3️⃣ RÉCUPÉRER TOUS LES COMPTABLES
===================================================== */
export async function getComptablesUniversite() {
  try {

    const res = await apiFetch(
      `${BASE_URL}/comptables/get`,
      {
        method: "POST"
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la récupération des comptables."
      };
    }

    return {
      success: true,
      comptables:
        data.comptables || []
    };

  } catch (error) {

    console.error(
      "Erreur getComptablesUniversite :",
      error
    );

    return {
      success: false,
      message: "Erreur réseau."
    };
  }
}

