// import { apiFetch } from "./apiService"; // ton fichier avec apiFetch

// // Récupérer l'année académique en cours
// export const getAnneeAcademiqueEnCoursService = async () => {

//   try {
 
//     const response = await apiFetch("/administration/annee-academique/en-cours",
//       {
//         method: "GET"
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Erreur lors de la récupération de l'année académique.");
//     }

//     return data;

//   } catch (error) {

//     throw error;

//   }

// };

