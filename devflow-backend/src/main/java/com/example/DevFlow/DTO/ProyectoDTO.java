package com.example.DevFlow.DTO;

import com.example.DevFlow.model.EstadoProyecto;
import com.example.DevFlow.model.Proyecto;
import java.text.SimpleDateFormat;

public class ProyectoDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private String medioEncargo;
    private String fechaInicio;
    private String fechaFinalizacion;
    private Double presupuesto;
    private EstadoProyecto estadoAvance;
    private Long clienteId; // ✅ Agregado para permitir creación

    private static final SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

    public ProyectoDTO() {
        // Constructor vacío para deserialización JSON
    }

    public ProyectoDTO(Proyecto proyecto) {
        this.id = proyecto.getId();
        this.titulo = proyecto.getTitulo();
        this.descripcion = proyecto.getDescripcion();
        this.medioEncargo = proyecto.getMedioEncargo();
        this.presupuesto = proyecto.getPresupuesto();
        this.estadoAvance = proyecto.getEstadoAvance();

        this.fechaInicio = proyecto.getFechaInicio() != null
                ? formatter.format(proyecto.getFechaInicio())
                : null;

        this.fechaFinalizacion = proyecto.getFechaFinalizacion() != null
                ? formatter.format(proyecto.getFechaFinalizacion())
                : null;

        if (proyecto.getUsuario() != null) {
            this.clienteId = proyecto.getUsuario().getId();
        }
    }

    // === Getters y setters ===
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getMedioEncargo() {
        return medioEncargo;
    }

    public void setMedioEncargo(String medioEncargo) {
        this.medioEncargo = medioEncargo;
    }

    public String getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(String fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public String getFechaFinalizacion() {
        return fechaFinalizacion;
    }

    public void setFechaFinalizacion(String fechaFinalizacion) {
        this.fechaFinalizacion = fechaFinalizacion;
    }

    public Double getPresupuesto() {
        return presupuesto;
    }

    public void setPresupuesto(Double presupuesto) {
        this.presupuesto = presupuesto;
    }

    public EstadoProyecto getEstadoAvance() {
        return estadoAvance;
    }

    public void setEstadoAvance(EstadoProyecto estadoAvance) {
        this.estadoAvance = estadoAvance;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }
}