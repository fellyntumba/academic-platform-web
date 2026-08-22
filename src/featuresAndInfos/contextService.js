import { apiFetch } from "./apiService";

export async function getContext() {
  try {
    const res = await apiFetch("/system/features-info");

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
     
    return data;

  } catch (error) {
    console.error("Erreur features:", error);
    return [];
  }
}

