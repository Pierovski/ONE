import { reproducirEfecto } from './audio_motor.js';

const contenedorMapa = document.getElementById('contenedor-mapa');
const hudInferior = document.querySelector('.hud-inferior');
const rangoIslaTexto = document.querySelector('.rango-isla');

// Levantamiento Topográfico (Coordenadas y Millas acumuladas necesarias)
export const rutaIslas = [
    { nombre: "Reverse Mountain", top: "25%", left: "30%", millasRequeridas: 0 },
    { nombre: "Loguetown", top: "18%", left: "68%", millasRequeridas: 100 },
    { nombre: "Whisky Peak", top: "35%", left: "40%", millasRequeridas: 250 },
    { nombre: "Skypiea", top: "35%", left: "75%", millasRequeridas: 450 },
    { nombre: "Water 7", top: "48%", left: "60%", millasRequeridas: 700 },
    { nombre: "Alabasta", top: "50%", left: "30%", millasRequeridas: 1000 },
    { nombre: "Sabaody", top: "60%", left: "75%", millasRequeridas: 1350 },
    { nombre: "Fishman Island", top: "75%", left: "65%", millasRequeridas: 1750 },
    { nombre: "Impel Down", top: "75%", left: "30%", millasRequeridas: 2200 },
    { nombre: "Raftel", top: "85%", left: "75%", millasRequeridas: 2800 }
];

let indiceIslaActual = parseInt(localStorage.getItem('indiceIslaActual')) || 0;

export function inicializarMapa() {
    if (!contenedorMapa) return;
    contenedorMapa.innerHTML = '';

    const barco = document.createElement('img');
    barco.src = 'assets/img/barco-tripulacion.png';
    barco.id = 'barco-jugador';
    barco.style.position = 'absolute';
    barco.style.width = '45px';
    barco.style.height = '45px';
    barco.style.zIndex = '2';
    // Inercia Náutica (Curva Bézier de 3 segundos para movimiento orgánico)
    barco.style.transition = 'top 3s cubic-bezier(0.25, 1, 0.5, 1), left 3s cubic-bezier(0.25, 1, 0.5, 1)';
    barco.style.transform = 'translate(-50%, -50%)';

    barco.onerror = () => { barco.style.display = 'none'; };
    contenedorMapa.appendChild(barco);
    
    posicionarBarco(false);
}

export function posicionarBarco(animado = false) {
    const barco = document.getElementById('barco-jugador');
    if (!barco) return;

    const datosIsla = rutaIslas[indiceIslaActual];
    if (rangoIslaTexto) rangoIslaTexto.innerText = `Nivel: ${datosIsla.nombre}`;

    if (!animado) {
        // Posicionamiento inmediato sin animación (al cargar la app)
        barco.style.transition = 'none';
        barco.style.top = datosIsla.top;
        barco.style.left = datosIsla.left;
        
        // Devolvemos la capacidad de animar una fracción de segundo después
        setTimeout(() => {
            barco.style.transition = 'top 3s cubic-bezier(0.25, 1, 0.5, 1), left 3s cubic-bezier(0.25, 1, 0.5, 1)';
        }, 50);
    } else {
        // Viaje animado
        barco.style.top = datosIsla.top;
        barco.style.left = datosIsla.left;
    }
}

export function intentarViajar(misMillasActuales) {
    // Verificamos si hay una siguiente isla y si cumplimos la cuota de millas
    const siguienteIsla = rutaIslas[indiceIslaActual + 1];
    
    if (siguienteIsla && misMillasActuales >= siguienteIsla.millasRequeridas) {
        indiceIslaActual++;
        localStorage.setItem('indiceIslaActual', indiceIslaActual);

        // CINEMÁTICA: Bloqueo de Interfaz
        if (hudInferior) {
            hudInferior.style.opacity = '0.4';
            hudInferior.style.pointerEvents = 'none';
        }
        
        // Sonido de Zarpar
        reproducirEfecto('sfx-barco-zarpa.mp3');

        // Mover el barco
        posicionarBarco(true);

        // Desbloquear al llegar a la meta (3 segundos después)
        setTimeout(() => {
            if (hudInferior) {
                hudInferior.style.opacity = '1';
                hudInferior.style.pointerEvents = 'auto';
            }
            reproducirEfecto('sfx-isla-llegada.mp3');
            alert(`¡Tierra a la vista! Hemos llegado a ${rutaIslas[indiceIslaActual].nombre}.`);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarMapa();
});
