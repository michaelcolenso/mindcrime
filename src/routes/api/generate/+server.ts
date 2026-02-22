import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import { getProposalById, updateProposalContent } from '$lib/server/database/proposal.model';

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

function buildPrompt(proposal: {
	title: string;
	client_name: string;
	project_description: string;
	project_type: string;
	budget_range?: string | null;
	timeline?: string | null;
}): string {
	return `You are an expert freelance consultant who writes professional, winning project proposals. Generate a complete, detailed project proposal based on the following brief.

PROJECT DETAILS:
- Title: ${proposal.title}
- Client: ${proposal.client_name}
- Project Type: ${proposal.project_type}
- Description: ${proposal.project_description}
${proposal.budget_range ? `- Budget Range: ${proposal.budget_range}` : ''}
${proposal.timeline ? `- Desired Timeline: ${proposal.timeline}` : ''}

Generate a comprehensive proposal as a JSON object with exactly these fields. Be specific, professional, and tailor everything to this specific project:

{
  "executive_summary": "2-3 paragraph executive summary that hooks the client, demonstrates understanding of their needs, and positions you as the ideal partner. Reference their specific project.",

  "scope_of_work": [
    {"title": "Phase/Feature title", "description": "Detailed description of what's included"}
  ],

  "out_of_scope": [
    "Specific item explicitly NOT included in this proposal"
  ],

  "deliverables": [
    "Specific deliverable the client receives"
  ],

  "milestones": [
    {
      "name": "Milestone name",
      "duration": "e.g. Week 1-2",
      "tasks": ["Specific task", "Another task"],
      "payment_percentage": 25
    }
  ],

  "pricing": {
    "total": "e.g. $7,500",
    "breakdown": [
      {"item": "Service/phase name", "cost": "$X,XXX", "notes": "Optional note"}
    ],
    "payment_schedule": "Description of payment terms (e.g. 50% upfront, 50% on delivery)"
  },

  "terms": {
    "warranty": "Description of warranty/support period after delivery",
    "revisions": "Number and scope of revisions included",
    "ip_ownership": "When and how IP transfers to client",
    "confidentiality": "Brief confidentiality clause",
    "change_requests": "How out-of-scope changes are handled"
  },

  "next_steps": [
    "Specific action for client to take"
  ],

  "validity": "This proposal is valid for 30 days from the date of issue."
}

Respond with ONLY the raw JSON object. No markdown, no code blocks, no explanation. Just the JSON.`;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const { proposal_id } = await request.json();

	if (!proposal_id) {
		throw error(400, 'proposal_id is required');
	}

	const proposal = await getProposalById(proposal_id);

	if (!proposal) {
		throw error(404, 'Proposal not found');
	}

	if (proposal.user_id !== locals.user.id) {
		throw error(403, 'Forbidden');
	}

	// Stream the response for a better UX
	const stream = new ReadableStream({
		async start(controller) {
			try {
				const prompt = buildPrompt(proposal);

				const message = await client.messages.create({
					model: 'claude-opus-4-5',
					max_tokens: 4096,
					messages: [{ role: 'user', content: prompt }]
				});

				const content = message.content[0];
				if (content.type !== 'text') {
					throw new Error('Unexpected response type from Claude');
				}

				let jsonText = content.text.trim();
				// Strip markdown code blocks if present
				if (jsonText.startsWith('```')) {
					jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
				}

				// Validate JSON
				const parsed = JSON.parse(jsonText);

				// Save to database
				await updateProposalContent(proposal_id, JSON.stringify(parsed));

				controller.enqueue(new TextEncoder().encode(JSON.stringify({ success: true, data: parsed })));
				controller.close();
			} catch (err) {
				console.error('Generation error:', err);
				controller.enqueue(
					new TextEncoder().encode(
						JSON.stringify({ success: false, error: 'Failed to generate proposal. Please try again.' })
					)
				);
				controller.close();
			}
		}
	});

	return new Response(stream, {
		headers: { 'Content-Type': 'application/json' }
	});
};
