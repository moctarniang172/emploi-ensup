import axiosClient from './axiosClient';

export const listClasses = () => axiosClient.get('/classes').then((res) => res.data.data.classes);
export const getClasse = (id) => axiosClient.get(`/classes/${id}`).then((res) => res.data.data.classe);
export const createClasse = (data) => axiosClient.post('/classes', data).then((res) => res.data.data);
export const updateClasse = (id, data) => axiosClient.put(`/classes/${id}`, data).then((res) => res.data.data.classe);
export const deleteClasse = (id) => axiosClient.delete(`/classes/${id}`);
