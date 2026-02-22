<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import {
		ArrowLeft,
		Printer,
		Share2,
		Zap,
		CheckCircle,
		Send,
		XCircle,
		Clock,
		Copy,
		Check
	} from 'lucide-svelte';
	import { PUBLIC_ORIGIN } from '$env/static/public';

	let { data } = $props();

	let proposal = $state(data.proposal);
	let generating = $state(false);
	let generated = $state(false);
	let generationError = $state('');
	let copied = $state(false);

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

	let content = $state<ProposalContent | null>(
		proposal.generated_content ? JSON.parse(proposal.generated_content) : null
	);

	async function generateProposal() {
		generating = true;
		generationError = '';

		try {
			const res = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ proposal_id: proposal.id })
			});

			const result = await res.json();

			if (result.success) {
				content = result.data;
				generated = true;
			} else {
				generationError = result.error ?? 'Generation failed. Please try again.';
			}
		} catch (err) {
			generationError = 'Network error. Please try again.';
		} finally {
			generating = false;
		}
	}

	onMount(() => {
		if (data.shouldGenerate && !content) {
			generateProposal();
		}
	});

	async function copyShareLink() {
		const link = `${PUBLIC_ORIGIN}/share/${proposal.share_token}`;
		await navigator.clipboard.writeText(link);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function printProposal() {
		window.print();
	}

	const statusOptions = [
		{ value: 'draft', label: 'Draft', icon: Clock },
		{ value: 'sent', label: 'Sent', icon: Send },
		{ value: 'accepted', label: 'Accepted', icon: CheckCircle },
		{ value: 'rejected', label: 'Rejected', icon: XCircle }
	];

	let currentStatus = $state(proposal.status);
</script>

<svelte:head>
	<title>{proposal.title} — ScopeWise</title>
</svelte:head>

<!-- Print-only header -->
<div class="hidden print:block mb-8">
	<h1 class="text-3xl font-bold">{proposal.title}</h1>
	<p class="text-gray-500">Prepared for: {proposal.client_name}</p>
	<p class="text-gray-500">Date: {new Date(proposal.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
	<hr class="my-4" />
</div>

<div class="max-w-4xl mx-auto px-4 py-10 print:py-0 print:max-w-none">
	<!-- Toolbar (hidden when printing) -->
	<div class="print:hidden">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
			<a href="/dashboard" class="btn btn-ghost btn-sm gap-2">
				<ArrowLeft size={16} />
				Dashboard
			</a>

			<div class="flex gap-2 flex-wrap">
				<!-- Status selector -->
				<form method="post" action="?/updateStatus" use:enhance class="flex">
					<select
						name="status"
						class="select select-bordered select-sm"
						bind:value={currentStatus}
						onchange={(e) => {
							(e.target as HTMLSelectElement).form?.requestSubmit();
						}}
					>
						{#each statusOptions as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</form>

				<button class="btn btn-sm btn-ghost gap-1" onclick={copyShareLink}>
					{#if copied}
						<Check size={14} class="text-success" />
						Copied!
					{:else}
						<Copy size={14} />
						Share link
					{/if}
				</button>

				<button class="btn btn-sm btn-ghost gap-1" onclick={printProposal}>
					<Printer size={14} />
					Print / PDF
				</button>

				{#if content}
					<button class="btn btn-sm btn-primary gap-1" onclick={generateProposal} disabled={generating}>
						{#if generating}
							<span class="loading loading-spinner loading-xs"></span>
						{:else}
							<Zap size={14} />
						{/if}
						Regenerate
					</button>
				{/if}
			</div>
		</div>

		<div class="mb-6">
			<h1 class="text-2xl font-bold">{proposal.title}</h1>
			<p class="text-base-content/60">
				For {proposal.client_name}
				{#if proposal.client_email}· {proposal.client_email}{/if}
			</p>
		</div>
	</div>

	<!-- Generation state -->
	{#if generating}
		<div class="flex flex-col items-center justify-center py-24 gap-4">
			<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
				<Zap size={32} class="text-primary animate-pulse" />
			</div>
			<h2 class="text-xl font-bold">Generating your proposal...</h2>
			<p class="text-base-content/60 text-center max-w-sm">
				Claude AI is reading your brief and crafting a professional proposal. This takes about 20–30
				seconds.
			</p>
			<span class="loading loading-dots loading-lg text-primary"></span>
		</div>
	{:else if generationError}
		<div class="alert alert-error mb-6">
			<span>{generationError}</span>
			<button class="btn btn-sm btn-ghost" onclick={generateProposal}>Try again</button>
		</div>
	{:else if !content}
		<div class="flex flex-col items-center justify-center py-24 gap-4">
			<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
				<Zap size={32} class="text-primary" />
			</div>
			<h2 class="text-xl font-bold">Ready to generate</h2>
			<p class="text-base-content/60">Click the button below to generate your AI proposal.</p>
			<button class="btn btn-primary btn-lg gap-2" onclick={generateProposal}>
				<Zap size={18} />
				Generate Proposal
			</button>
		</div>
	{:else}
		<!-- Proposal Content -->
		<div class="space-y-8 proposal-content">
			<!-- Executive Summary -->
			<section class="card bg-base-100 shadow-sm ring-1 ring-base-200 print:shadow-none print:ring-0">
				<div class="card-body">
					<h2 class="text-xl font-bold text-primary mb-3">Executive Summary</h2>
					<div class="prose max-w-none text-base-content/80 whitespace-pre-line">
						{content.executive_summary}
					</div>
				</div>
			</section>

			<!-- Scope of Work -->
			<section class="card bg-base-100 shadow-sm ring-1 ring-base-200 print:shadow-none print:ring-0">
				<div class="card-body">
					<h2 class="text-xl font-bold text-primary mb-4">Scope of Work</h2>
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
										<span class="text-error">✗</span>
										{item}
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</section>

			<!-- Deliverables -->
			{#if content.deliverables?.length > 0}
				<section class="card bg-base-100 shadow-sm ring-1 ring-base-200 print:shadow-none print:ring-0">
					<div class="card-body">
						<h2 class="text-xl font-bold text-primary mb-4">Deliverables</h2>
						<ul class="space-y-2">
							{#each content.deliverables as item}
								<li class="flex gap-2 text-base-content/80">
									<span class="text-success">✓</span>
									{item}
								</li>
							{/each}
						</ul>
					</div>
				</section>
			{/if}

			<!-- Timeline & Milestones -->
			{#if content.milestones?.length > 0}
				<section class="card bg-base-100 shadow-sm ring-1 ring-base-200 print:shadow-none print:ring-0">
					<div class="card-body">
						<h2 class="text-xl font-bold text-primary mb-4">Project Milestones</h2>
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
										<div class="flex items-center gap-2 mb-1">
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
					</div>
				</section>
			{/if}

			<!-- Pricing -->
			{#if content.pricing}
				<section class="card bg-base-100 shadow-sm ring-1 ring-base-200 print:shadow-none print:ring-0">
					<div class="card-body">
						<h2 class="text-xl font-bold text-primary mb-4">Investment</h2>
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
										<td class="text-right font-bold text-lg text-primary"
											>{content.pricing.total}</td
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
					</div>
				</section>
			{/if}

			<!-- Terms -->
			{#if content.terms}
				<section class="card bg-base-100 shadow-sm ring-1 ring-base-200 print:shadow-none print:ring-0">
					<div class="card-body">
						<h2 class="text-xl font-bold text-primary mb-4">Terms & Conditions</h2>
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
					</div>
				</section>
			{/if}

			<!-- Next Steps -->
			{#if content.next_steps?.length > 0}
				<section class="card bg-primary text-primary-content shadow-sm">
					<div class="card-body">
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
					</div>
				</section>
			{/if}

			{#if content.validity}
				<p class="text-center text-sm text-base-content/40 pb-8">{content.validity}</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	@media print {
		:global(header),
		:global(nav) {
			display: none !important;
		}
	}
</style>
