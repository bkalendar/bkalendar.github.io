<script lang="ts">
    import { getEventColorsList } from "./stores/colors";

    const colors = getEventColorsList();

    export let color: string;
</script>

<select bind:value={color}>
    {#each Object.entries(colors) as [id, color]}
        <option
            style:background-color={color.background}
            style:color={color.foreground}
            value={id}
        >
            {id}
        </option>
    {/each}
</select>
