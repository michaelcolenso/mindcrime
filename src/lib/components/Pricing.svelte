<script lang="ts">
	import { Check, X, Zap } from 'lucide-svelte';
	import Container from './Container.svelte';

	const plans = [
		{
			name: 'Free',
			price: '$0',
			period: 'forever',
			description: 'Try ScopeWise with no commitment.',
			cta: 'Get started free',
			ctaHref: '/login',
			primary: false,
			features: [
				{ text: '2 proposals', included: true },
				{ text: 'AI-generated scope of work', included: true },
				{ text: 'Shareable client links', included: true },
				{ text: 'PDF export via print', included: true },
				{ text: '20 proposals/month', included: false },
				{ text: 'Unlimited proposals', included: false }
			]
		},
		{
			name: 'Starter',
			price: '$19',
			period: '/month',
			description: 'Perfect for freelancers with regular clients.',
			cta: 'Start Starter plan',
			ctaHref: '/login',
			primary: false,
			priceId: 'starter',
			features: [
				{ text: '20 proposals/month', included: true },
				{ text: 'AI-generated scope of work', included: true },
				{ text: 'Shareable client links', included: true },
				{ text: 'PDF export via print', included: true },
				{ text: 'Proposal status tracking', included: true },
				{ text: 'Unlimited proposals', included: false }
			]
		},
		{
			name: 'Pro',
			price: '$39',
			period: '/month',
			description: 'For busy freelancers and small agencies.',
			cta: 'Start Pro plan',
			ctaHref: '/login',
			primary: true,
			priceId: 'pro',
			badge: 'Most popular',
			features: [
				{ text: 'Unlimited proposals', included: true },
				{ text: 'AI-generated scope of work', included: true },
				{ text: 'Shareable client links', included: true },
				{ text: 'PDF export via print', included: true },
				{ text: 'Proposal status tracking', included: true },
				{ text: 'Priority support', included: true }
			]
		}
	];
</script>

<Container>
	<div id="pricing" class="py-20">
		<div class="text-center mb-16">
			<h2 class="text-base font-semibold text-primary mb-2">Pricing</h2>
			<div class="text-3xl sm:text-4xl font-bold mb-4">Simple, transparent pricing</div>
			<p class="text-base-content/60 text-lg max-w-xl mx-auto">
				Start free. Upgrade when you're ready. Cancel anytime.
			</p>
		</div>

		<div class="flex flex-wrap justify-center gap-8">
			{#each plans as plan}
				<div
					class="card w-80 shadow-xl {plan.primary
						? 'ring-2 ring-primary bg-base-100'
						: 'ring-1 ring-base-200 bg-base-100'} relative"
				>
					{#if plan.badge}
						<div
							class="absolute top-4 right-4 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary flex items-center gap-1"
						>
							<Zap size={10} />
							{plan.badge}
						</div>
					{/if}
					<div class="card-body p-8">
						<h3 class="text-xl font-extrabold mb-1">{plan.name}</h3>
						<div class="flex items-baseline gap-1 mb-1">
							<span class="text-5xl font-extrabold">{plan.price}</span>
							<span class="text-base-content/60 font-medium">{plan.period}</span>
						</div>
						<p class="text-base-content/60 text-sm mb-6">{plan.description}</p>

						<ul class="space-y-2 mb-8 flex-1">
							{#each plan.features as feature}
								<li class="flex items-center gap-2">
									{#if feature.included}
										<Check size={16} class="text-primary shrink-0" />
										<span class="text-sm">{feature.text}</span>
									{:else}
										<X size={16} class="text-base-content/30 shrink-0" />
										<span class="text-sm text-base-content/40 line-through">{feature.text}</span>
									{/if}
								</li>
							{/each}
						</ul>

						<a
							href={plan.ctaHref}
							class="btn {plan.primary ? 'btn-primary' : 'btn-outline'} w-full"
						>
							{plan.cta}
						</a>
					</div>
				</div>
			{/each}
		</div>

		<div class="text-center mt-12 text-base-content/50 text-sm">
			All plans include a 7-day money-back guarantee. Prices in USD.
		</div>
	</div>
</Container>
