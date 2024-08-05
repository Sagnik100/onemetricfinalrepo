const mysql = require('mysql2/promise');
const crypto = require('crypto');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

const handleWebhook = async (event) => {
    const connection = await mysql.createConnection(dbConfig);

    try {
        // Parse the incoming webhook event
        const body = JSON.parse(event.body);
        const sigHeader = event.headers['x-razorpay-signature'];

        // Verify the webhook signature
        const shasum = crypto.createHmac('sha256', razorpayWebhookSecret);
        shasum.update(`${event.headers['x-razorpay-order-id']}|${event.headers['x-razorpay-payment-id']}|${body.razorpay_signature}`);
        const computedSignature = shasum.digest('hex');

        if (sigHeader !== computedSignature) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid signature' }),
            };
        }

        // Handle the event
        const { event: eventType, payload } = body;

        if (eventType === 'payment.captured') {
            const { payment, order } = payload;

            // Update the transaction status in the database
            await connection.execute(
                'UPDATE transactions SET status = ? WHERE payment_order_id = ?',
                ['completed', order.id]
            );

            return {
                statusCode: 200,
                body: JSON.stringify({ success: true }),
            };
        }

        // Handle other events if necessary

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error('Error handling webhook event:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    } finally {
        await connection.end();
    }
};

module.exports = { handleWebhook };
