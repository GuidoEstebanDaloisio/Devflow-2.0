import { useEffect, useState } from 'react';
import Header from '../../components/GerenteHeader';
import Sidebar from '../../components/GerenteSidebar';
import { obtenerClientesComoGerente } from '../../services/usuarioService';
import '../../styles/estilos.css';
import styles from '../../styles/botones.module.css';

function GerenteListadoDeClientes() {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      obtenerClientesComoGerente(filtro)
        .then(setClientes)
        .catch(err => console.error('Error al obtener clientes:', err));
    }
  }, [usuario, filtro]);

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <h2>Clientes</h2>

          {/* Filtro */}
          <form onSubmit={e => e.preventDefault()} className="filter-form">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 ? (
                  <tr><td colSpan="5">No se encontraron clientes.</td></tr>
                ) : (
                  clientes.map(cliente => (
                    <tr key={cliente.id}>
                      <td>{cliente.id}</td>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.telefono}</td>
                      <td className="actions">
                        <button
                          className={`${styles.btn} ${styles['btn-ver']}`}
                          onClick={() => window.location.href = `/gerente/clientes/detalles/${cliente.id}`}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}

export default GerenteListadoDeClientes;
