<script lang="ts">
	import { FileText } from 'lucide-svelte';
	import { PUBLIC_PROJECT_NAME } from '$env/static/public';
</script>

<footer class="footer p-10 bg-base-200 text-base-content">
	<aside>
		<div class="flex items-center gap-2">
			<FileText class="h-6 w-6 text-primary" />
			<div class="text-xl font-bold">{PUBLIC_PROJECT_NAME}</div>
		</div>
		<p class="text-base-content/60 max-w-xs">
			AI-powered project proposals for freelancers and independent consultants.
		</p>
	</aside>

	<nav>
		<h6 class="footer-title">Product</h6>
		<a class="link link-hover" href="/#features">Features</a>
		<a class="link link-hover" href="/#pricing">Pricing</a>
		<a class="link link-hover" href="/#faq">FAQ</a>
		<a class="link link-hover" href="/dashboard">Dashboard</a>
	</nav>

	<nav>
		<h6 class="footer-title">Legal</h6>
		<a class="link link-hover" href="/terms-of-use">Terms of use</a>
		<a class="link link-hover" href="/privacy-policy">Privacy policy</a>
		<a class="link link-hover" href="mailto:hello@scopewise.app">Contact</a>
	</nav>

	<div>
		<h6 class="footer-title">Get Started</h6>
		<a href="/login" class="btn btn-primary btn-sm">Create free account</a>
		<p class="text-xs text-base-content/50 mt-2">2 proposals free · No credit card required</p>
	</div>
</footer>
