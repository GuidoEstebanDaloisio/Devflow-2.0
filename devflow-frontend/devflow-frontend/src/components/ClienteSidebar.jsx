import '../styles/estilos.css';
import { Link } from 'react-router-dom';

function ClienteSidebar() {
  return (
        <nav className='sidebar'>
          <ul>
            <li>🟣 <Link to="/cliente">Inicio</Link></li>
            <li>🟣 <Link to="/cliente/proyectos">Mis Proyectos</Link></li>
          </ul>
        </nav>
  );
}

export default ClienteSidebar;
