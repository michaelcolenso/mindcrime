import { json, type RequestEvent } from '@sveltejs/kit';
import { stripeClient } from '../stripe';
import { PUBLIC_ORIGIN } from '$env/static/public';

export async function POST(event: RequestEvent): Promise<Response> {
	if (!event.locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await event.request.json();
	const priceId = data.priceId;

	if (typeof priceId !== 'string') {
		return json({ error: 'priceId is required' }, { status: 400 });
	}

	try {
		const session = await stripeClient.checkout.sessions.create({
			mode: 'subscription',
			payment_method_types: ['card'],
			client_reference_id: event.locals.user.id,
			customer_email: event.locals.user.email,
			metadata: {
				user_id: event.locals.user.id
			},
			line_items: [
				{
					price: priceId,
					quantity: 1
				}
			],
			allow_promotion_codes: true,
			success_url: `${PUBLIC_ORIGIN}/dashboard?success=1`,
			cancel_url: `${PUBLIC_ORIGIN}/#pricing`
		});

		if (!session.url) {
			throw new Error('No session URL returned from Stripe');
		}

		return json({ url: session.url });
	} catch (error) {
		console.error('Stripe checkout error:', error);
		return json({ error: 'Failed to create checkout session' }, { status: 500 });
	}
}
