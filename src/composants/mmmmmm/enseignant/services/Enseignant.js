// API pour la nom de l'enseignant
export async function obtenirNomEnseign(idEnseignant){

      try {
          const API_URL = 'http://localhost:3000/api/enseignant/get-name-enseig';

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




