<script lang="ts">
	import { PUBLIC_PROJECT_NAME } from '$env/static/public';
	import { tick } from 'svelte';
	import Google from '$lib/components/icons/Google.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { Mail, FileText } from 'lucide-svelte';

	const { data } = $props();

	let email_input: HTMLInputElement | null = $state(null);
	let show_email_input = $state(false);
	let email_sent = $state(false);

	const { enhance, errors, submitting } = superForm(data.form, {
		onResult(event) {
			if (event.result.type === 'success') {
				email_sent = true;
			}
		}
	});

	const handleEmail = async () => {
		if (!show_email_input && email_input) {
			show_email_input = true;
			await tick();
			email_input.focus();
		}
	};
</script>

<svelte:head>
	<title>Sign in — {PUBLIC_PROJECT_NAME}</title>
	<meta name="description" content="Sign in to generate AI-powered project proposals in 60 seconds." />
</svelte:head>

<div class="flex p-5 items-center justify-center min-h-screen">
	<div class="card bg-base-100 shadow-xl ring-1 ring-base-200 p-8 flex flex-col w-full max-w-md">
		{#if email_sent}
			<div class="text-center">
				<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
					<Mail size={24} class="text-primary" />
				</div>
				<div class="text-2xl font-bold mb-3">Check your inbox</div>
				<div class="text-base-content/60 text-base max-w-[32ch] mx-auto">
					We sent you a magic link. Click it to sign in instantly — no password needed.
				</div>
				<p class="text-xs text-base-content/40 mt-4">Check your spam folder if you don't see it.</p>
			</div>
		{:else}
			<div class="mb-6 text-center">
				<a href="/" class="inline-flex items-center gap-2 mb-6">
					<FileText class="text-primary" size={24} />
					<span class="text-xl font-bold">{PUBLIC_PROJECT_NAME}</span>
				</a>
				<div class="text-2xl font-bold mb-1">
					{data.user ? 'Welcome back' : 'Get started free'}
				</div>
				<p class="text-base-content/60 text-sm">
					{data.user ? 'You are already signed in.' : '2 proposals free. No credit card required.'}
				</p>
			</div>

			{#if data.user}
				<a href="/dashboard" class="btn btn-primary font-semibold text-md w-full">
					Go to Dashboard
				</a>
				<p class="text-center text-sm text-base-content/50 mt-3">
					Signed in as {data.user.email}
				</p>
				<form method="post" action="/login?/signout" class="mt-3">
					<button type="submit" class="btn btn-ghost text-sm w-full text-error">
						Sign out
					</button>
				</form>
			{:else}
				<a href="/login/google" class="btn btn-primary font-semibold text-md w-full gap-2">
					<Google class="w-4" />Continue with Google
				</a>

				<div class="divider text-xs text-base-content/40">or</div>

				<form method="post" action="/login?/login_with_email" use:enhance>
					<input
						bind:this={email_input}
						placeholder="your@email.com"
						type="email"
						name="email"
						class="input input-bordered w-full mb-3"
						class:hidden={!show_email_input}
					/>
					{#if $errors.email}
						<span class="text-red-500 text-xs mb-2 block">{$errors.email}</span>
					{/if}

					{#if show_email_input}
						<button type="submit" disabled={$submitting} class="btn btn-outline w-full">
							{#if $submitting}
								<span class="loading loading-spinner loading-xs mr-2"></span>
							{/if}
							Send magic link
						</button>
					{:else}
						<button onclick={handleEmail} type="button" class="btn btn-outline w-full">
							Continue with email
						</button>
					{/if}
				</form>

				<p class="text-xs text-center text-base-content/40 mt-6">
					By signing up, you agree to our
					<a href="/terms-of-use" class="link">Terms</a> and
					<a href="/privacy-policy" class="link">Privacy Policy</a>.
				</p>
			{/if}
		{/if}
	</div>
</div>
