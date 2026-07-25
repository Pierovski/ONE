<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Grand Line Hearts</title>
    
    <link rel="manifest" href="manifest.json">
    
    <link rel="preload" href="assets/img/pergamino.png" as="image">
    <link rel="preload" href="assets/img/mapa-base.jpg" as="image">
    <link rel="preload" href="assets/audio/sfx-pacto-firmado.mp3" as="audio">

    <link rel="stylesheet" href="pergamino.css">
    <link rel="stylesheet" href="mapa.css">
</head>
<body>

    <section id="pantalla-pergamino" class="pantalla-activa">
        <div class="pergamino-contenedor">
            <h1 class="titulo-pirata">Acuerdo de Tripulación</h1>
            
            <div class="texto-reglas">
                <p><strong>I. Consentimiento Absoluto:</strong> Ambos deben estar de acuerdo antes de iniciar cualquier reto.</p>
                <p><strong>II. Privacidad Total:</strong> Todo lo compartido en la app es estrictamente confidencial.</p>
                <p><strong>III. Honestidad Pirata:</strong> Responder con la verdad a los Log Poses de la verdad.</p>
                <p><strong>IV. Comunicación Abierta:</strong> Hablar si un reto causa incomodidad para pausarlo.</p>
                <p><strong>V. Objetivo: Diversión:</strong> El fin es pasar un buen rato juntos y conectar.</p>
            </div>
            
            <div class="zona-firma">
                <p class="etiqueta-firma">Firma del Capitán:</p>
                <canvas id="lienzo-firma" width="280" height="100"></canvas>
            </div>

            <button id="btn-firmar-pacto" class="boton-dorado">Sellar Pacto y Zarpar</button>
        </div>
        
        <button id="btn-limpiar-cache" class="boton-circular-mini cache-flotante" title="Mantenimiento">🌪️</button>
    </section>

    <section id="pantalla-personajes" class="pantalla-oculta" style="display: none;">
        <h2>Elige tu Capitán</h2>
        <p class="subtitulo-seleccion">Cada tripulante otorga una ventaja única en tu travesía</p>
        
        <main class="grid-personajes" id="contenedor-seleccion"></main>
        
        <div style="padding: 0 20px;">
            <button id="btn-confirmar-tripulante" class="boton-dorado" disabled>Confirmar Selección</button>
        </div>
    </section>

    <section id="pantalla-juego" class="pantalla-oculta" style="display: none;">
        <main class="mapa-interactivo" id="contenedor-mapa"></main>
        
        <div class="hud-superior">
            <div class="avatar-flotante">
                <img src="assets/img/avatar-placeholder.png" alt="Mi Avatar" id="img-avatar">
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; align-items: flex-end; pointer-events: auto;">
                <div class="billetera-flotante">
                    <span class="icono-moneda">💰</span>
                    <span id="contador-berries">0</span>
                </div>
                <button id="btn-limpiar-cache-mapa" class="boton-circular-mini" title="Despejar Niebla">🌪️</button>
            </div>
            <div style="display:none;">
                <h3 id="nombre-jugador">Capitán</h3>
                <p class="rango-isla">Nivel</p>
            </div>
        </div>
        
        <div class="hud-inferior" style="justify-content: center; gap: 25px; padding-bottom: 10px;">
            <button id="btn-historial" class="boton-circular-hud">📜</button>
            <button id="btn-ver-reto" class="boton-circular-hud principal">🎯</button>
            <button id="btn-mercado-negro" class="boton-circular-hud">🍎</button>
        </div>
    </section>

    <section id="pantalla-mercado" class="pantalla-oculta" style="display: none;">
        <header class="cabecera-mercado">
            <button id="btn-cerrar-mercado" class="boton-secundario">⬅ Volver</button>
            <div class="billetera-berries" style="pointer-events: auto; background: rgba(13, 34, 61, 0.65); color: #e5b842;">💰 <span id="mercado-contador-berries">0</span></div>
        </header>
        <h2>Mercado Clandestino</h2>
        <main class="contenedor-frutas" id="lista-frutas"></main>
    </section>

    <div id="modal-desafio" class="modal-oculto">
        <div class="modal-pergamino">
            <h3 id="modal-titulo">Título del Desafío</h3>
            <p id="modal-descripcion">Descripción completa de la misión...</p>
            <div class="modal-datos">
                <span id="modal-tiempo">⏳ 0 min</span>
                <span id="modal-recompensa">💰 0 Berries</span>
            </div>
            <div class="modal-botones">
                <button id="btn-modal-cancelar" class="boton-secundario" style="margin:0;">Rechazar</button>
                <button id="btn-modal-aceptar" class="boton-dorado" style="margin:0;">Aceptar Reto</button>
            </div>
        </div>
    </div>

    <div id="modal-historial" class="modal-oculto">
        <div class="modal-pergamino" style="max-height: 80vh; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 10px;">Bitácora de Viaje</h3>
            <div id="lista-historial" style="overflow-y: auto; flex: 1; text-align: left; padding-right: 5px; gap: 10px; display: flex; flex-direction: column;">
                </div>
            <button id="btn-cerrar-historial" class="boton-dorado" style="margin-top: 15px;">Cerrar Registro</button>
        </div>
    </div>
    
    <script type="module" src="auth_pergamino.js"></script>
    <script type="module" src="personajes_motor.js"></script> 
    <script type="module" src="retos_motor.js"></script>
    <script type="module" src="mercado_frutas.js"></script>
    <script type="module" src="settings_motor.js"></script>
    <script type="module" src="mapa_motor.js"></script> 
    <script type="module" src="historial_motor.js"></script>

    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(reg => console.log('Log Pose de Red Activo (SW Registrado):', reg.scope))
                    .catch(err => console.error('Tormenta en la Red, falló el SW:', err));
            });
        }
    </script>
</body>
</html>
