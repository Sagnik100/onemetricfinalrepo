// Import necessary modules and packages
const Razorpay = require('razorpay'); // Razorpay module for payment processing
const { v4: uuidv4 } = require('uuid'); // UUID module for generating unique identifiers
const { User, Plan, Transaction } = require('./models'); // Import models from index.js
require('dotenv').config(); // dotenv module for loading environment variables

// Razorpay configuration object with key id and secret
const razorpayConfig = {
    key_id: process.env.RAZORPAY_KEY_ID, // Razorpay key id from environment variables
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Razorpay key secret from environment variables
};

// Initialize Razorpay instance with the configuration
const razorpayInstance = new Razorpay(razorpayConfig);

// Asynchronous function to create a payment
const createPayment = async (event) => {
    // Extract user_id and plan_id from the event body
    const { user_id, plan_id } = JSON.parse(event.body);

    try {
        // Fetch user details from the database using user_id
        const user = await User.findByPk(user_id);
        if (!user) {
            return {
                statusCode: 404,
                headers: { 'Authorization-Status': 'false' },
                body: JSON.stringify({ error: true, message: 'User not found' }),
            };
        }

        // Fetch plan details from the database using plan_id
        const plan = await Plan.findByPk(plan_id);
        if (!plan) {
            return {
                statusCode: 404,
                headers: { 'Authorization-Status': 'false' },
                body: JSON.stringify({ error: true, message: 'Plan not found' }),
            };
        }

        // Create an order in Razorpay with the plan amount in paise
        const orderOptions = {
            amount: plan.amount_in_rs * 100, // Amount in paise
            currency: 'INR', // Currency in Indian Rupees
            receipt: uuidv4(), // Unique receipt identifier
            payment_capture: 1, // Automatic capture of payment
        };
        const order = await razorpayInstance.orders.create(orderOptions); // Create order

        // Insert transaction details into the database
        const transaction = await Transaction.create({
            payment_order_id: order.id,
            amount: plan.amount_in_rs,
            created_at: new Date(),
            updated_at: new Date(),
            user_id: user_id,
            plan_id: plan_id,
            status: 'pending',
        });

        // Return success response with transaction details
        return {
            statusCode: 200,
            headers: { 'Authorization-Status': 'true' },
            body: JSON.stringify({
                success: true,
                data: {
                    transaction_id: transaction.id,
                    payment_order_id: order.id,
                    amount: plan.amount_in_rs,
                    user_id: user_id,
                    plan_id: plan_id,
                    status: 'pending',
                },
            }),
        };
    } catch (error) {
        // Return error response with error message
        return {
            statusCode: 500,
            headers: { 'Authorization-Status': 'false', 'Error': error.message },
            body: JSON.stringify({ error: true, message: 'Internal server error' }),
        };
    }
};

// Export the createPayment function as a module
module.exports = { createPayment };
