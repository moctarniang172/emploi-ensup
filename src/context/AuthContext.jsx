// Contexte global d'authentification : garde en mémoire l'utilisateur connecté et son token,
// les synchronise avec localStorage (pour rester connecté après un rechargement de page),
// et expose login()/logout() utilisés par LoginPage et la Navbar.

import { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stocke = localStorage.getItem('user');
    return stocke ? JSON.parse(stocke) : null;
  });
  const [chargementInitial, setChargementInitial] = useState(true);

  // Au premier chargement, si un token existe déjà, on vérifie qu'il est toujours valide
  // en rappelant /auth/me (utile si le compte a été désactivé entre-temps).
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setChargementInitial(false);
      return;
    }
    authApi
      .getMe()
      .then((userActuel) => {
        setUser(userActuel);
        localStorage.setItem('user', JSON.stringify(userActuel));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .finally(() => setChargementInitial(false));
  }, []);

  async function login(email, password) {
    const { token, user: userConnecte } = await authApi.login(email, password);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userConnecte));
    setUser(userConnecte);
    return userConnecte;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, chargementInitial }}>
      {children}
    </AuthContext.Provider>
  );
}
