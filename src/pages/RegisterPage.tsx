import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import { registerService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerService(nombre, correo, contraseña, rol);
      alert('Usuario registrado con éxito.');
      navigate('/login'); // Redirige al login tras registrarse
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Typography variant="h4" mb={2}>
        Registrarse
      </Typography>
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit} style={{ width: '300px' }}>
        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          label="Correo"
          type="email"
          fullWidth
          margin="normal"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />
        <TextField
          select
          label="Rol"
          fullWidth
          margin="normal"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <MenuItem value="estudiante">Estudiante</MenuItem>
          <MenuItem value="profesor">Profesor</MenuItem>
          
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Registrarse
        </Button>
        <Button
          variant="text"
          color="secondary"
          fullWidth
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Ya tengo una cuenta
        </Button>
      </form>
    </Box>
  );
};

export default RegisterPage;
