import { auth, username } from "./auth.js";
const postUrl = `https://api.noroff.dev/api/v1/auction/profiles/${username}/media`;

const avatarForm = document.getElementById("avatarForm");
const avatar = document.getElementById("avatar");
const avatarError = document.getElementById("avatarError");

async function changeAvatar(event) {
  event.preventDefault();
  const putBody = { avatar: avatar.value };
  const putOptions = {
    method: "PUT",
    body: JSON.stringify(putBody),
    headers: {
      Authorization: `Bearer ${auth}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(postUrl, putOptions);
    const json = await response.json();
    if (response.ok === true) {
      console.log(response);
    } else {
      avatarError.innerHTML = `${json.errors[0].message}`;
      setTimeout(function () {
        avatarError.innerHTML = "";
      }, 5000);
    }
  } catch (error) {
    avatarError.innerHTML = `Something went wrong, ${error}`;
  }
}

avatarForm.addEventListener("submit", changeAvatar);
