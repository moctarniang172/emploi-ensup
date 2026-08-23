import axiosClient from './axiosClient';

export const listMatieres = () => axiosClient.get('/matieres').then((res) => res.data.data.matieres);
export const createMatiere = (data) => axiosClient.post('/matieres', data).then((res) => res.data.data.matiere);
export const updateMatiere = (id, data) => axiosClient.put(`/matieres/${id}`, data).then((res) => res.data.data.matiere);
export const deleteMatiere = (id) => axiosClient.delete(`/matieres/${id}`);
