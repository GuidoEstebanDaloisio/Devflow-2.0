import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const obtenerClientesGerente = async (filtro) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/gerente/clientes`, {
    params: { filtro },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const obtenerUsuariosAdmin = async (filtro, rol) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/admin/usuarios`, {
    params: { filtro, rol },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const obtenerDetalleCliente = async (idCliente) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/gerente/clientes/${idCliente}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; 
};

export const obtenerDetalleUsuario = async (idUsuario) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/admin/usuarios/${idUsuario}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; 
};

export const actualizarUsuario = async (idUsuario, datosActualizados) => {
  const token = localStorage.getItem('token');

  const response = await axios.put(`${API_URL}/admin/usuarios/editar/${idUsuario}`, datosActualizados, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};
