class GAPI {
  
}

function initClient() {
  gapi.client.init({
      apiKey: 'AIzaSyBB2fk24uJrAXx_Q7DVPD0XdzUZ6xaFbRI',
      clientId: '1003739652458-kgklao4co5lrtffceqeq8ng2m7m1pde6.apps.googleusercontent.com',
      scope: "https://www.googleapis.com/auth/calendar"
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen((x) => console.log("signed in: ", x));
  });
}