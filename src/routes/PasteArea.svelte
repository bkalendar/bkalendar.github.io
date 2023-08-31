<script lang="ts">
	export let raw: string;
</script>

<textarea
	bind:value={raw}
	placeholder="📋 dán vào đây"
	class="mt-5 h-32 w-full rounded bg-transparent p-2 text-xs placeholder-slate-400 outline-dashed outline-[1.5px] outline-slate-200 placeholder:text-center placeholder:text-base placeholder:font-light placeholder:leading-[7rem] focus:outline-slate-500"
/>
