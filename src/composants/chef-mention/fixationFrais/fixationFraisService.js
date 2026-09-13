import { apiFetch } from "../../accueils/apiService";

const BASE_URL = "/administration";

/* =========================================================
   FIXER LES FRAIS UNIVERSITAIRES
   =========================================================
   Permet à l'administrateur mention de créer :
   - le tarif académique
   - son type_tarif
   - son montant total
   - les différentes tranches
   - libellé de chaque tranche
   - montant de chaque tranche 
   - date d'échéance de chaque tranche

   Le backend vérifie notamment qu'une année académique
   est actuellement "en cours".
========================================================= */

export async function creerTarifAcademique({
  id_promotion_version,
  type_tarif,
  montant,
  tranches,
}) {
  try {
    const res = await apiFetch(
      `${BASE_URL}/finances/tarifs/fixer`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id_promotion_version,
          type_tarif,
          montant,
          tranches,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Erreur lors de la fixation des frais universitaires.",
      };
    }

    return {
      success: true,
      message:
        data.message ||
        "Frais universitaires fixés avec succès.",

      tarif: data.tarif || data.result || null,

      tranches:
        data.tranches ||
        data.tarif?.tranches ||
        [],
    };
  } catch (error) {
    console.error(
      "Erreur service création tarif académique :",
      error
    );

    return {
      success: false,
      message: "Erreur réseau.",
    };
  }
}
 

// =============================
// CHARGER PROMOTIONS PAR MENTION
// =============================
export const getPromotionsService = async ({code_mention}) => {

  const response = await apiFetch("/administration/promotions/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", 
    },
    body: JSON.stringify({
      code_mention
    }),
  });
  
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors du chargement des promotions");
  }

  return data;
};


// Récupérer les frais configurés pour une mention
export const getFraisConfig = async ({ code_mention }) => {
  try {
    const response = await apiFetch(
      "/administration/university-config/frais-mention/get",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code_mention,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.error ||
        "Erreur lors de la récupération des frais."
      );
    }

    return data.data || [];
  } catch (error) {
    console.error(
      "Erreur getFraisConfig :",
      error
    );

    throw error;
  }
};


