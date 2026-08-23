// Gestion CRUD des classes. Particularité : à la création, le backend génère automatiquement
// un compte étudiant partagé pour la classe — on affiche ses identifiants à l'admin une seule
// fois (ils ne seront plus jamais renvoyés tels quels par l'API, le mot de passe étant haché).

import { useEffect, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { listClasses, createClasse, updateClasse, deleteClasse } from '../../api/classeApi';

const FORMULAIRE_VIDE = { nom: '', filiere: '', niveau: '', effectif: '', anneeScolaire: '2025-2026' };

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [classeEnEdition, setClasseEnEdition] = useState(null);
  const [formulaire, setFormulaire] = useState(FORMULAIRE_VIDE);
  const [erreur, setErreur] = useState('');
  const [identifiantsGeneres, setIdentifiantsGeneres] = useState(null);

  function rafraichir() {
    setChargement(true);
    listClasses()
      .then(setClasses)
      .finally(() => setChargement(false));
  }

  useEffect(rafraichir, []);

  function ouvrirCreation() {
    setFormulaire(FORMULAIRE_VIDE);
    setErreur('');
    setClasseEnEdition({});
  }

  function ouvrirEdition(classe) {
    setFormulaire({
      nom: classe.nom,
      filiere: classe.filiere || '',
      niveau: classe.niveau || '',
      effectif: classe.effectif ?? '',
      anneeScolaire: classe.anneeScolaire,
    });
    setErreur('');
    setClasseEnEdition(classe);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    const donnees = {
      nom: formulaire.nom,
      filiere: formulaire.filiere || undefined,
      niveau: formulaire.niveau || undefined,
      effectif: formulaire.effectif === '' ? undefined : Number(formulaire.effectif),
      anneeScolaire: formulaire.anneeScolaire,
    };
    try {
      if (classeEnEdition._id) {
        await updateClasse(classeEnEdition._id, donnees);
        setClasseEnEdition(null);
      } else {
        const { identifiantsEtudiant } = await createClasse(donnees);
        setClasseEnEdition(null);
        setIdentifiantsGeneres(identifiantsEtudiant);
      }
      rafraichir();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Une erreur est survenue.');
    }
  }

  async function handleDelete(classe) {
    if (!window.confirm(`Supprimer la classe "${classe.nom}" et son compte étudiant associé ?`)) return;
    await deleteClasse(classe._id);
    rafraichir();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Classes</h1>
        <button
          onClick={ouvrirCreation}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2"
        >
          + Ajouter une classe
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Filière</th>
              <th className="px-4 py-3">Effectif</th>
              <th className="px-4 py-3">Année scolaire</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {chargement && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Chargement...</td></tr>
            )}
            {!chargement && classes.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Aucune classe.</td></tr>
            )}
            {classes.map((classe) => (
              <tr key={classe._id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-900">{classe.nom}</td>
                <td className="px-4 py-3 text-slate-500">{classe.filiere || '—'}</td>
                <td className="px-4 py-3 text-slate-500">{classe.effectif ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500">{classe.anneeScolaire}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => ouvrirEdition(classe)} className="text-indigo-600 hover:underline">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(classe)} className="text-red-600 hover:underline">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {classeEnEdition && (
        <Modal titre={classeEnEdition._id ? 'Modifier la classe' : 'Nouvelle classe'} onClose={() => setClasseEnEdition(null)}>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Filière</label>
                <input
                  value={formulaire.filiere}
                  onChange={(e) => setFormulaire({ ...formulaire, filiere: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Niveau</label>
                <input
                  value={formulaire.niveau}
                  onChange={(e) => setFormulaire({ ...formulaire, niveau: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Effectif</label>
                <input
                  type="number"
                  min="0"
                  value={formulaire.effectif}
                  onChange={(e) => setFormulaire({ ...formulaire, effectif: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Année scolaire</label>
                <input
                  required
                  value={formulaire.anneeScolaire}
                  onChange={(e) => setFormulaire({ ...formulaire, anneeScolaire: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            {erreur && <p className="text-sm text-red-600">{erreur}</p>}
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg py-2">
              Enregistrer
            </button>
          </form>
        </Modal>
      )}

      {identifiantsGeneres && (
        <Modal titre="Compte étudiant créé" onClose={() => setIdentifiantsGeneres(null)}>
          <p className="text-sm text-slate-600 mb-4">
            Voici les identifiants du compte partagé de cette classe. Notez-les maintenant : ils ne
            seront plus affichés ensuite (le mot de passe n'est pas récupérable).
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-sm font-mono">
            <p>Email : {identifiantsGeneres.email}</p>
            <p>Mot de passe : {identifiantsGeneres.motDePasse}</p>
          </div>
          <button
            onClick={() => setIdentifiantsGeneres(null)}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg py-2"
          >
            J'ai noté les identifiants
          </button>
        </Modal>
      )}
    </div>
  );
}
