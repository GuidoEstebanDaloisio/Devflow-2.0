import axios from 'axios';

//--LISTADOS---------------------------------------------------------------------
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

//--FUNCIONES--------------------------------------------------------------------
export const asignarDesarrollador = async (proyectoId, desarrolladorId) => {
  const token = localStorage.getItem('token');

  await axios.post(`http://localhost:8080/api/admin/asignar`, {
    proyectoId,
    desarrolladorId
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const desasignarDesarrollador = async (proyectoId, desarrolladorId) => {
  const token = localStorage.getItem('token');

  await axios.post(`http://localhost:8080/api/admin/desasignar`, {
    proyectoId,
    desarrolladorId
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};