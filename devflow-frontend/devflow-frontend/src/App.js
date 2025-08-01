import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminHome from './pages/AdminHome';
import AdminListadoDeProyectos from './pages/AdminListadoDeProyectos';
import AdminListadoDeUsuarios from './pages/AdminListadoDeUsuarios';
import AdminListadoDeDesarrolladores from './pages/AdminListadoDeDesarrolladores';
import GerenteHome from './pages/GerenteHome';
import GerenteListadoDeProyectos from './pages/GerenteListadoDeProyectos';
import GerenteListadoDeClientes from './pages/GerenteListadoDeClientes';
import ClienteHome from './pages/ClienteHome';
import ClienteListadoDeProyectos from './pages/ClienteListadoDeProyectos';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
 return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />

        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/proyectos" element={<AdminListadoDeProyectos />} />
        <Route path="/admin/usuarios" element={<AdminListadoDeUsuarios />} />
        <Route path="/admin/desarrolladores" element={<AdminListadoDeDesarrolladores />} />        

        <Route path="/gerente" element={<GerenteHome />} />
        <Route path="/gerente/proyectos" element={<GerenteListadoDeProyectos />} />
        <Route path="/gerente/clientes" element={<GerenteListadoDeClientes />} />

        <Route path="/cliente" element={<ClienteHome />} />
        <Route path="/cliente/proyectos" element={<ClienteListadoDeProyectos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
