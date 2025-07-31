import '../styles/estilos.css';
import { Link } from 'react-router-dom';

function AdminSidebar() {
  return (
        <nav className='sidebar'>
          <ul>
            <li>🟣 <Link to="/admin">Inicio</Link></li>
            <li>🟣 <Link to="/admin/proyectos">Proyectos</Link></li>
            <li>🟣 <Link to="/admin/usuarios">Usuarios</Link></li>
            <li>🟣 <Link to="/admin/desarrolladores">Desarrolladores</Link></li>
          </ul>
        </nav>
  );
}

export default AdminSidebar;
