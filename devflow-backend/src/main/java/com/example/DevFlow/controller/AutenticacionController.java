package com.example.DevFlow.controller;

import com.example.DevFlow.DTO.LoginRequest;
import com.example.DevFlow.DTO.UsuarioDTO;
import com.example.DevFlow.model.Usuario;
import com.example.DevFlow.security.JwtUtil;
import com.example.DevFlow.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AutenticacionController {

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public AutenticacionController(UsuarioService usuarioService, JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Usuario usuario = usuarioService.validarLogin(loginRequest.getNombreUsuario(), loginRequest.getPassword());

            if (usuario != null) {
                String token = jwtUtil.generarToken(usuario.getNombre(), usuario.getRol().name());
                UsuarioDTO usuarioDTO = new UsuarioDTO(usuario);

                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("token", token);
                respuesta.put("usuario", usuarioDTO);

                return ResponseEntity.ok(respuesta);
            } else {
                return ResponseEntity.status(401).body("Credenciales inválidas");
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }
}
