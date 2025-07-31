package com.example.DevFlow.DTO;

public class LoginRequest {

    private String nombreUsuario;
    private String password;

    // Constructor vacío (necesario para deserialización JSON)
    public LoginRequest() {
    }

    // Getters y setters
    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombre) {
        this.nombreUsuario = nombre;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
