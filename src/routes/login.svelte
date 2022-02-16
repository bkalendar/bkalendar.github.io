<script lang="ts">
  import * as Gapi from '$lib/stores/gapi';
  import { Readable } from 'svelte/store';

  let user: Readable<User>;
  let src;

  async function init() {
    user = await Gapi.user();
  }

  $: console.log($user);
</script>

{#await init()}
  Loading
{:then}
  {#if !$user.isSignedIn()}
    <button on:click={Gapi.signIn}>đăng nhập</button>
  {:else}
    <img src={$user.getBasicProfile().getImageUrl()} />
    <button on:click={Gapi.signOut}>đăng xuất</button>
  {/if}
{/await}
