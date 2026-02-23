import type { PageServerLoad, Actions } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { getProposalById, updateProposalStatus, updateProposalContent } from '$lib/server/database/proposal.model';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	if (!locals.user) throw redirect(302, '/login');

	const proposal = await getProposalById(params.id);

	if (!proposal) throw error(404, 'Proposal not found');
	if (proposal.user_id !== locals.user.id) throw error(403, 'Forbidden');

	const shouldGenerate = url.searchParams.get('generate') === '1';

	return {
		proposal,
		shouldGenerate,
		user: locals.user
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/login');
		const data = await request.formData();
		const status = data.get('status') as string;
		await updateProposalStatus(params.id, status);
		return { success: true };
	},

	saveContent: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/login');
		const data = await request.formData();
		const content = data.get('content') as string;
		await updateProposalContent(params.id, content);
		return { success: true };
	}
};
