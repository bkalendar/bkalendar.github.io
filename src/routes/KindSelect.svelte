<script lang="ts">
	import H2 from '$lib/H2.svelte';

	export let kind: 'sinh viên' | 'giảng viên';
</script>

<label>
	<H2>🧑 loại lịch</H2>
	<select
		bind:value={kind}
		class="mt-2 w-full rounded bg-slate-100 px-2 py-1 text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
	>
		<option value="sinh viên">sinh viên (mybk.hcmut.edu.vn)</option>
		<option value="giảng viên">giảng viên (tkb.hcmut.edu.vn)</option>
	</select>
</label>
