import axios from 'axios';
const API_URL = 'http://localhost:8080/api';

export const login = async (nombreUsuario, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    nombreUsuario,
    password,
  });
  return response.data; 
};
