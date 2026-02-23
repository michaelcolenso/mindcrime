<script lang="ts">
	import Container from './Container.svelte';
</script>

<Container>
	<div id="about" class="py-20 flex flex-col lg:flex-row gap-16 items-center">
		<div class="flex-1">
			<h2 class="text-3xl sm:text-4xl font-bold mb-6">
				Built for freelancers tired of losing time to paperwork
			</h2>
			<div class="space-y-4 text-base-content/70">
				<p>
					You got into freelancing to do great work — not to spend your Sunday nights writing
					proposals that clients never read. The average freelance developer wastes <strong
						class="text-base-content">4-8 hours per week</strong
					> on proposals, scope documents, and follow-up emails.
				</p>
				<p>
					Existing tools like Proposify and PandaDoc were built for enterprise sales teams. They're
					complex, expensive ($49-99/mo), and require managing dozens of templates. They're overkill
					for a freelancer sending 3-10 proposals a month.
				</p>
				<p>
					ScopeWise is different. Describe the project in plain English — just like you'd explain it
					to a friend. Our AI generates a complete, professional proposal in under 60 seconds. Edit
					what you need, share the link with your client, and move on to the actual work.
				</p>
			</div>
		</div>

		<div class="flex-1 space-y-4">
			<div class="stats stats-vertical shadow w-full">
				<div class="stat">
					<div class="stat-title">Average time saved per proposal</div>
					<div class="stat-value text-primary">4+ hours</div>
					<div class="stat-desc">vs. writing from scratch</div>
				</div>
				<div class="stat">
					<div class="stat-title">Proposals per month on Pro plan</div>
					<div class="stat-value text-primary">Unlimited</div>
					<div class="stat-desc">Send as many as you can win</div>
				</div>
				<div class="stat">
					<div class="stat-title">Cost per proposal on Pro plan</div>
					<div class="stat-value text-primary">&lt;$1</div>
					<div class="stat-desc">At $39/mo across 50 proposals</div>
				</div>
			</div>
		</div>
	</div>
</Container>
