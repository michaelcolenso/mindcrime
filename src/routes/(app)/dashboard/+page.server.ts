import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { getProposalsByUser, deleteProposal } from '$lib/server/database/proposal.model';
import { getOrCreateSubscription, PLAN_LIMITS } from '$lib/server/database/subscription.model';
import type { Plan } from '$lib/server/database/subscription.model';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const [proposals, subscription] = await Promise.all([
		getProposalsByUser(locals.user.id),
		getOrCreateSubscription(locals.user.id)
	]);

	const limit = PLAN_LIMITS[subscription.plan as Plan] ?? 2;
	const canCreate = subscription.proposals_used < limit;

	return {
		proposals,
		subscription,
		canCreate,
		limit,
		user: locals.user
	};
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/login');

		const data = await request.formData();
		const id = data.get('id') as string;

		if (id) {
			await deleteProposal(id, locals.user.id);
		}

		return { success: true };
	}
};
