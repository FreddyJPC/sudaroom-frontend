import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
} from '@mui/material';

const API_BASE_URL = 'http://localhost:5000'; // URL base del backend

const ClassesPage: React.FC = () => {
  const { role, token } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const careers = [
    'Todos',
    'Desarrollo de Software',
    'Diseño Gráfico',
    'Redes y Telecomunicaciones',
    'Electricidad',
    'Gastronomía',
    'Turismo',
    'Enfermería',
    'Marketing Digital',
    'Contabilidad y Asesoría Tributaria',
    'Educación',
    'Talento Humano',
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/clases/disponibles`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { carrera: selectedCareer },
        });
        setClasses(response.data.clases || []);
        setError(null);
      } catch (err) {
        setError('Hubo un error al cargar las clases.');
        setClasses([]);
        console.error(err);
      }
    };

    fetchClasses();
  }, [selectedCareer, token]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f9f9f9',
        padding: { xs: 2, md: 4 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#1976d2',
          padding: { xs: 3, md: 4 },
          borderRadius: 2,
          textAlign: 'center',
          color: '#fff',
          marginBottom: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Clases Disponibles
        </Typography>
        <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
          Encuentra y reserva las mejores clases disponibles según tu carrera.
        </Typography>
      </Box>

      {/* Filtro de carreras */}
      <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="career-filter-label">Filtrar por carrera</InputLabel>
          <Select
            id="career-filter"
            value={selectedCareer || ''}
            onChange={(e) => setSelectedCareer(e.target.value || null)}
            label="Filtrar por carrera"
          >
            <MenuItem value="">Todas las carreras</MenuItem>
            {careers.map((career) => (
              <MenuItem key={career} value={career}>
                {career}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: 4 }}>
          {error}
        </Alert>
      )}

      {/* Lista de clases */}
      <Grid container spacing={3}>
        {classes && classes.length === 0 ? (
          <Typography
            variant="h6"
            sx={{ color: '#555', width: '100%', textAlign: 'center', marginTop: 4 }}
          >
            No hay clases disponibles para la carrera seleccionada.
          </Typography>
        ) : (
          classes?.map((clase) => (
            <Grid item xs={12} md={6} lg={4} key={clase.id_clase}>
              <Card
                sx={{
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    {clase.titulo}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#777', marginBottom: 2 }}
                  >
                    {clase.descripcion}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#555', marginBottom: 1 }}
                  >
                    Profesor: <strong>{clase.profesor}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555' }}>
                    Fecha y hora:{' '}
                    <strong>{new Date(clase.fecha_hora).toLocaleString()}</strong>
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    justifyContent: 'space-between',
                    padding: 2,
                    borderTop: '1px solid #eee',
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/clases/${clase.id_clase}`)}
                  >
                    Ver detalles
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Botón de crear clase */}
      {role === 'profesor' && (
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/clases/crear')}
            sx={{ padding: { xs: 1, md: 2 }, fontWeight: 'bold' }}
          >
            Crear Clase
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ClassesPage;
