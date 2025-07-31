import axios from 'axios';

const API_URL = 'http://localhost:8080/api/proyectos';


export const obtenerProyectosCliente = async (filtro, estado) => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const response = await axios.get(`${API_URL}/cliente`, {
    params: {
      usuarioId: usuario.id,
      filtro,
      estado
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const obtenerProyectosGerente = async (filtro, estado) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/gerente`, {
    params: {
      filtro,
      estado,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const obtenerProyectosAdmin = async (filtro, estado) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/admin`, {
    params: {
      filtro,
      estado,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};