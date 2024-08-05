// createPlan.js
const Plan = require('./models/Plan'); // Import the Plan model

// Asynchronous function to create a new plan
exports.createPlan = async (event) => {
  try {
    // Parse the request body to extract amount and duration
    const body = JSON.parse(event.body);
    const { amount_in_rs, duration_in_months } = body;

    // Validate the input data
    if (!amount_in_rs || !duration_in_months) {
      return {
        statusCode: 400, // Bad Request status code
        headers: { 'Authorization-Status': 'false' },
        body: JSON.stringify({ error: true, message: 'Invalid input' }),
      };
    }

    // Create a new plan using Sequelize
    const newPlan = await Plan.create({
      amount_in_rs,
      duration_in_months,
    });

    // Return success response with the new plan details
    return {
      statusCode: 201, // Created status code
      headers: { 'Authorization-Status': 'true' },
      body: JSON.stringify({
        success: true,
        data: {
          id: newPlan.id, // ID of the newly created plan
          amount_in_rs,
          duration_in_months
        }
      }),
    };
  } catch (error) {
    // Log error details for debugging purposes
    console.error('Error creating plan:', error);

    // Return error response with error message
    return {
      statusCode: 500, // Internal Server Error status code
      headers: { 'Authorization-Status': 'false' },
      body: JSON.stringify({ error: true, message: 'Internal server error' }),
    };
  }
};
