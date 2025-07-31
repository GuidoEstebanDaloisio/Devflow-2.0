import '../styles/estilos.css';
import { Link } from 'react-router-dom';

function GerenteSidebar() {
    return (
        <nav className='sidebar'>
            <ul>
                <li>🟣 <Link to="/gerente">Inicio</Link></li>
                <li>🟣 <Link to="/gerente/clientes">Clientes</Link></li>
                <li>🟣 <Link to="/gerente/proyectos">Proyectos</Link></li>
            </ul>
        </nav>
    );
}

export default GerenteSidebar;
