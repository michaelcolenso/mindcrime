<script lang="ts">
	import { CheckCircle } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Payment Successful — ScopeWise</title>
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-screen text-center px-4">
	<div class="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-6">
		<CheckCircle size={32} class="text-success" />
	</div>
	<h1 class="text-3xl font-bold mb-3">You're all set!</h1>
	<p class="text-base-content/60 max-w-sm mb-8">
		Your subscription is now active. You can start generating unlimited proposals right away.
	</p>
	<a href="/dashboard" class="btn btn-primary btn-lg">Go to Dashboard</a>
</div>
