import { db } from './db';
import { subscriptionTable } from './schema';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';

export type Plan = 'free' | 'starter' | 'pro';

export const PLAN_LIMITS: Record<Plan, number> = {
	free: 2,
	starter: 20,
	pro: Infinity
};

export async function getOrCreateSubscription(user_id: string) {
	const existing = await db
		.select()
		.from(subscriptionTable)
		.where(eq(subscriptionTable.user_id, user_id))
		.limit(1);

	if (existing[0]) return existing[0];

	const id = generateId(16);
	const now = new Date();
	await db.insert(subscriptionTable).values({
		id,
		user_id,
		plan: 'free',
		status: 'active',
		proposals_used: 0,
		created_at: now,
		updated_at: now
	});

	const created = await db
		.select()
		.from(subscriptionTable)
		.where(eq(subscriptionTable.user_id, user_id))
		.limit(1);

	return created[0];
}

export async function canCreateProposal(user_id: string): Promise<boolean> {
	const sub = await getOrCreateSubscription(user_id);
	const limit = PLAN_LIMITS[sub.plan as Plan] ?? 2;
	return sub.proposals_used < limit;
}

export async function incrementProposalUsage(user_id: string) {
	const sub = await getOrCreateSubscription(user_id);
	await db
		.update(subscriptionTable)
		.set({ proposals_used: sub.proposals_used + 1, updated_at: new Date() })
		.where(eq(subscriptionTable.user_id, user_id));
}

export async function updateSubscriptionFromStripe(data: {
	stripe_customer_id: string;
	stripe_subscription_id: string;
	plan: Plan;
	status: string;
	period_start: Date;
	period_end: Date;
	user_id: string;
}) {
	const existing = await db
		.select()
		.from(subscriptionTable)
		.where(eq(subscriptionTable.user_id, data.user_id))
		.limit(1);

	const now = new Date();

	if (existing[0]) {
		await db
			.update(subscriptionTable)
			.set({
				stripe_customer_id: data.stripe_customer_id,
				stripe_subscription_id: data.stripe_subscription_id,
				plan: data.plan,
				status: data.status,
				period_start: data.period_start,
				period_end: data.period_end,
				proposals_used: 0, // reset on new period
				updated_at: now
			})
			.where(eq(subscriptionTable.user_id, data.user_id));
	} else {
		await db.insert(subscriptionTable).values({
			id: generateId(16),
			user_id: data.user_id,
			stripe_customer_id: data.stripe_customer_id,
			stripe_subscription_id: data.stripe_subscription_id,
			plan: data.plan,
			status: data.status,
			period_start: data.period_start,
			period_end: data.period_end,
			proposals_used: 0,
			created_at: now,
			updated_at: now
		});
	}
}
