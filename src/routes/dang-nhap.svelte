<script lang="ts" context="module">
    export const load: Load = ({ session }) => {
        return {
            props: {
                accessToken: session.accessToken,
            },
        };
    };
</script>

<script lang="ts">
    export let accessToken: string | undefined;
</script>

{accessToken}
