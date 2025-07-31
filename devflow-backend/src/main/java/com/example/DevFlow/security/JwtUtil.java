package com.example.DevFlow.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "UnaClaveSuperSecretaParaJWTQueDebeSerLarga123456"; // Podés moverla a application.properties
    private final long EXPIRATION_TIME = 86400000; // 24 horas en milisegundos

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Generar token
    public String generarToken(String nombreUsuario, String rol) {
        return Jwts.builder()
                .setSubject(nombreUsuario)
                .claim("rol", rol)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Obtener nombre de usuario
    public String extraerNombreUsuario(String token) {
        return getClaims(token).getSubject();
    }

    // Obtener rol
    public String extraerRol(String token) {
        return getClaims(token).get("rol", String.class);
    }

    // Validar token
    public boolean validarToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Extraer claims
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Aquí corregimos: simplemente reutilizamos extraerNombreUsuario
    public String obtenerNombreUsuario(String token) {
        return extraerNombreUsuario(token);
    }
}
