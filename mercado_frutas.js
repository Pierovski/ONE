import { cambiarMusicaFondo, reproducirEfecto } from './audio_motor.js';

const pantallaJuego = document.getElementById('pantalla-juego');
const pantallaMercado = document.getElementById('pantalla-mercado');
const btnAbrirMercado = document.getElementById('btn-mercado-negro');
const btnCerrarMercado = document.getElementById('btn-cerrar-mercado');
const listaFrutas = document.getElementById('lista-frutas');

const contadoresBerries = document.querySelectorAll('#contador-berries, #mercado-contador-berries');
let misBerries = parseInt(localStorage.getItem('misBerries')) || 500; 
actualizarPantallaBerries();

btnAbrirMercado.addEventListener('click', () => {
    pantallaJuego.style.display = 'none';
    pantallaMercado.style.display = 'block';
    cambiarMusicaFondo('mercado');
    cargarMercado();
});

btnCerrarMercado.addEventListener('click', () => {
    pantallaMercado.style.display = 'none';
    pantallaJuego.style.display = 'block';
    cambiarMusicaFondo('mapa'); 
});

async function cargarMercado() {
    try {
        const respuesta = await fetch('catalogo_frutas.json');
        const frutas = await respuesta.json();
        renderizarFrutas(frutas);
    } catch (error) {
        listaFrutas.innerHTML = '<p>El mercado negro ha sido clausurado por la Marina.</p>';
    }
}

function renderizarFrutas(frutas) {
    listaFrutas.innerHTML = ''; 
    
    frutas.forEach(fruta => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-fruta';
        tarjeta.innerHTML = `
            <img src="${fruta.imagen}" class="img-fruta-mercado" alt="${fruta.nombre}">
            <h4>${fruta.nombre}</h4>
            <p>${fruta.descripcion}</p>
            <button class="boton-dorado btn-comprar" data-precio="${fruta.precio_berries}" data-nombre="${fruta.nombre}">
                Comprar (${fruta.precio_berries} 💰)
            </button>
        `;
        listaFrutas.appendChild(tarjeta);
    });

    document.querySelectorAll('.btn-comprar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const precio = parseInt(e.target.getAttribute('data-precio'));
            const nombre = e.target.getAttribute('data-nombre');
            ejecutarCompra(nombre, precio);
        });
    });
}

function ejecutarCompra(nombre, precio) {
    if (misBerries >= precio) {
        misBerries -= precio; 
        localStorage.setItem('misBerries', misBerries); 
        actualizarPantallaBerries();
        
        reproducirEfecto('sfx-fruta-comprada.mp3');
        
        // SINCRONIZACIÓN: Avisamos a retos_motor de la compra
        window.dispatchEvent(new Event('berriesActualizados'));
        
        alert(`¡Pacto sellado! Has adquirido la ${nombre}.`);
    } else {
        alert('Fondos insuficientes.');
    }
}

function actualizarPantallaBerries() {
    contadoresBerries.forEach(contador => contador.innerText = misBerries);
}

// SINCRONIZACIÓN: Escuchamos si ganamos dinero en los retos
window.addEventListener('berriesActualizados', () => {
    misBerries = parseInt(localStorage.getItem('misBerries')) || 0;
    actualizarPantallaBerries();
});
