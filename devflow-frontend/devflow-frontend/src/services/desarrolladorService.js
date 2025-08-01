import axios from 'axios';

export const obtenerDesarrolladoresAdmin = async (filtro, estado) => {
  const token = localStorage.getItem('token');

  const response = await axios.get('http://localhost:8080/api/admin/desarrolladores', {
    params: { filtro, estado },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};