import { inicializarAudioSeguro, cambiarMusicaFondo, reproducirEfecto } from './audio_motor.js';
import { asegurarDocumentoNube } from './firebase_motor.js'; // <-- Nube conectada

const btnFirmar = document.getElementById('btn-firmar-pacto');
const btnCache = document.getElementById('btn-limpiar-cache');
const pantallaPergamino = document.getElementById('pantalla-pergamino');
const pantallaPersonajes = document.getElementById('pantalla-personajes');
const pantallaJuego = document.getElementById('pantalla-juego');

// --- LÓGICA DE FIRMA REAL EN EL CANVAS ---
const canvas = document.getElementById('lienzo-firma');
const ctx = canvas ? canvas.getContext('2d') : null;
let dibujando = false;
let tieneFirma = false; 

if (canvas) {
    // Solución al lienzo borroso (Multiplicador de densidad de píxeles)
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const obtenerPosicion = (e) => {
        const bounds = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - bounds.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - bounds.top;
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

// --- LÓGICA DE NAVEGACIÓN Y NUBE ---
document.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem('pactoFirmado') === 'true') {
        pantallaPergamino.style.display = 'none';
        
        // Inicializamos la nube silenciosamente en segundo plano
        await asegurarDocumentoNube();

        if (localStorage.getItem('personajeTripulacion')) {
            pantallaJuego.style.display = 'block';
        } else {
            pantallaPersonajes.style.display = 'block';
        }
    }
});

btnFirmar.addEventListener('click', async () => {
    if (!tieneFirma) {
        alert("Capitán, firme el lienzo para zarpar.");
        return;
    }

    // Inicializamos la base de datos al firmar por primera vez
    await asegurarDocumentoNube();

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
