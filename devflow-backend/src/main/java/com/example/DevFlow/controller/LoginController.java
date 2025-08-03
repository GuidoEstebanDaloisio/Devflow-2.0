package com.example.DevFlow.controller;


import com.example.DevFlow.DTO.UsuarioDTO;
import com.example.DevFlow.model.EstadoProyecto;
import com.example.DevFlow.model.Usuario;
import com.example.DevFlow.security.JwtUtil;
import com.example.DevFlow.service.DesarrolladorService;
import com.example.DevFlow.service.ProyectoService;
import com.example.DevFlow.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final ProyectoService proyectoService;
    private final UsuarioService usuarioService;
    private final DesarrolladorService desarrolladorService;
    private final JwtUtil jwtUtil;

    public LoginController(ProyectoService proyectoService, UsuarioService usuarioService, DesarrolladorService desarrolladorService, JwtUtil jwtUtil) {
        this.proyectoService = proyectoService;
        this.usuarioService = usuarioService;
        this.desarrolladorService = desarrolladorService;
        this.jwtUtil = jwtUtil;
    }

    private Usuario obtenerUsuarioDesdeToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validarToken(token)) {
            return null;
        }
        String nombreUsuario = jwtUtil.obtenerNombreUsuario(token);
        return usuarioService.obtenerUsuarioPorNombre(nombreUsuario);
    }

    @GetMapping("/inicio/cliente/{idUsuario}")
    public ResponseEntity<?> verInicioCliente(
            @PathVariable Long idUsuario,
            @RequestHeader("Authorization") String authHeader) {

        Usuario usuario = obtenerUsuarioDesdeToken(authHeader);
        if (usuario == null || !usuario.getId().equals(idUsuario) || !usuario.esCliente()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado");
        }

        Map<String, Integer> stats = new HashMap<>();
        stats.put("CantProyectosEnRevision", proyectoService.obtenerCantidadProyectosPorEstadoYCliente(idUsuario, EstadoProyecto.ESPERANDO_REVISION));
        stats.put("CantProyectosAprobados", proyectoService.obtenerCantidadProyectosPorEstadoYCliente(idUsuario, EstadoProyecto.APROBADO));
        stats.put("CantProyectosRechazados", proyectoService.obtenerCantidadProyectosPorEstadoYCliente(idUsuario, EstadoProyecto.RECHAZADO));
        stats.put("CantProyectosEnProceso", proyectoService.obtenerCantidadProyectosPorEstadoYCliente(idUsuario, EstadoProyecto.EN_PROGRESO));
        stats.put("CantProyectosFinalizados", proyectoService.obtenerCantidadProyectosPorEstadoYCliente(idUsuario, EstadoProyecto.COMPLETADO));
        stats.put("CantProyectosCancelados", proyectoService.obtenerCantidadProyectosPorEstadoYCliente(idUsuario, EstadoProyecto.CANCELADO));
        stats.put("CantProyectosEnPausa", proyectoService.obtenerCantidadProyectosPorEstadoYCliente(idUsuario, EstadoProyecto.EN_PAUSA));

        Map<String, Object> response = new HashMap<>();
        response.put("usuario", new UsuarioDTO(usuario));  // si querés enviar datos usuario
        response.put("estadisticas", stats);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/inicio/gerente/{idUsuario}")
    public ResponseEntity<?> verInicioGerente(
            @PathVariable Long idUsuario,
            @RequestHeader("Authorization") String authHeader) {

        Usuario usuario = obtenerUsuarioDesdeToken(authHeader);
        if (usuario == null || !usuario.getId().equals(idUsuario) || !usuario.esGerente()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado");
        }

        Map<String, Integer> stats = new HashMap<>();
        stats.put("CantProyectosEnRevision", proyectoService.obtenerCantidadProyectosPorEstado(EstadoProyecto.ESPERANDO_REVISION));
        stats.put("CantProyectosAprobados", proyectoService.obtenerCantidadProyectosPorEstado(EstadoProyecto.APROBADO));
        stats.put("CantProyectosRechazados", proyectoService.obtenerCantidadProyectosPorEstado(EstadoProyecto.RECHAZADO));
        stats.put("CantProyectosEnProceso", proyectoService.obtenerCantidadProyectosPorEstado(EstadoProyecto.EN_PROGRESO));
        stats.put("CantProyectosFinalizados", proyectoService.obtenerCantidadProyectosPorEstado(EstadoProyecto.COMPLETADO));
        stats.put("CantProyectosCancelados", proyectoService.obtenerCantidadProyectosPorEstado(EstadoProyecto.CANCELADO));
        stats.put("CantProyectosEnPausa", proyectoService.obtenerCantidadProyectosPorEstado(EstadoProyecto.EN_PAUSA));

        Map<String, Object> response = new HashMap<>();
        response.put("usuario", new UsuarioDTO(usuario));
        response.put("estadisticas", stats);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/inicio/admin/{idUsuario}")
    public ResponseEntity<?> verInicioAdmin(
            @PathVariable Long idUsuario,
            @RequestHeader("Authorization") String authHeader) {

        Usuario usuario = obtenerUsuarioDesdeToken(authHeader);
        if (usuario == null || !usuario.getId().equals(idUsuario) || !usuario.esAdministrador()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado");
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("CantUsuarios", usuarioService.obtenerCantidadUsuarios());
        stats.put("CantProyectosEnProceso", proyectoService.obtenerCantidadProyectosPorEstado(EstadoProyecto.EN_PROGRESO));
        stats.put("CantProyectosEnPausa", proyectoService.obtenerCantidadProyectosPorEstado(EstadoProyecto.EN_PAUSA));
        stats.put("CantDevDisponibles", desarrolladorService.obtenerCantidadDesarrolladoresDisponibles());

        Map<String, Object> response = new HashMap<>();
        response.put("usuario", new UsuarioDTO(usuario));
        response.put("estadisticas", stats);

        return ResponseEntity.ok(response);
    }
}
