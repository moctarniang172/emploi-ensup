// Gestion CRUD des salles : tableau + modale de création/édition.

import { useEffect, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { listSalles, createSalle, updateSalle, deleteSalle } from '../../api/salleApi';

const TYPES_SALLE = ['standard', 'labo', 'amphi', 'informatique'];
const FORMULAIRE_VIDE = { nom: '', capacite: '', type: 'standard' };

export default function SallesPage() {
  const [salles, setSalles] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [salleEnEdition, setSalleEnEdition] = useState(null);
  const [formulaire, setFormulaire] = useState(FORMULAIRE_VIDE);
  const [erreur, setErreur] = useState('');

  function rafraichir() {
    setChargement(true);
    listSalles()
      .then(setSalles)
      .finally(() => setChargement(false));
  }

  useEffect(rafraichir, []);

  function ouvrirCreation() {
    setFormulaire(FORMULAIRE_VIDE);
    setErreur('');
    setSalleEnEdition({});
  }

  function ouvrirEdition(salle) {
    setFormulaire({ nom: salle.nom, capacite: salle.capacite ?? '', type: salle.type });
    setErreur('');
    setSalleEnEdition(salle);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    const donnees = {
      nom: formulaire.nom,
      capacite: formulaire.capacite === '' ? undefined : Number(formulaire.capacite),
      type: formulaire.type,
    };
    try {
      if (salleEnEdition._id) {
        await updateSalle(salleEnEdition._id, donnees);
      } else {
        await createSalle(donnees);
      }
      setSalleEnEdition(null);
      rafraichir();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Une erreur est survenue.');
    }
  }

  async function handleDelete(salle) {
    if (!window.confirm(`Supprimer la salle "${salle.nom}" ?`)) return;
    await deleteSalle(salle._id);
    rafraichir();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Salles</h1>
        <button
          onClick={ouvrirCreation}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2"
        >
          + Ajouter une salle
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Capacité</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {chargement && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Chargement...</td></tr>
            )}
            {!chargement && salles.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Aucune salle.</td></tr>
            )}
            {salles.map((salle) => (
              <tr key={salle._id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-900">{salle.nom}</td>
                <td className="px-4 py-3 text-slate-500">{salle.capacite ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500 capitalize">{salle.type}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => ouvrirEdition(salle)} className="text-indigo-600 hover:underline">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(salle)} className="text-red-600 hover:underline">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {salleEnEdition && (
        <Modal titre={salleEnEdition._id ? 'Modifier la salle' : 'Nouvelle salle'} onClose={() => setSalleEnEdition(null)}>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Capacité</label>
              <input
                type="number"
                min="0"
                value={formulaire.capacite}
                onChange={(e) => setFormulaire({ ...formulaire, capacite: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                value={formulaire.type}
                onChange={(e) => setFormulaire({ ...formulaire, type: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize"
              >
                {TYPES_SALLE.map((type) => (
                  <option key={type} value={type} className="capitalize">{type}</option>
                ))}
              </select>
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
