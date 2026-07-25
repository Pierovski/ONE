/**
 * AUDIO MOTOR - GRAND LINE HEARTS
 * Gestión de ambientes musicales y efectos de sonido de One Piece.
 */

// Repositorio de instancias de audio
const pistasFondo = {
    mapa: new Audio('assets/audio/musica-mapa.mp3'),
    mercado: new Audio('assets/audio/musica-mercado.mp3')
};

// Configuramos los bucles de la música de fondo
pistasFondo.mapa.loop = true;
pistasFondo.mercado.loop = true;
pistasFondo.mapa.volume = 0.4;
pistasFondo.mercado.volume = 0.4;

let pistaActiva = null;

// 1. DESBLOQUEO CRUCIAL PARA MÓVILES
// Esta función despierta el motor de audio tras el primer toque físico del usuario
export function inicializarAudioSeguro() {
    // Tocamos y pausamos instantáneamente los audios en silencio absoluto
    Object.values(pistasFondo).forEach(audio => {
        audio.play().then(() => {
            audio.pause();
        }).catch(e => console.log("Audio esperando interacción activa."));
    });
}

// 2. CONTROLADOR DE MÚSICA DE FONDO (CON TRANSICIÓN LIMPIA)
export function cambiarMusicaFondo(nombrePista) {
    if (pistaActiva) {
        pistasFondo[pistaActiva].pause();
        pistasFondo[pistaActiva].currentTime = 0;
    }

    if (pistasFondo[nombrePista]) {
        pistasFondo[nombrePista].play().catch(() => {
            console.log("Auto-play bloqueado temporalmente por el navegador.");
        });
        pistaActiva = nombrePista;
    }
}

// 3. REPRODUCTOR DE EFECTOS DE SONIDO (DISPARO INSTANTÁNEO)
export function reproducirEfecto(nombreArchivo) {
    const sfx = new Audio(`assets/audio/${nombreArchivo}`);
    sfx.volume = 0.7;
    sfx.play().catch(e => console.log("Efecto de sonido bloqueado:", e));
}
