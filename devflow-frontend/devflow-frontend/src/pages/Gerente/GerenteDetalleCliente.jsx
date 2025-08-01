import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/GerenteHeader';
import Sidebar from '../../components/GerenteSidebar';
import '../../styles/estilos.css';
import styles from '../../styles/botones.module.css';
import { obtenerDetalleCliente } from '../../services/usuarioService';

function GerenteDetalleCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    obtenerDetalleCliente(id)
      .then(data => {
        setCliente(data.cliente);
        setProyectos(data.proyectosSolicitados || []);
      })
      .catch(error => console.error('Error al obtener el detalle del cliente:', error));
  }, [id]);

  const formatoFecha = fecha =>
    fecha ? new Date(fecha).toLocaleDateString() : '--';

  if (!cliente) return <p>Cargando...</p>;

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <section className="user-card">
            <p><strong>ID:</strong> {cliente.id}</p>
            <p><strong>Nombre:</strong> {cliente.nombre}</p>
            <p><strong>Email:</strong> {cliente.email}</p>
            <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          </section>

          <div className={`${styles.btn} ${styles['btn-generico']}`}>
            <button type="button" onClick={() => navigate('/gerente/clientes')}>
              Volver a Clientes
            </button>
          </div>

          <div className="user-card">
            <h2>Proyectos del Cliente</h2>
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
                    <td>{formatoFecha(proyecto.fechaInicio)}</td>
                    <td>{formatoFecha(proyecto.fechaFinalizacion)}</td>
                    <td>${proyecto.presupuesto?.toFixed(2)}</td>
                    <td>{proyecto.medioEncargo}</td>
                    <td className="actions">
                      <button
                        className={`${styles.btn} ${styles['btn-ver']}`}
                        onClick={() => navigate(`/gerente/proyectos/detalles/${proyecto.id}`)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
                {proyectos.length === 0 && (
                  <tr>
                    <td colSpan="8">Este cliente no tiene proyectos.</td>
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

export default GerenteDetalleCliente;
