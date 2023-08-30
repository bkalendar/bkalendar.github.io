<script lang="ts">
	import Key from '$lib/Key.svelte';

	export let open: boolean;
</script>

<details {open}>
	<summary class="my-2 rounded bg-slate-50 px-2 py-1 font-bold text-slate-600"
		>📙 hướng dẫn chi tiết</summary
	>

	<ol class="list-inside list-decimal space-y-2">
		<li>
			vào <a
				href="https://mybk.hcmut.edu.vn/stinfo/"
				target="_blank"
				class="font-mono text-sky-500 underline">mybk/stinfo</a
			>;
		</li>
		<li>
			bấm vào ô <span class="text-sky-500"
				>thời khóa biểu <img
					src="https://mybk.hcmut.edu.vn/stinfo/public/uploads/avatars/1477389315-calendar-1.png"
					alt="thời khóa biểu"
					class="inline h-5 w-5"
				/></span
			>;
		</li>
		<li>
			nhấn <Key>Ctrl/⌘</Key>
			<Key>A</Key> rồi <Key>Ctrl/⌘</Key>
			<Key>C</Key> để copy thời khóa biểu (yes, <em>toàn bộ</em> trang luôn);
		</li>
		<li><Key>Ctrl/⌘</Key> <Key>V</Key> vào khung bên trên.</li>
		<li>đến lúc <em>Okee</em> rồi</li>
	</ol>
</details>
