<script lang="ts">
  import { GapiManager } from '$lib/stores/gapi';
  import { onMount, setContext } from 'svelte';
  import { Readable } from 'svelte/store';

  let user: Readable<User>;
  $: setContext('user', user);

  onMount(async () => {
    user = await GapiManager.user();
  });
</script>

{#if !user}
  Loading
{:else if $user.isSignedIn()}
  <slot />
{:else}
  Please <button on:click={GapiManager.signIn}>login</button>
{/if}
