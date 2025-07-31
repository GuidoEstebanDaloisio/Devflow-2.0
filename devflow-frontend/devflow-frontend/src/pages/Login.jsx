import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/login.module.css';
import { login } from '../services/usuarioService';

function Login() {
  const [nombre, setNombre] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const respuesta = await login(nombre, contrasenia);
      localStorage.setItem('token', respuesta.token);
      localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));

      switch (respuesta.usuario.rol) {
        case 'ADMINISTRADOR':
          navigate('/admin');
          break;
        case 'GERENTE':
          navigate('/gerente');
          break;
        case 'CLIENTE':
          navigate('/cliente');
          break;
        default:
          setError('Rol desconocido.');
      }
    } catch (err) {
      console.error(err);
      setError('Usuario o contraseña inválidos.');
    }
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-card']}>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={manejarSubmit}>
          <label htmlFor="nombre">Nombre de usuario:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <label htmlFor="contrasenia">Contraseña:</label>
          <input
            type="password"
            id="contrasenia"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            required
          />
          <input type="submit" value="Ingresar" />
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
