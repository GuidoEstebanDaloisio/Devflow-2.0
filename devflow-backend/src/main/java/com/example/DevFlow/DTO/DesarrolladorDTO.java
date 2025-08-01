package com.example.DevFlow.DTO;

import com.example.DevFlow.model.Desarrollador;


public class DesarrolladorDTO {

    private Long id;
    private String nombre;
    private String habilidades;
    private Boolean estaDisponible;
    private Long proyectoId; // Puede ser null si no está asignado

    public DesarrolladorDTO() {
    }

    public DesarrolladorDTO(Desarrollador desarrollador) {
        this.id = desarrollador.getId();
        this.nombre = desarrollador.getNombre();
        this.habilidades = desarrollador.getHabilidades();
        this.estaDisponible = desarrollador.getEstaDisponible();
        this.proyectoId = desarrollador.getProyecto() != null ? desarrollador.getProyecto().getId() : null;
    }

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getHabilidades() {
        return habilidades;
    }

    public void setHabilidades(String habilidades) {
        this.habilidades = habilidades;
    }

    public Boolean getEstaDisponible() {
        return estaDisponible;
    }

    public void setEstaDisponible(Boolean estaDisponible) {
        this.estaDisponible = estaDisponible;
    }

    public Long getProyectoId() {
        return proyectoId;
    }

    public void setProyectoId(Long proyectoId) {
        this.proyectoId = proyectoId;
    }
}