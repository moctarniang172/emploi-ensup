// Appelle POST /creneaux/check-conflicts à chaque changement des champs pertinents
// (avec un léger debounce pour ne pas spammer l'API à chaque frappe), et expose le résultat
// pour que CreneauForm puisse afficher un avertissement AVANT que l'utilisateur ne soumette.

import { useEffect, useState } from 'react';
import { checkConflicts } from '../api/creneauApi';

const CHAMPS_REQUIS = ['classe', 'matiere', 'professeur', 'salle', 'jour', 'heureDebut', 'heureFin', 'anneeScolaire'];

function estComplet(criteres) {
  return CHAMPS_REQUIS.every((champ) => Boolean(criteres[champ]));
}

export function useConflictCheck(criteres, excludeCreneauId) {
  const [resultat, setResultat] = useState({ hasConflict: false, conflits: [] });
  const [verification, setVerification] = useState(false);

  useEffect(() => {
    if (!estComplet(criteres)) {
      setResultat({ hasConflict: false, conflits: [] });
      return;
    }

    setVerification(true);
    const delai = setTimeout(() => {
      checkConflicts({ ...criteres, excludeCreneauId })
        .then(setResultat)
        .finally(() => setVerification(false));
    }, 400);

    return () => clearTimeout(delai);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    criteres.classe,
    criteres.matiere,
    criteres.professeur,
    criteres.salle,
    criteres.jour,
    criteres.heureDebut,
    criteres.heureFin,
    criteres.anneeScolaire,
    excludeCreneauId,
  ]);

  return { ...resultat, verification };
}
