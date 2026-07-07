// API pour les noms de promotions/enseignant
export async function obtenirPromoEnseign(idEnseignant){

      try {
          const API_URL = 'http://localhost:3000/api/enseignant/get-promotion-enseig';

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

// API pour les cours/enseignant/promo
export async function obtenirCoursEnseignPromo(idEnseignant, promo){

      try {
          const API_URL = 'http://localhost:3000/api/enseignant/get-cours-enseig-promo';

          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idEnseignant, promo})
          });
            
          return res;

        } catch (error) {
            console.log(error);
        }
};


// API pour les matricules/promo
export async function obtenirMatPromo(promo, cours){

      try {
          const API_URL = 'http://localhost:3000/api/enseignant/get-mat-promo';

          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({promo, cours})
          });
            
          return res;

        } catch (error) {
            console.log(error);
        }
};


// API pour effectif/promo
export async function obtenirEffectifPromo(promo){

      try {
          const API_URL = 'http://localhost:3000/api/enseignant/get-effectif-promo';

          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({promo})
          });
            
          return res;

        } catch (error) {
            console.log(error);
        }
};

// API pour effectif/cote
export async function obtenirEffectifCote(promo, cours){

      try {
          const API_URL = 'http://localhost:3000/api/enseignant/get-effectif-not-cote';

          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({promo, cours})
          });
            
          return res;

        } catch (error) {
            console.log(error);
        }
};

// API pour ajouter une nouvelle cote
export async function ajouterCote(notes){

      try {
          const API_URL = 'http://localhost:3000/api/enseignant/add-cote';

          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notes)
          });
            
          return res;


        } catch (error) {
            console.log(error);
        }
        
};



// API pour effectif/cote
export async function obtenirCotePromo(promo, cours){

      try {
          const API_URL = 'http://localhost:3000/api/enseignant/get-cotes';

          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({promo, cours})
          });
            
          return res;

        } catch (error) {
            console.log(error);
        }
};

// API pour modifier/cote
// export async function modifierCote(newCote, matr){

//       try {
//           const API_URL = 'http://localhost:3000/api/enseignant/update-cote';

//           const res = await fetch(API_URL, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({newCote, matr})
//           });
            
//           return res;

//         } catch (error) {
//             console.log(error);
//         }
// };

// API pour generer les statistiques de cotes/cours
export async function obtenirAllCote(promo, cours) {
    try {
      const API_URL = 'http://localhost:3000/api/enseignant/get-all-cote';

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promo, cours }),
      });

      if (!res.ok) {
        console.error('Erreur lors de la récupération du PDF:', res.status);
        return { ok: false };
      }

      // ✅ Convertir la réponse en blob (le fichier PDF)
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // ✅ Créer et cliquer sur le lien de téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = 'notes.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();

      // ✅ Nettoyer l’URL temporaire
      window.URL.revokeObjectURL(url);

      return { ok: true };
    } catch (error) {
      console.error('Erreur dans obtenirAllCote:', error);
      return { ok: false, error };
    }
};




