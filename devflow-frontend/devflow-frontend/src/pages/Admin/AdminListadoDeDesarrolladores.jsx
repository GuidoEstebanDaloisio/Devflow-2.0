import { useEffect, useState } from 'react';
import Header from '../../components/AdminHeader';
import Sidebar from '../../components/AdminSidebar';
import { eliminarDesarrollador, obtenerDesarrolladoresAdmin } from '../../services/desarrolladorService'; // actualizado
import '../../styles/estilos.css';
import styles from '../../styles/botones.module.css';




function AdminListadoDeDesarrolladores() {
  const [desarrolladores, setDesarrolladores] = useState([]);
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
      cargarDesarrolladores();
    }
  }, [usuario, filtro, estado]);

  const cargarDesarrolladores = async () => {
    try {
      const data = await obtenerDesarrolladoresAdmin(filtro, estado);
      setDesarrolladores(data);
    } catch (err) {
      console.error('Error al obtener desarrolladores:', err);
    }
  };

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este desarrollador?');
    if (!confirmacion) return;

    try {
      await eliminarDesarrollador(id);
      await cargarDesarrolladores();
    } catch (err) {
      console.error('Error al eliminar desarrollador:', err);
      alert('No se pudo eliminar el desarrollador.');
    }
  };

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <h2>Desarrolladores</h2>

          <form onSubmit={(e) => e.preventDefault()} className="filter-form">
            <input
              type="text"
              placeholder="Buscar por nombre o habilidad..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="ASIGNADO">Asignado</option>
            </select>
            <button type="submit">Buscar</button>
          </form>

          <div className="user-card">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Habilidades</th>
                  <th>Disponibilidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {desarrolladores.length === 0 ? (
                  <tr><td colSpan="6">No se encontraron desarrolladores.</td></tr>
                ) : (
                  desarrolladores.map((dev) => (
                    <tr key={dev.id}>
                      <td>{dev.id}</td>
                      <td>{dev.nombre}</td>
                      <td>{dev.habilidades}</td>
                      <td>{dev.estaDisponible ? 'Disponible' : 'Asignado'}</td>
                      <td className="actions">
                        <button
                          className={`${styles.btn} ${styles['btn-editar']}`}
                          onClick={() => window.location.href = `/admin/desarrolladores/editar/${dev.id}`}
                        >
                          Editar
                        </button>
                        <button
                          className={`${styles.btn} ${styles['btn-eliminar']}`}
                          onClick={() => handleEliminar(dev.id)}
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
            <a href="/admin/desarrolladores/nuevo">
              <button>+ Crear nuevo desarrollador</button>
            </a>
          </div>
        </main>
      </div>
    </>
  );
}

export default AdminListadoDeDesarrolladores;