// Affiche la liste des conflits détectés par useConflictCheck, avec une couleur par type
// pour que l'admin repère rapidement la nature du problème (salle / professeur / classe / disponibilité).

const STYLE_PAR_TYPE = {
  CONFLIT_SALLE: 'bg-red-50 border-red-200 text-red-700',
  CONFLIT_PROFESSEUR: 'bg-orange-50 border-orange-200 text-orange-700',
  CONFLIT_CLASSE: 'bg-amber-50 border-amber-200 text-amber-700',
  INDISPONIBILITE_PROFESSEUR: 'bg-purple-50 border-purple-200 text-purple-700',
};

export function ConflictAlert({ conflits }) {
  if (!conflits || conflits.length === 0) return null;

  return (
    <div className="space-y-2">
      {conflits.map((conflit, index) => (
        <p key={index} className={`text-xs border rounded-lg px-3 py-2 ${STYLE_PAR_TYPE[conflit.type] || 'bg-slate-50 border-slate-200 text-slate-700'}`}>
          {conflit.message}
        </p>
      ))}
    </div>
  );
}
