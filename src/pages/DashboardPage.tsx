import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box p={3}>
      {/* Interfaz de bienvenida */}
      <Typography variant="h4" mb={4}>
        Bienvenido, {user?.nombre || 'Usuario'}
      </Typography>

      <Grid container spacing={3}>
        {/* Botón para ir a la página de clases */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Gestiona tus clases</Typography>
              <Typography variant="body2">
                Consulta las clases disponibles, inscríbete o crea nuevas clases como profesor.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => navigate('/clases')} // Redirige a la página de clases
              >
                Ir a Clases
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Ejemplo: Tarjeta para tutorías disponibles */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tutorías Disponibles</Typography>
              <Typography variant="body2">
                Revisa las tutorías abiertas para inscribirte.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Ver tutorías
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Ejemplo: Tarjeta para tus tutorías */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Mis Tutorías</Typography>
              <Typography variant="body2">
                Visualiza las tutorías en las que estás inscrito.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
                Ver mis tutorías
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
