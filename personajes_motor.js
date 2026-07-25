import { asignarPersonaje } from './settings_motor.js';
import { reproducirEfecto } from './audio_motor.js';

const contenedorSelection = document.getElementById('contenedor-seleccion');
const btnConfirmar = document.getElementById('btn-confirmar-tripulante');
const pantallaPersonajes = document.getElementById('pantalla-personajes');
const pantallaJuego = document.getElementById('pantalla-juego');

const listaTripulantes = [
    { id: 'luffy', nombre: 'Monkey D. Luffy', rasgo: 'Voluntad D.: +5% Berries en retos de audacia.' },
    { id: 'zoro', nombre: 'Roronoa Zoro', rasgo: 'Corte Limpio: 5% de descuento en el mercado.' },
    { id: 'nami', nombre: 'Nami', rasgo: 'Clima Perfecto: Mapas intermedios dan doble de Berries.' },
    { id: 'sanji', nombre: 'Vinsmoke Sanji', rasgo: 'Pasión: Reduce el enfriamiento de las frutas.' }
];

let personajeSeleccionadoId = null;
let personajeSeleccionadoNombre = null;

function renderizarSeleccion() {
    contenedorSelection.innerHTML = '';
    
    listaTripulantes.forEach(p => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-personaje';
        tarjeta.id = `card-${p.id}`;
        
        // Inyección de imagen con PNG recolectado y tipografía Lora
        tarjeta.innerHTML = `
            <img src="assets/img/avatar-${p.id}.png" class="img-avatar-seleccion" alt="${p.nombre}" onerror="this.src='assets/img/avatar-placeholder.png'">
            <h4>${p.nombre}</h4>
            <p>${p.rasgo}</p>
        `;
        
        tarjeta.addEventListener('click', () => seleccionar(p.id, p.nombre));
        contenedorSelection.appendChild(tarjeta);
    });
}

function seleccionar(id, nombre) {
    document.querySelectorAll('.tarjeta-personaje').forEach(t => t.classList.remove('seleccionado'));
    
    const tarjetaElegida = document.getElementById(`card-${id}`);
    tarjetaElegida.classList.add('seleccionado');
    
    personajeSeleccionadoId = id;
    personajeSeleccionadoNombre = nombre;
    btnConfirmar.disabled = false; 
    
    // CORREGIDO: Sonido al elegir personaje (Ya no son monedas)
    reproducirEfecto('sfx-personaje-elegido.mp3'); 
}

btnConfirmar.addEventListener('click', () => {
    if (personajeSeleccionadoId) {
        asignarPersonaje(personajeSeleccionadoId, personajeSeleccionadoNombre);
        
        // El sonido de confirmación ya lo maneja auth_pergamino al zarpar
        pantallaPersonajes.style.display = 'none';
        pantallaJuego.style.display = 'block';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderizarSeleccion();
});
