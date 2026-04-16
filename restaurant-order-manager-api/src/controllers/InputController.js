'use strict';

const InputService = require('../services/InputService');

exports.index = async (req, res) => {
  const inputs = await InputService.getAll();
  res.json(inputs);
};

exports.show = async (req, res) => {
  const input = await InputService.getById(req.params.id);
  if (!input) return res.status(404).json({ error: 'Input not found' });
  res.json(input);
};

exports.create = async (req, res) => {
  const input = await InputService.create(req.body);
  res.status(201).json(input);
};

exports.update = async (req, res) => {
  await InputService.update(req.params.id, req.body);
  res.json({ ok: true });
};

exports.destroy = async (req, res) => {
  await InputService.remove(req.params.id);
  res.status(204).send();
};
