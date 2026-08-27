import axiosClient from './axiosClient';

export function login(email, password) {
  return axiosClient.post('/api/auth/login', { email, password }).then((res) => res.data.data);
}

export function getMe() {
  return axiosClient.get('/api/auth/me').then((res) => res.data.data.user);
}

export function changePassword(ancienMotDePasse, nouveauMotDePasse) {
  return axiosClient.put('/api/auth/change-password', { ancienMotDePasse, nouveauMotDePasse });
}
