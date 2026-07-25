const btnHistorial = document.getElementById('btn-historial');
const modalHistorial = document.getElementById('modal-historial');
const btnCerrarHistorial = document.getElementById('btn-cerrar-historial');
const listaHistorial = document.getElementById('lista-historial');

// Abrir la bitácora
btnHistorial.addEventListener('click', () => {
    renderizarHistorial();
    modalHistorial.style.display = 'flex';
});

// Cerrar la bitácora
btnCerrarHistorial.addEventListener('click', () => {
    modalHistorial.style.display = 'none';
});

function renderizarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historialRetos')) || [];
    listaHistorial.innerHTML = ''; // Limpiamos el contenedor

    if (historial.length === 0) {
        const mensajeVacio = document.createElement('p');
        mensajeVacio.style.textAlign = 'center';
        mensajeVacio.style.fontStyle = 'italic';
        mensajeVacio.style.fontSize = '14px';
        mensajeVacio.style.color = 'var(--marron-tinta)';
        mensajeVacio.textContent = 'La bitácora está en blanco. ¡Sal a conquistar el mar!';
        listaHistorial.appendChild(mensajeVacio);
        return;
    }

    historial.forEach(item => {
        // Contenedor principal del ítem
        const div = document.createElement('div');
        div.className = 'item-historial';

        // Título del reto
        const titulo = document.createElement('h4');
        titulo.textContent = item.titulo;

        // Contenedor de datos extra
        const datosExtra = document.createElement('div');
        datosExtra.className = 'datos-extra';

        // Fecha
        const spanFecha = document.createElement('span');
        spanFecha.textContent = `🗓️ ${item.fecha}`;

        // Recompensa
        const spanBerries = document.createElement('span');
        spanBerries.textContent = `💰 +${item.berries} Berries`;

        // Ensamblaje seguro
        datosExtra.appendChild(spanFecha);
        datosExtra.appendChild(spanBerries);
        
        div.appendChild(titulo);
        div.appendChild(datosExtra);
        
        listaHistorial.appendChild(div);
    });
}
