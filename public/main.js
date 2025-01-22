const url = "http://localhost:3000";

function sendSingUpRequest() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

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
