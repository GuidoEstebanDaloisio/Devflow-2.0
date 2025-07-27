package com.example.DevFlow.DTO;

import com.example.DevFlow.model.RolUsuario;
import com.example.DevFlow.model.Usuario;

public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String email;
    private Long telefono;
    private RolUsuario rol;

    public UsuarioDTO(Usuario u) {
        this.id = u.getId();
        this.nombre = u.getNombre();
        this.email = u.getEmail();
        this.telefono = u.getTelefono();
        this.rol = u.getRol();
    }

    // Getters y setters

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public Long getTelefono() {
        return telefono;
    }

    public RolUsuario getRol() {
        return rol;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setTelefono(Long telefono) {
        this.telefono = telefono;
    }

    public void setRol(RolUsuario rol) {
        this.rol = rol;
    }
}
