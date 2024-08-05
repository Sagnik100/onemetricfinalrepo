// deletePlan.js
const Plan = require('./models/Plan'); // Import the Plan model

// Asynchronous function to delete a plan by its ID
exports.deletePlan = async (event) => {
  // Extract plan ID from the path parameters
  const planId = event.pathParameters.id;

  try {
    // Delete the plan by ID
    const result = await Plan.destroy({ where: { id: planId } });

    // Check if any rows were affected 
    if (result === 0) {
      return {
        statusCode: 404, // Not Found status code
        headers: { 'Authorization-Status': 'false' },
        body: JSON.stringify({ error: true, message: 'Plan not found' }),
      };
    }

    // Return success response if plan was deleted
    return {
      statusCode: 200, // OK status code
      headers: { 'Authorization-Status': 'true' },
      body: JSON.stringify({
        success: true,
        data: { message: 'Plan deleted successfully' },
      }),
    };
  } catch (error) {
    // Log error details for debugging purposes
    console.error('Error deleting plan:', error);

    // Return error response if an exception occurred
    return {
      statusCode: 500, // Internal Server Error status code
      headers: { 'Authorization-Status': 'false' },
      body: JSON.stringify({ error: true, message: 'Failed to delete plan' }),
    };
  }
};
