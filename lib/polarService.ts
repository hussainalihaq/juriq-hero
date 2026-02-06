// Polar Payment Service for Juriq
// This file handles Polar checkout and subscription management

import { Polar } from '@polar-sh/sdk';

// Initialize Polar client (client-side safe - ONLY for public data if needed)
// Note: Checkout creation is now handled by the backend to protect the secret token.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Product IDs from Polar Dashboard
export const POLAR_PRODUCTS = {
    PRO_MONTHLY: import.meta.env.VITE_POLAR_PRO_MONTHLY_ID || '',
    PRO_YEARLY: import.meta.env.VITE_POLAR_PRO_YEARLY_ID || ''
};

/**
 * Create a checkout session via Backend API
 */
export async function createCheckout(
    customerEmail: string,
    productId: string,
    successUrl: string = `${window.location.origin}/dashboard?upgraded=true`,
    metadata?: Record<string, string>
): Promise<string | null> {
    try {
        const userId = metadata?.user_id;

        const response = await fetch(`${API_URL}/api/checkout/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId,
                customerEmail,
                userId,
                successUrl
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Checkout creation failed');
        }

        const data = await response.json();
        return data.url || null; // Return the checkout URL
    } catch (error) {
        console.error('Polar checkout error:', error);
        throw error;
    }
}

/**
 * Open Polar checkout in a new tab or redirect
 */
export async function openProUpgrade(
    email: string,
    userId?: string,
    billingCycle: 'monthly' | 'yearly' = 'monthly'
): Promise<void> {
    const productId = billingCycle === 'yearly'
        ? POLAR_PRODUCTS.PRO_YEARLY
        : POLAR_PRODUCTS.PRO_MONTHLY;

    if (!productId) {
        console.error('Polar product ID not configured');
        alert('Payment system is being set up. Please contact support.');
        return;
    }

    try {
        const checkoutUrl = await createCheckout(
            email,
            productId,
            `${window.location.origin}/dashboard?upgraded=true`,
            userId ? { user_id: userId } : undefined
        );

        if (checkoutUrl) {
            // Redirect to Polar checkout
            window.location.href = checkoutUrl;
        }
    } catch (error) {
        console.error('Failed to create checkout:', error);
        alert('Unable to start checkout. Please try again or contact support.');
    }
}

/**
 * Get customer portal URL for managing subscription
 */
export async function getCustomerPortalUrl(customerId: string): Promise<string | null> {
    try {
        // Polar provides a customer portal for subscription management
        // This is typically handled via webhook-provided customer data
        return `https://polar.sh/dashboard/subscriptions`;
    } catch (error) {
        console.error('Failed to get customer portal:', error);
        return null;
    }
}


// export { polar }; // Removed as we use backend for API calls
