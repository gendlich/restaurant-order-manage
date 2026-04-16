'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/OrderController');

router.get('/', ctrl.index);
router.get('/:id', ctrl.show);
router.post('/', ctrl.create);

module.exports = router;
