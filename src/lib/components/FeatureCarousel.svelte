<script lang="ts">
	import { Zap, FileText, Link, Clock, Shield, TrendingUp } from 'lucide-svelte';
	import Container from './Container.svelte';

	const features = [
		{
			icon: Zap,
			title: '60-Second Generation',
			desc: 'Describe your project in plain English. Claude AI generates a complete, professional proposal instantly — executive summary, scope, milestones, pricing, and terms.'
		},
		{
			icon: FileText,
			title: 'Professional Structure',
			desc: 'Every proposal follows best practices: executive summary, scope of work, out-of-scope items, milestone breakdown, pricing table, and payment terms. Clients trust it.'
		},
		{
			icon: Link,
			title: 'Shareable Client Links',
			desc: 'Send clients a beautiful, read-only link to review their proposal. No PDFs to email. Just share the link and they see a polished, branded document.'
		},
		{
			icon: Clock,
			title: 'Save 4+ Hours Per Proposal',
			desc: 'The average freelancer spends 3-8 hours writing proposals. ScopeWise does it in 60 seconds. Use that time for billable work or send 10x more proposals.'
		},
		{
			icon: Shield,
			title: 'Scope Creep Protection',
			desc: "A clear scope of work with explicit 'not included' sections means fewer disputes and change requests. Protect your time with precise, enforceable deliverables."
		},
		{
			icon: TrendingUp,
			title: 'Higher Win Rate',
			desc: 'Professional proposals signal professional service. Clients choose the consultant who sends a polished, detailed proposal — not a hasty email with a price.'
		}
	];
</script>

<div class="bg-base-200/50 py-20">
	<Container>
		<div class="text-center mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold mb-4">Everything you need to win the project</h2>
			<p class="text-base-content/60 text-lg max-w-2xl mx-auto">
				ScopeWise handles the paperwork so you can focus on the actual work.
			</p>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each features as feature}
				<div class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
					<div class="card-body">
						<div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
							<svelte:component this={feature.icon} size={20} class="text-primary" />
						</div>
						<h3 class="font-bold text-lg mb-2">{feature.title}</h3>
						<p class="text-base-content/60 text-sm leading-relaxed">{feature.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</Container>
</div>
