// Composant partagé par les 3 rôles : affiche un emploi du temps sous forme de grille
// hebdomadaire (colonnes = jours, blocs positionnés selon l'heure). En lecture seule pour
// professeur/étudiant, cliquable pour l'admin (édition d'un créneau existant).

import { JOURS_SEMAINE } from '../../utils/constants';
import { HEURE_DEBUT_GRILLE, HEURE_FIN_GRILLE, positionDansGrille } from '../../utils/timeUtils';

const HEURES_REPERES = Array.from(
  { length: HEURE_FIN_GRILLE - HEURE_DEBUT_GRILLE },
  (_, i) => HEURE_DEBUT_GRILLE + i
);

export function WeeklyCalendarGrid({ creneaux, readOnly = true, onCreneauClick }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
      <div className="grid grid-cols-[60px_repeat(6,1fr)] min-w-[720px]">
        <div className="border-b border-r border-slate-200" />
        {JOURS_SEMAINE.map((jour) => (
          <div key={jour} className="border-b border-slate-200 px-2 py-2 text-center text-sm font-medium text-slate-700">
            {jour}
          </div>
        ))}

        <div className="relative border-r border-slate-200" style={{ height: `${(HEURE_FIN_GRILLE - HEURE_DEBUT_GRILLE) * 48}px` }}>
          {HEURES_REPERES.map((heure) => (
            <div
              key={heure}
              className="absolute left-0 right-0 text-xs text-slate-400 -translate-y-2 text-right pr-1"
              style={{ top: `${((heure - HEURE_DEBUT_GRILLE) / (HEURE_FIN_GRILLE - HEURE_DEBUT_GRILLE)) * 100}%` }}
            >
              {String(heure).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {JOURS_SEMAINE.map((jour) => (
          <div
            key={jour}
            className="relative border-r border-slate-100 last:border-r-0"
            style={{ height: `${(HEURE_FIN_GRILLE - HEURE_DEBUT_GRILLE) * 48}px` }}
          >
            {HEURES_REPERES.map((heure) => (
              <div
                key={heure}
                className="absolute left-0 right-0 border-t border-slate-100"
                style={{ top: `${((heure - HEURE_DEBUT_GRILLE) / (HEURE_FIN_GRILLE - HEURE_DEBUT_GRILLE)) * 100}%` }}
              />
            ))}

            {creneaux
              .filter((c) => c.jour === jour)
              .map((creneau) => {
                const { top, height } = positionDansGrille(creneau.heureDebut, creneau.heureFin);
                return (
                  <button
                    key={creneau._id}
                    type="button"
                    disabled={readOnly}
                    onClick={() => onCreneauClick?.(creneau)}
                    className={`absolute left-1 right-1 rounded-md bg-indigo-100 border border-indigo-300 px-1.5 py-1 text-left overflow-hidden ${
                      readOnly ? 'cursor-default' : 'hover:bg-indigo-200 cursor-pointer'
                    }`}
                    style={{ top, height }}
                  >
                    <p className="text-[11px] font-medium text-indigo-900 truncate">{creneau.matiere?.nom}</p>
                    <p className="text-[10px] text-indigo-700 truncate">
                      {creneau.heureDebut}–{creneau.heureFin}
                    </p>
                    <p className="text-[10px] text-indigo-700 truncate">
                      {creneau.salle?.nom} · {creneau.professeur?.nom}
                    </p>
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
