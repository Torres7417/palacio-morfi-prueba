let todosLosPlatos = [];
let carrito = []; // { plato_id, nombre, precio, cantidad, observaciones }

// Llenar selector de mesas (1 a 13)
const mesaSelect = document.getElementById('mesa');
for (let i = 1; i <= 13; i++) {
  const opt = document.createElement('option');
  opt.value = i;
  opt.textContent = `Mesa ${i}`;
  mesaSelect.appendChild(opt);
}

// Cambio de tipo de pedido
document.getElementById('tipo-pedido').addEventListener('change', (e) => {
  const tipo = e.target.value;
  document.getElementById('grupo-mesa').style.display = tipo === 'salon' ? 'block' : 'none';
  document.getElementById('campos-delivery').style.display = tipo === 'delivery' ? 'block' : 'none';
});

async function cargarPlatos() {
  try {
    todosLosPlatos = await apiFetch('/platos?disponible=true');
    renderPlatos(todosLosPlatos);
  } catch (error) {
    document.getElementById('platos-container').innerHTML = `
      <div class="empty-state">
        <div class="icon">⚠️</div>
        <p>Error al cargar platos: ${error.message}</p>
      </div>`;
  }
}

function renderPlatos(platos) {
  const container = document.getElementById('platos-container');
  if (!platos.length) {
    container.innerHTML = '<div class="empty-state"><p>No hay platos disponibles</p></div>';
    return;
  }

  container.innerHTML = platos
    .map(
      (p) => `
    <div class="plato-card">
      <div class="plato-categoria">${p.categoria}</div>
      <div class="plato-nombre">${p.nombre}</div>
      <div class="plato-desc">${p.descripcion || ''}</div>
      <div class="plato-footer">
        <span class="plato-precio">${formatPrecio(p.precio)}</span>
        <button class="btn btn-primary btn-sm" onclick="agregarAlCarrito('${p._id}', '${p.nombre.replace(/'/g, "\\'")}', ${p.precio})">
          + Agregar
        </button>
      </div>
    </div>`
    )
    .join('');
}

function agregarAlCarrito(platoId, nombre, precio) {
  const existente = carrito.find((i) => i.plato_id === platoId);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({
      plato_id: platoId,
      nombre,
      precio,
      cantidad: 1,
      observaciones: '',
    });
  }
  renderCarrito();
  showToast(`${nombre} agregado`);
}

function cambiarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }
  renderCarrito();
}

function actualizarObs(index, valor) {
  carrito[index].observaciones = valor;
}

function renderCarrito() {
  const container = document.getElementById('carrito');
  const totalRow = document.getElementById('total-row');
  const btnEnviar = document.getElementById('btn-enviar');

  if (!carrito.length) {
    container.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;text-align:center;padding:1rem 0">Agregá platos al pedido</p>`;
    totalRow.style.display = 'none';
    btnEnviar.disabled = true;
    return;
  }

  let total = 0;
  container.innerHTML = carrito
    .map((item, i) => {
      const sub = item.precio * item.cantidad;
      total += sub;
      return `
      <div class="carrito-item">
        <div class="carrito-item-info">
          <div class="carrito-item-nombre">${item.nombre}</div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="cambiarCantidad(${i}, -1)">−</button>
            <span>${item.cantidad}</span>
            <button class="qty-btn" onclick="cambiarCantidad(${i}, 1)">+</button>
          </div>
          <input type="text" class="form-control" style="margin-top:0.35rem;font-size:0.8rem;padding:0.3rem 0.5rem"
            placeholder="Observaciones (opcional)"
            value="${item.observaciones}"
            onchange="actualizarObs(${i}, this.value)" />
        </div>
        <div class="carrito-item-precio">${formatPrecio(sub)}</div>
      </div>`;
    })
    .join('');

  document.getElementById('total-valor').textContent = formatPrecio(total);
  totalRow.style.display = 'flex';
  btnEnviar.disabled = false;
}

// Enviar pedido
document.getElementById('btn-enviar').addEventListener('click', async () => {
  const tipo = document.getElementById('tipo-pedido').value;
  const mozo = document.getElementById('mozo').value.trim();
  const mesa = document.getElementById('mesa').value;

  if (tipo === 'salon' && !mesa) {
    showToast('Seleccioná una mesa', 'error');
    return;
  }

  const body = {
    items: carrito.map((i) => ({
      plato_id: i.plato_id,
      cantidad: i.cantidad,
      observaciones: i.observaciones,
    })),
    tipo,
    mozo,
  };

  if (tipo === 'salon') body.mesa = Number(mesa);

  if (tipo === 'delivery') {
    const nombre = document.getElementById('cliente-nombre').value.trim();
    const tel = document.getElementById('cliente-tel').value.trim();
    const dir = document.getElementById('cliente-dir').value.trim();
    if (!nombre || !tel || !dir) {
      showToast('Completá los datos del cliente', 'error');
      return;
    }
    body.delivery = {
      cliente_nombre: nombre,
      telefono: tel,
      direccion: dir,
      referencias: document.getElementById('cliente-ref').value.trim(),
      metodo_pago: document.getElementById('metodo-pago').value,
    };
  }

  try {
    const btn = document.getElementById('btn-enviar');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    await apiFetch('/pedidos', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    showToast('¡Pedido enviado a cocina!');
    carrito = [];
    renderCarrito();
    document.getElementById('cliente-nombre').value = '';
    document.getElementById('cliente-tel').value = '';
    document.getElementById('cliente-dir').value = '';
    document.getElementById('cliente-ref').value = '';
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    const btn = document.getElementById('btn-enviar');
    btn.disabled = false;
    btn.textContent = 'Enviar pedido a cocina';
  }
});

// Filtros
document.getElementById('filtros').addEventListener('click', (e) => {
  if (!e.target.classList.contains('filter-btn')) return;
  document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
  e.target.classList.add('active');
  const cat = e.target.dataset.cat;
  renderPlatos(cat === 'todos' ? todosLosPlatos : todosLosPlatos.filter((p) => p.categoria === cat));
});

cargarPlatos();
