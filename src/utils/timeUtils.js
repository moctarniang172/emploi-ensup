// Utilitaires pour positionner les créneaux dans la grille horaire du calendrier hebdomadaire.

export const HEURE_DEBUT_GRILLE = 7; // 07:00
export const HEURE_FIN_GRILLE = 19; // 19:00

export function heureVersMinutes(heure) {
  const [h, m] = heure.split(':').map(Number);
  return h * 60 + m;
}

// Renvoie {top, height} en pourcentage, pour positionner un créneau en absolu dans sa colonne de jour.
export function positionDansGrille(heureDebut, heureFin) {
  const debutGrille = HEURE_DEBUT_GRILLE * 60;
  const totalMinutes = (HEURE_FIN_GRILLE - HEURE_DEBUT_GRILLE) * 60;

  const top = ((heureVersMinutes(heureDebut) - debutGrille) / totalMinutes) * 100;
  const height = ((heureVersMinutes(heureFin) - heureVersMinutes(heureDebut)) / totalMinutes) * 100;

  return { top: `${top}%`, height: `${height}%` };
}
