<script lang="ts">
  import * as Gapi from '$lib/stores/gapi';
</script>

{#await Gapi.getCalendarList() then list}
  {#each list.items as item}
    <div class="mt-4 space-y-2">
      <p>Summary: {item.summary}</p>
      <p>Id: {item.id}</p>
    </div>
  {/each}
{/await}