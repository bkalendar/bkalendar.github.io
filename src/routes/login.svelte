<script lang="ts">
    import { load, signOut } from "$lib/stores/gapi";

    import { signIn, user } from "$lib/stores/user";
</script>

{#await load()}
    Loading
{:then}
    {#if !$user.isSignedIn()}
        <button on:click={signIn}>đăng nhập</button>
    {:else}
        <img src={$user.getBasicProfile().getImageUrl()} />
        <button on:click={signOut}>đăng xuất</button>
    {/if}
{/await}
