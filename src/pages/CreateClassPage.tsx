import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from '@mui/material';

const API_BASE_URL = 'http://localhost:5000'; // URL base del backend

const CreateClassPage: React.FC = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_hora: '',
    duracion: '',
    capacidad_maxima: '',
    estado: 'disponible', // valor por defecto
    carrera: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/clases`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Clase creada exitosamente:', response.data);
      alert('Clase creada con éxito');
    } catch (error) {
      console.error('Error al crear clase:', error);
      alert('Hubo un error al crear la clase');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6f8',
        padding: { xs: 2, md: 4 },
      }}
    >
      <Card
        sx={{
          width: { xs: '100%', md: '500px' },
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 3,
              color: '#1976d2',
            }}
          >
            Crear Clase
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Título */}
            <TextField
              label="Título"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />

            {/* Descripción */}
            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              fullWidth
              required
              multiline
              rows={3}
              margin="normal"
            />

            {/* Fecha y hora */}
            <TextField
              label="Fecha y hora"
              type="datetime-local"
              name="fecha_hora"
              value={formData.fecha_hora}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            {/* Duración */}
            <TextField
              label="Duración (minutos)"
              type="number"
              name="duracion"
              value={formData.duracion}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />

            {/* Capacidad máxima */}
            <TextField
              label="Capacidad máxima"
              type="number"
              name="capacidad_maxima"
              value={formData.capacidad_maxima}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />

            {/* Carrera */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="carrera-label">Carrera</InputLabel>
              <Select
                labelId="carrera-label"
                name="carrera"
                value={formData.carrera}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="">
                  <em>Seleccionar carrera</em>
                </MenuItem>
                <MenuItem value="Desarrollo de Software">
                  Desarrollo de Software
                </MenuItem>
                <MenuItem value="Diseño Gráfico">Diseño Gráfico</MenuItem>
                <MenuItem value="Redes y Telecomunicaciones">
                  Redes y Telecomunicaciones
                </MenuItem>
                <MenuItem value="Electricidad">Electricidad</MenuItem>
                <MenuItem value="Gastronomía">Gastronomía</MenuItem>
                <MenuItem value="Turismo">Turismo</MenuItem>
                <MenuItem value="Enfermería">Enfermería</MenuItem>
                <MenuItem value="Marketing Digital">Marketing Digital</MenuItem>
                <MenuItem value="Contabilidad y Asesoría Tributaria">
                  Contabilidad y Asesoría Tributaria
                </MenuItem>
                <MenuItem value="Educación">Educación</MenuItem>
                <MenuItem value="Talento Humano">Talento Humano</MenuItem>
              </Select>
            </FormControl>

            {/* Botón de enviar */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: 2,
                padding: 1,
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Crear Clase
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateClassPage;
