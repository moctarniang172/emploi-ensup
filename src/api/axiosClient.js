// Instance axios unique partagée par tous les fichiers api/*.js.
// - Ajoute automatiquement le token JWT (stocké dans localStorage) à chaque requête.
// - Si le serveur répond 401 (token invalide/expiré), déconnecte l'utilisateur localement
//   pour éviter de rester "connecté" côté interface alors que le token ne fonctionne plus.

import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-emploi-temp.onrender.com',
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
