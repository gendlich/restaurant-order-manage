'use strict';

const { Product, Input, ProductInput } = require('../models');

const getAll = () =>
  Product.findAll({
    include: [{ model: Input, through: { attributes: ['quantity'] } }],
  });

const getById = (id) =>
  Product.findByPk(id, {
    include: [{ model: Input, through: { attributes: ['quantity'] } }],
  });

const create = async ({ name, price, description, inputs }) => {
  const product = await Product.create({ name, price, description });

  if (inputs && inputs.length > 0) {
    await ProductInput.bulkCreate(
      inputs.map((i) => ({
        product_id: product.id,
        input_id: i.input_id,
        quantity: i.quantity,
      }))
    );
  }

  return getById(product.id);
};

const update = (id, data) => Product.update(data, { where: { id } });

const remove = (id) => Product.destroy({ where: { id } });

module.exports = { getAll, getById, create, update, remove };
