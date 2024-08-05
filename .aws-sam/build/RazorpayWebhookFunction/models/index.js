const User = require('./User');
const Plan = require('./Plan');
const RegisteredUserPlan = require('./RegisteredUserPlan');
const Transaction = require('./Transaction');

// Define associations
Transaction.belongsTo(Plan, { foreignKey: 'plan_id' });
Transaction.hasOne(RegisteredUserPlan, { foreignKey: 'transaction_id' });

// Export models
module.exports = {
  User,
  Plan,
  RegisteredUserPlan,
  Transaction,
};
