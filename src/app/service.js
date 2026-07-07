
const BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;

// Verification statut du systeme
export const checkSetupStatus = async () => {
  try { 
    const response = await fetch(`${BASE_URL}/administration/setup/status`);

    if (!response.ok) {
      throw new Error("Erreur serveur");
    }

    return  response.json();
     
  } catch (error) {
    console.error("Erreur lors de la vérification du super admin :", error);
    return null; // fallback sécurisé
  }
};

//Verification temps du systeme
export const getServerTimeService = async () => {
  const response = await fetch(`${BASE_URL}/system/time`);

  if (!response.ok) {
    throw new Error("Erreur récupération temps serveur");
  }

  return await response.json();
};

