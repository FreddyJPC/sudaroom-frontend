import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  userId: number | null | undefined;  
  token: string | null | undefined;
  role: string | null | undefined;  
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializamos en undefined para distinguir entre "cargando" y "no autenticado"
  const [userId, setUserId] = useState<number | null | undefined>(undefined);
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [role, setRole] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const loadAuthData = () => {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        try {
          const decodedToken: { id: number; rol: string; exp: number } = jwtDecode(storedToken);

          if (decodedToken.exp * 1000 < Date.now()) {
            console.warn('El token ha expirado. Cerrando sesión.');
            logout();
            return;
          }

          setToken(storedToken);
          setRole(decodedToken.rol);
          setUserId(decodedToken.id);

          console.log('Token cargado desde localStorage:', decodedToken);
        } catch (error) {
          console.error('Error al decodificar el token almacenado:', error);
          logout();
        }
      } else {
        // Cuando no hay token almacenado, definimos los estados como null
        setToken(null);
        setRole(null);
        setUserId(null);
      }
    };

    loadAuthData();
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' && !event.newValue) {
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (token: string) => {
    try {
      const decodedToken: { id: number; rol: string; exp: number } = jwtDecode(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        console.warn('Intento de inicio de sesión con un token expirado.');
        logout();
        return;
      }

      setToken(token);
      setRole(decodedToken.rol);
      setUserId(decodedToken.id);

      localStorage.setItem('token', token);
      localStorage.setItem('role', decodedToken.rol);
      localStorage.setItem('userId', decodedToken.id.toString());

      console.log('Inicio de sesión exitoso:', decodedToken);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');

    console.log('Sesión cerrada correctamente.');
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
