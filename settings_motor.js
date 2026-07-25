/**
 * SETTINGS MOTOR - GRAND LINE HEARTS
 * Gestión de la memoria, tripulación y mantenimiento.
 */
import { docPartida } from './firebase_motor.js';
import { updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const btnsDespejarNiebla = document.querySelectorAll('#btn-limpiar-cache, #btn-limpiar-cache-mapa');
const nombreJugadorPantalla = document.getElementById('nombre-jugador');
const imagenAvatarPantalla = document.getElementById('img-avatar');

// 1. FUNCIÓN LETAL CORREGIDA: Destruye la caché y el Service Worker zombi
btnsDespejarNiebla.forEach(btn => {
    btn.addEventListener('click', () => {
        const relampago = document.createElement('div');
        relampago.style.position = 'fixed';
        relampago.style.top = '0'; relampago.style.left = '0';
        relampago.style.width = '100vw'; relampago.style.height = '100vh';
        relampago.style.zIndex = '9999'; relampago.className = 'efecto-rayo';
        document.body.appendChild(relampago);

        // Borramos los archivos guardados
        if ('caches' in window) {
            caches.keys().then((nombresCaché) => {
                nombresCaché.forEach((nombre) => caches.delete(nombre));
            });
        }

        // Aniquilamos el Service Worker actual para forzar la actualización
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (let registration of registrations) {
                    registration.unregister();
                }
            });
        }

        setTimeout(() => {
            alert('¡Haki del Conquistador desatado! La niebla y la memoria se han despejado.');
            // Almacenamiento local se mantiene intacto para no perder tu personaje, 
            // solo limpiamos la caché de red.
            window.location.reload(true);
        }, 500);
    });
});

// 2. GESTIÓN DE LA TRIPULACIÓN CON FIREBASE
export async function asignarPersonaje(nombreId, nombreLegible) {
    localStorage.setItem('personajeTripulacion', nombreId);
    localStorage.setItem('personajeNombreLegible', nombreLegible);
    
    // Registramos en la nube qué personaje acaba de entrar
    try {
        await updateDoc(docPartida, {
            [`jugador_${nombreId}_activo`]: true
        });
    } catch (e) {
        console.error("Error sincronizando tripulante con la Marina:", e);
    }

    actualizarInterfazPersonaje();
}

function actualizarInterfazPersonaje() {
    const personajeGuardado = localStorage.getItem('personajeTripulacion') || 'default';
    const nombreGuardado = localStorage.getItem('personajeNombreLegible') || 'Capitán';

    if (nombreJugadorPantalla) nombreJugadorPantalla.innerText = nombreGuardado;

    if (imagenAvatarPantalla) {
        imagenAvatarPantalla.src = `assets/img/avatar-${personajeGuardado}.png`;
        imagenAvatarPantalla.onerror = () => {
            imagenAvatarPantalla.src = 'assets/img/avatar-placeholder.png'; 
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarInterfazPersonaje();
});
