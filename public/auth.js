const url = "http://localhost:3000";

let isSignUp = true;

function toggleAuthMode() {
  isSignUp = !isSignUp;
  document.getElementById("auth-mode-label").textContent = isSignUp
    ? "Sign Up"
    : "Sign In";
}

function sendSingUpRequest() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  axios
    .post(`${url}/${isSignUp ? 'signup' : 'signin'}`, {
      username: username,
      password: password,
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

    toggleAuthMode();
}


