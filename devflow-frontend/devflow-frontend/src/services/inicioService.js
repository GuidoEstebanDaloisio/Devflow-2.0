import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/inicio`;


export const obtenerInicioCliente = async (idUsuario) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/cliente/${idUsuario}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const obtenerInicioGerente = async (idUsuario) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/gerente/${idUsuario}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const obtenerInicioAdmin = async (idUsuario) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/admin/${idUsuario}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};