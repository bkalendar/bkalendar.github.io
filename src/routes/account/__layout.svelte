<script lang="ts">
  import { GapiManager } from '$lib/stores/gapi';
  import { onMount, setContext } from 'svelte';
  import { Readable } from 'svelte/store';

  let manager: Readable<GapiManager>;
  $: setContext('manager', manager);

  onMount(async () => {
    manager = await GapiManager.getInstance();
  });
</script>

{#if !manager}
  Loading
{:else if $manager.user.isSignedIn()}
  <slot />
{:else}
  Please <button on:click={$manager.signIn}>login</button>
{/if}
