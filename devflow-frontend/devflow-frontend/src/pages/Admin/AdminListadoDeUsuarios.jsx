import { useEffect, useState } from 'react';
import Header from '../../components/AdminHeader';
import Sidebar from '../../components/AdminSidebar';
import {
  obtenerUsuariosAdmin,
  eliminarUsuario
} from '../../services/usuarioService';
import '../../styles/estilos.css';
import styles from '../../styles/botones.module.css';

function AdminListadoDeUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [rol, setRol] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      cargarUsuarios();
    }
  }, [usuario, filtro, rol]);

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuariosAdmin(filtro, rol);
      setUsuarios(data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  };

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (!confirmacion) return;

    try {
      await eliminarUsuario(id);
      await cargarUsuarios();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      alert('No se pudo eliminar el usuario.');
    }
  };

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <h2>Usuarios</h2>

          <form onSubmit={(e) => e.preventDefault()} className="filter-form">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="">Todos los roles</option>
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="GERENTE">Gerente</option>
              <option value="CLIENTE">Cliente</option>
            </select>
            <button type="submit">Buscar</button>
          </form>

          <div className="user-card">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr><td colSpan="6">No se encontraron usuarios.</td></tr>
                ) : (
                  usuarios.map((usu) => (
                    <tr key={usu.id}>
                      <td>{usu.id}</td>
                      <td>{usu.nombre}</td>
                      <td>{usu.email}</td>
                      <td>{usu.telefono}</td>
                      <td>{usu.rol}</td>
                      <td className="actions">
                        <button
                          className={`${styles.btn} ${styles['btn-ver']}`}
                          onClick={() => window.location.href = `/admin/usuarios/detalles/${usu.id}`}
                        >
                          Ver
                        </button>
                        <button
                          className={`${styles.btn} ${styles['btn-editar']}`}
                          onClick={() => window.location.href = `/admin/usuarios/editar/${usu.id}`}
                        >
                          Editar
                        </button>
                        <button
                          className={`${styles.btn} ${styles['btn-eliminar']}`}
                          onClick={() => handleEliminar(usu.id)}
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
            <a href="/admin/usuarios/nuevo">
              <button>+ Crear nuevo usuario</button>
            </a>
          </div>
        </main>
      </div>
    </>
  );
}

export default AdminListadoDeUsuarios;
