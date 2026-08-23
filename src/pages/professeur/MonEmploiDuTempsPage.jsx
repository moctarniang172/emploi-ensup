// Vue lecture seule de l'emploi du temps du professeur connecté (scoping via refProfesseur).

import { useEffect, useState } from 'react';
import { WeeklyCalendarGrid } from '../../components/calendar/WeeklyCalendarGrid';
import { getCreneauxParProfesseur, telechargerPdfProfesseur } from '../../api/creneauApi';
import { useAuth } from '../../hooks/useAuth';

export default function MonEmploiDuTempsPage() {
  const { user } = useAuth();
  const [creneaux, setCreneaux] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [telechargementPdf, setTelechargementPdf] = useState(false);

  useEffect(() => {
    getCreneauxParProfesseur(user.refProfesseur)
      .then(setCreneaux)
      .finally(() => setChargement(false));
  }, [user.refProfesseur]);

  async function handleTelechargerPdf() {
    setTelechargementPdf(true);
    try {
      await telechargerPdfProfesseur(user.refProfesseur, user.nom);
    } finally {
      setTelechargementPdf(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Mon emploi du temps</h1>
        <button
          onClick={handleTelechargerPdf}
          disabled={telechargementPdf}
          className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg px-3 py-1.5"
        >
          {telechargementPdf ? 'Génération...' : 'Télécharger en PDF'}
        </button>
      </div>
      {chargement ? (
        <p className="text-slate-400 text-sm">Chargement...</p>
      ) : (
        <WeeklyCalendarGrid creneaux={creneaux} readOnly />
      )}
    </div>
  );
}
