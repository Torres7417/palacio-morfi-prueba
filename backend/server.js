require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Rutas
const platosRoutes = require('./routes/platos');
const pedidosRoutes = require('./routes/pedidos');
const ventasRoutes = require('./routes/ventas');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ruta de salud
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API El Palacio del Morfi funcionando 🍽️',
    version: '1.0.0',
    endpoints: {
      platos: '/api/platos',
      pedidos: '/api/pedidos',
      ventas: '/api/ventas',
      resumen: '/api/ventas/resumen',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de la API
app.use('/api/platos', platosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/ventas', ventasRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
