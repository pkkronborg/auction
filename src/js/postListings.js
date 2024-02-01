import { auth, username } from "./auth.js";
const postUrl = "https://api.noroff.dev/api/v1/auction/listings";

const registerButton = document.getElementById("register");
const logInButton = document.getElementById("logIn");
const logOutButton = document.getElementById("logOut");
const navSell = document.getElementById("navSell");
const navProfile = document.getElementById("navProfile");

function isLogedIn() {
  if (auth && username) {
    registerButton.style.display = "none";
    logInButton.style.display = "none";
  } else {
    logOutButton.style.display = "none";
    navSell.style.display = "none";
    navProfile.style.display = "none";
  }
}

isLogedIn();

const addFields = document.getElementById("addFields");
const galleryInputs = document.getElementById("galleryInputs");
let inputs = 0;

function addGalleryInputs() {
  inputs += 1;
  const fieldLabel = document.createElement("label");
  fieldLabel.className = "form-label";
  fieldLabel.htmlFor = `gallery${inputs}`;
  fieldLabel.innerHTML = `Picture ${inputs}`;
  const field = document.createElement("input");
  field.type = "url";
  field.className = "form-control rounded-0 pictures";
  field.id = `gallery${inputs}`;

  galleryInputs.appendChild(fieldLabel);
  galleryInputs.appendChild(field);
}

addFields.addEventListener("click", addGalleryInputs);

// Post listing

const createForm = document.getElementById("createForm");
const title = document.getElementById("title");
const description = document.getElementById("description");
const endsAt = document.getElementById("endsAt");

// Min and max date and time for endsAt date
const todayDate = new Date();
endsAt.min = todayDate.toISOString().slice(0, 16);

// max date is set to one month from today, to avoid long auction
const maxDate = new Date(todayDate);
maxDate.setMonth(todayDate.getMonth() + 1);
endsAt.max = maxDate.toISOString().slice(0, 16);

const createError = document.getElementById("createError");

/**
 * Create a listing with API POST request
 *
 * Input from creat form.
 *
 * Function runs when submiting form.
 *
 *  @example
 * * ```js
 * // From submit form
 * title
 * description
 * media
 * date ends
 * // method post with autorization header
 * ```
 */
async function createListings(event) {
  event.preventDefault();
  const pictures = document.querySelectorAll(".pictures");
  mediaMessage.innerHTML = "";
  let pictureArray = [];
  for (let picture of pictures) {
    if (picture.value) {
      pictureArray.push(picture.value);
    }
  }
  const listingsData = {
    title: title.value,
    description: description.value,
    media: pictureArray,
    endsAt: endsAt.value,
  };
  const postOptions = {
    method: "POST",
    body: JSON.stringify(listingsData),
    headers: {
      Authorization: `Bearer ${auth}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(postUrl, postOptions);
    const json = await response.json();
    if (response.ok === true) {
      console.log(response);
      window.location.href = `/detail.html?id=${json.id}`;
    } else {
      createError.innerHTML = `${json.errors[0].message}`;
      setTimeout(function () {
        createError.innerHTML = "";
      }, 5000);
    }
  } catch (error) {
    createError.innerHTML = `Something went wrong, ${error}`;
  }
}

createForm.addEventListener("submit", createListings);
