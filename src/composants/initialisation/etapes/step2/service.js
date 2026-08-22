import { apiFetch } from "../../../accueils/apiService";

//Creer code-fac
export const createCodeFac = async ({ code_faculte  }) => {
  const response = await apiFetch("/administration/code-fac/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code_faculte  }),
  });
 
  const data = await response.json(); 

  if (!response.ok) {
    throw new Error(data.message || "Erreur création faculté");
  }

  return data;
};


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


//Récupérer code-facs 
export const getCodeFacBDuniv= async () => {
  const response =await apiFetch("/administration/code-fac/get", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur récupération facultés");
  }

  return data;
};
