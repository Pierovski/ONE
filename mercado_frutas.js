import { cambiarMusicaFondo, reproducirEfecto } from './audio_motor.js';
import { docPartida } from './firebase_motor.js';
import { onSnapshot, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const pantallaJuego = document.getElementById('pantalla-juego');
const pantallaMercado = document.getElementById('pantalla-mercado');
const btnAbrirMercado = document.getElementById('btn-mercado-negro');
const btnCerrarMercado = document.getElementById('btn-cerrar-mercado');
const listaFrutas = document.getElementById('lista-frutas');

const contadoresBerries = document.querySelectorAll('#contador-berries, #mercado-contador-berries');
let miId = localStorage.getItem('personajeTripulacion');
let misBerriesNube = 0;

// 1. ESCUCHAMOS LA BILLETERA EN LA NUBE
onSnapshot(docPartida, (docSnap) => {
    if (docSnap.exists()) {
        const data = docSnap.data();
        misBerriesNube = data[`berries_${miId}`] || 0;
        actualizarPantallaBerries();
    }
});

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

    // Asignamos el evento de compra a cada botón
    document.querySelectorAll('.btn-comprar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const precio = parseInt(e.target.getAttribute('data-precio'));
            const nombre = e.target.getAttribute('data-nombre');
            ejecutarCompra(nombre, precio, e.target);
        });
    });
}

async function ejecutarCompra(nombre, precio, botonHtml) {
    if (misBerriesNube >= precio) {
        botonHtml.disabled = true; // Freno anti-spam
        try {
            // Descontamos el dinero directamente en la base de datos
            await updateDoc(docPartida, {
                [`berries_${miId}`]: increment(-precio)
            });
            
            reproducirEfecto('sfx-fruta-comprada.mp3');
            alert(`¡Pacto sellado! Has adquirido la ${nombre}.`);
        } catch(e) {
            alert("Hubo un error de conexión con la red de contrabando.");
        } finally {
            botonHtml.disabled = false; // Liberamos el botón
        }
    } else {
        alert('Fondos insuficientes.');
    }
}

function actualizarPantallaBerries() {
    contadoresBerries.forEach(contador => contador.innerText = misBerriesNube);
}
