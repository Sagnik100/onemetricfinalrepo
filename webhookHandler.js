// Import necessary modules and packages
const crypto = require('crypto');
require('dotenv').config();
const { Transaction } = require('./models'); // Import Transaction model from index.js

const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

const handleWebhook = async (event) => {
  try {
    // Parse the incoming webhook event
    const body = JSON.parse(event.body);
    const sigHeader = event.headers['x-razorpay-signature'];

    // Verify the webhook signature
    const shasum = crypto.createHmac('sha256', razorpayWebhookSecret);
    shasum.update(event.body);
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
      await Transaction.update(
        { status: 'completed' },
        { where: { payment_order_id: order.id } }
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
  }
};

module.exports = { handleWebhook };
