import axios from 'axios';

const API_URL = 'http://localhost:8080/api/proyectos';

//--LISTADOS---------------------------------------------------------------------
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



//--DETALLES---------------------------------------------------------------------
export const obtenerDetalleProyecto = async (id) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/cliente/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; 
};

export const obtenerDetalleProyectoAdmin = async (id) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/admin/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; 
};

export const obtenerDetalleProyectoGerente = async (id) => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/gerente/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


//--FUNCIONES--------------------------------------------------------------------

export async function cambiarEstadoProyectoComoGerente(idProyecto, nuevoEstado) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/gerente/${idProyecto}/estado?nuevoEstado=${encodeURIComponent(nuevoEstado)}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorTexto = await response.text();
    throw new Error(`Error ${response.status}: ${errorTexto}`);
  }

  return response.json();
}

export const establecerFechaInicio = async (idProyecto, fechaInicio) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/gerente/${idProyecto}/fecha-inicio?fechaInicio=${fechaInicio}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('No se pudo establecer la fecha de inicio');
  }

  return await response.json(); // { mensaje: "..."}
};

export const establecerFechaFin = async (idProyecto, fechaFin) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/gerente/${idProyecto}/fecha-fin?fechaFin=${fechaFin}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('No se pudo establecer la fecha de fin');
  }

  return await response.json(); // { mensaje: "..." }
};


export const actualizarProyectoComoGerente = async (id, proyectoActualizado) => {
  const token = localStorage.getItem('token');

  const response = await axios.put(`${API_URL}/gerente/${id}`, proyectoActualizado, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data; // si el backend no devuelve data, será undefined, no hay problema
};


export const crearProyecto = async (nuevoProyecto) => {
  const token = localStorage.getItem('token');

  const response = await axios.post(`${API_URL}/gerente/proyecto/nuevo`, nuevoProyecto, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};


export const eliminarProyecto = async (id) => {
  const token = localStorage.getItem('token');

  await axios.delete(`${API_URL}/gerente/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

