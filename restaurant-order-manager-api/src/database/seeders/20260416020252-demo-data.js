'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // 1. Inputs (insumos)
    await queryInterface.bulkInsert('Inputs', [
      { name: 'Pão Brioche',  quantity: 50, unit: 'un', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Carne 150g',   quantity: 40, unit: 'un', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Queijo Cheddar', quantity: 60, unit: 'un', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Alface',       quantity: 80, unit: 'un', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tomate',       quantity: 70, unit: 'un', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // 2. Products
    await queryInterface.bulkInsert('Products', [
      { name: 'X-Burger',  price: 25.90, description: 'Hambúrguer clássico',          createdAt: new Date(), updatedAt: new Date() },
      { name: 'X-Salada',  price: 28.90, description: 'Hambúrguer com alface e tomate', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // 3. Buscar IDs gerados
    const [inputs]   = await queryInterface.sequelize.query('SELECT id, name FROM "Inputs"');
    const [products] = await queryInterface.sequelize.query('SELECT id, name FROM "Products"');

    const inputId  = (name) => inputs.find((i) => i.name === name).id;
    const productId = (name) => products.find((p) => p.name === name).id;

    // 4. ProductInputs (fichas técnicas)
    await queryInterface.bulkInsert('ProductInputs', [
      // X-Burger: 1 pão + 1 carne + 1 queijo
      { product_id: productId('X-Burger'), input_id: inputId('Pão Brioche'),    quantity: 1, createdAt: new Date(), updatedAt: new Date() },
      { product_id: productId('X-Burger'), input_id: inputId('Carne 150g'),     quantity: 1, createdAt: new Date(), updatedAt: new Date() },
      { product_id: productId('X-Burger'), input_id: inputId('Queijo Cheddar'), quantity: 1, createdAt: new Date(), updatedAt: new Date() },
      // X-Salada: 1 pão + 1 carne + 1 queijo + 1 alface + 1 tomate
      { product_id: productId('X-Salada'), input_id: inputId('Pão Brioche'),    quantity: 1, createdAt: new Date(), updatedAt: new Date() },
      { product_id: productId('X-Salada'), input_id: inputId('Carne 150g'),     quantity: 1, createdAt: new Date(), updatedAt: new Date() },
      { product_id: productId('X-Salada'), input_id: inputId('Queijo Cheddar'), quantity: 1, createdAt: new Date(), updatedAt: new Date() },
      { product_id: productId('X-Salada'), input_id: inputId('Alface'),         quantity: 1, createdAt: new Date(), updatedAt: new Date() },
      { product_id: productId('X-Salada'), input_id: inputId('Tomate'),         quantity: 1, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ProductInputs', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Inputs', null, {});
  },
};
