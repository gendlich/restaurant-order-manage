'use strict';

const OrderService = require('../services/OrderService');

exports.index = async (req, res) => {
  const orders = await OrderService.getAll();
  res.json(orders);
};

exports.show = async (req, res) => {
  const order = await OrderService.getById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
};

exports.create = async (req, res) => {
  try {
    const order = await OrderService.createOrder(req.body.items);
    res.status(201).json(order);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
};
