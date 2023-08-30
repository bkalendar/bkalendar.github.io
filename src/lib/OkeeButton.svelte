<script lang="ts">
	export let disabled: boolean = false;
	export let variant: 'slate' | 'navy';
</script>

<button
	class="disabled:bg-gradient-none rounded px-2 py-1 font-bold active:opacity-50 enabled:bg-gradient-to-br disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 {variant ==
	'navy'
		? 'from-sky-500 to-marine-300 text-slate-50'
		: variant == 'slate'
		? 'from-slate-50 to-slate-300 text-slate-900'
		: ''}"
	{disabled}
	on:click
>
	<slot>okee</slot>
</button>
