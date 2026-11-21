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

// ========== ENDPOINT TEMPORAL DE SEED (BORRAR DESPUÉS) ==========
const Plato = require('./models/Plato');

app.get('/api/seed', async (req, res) => {
  try {
    const platosEjemplo = [
      { nombre: 'Empanadas de carne (x3)', descripcion: 'Empanadas caseras de carne cortada a cuchillo', precio: 3500, categoria: 'entrada', disponible: true },
      { nombre: 'Provoleta', descripcion: 'Queso provolone a la plancha con orégano y aceite de oliva', precio: 4800, categoria: 'entrada', disponible: true },
      { nombre: 'Tabla de fiambres', descripcion: 'Selección de fiambres y quesos para 2 personas', precio: 7200, categoria: 'entrada', disponible: true },
      { nombre: 'Bife de chorizo', descripcion: '300g de bife de chorizo a la parrilla con papas fritas', precio: 9500, categoria: 'principal', disponible: true },
      { nombre: 'Pollo al disco', descripcion: 'Pollo deshuesado con verduras salteadas', precio: 7800, categoria: 'principal', disponible: true },
      { nombre: 'Milanesa napolitana', descripcion: 'Milanesa de ternera con jamón, queso y salsa, acompañada de papas', precio: 8200, categoria: 'principal', disponible: true },
      { nombre: 'Ravioles de ricota', descripcion: 'Ravioles caseros con salsa fileto o bolognesa', precio: 6900, categoria: 'principal', disponible: true },
      { nombre: 'Ensalada completa', descripcion: 'Lechuga, tomate, zanahoria, huevo, jamón y queso', precio: 5500, categoria: 'principal', disponible: true },
      { nombre: 'Agua mineral 500ml', descripcion: 'Con o sin gas', precio: 1200, categoria: 'bebida', disponible: true },
      { nombre: 'Gaseosa 500ml', descripcion: 'Coca-Cola, Sprite o Fanta', precio: 1500, categoria: 'bebida', disponible: true },
      { nombre: 'Cerveza artesanal 500ml', descripcion: 'Rubia o IPA', precio: 2800, categoria: 'bebida', disponible: true },
      { nombre: 'Vino tinto (copa)', descripcion: 'Malbec de la casa', precio: 2200, categoria: 'bebida', disponible: true },
      { nombre: 'Flan casero', descripcion: 'Con dulce de leche y crema', precio: 2800, categoria: 'postre', disponible: true },
      { nombre: 'Tiramisú', descripcion: 'Porción individual', precio: 3200, categoria: 'postre', disponible: true },
      { nombre: 'Helado (2 bochas)', descripcion: 'Sabores a elección', precio: 2500, categoria: 'postre', disponible: true },
    ];

    await Plato.deleteMany({});
    const result = await Plato.insertMany(platosEjemplo);
    res.json({ mensaje: `✅ ${result.length} platos insertados correctamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ========== FIN ENDPOINT TEMPORAL ==========

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
