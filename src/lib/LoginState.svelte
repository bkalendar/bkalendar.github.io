<script lang="ts">
    import type { UserStore } from './stores/user';

    export let user: UserStore;
</script>

{#if !$user.isSignedIn()}
    <button on:click={user.signIn}>đăng nhập</button>
{:else}
    <img src={$user.getBasicProfile().getImageUrl()} />
    <button on:click={user.signOut}>đăng xuất</button>
{/if}
