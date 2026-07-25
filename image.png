import { inicializarAudioSeguro, cambiarMusicaFondo, reproducirEfecto } from './audio_motor.js';

const btnFirmar = document.getElementById('btn-firmar-pacto');
const btnCache = document.getElementById('btn-limpiar-cache');
const pantallaPergamino = document.getElementById('pantalla-pergamino');
const pantallaPersonajes = document.getElementById('pantalla-personajes');
const pantallaJuego = document.getElementById('pantalla-juego');

// --- LÓGICA DE FIRMA REAL EN EL CANVAS (Simplificada) ---
const canvas = document.getElementById('lienzo-firma');
const ctx = canvas ? canvas.getContext('2d') : null;
let dibujando = false;
let tieneFirma = false; 

if (canvas) {
    const obtenerPosicion = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        return { x, y };
    };

    const iniciarDibujo = (e) => {
        e.preventDefault();
        dibujando = true;
        tieneFirma = true; 
        dibujar(e);
    };

    const terminarDibujo = () => {
        dibujando = false;
        ctx.beginPath();
    };

    const dibujar = (e) => {
        if (!dibujando) return;
        e.preventDefault();
        const pos = obtenerPosicion(e);
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#0d223d'; // Tinta Azul Marina
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    canvas.addEventListener('mousedown', iniciarDibujo);
    canvas.addEventListener('mouseup', terminarDibujo);
    canvas.addEventListener('mousemove', dibujar);
    canvas.addEventListener('touchstart', iniciarDibujo, { passive: false });
    canvas.addEventListener('touchend', terminarDibujo);
    canvas.addEventListener('touchmove', dibujar, { passive: false });
}

// --- LÓGICA DE NAVEGACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('pactoFirmado') === 'true') {
        pantallaPergamino.style.display = 'none';
        if (localStorage.getItem('personajeTripulacion')) {
            pantallaJuego.style.display = 'block';
            // Nota: La música necesita interacción para iniciar, 
            // este reload síncrono podría no reproducirla.
        } else {
            pantallaPersonajes.style.display = 'block';
        }
    }
});

btnFirmar.addEventListener('click', () => {
    if (!tieneFirma) {
        alert("Capitán, firme el lienzo para zarpar.");
        return;
    }

    // Desbloqueo y cambio de música ambiental
    inicializarAudioSeguro();       
    cambiarMusicaFondo('mapa');     
    reproducirEfecto('sfx-pacto-firmado.mp3'); 

    pantallaPergamino.style.display = 'none';
    localStorage.setItem('pactoFirmado', 'true');
    
    if (localStorage.getItem('personajeTripulacion')) {
        pantallaJuego.style.display = 'block';
    } else {
        pantallaPersonajes.style.display = 'block';
    }
});

btnCache.addEventListener('click', () => {
    if ('caches' in window) {
        caches.keys().then((nombres) => {
            nombres.forEach((nombre) => caches.delete(nombre));
        });
        localStorage.clear(); 
        alert('Memoria reseteada.');
        window.location.reload(true);
    }
});
