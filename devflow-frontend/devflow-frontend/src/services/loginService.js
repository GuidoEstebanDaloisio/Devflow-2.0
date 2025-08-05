import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

export const login = async (nombreUsuario, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    nombreUsuario,
    password,
  });
  return response.data; 
};
