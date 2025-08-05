import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/admin`;

//--LISTADOS---------------------------------------------------------------------
export const obtenerDesarrolladoresAdmin = async (filtro, estado) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/desarrolladores`, {
    params: { filtro, estado },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};



//--DETALLE---------------------------------------------------------------------
export const obtenerDetalleDesarrollador = async (id) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/desarrolladores/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};



//--FUNCIONES--------------------------------------------------------------------
export const crearDesarrollador = async (nuevoUsuario) => {
  const token = localStorage.getItem('token');

  const response = await axios.post(`${API_URL}/desarrolladores/nuevo`, nuevoUsuario, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const actualizarDesarrollador = async (idDesarrollador, datosActualizados) => {
  const token = localStorage.getItem('token');

  const response = await axios.put(`${API_URL}/desarrolladores/editar/${idDesarrollador}`, datosActualizados,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

export const eliminarDesarrollador = async (id) => {
  const token = localStorage.getItem('token');

  await axios.delete(`${API_URL}/desarrolladores/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const asignarDesarrollador = async (proyectoId, desarrolladorId) => {
  const token = localStorage.getItem('token');

  await axios.post(`${API_URL}/asignar`, {
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

  await axios.post(`${API_URL}/desasignar`, {
    proyectoId,
    desarrolladorId
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


