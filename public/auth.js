const url = "http://localhost:3000";

let isSignUp = true;

function toggleAuthMode() {
  isSignUp = !isSignUp;
  document.getElementById("auth-mode-label").textContent = isSignUp
    ? "Sign Up"
    : "Sign In";
  document.querySelector("h2").textContent = isSignUp ? "Sign Up" : "Sign In";
  document.querySelector(".toggle-auth-mode-btn").textContent = isSignUp
    ? "Switch to Sign In"
    : "Switch to Sign Up";
}

function authentication() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username.length < 3) {
    alert("Username must be at least 3 characters.");
    return;
  }

  if (password.length < 3) {
    alert("Passsword must be at least 3 characters.");
    return;
  }

  if (isSignUp) {
    sendSingUpRequest(username, password);
  } else {
    sendSignInRequest(username, password);
  }
}

function sendSingUpRequest(username, password) {
  axios
    .post(`${url}/signup`, {
      username: username,
      password: password,
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function sendSignInRequest(username, password) {
  axios
    .post("http://localhost:3000/signin", {
      username: username,
      password: password,
    })
    .then((response) => {
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      console.log("Token and username stored successfully!");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
      alert("Login failed. Please check your credentials.");
    });
}
