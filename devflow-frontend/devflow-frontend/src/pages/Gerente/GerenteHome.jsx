import '../../styles/estilos.css';
import { useState, useEffect } from 'react';
import Header from '../../components/GerenteHeader';
import Sidebar from '../../components/GerenteSidebar';
import { obtenerInicioGerente } from '../../services/inicioService';

function GerenteHome() {
  const [usuario, setUsuario] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);


  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const usuarioObj = JSON.parse(storedUser);

      obtenerInicioGerente(usuarioObj.id)
        .then(data => {
          console.log("Inicio gerente recibido:", data);
          setUsuario(data.usuario);         
          setEstadisticas(data.estadisticas);
        })
        .catch(err => console.error("Error al traer estadísticas del gerente:", err));
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
            <div className='card pink'>Proyectos en revisión: {estadisticas?.CantProyectosEnRevision ?? 0}</div>
            <div className='card green'>Proyectos aprobados: {estadisticas?.CantProyectosAprobados ?? 0}</div>
            <div className='card red'>Proyectos rechazados: {estadisticas?.CantProyectosRechazados ?? 0}</div>
            <div className='card blue'>Proyectos en curso: {estadisticas?.CantProyectosEnProceso ?? 0}</div>
            <div className='card purple'>Proyectos completados: {estadisticas?.CantProyectosFinalizados ?? 0}</div>
            <div className='card gray'>Proyectos cancelados: {estadisticas?.CantProyectosCancelados ?? 0}</div>
            <div className='card orange'>Proyectos en pausa: {estadisticas?.CantProyectosEnPausa ?? 0}</div>
          </section>
        </main>
      </div>
    </>
  );
}

export default GerenteHome;
