package com.example.DevFlow.controller;

import com.example.DevFlow.DTO.UsuarioDTO;
import com.example.DevFlow.model.Usuario;
import com.example.DevFlow.service.UsuarioService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
/*
@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginRequest, HttpServletRequest request, HttpServletResponse response) {
        // Invalidar sesión anterior si existe
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        // Crear nueva sesión
        session = request.getSession(true);

        Usuario usuario = usuarioService.validarLogin(
                loginRequest.getNombre(),
                loginRequest.getContrasenia()
        );
        UsuarioDTO usuarioDTO = new UsuarioDTO(usuario);
        session.setAttribute("usuario", usuarioDTO);

        System.out.println("Nueva sesión creada con ID: " + session.getId());

        return ResponseEntity.ok(usuarioDTO);
    }

    @GetMapping("/usuario-actual")
    public ResponseEntity<?> obtenerUsuarioActual(HttpSession session, HttpServletRequest request) {
        // Mostrar las cookies recibidas
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                System.out.println("Cookie recibida: " + cookie.getName() + " = " + cookie.getValue());
            }
        } else {
            System.out.println("No se recibieron cookies en la petición.");
        }

        UsuarioDTO usuario = (UsuarioDTO) session.getAttribute("usuario");
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No hay usuario logueado");
        }
    }

    @GetMapping("/test-get")
    public ResponseEntity<String> testGet(HttpSession session) {
        System.out.println(">> Se recibió petición GET de prueba");

        return ResponseEntity.ok("GET EXITOSO");
    }
}
*/