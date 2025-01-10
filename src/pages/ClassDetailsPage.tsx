// src/pages/ClassDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
        console.error('Error al obtener los detalles de la clase:', error);
      }
    };

    fetchClassDetails();
  }, [id, token]);

  if (!classDetails) {
    return <p>Cargando detalles de la clase...</p>;
  }

  return (
    <div>
      <h1>{classDetails.titulo}</h1>
      <p>{classDetails.descripcion}</p>
      <p>Profesor: {classDetails.profesor}</p>
      <p>Carrera: {classDetails.carrera}</p>
      <p>Fecha y hora: {new Date(classDetails.fecha_hora).toLocaleString()}</p>
      <p>Duración: {classDetails.duracion} minutos</p>
      <p>Capacidad máxima: {classDetails.capacidad_maxima}</p>
      <p>Estado: {classDetails.estado}</p>
    </div>
  );
};

export default ClassDetailsPage;
