import { reproducirEfecto } from './audio_motor.js';
import { intentarViajar } from './mapa_motor.js'; 

const btnVerReto = document.getElementById('btn-ver-reto');
const contadoresBerries = document.querySelectorAll('#contador-berries, #mercado-contador-berries');

// Elementos del Modal
const modalDesafio = document.getElementById('modal-desafio');
const modalTitulo = document.getElementById('modal-titulo');
const modalDescripcion = document.getElementById('modal-descripcion');
const modalTiempo = document.getElementById('modal-tiempo');
const modalRecompensa = document.getElementById('modal-recompensa');
const btnModalCancelar = document.getElementById('btn-modal-cancelar');
const btnModalAceptar = document.getElementById('btn-modal-aceptar');

let retosDisponibles = [];
let retoElegidoActual = null;

// Memoria Económica y de Progreso
let misBerries = parseInt(localStorage.getItem('misBerries')) || 500;
let misMillas = parseInt(localStorage.getItem('misMillas')) || 0; 
actualizarPantallaBerries();

async function cargarRetos() {
    try {
        const respuesta = await fetch('retos_nivel_1.json');
        retosDisponibles = await respuesta.json();
        prepararSiguienteReto();
    } catch (error) {
        console.error("La Marina interceptó el mapa:", error);
    }
}

function prepararSiguienteReto() {
    if (retosDisponibles.length === 0) {
        btnVerReto.style.display = 'none'; 
        return;
    }

    const indiceAleatorio = Math.floor(Math.random() * retosDisponibles.length);
    retoElegidoActual = retosDisponibles[indiceAleatorio];

    // Estado 1: Reto sin abrir (Icono 🎯)
    btnVerReto.innerHTML = "🎯";
    btnVerReto.style.borderColor = "var(--rojo-luffy)";
    btnVerReto.onclick = () => mostrarDetallesReto();
}

function mostrarDetallesReto() {
    modalTitulo.innerText = retoElegidoActual.titulo;
    modalDescripcion.innerText = retoElegidoActual.descripcion;
    modalTiempo.innerText = `⏳ ${retoElegidoActual.tiempo_limite_minutos} min`;
    modalRecompensa.innerText = `💰 ${retoElegidoActual.recompensa_berries} Berries | ⛵ +${retoElegidoActual.recompensa_millas} Millas`;
    
    modalDesafio.style.display = 'flex';

    btnModalCancelar.onclick = () => {
        modalDesafio.style.display = 'none'; 
    };

    btnModalAceptar.onclick = () => {
        modalDesafio.style.display = 'none'; 
        reproducirEfecto('sfx-reto-aceptado.mp3');
        
        // --- EL DEN DEN MUSHI (INTEGRACIÓN WHATSAPP) ---
        const mensajeTexto = `¡Capitán! Acabo de anclar en ${retoElegidoActual.isla} y he aceptado el reto: 🎯 *${retoElegidoActual.titulo}*.\n\nTienes ${retoElegidoActual.tiempo_limite_minutos} minutos para prepararte. ¿Estás lista?`;
        const mensajeCodificado = encodeURIComponent(mensajeTexto);
        window.open(`https://wa.me/?text=${mensajeCodificado}`, '_blank');
        
        // Estado 2: Reto en proceso (Icono ✅)
        btnVerReto.innerHTML = "✅";
        btnVerReto.style.borderColor = "#2e7d32"; 
        btnVerReto.onclick = () => validarRetoCompletado();
    };
}

function validarRetoCompletado() {
    // 1. Sumamos recompensas
    misBerries += retoElegidoActual.recompensa_berries;
    misMillas += retoElegidoActual.recompensa_millas;
    
    localStorage.setItem('misBerries', misBerries);
    localStorage.setItem('misMillas', misMillas);
    
    // 2. Guardamos el recuerdo en la Bitácora Historial
    let historial = JSON.parse(localStorage.getItem('historialRetos')) || [];
    historial.unshift({
        titulo: retoElegidoActual.titulo,
        fecha: new Date().toLocaleDateString('es-PE'), 
        berries: retoElegidoActual.recompensa_berries
    });
    localStorage.setItem('historialRetos', JSON.stringify(historial));
    
    // 3. Actualizamos la interfaz
    actualizarPantallaBerries();
    reproducirEfecto('sfx-berries.mp3');
    
    retosDisponibles = retosDisponibles.filter(r => r.id !== retoElegidoActual.id);
    window.dispatchEvent(new Event('berriesActualizados'));
    
    // Estado 3: Reto superado (Icono ✨)
    btnVerReto.innerHTML = "✨";
    
    // 4. Revisamos si con estas millas podemos viajar
    setTimeout(() => {
        intentarViajar(misMillas); 
        prepararSiguienteReto();
    }, 1000);
}

function actualizarPantallaBerries() {
    contadoresBerries.forEach(contador => contador.innerText = misBerries);
}

// Escuchamos si compran frutas en el mercado para restar dinero
window.addEventListener('berriesActualizados', () => {
    misBerries = parseInt(localStorage.getItem('misBerries')) || 0;
    actualizarPantallaBerries();
});

cargarRetos();
