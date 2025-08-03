import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/AdminHeader';
import Sidebar from '../../components/AdminSidebar';
import '../../styles/estilos.css';
import stylesBotones from '../../styles/botones.module.css';
import estilosFormulario from '../../styles/formulario.module.css';
import { crearUsuario } from '../../services/usuarioService';

function AdminNuevoUsuario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    rol: '',
    contrasenia: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearUsuario(form);
      navigate('/admin/usuarios');
    } catch (err) {
      console.error('Error al crear usuario:', err);
      setError('No se pudo crear el usuario');
    }
  };

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <h2 className="form-title">Nuevo Usuario</h2>

          <form
            className={estilosFormulario['formulario-general']}
            onSubmit={handleSubmit}
          >
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />

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
              type="text"
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
              <option value="">Seleccione un rol</option>
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="GERENTE">Gerente</option>
              <option value="CLIENTE">Cliente</option>
            </select>

            <label htmlFor="contrasenia">Contraseña:</label>
            <input
              type="password"
              id="contrasenia"
              name="contrasenia"
              value={form.contrasenia}
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

export default AdminNuevoUsuario;
