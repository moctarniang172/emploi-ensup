// Gestion CRUD des matières : tableau + modale de création/édition.

import { useEffect, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { listMatieres, createMatiere, updateMatiere, deleteMatiere } from '../../api/matiereApi';

const FORMULAIRE_VIDE = { nom: '', code: '', volumeHoraire: '' };

export default function MatieresPage() {
  const [matieres, setMatieres] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [matiereEnEdition, setMatiereEnEdition] = useState(null); // null = fermé, {} = création, {...} = édition
  const [formulaire, setFormulaire] = useState(FORMULAIRE_VIDE);
  const [erreur, setErreur] = useState('');

  function rafraichir() {
    setChargement(true);
    listMatieres()
      .then(setMatieres)
      .finally(() => setChargement(false));
  }

  useEffect(rafraichir, []);

  function ouvrirCreation() {
    setFormulaire(FORMULAIRE_VIDE);
    setErreur('');
    setMatiereEnEdition({});
  }

  function ouvrirEdition(matiere) {
    setFormulaire({ nom: matiere.nom, code: matiere.code || '', volumeHoraire: matiere.volumeHoraire ?? '' });
    setErreur('');
    setMatiereEnEdition(matiere);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    const donnees = {
      nom: formulaire.nom,
      code: formulaire.code || undefined,
      volumeHoraire: formulaire.volumeHoraire === '' ? undefined : Number(formulaire.volumeHoraire),
    };
    try {
      if (matiereEnEdition._id) {
        await updateMatiere(matiereEnEdition._id, donnees);
      } else {
        await createMatiere(donnees);
      }
      setMatiereEnEdition(null);
      rafraichir();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Une erreur est survenue.');
    }
  }

  async function handleDelete(matiere) {
    if (!window.confirm(`Supprimer la matière "${matiere.nom}" ?`)) return;
    await deleteMatiere(matiere._id);
    rafraichir();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Matières</h1>
        <button
          onClick={ouvrirCreation}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2"
        >
          + Ajouter une matière
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Volume horaire</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {chargement && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Chargement...</td></tr>
            )}
            {!chargement && matieres.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Aucune matière.</td></tr>
            )}
            {matieres.map((matiere) => (
              <tr key={matiere._id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-900">{matiere.nom}</td>
                <td className="px-4 py-3 text-slate-500">{matiere.code || '—'}</td>
                <td className="px-4 py-3 text-slate-500">{matiere.volumeHoraire ?? '—'}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => ouvrirEdition(matiere)} className="text-indigo-600 hover:underline">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(matiere)} className="text-red-600 hover:underline">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {matiereEnEdition && (
        <Modal titre={matiereEnEdition._id ? 'Modifier la matière' : 'Nouvelle matière'} onClose={() => setMatiereEnEdition(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
              <input
                required
                value={formulaire.nom}
                onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
              <input
                value={formulaire.code}
                onChange={(e) => setFormulaire({ ...formulaire, code: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Volume horaire (heures)</label>
              <input
                type="number"
                min="0"
                value={formulaire.volumeHoraire}
                onChange={(e) => setFormulaire({ ...formulaire, volumeHoraire: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            {erreur && <p className="text-sm text-red-600">{erreur}</p>}
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg py-2">
              Enregistrer
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
