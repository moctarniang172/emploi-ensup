// Formulaire de création/modification d'un créneau. Vérifie les conflits EN DIRECT
// (via useConflictCheck) pendant la saisie, et bloque la soumission tant qu'un conflit existe.

import { useState } from 'react';
import { JOURS_SEMAINE } from '../../utils/constants';
import { useConflictCheck } from '../../hooks/useConflictCheck';
import { ConflictAlert } from './ConflictAlert';
import { createCreneau, updateCreneau, deleteCreneau } from '../../api/creneauApi';

export function CreneauForm({ creneauInitial, classes, matieres, professeurs, salles, anneeScolaire, onSaved }) {
  const [formulaire, setFormulaire] = useState({
    classe: creneauInitial?.classe?._id || '',
    matiere: creneauInitial?.matiere?._id || '',
    professeur: creneauInitial?.professeur?._id || '',
    salle: creneauInitial?.salle?._id || '',
    jour: creneauInitial?.jour || JOURS_SEMAINE[0],
    heureDebut: creneauInitial?.heureDebut || '08:00',
    heureFin: creneauInitial?.heureFin || '10:00',
    anneeScolaire: creneauInitial?.anneeScolaire || anneeScolaire,
  });
  const [erreur, setErreur] = useState('');
  const [enregistrement, setEnregistrement] = useState(false);

  const { hasConflict, conflits, verification } = useConflictCheck(formulaire, creneauInitial?._id);

  function majChamp(champ, valeur) {
    setFormulaire((f) => ({ ...f, [champ]: valeur }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (hasConflict) return; // sécurité supplémentaire : le bouton est déjà désactivé
    setErreur('');
    setEnregistrement(true);
    try {
      if (creneauInitial?._id) {
        await updateCreneau(creneauInitial._id, formulaire);
      } else {
        await createCreneau(formulaire);
      }
      onSaved();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setEnregistrement(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Supprimer ce créneau ?')) return;
    await deleteCreneau(creneauInitial._id);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Classe</label>
          <select required value={formulaire.classe} onChange={(e) => majChamp('classe', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">—</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.nom}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Matière</label>
          <select required value={formulaire.matiere} onChange={(e) => majChamp('matiere', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">—</option>
            {matieres.map((m) => <option key={m._id} value={m._id}>{m.nom}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Professeur</label>
          <select required value={formulaire.professeur} onChange={(e) => majChamp('professeur', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">—</option>
            {professeurs.map((p) => <option key={p._id} value={p._id}>{p.prenom} {p.nom}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Salle</label>
          <select required value={formulaire.salle} onChange={(e) => majChamp('salle', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">—</option>
            {salles.map((s) => <option key={s._id} value={s._id}>{s.nom}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Jour</label>
        <select required value={formulaire.jour} onChange={(e) => majChamp('jour', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          {JOURS_SEMAINE.map((jour) => <option key={jour} value={jour}>{jour}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Heure de début</label>
          <input type="time" required value={formulaire.heureDebut} onChange={(e) => majChamp('heureDebut', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Heure de fin</label>
          <input type="time" required value={formulaire.heureFin} onChange={(e) => majChamp('heureFin', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Année scolaire</label>
        <input required value={formulaire.anneeScolaire} onChange={(e) => majChamp('anneeScolaire', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>

      {verification && <p className="text-xs text-slate-400">Vérification des conflits...</p>}
      <ConflictAlert conflits={conflits} />
      {erreur && <p className="text-sm text-red-600">{erreur}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={hasConflict || enregistrement}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg py-2"
        >
          {enregistrement ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        {creneauInitial?._id && (
          <button type="button" onClick={handleDelete} className="px-4 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
            Supprimer
          </button>
        )}
      </div>
    </form>
  );
}
