<script lang="ts">
	export let group: unknown;
	export let value: unknown;
	export let variant: 'slate' | 'rose';

	let id = crypto.randomUUID();
</script>

<div class="relative">
	<input type="radio" {id} class="peer absolute opacity-0" bind:group {value} />
	<label
		for={id}
		class="block rounded px-2 py-4 hover:cursor-pointer peer-checked:shadow peer-focus:ring-2 peer-focus:ring-offset-2 {variant ==
		'slate'
			? 'hover:bg-slate-100 peer-checked:bg-slate-200 peer-checked:shadow-slate-500/20 peer-focus:ring-slate-500'
			: variant == 'rose'
			? 'hover:bg-rose-100 peer-checked:bg-gradient-to-br peer-checked:from-rose-300 peer-checked:to-rose-500 peer-checked:text-slate-50 peer-focus:ring-rose-500'
			: ''}"
	>
		<slot />
	</label>
</div>
