import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  allowedRoles: string[]; // Lista de roles permitidos para la ruta
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { token, role } = useAuth();

  // Logs para depuración
  console.log('Token en PrivateRoute:', token); 
  console.log('Role del usuario en PrivateRoute:', role);
  console.log('Roles permitidos en esta ruta:', allowedRoles);

  // Si no hay un token presente, redirigir al login
  if (!token) {
    console.warn('Acceso denegado: No hay token, redirigiendo al login.');
    return <Navigate to="/login" />;
  }

  // Si el rol no coincide con los permitidos, redirigir a "no autorizado"
  if (!allowedRoles.includes(role || '')) {
    console.warn(`Acceso denegado: El rol "${role}" no está permitido en esta ruta.`);
    return <Navigate to="/unauthorized" />;
  }

  // Si el token y el rol son válidos, renderizar la ruta
  console.info('Acceso concedido: Renderizando contenido protegido.');
  return <Outlet />;
};

export default PrivateRoute;
