<script lang="ts">
	import { FileText, Printer } from 'lucide-svelte';

	let { data } = $props();
	let proposal = data.proposal;

	type ProposalContent = {
		executive_summary: string;
		scope_of_work: Array<{ title: string; description: string }>;
		out_of_scope: string[];
		deliverables: string[];
		milestones: Array<{
			name: string;
			duration: string;
			tasks: string[];
			payment_percentage: number;
		}>;
		pricing: {
			total: string;
			breakdown: Array<{ item: string; cost: string; notes?: string }>;
			payment_schedule: string;
		};
		terms: {
			warranty: string;
			revisions: string;
			ip_ownership: string;
			confidentiality: string;
			change_requests: string;
		};
		next_steps: string[];
		validity: string;
	};

	let content: ProposalContent | null = proposal.generated_content
		? JSON.parse(proposal.generated_content)
		: null;

	function formatDate(date: Date) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{proposal.title} — Proposal</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<!-- Header bar -->
<div class="bg-base-100 border-b border-base-200 print:hidden sticky top-0 z-10">
	<div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<FileText class="text-primary" size={20} />
			<span class="font-semibold">ScopeWise</span>
		</div>
		<button class="btn btn-sm btn-ghost gap-1" onclick={() => window.print()}>
			<Printer size={14} />
			Print / Save PDF
		</button>
	</div>
</div>

