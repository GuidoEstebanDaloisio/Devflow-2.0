import { useState, useEffect } from 'react';
import Header from '../components/GerenteHeader';
import Sidebar from '../components/GerenteSidebar';
import { obtenerProyectosGerente } from '../services/proyectoService';
import styles from '../styles/botones.module.css';

import '../styles/estilos.css';

function GerenteListadoDeProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [estado, setEstado] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      obtenerProyectosGerente(filtro, estado)
        .then(setProyectos)
        .catch(err => console.error('Error al obtener proyectos del gerente:', err));
    }
  }, [usuario, filtro, estado]);

  return (
    <>
      <Header/>
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <h2>Listado de Proyectos</h2>

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
            <button type="submit">Buscar</button>
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
                {proyectos.length === 0 ? (
                  <tr>
                    <td colSpan="8">No se encontraron proyectos.</td>
                  </tr>
                ) : (
                  proyectos.map(proyecto => (
                    <tr key={proyecto.id}>
                      <td>{proyecto.id}</td>
                      <td>{proyecto.titulo}</td>
                      <td>{proyecto.estadoAvance}</td>
                      <td>{proyecto.fechaInicio ? new Date(proyecto.fechaInicio).toLocaleDateString() : '--'}</td>
                      <td>{proyecto.fechaFinalizacion ? new Date(proyecto.fechaFinalizacion).toLocaleDateString() : '--'}</td>
                      <td>{`$ ${proyecto.presupuesto?.toFixed(2)}`}</td>
                      <td>{proyecto.medioEncargo}</td>
                      <td className="actions">
                        <button
                          className={`${styles.btn} ${styles['btn-ver']}`}
                          onClick={() => window.location.href = `/gerente/proyectos/detalles/${proyecto.id}`}
                        >
                          Ver
                        </button>
                        <button
                          className={`${styles.btn} ${styles['btn-editar']}`}
                          onClick={() => window.location.href = `/gerente/proyectos/editar/${proyecto.id}`}
                        >
                          Editar
                        </button>
                        <button
                          className={`${styles.btn} ${styles['btn-eliminar']}`}
                          onClick={() => window.location.href = `/gerente/proyectos/eliminar/${proyecto.id}`}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles['btn-generico']} style={{ marginTop: 20 }}>
            <a href="/gerente/proyectos/nuevo">
              <button>+ Solicitar nuevo proyecto</button>
            </a>
          </div>
        </main>
      </div>
    </>
  );
}


export default GerenteListadoDeProyectos;
