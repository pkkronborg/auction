import { auth } from "./auth.js";
const postUrl = "https://api.noroff.dev/api/v1/auction/listings";

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
  field.type = "text";
  field.className = "form-control rounded-0 pictures";
  field.id = `gallery${inputs}`;

  galleryInputs.appendChild(fieldLabel);
  galleryInputs.appendChild(field);
}

addFields.addEventListener("click", addGalleryInputs);

// Post listing

const createForm = document.getElementById("createForm");
const createButton = document.getElementById("createButton");
const title = document.getElementById("title");
const description = document.getElementById("description");
const endsAt = document.getElementById("endsAt");
const createError = document.getElementById("createError");
const titleMessage = document.getElementById("titleMessage");
const mediaMessage = document.getElementById("mediaMessage");

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
