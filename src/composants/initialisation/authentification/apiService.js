const API_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;

export async function apiFetch(endpoint, options = {}) {
  // 1️⃣ Requête initiale
  const response = await fetch(API_URL + endpoint, {
    ...options,
    credentials: "include", // 🍪 cookies HttpOnly
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  }); 
 
  // 2️⃣ Si OK → retour direct
  if (response.status !== 401) {
    return response;
  }

  // 3️⃣ Tentative de refresh
  const refreshRes = await fetch(API_URL + "/auth/refresh-sa", {
    method: "POST",
    credentials: "include",
  });

  // ❌ Pas de refresh possible → PAS authentifié
  if (!refreshRes.ok) {
    throw new Error("NOT_AUTHENTICATED");
  }

  // 4️⃣ Refresh OK → rejouer la requête initiale
  const retryResponse = await fetch(API_URL + endpoint, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  return retryResponse;
}
