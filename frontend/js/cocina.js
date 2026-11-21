const ESTADOS_SIGUIENTES = {
  pendiente: { next: 'en_cocina', label: 'Comenzar', class: 'btn-warning' },
  en_cocina: { next: 'listo', label: 'Marcar listo', class: 'btn-success' },
  listo: { next: 'entregado', label: 'Entregar', class: 'btn-primary' },
};

async function cargarPedidos() {
  const container = document.getElementById('pedidos-container');
  try {
    const pedidos = await apiFetch('/pedidos/activos');
    renderPedidos(pedidos);
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">⚠️</div>
        <p>Error al cargar pedidos: ${error.message}</p>
      </div>`;
  }
}

function renderPedidos(pedidos) {
  const container = document.getElementById('pedidos-container');

  if (!pedidos.length) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="icon">✅</div>
        <p>No hay pedidos activos en este momento.</p>
      </div>`;
    return;
  }

  container.innerHTML = pedidos
    .map((p) => {
      const tipoLabel =
        p.tipo === 'salon' ? `Mesa ${p.mesa}` : p.tipo === 'delivery' ? 'Delivery' : 'Para llevar';
      const tipoClass = `tipo-${p.tipo}`;
      const accion = ESTADOS_SIGUIENTES[p.estado];

      const itemsHtml = p.items
        .map(
          (item) => `
        <div class="pedido-item">
          <span><strong>${item.cantidad}x</strong> ${item.nombre}
            ${item.observaciones ? `<span class="pedido-item-obs">(${item.observaciones})</span>` : ''}
          </span>
        </div>`
        )
        .join('');

      let extraInfo = '';
      if (p.tipo === 'delivery' && p.delivery) {
        extraInfo = `
          <div style="margin-top:0.5rem;font-size:0.8rem;color:var(--text-muted)">
            👤 ${p.delivery.cliente_nombre} · 📞 ${p.delivery.telefono}<br/>
            📍 ${p.delivery.direccion}
            ${p.delivery.referencias ? ` (${p.delivery.referencias})` : ''}
          </div>`;
      }

      return `
      <div class="pedido-card estado-${p.estado}">
        <div class="pedido-card-header">
          <div>
            <span class="tipo-badge ${tipoClass}">${tipoLabel}</span>
            ${p.mozo ? `<span style="font-size:0.8rem;margin-left:0.4rem;color:var(--text-muted)">· ${p.mozo}</span>` : ''}
          </div>
          <div style="text-align:right">
            <div style="font-size:0.8rem;color:var(--text-muted)">${formatHora(p.fecha_hora)}</div>
            <span class="badge badge-${p.estado === 'pendiente' ? 'warning' : p.estado === 'en_cocina' ? 'info' : 'success'}">
              ${p.estado.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div class="pedido-card-body">
          ${itemsHtml}
          ${extraInfo}
          <div style="margin-top:0.75rem;font-weight:700">${formatPrecio(p.total)}</div>
        </div>
        <div class="pedido-card-footer">
          ${
            accion
              ? `<button class="btn ${accion.class} btn-sm" onclick="cambiarEstado('${p._id}', '${accion.next}')">
                  ${accion.label}
                </button>`
              : ''
          }
          <button class="btn btn-outline btn-sm" onclick="cambiarEstado('${p._id}', 'cancelado')" style="margin-left:auto">
            Cancelar
          </button>
        </div>
      </div>`;
    })
    .join('');
}

async function cambiarEstado(id, nuevoEstado) {
  try {
    await apiFetch(`/pedidos/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    showToast(`Pedido actualizado → ${nuevoEstado.replace('_', ' ')}`);
    cargarPedidos();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Carga inicial + auto-refresh cada 15 segundos
cargarPedidos();
setInterval(cargarPedidos, 15000);
