'use strict';

const { Op } = require('sequelize');
const { Order, OrderItem, Product, Input, ProductInput, connection } = require('../models');

const createOrder = async (items) => {
  const t = await connection.transaction();

  try {
    const productIds = items.map((i) => i.product_id);

    // 1. Buscar fichas técnicas com pessimistic lock nos inputs
    const productInputs = await ProductInput.findAll({
      where: { product_id: { [Op.in]: productIds } },
      include: [{ model: Input, lock: t.LOCK.UPDATE }],
      transaction: t,
    });

    // 2. Calcular consumo total por ingrediente
    const consumption = {};
    for (const item of items) {
      const recipe = productInputs.filter((pi) => pi.product_id === item.product_id);
      for (const pi of recipe) {
        const needed = parseFloat(pi.quantity) * item.quantity;
        consumption[pi.input_id] = (consumption[pi.input_id] || 0) + needed;
      }
    }

    // 3. Validar estoque
    for (const [inputId, needed] of Object.entries(consumption)) {
      const input = await Input.findByPk(inputId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!input || input.quantity < needed) {
        throw new Error(
          `Estoque insuficiente: ${input ? input.name : `input #${inputId}`} (disponível: ${input?.quantity ?? 0}, necessário: ${needed})`
        );
      }
    }

    // 4. Calcular total_price
    const products = await Product.findAll({
      where: { id: { [Op.in]: productIds } },
      transaction: t,
    });

    const total_price = items.reduce((sum, item) => {
      const p = products.find((p) => p.id === item.product_id);
      return sum + parseFloat(p.price) * item.quantity;
    }, 0);

    // 5. Criar Order e OrderItems
    const order = await Order.create({ total_price }, { transaction: t });

    await OrderItem.bulkCreate(
      items.map((item) => {
        const p = products.find((p) => p.id === item.product_id);
        return {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: p.price,
        };
      }),
      { transaction: t }
    );

    // 6. Decrementar estoque
    for (const [inputId, needed] of Object.entries(consumption)) {
      await Input.decrement('quantity', {
        by: needed,
        where: { id: inputId },
        transaction: t,
      });
    }

    await t.commit();
    return getById(order.id);
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const getAll = () =>
  Order.findAll({
    include: [{ model: OrderItem, as: 'items', include: [Product] }],
    order: [['createdAt', 'DESC']],
  });

const getById = (id) =>
  Order.findByPk(id, {
    include: [{ model: OrderItem, as: 'items', include: [Product] }],
  });

module.exports = { createOrder, getAll, getById };
