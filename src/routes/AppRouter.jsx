// Déclaration centrale de toutes les routes de l'application, avec protection par rôle.
// Les pages CRUD admin (matières/salles/professeurs/classes) et les vues créneaux sont
// ajoutées au fur et à mesure des phases de développement suivantes.

import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { ROLES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { cheminAccueilPourRole } from '../utils/roleRedirect';

import LoginPage from '../pages/auth/LoginPage';
import DashboardAdmin from '../pages/admin/DashboardAdmin';
import MatieresPage from '../pages/admin/MatieresPage';
import SallesPage from '../pages/admin/SallesPage';
import ProfesseursPage from '../pages/admin/ProfesseursPage';
import ClassesPage from '../pages/admin/ClassesPage';
import EmploiDuTempsAdminPage from '../pages/admin/EmploiDuTempsAdminPage';
import MonEmploiDuTempsPage from '../pages/professeur/MonEmploiDuTempsPage';
import EmploiDuTempsClassePage from '../pages/etudiant/EmploiDuTempsClassePage';
import NotFoundPage from '../pages/NotFoundPage';

function RedirectionRacine() {
  const { user, chargementInitial } = useAuth();
  if (chargementInitial) return null;
  return <Navigate to={user ? cheminAccueilPourRole(user.role) : '/login'} replace />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RedirectionRacine />} />

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AppLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/admin/matieres" element={<MatieresPage />} />
        <Route path="/admin/salles" element={<SallesPage />} />
        <Route path="/admin/professeurs" element={<ProfesseursPage />} />
        <Route path="/admin/classes" element={<ClassesPage />} />
        <Route path="/admin/emploi-du-temps" element={<EmploiDuTempsAdminPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.PROFESSEUR]}><AppLayout /></ProtectedRoute>}>
        <Route path="/professeur" element={<MonEmploiDuTempsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ETUDIANT]}><AppLayout /></ProtectedRoute>}>
        <Route path="/etudiant" element={<EmploiDuTempsClassePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
