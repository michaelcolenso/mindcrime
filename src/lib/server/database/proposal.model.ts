import { db } from './db';
import { proposalTable, subscriptionTable, userTable } from './schema';
import { eq, desc } from 'drizzle-orm';
import { generateId } from 'lucia';

export async function createProposal(data: {
	user_id: string;
	title: string;
	client_name: string;
	client_email?: string;
	project_description: string;
	project_type: string;
	budget_range?: string;
	timeline?: string;
}) {
	const id = generateId(16);
	const share_token = generateId(24);
	const now = new Date();

	await db.insert(proposalTable).values({
		id,
		user_id: data.user_id,
		title: data.title,
		client_name: data.client_name,
		client_email: data.client_email,
		project_description: data.project_description,
		project_type: data.project_type,
		budget_range: data.budget_range,
		timeline: data.timeline,
		share_token,
		status: 'draft',
		created_at: now,
		updated_at: now
	});

	return { id, share_token };
}

export async function getProposalsByUser(user_id: string) {
	return db
		.select()
		.from(proposalTable)
		.where(eq(proposalTable.user_id, user_id))
		.orderBy(desc(proposalTable.created_at));
}

export async function getProposalById(id: string) {
	const results = await db.select().from(proposalTable).where(eq(proposalTable.id, id)).limit(1);
	return results[0] ?? null;
}

export async function getProposalByShareToken(token: string) {
	const results = await db
		.select()
		.from(proposalTable)
		.where(eq(proposalTable.share_token, token))
		.limit(1);
	return results[0] ?? null;
}

export async function updateProposalContent(id: string, generated_content: string) {
	await db
		.update(proposalTable)
		.set({ generated_content, updated_at: new Date() })
		.where(eq(proposalTable.id, id));
}

export async function updateProposalStatus(id: string, status: string) {
	await db
		.update(proposalTable)
		.set({ status, updated_at: new Date() })
		.where(eq(proposalTable.id, id));
}

export async function deleteProposal(id: string, user_id: string) {
	await db
		.delete(proposalTable)
		.where(eq(proposalTable.id, id) && eq(proposalTable.user_id, user_id));
}
