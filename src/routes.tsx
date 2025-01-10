import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPanel from './pages/AdminPanel';
import UnauthorizedPage from './pages/UnauthorizedPage';
import PrivateRoute from './components/PrivateRoute';
import ClassesPage from './pages/ClassesPage';
import CreateClassPage from './pages/CreateClassPage';
import ClassDetailsPage from './pages/ClassDetailsPage';
import HomePage from './pages/HomePage'; // Importamos la nueva página

const RouterComponent = () => {
  return (
    <Routes>
      {/* Página de inicio */}
      <Route path="/" element={<HomePage />} />

      {/* Ruta pública */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Ruta para usuarios no autorizados */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Ruta protegida para profesores y estudiantes */}
      <Route
        element={<PrivateRoute allowedRoles={['profesor', 'estudiante']} />}
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clases" element={<ClassesPage />} />
        <Route path="/clases/crear" element={<CreateClassPage />} />
        <Route path="/clases/:id" element={<ClassDetailsPage />} />
      </Route>

      {/* Ruta protegida para administradores */}
      <Route
        element={<PrivateRoute allowedRoles={['administrador']} />}
      >
        <Route path="/admin" element={<AdminPanel />} />
      </Route>
    </Routes>
  );
};

export default RouterComponent;
