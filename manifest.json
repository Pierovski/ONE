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
    listaHistorial.innerHTML = '';

    if (historial.length === 0) {
        listaHistorial.innerHTML = '<p style="text-align:center; font-style:italic; font-size: 13px; color: #5a3814;">La bitácora está en blanco. ¡Sal a conquistar el mar!</p>';
        return;
    }

    historial.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-historial';
        div.innerHTML = `
            <h4>${item.titulo}</h4>
            <div class="datos-extra">
                <span>🗓️ ${item.fecha}</span>
                <span>💰 +${item.berries} Berries</span>
            </div>
        `;
        listaHistorial.appendChild(div);
    });
}
