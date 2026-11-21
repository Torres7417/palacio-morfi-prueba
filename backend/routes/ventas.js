const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

router.get('/', ventaController.getVentas);
router.get('/resumen', ventaController.getResumen);

module.exports = router;
