<script lang="ts">
	import Container from './Container.svelte';

	const faqs = [
		{
			question: 'How does ScopeWise generate proposals?',
			answer:
				'You fill in a short form: project type, client name, project description, budget range, and timeline. Our AI (Claude by Anthropic) reads your input and generates a complete, structured proposal with an executive summary, full scope of work, deliverables, milestone plan, pricing breakdown, and payment terms. The whole process takes under 60 seconds.'
		},
		{
			question: 'Can I edit the generated proposal?',
			answer:
				'Absolutely. After generation, you can edit any section of the proposal directly in the browser. The AI gives you a strong starting point, and you refine it to match your voice and the specifics of the project.'
		},
		{
			question: 'How do I share the proposal with my client?',
			answer:
				'Every proposal gets a unique, shareable link. Click "Copy Share Link" and send it to your client. They see a clean, professional read-only view — no login required. You can also print to PDF directly from the browser.'
		},
		{
			question: "What's included in the Free plan?",
			answer:
				'The Free plan lets you generate 2 proposals — enough to try the product and send your first proposal. After that, upgrade to Starter ($19/mo) for 20 proposals/month, or Pro ($39/mo) for unlimited proposals.'
		},
		{
			question: 'What types of projects work best with ScopeWise?',
			answer:
				'ScopeWise works great for web development, mobile apps, UI/UX design, digital marketing, SEO, content strategy, and general consulting. The more specific your description, the better the output. Mention specific technologies, features, and integrations.'
		},
		{
			question: 'Do my clients need a ScopeWise account?',
			answer:
				'No. Clients access proposals through a unique shareable link — no sign-up, no login, no friction. They just click and see the proposal.'
		},
		{
			question: 'Can I cancel my subscription at any time?',
			answer:
				'Yes. Cancel anytime from your account settings. You keep access until the end of your current billing period. No long-term contracts, no cancellation fees.'
		}
	];
</script>

<Container>
	<div id="faq" class="max-w-3xl mx-auto py-20">
		<div class="text-center mb-12">
			<div class="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</div>
			<div class="mt-3 text-base-content/60 text-lg">
				Everything you need to know about ScopeWise.
			</div>
		</div>
		<div class="join join-vertical w-full">
			{#each faqs as faq}
				<div class="collapse collapse-arrow join-item border border-base-200">
					<input type="radio" name="accordion" />
					<div class="collapse-title text-lg font-medium">
						{faq.question}
					</div>
					<div class="collapse-content text-base-content/70">
						<p>{faq.answer}</p>
					</div>
				</div>
			{/each}
		</div>
		<div class="text-center mt-10">
			<p class="text-base-content/60">
				Still have questions? Email us at <a
					href="mailto:hello@scopewise.app"
					class="link link-primary">hello@scopewise.app</a
				>
			</p>
		</div>
	</div>
</Container>
