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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/proyectos")
public class ProyectoController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ProyectoService proyectoService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private DesarrolladorService desarrolladorService;

    // ---------------- ADMIN ---------------- //
    @GetMapping("/admin")
    public List<Proyecto> obtenerProyectosAdmin(
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

        if (!usuario.esAdministrador()) {
            throw new RuntimeException("No autorizado");
        }

        return proyectoService.obtenerListadoDeProyectos(filtro, estado);
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<Map<String, Object>> obtenerDetallesProyectoAdmin(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token no proporcionado"));
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuario = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        if (usuario == null || !usuario.esAdministrador()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "No autorizado"));
        }

        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("proyecto", proyecto);

        // Solo incluir las tablas si el estado es EN_PROGRESO o EN_PAUSA
        if (proyecto.getEstadoAvance() == EstadoProyecto.EN_PROGRESO
                || proyecto.getEstadoAvance() == EstadoProyecto.EN_PAUSA) {

            List<Desarrollador> asignados = desarrolladorService.obtenerPorProyecto(proyecto);
            List<Desarrollador> disponibles = desarrolladorService.obtenerDesarrolladoresDisponibles();

            respuesta.put("desarrolladoresAsignados", asignados);
            respuesta.put("desarrolladoresDisponibles", disponibles);
        }

        return ResponseEntity.ok(respuesta);
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
    public ResponseEntity<Map<String, Object>> obtenerDetallesProyectoCliente(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token no proporcionado"));
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuario = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        if (usuario == null || !usuario.esCliente()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "No autorizado"));
        }

        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);

        if (!proyecto.getUsuario().getId().equals(usuario.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Acceso denegado al proyecto"));
        }

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("proyecto", proyecto);

        if (proyecto.getEstadoAvance() == EstadoProyecto.EN_PROGRESO
                || proyecto.getEstadoAvance() == EstadoProyecto.EN_PAUSA) {
            List<Desarrollador> asignados = desarrolladorService.obtenerPorProyecto(proyecto);
            respuesta.put("desarrolladoresAsignados", asignados);
        }

        return ResponseEntity.ok(respuesta);
    }

    // ---------------- GERENTE ---------------- //
    @GetMapping("/gerente")
    public List<Proyecto> obtenerProyectosGerente(
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

        if (!usuario.esGerente()) {
            throw new RuntimeException("No autorizado");
        }

        return proyectoService.obtenerListadoDeProyectos(filtro, estado);
    }

    @GetMapping("/gerente/{id}")
    public ResponseEntity<Map<String, Object>> obtenerDetallesProyectoGerente(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token no proporcionado"));
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuario = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        if (usuario == null || !usuario.esGerente()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "No autorizado"));
        }

        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("proyecto", proyecto);

        //Agregar info sobre qué cambios de estado están permitidos
        Map<String, Boolean> permisosEstados = proyectoService.consultaGeneralParaFormularioDeCambioDeEstado(proyecto);
        respuesta.put("permisosCambioEstado", permisosEstados);

        if (proyecto.getEstadoAvance() == EstadoProyecto.EN_PROGRESO
                || proyecto.getEstadoAvance() == EstadoProyecto.EN_PAUSA) {
            List<Desarrollador> asignados = desarrolladorService.obtenerPorProyecto(proyecto);
            respuesta.put("desarrolladoresAsignados", asignados);
        }

        return ResponseEntity.ok(respuesta);
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
    public ResponseEntity<?> cambiarEstadoProyecto(
            @PathVariable Long id,
            @RequestParam EstadoProyecto nuevoEstado,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No se proporcionó el token");
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuario = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
        }
        if (!usuario.esGerente()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
        }

        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        if (proyecto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Proyecto no encontrado");
        }

        try {
            proyectoService.cambiarEstado(proyecto, nuevoEstado);
            return ResponseEntity.ok(Map.of("mensaje", "Estado cambiado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/gerente/{id}/fecha-inicio")
    public ResponseEntity<?> establecerFechaInicio(
            @PathVariable Long id,
            @RequestParam("fechaInicio") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaInicio,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token no proporcionado");
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuario = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        if (usuario == null || !usuario.esGerente()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
        }

        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        if (proyecto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Proyecto no encontrado");
        }

        proyectoService.establecerFechaInicio(id, fechaInicio);

        return ResponseEntity.ok(Map.of("mensaje", "Fecha de inicio establecida correctamente"));
    }

    @PutMapping("/gerente/{id}/fecha-fin")
    public ResponseEntity<?> establecerFechaFin(
            @PathVariable Long id,
            @RequestParam("fechaFin") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaFin,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token no proporcionado");
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuario = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        if (usuario == null || !usuario.esGerente()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
        }

        Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
        if (proyecto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Proyecto no encontrado");
        }

        proyectoService.establecerFechaFin(id, fechaFin);

        return ResponseEntity.ok(Map.of("mensaje", "Fecha de fin establecida correctamente"));
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
