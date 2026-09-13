import { apiFetch } from "../../accueils/apiService";

const BASE_URL = "/administration";



// ============================================================
// CHARGER LES STATISTIQUES DE RÉUSSITE / ÉCHEC PAR PROMOTION
// ============================================================
export const getStatistiquesPromotionsService = async ({
  code_mention,
}) => {
  const response = await apiFetch( 
    "/administration/statistiques-promotions",
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
        "Erreur lors du chargement des statistiques des promotions"
    );
  }

  return data;
};

