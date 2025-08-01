import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/AdminHeader';
import Sidebar from '../../components/AdminSidebar';
import '../../styles/estilos.css';
import styles from '../../styles/botones.module.css';
import { obtenerDetalleUsuario } from '../../services/usuarioService';

function AdminDetalleUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    obtenerDetalleUsuario(id)
      .then(data => setUsuario(data))
      .catch(error => console.error('Error al obtener el detalle del usuario:', error));
  }, [id]);

  if (!usuario) return <p>Cargando...</p>;

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <section className="user-card">
            <p><strong>ID:</strong> {usuario.id}</p>
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Teléfono:</strong> {usuario.telefono}</p>
            <p><strong>Rol:</strong> {usuario.rol}</p>
          </section>

          <div className={`${styles.btn} ${styles['btn-generico']}`}>
            <button
              type="button"
              onClick={() => navigate(`/admin/usuarios/editar/${usuario.id}`)}
            >
              Editar Usuario
            </button>
            <> </>
            <button
              type="button"
              onClick={() => navigate('/admin/usuarios')}
            >
              Volver a Usuarios
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default AdminDetalleUsuario;
