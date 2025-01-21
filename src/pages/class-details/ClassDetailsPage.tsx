import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import BackButton from "../../components/BackButton";
import "./ClassDetailsPage.css"; // Estilos actualizados

type Clase = {
  id_clase: number;
  titulo: string;
  descripcion: string;
  fecha_hora: string;
  duracion: number;
  capacidad_maxima: number;
  estado: string;
  profesor: string;
  carrera: string;
};

const ClassDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [classDetails, setClassDetails] = useState<Clase | null>(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await axios.get(`/api/clases/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClassDetails(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles de la clase:", error);
      }
    };

    fetchClassDetails();
  }, [id, token]);

  if (!classDetails) {
    return (
      <div className="class-details-loading">
        <p>Cargando detalles de la clase...</p>
      </div>
    );
  }

  return (
    <div className="class-details-container">
      <BackButton />
      <div className="class-details-card">
        <h1 className="class-title">{classDetails.titulo}</h1>
        <p className="class-description">{classDetails.descripcion}</p>
        <div className="class-info">
          <div className="class-info-section">
            <p>
              <strong>Profesor:</strong> {classDetails.profesor}
            </p>
            <p>
              <strong>Carrera:</strong> {classDetails.carrera}
            </p>
          </div>
          <div className="class-info-section">
            <p>
              <strong>Fecha y hora:</strong>{" "}
              {new Date(classDetails.fecha_hora).toLocaleString()}
            </p>
            <p>
              <strong>Duración:</strong> {classDetails.duracion} minutos
            </p>
          </div>
          <div className="class-info-section">
            <p>
              <strong>Capacidad máxima:</strong> {classDetails.capacidad_maxima}
            </p>
            <p>
              <strong>Estado:</strong> {classDetails.estado}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailsPage;
