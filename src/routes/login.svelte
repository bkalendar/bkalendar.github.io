<script lang="ts">
  import { onMount } from 'svelte';

  let loaded = false;

  function onLoad() {
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey: 'AIzaSyBB2fk24uJrAXx_Q7DVPD0XdzUZ6xaFbRI',
        clientId:
          '1003739652458-kgklao4co5lrtffceqeq8ng2m7m1pde6.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/calendar',
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
      });
      loaded = true;

      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }

  function login() {
    gapi.auth2.getAuthInstance().signIn()
  }

  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      console.log("signed in")
      makeApiCall()
    } else {
      console.log("nope, who are you?")
    }
  }

  async function makeApiCall() {
    let response = await gapi.client.calendar.calendarList.list();
    console.log(response.result.items.find((calendar) =>
      calendar.summary == "HK212.2"
    ));
  }
</script>

<svelte:head>
  <script
    async
    defer
    src="https://apis.google.com/js/api.js"
    on:load|once={onLoad}></script>
</svelte:head>

{#if loaded}
  <button on:click={login}>Login with Google</button>
{/if}
