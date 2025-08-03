import '../../styles/estilos.css';
import { useState, useEffect } from 'react';
import Header from '../../components/AdminHeader';
import Sidebar from '../../components/AdminSidebar';
import { obtenerInicioAdmin } from '../../services/inicioService';

function AdminHome() {
  const [usuario, setUsuario] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);


  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const usuarioObj = JSON.parse(storedUser);

      obtenerInicioAdmin(usuarioObj.id)
        .then(data => {
          console.log("Inicio admin recibido:", data);
          setUsuario(data.usuario);
          setEstadisticas(data.estadisticas);
        })
        .catch(err => console.error("Error al traer estadísticas:", err));
    }
  }, []);

  return (
    <>
      <Header/>
      <div className='main-container'>
        <Sidebar />
        <main className='content'>
          <section className='user-card'>
            <p><strong>Nombre:</strong> {usuario?.nombre || 'user_name'}</p>
            <p><strong>Email:</strong> {usuario?.email || 'user_email'}</p>
            <p><strong>Teléfono:</strong> {usuario?.telefono || 'user_tel'}</p>
            <p><strong>Rol:</strong> {usuario?.rol || 'user_rol'}</p>
          </section>

          <section className='summary-cards'>
            <div className='card pink'>Proyectos en curso: {estadisticas?.CantProyectosEnProceso ?? 0}</div>
            <div className='card blue'>Proyectos en pausa: {estadisticas?.CantProyectosEnPausa ?? 0}</div>
            <div className='card orange'>Usuarios totales: {estadisticas?.CantUsuarios ?? 0}</div>
            <div className='card purple'>Devs disponibles: {estadisticas?.CantDevDisponibles ?? 0}</div>
          </section>
        </main>
      </div>
    </>
  );
}

export default AdminHome;
