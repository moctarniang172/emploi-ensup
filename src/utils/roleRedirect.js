// Détermine la page d'accueil par défaut selon le rôle — utilisé après le login
// et par ProtectedRoute quand un utilisateur visite une page qui ne lui est pas destinée.

import { ROLES } from './constants';

export function cheminAccueilPourRole(role) {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.PROFESSEUR:
      return '/professeur';
    case ROLES.ETUDIANT:
      return '/etudiant';
    default:
      return '/login';
  }
}
