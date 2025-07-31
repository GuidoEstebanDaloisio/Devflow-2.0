package com.example.DevFlow.controller;

import com.example.DevFlow.model.Desarrollador;
import com.example.DevFlow.model.EstadoProyecto;
import com.example.DevFlow.model.Proyecto;
import com.example.DevFlow.model.Usuario;
import com.example.DevFlow.security.JwtUtil;
import com.example.DevFlow.service.DesarrolladorService;
import com.example.DevFlow.service.ProyectoService;
import com.example.DevFlow.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/proyectos")
public class ProyectoController {

    private JwtUtil jwtUtil = new JwtUtil();

    @Autowired
    private ProyectoService proyectoService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private DesarrolladorService desarrolladorService;

    // ---------------- ADMIN ---------------- //
    @GetMapping("/admin")
    public List<Proyecto> obtenerProyectosComoAdmin(
            @RequestParam(required = false) String filtro,
            @RequestParam(required = false) String estado,
            HttpSession session) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (!usuario.esAdministrador()) {
            throw new RuntimeException("No autorizado");
        }

        return proyectoService.obtenerListadoDeProyectos(filtro, estado);
    }

    @GetMapping("/admin/{id}")
    public Proyecto obtenerDetallesProyectoAdmin(@PathVariable Long id, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (!usuario.esAdministrador()) {
            throw new RuntimeException("No autorizado");
        }

        return proyectoService.obtenerProyectoPorId(id);
    }

    // ---------------- CLIENTE ---------------- //
    @GetMapping("/cliente")
    public List<Proyecto> obtenerProyectosCliente(
            @RequestParam(required = false) String filtro,
            @RequestParam(required = false) String estado,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("No se proporcionó el token");
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuario = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        System.out.println("\n\n >>Usuario autenticado: " + usuario.getNombre() + ", rol: " + usuario.getRol() + "\n\n");

        if (usuario == null) {
            throw new RuntimeException("No hay usuario autenticado");
        }

        if (!usuario.esCliente()) {
            throw new RuntimeException("No autorizado");
        }

        return proyectoService.obtenerListadoDeProyectosParaCliente(usuario.getId(), filtro, estado);
    }

    @GetMapping("/cliente/{id}")
    public Proyecto obtenerDetallesProyectoCliente(@PathVariable Long id, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (!usuario.esCliente()) {
            throw new RuntimeException("No autorizado");
        }

        return proyectoService.obtenerProyectoPorId(id);
    }

    // ---------------- GERENTE ---------------- //
    @GetMapping("/gerente")
    public List<Proyecto> obtenerProyectosGerente(
            @RequestParam(required = false) String filtro,
            @RequestParam(required = false) String estado,
            HttpSession session) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (!usuario.esGerente()) {
            throw new RuntimeException("No autorizado");
        }

        return proyectoService.obtenerListadoDeProyectos(filtro, estado);
    }

    @GetMapping("/gerente/{id}")
    public Proyecto obtenerDetallesProyectoGerente(@PathVariable Long id, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (!usuario.esGerente()) {
            throw new RuntimeException("No autorizado");
        }

        return proyectoService.obtenerProyectoPorId(id);
    }

    @PostMapping("/gerente")
    public void crearProyecto(
            @RequestParam String titulo,
            @RequestParam String descripcion,
            @RequestParam String medio_encargo,
            @RequestParam Double presupuesto,
            @RequestParam Long clienteId,
            HttpSession session) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (!usuario.esGerente()) {
            throw new RuntimeException("No autorizado");
        }

        Usuario cliente = usuarioService.obtenerUsuarioPorId(clienteId);
        proyectoService.crearProyecto(titulo, descripcion, medio_encargo, presupuesto, cliente);
    }

    @PutMapping("/gerente/{id}/estado")
    public void cambiarEstadoProyecto(
            @PathVariable Long id,
            @RequestParam EstadoProyecto nuevoEstado,
            HttpSession session) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (!usuario.esGerente()) {
            throw new RuntimeException("No autorizado");
        }

        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        proyectoService.cambiarEstado(proyecto, nuevoEstado);
    }

    @PutMapping("/gerente/{id}/fecha-inicio")
    public void establecerFechaInicio(
            @PathVariable Long id,
            @RequestParam("fechaInicio") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaInicio,
            HttpSession session) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (!usuario.esGerente()) {
            throw new RuntimeException("No autorizado");
        }

        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        proyectoService.establecerFechaInicio(id, fechaInicio);
        proyectoService.cambiarEstado(proyecto, EstadoProyecto.EN_PROGRESO);
    }

    @PutMapping("/gerente/{id}/fecha-fin")
    public void establecerFechaFin(
            @PathVariable Long id,
            @RequestParam("fechaFin") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaFin,
            HttpSession session) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (!usuario.esGerente()) {
            throw new RuntimeException("No autorizado");
        }

        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        proyectoService.establecerFechaFin(id, fechaFin);
        proyectoService.cambiarEstado(proyecto, EstadoProyecto.COMPLETADO);
    }

    @DeleteMapping("/gerente/{id}")
    public void eliminarProyecto(@PathVariable Long id, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (!usuario.esGerente()) {
            throw new RuntimeException("No autorizado");
        }

        proyectoService.eliminarProyecto(id);
    }

    @PutMapping("/gerente/{id}")
    public void editarProyecto(
            @PathVariable Long id,
            @RequestBody Proyecto proyectoActualizado,
            HttpSession session) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (!usuario.esGerente()) {
            throw new RuntimeException("No autorizado");
        }

        proyectoService.actualizarProyecto(id, proyectoActualizado);
    }

    // ---------------- AUXILIARES ---------------- //
    @GetMapping("/{id}/desarrolladores")
    public List<Desarrollador> obtenerDesarrolladoresAsignados(@PathVariable Long id) {
        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        return desarrolladorService.obtenerPorProyecto(proyecto);
    }

    @GetMapping("/desarrolladores/disponibles")
    public List<Desarrollador> obtenerDesarrolladoresDisponibles() {
        return desarrolladorService.obtenerDesarrolladoresDisponibles();
    }
}
