import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  userId: number | null; // ID del usuario
  token: string | null;
  role: string | null; // Rol del usuario
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Recuperar token y rol desde localStorage al cargar
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');

    if (storedToken && storedRole && storedUserId) {
      setToken(storedToken);
      setRole(storedRole);
      setUserId(parseInt(storedUserId, 10));
    }
  }, []);

  const login = (token: string) => {
    setToken(token);

    try {
      // Decodificar el token para extraer el rol y el ID de usuario
      const decodedToken: { id: number; rol: string } = jwtDecode(token);

      setRole(decodedToken.rol);
      setUserId(decodedToken.id);

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', decodedToken.rol);
      localStorage.setItem('userId', decodedToken.id.toString());

      console.log('Token decodificado:', decodedToken); // Debugging
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ userId, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
