package com.example.DevFlow.controller;

import com.example.DevFlow.DTO.ProyectoDTO;
import com.example.DevFlow.DTO.UsuarioDTO;
import com.example.DevFlow.model.Proyecto;
import com.example.DevFlow.model.RolUsuario;
import com.example.DevFlow.model.Usuario;
import com.example.DevFlow.security.JwtUtil;
import com.example.DevFlow.service.ProyectoService;
import com.example.DevFlow.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UsuarioController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ProyectoService proyectoService;

    //-VISTAS GERENTE---------------------------------------------------------------------------------------    
    @GetMapping("/gerente/clientes")
    public ResponseEntity<List<UsuarioDTO>> obtenerClientesComoGerente(
            @RequestParam(required = false) String filtro,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuario = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        if (usuario == null || !usuario.esGerente()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Usuario> usuarios = usuarioService.obtenerListadoDeClientes(filtro);
        List<UsuarioDTO> usuariosDTO = usuarios.stream()
                .map(UsuarioDTO::new)
                .toList();

        return ResponseEntity.ok(usuariosDTO);
    }

    @GetMapping("/gerente/clientes/{id}")
    public ResponseEntity<?> obtenerDetalleClienteComoGerente(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuarioSesion = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        if (usuarioSesion == null || !usuarioSesion.esGerente()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Usuario cliente = usuarioService.obtenerUsuarioPorId(id);
        if (cliente == null || !cliente.esCliente()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado");
        }

        List<Proyecto> proyectosSolicitados = proyectoService.obtenerProyectosPorIdCliente(id);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("cliente", new UsuarioDTO(cliente));
        respuesta.put("proyectosSolicitados", proyectosSolicitados.stream()
                .map(ProyectoDTO::new)
                .toList());

        return ResponseEntity.ok(respuesta);
    }

    //-VISTAS ADMINISTRADOR---------------------------------------------------------------------------------    
    @GetMapping("/admin/usuarios")
    public ResponseEntity<List<UsuarioDTO>> obtenerUsuariosComoAdmin(
            @RequestParam(required = false) String filtro,
            @RequestParam(required = false) String rol,
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

        List<Usuario> usuarios = usuarioService.obtenerListadoDeUsuarios(filtro, rol);
        List<UsuarioDTO> usuariosDTO = usuarios.stream()
                .map(UsuarioDTO::new)
                .toList();

        return ResponseEntity.ok(usuariosDTO);
    }

    @GetMapping("/admin/usuarios/{id}")
    public ResponseEntity<?> obtenerDetalleUsuarioComoAdmin(
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

        Usuario usuario = usuarioService.obtenerUsuarioPorId(id);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        return ResponseEntity.ok(new UsuarioDTO(usuario));
    }

    @GetMapping("/admin/usuarios/nuevo")
    public String mostrarFormularioNuevoUsuario(
            HttpSession session,
            Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (!usuario.esAdministrador()) {
            return "redirect:/login";
        }

        model.addAttribute("nombreUsuario", usuario.getNombre());

        // Muestra la vista con el formulario
        return "administrador/nuevoUsuario";
    }

    /*@GetMapping("/admin/usuarios/editar/{id}")
    public String mostrarFormularioEdicion(
            @PathVariable Long id,
            HttpSession session,
            Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (!usuario.esAdministrador()) {
            return "redirect:/login";
        }
        model.addAttribute("nombreUsuario", usuario.getNombre());
        try {
            Usuario usuarioEditable = usuarioService.obtenerUsuarioPorId(id);
            model.addAttribute("usuario", usuarioEditable);
            return "administrador/editarUsuario";
        } catch (IllegalArgumentException e) {
            return "redirect:/admin/usuarios?error=" + URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);    //Envio el error desde el servicio
        }
    }*/
    @GetMapping("/api/admin/usuarios/{id}")
    public ResponseEntity<?> obtenerDetalleUsuario(
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
            Usuario usuario = usuarioService.obtenerUsuarioPorId(id);
            UsuarioDTO usuarioDTO = new UsuarioDTO(usuario);
            return ResponseEntity.ok(usuarioDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    //-ALTA, BAJA Y MODIFICACION----------------------------------------------------------------------------
    @PostMapping("/admin/usuarios/nuevo")
    public ResponseEntity<?> crearUsuario(
            @RequestBody Usuario nuevoUsuario,
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
            usuarioService.crearUsuario(
                    nuevoUsuario.getNombre(),
                    nuevoUsuario.getContrasenia(),
                    nuevoUsuario.getEmail(),
                    nuevoUsuario.getTelefono(),
                    nuevoUsuario.getRol()
            );
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/admin/usuarios/eliminar/{id}")
    public String eliminarUsuario(
            @PathVariable Long id,
            HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (!usuario.esAdministrador()) {
            return "redirect:/login";
        }

        usuarioService.eliminarUsuario(id);

        return "redirect:/admin/usuarios";
    }

    @PutMapping("/admin/usuarios/editar/{id}")
    public ResponseEntity<?> actualizarUsuario(
            @PathVariable Long id,
            @RequestBody Usuario usuarioActualizado,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String nombreUsuario = jwtUtil.extraerNombreUsuario(token);
        Usuario usuario = usuarioService.obtenerUsuarioPorNombre(nombreUsuario);

        if (!usuario.esAdministrador()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            usuarioService.actualizarUsuario(id, usuarioActualizado);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
