import { useState, useEffect } from 'react';
import Header from '../components/ClienteHeader';
import Sidebar from '../components/ClienteSidebar';
import { obtenerProyectosCliente } from '../services/proyectoService';
import styles from '../styles/botones.module.css';
import '../styles/estilos.css';

function ClienteListadoDeProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [estado, setEstado] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const usuarioObj = JSON.parse(storedUser);
      setUsuario(usuarioObj);
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      obtenerProyectosCliente(filtro, estado)
        .then(setProyectos)
        .catch(err => console.error('Error al obtener proyectos:', err));
    }
  }, [usuario, filtro, estado]);

  return (
    <>
      <Header/>
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <h2>Mis Proyectos</h2>

          <form onSubmit={e => e.preventDefault()} className="filter-form">
            <input
              type="text"
              placeholder="Buscar por título..."
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
            <select value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="ESPERANDO_REVISION">Esperando revisión</option>
              <option value="APROBADO">Aprobado</option>
              <option value="RECHAZADO">Rechazado</option>
              <option value="EN_PROGRESO">En progreso</option>
              <option value="EN_PAUSA">En pausa</option>
              <option value="CANCELADO">Cancelado</option>
              <option value="COMPLETADO">Completado</option>
            </select>
            <button type="button" onClick={() => setFiltro(filtro)}>Buscar</button>
          </form>

          <div className="user-card">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Estado de avance</th>
                  <th>Fecha de inicio</th>
                  <th>Fecha de finalización</th>
                  <th>Presupuesto</th>
                  <th>Medio de encargo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {proyectos.map(proyecto => (
                  <tr key={proyecto.id}>
                    <td>{proyecto.id}</td>
                    <td>{proyecto.titulo}</td>
                    <td>{proyecto.estadoAvance}</td>
                    <td>{proyecto.fechaInicio ? new Date(proyecto.fechaInicio).toLocaleDateString() : '--'}</td>
                    <td>{proyecto.fechaFinalizacion ? new Date(proyecto.fechaFinalizacion).toLocaleDateString() : '--'}</td>
                    <td>{`$ ${proyecto.presupuesto?.toFixed(2)}`}</td>
                    <td>{proyecto.medioEncargo}</td>
                    <td>
                      <button
                        className={`${styles.btn} ${styles['btn-ver']}`}
                        onClick={() =>
                          (window.location.href = `/cliente/proyectos/detalles/${proyecto.id}`)
                        }
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
                {proyectos.length === 0 && (
                  <tr>
                    <td colSpan="8">No se encontraron proyectos.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}

export default ClienteListadoDeProyectos;
