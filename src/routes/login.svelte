<script lang="ts">
  import { GapiManager } from '$lib/stores/gapi';
  import { Readable } from 'svelte/store';

  let user: Readable<User>;
  let src;

  async function init() {
    user = await GapiManager.user();
  }

  $: console.log($user);
</script>

{#await init()}
  Loading
{:then}
  {#if !$user.isSignedIn()}
    <button on:click={GapiManager.signIn}>đăng nhập</button>
  {:else}
    <img src={$user.getBasicProfile().getImageUrl()} />
    <button on:click={GapiManager.signOut}>đăng xuất</button>
  {/if}
{/await}
