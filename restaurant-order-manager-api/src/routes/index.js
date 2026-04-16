'use strict';

const router = require('express').Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/inputs', require('./inputs'));
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));

module.exports = router;
