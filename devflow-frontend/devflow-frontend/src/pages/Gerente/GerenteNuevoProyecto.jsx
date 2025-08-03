import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/GerenteHeader';
import Sidebar from '../../components/GerenteSidebar';
import '../../styles/estilos.css';
import estilosFormulario from '../../styles/formulario.module.css';
import stylesBotones from '../../styles/botones.module.css';
import { crearProyecto } from '../../services/proyectoService';
import { obtenerClientesGerente } from '../../services/usuarioService';

function GerenteNuevoProyecto() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    medioEncargo: '',
    presupuesto: '',
    clienteId: '',
  });

  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const data = await obtenerClientesGerente('');
        setClientes(data);
      } catch (err) {
        console.error('Error al cargar clientes:', err);
        setError('No se pudieron cargar los clientes.');
      }
    };
    cargarClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearProyecto(form);
      navigate('/gerente/proyectos');
    } catch (err) {
      console.error('Error al crear proyecto:', err);
      setError('No se pudo crear el proyecto.');
    }
  };

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <h2 className="form-title">Nuevo Proyecto</h2>

          <form
            className={estilosFormulario['formulario-general']}
            onSubmit={handleSubmit}
          >
            <label htmlFor="titulo">Título:</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
            />

            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              rows="4"
              cols="50"
            />

            <label htmlFor="medioEncargo">Medio de Encargo:</label>
            <input
              type="text"
              id="medioEncargo"
              name="medioEncargo"
              value={form.medioEncargo}
              onChange={handleChange}
              required
            />

            <label htmlFor="presupuesto">Presupuesto:</label>
            <input
              type="number"
              id="presupuesto"
              name="presupuesto"
              value={form.presupuesto}
              onChange={handleChange}
              step="0.01"
              required
            />

            <label htmlFor="clienteId">Cliente:</label>
            <select
              id="clienteId"
              name="clienteId"
              value={form.clienteId}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccionar Cliente --</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className={estilosFormulario['botones-container']}>
              <button
                type="submit"
                className={`${stylesBotones.btn} ${stylesBotones['btn-generico']}`}
              >
                Guardar
              </button>

              <button
                type="button"
                className={`${stylesBotones.btn} ${stylesBotones['btn-generico']} cancel-button`}
                onClick={() => navigate('/gerente/proyectos')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

export default GerenteNuevoProyecto;
