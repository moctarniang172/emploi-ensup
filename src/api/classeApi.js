import axiosClient from './axiosClient';

export const listClasses = () => axiosClient.get('/api/classes').then((res) => res.data.data.classes);
export const getClasse = (id) => axiosClient.get(`/api/classes/${id}`).then((res) => res.data.data.classe);
export const createClasse = (data) => axiosClient.post('/api/classes', data).then((res) => res.data.data);
export const updateClasse = (id, data) => axiosClient.put(`/api/classes/${id}`, data).then((res) => res.data.data.classe);
export const deleteClasse = (id) => axiosClient.delete(`/api/classes/${id}`);
