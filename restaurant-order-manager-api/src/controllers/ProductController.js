'use strict';

const ProductService = require('../services/ProductService');

exports.index = async (req, res) => {
  const products = await ProductService.getAll();
  res.json(products);
};

exports.show = async (req, res) => {
  const product = await ProductService.getById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

exports.create = async (req, res) => {
  const product = await ProductService.create(req.body);
  res.status(201).json(product);
};

exports.update = async (req, res) => {
  await ProductService.update(req.params.id, req.body);
  res.json({ ok: true });
};

exports.destroy = async (req, res) => {
  await ProductService.remove(req.params.id);
  res.status(204).send();
};
