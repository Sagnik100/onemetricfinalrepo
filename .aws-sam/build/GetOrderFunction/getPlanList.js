// getPlanList.js
const Plan = require('./models/Plan');

exports.getPlanList = async () => {
  try {
    const plans = await Plan.findAll();
    
    return {
      statusCode: 200, // OK status code
      headers: { 'Authorization-Status': 'true' },
      body: JSON.stringify({ success: true, data: plans }),
    };
  } catch (error) {
    console.error('Error fetching plan list:', error);
    
    return {
      statusCode: 500, // Internal Server Error status code
      headers: { 'Authorization-Status': 'false', 'Error': 'Internal server error' },
      body: JSON.stringify({ error: true, message: 'Internal server error' }),
    };
  }
};