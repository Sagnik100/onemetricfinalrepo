// Import necessary modules and packages
require('dotenv').config(); // dotenv module for loading environment variables
const { Transaction, RegisteredUserPlan, Plan } = require('./models'); // Import models from index.js

// Asynchronous function to retrieve transaction history for a specific user
exports.transactionHistoryAPI = async (event) => {
  // Extract user ID from the path parameters
  const userId = event.pathParameters.user_id;

  try {
    // Execute SELECT query to retrieve transaction details for the specified user
    const transactions = await Transaction.findAll({
      where: { user_id: userId },
      include: [
        {
          model: RegisteredUserPlan,
          attributes: [],
        },
        {
          model: Plan,
          attributes: ['amount_in_rs', 'duration_in_months'],
        },
      ],
      attributes: [
        'id',
        'payment_order_id',
        'amount',
        'created_at',
        'updated_at',
        'status',
      ],
    });

    // Check if any transactions were found for the specified user
    if (transactions.length === 0) {
      return {
        statusCode: 404, // Not Found status code
        headers: { 'Authorization-Status': 'false' },
        body: JSON.stringify({ error: true, message: 'No transactions found for this user' }),
      };
    }

    // Format transactions data
    const transactionData = transactions.map((transaction) => ({
      transaction_id: transaction.id,
      payment_order_id: transaction.payment_order_id,
      amount: transaction.amount,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
      status: transaction.status,
      amount_in_rs: transaction.Plan.amount_in_rs,
      duration_in_months: transaction.Plan.duration_in_months,
    }));

    // Return success response with the list of transactions
    return {
      statusCode: 200, // OK status code
      headers: { 'Authorization-Status': 'true' },
      body: JSON.stringify({
        success: true,
        data: transactionData,
      }),
    };
  } catch (error) {
    // Log error details for debugging purposes
    console.error('Error fetching transaction history:', error);

    // Return error response if an exception occurred
    return {
      statusCode: 500, // Internal Server Error status code
      headers: { 'Authorization-Status': 'false' },
      body: JSON.stringify({ error: true, message: 'Failed to fetch transaction history' }),
    };
  }
};
