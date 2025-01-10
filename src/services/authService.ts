import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/users';

export const loginService = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    correo: email,
    contraseña: password,
  });

  const { token } = response.data;

  // Decodifica el token para extraer información del usuario (opcional)
  const payload = JSON.parse(atob(token.split('.')[1]));
  const role = payload.role;
  const userId = payload.id;

  // Devuelve información completa del usuario
  return {
    user: { id: userId, role }, // Incluye user si es necesario
    token,
    role,
    userId,
  };
};
