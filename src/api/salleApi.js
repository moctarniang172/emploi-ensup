import axiosClient from './axiosClient';

export const listSalles = () => axiosClient.get('/salles').then((res) => res.data.data.salles);
export const createSalle = (data) => axiosClient.post('/salles', data).then((res) => res.data.data.salle);
export const updateSalle = (id, data) => axiosClient.put(`/salles/${id}`, data).then((res) => res.data.data.salle);
export const deleteSalle = (id) => axiosClient.delete(`/salles/${id}`);
