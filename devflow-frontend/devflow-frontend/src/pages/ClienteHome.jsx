import '../styles/estilos.css';
import { useState, useEffect } from 'react';
import Header from '../components/ClienteHeader';
import Sidebar from '../components/ClienteSidebar';
import { obtenerInicioCliente } from '../services/inicioService';

function ClienteHome() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);

  const toggleDropdown = () => setMenuAbierto(!menuAbierto);

useEffect(() => {
  const storedUser = localStorage.getItem('usuario');
  if (storedUser) {
    const usuarioObj = JSON.parse(storedUser);
    setUsuario(usuarioObj);

    obtenerInicioCliente(usuarioObj.id)
      .then(data => {
        console.log("Inicio cliente recibido:", data);
        setEstadisticas(data.estadisticas);
        setUsuario(data.usuario); // importante: sobreescribimos con los datos completos si querés precisión
      })
      .catch(err => console.error("Error al traer estadísticas:", err));
  }
}, []);

  return (
    <>
      <Header/>
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <section className="user-card">
            <p><strong>Nombre:</strong> {usuario?.nombre}</p>
            <p><strong>Email:</strong> {usuario?.email}</p>
            <p><strong>Teléfono:</strong> {usuario?.telefono}</p>
            <p><strong>Rol:</strong> {usuario?.rol}</p>
          </section>

          <section className="summary-cards">
            <div className="card pink">Proyectos en revisión: {estadisticas?.CantProyectosEnRevision ?? 0}</div>
            <div className="card green">Proyectos aprobados: {estadisticas?.CantProyectosAprobados ?? 0}</div>
            <div className="card red">Proyectos rechazados: {estadisticas?.CantProyectosRechazados ?? 0}</div>
            <div className="card blue">Proyectos en curso: {estadisticas?.CantProyectosEnProceso ?? 0}</div>
            <div className="card purple">Proyectos completados: {estadisticas?.CantProyectosFinalizados ?? 0}</div>
            <div className="card gray">Proyectos cancelados: {estadisticas?.CantProyectosCancelados ?? 0}</div>
            <div className="card orange">Proyectos en pausa: {estadisticas?.CantProyectosEnPausa ?? 0}</div>
          </section>
        </main>
      </div>
    </>
  );
}

export default ClienteHome;
