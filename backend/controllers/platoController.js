const Plato = require('../models/Plato');

// GET /api/platos
exports.getPlatos = async (req, res) => {
  try {
    const { categoria, disponible } = req.query;
    const filtro = {};

    if (categoria) filtro.categoria = categoria;
    if (disponible !== undefined) filtro.disponible = disponible === 'true';

    const platos = await Plato.find(filtro).sort({ categoria: 1, nombre: 1 });
    res.json(platos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener platos', error: error.message });
  }
};

// GET /api/platos/:id
exports.getPlatoById = async (req, res) => {
  try {
    const plato = await Plato.findById(req.params.id);
    if (!plato) return res.status(404).json({ message: 'Plato no encontrado' });
    res.json(plato);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener plato', error: error.message });
  }
};

// POST /api/platos
exports.createPlato = async (req, res) => {
  try {
    const plato = await Plato.create(req.body);
    res.status(201).json(plato);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear plato', error: error.message });
  }
};

// PUT /api/platos/:id
exports.updatePlato = async (req, res) => {
  try {
    const plato = await Plato.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plato) return res.status(404).json({ message: 'Plato no encontrado' });
    res.json(plato);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar plato', error: error.message });
  }
};

// PATCH /api/platos/:id/disponibilidad
exports.toggleDisponibilidad = async (req, res) => {
  try {
    const plato = await Plato.findById(req.params.id);
    if (!plato) return res.status(404).json({ message: 'Plato no encontrado' });

    plato.disponible = !plato.disponible;
    await plato.save();
    res.json(plato);
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar disponibilidad', error: error.message });
  }
};
