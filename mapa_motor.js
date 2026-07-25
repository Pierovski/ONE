import { reproducirEfecto } from './audio_motor.js';
import { docPartida } from './firebase_motor.js';
import { onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const contenedorMapa = document.getElementById('contenedor-mapa');
const hudInferior = document.querySelector('.hud-inferior');
const rangoIslaTexto = document.querySelector('.rango-isla');

// Levantamiento Topográfico de Islas
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

let indiceIslaActual = 0;
let primeraCarga = true;

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
    barco.style.transform = 'translate(-50%, -50%)';

    barco.onerror = () => { barco.style.display = 'none'; };
    contenedorMapa.appendChild(barco);
}

export function posicionarBarco(animado = false) {
    const barco = document.getElementById('barco-jugador');
    if (!barco) return;

    const datosIsla = rutaIslas[indiceIslaActual];
    if (rangoIslaTexto) rangoIslaTexto.innerText = `Nivel: ${datosIsla.nombre}`;

    if (!animado) {
        barco.style.transition = 'none';
        barco.style.top = datosIsla.top;
        barco.style.left = datosIsla.left;
        
        setTimeout(() => {
            barco.style.transition = 'top 3s cubic-bezier(0.25, 1, 0.5, 1), left 3s cubic-bezier(0.25, 1, 0.5, 1)';
        }, 50);
    } else {
        barco.style.top = datosIsla.top;
        barco.style.left = datosIsla.left;
    }
}

// Escuchamos las millas desde la central y calculamos la posición
onSnapshot(docPartida, (docSnap) => {
    if (docSnap.exists()) {
        const data = docSnap.data();
        const millasTotales = data.millas_totales || 0;
        
        let nuevoIndice = 0;
        for (let i = 0; i < rutaIslas.length; i++) {
            if (millasTotales >= rutaIslas[i].millasRequeridas) {
                nuevoIndice = i;
            }
        }

        // Guardamos el índice localmente solo para que retos_motor sepa qué retos filtrar
        localStorage.setItem('indiceIslaActual', nuevoIndice);

        // Si el índice subió y no es la primera vez que abrimos la app, zarpamos
        if (nuevoIndice > indiceIslaActual && !primeraCarga) {
            indiceIslaActual = nuevoIndice;
            animarViaje();
        } else if (primeraCarga) {
            // Posicionamiento estático al cargar la página
            indiceIslaActual = nuevoIndice;
            posicionarBarco(false);
            primeraCarga = false;
        }
    }
});

function animarViaje() {
    if (hudInferior) {
        hudInferior.style.opacity = '0.4';
        hudInferior.style.pointerEvents = 'none';
    }
    
    reproducirEfecto('sfx-barco-zarpa.mp3');
    posicionarBarco(true);

    setTimeout(() => {
        if (hudInferior) {
            hudInferior.style.opacity = '1';
            hudInferior.style.pointerEvents = 'auto';
        }
        reproducirEfecto('sfx-isla-llegada.mp3');
        alert(`¡Tierra a la vista! Hemos llegado a ${rutaIslas[indiceIslaActual].nombre}.`);
    }, 3000);
}

// Se mantiene vacía para no romper la importación en retos_motor.js
export function intentarViajar(misMillasActuales) {}

document.addEventListener('DOMContentLoaded', () => {
    inicializarMapa();
});
