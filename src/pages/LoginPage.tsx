import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { loginService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await loginService(email, password);
      login(token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <Box display="flex" minHeight="100vh" width="100%" >
      {/* Sección izquierda */}
      {/* <Box
        flex={1}
        bgcolor="green"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={4}
        color="white"
      >
        <Typography variant="h3" mb={2}>
          Únete a nuestra comunidad
        </Typography>
        <Typography variant="body1" maxWidth="300px" textAlign="center">
          Aprende y mejora tus habilidades con nosotros. ¡Es rápido y fácil!
        </Typography>
      </Box> */}

      {/* Sección derecha */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={4}
        bgcolor="white"
      >
        <Typography variant="h4" mb={2}>
          Iniciar Sesión
        </Typography>
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '300px' }}>
          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
            Iniciar Sesión
          </Button>

          <Divider sx={{ width: '100%', maxWidth: '300px', my: 2 }} />
        
        <Button variant="outlined" color="primary" fullWidth sx={{ mb: 2 }}>
          Continúa con Google
        </Button>
        <Button variant="outlined" color="secondary" fullWidth>
          Continúa con Apple
        </Button>
        
        </form>



        <Typography mt={2}>
          ¿No tienes cuenta?{' '}
          <Link
            component="button"
            onClick={() => navigate('/register')}
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Regístrate aquí
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
