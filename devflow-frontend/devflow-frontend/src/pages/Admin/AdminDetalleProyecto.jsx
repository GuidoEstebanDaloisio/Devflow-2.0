import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/AdminHeader';
import Sidebar from '../../components/AdminSidebar';
import {obtenerDetalleProyectoAdmin} from '../../services/proyectoService';
import {asignarDesarrollador, desasignarDesarrollador} from '../../services/desarrolladorService';
import '../../styles/estilos.css';
import styles from '../../styles/botones.module.css';

function AdminDetalleProyecto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState(null);
  const [asignados, setAsignados] = useState([]);
  const [disponibles, setDisponibles] = useState([]);

  useEffect(() => {
    cargarDetalle();
  }, [id]);

  const cargarDetalle = () => {
    obtenerDetalleProyectoAdmin(id)
      .then(data => {
        setProyecto(data.proyecto);
        setAsignados(data.desarrolladoresAsignados || []);
        setDisponibles(data.desarrolladoresDisponibles || []);
      })
      .catch(error => console.error('Error al obtener el detalle del proyecto:', error));
  };

  const handleAsignar = async (devId) => {
    await asignarDesarrollador(proyecto.id, devId);
    cargarDetalle();
  };

  const handleDesasignar = async (devId) => {
    await desasignarDesarrollador(proyecto.id, devId);
    cargarDetalle();
  };

  if (!proyecto) return <p>Cargando...</p>;

  const formatoFecha = fecha => fecha ? new Date(fecha).toLocaleDateString() : '--';

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <section className="user-card">
            <p><strong>ID:</strong> {proyecto.id}</p>
            <p><strong>Título:</strong> {proyecto.titulo}</p>
            <p><strong>Descripción:</strong> {proyecto.descripcion}</p>
            <p><strong>Medio de Encargo:</strong> {proyecto.medioEncargo}</p>
            <p><strong>Presupuesto:</strong> ${proyecto.presupuesto?.toFixed(2)}</p>
            <p><strong>Estado de Avance:</strong> {proyecto.estadoAvance}</p>
            <p><strong>Fecha de Inicio:</strong> {formatoFecha(proyecto.fechaInicio)}</p>
            <p><strong>Fecha de Finalización:</strong> {formatoFecha(proyecto.fechaFinalizacion)}</p>
            <p><strong>Cliente:</strong> {proyecto.usuario?.nombre}</p>
          </section>

          <div className={`${styles.btn} ${styles['btn-generico']}`}>
            <button type="button" onClick={() => navigate('/admin/proyectos')}>
              Volver a Proyectos
            </button>
          </div>

          {(proyecto.estadoAvance === 'EN_PROGRESO' || proyecto.estadoAvance === 'EN_PAUSA') && (
            <div className="asignacion-container">
              <div className="user-card tabla-asignados">
                <h2>Desarrolladores Asignados</h2>
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Habilidades</th>
                      <th>Desasignar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asignados.map(dev => (
                      <tr key={dev.id}>
                        <td>{dev.id}</td>
                        <td>{dev.nombre}</td>
                        <td>{dev.habilidades}</td>
                        <td>
                          <button
                            className={`${styles.btn} ${styles['btn-desasignar']}`}
                            onClick={() => handleDesasignar(dev.id)}
                          >
                            Desasignar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {asignados.length === 0 && (
                      <tr><td colSpan="4">No hay desarrolladores asignados.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="user-card tabla-disponibles">
                <h2>Desarrolladores Disponibles</h2>
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Habilidades</th>
                      <th>Asignar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disponibles.map(dev => (
                      <tr key={dev.id}>
                        <td>{dev.id}</td>
                        <td>{dev.nombre}</td>
                        <td>{dev.habilidades}</td>
                        <td>
                          <button
                            className={`${styles.btn} ${styles['btn-asignar']}`}
                            onClick={() => handleAsignar(dev.id)}
                          >
                            Asignar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {disponibles.length === 0 && (
                      <tr><td colSpan="4">No hay desarrolladores disponibles.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default AdminDetalleProyecto;
