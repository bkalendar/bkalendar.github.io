<script lang="ts">
	export let disabled: boolean;
</script>

<button
	class="disabled:bg-gradient-none rounded from-sky-500 to-marine-300 px-2 py-1
		font-bold text-slate-50 enabled:bg-gradient-to-br disabled:cursor-not-allowed disabled:bg-slate-200
		disabled:text-slate-500"
	{disabled}
	on:click
>
	okee
</button>
