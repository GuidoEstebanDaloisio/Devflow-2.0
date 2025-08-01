import axios from 'axios';


export const obtenerClientesGerente = async (filtro) => {
  const token = localStorage.getItem('token');

  const response = await axios.get('http://localhost:8080/api/gerente/clientes', {
    params: { filtro },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


export const obtenerUsuariosAdmin = async (filtro, rol) => {
  const token = localStorage.getItem('token');

  const response = await axios.get('http://localhost:8080/api/admin/usuarios', {
    params: { filtro, rol },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
