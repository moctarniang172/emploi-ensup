import axiosClient from './axiosClient';

export const listMatieres = () => axiosClient.get('/api/matieres').then((res) => res.data.data.matieres);
export const createMatiere = (data) => axiosClient.post('/api/matieres', data).then((res) => res.data.data.matiere);
export const updateMatiere = (id, data) => axiosClient.put(`/api/matieres/${id}`, data).then((res) => res.data.data.matiere);
export const deleteMatiere = (id) => axiosClient.delete(`/api/matieres/${id}`);
