import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPanel from "./pages/admin-panel/AdminPanel";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import PrivateRoute from "./components/PrivateRoute";
import ClassesPage from "./pages/ClassesPage";
import CreateClassPage from "./pages/CreateClassPage";
import ClassDetailsPage from "./pages/class-details/ClassDetailsPage";
import HomePage from "./pages/HomePage"; // Página principal
import RegisterPage from "./pages/register/RegisterPage";
import ProfesorPage from "./pages/ProfesorPage"; // Importamos la nueva página
import Profile from "./pages/profile/Profile";

const RouterComponent = () => {
  return (
    <Routes>
      {/* Página de inicio */}
      <Route path="/" element={<HomePage />} />

      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/mi-perfil/" element={<Profile />} />
      <Route path="/admin" element={<AdminPanel />} />

      {/* Ruta para usuarios no autorizados */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Rutas protegidas para profesores y estudiantes */}
      <Route
        element={
          <PrivateRoute
            allowedRoles={["profesor", "estudiante", "administrador"]}
          />
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clases" element={<ClassesPage />} />
        <Route path="/clases/crear" element={<CreateClassPage />} />
        <Route path="/clases/:id" element={<ClassDetailsPage />} />
        <Route path="/profesores" element={<ProfesorPage />} />{" "}
      </Route>

      {/* Rutas protegidas para administradores */}
      <Route element={<PrivateRoute allowedRoles={["administrador"]} />}>
        <Route path="/admin" element={<AdminPanel />} />
      </Route>
    </Routes>
  );
};

export default RouterComponent;
