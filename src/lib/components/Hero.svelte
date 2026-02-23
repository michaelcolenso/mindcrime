<script lang="ts">
	import { Zap, ArrowRight } from 'lucide-svelte';
	import Container from './Container.svelte';
</script>

<Container>
	<div class="flex flex-col lg:flex-row py-12 sm:py-24 gap-12 items-center">
		<div class="flex-1">
			<div
				class="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full mb-6"
			>
				<Zap size={14} />
				AI-Powered · 60 seconds
			</div>
			<h1 class="text-4xl sm:text-6xl font-bold leading-tight">
				Win more clients with<br />
				<span class="text-primary">proposals that close</span>
			</h1>
			<p class="mt-6 text-lg text-base-content/70 max-w-xl">
				Stop spending hours on proposals that go nowhere. ScopeWise uses AI to generate
				professional project proposals, scope-of-work documents, and pricing in under 60 seconds.
			</p>
			<div class="mt-8 flex flex-col sm:flex-row gap-4">
				<a href="/login" class="btn btn-primary btn-lg gap-2">
					Generate your first proposal free
					<ArrowRight size={18} />
				</a>
				<a href="#pricing" class="btn btn-ghost btn-lg">See pricing</a>
			</div>
			<p class="mt-4 text-sm text-base-content/50">
				No credit card required · 2 proposals free forever
			</p>
		</div>

		<div class="flex-1 w-full max-w-lg">
			<div class="card shadow-2xl bg-base-100 ring-2 ring-base-200">
				<div class="card-body p-6">
					<div class="flex items-center gap-2 mb-4">
						<div class="w-3 h-3 rounded-full bg-red-400"></div>
						<div class="w-3 h-3 rounded-full bg-yellow-400"></div>
						<div class="w-3 h-3 rounded-full bg-green-400"></div>
						<span class="text-xs text-base-content/40 ml-2">scopewise.app</span>
					</div>
					<div class="space-y-3">
						<div class="bg-primary/10 rounded-lg p-4">
							<p class="text-xs text-primary font-semibold uppercase tracking-wide mb-1">
								Project Brief
							</p>
							<p class="text-sm text-base-content/80">
								"Build an e-commerce site for my boutique clothing store. Need product pages,
								shopping cart, Stripe payments, and a simple CMS."
							</p>
						</div>
						<div class="flex items-center justify-center py-1">
							<div class="flex items-center gap-2 text-primary text-sm font-medium">
								<Zap size={16} class="animate-pulse" />
								Generating proposal...
							</div>
						</div>
						<div class="bg-base-200 rounded-lg p-4 space-y-2">
							<p class="text-xs font-bold text-base-content/60 uppercase tracking-wide">
								ScopeWise Proposal
							</p>
							<p class="text-sm font-semibold">Boutique E-Commerce Platform — $8,500</p>
							<div class="space-y-1">
								{#each ['✓ Executive Summary', '✓ Full Scope of Work', '✓ 4-Phase Milestone Plan', '✓ Pricing Breakdown', '✓ Payment Terms'] as item}
									<p class="text-xs text-base-content/70">{item}</p>
								{/each}
							</div>
							<div class="flex gap-2 mt-3">
								<span class="badge badge-success badge-sm">Ready to send</span>
								<span class="badge badge-ghost badge-sm">Share link</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="pb-12 flex flex-col items-center">
		<p class="text-sm text-base-content/50 mb-4">Built for independent creators</p>
		<div class="flex flex-wrap justify-center gap-6 text-base-content/40 text-sm">
			<span>Web Developers</span>
			<span>·</span>
			<span>UI/UX Designers</span>
			<span>·</span>
			<span>Digital Marketers</span>
			<span>·</span>
			<span>Dev Agencies</span>
		</div>
	</div>
</Container>
