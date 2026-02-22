import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getProposalByShareToken } from '$lib/server/database/proposal.model';

export const load: PageServerLoad = async ({ params }) => {
	const proposal = await getProposalByShareToken(params.token);

	if (!proposal) {
		throw error(404, 'Proposal not found or link has expired.');
	}

	return { proposal };
};
