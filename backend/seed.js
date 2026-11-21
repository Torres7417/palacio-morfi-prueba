/**
 * Script de seed - Carga platos de ejemplo en la base de datos
 * Uso: npm run seed  (desde la carpeta backend)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Plato = require('./models/Plato');

const platosEjemplo = [
  // Entradas
  {
    nombre: 'Empanadas de carne (x3)',
    descripcion: 'Empanadas caseras de carne cortada a cuchillo',
    precio: 3500,
    categoria: 'entrada',
    disponible: true,
    imagen_url: '',
  },
  {
    nombre: 'Provoleta',
    descripcion: 'Queso provolone a la plancha con orégano y aceite de oliva',
    precio: 4800,
    categoria: 'entrada',
    disponible: true,
  },
  {
    nombre: 'Tabla de fiambres',
    descripcion: 'Selección de fiambres y quesos para 2 personas',
    precio: 7200,
    categoria: 'entrada',
    disponible: true,
  },
  // Principales
  {
    nombre: 'Bife de chorizo',
    descripcion: '300g de bife de chorizo a la parrilla con papas fritas',
    precio: 9500,
    categoria: 'principal',
    disponible: true,
  },
  {
    nombre: 'Pollo al disco',
    descripcion: 'Pollo deshuesado con verduras salteadas',
    precio: 7800,
    categoria: 'principal',
    disponible: true,
  },
  {
    nombre: 'Milanesa napolitana',
    descripcion: 'Milanesa de ternera con jamón, queso y salsa, acompañada de papas',
    precio: 8200,
    categoria: 'principal',
    disponible: true,
  },
  {
    nombre: 'Ravioles de ricota',
    descripcion: 'Ravioles caseros con salsa fileto o bolognesa',
    precio: 6900,
    categoria: 'principal',
    disponible: true,
  },
  {
    nombre: 'Ensalada completa',
    descripcion: 'Lechuga, tomate, zanahoria, huevo, jamón y queso',
    precio: 5500,
    categoria: 'principal',
    disponible: true,
  },
  // Bebidas
  {
    nombre: 'Agua mineral 500ml',
    descripcion: 'Con o sin gas',
    precio: 1200,
    categoria: 'bebida',
    disponible: true,
  },
  {
    nombre: 'Gaseosa 500ml',
    descripcion: 'Coca-Cola, Sprite o Fanta',
    precio: 1500,
    categoria: 'bebida',
    disponible: true,
  },
  {
    nombre: 'Cerveza artesanal 500ml',
    descripcion: 'Rubia o IPA',
    precio: 2800,
    categoria: 'bebida',
    disponible: true,
  },
  {
    nombre: 'Vino tinto (copa)',
    descripcion: 'Malbec de la casa',
    precio: 2200,
    categoria: 'bebida',
    disponible: true,
  },
  // Postres
  {
    nombre: 'Flan casero',
    descripcion: 'Con dulce de leche y crema',
    precio: 2800,
    categoria: 'postre',
    disponible: true,
  },
  {
    nombre: 'Tiramisú',
    descripcion: 'Porción individual',
    precio: 3200,
    categoria: 'postre',
    disponible: true,
  },
  {
    nombre: 'Helado (2 bochas)',
    descripcion: 'Sabores a elección',
    precio: 2500,
    categoria: 'postre',
    disponible: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colección de platos
    await Plato.deleteMany({});
    console.log('🗑️  Colección platos limpiada');

    // Insertar platos
    const result = await Plato.insertMany(platosEjemplo);
    console.log(`✅ ${result.length} platos insertados correctamente`);

    console.log('\n📋 Platos cargados:');
    result.forEach((p) => {
      console.log(`  - ${p.nombre} ($${p.precio}) [${p.categoria}]`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error.message);
    process.exit(1);
  }
}

seed();
