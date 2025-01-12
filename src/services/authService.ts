import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/users';

export const loginService = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    correo: email,
    contraseña: password,
  });

  const { token } = response.data;

  
  const payload = JSON.parse(atob(token.split('.')[1]));
  const role = payload.role;
  const userId = payload.id;

  
  return {
    user: { id: userId, role },
    token,
    role,
    userId,
  };
};

export const registerService = async (
  nombre: string,
  correo: string,
  contraseña: string,
  rol: string
) => {
  const response = await axios.post(`${BASE_URL}/register`, {
    nombre,
    correo,
    contraseña,
    rol,
  });

  return response.data; // Ajusta según lo que tu backend devuelva
};
