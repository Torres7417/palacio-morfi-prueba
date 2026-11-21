const mongoose = require('mongoose');

const platoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del plato es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
      default: '',
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    categoria: {
      type: String,
      required: true,
      enum: {
        values: ['entrada', 'principal', 'bebida', 'postre'],
        message: 'Categoría no válida',
      },
    },
    disponible: {
      type: Boolean,
      default: true,
    },
    imagen_url: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' },
  }
);

// Índices
platoSchema.index({ categoria: 1 });
platoSchema.index({ disponible: 1 });
platoSchema.index({ nombre: 'text' });

module.exports = mongoose.model('Plato', platoSchema);
