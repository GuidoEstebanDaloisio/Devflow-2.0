import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/GerenteHeader';
import Sidebar from '../../components/GerenteSidebar';
import { 
  obtenerDetalleProyectoGerente, 
  actualizarProyectoComoGerente 
} from '../../services/proyectoService';

import '../../styles/estilos.css';
import estilosFormulario from '../../styles/formulario.module.css';
import stylesBotones from '../../styles/botones.module.css';

function GerenteEditarProyecto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    medioEncargo: '',
    presupuesto: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    obtenerDetalleProyectoGerente(id)
      .then(data => {
        const proyecto = data.proyecto;
        setForm({
          titulo: proyecto.titulo || '',
          descripcion: proyecto.descripcion || '',
          medioEncargo: proyecto.medioEncargo || '',
          presupuesto: proyecto.presupuesto || ''
        });
      })
      .catch(err => {
        console.error('Error al cargar proyecto:', err);
        setError('No se pudo cargar el proyecto');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarProyectoComoGerente(id, form);
      navigate('/gerente/proyectos');
    } catch (err) {
      console.error('Error al actualizar proyecto:', err);
      setError('No se pudo actualizar el proyecto');
    }
  };

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <h2 className="form-title" style={{ textAlign: 'center' }}>Editar Proyecto</h2>

          <form className={estilosFormulario['formulario-general']} onSubmit={handleSubmit}>
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
              required
              step="0.1"
            />

            {error && (
              <div className="error-message">{error}</div>
            )}

            <div className={estilosFormulario['botones-container']}>
              <button type="submit" className={`${stylesBotones.btn} ${stylesBotones['btn-generico']}`}>
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

export default GerenteEditarProyecto;
