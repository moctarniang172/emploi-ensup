// Barre de navigation commune aux 3 rôles. Les liens affichés dépendent du rôle connecté.

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

const LIEN_ACTIF = 'text-indigo-600 font-medium';
const LIEN_INACTIF = 'text-slate-600 hover:text-slate-900';

const LIENS_PAR_ROLE = {
  [ROLES.ADMIN]: [
    { to: '/admin', label: 'Tableau de bord', end: true },
    { to: '/admin/matieres', label: 'Matières' },
    { to: '/admin/salles', label: 'Salles' },
    { to: '/admin/professeurs', label: 'Professeurs' },
    { to: '/admin/classes', label: 'Classes' },
    { to: '/admin/emploi-du-temps', label: 'Emploi du temps' },
  ],
  [ROLES.PROFESSEUR]: [{ to: '/professeur', label: 'Mon emploi du temps', end: true }],
  [ROLES.ETUDIANT]: [{ to: '/etudiant', label: 'Emploi du temps de ma classe', end: true }],
};

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
        <div className="flex items-center gap-6 overflow-x-auto">
          <span className="font-semibold text-slate-900 whitespace-nowrap">École</span>
          {(LIENS_PAR_ROLE[user.role] || []).map((lien) => (
            <NavLink
              key={lien.to}
              to={lien.to}
              end={lien.end}
              className={({ isActive }) => `text-sm whitespace-nowrap ${isActive ? LIEN_ACTIF : LIEN_INACTIF}`}
            >
              {lien.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 hidden sm:inline">
            {user.prenom} {user.nom}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-600 hover:text-red-600 border border-slate-300 rounded-lg px-3 py-1.5"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
