<script lang="ts">
  import * as Gapi from '$lib/stores/gapi';
  import { onMount, setContext } from 'svelte';
  import { Readable } from 'svelte/store';

  let user: Readable<User>;
  $: setContext('user', user);

  onMount(async () => {
    user = await Gapi.user();
  });
</script>

{#if !user}
  Loading
{:else if $user.isSignedIn()}
  <slot />
{:else}
  Please <button on:click={Gapi.signIn}>login</button>
{/if}
