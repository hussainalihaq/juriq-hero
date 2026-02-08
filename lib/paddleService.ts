
import { initializePaddle, Paddle } from '@paddle/paddle-js';

// Paddle Instance
let paddle: Paddle | undefined;

// Product IDs (Price IDs in Paddle Billing)
export const PADDLE_PRICES = {
    PRO_MONTHLY: import.meta.env.VITE_PADDLE_PRO_MONTHLY_ID || '',
    PRO_YEARLY: import.meta.env.VITE_PADDLE_PRO_YEARLY_ID || ''
};

/**
 * Initialize Paddle Client
 */
export async function initPaddle() {
    if (paddle) return paddle;

    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
    const environment = import.meta.env.VITE_PADDLE_ENV === 'production' ? 'production' : 'sandbox';

    if (!token) {
        console.warn('Paddle Client Token missing');
        return undefined;
    }

    try {
        paddle = await initializePaddle({
            environment,
            token,
            eventCallback: (data) => {
                // Handle events if needed
            }
        });
        return paddle;
    } catch (error) {
        console.error('Paddle Initialization Error:', error);
        return undefined;
    }
}

/**
 * Open Paddle Checkout for Pro Plan
 */
export async function openPaddleCheckout(
    email: string,
    userId: string,
    billingCycle: 'monthly' | 'yearly' = 'monthly'
) {
    if (!paddle) {
        await initPaddle();
    }

    if (!paddle) {
        alert('Payment system unavailable. Please contact support.');
        return;
    }

    const priceId = billingCycle === 'yearly'
        ? PADDLE_PRICES.PRO_YEARLY
        : PADDLE_PRICES.PRO_MONTHLY;

    if (!priceId) {
        alert('Product configuration error. Please contact support.');
        return;
    }

    try {
        paddle.Checkout.open({
            items: [{ priceId, quantity: 1 }],
            customer: {
                email: email
            },
            customData: {
                user_id: userId,
                source: 'juriq_app'
            },
            settings: {
                displayMode: 'overlay',
                theme: 'light',
                locale: 'en',
                successUrl: `${window.location.origin}/dashboard?upgraded=true`
            }
        });
    } catch (error) {
        console.error('Paddle Checkout Error:', error);
        alert('Failed to open checkout. Please try again.');
    }
}
