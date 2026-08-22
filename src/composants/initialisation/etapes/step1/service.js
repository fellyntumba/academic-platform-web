const BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;


// API pour creer le  du S A
export const createSga = async ({ name, email, telephone, titre }) => {
  try {
    const response = await fetch(`${BASE_URL}/administration/sga/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, telephone, titre }),
    });
 
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la création du Super Admin");
    }

    const data = await response.json();
    return data; // { message: "...", admin: {...} }
  } catch (error) {
    console.error("Erreur service Super Admin:", error);
    throw error;
  }
};



