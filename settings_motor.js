/**
 * SETTINGS MOTOR - GRAND LINE HEARTS
 * Gestión de la memoria caché, estados de la tripulación y mantenimiento técnico.
 */

// Capturamos AMBOS botones de limpiar caché (el del pergamino y el del mapa)
const btnsDespejarNiebla = document.querySelectorAll('#btn-limpiar-cache, #btn-limpiar-cache-mapa');
const nombreJugadorPantalla = document.getElementById('nombre-jugador');
const imagenAvatarPantalla = document.getElementById('img-avatar');

// 1. FUNCIÓN LETAL: Despejar Niebla del Mar asignada a todos los botones
btnsDespejarNiebla.forEach(btn => {
    btn.addEventListener('click', () => {
        const relampago = document.createElement('div');
        relampago.style.position = 'fixed';
        relampago.style.top = '0'; relampago.style.left = '0';
        relampago.style.width = '100vw'; relampago.style.height = '100vh';
        relampago.style.zIndex = '9999'; relampago.className = 'efecto-rayo';
        document.body.appendChild(relampago);

        if ('caches' in window) {
            caches.keys().then((nombresCaché) => {
                nombresCaché.forEach((nombre) => {
                    caches.delete(nombre);
                });
            });
        }

        setTimeout(() => {
            alert('¡Haki del Conquistador desatado! La niebla se ha despejado.');
            window.location.reload(true);
        }, 400);
    });
});

// 2. GESTIÓN DE LA TRIPULACIÓN
export function asignarPersonaje(nombreId, nombreLegible) {
    localStorage.setItem('personajeTripulacion', nombreId);
    localStorage.setItem('personajeNombreLegible', nombreLegible);
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
