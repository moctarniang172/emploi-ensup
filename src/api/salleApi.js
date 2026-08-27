import axiosClient from './axiosClient';

export const listSalles = () => axiosClient.get('/api/salles').then((res) => res.data.data.salles);
export const createSalle = (data) => axiosClient.post('/api/salles', data).then((res) => res.data.data.salle);
export const updateSalle = (id, data) => axiosClient.put(`/api/salles/${id}`, data).then((res) => res.data.data.salle);
export const deleteSalle = (id) => axiosClient.delete(`/api/salles/${id}`);
