
//Appel API pour obtenir promotions
export async function findPromotionsByFac(nomFac) {

    try {
        const API_URL = 'http://localhost:3000/api/administration/get-promo';
        const res  = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nomFac })
        });

        return res;

    } catch (error) {
        console.log(error);
    }
    
};


//Appel API pour obtenir enseignants
export async function getEnseignants() {

    try {
        const API_URL = 'http://localhost:3000/api/administration/get-enseignants';
        const res  = await fetch(API_URL, {
            method: 'GET'
        });

        return res;

    } catch (error) {
        console.log(error);
    }
    
};

//Appel API pour ajouter cours(avec ancien enseignant)
export async function addCoursEnseig(intituleCours, nomEnseignant, promotion, ponderation) {

    try {
        const API_URL = 'http://localhost:3000/api/administration/add-cours';
        const res  = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ intituleCours, nomEnseignant, promotion, ponderation })
        });

        return res;

    } catch (error) {
        console.log(error);
    }
    
};

//Appel API pour ajouter cours(avec nouvel enseignant)
export async function addCoursWithEnseig(intituleCours, promotion, ponderation, nomEnseignant, email, telephone) {

    try {
        const API_URL = 'http://localhost:3000/api/administration/add-cours-enseg';
        const res  = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ intituleCours, promotion, ponderation, nomEnseignant, email, telephone })
        });

        return res;

    } catch (error) {
        console.log(error);
    }
    
};

//Appel API pour obtenir les emails enseignants
export async function getEmailsEnseign() {

    try {
        const API_URL = 'http://localhost:3000/api/administration/get-emails-enseign';
        const res  = await fetch(API_URL, {
            method: 'GET'
        });

        return res;

    } catch (error) {
        console.log(error);
    }
    
};

//Appel API pour obtenir infos enseignant
export async function findInfosByEmail(email) {

    try {
        const API_URL = 'http://localhost:3000/api/administration/get-infos-enseg';
        const res  = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        // console.log(res);
        return res;

    } catch (error) {
        console.log(error);
    }
    
};

//Appel API pour mettre à jour enseignant
export async function updateEnseign(nomModif, emailModif, telephoneModif, email) {

    try {
        const API_URL = 'http://localhost:3000/api/administration/update-enseign';
        const res  = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nomModif, emailModif, telephoneModif, email })
        });

        return res;

    } catch (error) {
        console.log(error);
    }
    
};