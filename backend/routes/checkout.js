
const express = require('express');
const router = express.Router();
const { Polar } = require('@polar-sh/sdk');

// Initialize Polar with Secret Token (Server-side)
const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN || '',
    server: process.env.POLAR_ENV === 'production' ? 'production' : 'sandbox'
});

/**
 * Valid Products Configuration
 * These should match what is in the frontend/database
 */
const VALID_PRODUCT_IDS = [
    '1cd4338f-002f-49ff-85fd-426508810cd4', // Pro Monthly
    '0da982e8-a653-4765-94e2-31f13491fcd2'  // Pro Yearly
];

// POST /api/checkout/create
router.post('/create', async (req, res) => {
    try {
        const { productId, customerEmail, userId, successUrl: clientSuccessUrl } = req.body;

        if (!productId || !VALID_PRODUCT_IDS.includes(productId)) {
            return res.status(400).json({ error: 'Invalid Product ID' });
        }

        if (!customerEmail) {
            return res.status(400).json({ error: 'Customer Email is required' });
        }

        // Use provided success URL or default
        const successUrl = clientSuccessUrl || 'https://juriq.app/dashboard?upgraded=true';

        console.log(`Creating checkout for ${customerEmail} (Product: ${productId})`);

        const checkout = await polar.checkouts.create({
            products: [productId],
            customerEmail: customerEmail,
            successUrl: successUrl,
            metadata: {
                source: 'juriq_app',
                user_id: userId || 'guest'
            }
        });

        res.json({ url: checkout.url });

    } catch (error) {
        console.error('Polar Checkout Error:', error);
        res.status(500).json({
            error: 'Failed to create checkout session',
            details: error.message
        });
    }
});

module.exports = router;
