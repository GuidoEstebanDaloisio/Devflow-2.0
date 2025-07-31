import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export const login = async (nombreUsuario, password) => {
  const response = await axios.post(`${API_BASE}/login`, {
    nombreUsuario,
    password,
  });
  return response.data; // ← ahora incluye el token y el usuario
};

export const obtenerUsuarioActual = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE}/usuario-actual`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const testGet = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE}/test`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
