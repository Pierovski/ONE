const CACHE_NAME = 'grand-line-hearts-v1';
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
    './historial_motor.js',
    './audio_motor.js',
    './retos_nivel_1.json',
    './assets/img/mapa-base.jpg',
    './assets/img/pergamino.png',
    './assets/img/avatar-placeholder.png'
];

// 1. INSTALACIÓN: Guarda los recursos esenciales en el celular
self.addEventListener('install', (evento) => {
    evento.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_A_GUARDAR);
        }).then(() => self.skipWaiting()) // Forzar activación
    );
});

// 2. ACTIVACIÓN: Elimina versiones antiguas de caché si las hubiera
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
        }).then(() => self.clients.claim())
    );
});

// 3. INTERCEPCIÓN DE PETICIONES: Estrategia Cache First (Ahorro de datos intercontinental)
self.addEventListener('fetch', (evento) => {
    evento.respondWith(
        caches.match(evento.request).then((recursoEnCache) => {
            // Si el archivo ya está en la memoria del cel, lo devuelve al instante. Si no, va a internet.
            return recursoEnCache || fetch(evento.request);
        })
    );
});
