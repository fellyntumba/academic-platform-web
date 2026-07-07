const API_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;

export async function apiFetch(endpoint, options = {}) {

  // 🔎 Détecter si on envoie un FormData
  const isFormData = options.body instanceof FormData;

  const response = await fetch(API_URL + endpoint, {
    ...options,
    credentials: "include",
    headers: {
      // ✅ Mettre Content-Type seulement si ce n'est PAS un FormData
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  // ✅ Si pas 401 → retour normal
  if (response.status !== 401) {
    return response;
  }

  // 🔁 Tentative refresh
  const refreshRes = await fetch(API_URL + "/auth/refresh-af", {
    method: "POST",
    credentials: "include",
  });

  if (!refreshRes.ok) {
    throw new Error("NOT_AUTHENTICATED");
  }

  // 🔁 Rejouer la requête initiale
  const retryResponse = await fetch(API_URL + endpoint, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  return retryResponse;
}
