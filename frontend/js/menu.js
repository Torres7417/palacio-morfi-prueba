let todosLosPlatos = [];

async function cargarMenu() {
  const container = document.getElementById('platos-container');
  try {
    todosLosPlatos = await apiFetch('/platos');
    renderPlatos(todosLosPlatos);
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">⚠️</div>
        <p>No se pudo cargar el menú.</p>
        <p style="font-size:0.85rem;margin-top:0.5rem">${error.message}</p>
        <p style="font-size:0.8rem;margin-top:0.75rem;color:#999">
          Verificá que el backend esté corriendo y la URL en config.js sea correcta.
        </p>
      </div>`;
  }
}

function renderPlatos(platos) {
  const container = document.getElementById('platos-container');

  if (!platos.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">🍽️</div>
        <p>No hay platos disponibles en esta categoría.</p>
      </div>`;
    return;
  }

  container.innerHTML = platos
    .map(
      (p) => `
    <div class="plato-card ${p.disponible ? '' : 'no-disponible'}">
      <div class="plato-categoria">${p.categoria}</div>
      <div class="plato-nombre">${p.nombre}</div>
      <div class="plato-desc">${p.descripcion || ''}</div>
      <div class="plato-footer">
        <span class="plato-precio">${formatPrecio(p.precio)}</span>
        <span class="badge ${p.disponible ? 'badge-success' : 'badge-danger'}">
          ${p.disponible ? 'Disponible' : 'No disponible'}
        </span>
      </div>
    </div>`
    )
    .join('');
}

// Filtros
document.getElementById('filtros').addEventListener('click', (e) => {
  if (!e.target.classList.contains('filter-btn')) return;

  document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
  e.target.classList.add('active');

  const cat = e.target.dataset.cat;
  if (cat === 'todos') {
    renderPlatos(todosLosPlatos);
  } else {
    renderPlatos(todosLosPlatos.filter((p) => p.categoria === cat));
  }
});

cargarMenu();
