// Protège une route : redirige vers /login si non connecté, et vers la page d'accueil
// de son propre rôle si connecté mais pas autorisé (ex: un étudiant qui visite une URL admin).
// allowedRoles est optionnel : s'il est omis, la route est ouverte à tout utilisateur connecté.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cheminAccueilPourRole } from '../../utils/roleRedirect';

export function ProtectedRoute({ allowedRoles, children }) {
  const { user, chargementInitial } = useAuth();

  if (chargementInitial) {
    return null; // évite un flash de redirection pendant la vérification du token
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={cheminAccueilPourRole(user.role)} replace />;
  }

  return children;
}
