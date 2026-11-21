const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    plato_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plato',
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: [1, 'La cantidad mínima es 1'],
    },
    precio_unitario: {
      type: Number,
      required: true,
      min: 0,
    },
    observaciones: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const deliverySchema = new mongoose.Schema(
  {
    cliente_nombre: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    referencias: { type: String, default: '' },
    metodo_pago: {
      type: String,
      enum: ['efectivo', 'transferencia'],
      required: true,
    },
    repartidor: { type: String, default: '' },
  },
  { _id: false }
);

const pedidoSchema = new mongoose.Schema(
  {
    items: {
      type: [itemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'El pedido debe tener al menos un ítem',
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    tipo: {
      type: String,
      required: true,
      enum: ['salon', 'delivery', 'para_llevar'],
    },
    estado: {
      type: String,
      enum: ['pendiente', 'en_cocina', 'listo', 'entregado', 'cancelado'],
      default: 'pendiente',
    },
    mesa: {
      type: Number,
      min: 1,
      max: 20,
    },
    mozo: {
      type: String,
      default: '',
    },
    metodo_pago: {
      type: String,
      enum: ['efectivo', 'transferencia', ''],
      default: '',
    },
    delivery: {
      type: deliverySchema,
      required: function () {
        return this.tipo === 'delivery';
      },
    },
    fecha_hora: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: 'fecha_actualizacion' },
  }
);

// Validación: mesa requerida solo para salón
pedidoSchema.pre('validate', function (next) {
  if (this.tipo === 'salon' && !this.mesa) {
    this.invalidate('mesa', 'La mesa es obligatoria para pedidos de salón');
  }
  next();
});

// Índices
pedidoSchema.index({ estado: 1 });
pedidoSchema.index({ tipo: 1 });
pedidoSchema.index({ fecha_hora: -1 });
pedidoSchema.index({ mesa: 1 });
pedidoSchema.index({ 'delivery.telefono': 1 });

module.exports = mongoose.model('Pedido', pedidoSchema);
