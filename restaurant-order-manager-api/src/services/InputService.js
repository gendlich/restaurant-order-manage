'use strict';

const { Input } = require('../models');

const getAll = () => Input.findAll();

const getById = (id) => Input.findByPk(id);

const create = (data) => Input.create(data);

const update = (id, data) => Input.update(data, { where: { id } });

const remove = (id) => Input.destroy({ where: { id } });

module.exports = { getAll, getById, create, update, remove };
