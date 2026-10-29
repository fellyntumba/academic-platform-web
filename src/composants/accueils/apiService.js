//apiService.js

// ============================================================================

// API SERVICE — UNIVERSITÉ / TENANT

// ============================================================================

// ============================================================================

// CONFIGURATION

// ============================================================================

const API_HOST = 

  `${window.location.protocol}//` +

  `${window.location.hostname}:3000`;

const API_URL =

  `${API_HOST}/api`; 

// ============================================================================

// TENANT / DOMAINE COURANT

// ============================================================================

/**

 * Retourne le domaine actuellement utilisé par le navigateur.

 *

 * Exemples :

 *

 * http://unikin.test:5173

 *        ↓

 * unikin.test

 *

 * http://unilu.test:5173

 *        ↓

 * unilu.test

 *

 * Le backend peut ensuite déterminer le tenant

 * à partir de ce domaine.

 */

export function getTenantHost() {

  return window.location.hostname;

}

/**

 * Retourne le domaine logique du tenant.

 *

 * Exemple :

 *

 * unikin.test

 *      ↓

 * unikin

 *

 * unilu.test

 *      ↓

 * unilu

 *

 * Si le domaine n'est pas sous la forme

 * tenant.test, on retourne simplement le hostname.
 
 */

export function getTenantDomain() {

  const hostname =

    window.location.hostname;

  if (

    hostname.endsWith(".test")

  ) {

    return hostname.replace(

      /\.test$/,

      ""

    );

  }

  return hostname;

}

// ============================================================================

// URL DES MÉDIAS

// ============================================================================

/**

 * Transforme une URL de fichier renvoyée

 * par le backend en URL exploitable par le frontend.

 *

 * Gère :

 *

 * - URL vide

 * - blob:

 * - http://

 * - https://

 * - /uploads/...

 * - uploads/...

 */

export function getMediaUrl(url) {

  if (!url) {

    return "";

  }

  // --------------------------------------------------------------------------

  // Fichier temporaire sélectionné localement

  // --------------------------------------------------------------------------

  if (

    url.startsWith("blob:")

  ) {

    return url;

  }

  // --------------------------------------------------------------------------

  // URL déjà complète

  // --------------------------------------------------------------------------

  if (

    url.startsWith("http://") ||

    url.startsWith("https://")

  ) {

    return url;

  }

  // --------------------------------------------------------------------------

  // URL relative commençant par /

  // --------------------------------------------------------------------------

  if (

    url.startsWith("/")

  ) {

    return `${API_HOST}${url}`;

  }

  // --------------------------------------------------------------------------

  // URL relative sans /

  // --------------------------------------------------------------------------

  return `${API_HOST}/${url}`;

}

// ============================================================================

// URL D'UN FICHIER DU TENANT

// ============================================================================

/**

 * Permet de construire proprement une URL

 * pour une ressource stockée sur le backend.

 *

 * Exemple :

 *

 * getTenantMediaUrl(

 *   "uploads/tenants/unikin/logos/logo.png"

 * )

 */

export function getTenantMediaUrl(

  path

) {

  return getMediaUrl(path);

}

// ============================================================================

// CONSTRUCTION DES OPTIONS

// ============================================================================

function construireOptions(options) {

  const isFormData =

    options.body instanceof FormData;

  return {

    ...options,

    credentials: "include",

    headers: {

      // ----------------------------------------------------------------------

      // JSON

      // ----------------------------------------------------------------------

      ...(isFormData

        ? {}

        : {

            "Content-Type":

              "application/json",

          }),

      // ----------------------------------------------------------------------

      // Headers personnalisés

      // ----------------------------------------------------------------------

      ...(options.headers || {}),

    },

  };

}

// ============================================================================

// API FETCH

// ============================================================================

export async function apiFetch(

  endpoint,

  options = {}

) {

  // --------------------------------------------------------------------------

  // Première requête

  // --------------------------------------------------------------------------

  let response =

    await fetch(

      API_URL + endpoint,

      construireOptions(options)

    );

  // --------------------------------------------------------------------------

  // Requête réussie ou autre erreur HTTP

  // --------------------------------------------------------------------------

  if (

    response.status !== 401

  ) {

    return response;

  }

  // --------------------------------------------------------------------------

  // ACCESS TOKEN EXPIRÉ

  //

  // On demande au backend de renouveler

  // automatiquement la session.

  // --------------------------------------------------------------------------

  const refreshResponse =

    await fetch(

      API_URL + "/authentifications/refresh",

      {

        method: "POST",

        credentials: "include",

      }

    );

  // --------------------------------------------------------------------------

  // Session impossible à renouveler

  // --------------------------------------------------------------------------

  if (

    !refreshResponse.ok

  ) {

    throw new Error(

      "NOT_AUTHENTICATED"

    );

  }

  // --------------------------------------------------------------------------

  // Rejouer la requête initiale

  // --------------------------------------------------------------------------

  response =

    await fetch(

      API_URL + endpoint,

      construireOptions(options)

    );

  return response;

}

// ============================================================================

// EXPORTS

// ============================================================================

export {

  API_HOST,

  API_URL,

};


