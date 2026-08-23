// Vue d'ensemble de l'administration. Les compteurs sont chargés au montage.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listMatieres } from '../../api/matiereApi';
import { listSalles } from '../../api/salleApi';
import { listProfesseurs } from '../../api/professeurApi';
import { listClasses } from '../../api/classeApi';

const CARTES = [
  { cle: 'matieres', label: 'Matières', lien: '/admin/matieres' },
  { cle: 'salles', label: 'Salles', lien: '/admin/salles' },
  { cle: 'professeurs', label: 'Professeurs', lien: '/admin/professeurs' },
  { cle: 'classes', label: 'Classes', lien: '/admin/classes' },
];

export default function DashboardAdmin() {
  const [compteurs, setCompteurs] = useState(null);

  useEffect(() => {
    Promise.all([listMatieres(), listSalles(), listProfesseurs(), listClasses()]).then(
      ([matieres, salles, professeurs, classes]) => {
        setCompteurs({
          matieres: matieres.length,
          salles: salles.length,
          professeurs: professeurs.length,
          classes: classes.length,
        });
      }
    );
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {CARTES.map((carte) => (
          <Link
            key={carte.cle}
            to={carte.lien}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition-colors"
          >
            <p className="text-2xl font-semibold text-slate-900">
              {compteurs ? compteurs[carte.cle] : '…'}
            </p>
            <p className="text-sm text-slate-500">{carte.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
