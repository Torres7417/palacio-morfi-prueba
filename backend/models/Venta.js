const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema(
  {
    pedido_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pedido',
      required: true,
      unique: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    metodo_pago: {
      type: String,
      enum: ['efectivo', 'transferencia'],
      required: true,
    },
    tipo: {
      type: String,
      enum: ['salon', 'delivery', 'para_llevar'],
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

ventaSchema.index({ fecha: -1 });
ventaSchema.index({ tipo: 1 });
ventaSchema.index({ metodo_pago: 1 });

module.exports = mongoose.model('Venta', ventaSchema);
