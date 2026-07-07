// API pour obtenir les recours/enseignant

export const fetchRecoursByEnseignant = async (idEnseignant) => {
  try {
    const API_URL = 'http://localhost:3000/api/enseignant/get-recours';

          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idEnseignant })
          });
            
          return res;

        } catch (error) {
            console.log(error);
        }
};

// API pour rejet recours

export const rejectRecours = async (idRecours) => {
  try {
    const API_URL = 'http://localhost:3000/api/enseignant/recours-rej';

          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idRecours })
          });
            
          return res;

        } catch (error) {
            console.log(error);
        }
};

// API pour accepter recours

export const acceptRecours = async (idRecours, newCote) => {
  try {
    const API_URL = 'http://localhost:3000/api/enseignant/recours-acc';

          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idRecours, newCote  })
          });
            
          return res;

        } catch (error) {
            console.log(error);
        }
};

