
const CACHE_NAME = 'grand-line-hearts-v2'; 

const ASSETS_A_GUARDAR = [
    './',
    './index.html',
    './mapa.css',
    './pergamino.css',
    './auth_pergamino.js',
    './personajes_motor.js',
    './retos_motor.js',
    './mercado_frutas.js',
    './settings_motor.js',
    './mapa_motor.js',
    './firebase_motor.js', // El nuevo motor de la nube
    './audio_motor.js',
    './retos_nivel_1.json',
    './assets/img/mapa-base.jpg',
    './assets/img/pergamino.png',
    './assets/img/avatar-placeholder.png'
];

// 1. INSTALACIÓN: Guarda recursos y toma el control inmediatamente
self.addEventListener('install', (evento) => {
    self.skipWaiting(); // No espera a que la app se cierre para actualizarse
    evento.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_A_GUARDAR);
        })
    );
});

// 2. ACTIVACIÓN: Limpia los escombros de versiones viejas
self.addEventListener('activate', (evento) => {
    evento.waitUntil(
        caches.keys().then((claves) => {
            return Promise.all(
                claves.map((clave) => {
                    if (clave !== CACHE_NAME) {
                        return caches.delete(clave);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Fuerza a las pantallas abiertas a usar el nuevo SW
    );
});

// 3. INTERCEPCIÓN (STALE-WHILE-REVALIDATE): Rápido pero siempre actualizado
self.addEventListener('fetch', (evento) => {
    // Ignoramos las peticiones a la base de datos de Firebase, solo cacheamos archivos locales
    if (evento.request.url.includes('firestore.googleapis.com')) return;

    evento.respondWith(
        caches.match(evento.request).then((respuestaEnCache) => {
            // Disparamos la búsqueda en internet de fondo
            const peticionRed = fetch(evento.request).then((respuestaDeRed) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    // Actualizamos el caché con la versión más reciente y la devolvemos
                    cache.put(evento.request, respuestaDeRed.clone());
                    return respuestaDeRed;
                });
            }).catch(() => {
                // Si no hay internet, no pasa nada, ya tenemos la versión en caché
                console.log("Sin conexión. Usando versión offline.");
            });

            // Retornamos el caché al instante, si no hay caché, esperamos a la red
            return respuestaEnCache || peticionRed;
        })
    );
});
