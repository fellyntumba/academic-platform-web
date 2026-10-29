// ============================================================
// RÔLES / PROFILS DE L'APPLICATION
// ============================================================


// ============================================================
// LIBELLÉS AFFICHÉS DANS LE FRONTEND
// ============================================================

export const ROLE_LABELS = {

  SGA:
    "Secrétaire général académique",

  ADMIN_FAC:
    "Administrateur facultaire",

  ADMIN_MENTION:
    "Administrateur de mention",

  ENSEIGNANT:
    "Enseignant",

  COMPTABLE:
    "Comptable",

};


// ============================================================
// RÔLES ADMINISTRATIFS
// ============================================================

export const ADMIN_ROLES = [

  "SGA",

  "ADMIN_FAC",

  "ADMIN_MENTION",

];


// ============================================================
// TOUS LES PROFILS DISPONIBLES
// ============================================================

export const ALL_ROLES = [

  "SGA",

  "ADMIN_FAC",

  "ADMIN_MENTION",

  "ENSEIGNANT",

  "COMPTABLE",

];


// ============================================================
// VÉRIFIER QU'UN RÔLE EST CONNU
// ============================================================

export const isValidRole = (role) => {

  return ALL_ROLES.includes(role);

};

