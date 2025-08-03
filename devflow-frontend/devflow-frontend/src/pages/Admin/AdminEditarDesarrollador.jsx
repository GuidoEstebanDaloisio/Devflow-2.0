import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/AdminHeader';
import Sidebar from '../../components/AdminSidebar';
import '../../styles/estilos.css';
import stylesBotones from '../../styles/botones.module.css';
import estilosFormulario from '../../styles/formulario.module.css';
import { obtenerDetalleDesarrollador, actualizarDesarrollador } from '../../services/desarrolladorService';

function AdminEditarDesarrollador() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    habilidades: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerDetalleDesarrollador(id)
      .then(data => {
        setForm({
          nombre: data.nombre || '',
          habilidades: data.habilidades || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar desarrollador:', err);
        setError('No se pudo cargar el desarrollador');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await actualizarDesarrollador(id, form);
      navigate('/admin/desarrolladores');
    } catch (err) {
      console.error('Error al actualizar desarrollador:', err);
      const msg = err.response?.data || 'No se pudo actualizar el desarrollador';
      setError(msg);
    }
  };

  if (loading) return <p style={{ padding: '30px' }}>Cargando...</p>;

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <h2 className="form-title">Editar Desarrollador</h2>

          <form
            className={estilosFormulario['formulario-general']}
            onSubmit={handleSubmit}
          >
            <label htmlFor="nombre" className="form-label">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="form-input"
            />

            <label htmlFor="habilidades" className="form-label">Habilidades:</label>
            <input
              type="text"
              id="habilidades"
              name="habilidades"
              value={form.habilidades}
              onChange={handleChange}
              required
              className="form-input"
            />

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
                onClick={() => navigate('/admin/desarrolladores')}
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

export default AdminEditarDesarrollador;
