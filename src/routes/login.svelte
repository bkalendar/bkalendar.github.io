<script>
  import { onMount } from 'svelte';

  onMount(() => {
    google.accounts.id.initialize({
      client_id: "1003739652458-kgklao4co5lrtffceqeq8ng2m7m1pde6.apps.googleusercontent.com",
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: "outline", size: "large" }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  })

  function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: ", response);
  }
</script>

<svelte:head>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<div id="buttonDiv"></div>


