const logOutButton = document.getElementById("logOut");

function logoutUser() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("username");
  console.log(localStorage.getItem("accessToken"));
  console.log(localStorage.getItem("username"));
  window.location.href = "/index.html";
}

logOutButton.addEventListener("click", logoutUser);
