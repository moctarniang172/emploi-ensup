// Vue lecture seule de l'emploi du temps de la classe de l'étudiant connecté (scoping via refClasse).

import { useEffect, useState } from 'react';
import { WeeklyCalendarGrid } from '../../components/calendar/WeeklyCalendarGrid';
import { getCreneauxParClasse, telechargerPdfClasse } from '../../api/creneauApi';
import { useAuth } from '../../hooks/useAuth';

export default function EmploiDuTempsClassePage() {
  const { user } = useAuth();
  const [creneaux, setCreneaux] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [telechargementPdf, setTelechargementPdf] = useState(false);

  useEffect(() => {
    getCreneauxParClasse(user.refClasse)
      .then(setCreneaux)
      .finally(() => setChargement(false));
  }, [user.refClasse]);

  async function handleTelechargerPdf() {
    setTelechargementPdf(true);
    try {
      await telechargerPdfClasse(user.refClasse, `${user.prenom}`);
    } finally {
      setTelechargementPdf(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Emploi du temps de ma classe</h1>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="text-sm text-slate-600 border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50"
          >
            Imprimer
          </button>
          <button
            onClick={handleTelechargerPdf}
            disabled={telechargementPdf}
            className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg px-3 py-1.5"
          >
            {telechargementPdf ? 'Génération...' : 'Télécharger en PDF'}
          </button>
        </div>
      </div>
      {chargement ? (
        <p className="text-slate-400 text-sm">Chargement...</p>
      ) : (
        <WeeklyCalendarGrid creneaux={creneaux} readOnly />
      )}
    </div>
  );
}
