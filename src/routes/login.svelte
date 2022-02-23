<script lang="ts">
    import LoginState from "$lib/LoginState.svelte";

    import { userPromise } from "$lib/stores/user";
</script>

{#await userPromise}
    Loading
{:then user}
    <LoginState {user} />
{/await}
