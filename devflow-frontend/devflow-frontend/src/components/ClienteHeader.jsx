import { useState, useEffect } from "react";
import avatarImg from '../assets/usuario-cliente.png';
import { Link } from "react-router-dom";
import '../styles/estilos.css';

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const toggleDropdown = () => setMenuAbierto(!menuAbierto);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  return (    
    <header className='header'>
      <h2 className='logo'>DevFlow</h2>
      <div className='user-info'>
        <div className='user-dropdown'>
          <div className='user-avatar' onClick={toggleDropdown}>
            <img src={avatarImg} alt="Avatar" className='avatar-img' />
            <span>{usuario?.nombre || 'Nombre'}</span>
            <span className='arrow'>▼</span>
          </div>
          {menuAbierto && (
            <div className='dropdown-menu'>
              <Link to="/cliente">Perfil</Link>
              <Link to="/login">Cerrar sesión</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
