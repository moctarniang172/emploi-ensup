import axiosClient from './axiosClient';

export function login(email, password) {
  return axiosClient.post('/auth/login', { email, password }).then((res) => res.data.data);
}

export function getMe() {
  return axiosClient.get('/auth/me').then((res) => res.data.data.user);
}

export function changePassword(ancienMotDePasse, nouveauMotDePasse) {
  return axiosClient.put('/auth/change-password', { ancienMotDePasse, nouveauMotDePasse });
}
