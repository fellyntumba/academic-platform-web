import { apiFetch } from "../../authentification/apiService"; // ton fichier avec apiFetch


export const createAdminFac = async ({ code_fac, nom, email }) => {
  const res = await apiFetch("/administration/admin-fac-desactive/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code_fac, nom, email }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  } 

  return res.json(); 
};

 
/* =========================
   Récupérer toutes les facultés
========================= */
export async function getCodeFac() {
  try {
    const res = await apiFetch("/administration/code-fac/get", { method: "GET" });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || "Erreur récupération facultés" };
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erreur réseau" };
  }
}
