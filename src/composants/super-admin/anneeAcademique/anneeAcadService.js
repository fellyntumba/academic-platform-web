import { apiFetch } from "../authentification/apiService";


// récupérer états des années acad.
export const getCurrentAnneeAcademique = async () => {

  try {

    const response = await apiFetch(
      "/administration/annee-academique/get-etats"
    );

    const data = await response.json();

    if (!response.ok) {

      return {
        success: false,
        message: data.message,
      };
    }

    return {
      success: true,
      EstEnCours: data.EstEnCours,
      data: data.annee,
    };

  } catch (error) {

    return {
      success: false,
      message: "Erreur réseau.",
    };
  }
};

//Créer une nouvelle année académique
export const  createAnneeAcademique = async () =>{
  try {
    const response = await apiFetch(
      "/administration/annee-academique/create",
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Erreur lors de la création.",
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.annee,
    };

  } catch (error) {
    return {
      success: false,
      message: "Erreur réseau.",
    };
  }
}

//Clôturer l'année académique
export const cloturerAnneeAcademique = async() =>{
  try {
    const response = await apiFetch(
      "/administration/annee-academique/cloturer",
      {
        method: "PUT",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Erreur lors de la clôture.",
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.annee,
    };

  } catch (error) {
    return {
      success: false,
      message: "Erreur réseau.",
    };
  }
}