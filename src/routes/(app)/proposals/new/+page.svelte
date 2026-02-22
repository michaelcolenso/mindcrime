<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft, Zap } from 'lucide-svelte';

	let { form } = $props();
	let loading = $state(false);

	const projectTypes = [
		{ value: 'web', label: 'Web Development' },
		{ value: 'mobile', label: 'Mobile App' },
		{ value: 'design', label: 'UI/UX Design' },
		{ value: 'marketing', label: 'Digital Marketing' },
		{ value: 'seo', label: 'SEO / Content' },
		{ value: 'consulting', label: 'Consulting' },
		{ value: 'other', label: 'Other' }
	];
</script>

<svelte:head>
	<title>New Proposal — ScopeWise</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-10">
	<a href="/dashboard" class="btn btn-ghost btn-sm gap-2 mb-6">
		<ArrowLeft size={16} />
		Back to dashboard
	</a>

	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2">New Proposal</h1>
		<p class="text-base-content/60">
			Fill in the details below. The more specific you are, the better the AI-generated proposal.
		</p>
	</div>

	{#if form?.error}
		<div class="alert alert-error mb-6">
			<span>{form.error}</span>
		</div>
	{/if}

	<form
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
		class="space-y-6"
	>
		<div class="card bg-base-100 shadow-sm ring-1 ring-base-200">
			<div class="card-body gap-5">
				<h2 class="font-semibold text-lg">Project Details</h2>

				<div class="form-control">
					<label class="label" for="title">
						<span class="label-text font-medium">Proposal title <span class="text-error">*</span></span>
					</label>
					<input
						type="text"
						id="title"
						name="title"
						class="input input-bordered"
						placeholder="e.g. E-Commerce Website for Acme Co."
						required
					/>
					<label class="label">
						<span class="label-text-alt text-base-content/50">A short, descriptive title for your records</span>
					</label>
				</div>

				<div class="form-control">
					<label class="label" for="project_type">
						<span class="label-text font-medium">Project type <span class="text-error">*</span></span>
					</label>
					<select id="project_type" name="project_type" class="select select-bordered" required>
						{#each projectTypes as type}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				</div>

				<div class="form-control">
					<label class="label" for="project_description">
						<span class="label-text font-medium"
							>Project description <span class="text-error">*</span></span
						>
					</label>
					<textarea
						id="project_description"
						name="project_description"
						class="textarea textarea-bordered min-h-36"
						placeholder="Describe the project in plain English. What does the client need? What features, integrations, or deliverables are required? What's the business goal? The more detail, the better the proposal."
						required
					></textarea>
					<label class="label">
						<span class="label-text-alt text-base-content/50"
							>Tip: mention technologies, platforms, integrations, and specific features</span
						>
					</label>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label" for="budget_range">
							<span class="label-text font-medium">Budget range</span>
						</label>
						<input
							type="text"
							id="budget_range"
							name="budget_range"
							class="input input-bordered"
							placeholder="e.g. $5,000 – $8,000"
						/>
					</div>
					<div class="form-control">
						<label class="label" for="timeline">
							<span class="label-text font-medium">Timeline</span>
						</label>
						<input
							type="text"
							id="timeline"
							name="timeline"
							class="input input-bordered"
							placeholder="e.g. 6–8 weeks"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm ring-1 ring-base-200">
			<div class="card-body gap-5">
				<h2 class="font-semibold text-lg">Client Information</h2>

				<div class="form-control">
					<label class="label" for="client_name">
						<span class="label-text font-medium"
							>Client name <span class="text-error">*</span></span
						>
					</label>
					<input
						type="text"
						id="client_name"
						name="client_name"
						class="input input-bordered"
						placeholder="e.g. Sarah Johnson / Acme Corp"
						required
					/>
				</div>

				<div class="form-control">
					<label class="label" for="client_email">
						<span class="label-text font-medium">Client email</span>
					</label>
					<input
						type="email"
						id="client_email"
						name="client_email"
						class="input input-bordered"
						placeholder="client@company.com"
					/>
					<label class="label">
						<span class="label-text-alt text-base-content/50">Optional — for your reference only</span>
					</label>
				</div>
			</div>
		</div>

		<button type="submit" class="btn btn-primary w-full btn-lg gap-2" disabled={loading}>
			{#if loading}
				<span class="loading loading-spinner loading-sm"></span>
				Creating proposal...
			{:else}
				<Zap size={18} />
				Generate Proposal with AI
			{/if}
		</button>

		<p class="text-center text-xs text-base-content/40">
			AI generation typically takes 15–30 seconds
		</p>
	</form>
</div>
