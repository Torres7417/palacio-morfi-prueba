const Venta = require('../models/Venta');

// GET /api/ventas
exports.getVentas = async (req, res) => {
  try {
    const { fecha, tipo, metodo_pago } = req.query;
    const filtro = {};

    if (fecha) {
      const inicio = new Date(fecha);
      inicio.setHours(0, 0, 0, 0);
      const fin = new Date(fecha);
      fin.setHours(23, 59, 59, 999);
      filtro.fecha = { $gte: inicio, $lte: fin };
    }

    if (tipo) filtro.tipo = tipo;
    if (metodo_pago) filtro.metodo_pago = metodo_pago;

    const ventas = await Venta.find(filtro).sort({ fecha: -1 }).populate('pedido_id');
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas', error: error.message });
  }
};

// GET /api/ventas/resumen
exports.getResumen = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const ventasHoy = await Venta.find({
      fecha: { $gte: hoy, $lt: manana },
    });

    const total = ventasHoy.reduce((sum, v) => sum + v.total, 0);
    const porTipo = {};
    const porMetodo = {};

    ventasHoy.forEach((v) => {
      porTipo[v.tipo] = (porTipo[v.tipo] || 0) + v.total;
      porMetodo[v.metodo_pago] = (porMetodo[v.metodo_pago] || 0) + v.total;
    });

    res.json({
      fecha: hoy.toISOString().split('T')[0],
      cantidad_ventas: ventasHoy.length,
      total,
      por_tipo: porTipo,
      por_metodo_pago: porMetodo,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener resumen', error: error.message });
  }
};
