import { apiFetch } from "../../accueils/apiService";

/**
 * Générer les semestres et sessions automatiquement
 */
export async function generateSemestres() {
  try {
    console.log("🌐 [API] Appel génération semestres...");

    const res = await apiFetch("/administration/semestres/generate", {
      method: "POST",
    });

    const data = await res.json();

    console.log("📦 [API] Réponse génération :", data);

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Erreur lors de la génération.",
      };
    }

    return {
      success: true,
      message: data.message,
      createdSemestres: data.createdSemestres || [],
    };
  } catch (error) {
    console.error("❌ Erreur réseau generateSemestres :", error);

    return {
      success: false,
      message: "Erreur réseau. Vérifiez le serveur.",
    };
  }
}
