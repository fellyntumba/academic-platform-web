import { apiFetch } from "../../authentification/apiService";

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

//Récupérer code-facs 
export const getCodeFac= async () => {
  const response =await apiFetch("/administration/code-fac/get", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur récupération facultés");
  }

  return data;
};
