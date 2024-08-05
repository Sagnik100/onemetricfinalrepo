// getOrder.js
const Transaction = require('./models/Transaction');

// Asynchronous function to get order details by ID
const getOrder = async (event) => {
    // Extract order ID from the path parameters
    const { id } = event.pathParameters;

    try {
        // Find the transaction by ID
        const transaction = await Transaction.findByPk(id);
        
        // Check if transaction was found
        if (transaction) {
            return {
                statusCode: 200, // OK status code
                headers: { 'Authorization-Status': 'true' },
                body: JSON.stringify({ success: true, data: transaction }),
            };
        } else {
            // Return 404 response if no transaction was found
            return {
                statusCode: 404, // Not Found status code
                headers: { 'Authorization-Status': 'false' },
                body: JSON.stringify({ error: true, message: 'Order not found' }),
            };
        }
    } catch (error) {
        // Log error details for debugging purposes
        console.error('Error retrieving order:', error);

        // Return error response if an exception occurred
        return {
            statusCode: 500, // Internal Server Error status code
            headers: { 'Authorization-Status': 'false' },
            body: JSON.stringify({ error: true, message: 'Could not retrieve order' }),
        };
    }
};

// Export the handler function to be used as a Lambda function
exports.handler = getOrder;
