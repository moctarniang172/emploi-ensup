// Édition des disponibilités d'un professeur : une plage horaire ("HH:mm" à "HH:mm")
// peut être ajoutée pour chaque jour de la semaine. Composant contrôlé : reçoit le tableau
// de disponibilités actuel (value) et remonte tout changement via onChange.
//
// Format attendu (identique au backend) :
// [{ jour: 'Lundi', creneaux: [{ heureDebut: '08:00', heureFin: '12:00' }] }, ...]

import { JOURS_SEMAINE } from '../../utils/constants';

function plagesDuJour(disponibilites, jour) {
  return disponibilites.find((d) => d.jour === jour)?.creneaux || [];
}

export function DisponibiliteEditor({ value, onChange }) {
  function majPlagesDuJour(jour, nouvellesPlages) {
    const autresJours = value.filter((d) => d.jour !== jour);
    onChange([...autresJours, { jour, creneaux: nouvellesPlages }]);
  }

  function ajouterPlage(jour) {
    majPlagesDuJour(jour, [...plagesDuJour(value, jour), { heureDebut: '08:00', heureFin: '12:00' }]);
  }

  function modifierPlage(jour, index, champ, nouvelleValeur) {
    const plages = plagesDuJour(value, jour).map((p, i) => (i === index ? { ...p, [champ]: nouvelleValeur } : p));
    majPlagesDuJour(jour, plages);
  }

  function supprimerPlage(jour, index) {
    majPlagesDuJour(jour, plagesDuJour(value, jour).filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {JOURS_SEMAINE.map((jour) => {
        const plages = plagesDuJour(value, jour);
        return (
          <div key={jour} className="border border-slate-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">{jour}</span>
              <button
                type="button"
                onClick={() => ajouterPlage(jour)}
                className="text-xs text-indigo-600 hover:underline"
              >
                + Ajouter une plage
              </button>
            </div>

            {plages.length === 0 && <p className="text-xs text-slate-400">Aucune disponibilité.</p>}

            {plages.map((plage, index) => (
              <div key={index} className="flex items-center gap-2 mb-1.5">
                <input
                  type="time"
                  value={plage.heureDebut}
                  onChange={(e) => modifierPlage(jour, index, 'heureDebut', e.target.value)}
                  className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                />
                <span className="text-slate-400 text-sm">à</span>
                <input
                  type="time"
                  value={plage.heureFin}
                  onChange={(e) => modifierPlage(jour, index, 'heureFin', e.target.value)}
                  className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  onClick={() => supprimerPlage(jour, index)}
                  className="text-red-500 hover:text-red-700 text-sm ml-auto"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
