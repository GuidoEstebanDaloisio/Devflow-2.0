import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/GerenteHeader';
import Sidebar from '../../components/GerenteSidebar';
import { obtenerDetalleProyectoGerente } from '../../services/proyectoService';
import '../../styles/estilos.css';
import styles from '../../styles/botones.module.css';
import EstadoProyectoBotones from '../../components/EstadoProyectoBotones'; 

function GerenteDetalleProyecto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proyecto, setProyecto] = useState(null);
    const [asignados, setAsignados] = useState([]);
    const [permisos, setPermisos] = useState(null);

    useEffect(() => {
        cargarDetalle();
    }, [id]);

    const cargarDetalle = () => {
        obtenerDetalleProyectoGerente(id)
            .then(data => {
                setProyecto(data.proyecto);
                setAsignados(data.desarrolladoresAsignados || []);
                setPermisos(data.permisosCambioEstado);
            })
            .catch(error => console.error('Error al obtener detalle del proyecto:', error));
    };

    const formatoFecha = (fecha) => fecha ? new Date(fecha).toLocaleDateString() : '--';

    const handleCambioEstado = async (nuevoEstado) => {
        // TODO: realizar POST al backend para actualizar estado
        console.log(`Enviar nuevo estado: ${nuevoEstado}`);
    };

    const guardarFechaInicio = async (fecha) => {
        // TODO: realizar POST al backend para guardar fecha de inicio
        console.log(`Guardar fecha inicio: ${fecha}`);
    };

    const guardarFechaFinal = async (fecha) => {
        // TODO: realizar POST al backend para guardar fecha final
        console.log(`Guardar fecha finalización: ${fecha}`);
    };

    if (!proyecto || !permisos) return <p>Cargando...</p>; //Espera permisos también

    return (
        <>
            <Header />
            <div className="main-container">
                <Sidebar />
                <main className="content">
                    <section className="user-card">
                        <h2>Estado del Proyecto</h2>

                        <EstadoProyectoBotones
                            proyecto={proyecto}
                            estadoActual={proyecto.estadoAvance}
                            permisosCambioEstado={permisos} 
                        />

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

                    <div className={styles['btn-generico']}>
                        <button onClick={() => navigate(`/gerente/proyectos/editar/${proyecto.id}`)}>Editar Proyecto</button>
                        <> </>
                        <button onClick={() => navigate('/gerente/proyectos')}>Volver a Proyectos</button>
                    </div>

                    {(proyecto.estadoAvance === 'EN_PROGRESO' || proyecto.estadoAvance === 'EN_PAUSA') && (
                        <div className="user-card">
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
                                    {asignados.length > 0 ? (
                                        asignados.map(dev => (
                                            <tr key={dev.id}>
                                                <td>{dev.id}</td>
                                                <td>{dev.nombre}</td>
                                                <td>{dev.habilidades}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="3">No hay desarrolladores asignados.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

export default GerenteDetalleProyecto;
