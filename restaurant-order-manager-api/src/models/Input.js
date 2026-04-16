'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Input extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Input.belongsToMany(models.Product, {
        through: 'ProductInputs',
        foreignKey: 'input_id',
      });
    }
  }
  Input.init({
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    unit: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Input',
  });
  return Input;
};