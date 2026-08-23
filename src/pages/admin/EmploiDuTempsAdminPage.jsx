// Vue calendrier hebdomadaire éditable pour l'admin, filtrable par classe.
// Cliquer sur un créneau existant l'ouvre en édition ; "Ajouter un créneau" ouvre une création.

import { useEffect, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { WeeklyCalendarGrid } from '../../components/calendar/WeeklyCalendarGrid';
import { CreneauForm } from '../../components/forms/CreneauForm';
import { listCreneaux, telechargerPdfClasse } from '../../api/creneauApi';
import { listClasses } from '../../api/classeApi';
import { listMatieres } from '../../api/matiereApi';
import { listProfesseurs } from '../../api/professeurApi';
import { listSalles } from '../../api/salleApi';

const ANNEE_SCOLAIRE_DEFAUT = '2025-2026';

export default function EmploiDuTempsAdminPage() {
  const [creneaux, setCreneaux] = useState([]);
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [salles, setSalles] = useState([]);
  const [classeFiltree, setClasseFiltree] = useState('');
  const [creneauEnEdition, setCreneauEnEdition] = useState(null); // null fermé, {} création, {...} édition
  const [telechargementPdf, setTelechargementPdf] = useState(false);

  function rafraichirCreneaux() {
    listCreneaux({
      anneeScolaire: ANNEE_SCOLAIRE_DEFAUT,
      ...(classeFiltree ? { classe: classeFiltree } : {}),
    }).then(setCreneaux);
  }

  useEffect(() => {
    Promise.all([listClasses(), listMatieres(), listProfesseurs(), listSalles()]).then(
      ([c, m, p, s]) => {
        setClasses(c);
        setMatieres(m);
        setProfesseurs(p);
        setSalles(s);
      }
    );
  }, []);

  useEffect(rafraichirCreneaux, [classeFiltree]);

  function fermerFormulaire() {
    setCreneauEnEdition(null);
    rafraichirCreneaux();
  }

  async function handleTelechargerPdf() {
    const classe = classes.find((c) => c._id === classeFiltree);
    setTelechargementPdf(true);
    try {
      await telechargerPdfClasse(classeFiltree, classe?.nom || 'classe');
    } finally {
      setTelechargementPdf(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Emploi du temps</h1>
        <div className="flex items-center gap-3">
          <select
            value={classeFiltree}
            onChange={(e) => setClasseFiltree(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Toutes les classes</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.nom}</option>)}
          </select>
          {classeFiltree && (
            <button
              onClick={handleTelechargerPdf}
              disabled={telechargementPdf}
              className="text-sm text-slate-600 border border-slate-300 rounded-lg px-3 py-2 hover:bg-slate-50 disabled:opacity-50"
            >
              {telechargementPdf ? 'Génération...' : 'PDF'}
            </button>
          )}
          <button
            onClick={() => setCreneauEnEdition({})}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2"
          >
            + Ajouter un créneau
          </button>
        </div>
      </div>

      <WeeklyCalendarGrid creneaux={creneaux} readOnly={false} onCreneauClick={setCreneauEnEdition} />

      {creneauEnEdition && (
        <Modal titre={creneauEnEdition._id ? 'Modifier le créneau' : 'Nouveau créneau'} onClose={() => setCreneauEnEdition(null)}>
          <CreneauForm
            creneauInitial={creneauEnEdition._id ? creneauEnEdition : null}
            classes={classes}
            matieres={matieres}
            professeurs={professeurs}
            salles={salles}
            anneeScolaire={ANNEE_SCOLAIRE_DEFAUT}
            onSaved={fermerFormulaire}
          />
        </Modal>
      )}
    </div>
  );
}
