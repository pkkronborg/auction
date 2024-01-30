const loginEmail = document.getElementById("mail");
const loginPassword = document.getElementById("password");

const loginForm = document.getElementById("login");
const loginUrl = "https://api.noroff.dev/api/v1/auction/auth/login";
const loginError = document.getElementById("loginError");

/**
 * Login a user with API POST request.
 *
 * Stores username and token in local storage.
 *
 * If login successfull navigates user to feed page.
 */
async function loginUser(event) {
  event.preventDefault();

  const email = loginEmail.value;
  const password = loginPassword.value;

  const loginData = {
    email: `${email}`,
    password: `${password}`,
  };

  const loginOption = {
    method: "POST",
    body: JSON.stringify(loginData),
    headers: {
      "Content-type": "application/json",
    },
  };
  try {
    const response = await fetch(loginUrl, loginOption);
    const json = await response.json();

    if (response.ok === true) {
      localStorage.setItem("accessToken", json.accessToken);
      localStorage.setItem("username", json.name);
      console.log("Hurra", json.name);
      window.location.href = "/index.html";
    } else {
      loginError.innerHTML = `${json.errors[0].message}`;
      setTimeout(function () {
        loginError.innerHTML = "";
      }, 5000);
    }
  } catch (error) {
    loginError.innerHTML = `Something went wrong, ${error}`;
  }
}

loginForm.addEventListener("submit", loginUser);
