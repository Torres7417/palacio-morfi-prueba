async function cargarResumen() {
  const container = document.getElementById('resumen');
  try {
    const data = await apiFetch('/ventas/resumen');

    container.innerHTML = `
      <div class="resumen-card">
        <div class="valor">${formatPrecio(data.total)}</div>
        <div class="label">Total del día</div>
      </div>
      <div class="resumen-card">
        <div class="valor">${data.cantidad_ventas}</div>
        <div class="label">Cantidad de ventas</div>
      </div>
      <div class="resumen-card">
        <div class="valor">${formatPrecio(data.por_tipo?.salon || 0)}</div>
        <div class="label">Salón</div>
      </div>
      <div class="resumen-card">
        <div class="valor">${formatPrecio(data.por_tipo?.delivery || 0)}</div>
        <div class="label">Delivery</div>
      </div>
      <div class="resumen-card">
        <div class="valor">${formatPrecio(data.por_tipo?.para_llevar || 0)}</div>
        <div class="label">Para llevar</div>
      </div>
      <div class="resumen-card">
        <div class="valor">${formatPrecio(data.por_metodo_pago?.efectivo || 0)}</div>
        <div class="label">Efectivo</div>
      </div>
      <div class="resumen-card">
        <div class="valor">${formatPrecio(data.por_metodo_pago?.transferencia || 0)}</div>
        <div class="label">Transferencia</div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<div class="empty-state"><p>Error: ${error.message}</p></div>`;
  }
}

async function cargarVentas() {
  const container = document.getElementById('lista-ventas');
  try {
    const ventas = await apiFetch('/ventas');
    if (!ventas.length) {
      container.innerHTML = `<div class="empty-state"><div class="icon">📭</div><p>No hay ventas registradas aún.</p></div>`;
      return;
    }

    container.innerHTML = `
      <div style="background:var(--card-bg);border-radius:var(--radius);box-shadow:var(--shadow);border:1px solid var(--border);overflow:hidden">
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
          <thead>
            <tr style="background:#faf8f5;text-align:left">
              <th style="padding:0.75rem 1rem">Hora</th>
              <th style="padding:0.75rem 1rem">Tipo</th>
              <th style="padding:0.75rem 1rem">Pago</th>
              <th style="padding:0.75rem 1rem;text-align:right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${ventas
              .slice(0, 30)
              .map(
                (v) => `
              <tr style="border-top:1px solid var(--border)">
                <td style="padding:0.65rem 1rem">${formatHora(v.fecha)}</td>
                <td style="padding:0.65rem 1rem">
                  <span class="tipo-badge tipo-${v.tipo}">${v.tipo.replace('_', ' ')}</span>
                </td>
                <td style="padding:0.65rem 1rem">${v.metodo_pago}</td>
                <td style="padding:0.65rem 1rem;text-align:right;font-weight:600">${formatPrecio(v.total)}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>`;
  } catch (error) {
    container.innerHTML = `<div class="empty-state"><p>Error: ${error.message}</p></div>`;
  }
}

cargarResumen();
cargarVentas();
