package com.example.DevFlow.controller;

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
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

    @GetMapping("/gerente/clientes/detalles/{id}")
    public String verDetallesClienteComoGerente(
            @PathVariable Long id,
            Model model,
            HttpSession session) {
        Usuario usuarioSesion = (Usuario) session.getAttribute("usuario");

        if (!usuarioSesion.esGerente()) {
            return "redirect:/login";
        }

        Usuario usuario = usuarioService.obtenerUsuarioPorId(id);
        List<Proyecto> proyectosSolicitados = proyectoService.obtenerProyectosPorIdCliente(usuario.getId());

        model.addAttribute("nombreUsuario", usuarioSesion.getNombre());
        model.addAttribute("usuario", usuario);
        model.addAttribute("proyectosSolicitados", proyectosSolicitados);

        return "gerente/detallesCliente";
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

    @GetMapping("/admin/usuarios/detalles/{id}")
    public String verDetallesUsuarioComoAdmin(
            @PathVariable Long id,
            Model model,
            HttpSession session) {
        Usuario usuarioSesion = (Usuario) session.getAttribute("usuario");

        if (!usuarioSesion.esAdministrador()) {
            return "redirect:/login";
        }

        Usuario usuario = usuarioService.obtenerUsuarioPorId(id);

        model.addAttribute("nombreUsuario", usuarioSesion.getNombre());
        model.addAttribute("usuario", usuario);

        return "administrador/detallesUsuario";
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

    @GetMapping("/admin/usuarios/editar/{id}")
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
    }

    //-ALTA, BAJA Y MODIFICACION----------------------------------------------------------------------------
    @PostMapping("/admin/usuarios/nuevo")
    public String crearUsuario(
            @RequestParam String nombre,
            @RequestParam String email,
            @RequestParam Long telefono,
            @RequestParam RolUsuario rol,
            @RequestParam String contrasenia,
            HttpSession session,
            Model model) {

        Usuario usuarioSesion = (Usuario) session.getAttribute("usuario");

        if (!usuarioSesion.esAdministrador()) {
            return "redirect:/login";
        }

        model.addAttribute("nombreUsuario", usuarioSesion.getNombre());

        try {
            usuarioService.crearUsuario(nombre, contrasenia, email, telefono, rol);
            return "redirect:/admin/usuarios";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("nombre", nombre);
            model.addAttribute("email", email);
            model.addAttribute("telefono", telefono);
            model.addAttribute("rol", rol);
            model.addAttribute("contrasenia", contrasenia);
            return "administrador/nuevoUsuario";
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

    @PostMapping("/admin/usuarios/editar/{id}")
    public String actualizarUsuario(
            @PathVariable Long id,
            @ModelAttribute Usuario usuarioActualizado,
            HttpSession session,
            Model model) {

        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (!usuario.esAdministrador()) {
            return "redirect:/login";
        }
        model.addAttribute("nombreUsuario", usuario.getNombre());

        // Intenta actualizar el usuario
        try {
            usuarioService.actualizarUsuario(id, usuarioActualizado);
            return "redirect:/admin/usuarios";
        } catch (IllegalArgumentException e) {
            model.addAttribute("usuario", usuarioActualizado);
            model.addAttribute("error", e.getMessage());
            return "administrador/editarUsuario";
        }
    }
}
