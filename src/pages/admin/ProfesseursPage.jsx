// Gestion CRUD des professeurs : tableau + modale de création/édition, incluant
// le choix des matières enseignées et l'édition des disponibilités.

import { useEffect, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { DisponibiliteEditor } from '../../components/forms/DisponibiliteEditor';
import {
  listProfesseurs,
  createProfesseur,
  updateProfesseur,
  updateDisponibilites,
  deleteProfesseur,
} from '../../api/professeurApi';
import { listMatieres } from '../../api/matiereApi';

const FORMULAIRE_VIDE = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  matieresEnseignees: [],
  disponibilites: [],
};

export default function ProfesseursPage() {
  const [professeurs, setProfesseurs] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [profEnEdition, setProfEnEdition] = useState(null);
  const [formulaire, setFormulaire] = useState(FORMULAIRE_VIDE);
  const [erreur, setErreur] = useState('');

  function rafraichir() {
    setChargement(true);
    Promise.all([listProfesseurs(), listMatieres()])
      .then(([p, m]) => {
        setProfesseurs(p);
        setMatieres(m);
      })
      .finally(() => setChargement(false));
  }

  useEffect(rafraichir, []);

  function ouvrirCreation() {
    setFormulaire(FORMULAIRE_VIDE);
    setErreur('');
    setProfEnEdition({});
  }

  function ouvrirEdition(prof) {
    setFormulaire({
      nom: prof.nom,
      prenom: prof.prenom,
      email: prof.email || '',
      telephone: prof.telephone || '',
      matieresEnseignees: prof.matieresEnseignees.map((m) => m._id),
      disponibilites: prof.disponibilites,
    });
    setErreur('');
    setProfEnEdition(prof);
  }

  function toggleMatiere(matiereId) {
    setFormulaire((f) => ({
      ...f,
      matieresEnseignees: f.matieresEnseignees.includes(matiereId)
        ? f.matieresEnseignees.filter((id) => id !== matiereId)
        : [...f.matieresEnseignees, matiereId],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    const { nom, prenom, email, telephone, matieresEnseignees, disponibilites } = formulaire;
    try {
      if (profEnEdition._id) {
        await updateProfesseur(profEnEdition._id, { nom, prenom, email, telephone, matieresEnseignees });
        await updateDisponibilites(profEnEdition._id, disponibilites);
      } else {
        await createProfesseur({ nom, prenom, email, telephone, matieresEnseignees, disponibilites });
      }
      setProfEnEdition(null);
      rafraichir();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Une erreur est survenue.');
    }
  }

  async function handleDelete(prof) {
    if (!window.confirm(`Supprimer le professeur "${prof.prenom} ${prof.nom}" ?`)) return;
    await deleteProfesseur(prof._id);
    rafraichir();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Professeurs</h1>
        <button
          onClick={ouvrirCreation}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2"
        >
          + Ajouter un professeur
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Matières</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {chargement && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Chargement...</td></tr>
            )}
            {!chargement && professeurs.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Aucun professeur.</td></tr>
            )}
            {professeurs.map((prof) => (
              <tr key={prof._id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-900">{prof.prenom} {prof.nom}</td>
                <td className="px-4 py-3 text-slate-500">{prof.email || '—'}</td>
                <td className="px-4 py-3 text-slate-500">
                  {prof.matieresEnseignees.map((m) => m.nom).join(', ') || '—'}
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => ouvrirEdition(prof)} className="text-indigo-600 hover:underline">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(prof)} className="text-red-600 hover:underline">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {profEnEdition && (
        <Modal titre={profEnEdition._id ? 'Modifier le professeur' : 'Nouveau professeur'} onClose={() => setProfEnEdition(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                <input
                  required
                  value={formulaire.prenom}
                  onChange={(e) => setFormulaire({ ...formulaire, prenom: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                <input
                  required
                  value={formulaire.nom}
                  onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formulaire.email}
                onChange={(e) => setFormulaire({ ...formulaire, email: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <input
                value={formulaire.telephone}
                onChange={(e) => setFormulaire({ ...formulaire, telephone: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Matières enseignées</label>
              <div className="flex flex-wrap gap-2">
                {matieres.map((matiere) => (
                  <label
                    key={matiere._id}
                    className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer ${
                      formulaire.matieresEnseignees.includes(matiere._id)
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formulaire.matieresEnseignees.includes(matiere._id)}
                      onChange={() => toggleMatiere(matiere._id)}
                    />
                    {matiere.nom}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Disponibilités</label>
              <DisponibiliteEditor
                value={formulaire.disponibilites}
                onChange={(disponibilites) => setFormulaire({ ...formulaire, disponibilites })}
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
