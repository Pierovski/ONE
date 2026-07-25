import { reproducirEfecto } from './audio_motor.js';
import { intentarViajar, rutaIslas } from './mapa_motor.js'; 
import { docPartida } from './firebase_motor.js';
import { onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const btnVerReto = document.getElementById('btn-ver-reto');
const contadoresBerries = document.querySelectorAll('#contador-berries, #mercado-contador-berries');

const modalDesafio = document.getElementById('modal-desafio');
const modalTitulo = document.getElementById('modal-titulo');
const modalDescripcion = document.getElementById('modal-descripcion');
const modalTiempo = document.getElementById('modal-tiempo');
const modalRecompensa = document.getElementById('modal-recompensa');
const btnModalCancelar = document.getElementById('btn-modal-cancelar');
const btnModalAceptar = document.getElementById('btn-modal-aceptar');

let retosTotales = [];
let miId = localStorage.getItem('personajeTripulacion'); // Ej: 'luffy', 'zoro'
let estadoNube = null; // Guardará el estado en tiempo real

// 1. CARGAMOS EL CATÁLOGO DE RETOS
async function cargarRetos() {
    try {
        const respuesta = await fetch('retos_nivel_1.json');
        retosTotales = await respuesta.json();
    } catch (error) {
        console.error("Fallo al leer los mapas:", error);
    }
}

// 2. ESCUCHAMOS LA BASE DE DATOS EN TIEMPO REAL
onSnapshot(docPartida, (docSnap) => {
    if (docSnap.exists()) {
        estadoNube = docSnap.data();
        sincronizarInterfaz();
    }
});

// 3. ACTUALIZAMOS LA PANTALLA SEGÚN LO QUE DIGA LA NUBE
function sincronizarInterfaz() {
    if (!estadoNube) return;

    // Actualizamos billetera
    let misBerries = estadoNube[`berries_${miId}`] || 0;
    contadoresBerries.forEach(c => c.innerText = misBerries);

    const estado = estadoNube.estado_reto;
    const turno = estadoNube.turno_de;

    if (estado === "inactivo") {
        btnVerReto.innerHTML = "🎯";
        btnVerReto.style.borderColor = "var(--rojo-luffy)";
        btnVerReto.onclick = () => prepararSiguienteReto();
    } 
    else if (estado === "en_progreso") {
        if (turno === miId) {
            btnVerReto.innerHTML = "📤"; 
            btnVerReto.style.borderColor = "#e5b842";
            btnVerReto.onclick = () => marcarComoPendiente();
        } else {
            btnVerReto.innerHTML = "⏳"; 
            btnVerReto.style.borderColor = "var(--marron-tinta)";
            btnVerReto.onclick = () => alert("Tu pareja está realizando su reto...");
        }
    } 
    else if (estado === "pendiente_validacion") {
        if (turno === miId) {
            btnVerReto.innerHTML = "👀";
            btnVerReto.style.borderColor = "var(--marron-tinta)";
            btnVerReto.onclick = () => alert("Esperando a que tu pareja valide tu prueba...");
        } else {
            btnVerReto.innerHTML = "✅"; 
            btnVerReto.style.borderColor = "#2e7d32";
            btnVerReto.onclick = () => validarRetoNube();
        }
    }
}

// 4. LÓGICA DE ACEPTAR UN RETO NUEVO
function prepararSiguienteReto() {
    let indiceIsla = parseInt(localStorage.getItem('indiceIslaActual')) || 0;
    let nombreIslaActual = rutaIslas[indiceIsla].nombre;
    let completados = estadoNube.retos_completados || [];

    let disponibles = retosTotales.filter(r => !completados.includes(r.id) && r.isla === nombreIslaActual);

    if (disponibles.length === 0) {
        alert("La marea está tranquila por aquí. ¡Viajen a la siguiente isla!");
        return;
    }

    const retoAleatorio = disponibles[Math.floor(Math.random() * disponibles.length)];
    mostrarDetallesReto(retoAleatorio);
}

function mostrarDetallesReto(reto) {
    modalTitulo.innerText = reto.titulo;
    modalDescripcion.innerText = reto.descripcion;
    modalTiempo.innerText = `⏳ ${reto.tiempo_limite_minutos} min`;
    modalRecompensa.innerText = `💰 ${reto.recompensa_berries} Berries | ⛵ +${reto.recompensa_millas} Millas`;
    
    btnModalAceptar.disabled = false;
    modalDesafio.style.display = 'flex';

    btnModalCancelar.onclick = () => { modalDesafio.style.display = 'none'; };

    btnModalAceptar.onclick = async () => {
        btnModalAceptar.disabled = true;
        modalDesafio.style.display = 'none'; 
        reproducirEfecto('sfx-reto-aceptado.mp3');
        
        // Avisamos a la nube que tomamos el reto
        await updateDoc(docPartida, {
            estado_reto: "en_progreso",
            turno_de: miId,
            reto_activo: reto
        });

        const msj = `¡Capitán! He aceptado el reto: 🎯 *${reto.titulo}*.\nTienes ${reto.tiempo_limite_minutos} min. ¿Estás lista?`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msj)}`, '_blank');
    };
}

// 5. AVISAR QUE YA SE ENVIÓ LA PRUEBA
async function marcarComoPendiente() {
    btnVerReto.onclick = null; // Freno anti-spam
    await updateDoc(docPartida, {
        estado_reto: "pendiente_validacion"
    });
}

// 6. VALIDAR LA PRUEBA DE LA PAREJA Y PAGAR
async function validarRetoNube() {
    btnVerReto.onclick = null; // Freno anti-spam
    const retoActivo = estadoNube.reto_activo;
    const turno = estadoNube.turno_de; // Quien hizo el reto

    let completados = estadoNube.retos_completados || [];
    completados.push(retoActivo.id);

    let nuevasMillas = (estadoNube.millas_totales || 0) + retoActivo.recompensa_millas;
    let berriesActuales = estadoNube[`berries_${turno}`] || 0;

    // Reseteamos el tablero y pagamos
    await updateDoc(docPartida, {
        estado_reto: "inactivo",
        turno_de: null,
        reto_activo: null,
        retos_completados: completados,
        millas_totales: nuevasMillas,
        [`berries_${turno}`]: berriesActuales + retoActivo.recompensa_berries
    });

    reproducirEfecto('sfx-berries.mp3');
    
    setTimeout(() => {
        intentarViajar(nuevasMillas); 
    }, 1000);
}

cargarRetos();
