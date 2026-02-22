<script lang="ts">
	import { enhance } from '$app/forms';
	import { FileText, Plus, ExternalLink, Trash2, Clock, CheckCircle, XCircle, Send } from 'lucide-svelte';

	let { data } = $props();

	const statusColors: Record<string, string> = {
		draft: 'badge-ghost',
		sent: 'badge-info',
		accepted: 'badge-success',
		rejected: 'badge-error'
	};

	const statusIcons: Record<string, typeof Clock> = {
		draft: Clock,
		sent: Send,
		accepted: CheckCircle,
		rejected: XCircle
	};

	function formatDate(date: Date | null | undefined) {
		if (!date) return '';
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	const planNames: Record<string, string> = { free: 'Free', starter: 'Starter', pro: 'Pro' };
</script>

<svelte:head>
	<title>Dashboard — ScopeWise</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-10">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
		<div>
			<h1 class="text-3xl font-bold">My Proposals</h1>
			<p class="text-base-content/60 mt-1">
				{#if data.subscription.plan === 'pro'}
					Unlimited proposals · Pro plan
				{:else}
					{data.subscription.proposals_used} / {data.limit} proposals used ·
					{planNames[data.subscription.plan]} plan
				{/if}
			</p>
		</div>
		{#if data.canCreate}
			<a href="/proposals/new" class="btn btn-primary gap-2">
				<Plus size={18} />
				New Proposal
			</a>
		{:else}
			<a href="/#pricing" class="btn btn-warning gap-2">
				<Plus size={18} />
				Upgrade to create more
			</a>
		{/if}
	</div>

	<!-- Usage bar (for non-pro plans) -->
	{#if data.subscription.plan !== 'pro'}
		<div class="card bg-base-200 mb-8 p-4">
			<div class="flex justify-between text-sm mb-2">
				<span class="font-medium">Proposals this period</span>
				<span class="text-base-content/60"
					>{data.subscription.proposals_used} / {data.limit === Infinity
						? '∞'
						: data.limit}</span
				>
			</div>
			<progress
				class="progress progress-primary w-full"
				value={data.subscription.proposals_used}
				max={data.limit}
			></progress>
			{#if !data.canCreate}
				<p class="text-sm text-warning mt-2">
					You've reached your proposal limit. <a href="/#pricing" class="link link-primary"
						>Upgrade your plan</a
					> to create more.
				</p>
			{/if}
		</div>
	{/if}

	<!-- Empty state -->
	{#if data.proposals.length === 0}
		<div class="flex flex-col items-center justify-center py-24 text-center">
			<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
				<FileText size={32} class="text-primary" />
			</div>
			<h2 class="text-xl font-bold mb-2">No proposals yet</h2>
			<p class="text-base-content/60 max-w-sm mb-6">
				Generate your first AI-powered proposal in under 60 seconds. Impress your clients from the
				very first touchpoint.
			</p>
			{#if data.canCreate}
				<a href="/proposals/new" class="btn btn-primary gap-2">
					<Plus size={18} />
					Create your first proposal
				</a>
			{/if}
		</div>
	{:else}
		<!-- Proposal list -->
		<div class="space-y-3">
			{#each data.proposals as proposal}
				<div
					class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow ring-1 ring-base-200"
				>
					<div class="card-body py-4 px-6">
						<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2 mb-1">
									<span
										class="badge {statusColors[proposal.status] ?? 'badge-ghost'} badge-sm gap-1"
									>
										<svelte:component
											this={statusIcons[proposal.status] ?? Clock}
											size={10}
										/>
										{proposal.status}
									</span>
									<span class="text-xs text-base-content/40">{proposal.project_type}</span>
								</div>
								<h3 class="font-semibold truncate">{proposal.title}</h3>
								<p class="text-sm text-base-content/60">
									{proposal.client_name} · {formatDate(proposal.created_at)}
								</p>
							</div>

							<div class="flex items-center gap-2 shrink-0">
								<a
									href="/proposals/{proposal.id}"
									class="btn btn-sm btn-ghost gap-1"
									title="View proposal"
								>
									<ExternalLink size={14} />
									View
								</a>
								<a
									href="/share/{proposal.share_token}"
									class="btn btn-sm btn-ghost gap-1"
									target="_blank"
									title="Client share link"
								>
									<ExternalLink size={14} />
									Share
								</a>
								<form method="post" action="?/delete" use:enhance>
									<input type="hidden" name="id" value={proposal.id} />
									<button
										type="submit"
										class="btn btn-sm btn-ghost text-error"
										title="Delete proposal"
										onclick={(e) => { if (!confirm('Delete this proposal?')) e.preventDefault(); }}
									>
										<Trash2 size={14} />
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
