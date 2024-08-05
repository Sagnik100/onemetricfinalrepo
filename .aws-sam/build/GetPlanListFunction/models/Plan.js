const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Plan = sequelize.define('Plan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount_in_rs: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  duration_in_months: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'plans',
  timestamps: false,
});

module.exports = Plan;
