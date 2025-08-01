import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export const login = async (nombreUsuario, password) => {
  const response = await axios.post(`${API_BASE}/login`, {
    nombreUsuario,
    password,
  });
  return response.data; // ← ahora incluye el token y el usuario
};
