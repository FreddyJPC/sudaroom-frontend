import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useAuth } from "../context/AuthContext";

interface UserProfile {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  fecha_creacion: string;
  carrera?: string; 
}

<BackButton />;
const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
      } catch (error) {
        setError("No se pudo cargar la información del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>{error}</p>;
  if (!userProfile) return <p>No se encontró información del usuario.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Perfil de Usuario</h1>
      <div style={{ marginBottom: "15px" }}>
        <strong>ID:</strong> {userProfile.id_usuario}
      </div>
      <div style={{ marginBottom: "15px" }}>
        <strong>Nombre:</strong> {userProfile.nombre}
      </div>
      <div style={{ marginBottom: "15px" }}>
        <strong>Correo:</strong> {userProfile.correo}
      </div>
      <div style={{ marginBottom: "15px" }}>
        <strong>Rol:</strong> {userProfile.rol}
      </div>
      <div style={{ marginBottom: "15px" }}>
        <strong>Fecha de creación:</strong>{" "}
        {new Date(userProfile.fecha_creacion).toLocaleDateString()}
      </div>
      {userProfile.carrera && (
        <div style={{ marginBottom: "15px" }}>
          <strong>Carrera:</strong> {userProfile.carrera}
        </div>
      )}
    </div>
  );
};

export default Profile;
