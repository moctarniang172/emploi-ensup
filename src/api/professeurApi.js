import axiosClient from './axiosClient';

export const listProfesseurs = () => axiosClient.get('/professeurs').then((res) => res.data.data.professeurs);
export const getProfesseur = (id) => axiosClient.get(`/professeurs/${id}`).then((res) => res.data.data.professeur);
export const createProfesseur = (data) => axiosClient.post('/professeurs', data).then((res) => res.data.data.professeur);
export const updateProfesseur = (id, data) => axiosClient.put(`/professeurs/${id}`, data).then((res) => res.data.data.professeur);
export const updateDisponibilites = (id, disponibilites) =>
  axiosClient.put(`/professeurs/${id}/disponibilites`, { disponibilites }).then((res) => res.data.data.professeur);
export const deleteProfesseur = (id) => axiosClient.delete(`/professeurs/${id}`);
