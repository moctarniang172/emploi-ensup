import axiosClient from './axiosClient';

export const listCreneaux = (filtres = {}) =>
  axiosClient.get('/creneaux', { params: filtres }).then((res) => res.data.data.creneaux);

export const getCreneauxParClasse = (classeId, anneeScolaire) =>
  axiosClient
    .get(`/creneaux/classe/${classeId}`, { params: { anneeScolaire } })
    .then((res) => res.data.data.creneaux);

export const getCreneauxParProfesseur = (professeurId, anneeScolaire) =>
  axiosClient
    .get(`/creneaux/professeur/${professeurId}`, { params: { anneeScolaire } })
    .then((res) => res.data.data.creneaux);

// Renvoie { hasConflict, conflits } sans jamais écrire en base.
export const checkConflicts = (donnees) =>
  axiosClient.post('/creneaux/check-conflicts', donnees).then((res) => res.data.data);

export const createCreneau = (donnees) =>
  axiosClient.post('/creneaux', donnees).then((res) => res.data.data.creneau);

export const updateCreneau = (id, donnees) =>
  axiosClient.put(`/creneaux/${id}`, donnees).then((res) => res.data.data.creneau);

export const deleteCreneau = (id) => axiosClient.delete(`/creneaux/${id}`);

// Télécharge le PDF de l'emploi du temps et déclenche le téléchargement dans le navigateur.
// Le fichier nécessite le token d'authentification (via axiosClient), donc on ne peut pas
// utiliser un simple lien <a href="..."> : on récupère le PDF en "blob" puis on simule un clic.
async function telechargerPdf(url, nomFichier) {
  const reponse = await axiosClient.get(url, { responseType: 'blob' });
  const lienTemporaire = document.createElement('a');
  lienTemporaire.href = URL.createObjectURL(reponse.data);
  lienTemporaire.download = nomFichier;
  lienTemporaire.click();
  URL.revokeObjectURL(lienTemporaire.href);
}

export const telechargerPdfClasse = (classeId, nomClasse) =>
  telechargerPdf(`/creneaux/classe/${classeId}/pdf`, `emploi-du-temps-${nomClasse}.pdf`);

export const telechargerPdfProfesseur = (professeurId, nomProfesseur) =>
  telechargerPdf(`/creneaux/professeur/${professeurId}/pdf`, `emploi-du-temps-${nomProfesseur}.pdf`);
