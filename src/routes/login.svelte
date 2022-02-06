<script lang="ts">
  import { GapiManager } from '$lib/stores/gapi';
  import { Readable } from 'svelte/store';

  let manager: Readable<GapiManager>;
  let src;

  async function init() {
    manager = await GapiManager.getInstance();
  }
</script>

{#await init()}
  Loading
{:then}
  {#if !$manager.user.isSignedIn()}
    <button on:click={$manager.signIn}>đăng nhập</button>
  {:else}
    <img src={$manager.user.getBasicProfile().getImageUrl()} />
    <button on:click={$manager.signOut}>đăng xuất</button>
  {/if}
{/await}
