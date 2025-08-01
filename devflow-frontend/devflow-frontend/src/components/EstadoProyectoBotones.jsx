import { useState } from 'react';
import estilosBoton from '../styles/botones.module.css';
import estilosFormulario from '../styles/formulario.module.css';
import {
  establecerFechaInicio,
  establecerFechaFin,
  cambiarEstadoProyectoComoGerente
} from '../services/proyectoService';

function EstadoProyectoBotones({ proyecto, estadoActual, permisosCambioEstado }) {
  const [mensajeEnvio, setMensajeEnvio] = useState(null);
  const [estadoPendiente, setEstadoPendiente] = useState(null);
  const [fechaPendiente, setFechaPendiente] = useState(null); // 'inicio' o 'fin'

  async function enviarEstado(nuevoEstado) {
    try {
      const respuesta = await cambiarEstadoProyectoComoGerente(proyecto.id, nuevoEstado);
      setMensajeEnvio(respuesta.mensaje || "Estado cambiado");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setMensajeEnvio(`Error al enviar: ${error.message}`);
    }
  }

  const botones = [
    { id: 'ESPERANDO_REVISION', label: 'Esperando revisión', puede: permisosCambioEstado?.puedeVolverARevision },
    { id: 'APROBADO', label: 'Aprobado', puede: permisosCambioEstado?.puedeAprobarse },
    { id: 'RECHAZADO', label: 'Rechazado', puede: permisosCambioEstado?.puedeRechazarse },
    { id: 'EN_PROGRESO', label: 'En progreso', puede: permisosCambioEstado?.puedeDesarrollarse },
    { id: 'CANCELADO', label: 'Cancelado', puede: permisosCambioEstado?.puedeCancelarse },
    { id: 'EN_PAUSA', label: 'Pausado', puede: permisosCambioEstado?.puedePausarse },
    { id: 'COMPLETADO', label: 'Finalizado', puede: permisosCambioEstado?.puedeFinalizarse }
  ];

  return (
    <>
      <div className="botones-estado">
        {botones.map(({ id, label, puede }) => {
          const esActual = estadoActual === id;
          const texto = esActual ? `Está:\n${label}` : `Mover a:\n${label}`;
          const deshabilitado = !puede;

          return (
            <button
              key={id}
              id={id}
              className={`${estilosBoton['boton-estado']} ${esActual ? estilosBoton['estado-actual'] : ''} ${deshabilitado ? estilosBoton['deshabilitado'] : ''}`}
              disabled={deshabilitado}
              onClick={() => {
                if (id === 'APROBADO' && !proyecto.fechaInicio) {
                  setEstadoPendiente(id);
                  setFechaPendiente('inicio');
                  return;
                }

                if (id === 'COMPLETADO' && !proyecto.fechaFin) {
                  setEstadoPendiente(id);
                  setFechaPendiente('fin');
                  return;
                }

                enviarEstado(id);
              }}
            >
              {texto.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
            </button>
          );
        })}
      </div>

      {(estadoPendiente && (fechaPendiente === 'inicio' || fechaPendiente === 'fin')) && (
       <form
  className={estilosFormulario['formulario-fecha']}
  onSubmit={async (e) => {
    e.preventDefault();
    const fecha = e.target.fecha.value;

    if (fecha) {
      try {
        if (fechaPendiente === 'inicio') {
          await establecerFechaInicio(proyecto.id, fecha);
        } else {
          await establecerFechaFin(proyecto.id, fecha);
        }

        await enviarEstado(estadoPendiente);
        setEstadoPendiente(null);
        setFechaPendiente(null);
      } catch (error) {
        setMensajeEnvio(`Error al guardar la fecha: ${error.message}`);
      }
    } else {
      alert("Por favor, ingresá una fecha válida.");
    }
  }}
>
  <label>
    {fechaPendiente === 'inicio' ? 'Fecha de inicio:' : 'Fecha de finalización:'}
  </label>
  <div className={estilosFormulario['fila-fecha']}>
    <input type="date" name="fecha" />
    <button type="submit">Guardar</button>
  </div>
</form>
      )}

      {mensajeEnvio && (
        <div className={estilosFormulario['mensaje-envio']}>
          {mensajeEnvio}
        </div>
      )}
    </>
  );
}

export default EstadoProyectoBotones;