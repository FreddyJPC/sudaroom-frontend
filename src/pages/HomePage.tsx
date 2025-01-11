import { AppBar, Toolbar, Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import imguno from '../assets/imguno.svg'; // Imagen principal
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Icono para "¿Cómo funciona?"

const HomePage = () => {
  const navigate = useNavigate();

  // Función para hacer scroll a la sección "¿Cómo funciona?"
  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%', 
        overflowX: 'hidden', 
        padding: 0,
        margin: 0,
        backgroundColor: '#f9f9f9',
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          maxHeight: "70px",
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Sombra para profundidad
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', padding: { xs: 1, sm: 2 } }}>
          {/* Título */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: '#333',
              fontSize: { xs: '1rem', md: '1.5rem' },
            }}
          >
            SudaRoom
          </Typography>

          {/* Botón "¿Cómo funciona?" */}
          <Button
            variant="text"
            color="primary"
            onClick={scrollToHowItWorks}
            startIcon={<ArrowDownwardIcon />}
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '0.9rem', md: '1rem' },
              textTransform: 'none',
            }}
          >
            ¿Cómo funciona?
          </Button>
        </Toolbar>
      </AppBar>

      {/* Cuerpo principal */}
      <Grid
        container
        sx={{
          minHeight: 'calc(100vh - 64px)', // Resta la altura del AppBar
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
        }}
      >
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={imguno} // Imagen principal
            alt="Imagen representativa"
            sx={{
              width: '100%',
              maxWidth: '900px',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              textAlign: { xs: 'center', md: 'left' },
              padding: { xs: 2, md: 4 },
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 'bold', marginBottom: 2, color: '#333' }}
            >
              Bienvenido a SUDAROOM
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{ marginBottom: 4, color: '#555' }}
            >
              Descubre una plataforma para optimizar la gestión y reserva de clases.
              Ideal para estudiantes, profesores y administradores.
            </Typography>
            <Box display="flex" gap={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/login')}
              >
                Iniciar Sesión
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => navigate('/register')}
              >
                Registrarse
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Sección ¿Cómo funciona? */}
      <Box
        id="how-it-works"
        sx={{
          padding: { xs: 3, md: 6 },
          backgroundColor: '#fff',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 'bold',
            marginBottom: 4,
            color: '#333',
          }}
        >
          ¿Cómo funciona SudaRoom?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Paso 1 */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: '#333', marginBottom: 2 }}
            >
              1. Encuentra tu clase ideal
            </Typography>
            <Typography sx={{ color: '#555' }}>
              Busca entre nuestras categorías y selecciona la clase que mejor se adapte a
              tus necesidades. Todo desde una interfaz sencilla y rápida.
            </Typography>
          </Grid>

          {/* Paso 2 */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: '#333', marginBottom: 2 }}
            >
              2. Reserva y paga
            </Typography>
            <Typography sx={{ color: '#555' }}>
              Agenda tu clase en segundos y realiza el pago con total seguridad a través
              de nuestra plataforma.
            </Typography>
          </Grid>

          {/* Paso 3 */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: '#333', marginBottom: 2 }}
            >
              3. Aprende y mejora
            </Typography>
            <Typography sx={{ color: '#555' }}>
              Asiste a tu clase en nuestra aula virtual, equipada con herramientas
              interactivas para mejorar tu experiencia de aprendizaje.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
