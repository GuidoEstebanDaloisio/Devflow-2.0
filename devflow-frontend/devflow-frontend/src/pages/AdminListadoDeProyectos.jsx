import { useState, useEffect } from "react";
import Header from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { obtenerProyectosAdmin } from "../services/proyectoService";
import styles from '../styles/botones.module.css';
import "../styles/estilos.css";

function AdminListadoDeProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState("");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      obtenerProyectosAdmin(filtro, estado)
        .then(setProyectos)
        .catch((err) => console.error("Error al obtener proyectos:", err));
    }
  }, [usuario, filtro, estado]);

  const estados = [
    { value: "", label: "Todos los estados" },
    { value: "ESPERANDO_REVISION", label: "Esperando revisión" },
    { value: "APROBADO", label: "Aprobado" },
    { value: "RECHAZADO", label: "Rechazado" },
    { value: "EN_PROGRESO", label: "En progreso" },
    { value: "EN_PAUSA", label: "En pausa" },
    { value: "CANCELADO", label: "Cancelado" },
    { value: "COMPLETADO", label: "Completado" },
  ];

  return (
    <>
      <Header/>
      <div className="main-container">
        <AdminSidebar />
        <main className="content">
          <h2>Proyectos</h2>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="filter-form"
            style={{ marginBottom: "1rem" }}
          >
            <input
              type="text"
              placeholder="Buscar por título..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              {estados.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => {}}>
              Buscar
            </button>
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
                {proyectos.length > 0 ? (
                  proyectos.map((proyecto) => (
                    <tr key={proyecto.id}>
                      <td>{proyecto.id}</td>
                      <td>{proyecto.titulo}</td>
                      <td>{proyecto.estadoAvance}</td>
                      <td>
                        {proyecto.fechaInicio
                          ? new Date(proyecto.fechaInicio).toLocaleDateString()
                          : "--"}
                      </td>
                      <td>
                        {proyecto.fechaFinalizacion
                          ? new Date(proyecto.fechaFinalizacion).toLocaleDateString()
                          : "--"}
                      </td>
                      <td>{`$ ${proyecto.presupuesto?.toFixed(2)}`}</td>
                      <td>{proyecto.medioEncargo}</td>
                      <td className="actions">
                        <button
                          className={`${styles.btn} ${styles['btn-ver']}`}
                          onClick={() =>
                            (window.location.href = `/admin/proyectos/detalles/${proyecto.id}`)
                          }
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>No se encontraron proyectos.</td>
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

export default AdminListadoDeProyectos;
