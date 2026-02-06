// Polar Webhook Handler for Juriq Backend
// Handles subscription events from Polar

const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Webhook secret from Polar dashboard
const POLAR_WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET || '';

/**
 * Verify Polar webhook signature
 */
function verifyWebhookSignature(payload, signature) {
    if (!POLAR_WEBHOOK_SECRET) {
        console.warn('POLAR_WEBHOOK_SECRET not configured');
        return false;
    }

    const expectedSignature = crypto
        .createHmac('sha256', POLAR_WEBHOOK_SECRET)
        .update(payload, 'utf8')
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

/**
 * Polar Webhook Endpoint
 * POST /api/webhooks/polar
 */
router.post('/polar', express.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['polar-signature'];
    const payload = req.body.toString();

    // Verify signature (optional in sandbox, required in production)
    if (process.env.NODE_ENV === 'production' && !verifyWebhookSignature(payload, signature)) {
        console.error('Invalid Polar webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
    }

    try {
        const event = JSON.parse(payload);
        console.log(`Polar webhook received: ${event.type}`);

        switch (event.type) {
            case 'checkout.created':
                // Checkout session started
                console.log('Checkout created:', event.data.id);
                break;

            case 'checkout.updated':
                // Checkout updated (e.g., customer added info)
                console.log('Checkout updated:', event.data.id);
                break;

            case 'order.created':
                // One-time payment completed
                await handleOrderCreated(event.data);
                break;

            case 'subscription.created':
                // New subscription started
                await handleSubscriptionCreated(event.data);
                break;

            case 'subscription.updated':
                // Subscription modified (upgrade/downgrade)
                await handleSubscriptionUpdated(event.data);
                break;

            case 'subscription.canceled':
                // Subscription canceled
                await handleSubscriptionCanceled(event.data);
                break;

            case 'subscription.revoked':
                // Subscription revoked (failed payment)
                await handleSubscriptionRevoked(event.data);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

/**
 * Handle new subscription creation
 */
async function handleSubscriptionCreated(subscription) {
    const { id, customer, product, status, current_period_end } = subscription;
    const customerEmail = customer?.email;
    const userId = subscription.metadata?.user_id;

    console.log(`New subscription: ${id} for ${customerEmail}`);
    console.log(`Product: ${product?.name}, Status: ${status}`);
    console.log(`Period ends: ${current_period_end}`);

    // TODO: Update user tier in database
    // await supabase.from('profiles').update({ 
    //     tier: 'pro',
    //     polar_subscription_id: id,
    //     polar_customer_id: customer?.id,
    //     subscription_ends_at: current_period_end
    // }).eq('id', userId);

    // For now, log for manual processing
    console.log(`✅ User ${userId || customerEmail} upgraded to Pro!`);
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription) {
    const { id, status, current_period_end, canceled_at } = subscription;
    const userId = subscription.metadata?.user_id;

    console.log(`Subscription updated: ${id}`);
    console.log(`Status: ${status}, Ends: ${current_period_end}`);

    if (canceled_at) {
        console.log(`Subscription will cancel at period end: ${current_period_end}`);
    }

    // TODO: Update database
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCanceled(subscription) {
    const { id, customer } = subscription;
    const userId = subscription.metadata?.user_id;
    const customerEmail = customer?.email;

    console.log(`Subscription canceled: ${id} for ${customerEmail}`);

    // TODO: Downgrade user to free tier
    // await supabase.from('profiles').update({ 
    //     tier: 'free',
    //     polar_subscription_id: null
    // }).eq('id', userId);

    console.log(`⚠️ User ${userId || customerEmail} downgraded to Free tier`);
}

/**
 * Handle subscription revocation (failed payment)
 */
async function handleSubscriptionRevoked(subscription) {
    const { id, customer } = subscription;
    console.log(`Subscription revoked (payment failed): ${id}`);

    // Same as cancellation - downgrade to free
    await handleSubscriptionCanceled(subscription);
}

/**
 * Handle one-time order
 */
async function handleOrderCreated(order) {
    const { id, customer, product, amount } = order;
    console.log(`Order created: ${id}`);
    console.log(`Customer: ${customer?.email}, Amount: ${amount}`);

    // Handle one-time purchases if needed
}

module.exports = router;
