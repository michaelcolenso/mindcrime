import { json, type RequestEvent } from '@sveltejs/kit';
import { stripeClient } from '../stripe';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { updateSubscriptionFromStripe } from '$lib/server/database/subscription.model';
import { db } from '$lib/server/database/db';
import { userTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';
import type { Plan } from '$lib/server/database/subscription.model';

function toBuffer(ab: ArrayBuffer): Buffer {
	const buf = Buffer.alloc(ab.byteLength);
	const view = new Uint8Array(ab);
	for (let i = 0; i < buf.length; i++) {
		buf[i] = view[i];
	}
	return buf;
}

function priceIdToPlan(priceId: string): Plan {
	const { STRIPE_PRO_PRICE_ID, STRIPE_STARTER_PRICE_ID } = process.env;
	if (priceId === STRIPE_PRO_PRICE_ID) return 'pro';
	if (priceId === STRIPE_STARTER_PRICE_ID) return 'starter';
	return 'free';
}

export async function POST(event: RequestEvent) {
	const req = event.request;
	let stripeEvent: ReturnType<typeof stripeClient.webhooks.constructEvent>;

	if (STRIPE_WEBHOOK_SECRET) {
		const _rawBody = await req.arrayBuffer();
		const payload = toBuffer(_rawBody);
		const signature = req.headers.get('stripe-signature') as string;

		try {
			stripeEvent = stripeClient.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
		} catch (err) {
			console.error('Webhook signature verification failed:', err);
			return json({ error: 'Invalid signature' }, { status: 400 });
		}
	} else {
		return json({ error: 'Webhook secret not configured' }, { status: 500 });
	}

	try {
		switch (stripeEvent.type) {
			case 'checkout.session.completed': {
				const session = stripeEvent.data.object as {
					customer?: string | null;
					customer_email?: string | null;
					subscription?: string | null;
					metadata?: Record<string, string>;
					client_reference_id?: string | null;
				};

				const customerId = session.customer as string;
				const subscriptionId = session.subscription as string;
				const userId = session.client_reference_id ?? session.metadata?.user_id;

				if (!userId || !subscriptionId) break;

				const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);
				const priceId = subscription.items.data[0]?.price?.id ?? '';
				const plan = priceIdToPlan(priceId);

				await updateSubscriptionFromStripe({
					stripe_customer_id: customerId,
					stripe_subscription_id: subscriptionId,
					plan,
					status: subscription.status,
					period_start: new Date(subscription.current_period_start * 1000),
					period_end: new Date(subscription.current_period_end * 1000),
					user_id: userId
				});

				console.log(`Subscription activated: user=${userId} plan=${plan}`);
				break;
			}

			case 'invoice.paid': {
				const invoice = stripeEvent.data.object as {
					customer?: string | null;
					subscription?: string | null;
				};

				if (!invoice.subscription) break;

				const subscription = await stripeClient.subscriptions.retrieve(invoice.subscription as string);
				const priceId = subscription.items.data[0]?.price?.id ?? '';
				const plan = priceIdToPlan(priceId);

				// Find user by stripe customer ID
				const users = await db
					.select()
					.from(userTable)
					.where(eq(userTable.stripe_customer_id, invoice.customer as string));

				if (users[0]) {
					await updateSubscriptionFromStripe({
						stripe_customer_id: invoice.customer as string,
						stripe_subscription_id: invoice.subscription as string,
						plan,
						status: subscription.status,
						period_start: new Date(subscription.current_period_start * 1000),
						period_end: new Date(subscription.current_period_end * 1000),
						user_id: users[0].id
					});
					console.log(`Subscription renewed: user=${users[0].id} plan=${plan}`);
				}
				break;
			}

			case 'invoice.payment_failed': {
				const invoice = stripeEvent.data.object as { customer?: string | null; subscription?: string | null };
				const users = await db
					.select()
					.from(userTable)
					.where(eq(userTable.stripe_customer_id, invoice.customer as string));

				if (users[0] && invoice.subscription) {
					const subscription = await stripeClient.subscriptions.retrieve(invoice.subscription as string);
					await updateSubscriptionFromStripe({
						stripe_customer_id: invoice.customer as string,
						stripe_subscription_id: invoice.subscription as string,
						plan: 'free',
						status: 'past_due',
						period_start: new Date(subscription.current_period_start * 1000),
						period_end: new Date(subscription.current_period_end * 1000),
						user_id: users[0].id
					});
				}
				break;
			}

			case 'customer.subscription.deleted': {
				const subscription = stripeEvent.data.object as {
					id: string;
					customer: string | null;
					current_period_start: number;
					current_period_end: number;
				};
				const users = await db
					.select()
					.from(userTable)
					.where(eq(userTable.stripe_customer_id, subscription.customer as string));

				if (users[0]) {
					await updateSubscriptionFromStripe({
						stripe_customer_id: subscription.customer as string,
						stripe_subscription_id: subscription.id,
						plan: 'free',
						status: 'canceled',
						period_start: new Date(subscription.current_period_start * 1000),
						period_end: new Date(subscription.current_period_end * 1000),
						user_id: users[0].id
					});
				}
				break;
			}

			default:
				console.log(`Unhandled event: ${stripeEvent.type}`);
		}
	} catch (err) {
		console.error('Webhook handler error:', err);
		return json({ error: 'Webhook handler failed' }, { status: 500 });
	}

	return json({ received: true });
}
