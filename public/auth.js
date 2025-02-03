const url = "http://localhost:3000";
let isSignUp = true;

document.addEventListener("DOMContentLoaded", () => {
  const authHeading = document.getElementById("auth-heading");
  const authBtn = document.getElementById("auth-btn");
  const toggleAuthBtn = document.getElementById("toggle-auth");

  toggleAuthBtn.addEventListener("click", () => {
    isSignUp = !isSignUp;
    authHeading.textContent = isSignUp ? "Sign Up" : "Sign In";
    authBtn.textContent = isSignUp ? "Sign Up" : "Sign In";
    toggleAuthBtn.textContent = isSignUp
      ? "Switch to Sign In"
      : "Switch to Sign Up";
  });

  authBtn.addEventListener("click", authentication);
});

function authentication() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username.length < 3) {
    alert("Username must be at least 3 characters.");
    return;
  }
  if (password.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  if (isSignUp) {
    sendSignUpRequest(username, password);
  } else {
    sendSignInRequest(username, password);
  }
}

function sendSignUpRequest(username, password) {
  axios
    .post(`${url}/signup`, { username, password })
    .then((response) => {
      console.log("Signup response:", response.data);
      alert("Registration successful! Please sign in.");      
      document.getElementById("toggle-auth").click();
    })
    .catch((error) => {
      console.error("Signup error:", error.response?.data || error.message);
      alert("Registration failed. Please try again.");
    });
}

async function sendSignInRequest(username, password) {
  try {
    const response = await axios.post(`${url}/signin`, { username, password });
    if (!response.data.token) {
      console.error("Token missing in response!");
      alert("Login failed: Token not received.");
      return;
    }
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("username", response.data.username);
    console.log("Login successful, redirecting...");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    alert("Login failed. Please check your credentials.");
  }
}
