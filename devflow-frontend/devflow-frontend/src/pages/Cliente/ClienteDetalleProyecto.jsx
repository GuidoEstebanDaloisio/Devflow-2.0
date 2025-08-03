import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ClienteHeader';
import Sidebar from '../../components/ClienteSidebar';
import { obtenerDetalleProyectoCliente } from '../../services/proyectoService';
import '../../styles/estilos.css';
import styles from '../../styles/botones.module.css';

function ClienteDetalleProyecto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState(null);
  const [desarrolladores, setDesarrolladores] = useState([]);

  useEffect(() => {
    obtenerDetalleProyectoCliente(id)
      .then(data => {
        setProyecto(data.proyecto);
        setDesarrolladores(data.desarrolladoresAsignados || []);
      })
      .catch(error => console.error('Error al obtener el detalle del proyecto:', error));
  }, [id]);

  if (!proyecto) return <p>Cargando...</p>;

  const formatoFecha = fecha =>
    fecha ? new Date(fecha).toLocaleDateString() : '--';

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
          </section>

          <div className={`${styles.btn} ${styles['btn-generico']}`}>
            <button type="button" onClick={() => navigate('/cliente/proyectos')}>
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
                    </tr>
                  </thead>
                  <tbody>
                    {desarrolladores.map(dev => (
                      <tr key={dev.id}>
                        <td>{dev.id}</td>
                        <td>{dev.nombre}</td>
                        <td>{dev.habilidades}</td>
                      </tr>
                    ))}
                    {desarrolladores.length === 0 && (
                      <tr>
                        <td colSpan="3">No hay desarrolladores asignados.</td>
                      </tr>
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

export default ClienteDetalleProyecto;
