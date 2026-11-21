const Pedido = require('../models/Pedido');
const Venta = require('../models/Venta');
const Plato = require('../models/Plato');

// GET /api/pedidos
exports.getPedidos = async (req, res) => {
  try {
    const { estado, tipo, activos } = req.query;
    const filtro = {};

    if (estado) filtro.estado = estado;
    if (tipo) filtro.tipo = tipo;
    if (activos === 'true') {
      filtro.estado = { $in: ['pendiente', 'en_cocina', 'listo'] };
    }

    const pedidos = await Pedido.find(filtro)
      .sort({ fecha_hora: 1 })
      .populate('items.plato_id', 'nombre categoria');

    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
  }
};

// GET /api/pedidos/:id
exports.getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedido', error: error.message });
  }
};

// POST /api/pedidos
exports.createPedido = async (req, res) => {
  try {
    const { items, tipo, mesa, mozo, metodo_pago, delivery } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'El pedido debe contener al menos un ítem' });
    }

    // Validar y armar ítems con datos denormalizados
    const itemsProcesados = [];
    let total = 0;

    for (const item of items) {
      const plato = await Plato.findById(item.plato_id);
      if (!plato) {
        return res.status(400).json({ message: `Plato no encontrado: ${item.plato_id}` });
      }
      if (!plato.disponible) {
        return res.status(400).json({ message: `El plato "${plato.nombre}" no está disponible` });
      }

      const cantidad = item.cantidad || 1;
      const precio_unitario = plato.precio;
      total += precio_unitario * cantidad;

      itemsProcesados.push({
        plato_id: plato._id,
        nombre: plato.nombre,
        cantidad,
        precio_unitario,
        observaciones: item.observaciones || '',
      });
    }

    const pedidoData = {
      items: itemsProcesados,
      total,
      tipo,
      estado: 'pendiente',
      mozo: mozo || '',
      metodo_pago: metodo_pago || '',
    };

    if (tipo === 'salon') {
      if (!mesa) return res.status(400).json({ message: 'La mesa es obligatoria para pedidos de salón' });
      pedidoData.mesa = mesa;
    }

    if (tipo === 'delivery') {
      if (!delivery) return res.status(400).json({ message: 'Los datos de delivery son obligatorios' });
      pedidoData.delivery = delivery;
      pedidoData.metodo_pago = delivery.metodo_pago;
    }

    const pedido = await Pedido.create(pedidoData);

    // Crear registro de venta automáticamente
    await Venta.create({
      pedido_id: pedido._id,
      total: pedido.total,
      metodo_pago: pedido.metodo_pago || (delivery ? delivery.metodo_pago : 'efectivo'),
      tipo: pedido.tipo,
    });

    res.status(201).json(pedido);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear pedido', error: error.message });
  }
};

// PATCH /api/pedidos/:id/estado
exports.updateEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ['pendiente', 'en_cocina', 'listo', 'entregado', 'cancelado'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }

    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado, fecha_actualizacion: new Date() },
      { new: true, runValidators: true }
    );

    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar estado', error: error.message });
  }
};

// GET /api/pedidos/activos (atajo para cocina)
exports.getPedidosActivos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({
      estado: { $in: ['pendiente', 'en_cocina', 'listo'] },
    }).sort({ fecha_hora: 1 });

    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos activos', error: error.message });
  }
};
