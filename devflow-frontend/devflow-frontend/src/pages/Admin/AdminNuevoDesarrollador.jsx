import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/AdminHeader';
import Sidebar from '../../components/AdminSidebar';
import '../../styles/estilos.css';
import estilosFormulario from '../../styles/formulario.module.css';
import stylesBotones from '../../styles/botones.module.css';
import { crearDesarrollador } from '../../services/desarrolladorService'; 

function AdminNuevoDesarrollador() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    habilidades: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearDesarrollador(form);
      navigate('/admin/desarrolladores');
    } catch (err) {
      console.error('Error al crear desarrollador:', err);
      setError('No se pudo crear el desarrollador');
    }
  };

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <h2 className="form-title">Nuevo desarrollador</h2>

          <form className={estilosFormulario['formulario-general']} onSubmit={handleSubmit}>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />

            <label htmlFor="habilidades">Habilidades:</label>
            <input
              type="text"
              id="habilidades"
              name="habilidades"
              placeholder="Ej: Java, React, SQL"
              value={form.habilidades}
              onChange={handleChange}
              required
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

export default AdminNuevoDesarrollador;
