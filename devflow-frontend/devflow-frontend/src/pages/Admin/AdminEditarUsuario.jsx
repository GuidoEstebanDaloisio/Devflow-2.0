import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/AdminHeader';
import Sidebar from '../../components/AdminSidebar';
import '../../styles/estilos.css';
import stylesBotones from '../../styles/botones.module.css';
import estilosEditarUsuario from '../../styles/formulario.module.css';
import { obtenerDetalleUsuario, actualizarUsuario } from '../../services/usuarioService';

function AdminEditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    rol: '',
    contrasenia: '',
  });

  const [loading, setLoading] = useState(true);
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerDetalleUsuario(id)
      .then(data => {
        setForm({
          nombre: data.nombre || '',
          email: data.email || '',
          telefono: data.telefono || '',
          rol: data.rol || '',
          contrasenia: '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar usuario:', err);
        setError('No se pudo cargar el usuario');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarUsuario(id, form);
      navigate('/admin/usuarios');
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      setError('No se pudo actualizar el usuario');
    }
  };

  if (loading) return <p style={{ padding: '30px' }}>Cargando...</p>;

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <h2 className="form-title">Editar Usuario</h2>

          <form className={estilosEditarUsuario['formulario-general']} onSubmit={handleSubmit}>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />

            {mostrarContrasenia && (
              <>
                <label htmlFor="contrasenia">Nueva Contraseña:</label>
                <input
                  type="password"
                  id="contrasenia"
                  name="contrasenia"
                  value={form.contrasenia}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="number"
              id="telefono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
            />

            <label htmlFor="rol">Rol:</label>
            <select
              id="rol"
              name="rol"
              value={form.rol}
              onChange={handleChange}
              required
            >
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="GERENTE">Gerente</option>
              <option value="CLIENTE">Cliente</option>
            </select>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="button"
              className={`${stylesBotones.btn} ${stylesBotones['btn-generico']} ${estilosEditarUsuario['btn-cambiar-contrasenia']}`}
              onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
            >
              {mostrarContrasenia ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
            </button>

            <div className={estilosEditarUsuario['botones-container']}>
              <button type="submit" className={`${stylesBotones.btn} ${stylesBotones['btn-generico']}`}>
                Guardar
              </button>

              <button
                type="button"
                className={`${stylesBotones.btn} ${stylesBotones['btn-generico']} cancel-button`}
                onClick={() => navigate('/admin/usuarios')}
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

export default AdminEditarUsuario;
