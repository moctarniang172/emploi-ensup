import axiosClient from './axiosClient';

export const listProfesseurs = () => axiosClient.get('/api/professeurs').then((res) => res.data.data.professeurs);
export const getProfesseur = (id) => axiosClient.get(`/api/professeurs/${id}`).then((res) => res.data.data.professeur);
export const createProfesseur = (data) => axiosClient.post('/api/professeurs', data).then((res) => res.data.data.professeur);
export const updateProfesseur = (id, data) => axiosClient.put(`/api/professeurs/${id}`, data).then((res) => res.data.data.professeur);
export const updateDisponibilites = (id, disponibilites) =>
  axiosClient.put(`/api/professeurs/${id}/disponibilites`, { disponibilites }).then((res) => res.data.data.professeur);
export const deleteProfesseur = (id) => axiosClient.delete(`/api/professeurs/${id}`);
