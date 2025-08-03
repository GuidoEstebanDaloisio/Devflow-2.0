package com.example.DevFlow.controller;

import com.example.DevFlow.DTO.DesarrolladorDTO;
import com.example.DevFlow.model.Desarrollador;
import com.example.DevFlow.model.Proyecto;
import com.example.DevFlow.model.Usuario;
import com.example.DevFlow.security.JwtUtil;
import com.example.DevFlow.service.DesarrolladorService;
import com.example.DevFlow.service.ProyectoService;
import com.example.DevFlow.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class DesarrolladorController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private DesarrolladorService desarrolladorService;


    //-VISTAS-----------------------------------------------------------------------------------------------    
    @GetMapping("/admin/desarrolladores")
    public ResponseEntity<List<DesarrolladorDTO>> obtenerDesarrolladoresComoAdmin(
            @RequestParam(required = false) String filtro,
            @RequestParam(required = false) String estado,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuario = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        if (usuario == null || !usuario.esAdministrador()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Desarrollador> desarrolladores = desarrolladorService.obtenerListadoDeDesarrolladores(filtro, estado);
        List<DesarrolladorDTO> desarrolladoresDTO = desarrolladores.stream()
                .map(DesarrolladorDTO::new)
                .toList();

        return ResponseEntity.ok(desarrolladoresDTO);
    }

    @GetMapping("/admin/desarrolladores/{id}")
    public ResponseEntity<?> obtenerDetalleDesarrollador(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        // 1) Verificación básica del token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);

        // 2) Extraer usuario de sesión y validar rol
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuarioSesion = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);
        if (usuarioSesion == null || !usuarioSesion.esAdministrador()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 3) Recuperar y devolver el DTO
        try {
            Desarrollador desarrollador = desarrolladorService.obtenerDesarrolladorPorId(id);
            DesarrolladorDTO dto = new DesarrolladorDTO(desarrollador);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            // Por ejemplo si no existe el ID
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    //-ASIGNACION Y DESASIGNACION---------------------------------------------------------------------------
    @PostMapping("/admin/asignar")
    public ResponseEntity<String> asignarDesarrolladorReact(
            @RequestBody Map<String, Long> datos,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token no proporcionado");
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuario = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        if (usuario == null || !usuario.esAdministrador()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
        }

        Long proyectoId = datos.get("proyectoId");
        Long desarrolladorId = datos.get("desarrolladorId");

        try {
            desarrolladorService.asignarAProyecto(proyectoId, desarrolladorId);
            return ResponseEntity.ok("Desarrollador asignado correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/admin/desasignar")
    public ResponseEntity<String> desasignarDesarrolladorReact(
            @RequestBody Map<String, Long> datos,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token no proporcionado");
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuario = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        if (usuario == null || !usuario.esAdministrador()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
        }

        Long proyectoId = datos.get("proyectoId");
        Long desarrolladorId = datos.get("desarrolladorId");

        try {
            desarrolladorService.desasignarAProyecto(proyectoId, desarrolladorId);
            return ResponseEntity.ok("Desarrollador desasignado correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //-ALTA, BAJA Y MODIFICACION----------------------------------------------------------------------------
    @PostMapping("/admin/desarrolladores/nuevo")
    public ResponseEntity<?> crearDesarrollador(
            @RequestBody DesarrolladorDTO nuevoDesarrollador,
            @RequestHeader("Authorization") String authHeader) {

        // Validar que venga token Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuarioSesion = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        // Validar que sea admin
        if (usuarioSesion == null || !usuarioSesion.esAdministrador()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            desarrolladorService.crearDesarrollador(
                    nuevoDesarrollador.getNombre(),
                    nuevoDesarrollador.getHabilidades()
            );
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/admin/desarrolladores/{id}")
    public ResponseEntity<?> eliminarDesarrollador(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuarioSesion = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        if (usuarioSesion == null || !usuarioSesion.esAdministrador()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            desarrolladorService.eliminarDesarrollador(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo eliminar el desarrollador.");
        }
    }

    @PutMapping("/admin/desarrolladores/editar/{id}")
    public ResponseEntity<?> actualizarDesarrollador(
            @PathVariable Long id,
            @RequestBody Desarrollador desarrolladorActualizado,
            @RequestHeader("Authorization") String authHeader) {

        // 1) Validación básica del token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuarioSesion = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        // 2) Validar rol administrador
        if (usuarioSesion == null || !usuarioSesion.esAdministrador()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 3) Actualizar desarrollador
        try {
            desarrolladorService.actualizarNombreYHabilidades(
                    id,
                    desarrolladorActualizado.getNombre(),
                    desarrolladorActualizado.getHabilidades()
            );
            return ResponseEntity.ok().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
