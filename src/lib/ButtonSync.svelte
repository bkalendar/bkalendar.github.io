<script lang="ts">
    import Select from "svelte-select";
    import CalendarIcon from "$lib/CalendarIcon.svelte";
    import { load, signIn } from "$lib/stores/gapi";

    import type { UserStore } from "./stores/user";
    import type { Calendar, CalendarStore } from "./stores/calendar_list";

    export let user: UserStore;
    export let selected: CalendarStore;
    export let calendars: Calendar[];
</script>

<div class="flex items-center justify-center space-x-4">
    {#if !$user.isSignedIn()}
        <button
            class="flex h-9 items-center space-x-3 overflow-hidden rounded-md bg-blue pr-3 font-bold text-white shadow-md shadow-blue/20 outline-none active:shadow-none"
            on:click={signIn}
        >
            <div class="h-9 bg-white p-2">
                <!-- prettier-ignore -->
                <svg class="h-full w-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
            </div>
            <span>Đăng nhập</span>
        </button>
    {:else}
        <div class="relative w-56">
            <label class="absolute left-2 -top-6 text-sm" for="calendar-select">
                Chọn lịch để thêm vào
            </label>
            <Select
                bind:value={$selected}
                items={calendars}
                labelIdentifier="summary"
                optionIdentifier="id"
                Icon={CalendarIcon}
                inputAttributes={{ id: "calendar-select" }}
                showChevron={true}
                --borderRadius="6px"
                --selectedItemPadding="0 0 0 0.5rem"
                --inputPadding="0 10px 0 40px"
                --padding="0 1.5rem 0 0.5rem"
            />
        </div>
        <button
            class="flex h-9 items-center space-x-3 overflow-hidden rounded-md bg-blue pr-3 font-bold text-white shadow-md shadow-blue/20 active:shadow-none outline-none"
        >
            <div class="h-9 bg-white p-2">
                <!-- prettier-ignore -->
                <svg class="h-full w-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
            </div>
            <span>Đồng bộ</span>
        </button>
    {/if}
</div>

<style lang="postcss">
    :root {
        --itemIsActiveBG: theme("colors.blue.DEFAULT");
        --borderFocusColor: theme("colors.blue.DEFAULT");
    }
</style>
