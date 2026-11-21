const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/', pedidoController.getPedidos);
router.get('/activos', pedidoController.getPedidosActivos);
router.get('/:id', pedidoController.getPedidoById);
router.post('/', pedidoController.createPedido);
router.patch('/:id/estado', pedidoController.updateEstado);

module.exports = router;