<div class="max-w-4xl mx-auto px-4 py-10">
	<!-- Proposal Header -->
	<div class="mb-10">
		<div class="badge badge-primary badge-outline mb-4">Project Proposal</div>
		<h1 class="text-3xl font-bold mb-3">{proposal.title}</h1>
		<div class="flex flex-wrap gap-4 text-base-content/60 text-sm">
			<span>Prepared for: <strong class="text-base-content">{proposal.client_name}</strong></span>
			<span>·</span>
			<span>Date: <strong class="text-base-content">{formatDate(proposal.created_at)}</strong></span>
		</div>
		<div class="divider"></div>
	</div>

	{#if !content}
		<div class="flex flex-col items-center justify-center py-24 text-center">
			<FileText size={48} class="text-base-content/20 mb-4" />
			<h2 class="text-xl font-bold mb-2">Proposal is being prepared</h2>
			<p class="text-base-content/60">
				This proposal hasn't been generated yet. Please check back shortly.
			</p>
		</div>
	{:else}
		<div class="space-y-8">
			<!-- Executive Summary -->
			<section>
				<h2 class="text-xl font-bold text-primary border-b border-base-200 pb-2 mb-4">
					Executive Summary
				</h2>
				<div class="text-base-content/80 whitespace-pre-line leading-relaxed">
					{content.executive_summary}
				</div>
			</section>

			<!-- Scope of Work -->
			<section>
				<h2 class="text-xl font-bold text-primary border-b border-base-200 pb-2 mb-4">
					Scope of Work
				</h2>
				<div class="space-y-4">
					{#each content.scope_of_work as item}
						<div class="border-l-2 border-primary/30 pl-4">
							<h3 class="font-semibold mb-1">{item.title}</h3>
							<p class="text-base-content/70 text-sm">{item.description}</p>
						</div>
					{/each}
				</div>

				{#if content.out_of_scope?.length > 0}
					<div class="mt-6 bg-error/5 rounded-lg p-4">
						<h3 class="font-semibold text-error mb-2">Not Included in This Proposal</h3>
						<ul class="space-y-1">
							{#each content.out_of_scope as item}
								<li class="text-sm text-base-content/60 flex gap-2">
									<span class="text-error">✗</span>{item}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</section>

			<!-- Deliverables -->
			{#if content.deliverables?.length > 0}
				<section>
					<h2 class="text-xl font-bold text-primary border-b border-base-200 pb-2 mb-4">
						Deliverables
					</h2>
					<ul class="space-y-2">
						{#each content.deliverables as item}
							<li class="flex gap-2 text-base-content/80">
								<span class="text-success">✓</span>{item}
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<!-- Milestones -->
			{#if content.milestones?.length > 0}
				<section>
					<h2 class="text-xl font-bold text-primary border-b border-base-200 pb-2 mb-4">
						Project Timeline
					</h2>
					<div class="space-y-5">
						{#each content.milestones as milestone, i}
							<div class="flex gap-4">
								<div class="flex flex-col items-center">
									<div
										class="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold shrink-0"
									>
										{i + 1}
									</div>
									{#if i < content.milestones.length - 1}
										<div class="w-0.5 bg-base-300 flex-1 mt-2"></div>
									{/if}
								</div>
								<div class="pb-4 flex-1">
									<div class="flex items-center gap-2 mb-1 flex-wrap">
										<h3 class="font-semibold">{milestone.name}</h3>
										<span class="badge badge-ghost badge-sm">{milestone.duration}</span>
										{#if milestone.payment_percentage}
											<span class="badge badge-primary badge-sm"
												>{milestone.payment_percentage}% payment</span
											>
										{/if}
									</div>
									<ul class="space-y-1">
										{#each milestone.tasks as task}
											<li class="text-sm text-base-content/60">· {task}</li>
										{/each}
									</ul>
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<!-- Pricing -->
			{#if content.pricing}
				<section>
					<h2 class="text-xl font-bold text-primary border-b border-base-200 pb-2 mb-4">
						Investment
					</h2>
					<div class="overflow-x-auto">
						<table class="table">
							<thead>
								<tr>
									<th>Service</th>
									<th class="text-right">Cost</th>
									<th>Notes</th>
								</tr>
							</thead>
							<tbody>
								{#each content.pricing.breakdown as item}
									<tr>
										<td class="font-medium">{item.item}</td>
										<td class="text-right font-mono">{item.cost}</td>
										<td class="text-base-content/60 text-sm">{item.notes ?? ''}</td>
									</tr>
								{/each}
							</tbody>
							<tfoot>
								<tr>
									<td class="font-bold text-lg">Total Investment</td>
									<td class="text-right font-bold text-lg text-primary">{content.pricing.total}</td
									>
									<td></td>
								</tr>
							</tfoot>
						</table>
					</div>
					{#if content.pricing.payment_schedule}
						<div class="bg-primary/5 rounded-lg p-4 mt-4">
							<p class="text-sm font-medium text-primary mb-1">Payment Schedule</p>
							<p class="text-sm text-base-content/70">{content.pricing.payment_schedule}</p>
						</div>
					{/if}
				</section>
			{/if}

			<!-- Terms -->
			{#if content.terms}
				<section>
					<h2 class="text-xl font-bold text-primary border-b border-base-200 pb-2 mb-4">
						Terms & Conditions
					</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#if content.terms.revisions}
							<div>
								<h3 class="font-semibold text-sm text-base-content/50 uppercase tracking-wide mb-1">
									Revisions
								</h3>
								<p class="text-sm">{content.terms.revisions}</p>
							</div>
						{/if}
						{#if content.terms.warranty}
							<div>
								<h3 class="font-semibold text-sm text-base-content/50 uppercase tracking-wide mb-1">
									Warranty & Support
								</h3>
								<p class="text-sm">{content.terms.warranty}</p>
							</div>
						{/if}
						{#if content.terms.ip_ownership}
							<div>
								<h3 class="font-semibold text-sm text-base-content/50 uppercase tracking-wide mb-1">
									Intellectual Property
								</h3>
								<p class="text-sm">{content.terms.ip_ownership}</p>
							</div>
						{/if}
						{#if content.terms.change_requests}
							<div>
								<h3 class="font-semibold text-sm text-base-content/50 uppercase tracking-wide mb-1">
									Change Requests
								</h3>
								<p class="text-sm">{content.terms.change_requests}</p>
							</div>
						{/if}
						{#if content.terms.confidentiality}
							<div class="md:col-span-2">
								<h3 class="font-semibold text-sm text-base-content/50 uppercase tracking-wide mb-1">
									Confidentiality
								</h3>
								<p class="text-sm">{content.terms.confidentiality}</p>
							</div>
						{/if}
					</div>
				</section>
			{/if}

			<!-- Next Steps -->
			{#if content.next_steps?.length > 0}
				<section class="bg-primary rounded-xl p-6 text-primary-content">
					<h2 class="text-xl font-bold mb-4">Next Steps</h2>
					<ol class="space-y-2">
						{#each content.next_steps as step, i}
							<li class="flex gap-3">
								<span
									class="w-6 h-6 rounded-full bg-primary-content/20 flex items-center justify-center text-sm font-bold shrink-0"
								>
									{i + 1}
								</span>
								<span class="text-primary-content/90">{step}</span>
							</li>
						{/each}
					</ol>
				</section>
			{/if}

			{#if content.validity}
				<p class="text-center text-sm text-base-content/40 pb-4">{content.validity}</p>
			{/if}
		</div>
	{/if}

	<!-- Footer branding -->
	<div class="mt-16 pt-8 border-t border-base-200 text-center print:hidden">
		<p class="text-xs text-base-content/30">
			This proposal was generated with <a href="/" class="link">ScopeWise</a> · AI-Powered Proposals
			for Freelancers
		</p>
	</div>
</div>

<style>
	@media print {
		:global(body) {
			background: white;
		}
	}
</style>
