const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const RegisteredUserPlan = sequelize.define('RegisteredUserPlan', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  plan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expire_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  transaction_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  tableName: 'registered_user_plans',
  timestamps: false,
});

module.exports = RegisteredUserPlan;
