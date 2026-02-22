import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { createProposal } from '$lib/server/database/proposal.model';
import { canCreateProposal, incrementProposalUsage } from '$lib/server/database/subscription.model';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');

	const allowed = await canCreateProposal(locals.user.id);
	if (!allowed) throw redirect(302, '/dashboard');

	return { user: locals.user };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/login');

		const allowed = await canCreateProposal(locals.user.id);
		if (!allowed) return fail(403, { error: 'Proposal limit reached. Please upgrade your plan.' });

		const data = await request.formData();
		const title = (data.get('title') as string)?.trim();
		const client_name = (data.get('client_name') as string)?.trim();
		const client_email = (data.get('client_email') as string)?.trim();
		const project_description = (data.get('project_description') as string)?.trim();
		const project_type = (data.get('project_type') as string) ?? 'web';
		const budget_range = (data.get('budget_range') as string)?.trim();
		const timeline = (data.get('timeline') as string)?.trim();

		if (!title || !client_name || !project_description) {
			return fail(400, { error: 'Title, client name, and project description are required.' });
		}

		const { id } = await createProposal({
			user_id: locals.user.id,
			title,
			client_name,
			client_email: client_email || undefined,
			project_description,
			project_type,
			budget_range: budget_range || undefined,
			timeline: timeline || undefined
		});

		await incrementProposalUsage(locals.user.id);

		throw redirect(302, `/proposals/${id}?generate=1`);
	}
};
