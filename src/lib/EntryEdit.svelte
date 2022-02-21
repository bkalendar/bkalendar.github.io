<script lang="ts">
    import type { EntryResolved } from "./entry";
    import { getEventColorsList } from "$lib/stores/colors";

    export let entry: EntryResolved;

    let name = entry.name;
    $: entry.name = name;

    const colors = getEventColorsList();

    $: color = colors[entry.colorId];
</script>

<div class="flex items-stretch">
    <div class="mr-2 w-full space-y-2">
        <div class="flex w-full items-center space-x-2">
            <div
                class="h-6 w-6 rounded-sm shadow-sm shadow-blue/20"
                style:background-color={color.background}
            />
            <input
                type="text"
                class="h-8 w-full rounded-md border-2 border-dashed px-2 py-1 outline-none focus:border-blue"
                placeholder="Tên môn"
                bind:value={name}
            />
        </div>
        <div class="flex items-center space-x-2">
            <!-- prettier-ignore -->
            <svg class="h-4 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 87.5 72"><path fill="#00832d" d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z"/><path fill="#0066da" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z"/><path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z"/><path fill="#2684fc" d="M20.5 20.5H0v31h20.5z"/><path fill="#00ac47" d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z"/><path fill="#ffba00" d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z"/></svg>
            <input
                type="text"
                class="h-8 w-full rounded-md border-2 border-dashed px-2 py-1 outline-none focus:border-blue"
                placeholder="Link Google Meet"
            />
        </div>
        <div class="flex items-start space-x-2">
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            <textarea
                type="text"
                class="w-full rounded-md border-2 border-dashed px-2 py-1 outline-none focus:border-blue"
                rows="2"
                placeholder="Ghi chú"
            />
        </div>
    </div>
    <div
        class="w-48 rounded-md p-2"
        style:background-color={color.background}
        style:color={color.foreground}
    >
        <p>{name}</p>
        <p>{entry.start + 5}h – {entry.end + 6}h</p>
    </div>
</div>
