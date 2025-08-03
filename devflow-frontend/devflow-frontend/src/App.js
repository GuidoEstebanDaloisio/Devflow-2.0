import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminHome from './pages/Admin/AdminHome';

import AdminListadoDeProyectos from './pages/Admin/AdminListadoDeProyectos';
import AdminDetalleProyecto from './pages/Admin/AdminDetalleProyecto';
import AdminListadoDeUsuarios from './pages/Admin/AdminListadoDeUsuarios';
import AdminNuevoUsuario from './pages/Admin/AdminNuevoUsuario';
import AdminDetalleUsuario from './pages/Admin/AdminDetalleUsuario';
import AdminEditarUsuario from './pages/Admin/AdminEditarUsuario';
import AdminListadoDeDesarrolladores from './pages/Admin/AdminListadoDeDesarrolladores';
import AdminNuevoDesarrollador from './pages/Admin/AdminNuevoDesarrollador';
import AdminEditarDesarrollador from './pages/Admin/AdminEditarDesarrollador';


import GerenteHome from './pages/Gerente/GerenteHome';
import GerenteListadoDeProyectos from './pages/Gerente/GerenteListadoDeProyectos';
import GerenteNuevoProyecto from './pages/Gerente/GerenteNuevoProyecto';
import GerenteDetalleProyecto from './pages/Gerente/GerenteDetalleProyecto';
import GerenteEditarProyecto from './pages/Gerente/GerenteEditarProyecto';
import GerenteListadoDeClientes from './pages/Gerente/GerenteListadoDeClientes';
import GerenteDetalleCliente from './pages/Gerente/GerenteDetalleCliente';

import ClienteHome from './pages/Cliente/ClienteHome';
import ClienteListadoDeProyectos from './pages/Cliente/ClienteListadoDeProyecto';
import ClienteDetalleProyecto from './pages/Cliente/ClienteDetalleProyecto';

import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/proyectos" element={<AdminListadoDeProyectos />} />
        <Route path="/admin/proyectos/detalles/:id" element={<AdminDetalleProyecto />} />

        <Route path="/admin/usuarios" element={<AdminListadoDeUsuarios />} />
        <Route path="/admin/usuarios/nuevo" element={<AdminNuevoUsuario />} />
        <Route path="/admin/usuarios/detalles/:id" element={<AdminDetalleUsuario />} />
        <Route path="/admin/usuarios/editar/:id" element={<AdminEditarUsuario />} />

        <Route path="/admin/desarrolladores" element={<AdminListadoDeDesarrolladores />} />
        <Route path="/admin/desarrolladores/nuevo" element={<AdminNuevoDesarrollador />} />
        <Route path="/admin/desarrolladores/editar/:id" element={<AdminEditarDesarrollador />} />


        <Route path="/gerente" element={<GerenteHome />} />
        <Route path="/gerente/proyectos" element={<GerenteListadoDeProyectos />} />
        <Route path="/gerente/proyectos/nuevo" element={<GerenteNuevoProyecto />} />
        <Route path="/gerente/proyectos/detalles/:id" element={<GerenteDetalleProyecto />} />
        <Route path="/gerente/proyectos/editar/:id" element={<GerenteEditarProyecto />} />        

        <Route path="/gerente/clientes" element={<GerenteListadoDeClientes />} />
        <Route path="/gerente/clientes/detalles/:id" element={<GerenteDetalleCliente />} />


        <Route path="/cliente" element={<ClienteHome />} />
        <Route path="/cliente/proyectos" element={<ClienteListadoDeProyectos />} />
        <Route path="/cliente/proyectos/detalles/:id" element={<ClienteDetalleProyecto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
